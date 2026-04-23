import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Policy — Sembli' }

const LAST_UPDATED = 'April 22, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
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
        {title}
      </h2>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'rgba(26,24,20,0.75)',
        }}
      >
        {children}
      </div>
    </section>
  )
}

function Placeholder({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: 'rgba(255,180,0,0.18)',
        border: '1px dashed rgba(200,140,0,0.5)',
        borderRadius: 4,
        padding: '1px 8px',
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 12,
        color: 'rgba(140,100,0,0.9)',
      }}
    >
      [PLACEHOLDER — {label}]
    </span>
  )
}

export default function PrivacyPage() {
  return (
    <div
      style={{
        maxWidth: 680,
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
          Privacy Policy
        </h1>
      </div>

      <Section title="Overview">
        <p>
          <Placeholder label="fill with plain-language summary: what we collect, why, how long we keep it" />
        </p>
        <p style={{ marginTop: 12 }}>
          Sembli is operated by <Placeholder label="legal entity name" /> (&ldquo;Sembli,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).
          This Privacy Policy applies to our web application at <Placeholder label="domain" /> and any related services.
        </p>
      </Section>

      <Section title="Information we collect">
        <p><strong>Account data</strong> — email address, provided when you sign in via magic link.</p>
        <p style={{ marginTop: 12 }}><strong>Home data</strong> — addresses, asset details, maintenance records, and any notes you enter. This is the core of the service.</p>
        <p style={{ marginTop: 12 }}><strong>Usage data</strong> — pages visited, features used, timestamps. Collected via PostHog analytics.</p>
        <p style={{ marginTop: 12 }}><strong>Payment data</strong> — handled entirely by Stripe. We store only your Stripe customer ID and subscription status; we never see your card number.</p>
        <p style={{ marginTop: 12 }}><strong>AI interactions</strong> — messages sent to Ask Sembli are sent to Anthropic&rsquo;s API for processing. <Placeholder label="confirm Anthropic data retention policy and add link" /></p>
      </Section>

      <Section title="How we use your information">
        <p><Placeholder label="fill: service delivery, analytics, product improvement, communication (transactional only — no marketing without consent)" /></p>
      </Section>

      <Section title="Data sharing">
        <p>We share data only with the vendors needed to run the service:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}><strong>Supabase</strong> — database and authentication hosting</li>
          <li style={{ marginBottom: 6 }}><strong>Anthropic</strong> — AI processing for Ask Sembli</li>
          <li style={{ marginBottom: 6 }}><strong>Stripe</strong> — payment processing</li>
          <li style={{ marginBottom: 6 }}><strong>PostHog</strong> — product analytics</li>
          <li style={{ marginBottom: 6 }}><strong>Sentry</strong> — error monitoring</li>
          <li style={{ marginBottom: 6 }}><strong>Vercel</strong> — web hosting</li>
        </ul>
        <p style={{ marginTop: 12 }}>We do not sell your data. Ever.</p>
      </Section>

      <Section title="Data retention">
        <p><Placeholder label="fill: how long we keep data, what happens when you delete your account" /></p>
        <p style={{ marginTop: 12 }}>
          You can delete your account and all associated data at any time from{' '}
          <Link href="/settings" style={{ color: '#1A1814', fontWeight: 600 }}>Settings → Delete my account</Link>.
          Deletion is permanent and immediate.
        </p>
      </Section>

      <Section title="Your rights (GDPR / CCPA)">
        <p><Placeholder label="fill: right to access, correct, delete, port data; how to exercise; DPA contact if applicable" /></p>
        <p style={{ marginTop: 12 }}>
          To make a data request, email{' '}
          <Placeholder label="privacy@sembli.co or similar" />.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We use cookies for authentication (Supabase session), analytics (PostHog), and payments (Stripe).
          See our <Link href="/cookies" style={{ color: '#1A1814', fontWeight: 600 }}>Cookie Policy</Link> for details.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p><Placeholder label="fill: how we notify users of material changes (email vs. in-app banner), effective date behavior" /></p>
      </Section>

      <Section title="Contact">
        <p>
          Questions? Email <Placeholder label="privacy@sembli.co" />.
        </p>
      </Section>

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
        {[['Terms of Service', '/terms'], ['Cookie Policy', '/cookies']].map(([label, href]) => (
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
