'use client'

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset: () => void
  variant?: 'app' | 'marketing'
}

export function ErrorFallback({ error, reset, variant = 'app' }: ErrorFallbackProps) {
  const isApp = variant === 'app'

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
        background: isApp ? 'var(--almanac-bg)' : '#F5F0E8',
        color: isApp ? 'var(--almanac-ink)' : '#1A1814',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: isApp ? 'var(--almanac-surface-alt)' : 'rgba(0,0,0,0.06)',
          display: 'grid',
          placeItems: 'center',
          marginBottom: 20,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 7v5M11 15v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2
        style={{
          fontFamily: isApp ? 'var(--font-fraunces)' : 'inherit',
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: isApp ? '-0.03em' : undefined,
          margin: '0 0 8px',
        }}
      >
        Something went wrong.
      </h2>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.55,
          opacity: 0.6,
          maxWidth: 280,
          margin: '0 0 24px',
        }}
      >
        {process.env.NODE_ENV === 'development'
          ? error.message
          : "We've been notified and are looking into it."}
      </p>

      <button
        onClick={reset}
        style={{
          background: isApp ? 'var(--almanac-ink)' : '#1A1814',
          color: isApp ? 'var(--almanac-bg)' : '#F5F0E8',
          border: 'none',
          borderRadius: 20,
          padding: '10px 22px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: isApp ? 'var(--font-inter)' : 'inherit',
        }}
      >
        Try again
      </button>
    </div>
  )
}
