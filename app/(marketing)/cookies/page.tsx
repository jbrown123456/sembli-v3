import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Cookie Policy — Sembli' }

const LAST_UPDATED = 'April 22, 2026'

function CookieRow({
  name,
  provider,
  purpose,
  duration,
}: {
  name: string
  provider: string
  purpose: string
  duration: string
}) {
  return (
    <tr>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,24,20,0.07)', fontFamily: 'var(--font-jetbrains-mono)', fontSize: 12, color: '#1A1814', verticalAlign: 'top' }}>
        {name}
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,24,20,0.07)', fontSize: 13, color: 'rgba(26,24,20,0.6)', verticalAlign: 'top' }}>
        {provider}
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,24,20,0.07)', fontSize: 13, color: 'rgba(26,24,20,0.6)', verticalAlign: 'top' }}>
        {purpose}
      </td>
      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(26,24,20,0.07)', fontSize: 13, color: 'rgba(26,24,20,0.6)', verticalAlign: 'top', whiteSpace: 'nowrap' as const }}>
        {duration}
      </td>
    </tr>
  )
}

export default function CookiesPage() {
  return (
    <div
      style={{
        maxWidth: 740,
        margin: '0 auto',
        padding: '72px 24px 80px',
        color: '#1A1814',
      }}
    >
      {/* Nav */}
      <div style={{ marginBottom: 48 }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'rgba(26,24,20,0.4)',
            textDecoration: 'none',
          }}
        >
          ← Sembli
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(26,24,20,0.4)',
            marginBottom: 12,
          }}
        >
          Last updated {LAST_UPDATED}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 40,
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            color: '#1A1814',
            margin: 0,
          }}
        >
          Cookie Policy
        </h1>
      </div>

      <section style={{ marginBottom: 40, fontSize: 15, lineHeight: 1.7, color: 'rgba(26,24,20,0.75)' }}>
        <p>
          Sembli uses a small number of cookies and similar technologies to keep you signed in, measure product
          usage, and process payments. We do not use advertising cookies or sell data to third parties.
        </p>
      </section>

      {/* Table */}
      <section style={{ marginBottom: 48, overflowX: 'auto' }}>
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            margin: '0 0 20px',
          }}
        >
          Cookies in use
        </h2>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'rgba(26,24,20,0.02)',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(26,24,20,0.08)',
          }}
        >
          <thead>
            <tr style={{ background: 'rgba(26,24,20,0.04)' }}>
              {['Cookie / Key', 'Provider', 'Purpose', 'Duration'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,24,20,0.4)',
                    fontWeight: 500,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CookieRow
              name="sb-*-auth-token"
              provider="Supabase"
              purpose="Stores your session token so you stay signed in across page loads."
              duration="1 week (session)"
            />
            <CookieRow
              name="ph_*"
              provider="PostHog"
              purpose="Anonymous product analytics — which features are used, how often. No PII in event payloads."
              duration="1 year"
            />
            <CookieRow
              name="__stripe_mid, __stripe_sid"
              provider="Stripe"
              purpose="Fraud prevention and session management for payment flows."
              duration="1 year / session"
            />
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 40, fontSize: 15, lineHeight: 1.7, color: 'rgba(26,24,20,0.75)' }}>
        <h2
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            color: '#1A1814',
            margin: '0 0 14px',
          }}
        >
          Managing cookies
        </h2>
        <p>
          You can clear cookies at any time in your browser settings. Note that clearing the authentication
          cookie will sign you out. Disabling PostHog cookies will not affect core functionality.
        </p>
        <p style={{ marginTop: 12 }}>
          We don&rsquo;t currently display a cookie consent banner because we only use strictly necessary
          and analytics cookies. If you are in the EU and have questions, email{' '}
          <strong>privacy@sembli.co</strong>.
        </p>
      </section>

      {/* Footer nav */}
      <div
        style={{
          marginTop: 64,
          paddingTop: 24,
          borderTop: '1px solid rgba(26,24,20,0.08)',
          display: 'flex',
          gap: 24,
        }}
      >
        {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 11,
              letterSpacing: '0.04em',
              color: 'rgba(26,24,20,0.4)',
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
