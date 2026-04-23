import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms of Service — Sembli' }

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
      <div style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(26,24,20,0.75)' }}>
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

export default function TermsPage() {
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
          Terms of Service
        </h1>
      </div>

      <Section title="Acceptance">
        <p>
          By using Sembli, you agree to these Terms. If you don&rsquo;t agree, please don&rsquo;t use the service.
          Sembli is operated by <Placeholder label="legal entity name and jurisdiction" />.
        </p>
      </Section>

      <Section title="The service">
        <p>
          Sembli is a home asset tracking and maintenance management tool. We provide the platform; you supply the
          data about your home. The AI assistant (&ldquo;Ask Sembli&rdquo;) provides informational guidance —{' '}
          <strong>not professional advice</strong>. Always verify AI recommendations with a qualified contractor
          before making decisions.
        </p>
      </Section>

      <Section title="Your account">
        <p>
          You are responsible for keeping your login credentials secure. You must be at least 18 years old to use
          Sembli. You may not share your account with others.
        </p>
      </Section>

      <Section title="Acceptable use">
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8 }}>
          <li style={{ marginBottom: 6 }}>Use Sembli for any unlawful purpose</li>
          <li style={{ marginBottom: 6 }}>Attempt to gain unauthorized access to any system or data</li>
          <li style={{ marginBottom: 6 }}>Reverse-engineer, scrape, or exploit the service</li>
          <li style={{ marginBottom: 6 }}>Upload malicious content</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          We reserve the right to terminate accounts that violate these terms.
        </p>
      </Section>

      <Section title="Subscriptions and billing">
        <p>
          Sembli offers a free tier and a paid Pro plan. Pro subscriptions are billed monthly or annually via Stripe.
          Prices are shown at checkout. You may cancel at any time; access continues until the end of the current
          billing period. <Placeholder label="refund policy: pro-rated? no refunds? 14-day?" />
        </p>
      </Section>

      <Section title="Your data">
        <p>
          You own your data. By using Sembli, you grant us a limited license to store and process it to provide
          the service. We don&rsquo;t sell your data. See our{' '}
          <Link href="/privacy" style={{ color: '#1A1814', fontWeight: 600 }}>Privacy Policy</Link> for full details.
        </p>
      </Section>

      <Section title="Disclaimer of warranties">
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          AI-generated maintenance recommendations are informational only and do not constitute professional
          engineering or contracting advice.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          <Placeholder label="fill: cap on liability (e.g. fees paid in last 12 months), exclusion of consequential damages — have a lawyer review" />
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          <Placeholder label="fill: jurisdiction (e.g. State of Delaware, USA), dispute resolution mechanism" />
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may update these Terms. Material changes will be notified via email or in-app notice at least
          14 days before taking effect. Continued use after that date constitutes acceptance.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these Terms? Email <Placeholder label="legal@sembli.co or similar" />.
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
        {[['Privacy Policy', '/privacy'], ['Cookie Policy', '/cookies']].map(([label, href]) => (
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
