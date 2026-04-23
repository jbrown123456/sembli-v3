import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Map Stripe plan interval → our subscription plan string.
 * Falls back to 'pro_monthly' if we can't determine.
 */
function resolvePlan(subscription: Stripe.Subscription): 'pro_monthly' | 'pro_yearly' {
  const item = subscription.items.data[0]
  const interval = item?.price?.recurring?.interval
  return interval === 'year' ? 'pro_yearly' : 'pro_monthly'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[stripe-webhook] signature verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) {
          console.warn('[stripe-webhook] subscription missing supabase_user_id metadata', sub.id)
          break
        }

        const plan = resolvePlan(sub)
        // current_period_end moved to SubscriptionItem in API 2026-03-25.dahlia
        const periodEndTs = sub.items.data[0]?.current_period_end
        const periodEnd = periodEndTs ? new Date(periodEndTs * 1000).toISOString() : null

        await supabase
          .from('subscriptions')
          .update({
            stripe_customer_id: sub.customer as string,
            stripe_subscription_id: sub.id,
            plan,
            status: sub.status,
            current_period_end: periodEnd,
          })
          .eq('owner_id', userId)

        console.log(`[stripe-webhook] ${event.type}: user=${userId} plan=${plan} status=${sub.status}`)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) {
          console.warn('[stripe-webhook] deleted subscription missing supabase_user_id', sub.id)
          break
        }

        await supabase
          .from('subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            stripe_subscription_id: sub.id,
            current_period_end: sub.items.data[0]?.current_period_end
              ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
              : null,
          })
          .eq('owner_id', userId)

        console.log(`[stripe-webhook] subscription deleted: user=${userId}`)
        break
      }

      default:
        // Ignore all other event types
        break
    }
  } catch (err) {
    console.error('[stripe-webhook] DB update failed:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
