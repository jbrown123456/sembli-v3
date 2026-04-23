export function MonthGroup({ label, count }: { label: string; count: number }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 0 8px',
    }}>
      <span style={{
        fontFamily: 'var(--font-fraunces)',
        fontSize: 15,
        fontWeight: 500,
        fontStyle: 'italic',
        color: 'var(--almanac-ink-soft)',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-jetbrains-mono)',
        fontSize: 10,
        color: 'var(--almanac-muted)',
        background: 'var(--almanac-surface-alt)',
        padding: '2px 7px',
        borderRadius: 99,
      }}>
        {count}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--almanac-border-soft)' }} />
    </div>
  )
}
