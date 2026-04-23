'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe, PRICES } from '@/lib/stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('owner_id', userId)
    .single()

  if (sub?.stripe_customer_id) return sub.stripe_customer_id

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  await supabase
    .from('subscriptions')
    .update({ stripe_customer_id: customer.id })
    .eq('owner_id', userId)

  return customer.id
}

export async function createCheckoutSession(plan: 'monthly' | 'yearly') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const customerId = await getOrCreateStripeCustomer(user.id, user.email ?? '')

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: PRICES[plan], quantity: 1 }],
    success_url: `${SITE_URL}/dashboard?upgrade=success`,
    cancel_url: `${SITE_URL}/upgrade`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
    allow_promotion_codes: true,
  })

  redirect(session.url!)
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('owner_id', user.id)
    .single()

  if (!sub?.stripe_customer_id) redirect('/upgrade')

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${SITE_URL}/settings`,
  })

  redirect(session.url)
}
