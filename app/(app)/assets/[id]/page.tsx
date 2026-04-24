import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { MaintenanceItem } from '@/lib/supabase/types'

export const metadata = { title: 'Asset — Sembli' }

function statusColor(item: MaintenanceItem) {
  if (item.status === 'completed') return 'var(--almanac-success)'
  if (item.status === 'skipped') return 'var(--almanac-muted)'
  const days = item.due_date
    ? Math.round(
        (new Date(item.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null
  if (days !== null && days < 0) return 'var(--almanac-danger)'
  return 'var(--almanac-brand-deep)'
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: asset } = await supabase.from('assets').select('*').eq('id', id).single()

  if (!asset) notFound()

  const { data: maintenance } = await supabase
    .from('maintenance_items')
    .select('*')
    .eq('asset_id', id)
    .order('due_date', { ascending: false })
    .limit(20)

  const items = maintenance ?? []
  const upcoming = items.filter(i => i.status === 'scheduled')
  const history = items.filter(i => i.status !== 'scheduled')

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
    <div style={{ padding: '20px 18px', color: 'var(--almanac-ink)' }}>
      {/* Back */}
      <Link
        href="/assets"
        style={{
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--almanac-muted)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: 16,
        }}
      >
        ← Assets
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 9.5,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--almanac-muted)',
            marginBottom: 4,
          }}
        >
          {asset.category}
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
          {asset.name}
        </h1>
        {(asset.brand || asset.model) && (
          <p style={{ fontSize: 14, color: 'var(--almanac-muted)', margin: '4px 0 0' }}>
            {asset.brand}
            {asset.model ? ` · ${asset.model}` : ''}
          </p>
        )}
      </div>

      {/* Details card */}
      <div
        style={{
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          borderRadius: 16,
          padding: '16px',
          marginBottom: 24,
        }}
      >
        {pct !== null && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--almanac-ink-soft)' }}>
                {age}yr of {life}yr expected lifespan
              </span>
              <span style={{ fontSize: 13, color: barColor, fontWeight: 600 }}>
                {100 - pct}% remaining
              </span>
            </div>
            <div
              style={{
                height: 5,
                borderRadius: 3,
                background: 'var(--almanac-surface-alt)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3 }}
              />
            </div>
          </div>
        )}

        {[
          ['Install year', asset.install_year?.toString()],
          ['Serial number', asset.serial_number],
          ['Last service', asset.last_service_date],
          ['Notes', asset.notes],
        ]
          .filter(([, v]) => v)
          .map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '10px 0',
                borderTop: '1px solid var(--almanac-border-soft)',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-jetbrains-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--almanac-muted)',
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <span style={{ fontSize: 13, color: 'var(--almanac-ink)', textAlign: 'right' }}>
                {value}
              </span>
            </div>
          ))}
      </div>

      {/* Upcoming maintenance */}
      {upcoming.length > 0 && (
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
            Scheduled
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcoming.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--almanac-surface)',
                  border: `1px solid var(--almanac-border)`,
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: statusColor(item),
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--almanac-ink)' }}>
                    {item.title}
                  </div>
                  {item.due_date && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--almanac-muted)',
                        fontFamily: 'var(--font-jetbrains-mono)',
                        marginTop: 2,
                      }}
                    >
                      {item.due_date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* History */}
      {history.length > 0 && (
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
            History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'var(--almanac-surface)',
                  border: '1px solid var(--almanac-border-soft)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: 0.65,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: statusColor(item),
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--almanac-ink)',
                      textDecoration: 'line-through',
                    }}
                  >
                    {item.title}
                  </div>
                  {item.completed_date && (
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--almanac-muted)',
                        fontFamily: 'var(--font-jetbrains-mono)',
                        marginTop: 2,
                      }}
                    >
                      Done {item.completed_date}
                      {item.cost_cents
                        ? ` · $${(item.cost_cents / 100).toFixed(0)}`
                        : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <p style={{ fontSize: 14, color: 'var(--almanac-muted)', textAlign: 'center', padding: '24px 0' }}>
          No maintenance events yet. Ask Sembli to schedule one.
        </p>
      )}
    </div>
  )
}
