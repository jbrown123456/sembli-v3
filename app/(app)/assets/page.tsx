import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Asset } from '@/lib/supabase/types'

export const metadata = { title: 'Assets — Sembli' }

function AssetRow({ asset }: { asset: Asset }) {
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
    <Link href={`/assets/${asset.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--almanac-surface)',
          border: '1px solid var(--almanac-border)',
          borderRadius: 14,
          padding: '14px 16px',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--almanac-ink)' }}>
              {asset.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--almanac-muted)', marginTop: 2 }}>
              {asset.brand
                ? `${asset.brand}${asset.model ? ` · ${asset.model}` : ''}`
                : asset.install_year
                ? `Installed ${asset.install_year}`
                : 'No details recorded'}
            </div>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains-mono)',
              fontSize: 9.5,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.04em',
              color: 'var(--almanac-muted)',
              background: 'var(--almanac-surface-alt)',
              padding: '3px 8px',
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            {asset.category ?? 'Asset'}
          </div>
        </div>

        {pct !== null && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: 'var(--almanac-muted)' }}>
                {age}yr of {life}yr lifespan
              </span>
              <span style={{ fontSize: 11, color: barColor, fontWeight: 600 }}>
                {100 - pct}% remaining
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: 'var(--almanac-surface-alt)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 2 }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default async function AssetsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: home } = user
    ? await supabase
        .from('homes')
        .select('id, name')
        .eq('owner_id', user.id)
        .limit(1)
        .single()
    : { data: null }

  const { data: assets } = home
    ? await supabase
        .from('assets')
        .select('*')
        .eq('home_id', home.id)
        .order('category')
        .order('name')
    : { data: [] as Asset[] }

  const list = assets ?? []

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
        {home?.name ?? 'Your home'}
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

      {list.length === 0 ? (
        <div
          style={{
            background: 'var(--almanac-brand-soft)',
            border: '1px solid var(--almanac-brand)',
            borderRadius: 16,
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 14.5,
              color: 'var(--almanac-ink-soft)',
              marginBottom: 16,
              lineHeight: 1.55,
            }}
          >
            No assets tracked yet. Add your first one to get started.
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
            Add first asset →
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {list.map(asset => (
              <AssetRow key={asset.id} asset={asset} />
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
        </>
      )}
    </div>
  )
}
