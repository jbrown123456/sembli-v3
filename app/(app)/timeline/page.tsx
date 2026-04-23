// Timeline — 10-year outlook. Stub for Task 06.

export const metadata = { title: 'Timeline — Sembli' };

const PLACEHOLDER_EVENTS = [
  { year: 2025, item: 'Water heater flush', tag: 'Maintenance', urgent: false },
  { year: 2026, item: 'AC service check', tag: 'HVAC', urgent: true },
  { year: 2028, item: 'AC replacement likely', tag: 'HVAC', urgent: true },
  { year: 2029, item: 'Roof mid-life inspection', tag: 'Exterior', urgent: false },
  { year: 2031, item: 'Roof replacement window', tag: 'Exterior', urgent: false },
];

export default function TimelinePage() {
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
        10-year outlook
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          margin: '0 0 24px',
        }}
      >
        What&apos;s coming
      </h1>

      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 38,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'var(--almanac-border)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PLACEHOLDER_EVENTS.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                paddingBottom: 20,
              }}
            >
              {/* Year marker */}
              <div
                style={{
                  width: 76,
                  flexShrink: 0,
                  textAlign: 'right',
                  paddingRight: 12,
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-fraunces)',
                    fontSize: 16,
                    fontWeight: 500,
                    fontStyle: 'italic',
                    color: e.urgent ? 'var(--almanac-brand-deep)' : 'var(--almanac-muted)',
                  }}
                >
                  {e.year}
                </span>
                {/* Dot on timeline */}
                <div
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: e.urgent ? 'var(--almanac-brand-deep)' : 'var(--almanac-border)',
                    border: '2px solid var(--almanac-bg)',
                    zIndex: 1,
                  }}
                />
              </div>

              {/* Event card */}
              <div
                style={{
                  flex: 1,
                  background: e.urgent ? 'var(--almanac-brand-soft)' : 'var(--almanac-surface)',
                  border: e.urgent
                    ? '1px solid color-mix(in srgb, var(--almanac-brand-deep) 20%, transparent)'
                    : '1px solid var(--almanac-border)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  marginTop: -2,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>{e.item}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono)',
                    fontSize: 9.5,
                    color: 'var(--almanac-muted)',
                    marginTop: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {e.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          marginTop: 8,
          fontSize: 12.5,
          color: 'var(--almanac-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        Live timeline generated from real asset data in Task 06.
      </p>
    </div>
  );
}
