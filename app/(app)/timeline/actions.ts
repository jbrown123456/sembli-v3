'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function getAuthedClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return { supabase, user }
}

export async function completeEvent(
  eventId: string,
  data: { costCents?: number; notes?: string; performedBy?: string }
) {
  const { supabase } = await getAuthedClient()
  await supabase
    .from('maintenance_items')
    .update({
      status: 'completed',
      completed_date: new Date().toISOString().split('T')[0],
      cost_cents: data.costCents ?? null,
      description: data.notes ?? undefined,
    })
    .eq('id', eventId)
  revalidatePath('/timeline')
  revalidatePath('/dashboard')
}

export async function skipEvent(eventId: string) {
  const { supabase } = await getAuthedClient()
  await supabase
    .from('maintenance_items')
    .update({ status: 'skipped' })
    .eq('id', eventId)
  revalidatePath('/timeline')
  revalidatePath('/dashboard')
}

export async function deleteEvent(eventId: string) {
  const { supabase } = await getAuthedClient()
  await supabase.from('maintenance_items').delete().eq('id', eventId)
  revalidatePath('/timeline')
  revalidatePath('/dashboard')
}

export async function addManualEvent(data: {
  homeId: string
  assetId: string | null
  title: string
  dueDate: string
  description?: string
}) {
  const { supabase } = await getAuthedClient()
  await supabase.from('maintenance_items').insert({
    home_id: data.homeId,
    asset_id: data.assetId,
    title: data.title,
    due_date: data.dueDate,
    description: data.description ?? null,
    source: 'manual',
    status: 'scheduled',
    recurrence: 'none',
  })
  revalidatePath('/timeline')
  revalidatePath('/dashboard')
}
