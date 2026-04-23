import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/anthropic'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

interface ExtractAssetRequest {
  mode: 'text' | 'image'
  content: string // text description OR base64 image data
  mediaType?: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface ExtractedAsset {
  name: string
  brand: string | null
  model: string | null
  serial_number: string | null
  install_year: number | null
  expected_life_years: number | null
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
}

// Simple in-memory rate limiter (resets on cold start — acceptable for beta)
const rateLimits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const entry = rateLimits.get(userId)
  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!checkRateLimit(user.id)) {
    return NextResponse.json(
      { error: 'Rate limit reached — try again in an hour.' },
      { status: 429 }
    )
  }

  let body: ExtractAssetRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { mode, content, mediaType = 'image/jpeg' } = body
  if (!mode || !content) {
    return NextResponse.json({ error: 'mode and content are required' }, { status: 400 })
  }

  const systemPrompt = `You are an expert at reading HVAC system nameplates and descriptions.
Extract structured asset information from the user's input.
Return only valid JSON matching the requested schema — no other text.
If a field cannot be determined with reasonable confidence, return null for it.
For install_year, estimate from nameplate date codes or "manufactured" dates if visible.
For expected_life_years, use industry standards: HVAC systems typically last 15-20 years.`

  const userContent =
    mode === 'text'
      ? `Extract HVAC asset details from this description: "${content}"`
      : `Extract HVAC asset details from this nameplate photo. Read all visible text carefully.`

  const messageContent: Anthropic.MessageParam['content'] =
    mode === 'image'
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: content,
            },
          },
          { type: 'text', text: userContent },
        ]
      : [{ type: 'text', text: userContent }]

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 512,
    system: systemPrompt,
    tools: [
      {
        name: 'extract_asset',
        description: 'Extract structured asset information from the input',
        input_schema: {
          type: 'object' as const,
          properties: {
            name: { type: 'string', description: 'Human-readable asset name, e.g. "Carrier HVAC System"' },
            brand: { type: 'string', description: 'Manufacturer brand name' },
            model: { type: 'string', description: 'Model number or name' },
            serial_number: { type: 'string', description: 'Serial number from nameplate' },
            install_year: { type: 'number', description: 'Year installed or manufactured (4-digit)' },
            expected_life_years: { type: 'number', description: 'Expected lifespan in years (typically 15-20 for HVAC)' },
            notes: { type: 'string', description: 'Any other notable details: tonnage, refrigerant type, SEER rating, etc.' },
            confidence: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Confidence in the extracted data' },
          },
          required: ['name', 'confidence'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'extract_asset' },
    messages: [{ role: 'user', content: messageContent }],
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    return NextResponse.json({ error: 'Extraction failed — try describing it in text.' }, { status: 500 })
  }

  const extracted = toolUse.input as ExtractedAsset
  return NextResponse.json({ asset: extracted })
}
