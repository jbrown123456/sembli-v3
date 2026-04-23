'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageBubble, type Message, type ToolCall } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { ConversationList, type ConversationSummary } from './ConversationList'

interface ChatWindowProps {
  homeId: string
  initialConversationId: string | null
  initialMessages: Message[]
  conversations: ConversationSummary[]
  isPro: boolean
}

export function ChatWindow({
  homeId,
  initialConversationId,
  initialMessages,
  conversations,
  isPro,
}: ChatWindowProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [input])

  // Handle ?new=1 query param
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setMessages([])
      setConversationId(null)
      router.replace('/chat')
    }
  }, [searchParams, router])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    setInput('')
    setIsStreaming(true)

    // Optimistic user message
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])

    // Placeholder assistant message (streaming)
    const assistantId = crypto.randomUUID()
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', isStreaming: true, toolCalls: [] },
    ])

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, homeId, message: text }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      const pendingTools: ToolCall[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === 'conversation_id') {
              setConversationId(event.conversationId)
            } else if (event.type === 'text') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + event.delta }
                    : m
                )
              )
            } else if (event.type === 'tool_start') {
              pendingTools.push({ toolName: event.toolName, done: false })
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, toolCalls: [...pendingTools] } : m
                )
              )
            } else if (event.type === 'tool_end') {
              const idx = pendingTools.findLastIndex(t => t.toolName === event.toolName && !t.done)
              if (idx >= 0) pendingTools[idx] = { ...pendingTools[idx], done: true }
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, toolCalls: [...pendingTools] } : m
                )
              )
            } else if (event.type === 'done') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              )
            } else if (event.type === 'error') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: '⚠ Something went wrong. Please try again.', isStreaming: false }
                    : m
                )
              )
            }
          } catch {
            // Malformed SSE line — ignore
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: '⚠ Connection error. Please try again.', isStreaming: false }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }, [input, isStreaming, conversationId, homeId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleNew = () => {
    setMessages([])
    setConversationId(null)
    setShowSidebar(false)
    router.replace('/chat')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 60px)', // subtract AppHeader
        position: 'relative',
        background: 'var(--almanac-bg)',
      }}
    >
      {/* Top bar with history toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid var(--almanac-border-soft)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setShowSidebar(s => !s)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--almanac-ink-soft)',
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10M2 7h7M2 11h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          History
        </button>

        {conversationId && (
          <button
            onClick={handleNew}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'transparent',
              border: '1px solid var(--almanac-border)',
              borderRadius: 14,
              padding: '4px 10px',
              cursor: 'pointer',
              color: 'var(--almanac-ink-soft)',
              fontFamily: 'var(--font-inter)',
              fontSize: 12,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            New
          </button>
        )}
      </div>

      {/* Conversation history sidebar (slide over) */}
      {showSidebar && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(28,26,22,0.3)',
              zIndex: 40,
            }}
            onClick={() => setShowSidebar(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 280,
              background: 'var(--almanac-bg)',
              borderRight: '1px solid var(--almanac-border)',
              zIndex: 50,
              overflowY: 'auto',
              paddingTop: 8,
            }}
          >
            <ConversationList
              conversations={conversations}
              activeId={conversationId}
              onNew={handleNew}
            />
          </div>
        </>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.length === 0 && !isStreaming && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '32px 24px',
              textAlign: 'center',
              gap: 12,
              color: 'var(--almanac-ink)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--almanac-accent)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 16C4 10.5 7 6.5 10 6.5C13 6.5 16 10.5 16 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="4.5" r="1.5" fill="white" />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-fraunces)',
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: '-0.03em',
                  margin: '0 0 8px',
                }}
              >
                Ask Sembli{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>
                  anything.
                </span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--almanac-ink-soft)', maxWidth: 260, margin: '0 auto', lineHeight: 1.55 }}>
                I know your home&apos;s assets and maintenance history. Try asking about an upcoming service, an appliance, or what needs attention.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 320, marginTop: 8 }}>
              {[
                'What maintenance is coming up this month?',
                'When was the HVAC last serviced?',
                'Schedule a filter change for next month',
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); textareaRef.current?.focus() }}
                  style={{
                    background: 'var(--almanac-surface-alt)',
                    border: '1px solid var(--almanac-border)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter)',
                    fontSize: 13,
                    color: 'var(--almanac-ink-soft)',
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isStreaming && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div
        style={{
          borderTop: '1px solid var(--almanac-border-soft)',
          padding: '12px 16px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          background: 'var(--almanac-bg)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            background: 'var(--almanac-surface-alt)',
            border: '1.5px solid var(--almanac-border)',
            borderRadius: 20,
            padding: '8px 8px 8px 16px',
            transition: 'border-color 0.15s',
          }}
          onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your home…"
            rows={1}
            disabled={isStreaming}
            style={{
              flex: 1,
              resize: 'none',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-inter)',
              fontSize: 15,
              lineHeight: 1.5,
              color: 'var(--almanac-ink)',
              minHeight: 24,
              maxHeight: 120,
              overflowY: 'auto',
            }}
          />
          <button
            onClick={isStreaming ? () => abortRef.current?.abort() : send}
            disabled={!isStreaming && !input.trim()}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: isStreaming
                ? 'var(--almanac-danger)'
                : input.trim()
                  ? 'var(--almanac-ink)'
                  : 'var(--almanac-border)',
              border: 'none',
              cursor: input.trim() || isStreaming ? 'pointer' : 'default',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            {isStreaming ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="2" y="2" width="8" height="8" rx="1.5" fill="white" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 11V3M3.5 6.5L7 3l3.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
        <p
          style={{
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--almanac-muted)',
            marginTop: 6,
            fontFamily: 'var(--font-inter)',
          }}
        >
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  )
}
