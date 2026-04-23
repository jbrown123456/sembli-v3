import { createClient } from '@/lib/supabase/server'
import { getEntitlements } from '@/lib/entitlements'
import { redirect } from 'next/navigation'
import { createPortalSession } from '../upgrade/actions'
import { DeleteAccountButton } from './DeleteAccountButton'
import Link from 'next/link'

export const metadata = { title: 'Settings — Sembli' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const entitlements = await getEntitlements(user.id)

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('owner_id', user.id)
    .single()

  const periodEnd = sub?.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div style={{ padding: '24px 18px', color: 'var(--almanac-ink)', maxWidth: 430 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--almanac-muted)', marginBottom: 6 }}>
          Account
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.03em', margin: 0 }}>
          Settings
        </h1>
      </div>

      {/* Account info */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-muted)', marginBottom: 12 }}>
          Account
        </div>
        <div style={{
          background: 'var(--almanac-surface)',
          borderRadius: 16,
          border: '1px solid var(--almanac-border)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--almanac-border-soft)' }}>
            <div style={{ fontSize: 11, color: 'var(--almanac-muted)', marginBottom: 2 }}>Email</div>
            <div style={{ fontSize: 14, color: 'var(--almanac-ink)' }}>{user.email}</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--almanac-muted)', marginBottom: 2 }}>Member since</div>
            <div style={{ fontSize: 14, color: 'var(--almanac-ink)' }}>
              {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-muted)', marginBottom: 12 }}>
          Subscription
        </div>
        <div style={{
          background: entitlements.isPro ? 'var(--almanac-brand-soft)' : 'var(--almanac-surface)',
          borderRadius: 16,
          border: entitlements.isPro ? '1px solid var(--almanac-brand)' : '1px solid var(--almanac-border)',
          padding: '16px',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--almanac-ink)' }}>
                {entitlements.isPro ? 'Sembli Pro' : 'Free Plan'}
              </div>
              {entitlements.isPro && sub?.status && (
                <div style={{ fontSize: 12, color: 'var(--almanac-ink-soft)', marginTop: 2 }}>
                  {sub.status === 'active' ? 'Active' : sub.status === 'trialing' ? 'Trialing' : sub.status}
                  {periodEnd && ` · renews ${periodEnd}`}
                </div>
              )}
              {!entitlements.isPro && (
                <div style={{ fontSize: 12, color: 'var(--almanac-muted)', marginTop: 2 }}>
                  5 assets · no AI chat
                </div>
              )}
            </div>
            {entitlements.isPro && (
              <span style={{
                fontSize: 10,
                fontFamily: 'var(--font-jetbrains-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'var(--almanac-brand)',
                color: '#fff',
                borderRadius: 6,
                padding: '3px 8px',
              }}>
                Pro
              </span>
            )}
          </div>
        </div>

        {entitlements.isPro ? (
          <form action={createPortalSession}>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 12,
                border: '1px solid var(--almanac-border)',
                background: 'var(--almanac-surface)',
                color: 'var(--almanac-ink)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Manage billing →
            </button>
          </form>
        ) : (
          <a
            href="/upgrade"
            style={{
              display: 'block',
              width: '100%',
              padding: '13px',
              borderRadius: 12,
              border: 0,
              background: 'var(--almanac-ink)',
              color: 'var(--almanac-bg)',
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Upgrade to Pro →
          </a>
        )}
      </section>

      {/* Sign out */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-muted)', marginBottom: 12 }}>
          Session
        </div>
        <a
          href="/auth/signout"
          style={{
            display: 'block',
            padding: '13px 16px',
            borderRadius: 12,
            border: '1px solid var(--almanac-border)',
            background: 'var(--almanac-surface)',
            color: 'var(--almanac-ink)',
            fontSize: 14,
            textDecoration: 'none',
            textAlign: 'center',
          }}
        >
          Sign out
        </a>
      </section>

      {/* Legal */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-muted)', marginBottom: 12 }}>
          Legal
        </div>
        <div style={{
          background: 'var(--almanac-surface)',
          borderRadius: 16,
          border: '1px solid var(--almanac-border)',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
          ].map(({ label, href }, i, arr) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--almanac-border-soft)' : 'none',
                color: 'var(--almanac-ink)',
                textDecoration: 'none',
                fontSize: 14,
              }}
            >
              {label}
              <span style={{ color: 'var(--almanac-muted)', fontSize: 16 }}>›</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-danger)', marginBottom: 12 }}>
          Danger zone
        </div>
        <DeleteAccountButton />
      </section>
    </div>
  )
}
