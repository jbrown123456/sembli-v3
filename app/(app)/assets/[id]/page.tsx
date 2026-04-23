// Asset detail — stub for Task 05/06.

export const metadata = { title: 'Asset — Sembli' };

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ padding: '24px 18px', color: 'var(--almanac-ink)' }}>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--almanac-muted)',
          marginBottom: 6,
        }}
      >
        Asset · {params.id}
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          margin: '0 0 12px',
        }}
      >
        Asset detail
      </h1>
      <p style={{ fontSize: 14, color: 'var(--almanac-ink-soft)', lineHeight: 1.55 }}>
        Full asset detail — service history, life progress bar, vendor links, and inline Ask Sembli — lands in Task 05.
      </p>
    </div>
  );
}
