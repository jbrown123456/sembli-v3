'use client'

import { useState } from 'react'
import type { MaintenanceItem, Asset } from '@/lib/supabase/types'
import { completeEvent, skipEvent, deleteEvent } from '@/app/(app)/timeline/actions'
import { useAnalytics } from '@/lib/analytics'

type ItemWithAsset = MaintenanceItem & { assets: Pick<Asset, 'name' | 'category'> | null }

function daysUntil(dateStr: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function StatusDot({ isOverdue, status }: { isOverdue: boolean; status: string }) {
  const color =
    status === 'completed' ? 'var(--almanac-success)' :
    status === 'skipped' ? 'var(--almanac-muted)' :
    isOverdue ? 'var(--almanac-danger)' :
    'var(--almanac-brand-deep)'

  return (
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
  )
}

interface CompleteFormProps {
  itemId: string
  onDone: () => void
}

function CompleteForm({ itemId, onDone }: CompleteFormProps) {
  const [cost, setCost] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { track } = useAnalytics()

  async function handle() {
    setLoading(true)
    await completeEvent(itemId, {
      costCents: cost ? Math.round(parseFloat(cost) * 100) : undefined,
      notes: notes || undefined,
    })
    track('maintenance_event_completed', {
      had_cost: !!cost,
      had_vendor: false,
    })
    onDone()
  }

  return (
    <div style={{
      marginTop: 10,
      padding: '12px 14px',
      background: 'var(--almanac-surface-alt)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <input
        type="number"
        placeholder="Cost (optional, $)"
        value={cost}
        onChange={e => setCost(e.target.value)}
        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--almanac-border)', background: 'var(--almanac-surface)', color: 'var(--almanac-ink)', fontSize: 14, outline: 'none' }}
      />
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--almanac-border)', background: 'var(--almanac-surface)', color: 'var(--almanac-ink)', fontSize: 14, outline: 'none' }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handle}
          disabled={loading}
          style={{ flex: 1, padding: '9px', borderRadius: 8, border: 0, background: 'var(--almanac-ink)', color: 'var(--almanac-bg)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Saving…' : '✓ Mark done'}
        </button>
        <button
          onClick={onDone}
          style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid var(--almanac-border)', background: 'transparent', color: 'var(--almanac-muted)', fontSize: 13, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export function EventCard({ item }: { item: ItemWithAsset }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [skipping, setSkipping] = useState(false)

  const days = item.due_date ? daysUntil(item.due_date) : null
  const isOverdue = item.status === 'scheduled' && days !== null && days < 0
  const isDone = item.status === 'completed'
  const isSkipped = item.status === 'skipped'

  const dueDateLabel =
    days === null ? null :
    isDone ? `Done ${item.completed_date}` :
    isSkipped ? 'Skipped' :
    isOverdue ? `${Math.abs(days)}d overdue` :
    days === 0 ? 'Due today' :
    days <= 7 ? `Due in ${days}d` :
    item.due_date

  const borderColor = isOverdue
    ? 'var(--almanac-danger)'
    : isDone
    ? 'var(--almanac-border-soft)'
    : 'var(--almanac-border)'

  return (
    <div style={{
      background: 'var(--almanac-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 12,
      padding: '12px 14px',
      opacity: isDone || isSkipped ? 0.6 : 1,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <StatusDot isOverdue={isOverdue} status={item.status} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <span style={{
              fontSize: 14,
              fontWeight: 600,
              color: isDone || isSkipped ? 'var(--almanac-muted)' : 'var(--almanac-ink)',
              textDecoration: isDone ? 'line-through' : 'none',
            }}>
              {item.title}
            </span>
            {item.source === 'ai_suggested' && !isDone && !isSkipped && (
              <span style={{
                fontFamily: 'var(--font-jetbrains-mono)',
                fontSize: 9,
                color: 'var(--almanac-brand-deep)',
                background: 'var(--almanac-brand-soft)',
                padding: '2px 6px',
                borderRadius: 4,
                flexShrink: 0,
              }}>✦ AI</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' as const }}>
            {item.assets?.name && (
              <span style={{ fontSize: 12, color: 'var(--almanac-muted)' }}>{item.assets.name}</span>
            )}
            {dueDateLabel && (
              <span style={{ fontSize: 12, color: isOverdue ? 'var(--almanac-danger)' : 'var(--almanac-muted)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                {dueDateLabel}
              </span>
            )}
          </div>
        </div>

        {!isDone && !isSkipped && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--almanac-border)', background: 'transparent', color: 'var(--almanac-ink-soft)', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}
          >
            {expanded ? '−' : 'Log'}
          </button>
        )}
      </div>

      {expanded && !isDone && (
        <CompleteForm itemId={item.id} onDone={() => setExpanded(false)} />
      )}

      {/* Secondary actions */}
      {!isDone && !isSkipped && expanded && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={async () => { setSkipping(true); await skipEvent(item.id) }}
            disabled={skipping}
            style={{ fontSize: 12, color: 'var(--almanac-muted)', background: 'transparent', border: 0, cursor: 'pointer', padding: '4px 0' }}
          >
            {skipping ? 'Skipping…' : 'Skip'}
          </button>
          <button
            onClick={async () => { setDeleting(true); await deleteEvent(item.id) }}
            disabled={deleting}
            style={{ fontSize: 12, color: 'var(--almanac-danger)', background: 'transparent', border: 0, cursor: 'pointer', padding: '4px 0' }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  )
}
