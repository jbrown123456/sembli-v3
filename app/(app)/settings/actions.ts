'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

/**
 * Permanently delete the authenticated user's account and all associated data.
 *
 * Sequence:
 *  1. Verify session
 *  2. Delete app data via admin client (bypasses RLS — ensures complete wipe)
 *  3. Delete Supabase Auth user (irreversible)
 *  4. Sign out + redirect home
 *
 * FK cascades in the schema handle child rows (assets, maintenance_items,
 * conversations, messages, documents) when homes and profiles are deleted.
 */
export async function deleteAccount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin')

  const admin = createAdminClient()

  // Delete in dependency order (most child → parent).
  // Cascades handle deeper children (assets → maintenance_items, etc.)
  await admin.from('conversations').delete().eq('user_id', user.id)
  await admin.from('homes').delete().eq('owner_id', user.id)
  await admin.from('subscriptions').delete().eq('owner_id', user.id)
  await admin.from('profiles').delete().eq('id', user.id)

  // Delete auth user — this is permanent and cannot be undone
  const { error } = await admin.auth.admin.deleteUser(user.id)
  if (error) {
    console.error('deleteUser error:', error)
    // Don't throw — auth user may already be gone; proceed to sign out
  }

  // Clear the local session
  await supabase.auth.signOut()

  redirect('/')
}
