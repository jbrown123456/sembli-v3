import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/app/timeline/EmptyState'
import { TimelineClient } from '@/components/app/timeline/TimelineClient'
import type { Asset, MaintenanceItem } from '@/lib/supabase/types'

export const metadata = { title: 'Timeline — Sembli' }

export default async function TimelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <EmptyState />

  const { data: home } = await supabase
    .from('homes')
    .select('id, name')
    .eq('owner_id', user.id)
    .limit(1)
    .single()

  if (!home) return (
    <div style={{ padding: '20px 18px' }}>
      <EmptyState />
    </div>
  )

  const { data: assets } = await supabase
    .from('assets')
    .select('id, name, category')
    .eq('home_id', home.id)
    .order('name')

  const { data: allItems } = await supabase
    .from('maintenance_items')
    .select('*, assets(name, category)')
    .eq('home_id', home.id)
    .order('due_date', { ascending: true })

  const items = (allItems ?? []) as (MaintenanceItem & { assets: Pick<Asset, 'name' | 'category'> | null })[]

  const today = new Date().toISOString().split('T')[0]

  // Upcoming = scheduled items (overdue first, then future)
  const upcoming = items
    .filter(i => i.status === 'scheduled')
    .sort((a, b) => {
      const ad = a.due_date ?? '9999-12-31'
      const bd = b.due_date ?? '9999-12-31'
      // Overdue items first
      const aOverdue = ad < today
      const bOverdue = bd < today
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1
      return ad.localeCompare(bd)
    })

  // History = completed + skipped
  const history = items
    .filter(i => i.status !== 'scheduled')
    .sort((a, b) => (b.completed_date ?? b.updated_at).localeCompare(a.completed_date ?? a.updated_at))

  return (
    <div style={{ padding: '20px 18px', color: 'var(--almanac-ink)' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--almanac-muted)',
          marginBottom: 4,
        }}>
          {home.name}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-fraunces)',
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: '-0.03em',
          margin: 0,
        }}>
          Maintenance
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <TimelineClient
          homeId={home.id}
          assets={(assets ?? []) as Pick<Asset, 'id' | 'name'>[]}
          upcoming={upcoming}
          history={history}
        />
      )}
    </div>
  )
}
