'use client'

import { useState, useTransition } from 'react'
import { createCheckoutSession } from './actions'

export function UpgradeForm() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly')
  const [isPending, startTransition] = useTransition()

  function handleUpgrade() {
    startTransition(async () => {
      await createCheckoutSession(plan)
    })
  }

  return (
    <div>
      {/* Plan toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['monthly', 'yearly'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 12,
              border: plan === p ? '2px solid var(--almanac-ink)' : '1px solid var(--almanac-border)',
              background: plan === p ? 'var(--almanac-ink)' : 'var(--almanac-surface)',
              color: plan === p ? 'var(--almanac-bg)' : 'var(--almanac-ink)',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {p === 'monthly' ? '$9 / month' : '$79 / year'}
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
              {p === 'yearly' ? 'Save $29 · 2 months free' : 'Billed monthly'}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        disabled={isPending}
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 999,
          border: 0,
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          fontSize: 16,
          fontWeight: 600,
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? 'Redirecting to checkout…' : 'Upgrade to Pro →'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--almanac-muted)', marginTop: 12 }}>
        Secure checkout via Stripe · Cancel anytime
      </p>
    </div>
  )
}
