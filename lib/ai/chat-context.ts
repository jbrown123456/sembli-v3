/**
 * Builds the system prompt for Ask Sembli chat.
 * Injected fresh every turn — keeps Claude grounded in the user's actual home data.
 */

import { createClient } from '@/lib/supabase/server'

export interface ChatContext {
  homeId: string
  systemPrompt: string
}

export async function buildChatContext(homeId: string): Promise<ChatContext> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const in90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Load home + assets + maintenance in parallel
  const [homeRes, assetsRes, upcomingRes, overdueRes] = await Promise.all([
    supabase.from('homes').select('*').eq('id', homeId).single(),
    supabase.from('assets').select('*').eq('home_id', homeId).order('category'),
    supabase
      .from('maintenance_items')
      .select('*, assets(name, category)')
      .eq('home_id', homeId)
      .eq('status', 'scheduled')
      .gte('due_date', today)
      .lte('due_date', in90Days)
      .order('due_date'),
    supabase
      .from('maintenance_items')
      .select('*, assets(name, category)')
      .eq('home_id', homeId)
      .eq('status', 'scheduled')
      .lt('due_date', today)
      .order('due_date'),
  ])

  const home = homeRes.data
  const assets = assetsRes.data ?? []
  const upcoming = upcomingRes.data ?? []
  const overdue = overdueRes.data ?? []

  if (!home) throw new Error('Home not found')

  // Build assets section (keep concise — each asset ~30 tokens)
  const assetsSection =
    assets.length === 0
      ? '  (no assets recorded yet)'
      : assets
          .map(a => {
            const parts = [a.category, a.name]
            if (a.brand || a.model) parts.push(`${a.brand ?? ''}${a.model ? ` ${a.model}` : ''}`.trim())
            if (a.install_year) parts.push(`installed ${a.install_year}`)
            if (a.expected_life_years && a.install_year) {
              const age = new Date().getFullYear() - a.install_year
              const remaining = a.expected_life_years - age
              if (remaining <= 3) parts.push(`⚠ ~${remaining}yr life remaining`)
            }
            return `  • ${parts.filter(Boolean).join(' | ')}`
          })
          .join('\n')

  // Build upcoming maintenance section
  const upcomingSection =
    upcoming.length === 0
      ? '  (none in next 90 days)'
      : upcoming
          .slice(0, 10) // cap tokens
          .map(m => {
            const assetName = (m as { assets?: { name: string } | null }).assets?.name ?? 'General'
            return `  • ${m.due_date} — ${m.title} (${assetName})`
          })
          .join('\n')

  // Build overdue section
  const overdueSection =
    overdue.length === 0
      ? '  (none)'
      : overdue
          .slice(0, 5)
          .map(m => {
            const daysOverdue = Math.floor(
              (Date.now() - new Date(m.due_date!).getTime()) / (1000 * 60 * 60 * 24)
            )
            return `  • ${m.title} — ${daysOverdue} days overdue`
          })
          .join('\n')

  const homeAddress = [home.address, home.city, home.state].filter(Boolean).join(', ')

  const systemPrompt = `You are Sembli, a knowledgeable and warm home assistant. You help homeowners track, maintain, and make smart decisions about their home assets.

Respond naturally and conversationally. Be specific — reference the user's actual assets, dates, and data when relevant. If you don't know something, say so and suggest how to find out.

USER'S HOME:
  Name: ${home.name}
  ${homeAddress ? `Address: ${homeAddress}` : ''}
  ${home.year_built ? `Year built: ${home.year_built}` : ''}
  ${home.owner_relationship ? `Relationship: ${home.owner_relationship}` : ''}

ASSETS (${assets.length} total):
${assetsSection}

UPCOMING MAINTENANCE (next 90 days — ${upcoming.length} events):
${upcomingSection}

OVERDUE MAINTENANCE (${overdue.length} events):
${overdueSection}

Today's date: ${today}

When the user asks you to schedule something, look up a record, or take action, use the available tools. Confirm actions with the user before making changes when there's ambiguity. Keep responses concise unless detail is clearly needed.`

  return { homeId, systemPrompt }
}
