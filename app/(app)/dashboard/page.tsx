import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Asset, MaintenanceItem } from '@/lib/supabase/types'

export const metadata = { title: 'Dashboard — Sembli' }

function daysUntil(dateStr: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function NextUpItem({ item }: { item: MaintenanceItem & { assets: Pick<Asset, 'name'> | null } }) {
  const days = item.due_date ? daysUntil(item.due_date) : null
  const isOverdue = days !== null && days < 0
  const isDueSoon = days !== null && days >= 0 && days <= 60

  return (
    <Link href="/timeline" style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--almanac-surface)',
          border: `1px solid ${isOverdue ? 'var(--almanac-danger)' : 'var(--almanac-border)'}`,
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            flexShrink: 0,
            background: isOverdue
              ? 'var(--almanac-danger)'
              : isDueSoon
              ? 'var(--almanac-brand-deep)'
              : 'var(--almanac-border)',
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--almanac-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.title}
          </div>
          <div style={{ fontSize: 12, color: 'var(--almanac-muted)', marginTop: 1 }}>
            {item.assets?.name ?? 'Home'}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-jetbrains-mono)',
            color: isOverdue ? 'var(--almanac-danger)' : 'var(--almanac-muted)',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {days === null ? '\u2014' : isOverdue ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : `${days}d`}
        </div>
      </div>
    </Link>
  )
}

function AssetCard({ asset }: { asset: Asset }) {
  const currentYear = new Date().getFullYear()
  const age = asset.install_year ? currentYear - asset.install_year : null
  const life = asset.expected_life_years ?? 15
  const pct = age !== null ? Math.min(Math.round((age / life) * 100), 100) : null
  const barColor =
    pct === null
      ? 'var(--almanac-border)'
      : pct > 85
      ? 'var(--almanac-danger)'
      : pct > 60
      ? 'var(--almanac-brand-deep)'
      : 'var(--almanac-accent)'

  return (
    <Link href="/assets" style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          borderRadius: 14,
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: pct !== null ? 10 : 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--almanac-ink)' }}>{asset.name}</div>
            {asset.brand && (
              <div style={{ fontSize: 12, color: 'var(--almanac-muted)', marginTop: 2 }}>
                {asset.brand}{asset.model ? ` \u00b7 ${asset.model}` : ''}
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 9,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.06em',
              color: 'var(--almanac-muted)',
              background: 'var(--almanac-surface-alt)',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {asset.category ?? 'Asset'}
          </div>
        </div>

        {pct !== null && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--almanac-muted)' }}>
                {age}yr of {life}yr lifespan
              </span>
              <span style={{ fontSize: 11, color: barColor, fontWeight: 600 }}>{100 - pct}% remaining</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'var(--almanac-surface-alt)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 2 }} />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div style={{ padding: '24px 18px', color: 'var(--almanac-ink)' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 32, fontWeight: 400, letterSpacing: '-0.03em', margin: 0 }}>
          Your home,<br />
          <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>at a glance.</span>
        </h1>
      </div>
    )
  }

  const { data: home } = await supabase
    .from('homes')
    .select('id, name')
    .eq('owner_id', user.id)
    .limit(1)
    .single()

  const [{ data: assets }, { data: upcomingItems }] = await Promise.all([
    home
      ? supabase.from('assets').select('*').eq('home_id', home.id).order('created_at', { ascending: false })
      : Promise.resolve({ data: [] as Asset[] }),
    home
      ? supabase
          .from('maintenance_items')
          .select('*, assets(name)')
          .eq('home_id', home.id)
          .is('completed_date', null)
          .order('due_date', { ascending: true })
          .limit(3)
      : Promise.resolve({ data: [] }),
  ])

  const hasAssets = assets && assets.length > 0

  return (
    <div style={{ padding: '20px 18px', color: 'var(--almanac-ink)' }}>
      <div style={{ marginBottom: 24 }}>
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
          {home?.name ?? 'Your home'}
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 28,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          {hasAssets ? 'Good to see you.' : (
            <>
              Your home,<br />
              <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>remembered.</span>
            </>
          )}
        </h1>
      </div>

      {!hasAssets ? (
        <div
          style={{
            background: 'var(--almanac-brand-soft)',
            border: '1px solid var(--almanac-brand)',
            borderRadius: 16,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 14.5, color: 'var(--almanac-ink-soft)', marginBottom: 16, lineHeight: 1.55 }}>
            Add your first asset to start tracking your home.
          </p>
          <Link
            href="/onboarding/first-asset"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: 999,
              background: 'var(--almanac-ink)',
              color: 'var(--almanac-bg)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Add HVAC system \u2192
          </Link>
        </div>
      ) : (
        <>
          {upcomingItems && upcomingItems.length > 0 && (
            <section style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-jetbrains-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--almanac-muted)',
                  marginBottom: 10,
                }}
              >
                Next up
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(upcomingItems as (MaintenanceItem & { assets: Pick<Asset, 'name'> | null })[]).map(item => (
                  <NextUpItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-jetbrains-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--almanac-muted)',
                marginBottom: 10,
              }}
            >
              {assets.length} tracked system{assets.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assets.map(asset => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
            <Link
              href="/onboarding/first-asset"
              style={{
                display: 'block',
                marginTop: 12,
                padding: '12px',
                borderRadius: 12,
                border: '1px dashed var(--almanac-border)',
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--almanac-muted)',
                textDecoration: 'none',
              }}
            >
              + Add another asset
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
