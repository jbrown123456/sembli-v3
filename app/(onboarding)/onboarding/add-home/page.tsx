'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createHome } from '@/app/(onboarding)/onboarding/actions'

export default function AddHomePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [relationship, setRelationship] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')

    const result = await createHome({
      name: name.trim(),
      address: address.trim() || undefined,
      ownerRelationship: relationship.trim() || undefined,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/onboarding/first-asset')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--almanac-bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: '52px 24px 32px',
        color: 'var(--almanac-ink)',
      }}
    >
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains-mono)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--almanac-muted)',
            marginBottom: 8,
          }}
        >
          Step 1 of 2
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Name the{' '}
          <span style={{ fontStyle: 'italic', color: 'var(--almanac-brand-deep)' }}>home.</span>
        </h1>
        <p
          style={{
            marginTop: 12,
            fontSize: 14.5,
            lineHeight: 1.55,
            color: 'var(--almanac-ink-soft)',
          }}
        >
          Give it a name you&apos;ll recognize. You can track multiple homes later.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Home name */}
        <div>
          <label
            htmlFor="home-name"
            style={{
              display: 'block',
              fontSize: 11,
              fontFamily: 'var(--font-jetbrains-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--almanac-muted)',
              marginBottom: 6,
            }}
          >
            Home name *
          </label>
          <input
            id="home-name"
            type="text"
            required
            autoFocus
            placeholder="Mom's house, Dad's place…"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 12,
              border: '1px solid var(--almanac-border)',
              background: 'var(--almanac-surface)',
              color: 'var(--almanac-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-inter)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Address (optional) */}
        <div>
          <label
            htmlFor="home-address"
            style={{
              display: 'block',
              fontSize: 11,
              fontFamily: 'var(--font-jetbrains-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--almanac-muted)',
              marginBottom: 6,
            }}
          >
            Address <span style={{ opacity: 0.5 }}>(optional)</span>
          </label>
          <input
            id="home-address"
            type="text"
            placeholder="412 Oak St, Des Moines IA"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 12,
              border: '1px solid var(--almanac-border)',
              background: 'var(--almanac-surface)',
              color: 'var(--almanac-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-inter)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Relationship (optional) */}
        <div>
          <label
            htmlFor="relationship"
            style={{
              display: 'block',
              fontSize: 11,
              fontFamily: 'var(--font-jetbrains-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--almanac-muted)',
              marginBottom: 6,
            }}
          >
            Whose home? <span style={{ opacity: 0.5 }}>(optional)</span>
          </label>
          <input
            id="relationship"
            type="text"
            placeholder="My mother's home, my parents' place…"
            value={relationship}
            onChange={e => setRelationship(e.target.value)}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: 12,
              border: '1px solid var(--almanac-border)',
              background: 'var(--almanac-surface)',
              color: 'var(--almanac-ink)',
              fontSize: 16,
              fontFamily: 'var(--font-inter)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: 'var(--almanac-danger)', margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || loading}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '15px',
            borderRadius: 999,
            border: 0,
            background: 'var(--almanac-ink)',
            color: 'var(--almanac-bg)',
            fontSize: 16,
            fontWeight: 600,
            fontFamily: 'var(--font-inter)',
            cursor: !name.trim() || loading ? 'not-allowed' : 'pointer',
            opacity: !name.trim() || loading ? 0.5 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          {loading ? 'Saving…' : 'Next — add your HVAC →'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'transparent',
            border: 0,
            fontSize: 13,
            color: 'var(--almanac-muted)',
            cursor: 'pointer',
            padding: '10px',
          }}
        >
          Skip for now
        </button>
      </form>
    </div>
  )
}
