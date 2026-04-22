'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

interface WaitlistResult {
  success: boolean
  message: string
}

export async function submitWaitlist(email: string, source: string = 'landing'): Promise<WaitlistResult> {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = headerStore.get('user-agent') ?? null

  // Validate email format
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  // Capture UTM source from form submission source param
  const resolvedSource = source || 'landing'

  try {
    const supabase = createAdminClient()

    // Rate limit: count submissions from this IP in the last hour
    if (ip) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('waitlist')
        .select('id', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', oneHourAgo)

      if ((count ?? 0) >= 5) {
        return { success: false, message: 'Too many submissions. Please try again later.' }
      }
    }

    const { error } = await supabase.from('waitlist').insert({
      email: email.toLowerCase().trim(),
      source: resolvedSource,
      ip,
      user_agent: userAgent,
    })

    if (error) {
      // Duplicate email — treat as success to avoid enumeration
      if (error.code === '23505') {
        return { success: true, message: "You're already on the list. We'll be in touch." }
      }
      console.error('Waitlist insert error:', error)
      return { success: false, message: 'Something went wrong. Please try again.' }
    }

    return { success: true, message: "You're on the list. We'll reach out before anyone else." }
  } catch (err) {
    console.error('Waitlist action error:', err)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
