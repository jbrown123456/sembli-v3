import { createClient } from '@/lib/supabase/server'

export interface Entitlements {
  plan: 'free' | 'pro_monthly' | 'pro_yearly'
  isPro: boolean
  /** Max assets allowed (free: 5, pro: unlimited represented as Infinity) */
  assetLimit: number
  canUseAI: boolean
  canUploadDocs: boolean
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('owner_id', userId)
    .single()

  const plan = (sub?.plan as Entitlements['plan']) ?? 'free'
  const isPro =
    (plan === 'pro_monthly' || plan === 'pro_yearly') &&
    (sub?.status === 'active' || sub?.status === 'trialing')

  return {
    plan,
    isPro,
    assetLimit: isPro ? Infinity : 5,
    canUseAI: isPro,
    canUploadDocs: isPro,
  }
}
