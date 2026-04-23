/**
 * Claude tool definitions for Ask Sembli.
 * Tools run server-side in the streaming route handler.
 */

import type Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

// ─── Tool schemas (passed to Claude) ─────────────────────────

export const CHAT_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_assets',
    description: 'Find assets in the home by keyword or category. Use this when the user asks about a specific appliance, system, or piece of equipment.',
    input_schema: {
      type: 'object',
      properties: {
        home_id: { type: 'string', description: 'The home ID to search within' },
        query: { type: 'string', description: 'Keyword to search in asset names, brands, models, or notes' },
        category: {
          type: 'string',
          enum: ['HVAC', 'Plumbing', 'Electrical', 'Exterior', 'Appliance', 'Contact'],
          description: 'Optional: filter by category',
        },
      },
      required: ['home_id'],
    },
  },
  {
    name: 'get_asset_details',
    description: 'Get full details for a specific asset including notes, service history, and linked maintenance events.',
    input_schema: {
      type: 'object',
      properties: {
        asset_id: { type: 'string', description: 'The asset UUID' },
      },
      required: ['asset_id'],
    },
  },
  {
    name: 'get_maintenance_history',
    description: 'Get completed maintenance events for an asset or the whole home.',
    input_schema: {
      type: 'object',
      properties: {
        home_id: { type: 'string', description: 'The home ID' },
        asset_id: { type: 'string', description: 'Optional: filter to a specific asset' },
        limit: { type: 'number', description: 'Max events to return (default 10)' },
      },
      required: ['home_id'],
    },
  },
  {
    name: 'create_maintenance_event',
    description: 'Schedule a new maintenance event. Use this when the user explicitly asks to schedule, remind, or plan a maintenance task.',
    input_schema: {
      type: 'object',
      properties: {
        home_id: { type: 'string', description: 'The home ID' },
        asset_id: { type: 'string', description: 'Optional: linked asset UUID' },
        title: { type: 'string', description: 'Short title, e.g. "Replace HVAC filter"' },
        description: { type: 'string', description: 'Optional additional details' },
        due_date: { type: 'string', description: 'ISO date string, e.g. "2025-06-01"' },
        recurrence: {
          type: 'string',
          enum: ['none', 'monthly', 'quarterly', 'annual'],
          description: 'How often this repeats (default: none)',
        },
      },
      required: ['home_id', 'title', 'due_date'],
    },
  },
  {
    name: 'complete_maintenance_event',
    description: "Mark a maintenance event as completed. Use when the user says they've done or completed a task.",
    input_schema: {
      type: 'object',
      properties: {
        event_id: { type: 'string', description: 'The maintenance_items UUID' },
        completed_date: { type: 'string', description: 'ISO date string (defaults to today)' },
        cost_cents: { type: 'number', description: 'Optional cost in cents (e.g. 15000 = $150)' },
      },
      required: ['event_id'],
    },
  },
]

// ─── Tool execution ───────────────────────────────────────────

type ToolInput = Record<string, unknown>

export async function executeTool(
  toolName: string,
  input: ToolInput
): Promise<string> {
  const supabase = await createClient()

  try {
    switch (toolName) {
      case 'search_assets': {
        const { home_id, query, category } = input as {
          home_id: string
          query?: string
          category?: string
        }
        let q = supabase.from('assets').select('id, name, category, brand, model, install_year, notes').eq('home_id', home_id)
        if (category) q = q.eq('category', category)
        if (query) q = q.or(`name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,notes.ilike.%${query}%`)
        const { data } = await q.limit(10)
        if (!data?.length) return 'No matching assets found.'
        return JSON.stringify(data, null, 2)
      }

      case 'get_asset_details': {
        const { asset_id } = input as { asset_id: string }
        const { data: asset } = await supabase.from('assets').select('*').eq('id', asset_id).single()
        if (!asset) return 'Asset not found.'
        const { data: maintenance } = await supabase
          .from('maintenance_items')
          .select('title, due_date, completed_date, status, cost_cents')
          .eq('asset_id', asset_id)
          .order('due_date', { ascending: false })
          .limit(5)
        return JSON.stringify({ asset, recent_maintenance: maintenance ?? [] }, null, 2)
      }

      case 'get_maintenance_history': {
        const { home_id, asset_id, limit = 10 } = input as {
          home_id: string
          asset_id?: string
          limit?: number
        }
        let q = supabase
          .from('maintenance_items')
          .select('title, due_date, completed_date, cost_cents, assets(name)')
          .eq('home_id', home_id)
          .eq('status', 'completed')
          .order('completed_date', { ascending: false })
          .limit(limit)
        if (asset_id) q = q.eq('asset_id', asset_id)
        const { data } = await q
        if (!data?.length) return 'No completed maintenance events found.'
        return JSON.stringify(data, null, 2)
      }

      case 'create_maintenance_event': {
        const { home_id, asset_id, title, description, due_date, recurrence = 'none' } = input as {
          home_id: string
          asset_id?: string
          title: string
          description?: string
          due_date: string
          recurrence?: 'none' | 'monthly' | 'quarterly' | 'annual'
        }
        const { data, error } = await supabase
          .from('maintenance_items')
          .insert({
            home_id,
            asset_id: asset_id ?? null,
            title,
            description: description ?? null,
            due_date,
            recurrence,
            source: 'ai_suggested',
            status: 'scheduled',
          })
          .select('id, title, due_date')
          .single()
        if (error) return `Failed to create event: ${error.message}`
        return `Scheduled: "${data.title}" on ${data.due_date} (id: ${data.id})`
      }

      case 'complete_maintenance_event': {
        const { event_id, completed_date, cost_cents } = input as {
          event_id: string
          completed_date?: string
          cost_cents?: number
        }
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
          .from('maintenance_items')
          .update({
            status: 'completed',
            completed_date: completed_date ?? today,
            ...(cost_cents !== undefined ? { cost_cents } : {}),
          })
          .eq('id', event_id)
          .select('title, completed_date')
          .single()
        if (error) return `Failed to complete event: ${error.message}`
        return `Marked complete: "${data.title}" on ${data.completed_date}`
      }

      default:
        return `Unknown tool: ${toolName}`
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`
  }
}
