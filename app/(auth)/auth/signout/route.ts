import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(_req: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/signin')
}
