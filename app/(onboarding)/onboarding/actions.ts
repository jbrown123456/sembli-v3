'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Called at the end of the onboarding flow (final screen CTA).
 * Marks the profile as onboarding_complete = true.
 * The router.push('/dashboard') in the client handles navigation.
 */
export async function completeOnboarding(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_complete: true })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return {}
}

/**
 * Called at the start of onboarding when the user provides an address.
 * Creates their first home record.
 */
export async function createHome(data: {
  name: string
  address?: string
  ownerRelationship?: string
}): Promise<{ homeId?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: home, error } = await supabase
    .from('homes')
    .insert({
      owner_id: user.id,
      name: data.name,
      address: data.address ?? null,
      owner_relationship: data.ownerRelationship ?? null,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  return { homeId: home.id }
}
