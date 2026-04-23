// Dashboard — stub for Task 05 (Magic moment + first asset)

export const metadata = { title: 'Dashboard — Sembli' };

export default function DashboardPage() {
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
        Coming in Task 05
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 32,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        Your home,
        <br />
        <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>at a glance.</span>
      </h1>
      <p
        style={{
          marginTop: 14,
          fontSize: 14.5,
          lineHeight: 1.55,
          color: 'var(--almanac-ink-soft)',
        }}
      >
        Dashboard lands in Phase 4a once auth and data model are wired up.
      </p>
    </div>
  );
}
