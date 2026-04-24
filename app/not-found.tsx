import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: '#F5F0E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        color: '#1A1814',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: '#1A1814',
            marginBottom: 48,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-inter)', fontSize: 15, fontWeight: 500 }}>sembli</span>
        </Link>

        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(26,24,20,0.4)',
            marginBottom: 16,
          }}
        >
          404
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            margin: '0 0 16px',
          }}
        >
          Page not found.
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 15,
            color: 'rgba(26,24,20,0.6)',
            lineHeight: 1.6,
            margin: '0 0 40px',
          }}
        >
          That page doesn&rsquo;t exist. Head back home.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: '#1A1814',
            color: '#F5F0E8',
            fontFamily: 'var(--font-inter)',
            fontSize: 14,
            fontWeight: 500,
            padding: '12px 28px',
            borderRadius: 100,
            textDecoration: 'none',
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
