/**
 * POST /api/chat
 * Streaming Ask Sembli chat endpoint.
 *
 * Request:  { conversationId: string | null; homeId: string; message: string }
 * Response: Server-Sent Events stream
 *   data: {"type":"text","delta":"..."}\n\n
 *   data: {"type":"tool_start","toolName":"..."}\n\n
 *   data: {"type":"tool_end","toolName":"...","result":"..."}\n\n
 *   data: {"type":"done"}\n\n
 *   data: {"type":"error","message":"..."}\n\n
 */

import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'
import { anthropic, MODELS } from '@/lib/anthropic'
import { buildChatContext } from '@/lib/ai/chat-context'
import { CHAT_TOOLS, executeTool } from '@/lib/ai/chat-tools'
import { NextResponse, type NextRequest } from 'next/server'
import type Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

// Simple in-memory rate limit: 30 msg/hr per user
const rateLimits = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 30) return false
  entry.count++
  return true
}

function sseEvent(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(user.id)) {
    return NextResponse.json({ error: 'Rate limit reached — try again in an hour.' }, { status: 429 })
  }

  // Paywall: AI chat requires Pro
  const entitlements = await getEntitlements(user.id)
  if (!entitlements.canUseAI) {
    return NextResponse.json(
      { error: 'AI chat requires a Pro subscription. Upgrade at /upgrade.' },
      { status: 403 }
    )
  }

  let body: { conversationId: string | null; homeId: string; message: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { conversationId: incomingConvId, homeId, message } = body
  if (!homeId || !message?.trim()) {
    return NextResponse.json({ error: 'homeId and message are required' }, { status: 400 })
  }

  // Verify user has access to this home
  const { data: hasAccess } = await supabase.rpc('user_has_home_access', { p_home_id: homeId })
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Load or create conversation
  let conversationId = incomingConvId
  if (!conversationId) {
    const title = message.slice(0, 80)
    const { data: conv, error } = await supabase
      .from('conversations')
      .insert({ home_id: homeId, user_id: user.id, title })
      .select('id')
      .single()
    if (error || !conv) {
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }
    conversationId = conv.id
  }

  // Persist user message
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: message,
  })

  // Load conversation history (last 40 messages for context window efficiency)
  const { data: history } = await supabase
    .from('messages')
    .select('role, content, tool_use_id, tool_name')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(40)

  // Build Anthropic message array from history
  const claudeMessages: Anthropic.MessageParam[] = []
  for (const msg of history ?? []) {
    if (msg.role === 'user') {
      claudeMessages.push({ role: 'user', content: msg.content })
    } else if (msg.role === 'assistant') {
      claudeMessages.push({ role: 'assistant', content: msg.content })
    } else if (msg.role === 'tool_result' && msg.tool_use_id) {
      // Tool results need to be appended to the LAST user turn as a user message
      // (Anthropic API: tool_result blocks go in user messages)
      claudeMessages.push({
        role: 'user',
        content: [{ type: 'tool_result', tool_use_id: msg.tool_use_id, content: msg.content }],
      })
    }
  }

  // Build system prompt with home context
  let systemPrompt: string
  try {
    const ctx = await buildChatContext(homeId)
    systemPrompt = ctx.systemPrompt
  } catch {
    return NextResponse.json({ error: 'Failed to load home context' }, { status: 500 })
  }

  // Stream response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(sseEvent(data)))

      try {
        send({ type: 'conversation_id', conversationId })

        let fullAssistantText = ''
        let continueLoop = true

        // Agentic loop: handle tool calls until Claude stops
        while (continueLoop) {
          const response = anthropic.messages.stream({
            model: MODELS.OPUS,
            max_tokens: 1024,
            system: systemPrompt,
            tools: CHAT_TOOLS,
            messages: claudeMessages,
          })

          const toolUseBlocks: Anthropic.ToolUseBlock[] = []
          let currentToolName = ''
          let textBuffer = ''

          for await (const event of response) {
            if (event.type === 'content_block_start') {
              if (event.content_block.type === 'tool_use') {
                currentToolName = event.content_block.name
                send({ type: 'tool_start', toolName: currentToolName })
              }
            } else if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                textBuffer += event.delta.text
                fullAssistantText += event.delta.text
                send({ type: 'text', delta: event.delta.text })
              }
            } else if (event.type === 'message_delta') {
              if (event.delta.stop_reason === 'end_turn') continueLoop = false
              if (event.delta.stop_reason === 'tool_use') continueLoop = true
            } else if (event.type === 'message_stop') {
              // Collect tool use blocks from the final message
              const finalMsg = await response.finalMessage()
              for (const block of finalMsg.content) {
                if (block.type === 'tool_use') {
                  toolUseBlocks.push(block)
                }
              }
              if (toolUseBlocks.length === 0) continueLoop = false
            }
          }

          // If there were tool calls, execute them and loop
          if (toolUseBlocks.length > 0) {
            // Add assistant turn with tool_use blocks to message history
            const finalMsg = await response.finalMessage()
            claudeMessages.push({ role: 'assistant', content: finalMsg.content })

            // Execute tools and collect results
            const toolResultContent: Anthropic.ToolResultBlockParam[] = []
            for (const toolBlock of toolUseBlocks) {
              const result = await executeTool(toolBlock.name, toolBlock.input as Record<string, unknown>)
              send({ type: 'tool_end', toolName: toolBlock.name, result })

              toolResultContent.push({
                type: 'tool_result',
                tool_use_id: toolBlock.id,
                content: result,
              })

              // Persist tool result to DB
              await supabase.from('messages').insert({
                conversation_id: conversationId!,
                role: 'tool_result',
                content: result,
                tool_use_id: toolBlock.id,
                tool_name: toolBlock.name,
              })
            }

            claudeMessages.push({ role: 'user', content: toolResultContent })
          } else {
            continueLoop = false
          }
        }

        // Persist final assistant message
        if (fullAssistantText.trim()) {
          await supabase.from('messages').insert({
            conversation_id: conversationId!,
            role: 'assistant',
            content: fullAssistantText,
          })
        }

        // Touch conversation updated_at
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId!)

        send({ type: 'done' })
      } catch (err) {
        send({ type: 'error', message: err instanceof Error ? err.message : 'Unexpected error' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
