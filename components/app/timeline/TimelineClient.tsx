'use client'

import { useState } from 'react'
import type { MaintenanceItem, Asset } from '@/lib/supabase/types'
import { EventCard } from './EventCard'
import { MonthGroup } from './MonthGroup'
import { AddEventModal } from './AddEventModal'

type ItemWithAsset = MaintenanceItem & { assets: Pick<Asset, 'name' | 'category'> | null }
type Tab = 'upcoming' | 'history'

function groupByMonth(items: ItemWithAsset[]): { label: string; items: ItemWithAsset[] }[] {
  const groups = new Map<string, ItemWithAsset[]>()
  for (const item of items) {
    const key = item.due_date
      ? new Date(item.due_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'No date'
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
}

interface TimelineClientProps {
  homeId: string
  assets: Pick<Asset, 'id' | 'name'>[]
  upcoming: ItemWithAsset[]
  history: ItemWithAsset[]
}

export function TimelineClient({ homeId, assets, upcoming, history }: TimelineClientProps) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [showAdd, setShowAdd] = useState(false)

  const active = tab === 'upcoming' ? upcoming : history
  const groups = groupByMonth(active)

  const tabStyle = (t: Tab) => ({
    padding: '8px 16px',
    borderRadius: 999,
    border: 0,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer' as const,
    background: tab === t ? 'var(--almanac-ink)' : 'transparent',
    color: tab === t ? 'var(--almanac-bg)' : 'var(--almanac-muted)',
  })

  return (
    <>
      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <button style={tabStyle('upcoming')} onClick={() => setTab('upcoming')}>
          Upcoming
          {upcoming.length > 0 && (
            <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>
              {upcoming.filter(i => i.status === 'scheduled' && i.due_date && new Date(i.due_date) < new Date()).length > 0
                ? `${upcoming.filter(i => i.status === 'scheduled' && i.due_date && new Date(i.due_date) < new Date()).length} overdue`
                : upcoming.length}
            </span>
          )}
        </button>
        <button style={tabStyle('history')} onClick={() => setTab('history')}>
          History
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowAdd(true)}
          style={{
            padding: '7px 14px',
            borderRadius: 999,
            border: '1px solid var(--almanac-border)',
            background: 'var(--almanac-surface)',
            color: 'var(--almanac-ink)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          + Add
        </button>
      </div>

      {/* Event list */}
      {active.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--almanac-muted)', textAlign: 'center', padding: '32px 0' }}>
          {tab === 'upcoming' ? 'Nothing scheduled — all clear!' : 'No history yet.'}
        </p>
      ) : (
        groups.map(group => (
          <div key={group.label}>
            <MonthGroup label={group.label} count={group.items.length} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
              {group.items.map(item => (
                <EventCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <AddEventModal
          homeId={homeId}
          assets={assets}
          onClose={() => setShowAdd(false)}
        />
      )}
    </>
  )
}
