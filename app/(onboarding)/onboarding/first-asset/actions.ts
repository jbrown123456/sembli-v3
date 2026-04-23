'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { anthropic } from '@/lib/anthropic'

interface CreateAssetInput {
  name: string
  brand?: string | null
  model?: string | null
  serial_number?: string | null
  install_year?: number | null
  expected_life_years?: number | null
  notes?: string | null
  source: 'manual' | 'ai_inferred'
}

// Default HVAC maintenance schedule (fallback if Claude call fails)
const HVAC_DEFAULT_SCHEDULE = [
  { title: 'Replace air filter', description: '1" filter replacement', daysFromNow: 90, recurrence: 'quarterly' as const },
  { title: 'Annual tune-up', description: 'Professional HVAC tune-up and inspection', daysFromNow: 365, recurrence: 'annual' as const },
  { title: 'Clean condenser coils', description: 'Clear debris and clean outdoor condenser coils', daysFromNow: 365, recurrence: 'annual' as const },
  { title: 'Inspect refrigerant lines', description: 'Check for leaks and proper insulation', daysFromNow: 365, recurrence: 'annual' as const },
  { title: 'Blower wheel cleaning', description: 'Clean blower wheel for efficiency', daysFromNow: 730, recurrence: 'none' as const },
]

function addDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

async function getOrCreateHome(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: existing } = await supabase
    .from('homes')
    .select('id')
    .eq('owner_id', userId)
    .limit(1)
    .single()

  if (existing) return existing.id

  // Create a default home if none exists
  const { data: newHome, error } = await supabase
    .from('homes')
    .insert({ owner_id: userId, name: 'My Home' })
    .select('id')
    .single()

  if (error || !newHome) throw new Error('Failed to create home record')
  return newHome.id
}

async function generateMaintenanceSchedule(
  supabase: Awaited<ReturnType<typeof createClient>>,
  homeId: string,
  assetId: string,
  asset: CreateAssetInput
): Promise<void> {
  let scheduleItems = HVAC_DEFAULT_SCHEDULE

  // Try Claude for a customized schedule if we have meaningful asset data
  if (process.env.ANTHROPIC_API_KEY && (asset.brand || asset.install_year)) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        tools: [
          {
            name: 'generate_schedule',
            description: 'Generate maintenance schedule items',
            input_schema: {
              type: 'object' as const,
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      description: { type: 'string' },
                      daysFromNow: { type: 'number' },
                      recurrence: { type: 'string', enum: ['none', 'monthly', 'quarterly', 'annual'] },
                    },
                    required: ['title', 'daysFromNow', 'recurrence'],
                  },
                },
              },
              required: ['items'],
            },
          },
        ],
        tool_choice: { type: 'tool', name: 'generate_schedule' },
        messages: [
          {
            role: 'user',
            content: `Generate a maintenance schedule for this HVAC system:
Brand: ${asset.brand ?? 'Unknown'}
Model: ${asset.model ?? 'Unknown'}
Install year: ${asset.install_year ?? 'Unknown'}
Today: ${new Date().toISOString().split('T')[0]}

Return 4-6 maintenance items with realistic due dates based on when it was installed.`,
          },
        ],
      })

      const toolUse = response.content.find(b => b.type === 'tool_use')
      if (toolUse && toolUse.type === 'tool_use') {
        const result = toolUse.input as { items: typeof HVAC_DEFAULT_SCHEDULE }
        if (result.items?.length) scheduleItems = result.items
      }
    } catch {
      // Fall through to default schedule
    }
  }

  const maintenanceRows = scheduleItems.map(item => ({
    home_id: homeId,
    asset_id: assetId,
    title: item.title,
    description: item.description ?? null,
    due_date: addDays(item.daysFromNow),
    recurrence: item.recurrence,
    source: 'ai_suggested' as const,
  }))

  await supabase.from('maintenance_items').insert(maintenanceRows)
}

export async function createFirstAsset(input: CreateAssetInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const homeId = await getOrCreateHome(supabase, user.id).catch(() => null)
  if (!homeId) return { error: 'Failed to create home' }

  const { data: asset, error } = await supabase
    .from('assets')
    .insert({
      home_id: homeId,
      name: input.name,
      category: 'HVAC',
      brand: input.brand ?? null,
      model: input.model ?? null,
      serial_number: input.serial_number ?? null,
      install_year: input.install_year ?? null,
      expected_life_years: input.expected_life_years ?? 15,
      notes: input.notes ?? null,
      source: input.source,
    })
    .select('id')
    .single()

  if (error || !asset) return { error: error?.message ?? 'Failed to create asset' }

  // Fire-and-forget maintenance schedule (don't block the redirect on failure)
  await generateMaintenanceSchedule(supabase, homeId, asset.id, input).catch(() => {})

  redirect('/dashboard')
}

export async function skipFirstAsset() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  // Still ensure a home record exists
  await getOrCreateHome(supabase, user.id).catch(() => {})

  redirect('/dashboard')
}
