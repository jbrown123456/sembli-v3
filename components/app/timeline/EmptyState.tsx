import Link from 'next/link'

export function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>🗓</div>
      <p style={{
        fontFamily: 'var(--font-fraunces)',
        fontSize: 22,
        fontWeight: 400,
        letterSpacing: '-0.02em',
        color: 'var(--almanac-ink)',
        marginBottom: 8,
      }}>
        Nothing scheduled yet.
      </p>
      <p style={{ fontSize: 14, color: 'var(--almanac-muted)', lineHeight: 1.55, marginBottom: 24 }}>
        Add your first asset and Sembli will build a maintenance schedule automatically.
      </p>
      <Link
        href="/onboarding/first-asset"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: 999,
          background: 'var(--almanac-ink)',
          color: 'var(--almanac-bg)',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Add HVAC system →
      </Link>
    </div>
  )
}
