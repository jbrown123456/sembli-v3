import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'
import { UpgradeForm } from './UpgradeForm'

export const metadata = { title: 'Upgrade to Pro — Sembli' }

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const entitlements = user ? await getEntitlements(user.id) : null

  return (
    <div style={{ padding: '24px 18px', color: 'var(--almanac-ink)', maxWidth: 430 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--almanac-muted)', marginBottom: 6 }}>
          Sembli Pro
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 32, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
          The full picture,<br />
          <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>unlocked.</span>
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--almanac-ink-soft)', lineHeight: 1.55, margin: 0 }}>
          Ask Sembli anything about the house. Get AI answers, not guesses.
        </p>
      </div>

      {/* Feature comparison */}
      <div style={{ marginBottom: 28 }}>
        {[
          { feature: 'Track home assets', free: true, pro: true },
          { feature: 'Maintenance calendar', free: true, pro: true },
          { feature: 'Up to 5 assets', free: true, pro: false },
          { feature: 'Unlimited assets', free: false, pro: true },
          { feature: 'Ask Sembli AI chat', free: false, pro: true },
          { feature: 'Photo + PDF intake', free: false, pro: true },
          { feature: 'Document storage', free: false, pro: true },
        ].map(({ feature, free, pro }) => (
          <div
            key={feature}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid var(--almanac-border-soft)',
              fontSize: 14,
            }}
          >
            <span style={{ color: 'var(--almanac-ink)' }}>{feature}</span>
            <div style={{ display: 'flex', gap: 24 }}>
              <span style={{ width: 40, textAlign: 'center', color: free ? 'var(--almanac-success)' : 'var(--almanac-border)', fontWeight: 600 }}>
                {free ? '✓' : '—'}
              </span>
              <span style={{ width: 40, textAlign: 'center', color: pro ? 'var(--almanac-brand-deep)' : 'var(--almanac-border)', fontWeight: 600 }}>
                {pro ? '✓' : '—'}
              </span>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, paddingTop: 8 }}>
          <div style={{ width: 40, textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--almanac-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Free</div>
          <div style={{ width: 40, textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', color: 'var(--almanac-brand-deep)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pro</div>
        </div>
      </div>

      {/* CTA */}
      {entitlements?.isPro ? (
        <div style={{ textAlign: 'center', padding: '20px', background: 'var(--almanac-brand-soft)', borderRadius: 16, border: '1px solid var(--almanac-brand)' }}>
          <p style={{ margin: 0, fontSize: 15, color: 'var(--almanac-ink)', fontWeight: 600 }}>
            You&rsquo;re on Pro ✓
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--almanac-ink-soft)' }}>
            Manage your subscription in Settings.
          </p>
        </div>
      ) : (
        <UpgradeForm />
      )}
    </div>
  )
}
