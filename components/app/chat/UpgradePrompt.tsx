'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useAnalytics } from '@/lib/analytics'

export function UpgradePrompt() {
  const { track } = useAnalytics()
  useEffect(() => {
    track('upgrade_prompt_shown', { trigger: 'chat' })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: '40px 24px',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--almanac-brand-soft)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="var(--almanac-brand-deep)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--almanac-muted)',
            marginBottom: 8,
          }}
        >
          Pro feature
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            margin: '0 0 8px',
            color: 'var(--almanac-ink)',
          }}
        >
          Ask Sembli anything.
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: 'var(--almanac-ink-soft)',
            maxWidth: 260,
            margin: '0 auto',
          }}
        >
          Get AI-powered answers about your home, schedule maintenance, and more. Available on Pro.
        </p>
      </div>
      <Link
        href="/settings/upgrade"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--almanac-brand)',
          color: 'var(--almanac-ink)',
          fontFamily: 'var(--font-inter)',
          fontSize: 14,
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: 24,
          textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
      >
        Upgrade to Pro — $9/mo
      </Link>
    </div>
  )
}
