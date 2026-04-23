'use client'

const TOOL_LABELS: Record<string, string> = {
  search_assets: 'Searching your assets',
  get_asset_details: 'Looking up asset details',
  get_maintenance_history: 'Checking maintenance history',
  create_maintenance_event: 'Scheduling maintenance',
  complete_maintenance_event: 'Marking as complete',
}

interface ToolCallChipProps {
  toolName: string
  done?: boolean
}

export function ToolCallChip({ toolName, done = false }: ToolCallChipProps) {
  const label = TOOL_LABELS[toolName] ?? toolName.replace(/_/g, ' ')

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 20,
        background: 'var(--almanac-brand-soft)',
        border: '1px solid var(--almanac-border)',
        fontSize: 12,
        color: 'var(--almanac-ink-soft)',
        fontFamily: 'var(--font-inter)',
        margin: '2px 0',
      }}
    >
      {done ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" fill="var(--almanac-success)" />
          <path d="M3.5 6l1.8 1.8L8.5 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span
          style={{
            width: 10,
            height: 10,
            border: '1.5px solid var(--almanac-brand-deep)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      )}
      <span>{label}…</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
