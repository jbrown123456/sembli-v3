'use client'

import { useState } from 'react'
import type { Asset } from '@/lib/supabase/types'
import { addManualEvent } from '@/app/(app)/timeline/actions'
import { useAnalytics } from '@/lib/analytics'

interface AddEventModalProps {
  homeId: string
  assets: Pick<Asset, 'id' | 'name'>[]
  onClose: () => void
}

export function AddEventModal({ homeId, assets, onClose }: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [assetId, setAssetId] = useState<string>('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { track } = useAnalytics()

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !dueDate) { setError('Title and due date are required.'); return }
    setLoading(true)
    setError('')
    await addManualEvent({
      homeId,
      assetId: assetId || null,
      title: title.trim(),
      dueDate,
      description: notes || undefined,
    })
    track('maintenance_event_added')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
      />
      {/* Sheet */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'var(--almanac-surface)',
        borderRadius: '20px 20px 0 0',
        padding: '20px 20px 36px',
        zIndex: 50,
        boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--almanac-border)', margin: '0 auto 20px' }} />
        <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--almanac-ink)', margin: '0 0 20px' }}>
          Add maintenance event
        </h3>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            autoFocus
            type="text"
            placeholder="What needs doing? (e.g. Replace air filter)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--almanac-border)', background: 'var(--almanac-bg)', color: 'var(--almanac-ink)', fontSize: 15, outline: 'none' }}
          />

          <select
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--almanac-border)', background: 'var(--almanac-bg)', color: assetId ? 'var(--almanac-ink)' : 'var(--almanac-muted)', fontSize: 15, outline: 'none' }}
          >
            <option value="">No specific asset</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <div>
            <label style={{ fontSize: 11, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--almanac-muted)', display: 'block', marginBottom: 6 }}>
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--almanac-border)', background: 'var(--almanac-bg)', color: 'var(--almanac-ink)', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--almanac-border)', background: 'var(--almanac-bg)', color: 'var(--almanac-ink)', fontSize: 15, outline: 'none' }}
          />

          {error && <p style={{ fontSize: 13, color: 'var(--almanac-danger)', margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '14px', borderRadius: 999, border: 0, background: 'var(--almanac-ink)', color: 'var(--almanac-bg)', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Saving…' : 'Add event'}
          </button>
        </form>
      </div>
    </>
  )
}
