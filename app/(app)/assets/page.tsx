// Assets — home system inventory. Stub for Task 05/06.

export const metadata = { title: 'Assets — Sembli' };

export default function AssetsPage() {
  const PLACEHOLDER_ASSETS = [
    { name: 'Roof', tag: 'Exterior', year: 2011 },
    { name: 'Water Heater', tag: 'Plumbing', year: 2025 },
    { name: 'Carrier AC', tag: 'HVAC', year: 2006 },
    { name: 'Furnace', tag: 'HVAC', year: null },
    { name: 'Electrical Panel', tag: 'Electrical', year: null },
  ];

  return (
    <div style={{ padding: '20px 18px', color: 'var(--almanac-ink)' }}>
      <div
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--almanac-muted)',
          marginBottom: 4,
        }}
      >
        5 tracked systems
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          margin: '0 0 20px',
        }}
      >
        Assets
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PLACEHOLDER_ASSETS.map((a) => (
          <div
            key={a.name}
            style={{
              background: 'var(--almanac-surface)',
              border: '1px solid var(--almanac-border)',
              borderRadius: 14,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: 'var(--almanac-muted)', marginTop: 2 }}>
                {a.year ? `Installed ${a.year}` : 'Install year unknown'}
              </div>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9.5,
                color: 'var(--almanac-muted)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                background: 'var(--almanac-surface-alt)',
                padding: '3px 8px',
                borderRadius: 4,
              }}
            >
              {a.tag}
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: 20,
          fontSize: 12.5,
          color: 'var(--almanac-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Live asset data connects in Task 05 once the data model lands.
      </p>
    </div>
  );
}
