import { Logo } from '@/components/app/Logo'
import { SignInForm } from './SignInForm'

export const metadata = { title: 'Sign in — Sembli' }

export default function SignInPage() {
  return (
    <div style={{ color: 'var(--almanac-ink)' }}>
      {/* Mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <Logo size={32} />
        <span
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.05em',
          }}
        >
          sembli
        </span>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 8px',
        }}
      >
        Welcome back.
      </h1>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.55,
          color: 'var(--almanac-ink-soft)',
          margin: '0 0 32px',
        }}
      >
        Enter your email to get a magic link, or add your password to sign in directly.
      </p>

      <SignInForm />

      {/* Footer links */}
      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: 'var(--almanac-muted)',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        By continuing, you agree to our{' '}
        <a href="/terms" style={{ color: 'var(--almanac-ink-soft)', textDecoration: 'underline' }}>
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" style={{ color: 'var(--almanac-ink-soft)', textDecoration: 'underline' }}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
