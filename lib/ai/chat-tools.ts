/**
 * Claude tool definitions for Ask Sembli.
 * Tools run server-side in the streaming route handler.
 */

import type Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'

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
  {
    name: 'update_maintenance_event',
    description: 'Edit an existing scheduled maintenance event — change the title, due date, description, or recurrence. Use when the user wants to reschedule, rename, or modify a maintenance task.',
    input_schema: {
      type: 'object',
      properties: {
        event_id: { type: 'string', description: 'The maintenance_items UUID' },
        title: { type: 'string', description: 'New title' },
        description: { type: 'string', description: 'New description' },
        due_date: { type: 'string', description: 'New due date as ISO string, e.g. "2025-09-01"' },
        recurrence: {
          type: 'string',
          enum: ['none', 'monthly', 'quarterly', 'annual'],
          description: 'New recurrence',
        },
        asset_id: { type: 'string', description: 'Reassign to a different asset UUID, or null to unlink' },
      },
      required: ['event_id'],
    },
  },
  {
    name: 'delete_maintenance_event',
    description: 'Permanently delete a scheduled maintenance event. Use when the user wants to cancel or remove a task entirely. For "skip this once" use complete_maintenance_event instead.',
    input_schema: {
      type: 'object',
      properties: {
        event_id: { type: 'string', description: 'The maintenance_items UUID to delete' },
      },
      required: ['event_id'],
    },
  },
  {
    name: 'create_asset',
    description: 'Add a new asset to the home. Use when the user mentions a new appliance, system, or piece of equipment they want to track.',
    input_schema: {
      type: 'object',
      properties: {
        home_id: { type: 'string', description: 'The home ID' },
        name: { type: 'string', description: 'Asset name, e.g. "Water Heater"' },
        category: {
          type: 'string',
          enum: ['HVAC', 'Plumbing', 'Electrical', 'Exterior', 'Appliance', 'Contact'],
          description: 'Asset category',
        },
        brand: { type: 'string', description: 'Brand or manufacturer' },
        model: { type: 'string', description: 'Model number or name' },
        serial_number: { type: 'string', description: 'Serial number' },
        install_year: { type: 'number', description: 'Year the asset was installed, e.g. 2019' },
        expected_life_years: { type: 'number', description: 'Typical lifespan in years' },
        last_service_date: { type: 'string', description: 'ISO date of last service, e.g. "2024-03-15"' },
        notes: { type: 'string', description: 'Any additional notes' },
      },
      required: ['home_id', 'name', 'category'],
    },
  },
  {
    name: 'update_asset',
    description: 'Edit an existing asset — update its name, brand, model, notes, install year, or other fields. Use when the user corrects or adds information about an asset.',
    input_schema: {
      type: 'object',
      properties: {
        asset_id: { type: 'string', description: 'The asset UUID' },
        name: { type: 'string', description: 'New name' },
        category: {
          type: 'string',
          enum: ['HVAC', 'Plumbing', 'Electrical', 'Exterior', 'Appliance', 'Contact'],
          description: 'New category',
        },
        brand: { type: 'string', description: 'New brand' },
        model: { type: 'string', description: 'New model' },
        serial_number: { type: 'string', description: 'New serial number' },
        install_year: { type: 'number', description: 'Corrected install year' },
        expected_life_years: { type: 'number', description: 'Corrected expected lifespan' },
        last_service_date: { type: 'string', description: 'Updated last service date as ISO string' },
        notes: { type: 'string', description: 'Updated notes' },
      },
      required: ['asset_id'],
    },
  },
  {
    name: 'delete_asset',
    description: 'Permanently delete an asset and all its linked maintenance events. Only use when the user explicitly asks to remove or delete an asset (e.g. "we sold the car", "remove the old water heater").',
    input_schema: {
      type: 'object',
      properties: {
        asset_id: { type: 'string', description: 'The asset UUID to delete' },
      },
      required: ['asset_id'],
    },
  },
]

// ─── Tool execution ───────────────────────────────────────────

type ToolInput = Record<string, unknown>

export async function executeTool(
  toolName: string,
  input: ToolInput,
  supabase: SupabaseClient
): Promise<string> {
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

      case 'update_maintenance_event': {
        const { event_id, title, description, due_date, recurrence, asset_id } = input as {
          event_id: string
          title?: string
          description?: string
          due_date?: string
          recurrence?: 'none' | 'monthly' | 'quarterly' | 'annual'
          asset_id?: string
        }
        const updates: Record<string, unknown> = {}
        if (title !== undefined) updates.title = title
        if (description !== undefined) updates.description = description
        if (due_date !== undefined) updates.due_date = due_date
        if (recurrence !== undefined) updates.recurrence = recurrence
        if (asset_id !== undefined) updates.asset_id = asset_id || null
        if (Object.keys(updates).length === 0) return 'No changes specified.'
        const { data, error } = await supabase
          .from('maintenance_items')
          .update(updates)
          .eq('id', event_id)
          .select('title, due_date')
          .single()
        if (error) return `Failed to update event: ${error.message}`
        return `Updated: "${data.title}" — due ${data.due_date}`
      }

      case 'delete_maintenance_event': {
        const { event_id } = input as { event_id: string }
        const { data: existing } = await supabase
          .from('maintenance_items')
          .select('title')
          .eq('id', event_id)
          .single()
        const { error } = await supabase.from('maintenance_items').delete().eq('id', event_id)
        if (error) return `Failed to delete event: ${error.message}`
        return `Deleted: "${existing?.title ?? event_id}"`
      }

      case 'create_asset': {
        const { home_id, name, category, brand, model, serial_number, install_year, expected_life_years, last_service_date, notes } = input as {
          home_id: string
          name: string
          category: string
          brand?: string
          model?: string
          serial_number?: string
          install_year?: number
          expected_life_years?: number
          last_service_date?: string
          notes?: string
        }
        const { data, error } = await supabase
          .from('assets')
          .insert({
            home_id,
            name,
            category,
            brand: brand ?? null,
            model: model ?? null,
            serial_number: serial_number ?? null,
            install_year: install_year ?? null,
            expected_life_years: expected_life_years ?? null,
            last_service_date: last_service_date ?? null,
            notes: notes ?? null,
            source: 'ai_inferred',
          })
          .select('id, name, category')
          .single()
        if (error) return `Failed to create asset: ${error.message}`
        return `Created asset: "${data.name}" (${data.category}) — id: ${data.id}`
      }

      case 'update_asset': {
        const { asset_id, name, category, brand, model, serial_number, install_year, expected_life_years, last_service_date, notes } = input as {
          asset_id: string
          name?: string
          category?: string
          brand?: string
          model?: string
          serial_number?: string
          install_year?: number
          expected_life_years?: number
          last_service_date?: string
          notes?: string
        }
        const updates: Record<string, unknown> = {}
        if (name !== undefined) updates.name = name
        if (category !== undefined) updates.category = category
        if (brand !== undefined) updates.brand = brand
        if (model !== undefined) updates.model = model
        if (serial_number !== undefined) updates.serial_number = serial_number
        if (install_year !== undefined) updates.install_year = install_year
        if (expected_life_years !== undefined) updates.expected_life_years = expected_life_years
        if (last_service_date !== undefined) updates.last_service_date = last_service_date
        if (notes !== undefined) updates.notes = notes
        if (Object.keys(updates).length === 0) return 'No changes specified.'
        const { data, error } = await supabase
          .from('assets')
          .update(updates)
          .eq('id', asset_id)
          .select('name, category')
          .single()
        if (error) return `Failed to update asset: ${error.message}`
        return `Updated asset: "${data.name}" (${data.category})`
      }

      case 'delete_asset': {
        const { asset_id } = input as { asset_id: string }
        const { data: existing } = await supabase.from('assets').select('name').eq('id', asset_id).single()
        const { error } = await supabase.from('assets').delete().eq('id', asset_id)
        if (error) return `Failed to delete asset: ${error.message}`
        return `Deleted asset: "${existing?.name ?? asset_id}"`
      }

      default:
        return `Unknown tool: ${toolName}`
    }
  } catch (err) {
    return `Tool error: ${err instanceof Error ? err.message : String(err)}`
  }
}
