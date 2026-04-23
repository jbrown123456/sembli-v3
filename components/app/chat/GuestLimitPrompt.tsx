'use client'

import Link from 'next/link'

export function GuestLimitPrompt() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--almanac-border-soft)',
        padding: '20px 16px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        background: 'var(--almanac-bg)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'var(--almanac-brand-soft)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2L2 5.5l7 3.5 7-3.5L9 2zM2 12.5l7 3.5 7-3.5M2 9l7 3.5 7-3.5"
            stroke="var(--almanac-brand-deep)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <p
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--almanac-ink)',
            margin: '0 0 6px',
          }}
        >
          You&apos;ve used your 5 free messages.
        </p>
        <p
          style={{
            fontSize: 13,
            color: 'var(--almanac-ink-soft)',
            lineHeight: 1.5,
            margin: 0,
            maxWidth: 280,
          }}
        >
          Create a free account to keep chatting — plus track your actual home assets, maintenance history, and more.
        </p>
      </div>

      <Link
        href="/auth/signin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 28px',
          borderRadius: 24,
          textDecoration: 'none',
          width: '100%',
          maxWidth: 280,
          justifyContent: 'center',
        }}
      >
        Create free account →
      </Link>
    </div>
  )
}
