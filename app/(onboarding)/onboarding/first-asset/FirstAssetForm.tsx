'use client'

import { useState, useRef } from 'react'
import { createFirstAsset, skipFirstAsset } from './actions'
import type { ExtractedAsset } from '@/app/api/ai/extract-asset/route'
import { useAnalytics } from '@/lib/analytics'

type Mode = 'choose' | 'text' | 'photo' | 'confirm' | 'loading'

const ALMANAC = {
  bg: 'var(--almanac-bg)',
  surface: 'var(--almanac-surface)',
  surfaceAlt: 'var(--almanac-surface-alt)',
  ink: 'var(--almanac-ink)',
  inkSoft: 'var(--almanac-ink-soft)',
  muted: 'var(--almanac-muted)',
  border: 'var(--almanac-border)',
  borderSoft: 'var(--almanac-border-soft)',
  brand: 'var(--almanac-brand)',
  brandDeep: 'var(--almanac-brand-deep)',
  brandSoft: 'var(--almanac-brand-soft)',
  danger: 'var(--almanac-danger)',
}

function HvacIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="14" width="40" height="20" rx="4" stroke={ALMANAC.ink} strokeWidth="2" fill={ALMANAC.surfaceAlt} />
      <circle cx="16" cy="24" r="5" stroke={ALMANAC.brandDeep} strokeWidth="1.5" />
      <circle cx="16" cy="24" r="2" fill={ALMANAC.brandDeep} />
      <line x1="26" y1="19" x2="38" y2="19" stroke={ALMANAC.muted} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="24" x2="38" y2="24" stroke={ALMANAC.muted} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="29" x2="34" y2="29" stroke={ALMANAC.muted} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FieldRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${ALMANAC.borderSoft}` }}>
      <span style={{ fontSize: 10, color: ALMANAC.muted, fontFamily: 'var(--font-jetbrains-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: value ? ALMANAC.ink : ALMANAC.muted, fontWeight: value ? 500 : 400 }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

export function FirstAssetForm() {
  const [mode, setMode] = useState<Mode>('choose')
  const [textInput, setTextInput] = useState('')
  const [extracted, setExtracted] = useState<ExtractedAsset | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { track } = useAnalytics()

  async function extractFromText() {
    if (!textInput.trim()) return
    setMode('loading')
    setError('')
    try {
      const res = await fetch('/api/ai/extract-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'text', content: textInput }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Extraction failed')
      setExtracted(data.asset)
      setMode('confirm')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong — try again.')
      setMode('text')
    }
  }

  async function extractFromPhoto(file: File) {
    setMode('loading')
    setError('')
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'
      const res = await fetch('/api/ai/extract-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'image', content: base64, mediaType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Extraction failed')
      setExtracted(data.asset)
      setMode('confirm')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read the photo — try describing it instead.')
      setMode('choose')
    }
  }

  async function handleConfirm() {
    if (!extracted) return
    setSubmitting(true)
    // Track before server action (which redirects)
    const source = textInput ? 'ai_extracted' : 'photo'
    track('asset_created', { category: 'HVAC', source })
    await createFirstAsset({
      name: extracted.name,
      brand: extracted.brand,
      model: extracted.model,
      serial_number: extracted.serial_number,
      install_year: extracted.install_year,
      expected_life_years: extracted.expected_life_years ?? 15,
      notes: extracted.notes,
      source: 'ai_inferred',
    })
  }

  async function handleSkip() {
    setSubmitting(true)
    await skipFirstAsset()
  }

  const shell = (children: React.ReactNode) => (
    <div style={{ minHeight: '100dvh', background: ALMANAC.bg, display: 'flex', flexDirection: 'column', padding: '52px 24px 32px' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: ALMANAC.muted, marginBottom: 8 }}>
          Step 2 of 2
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 36, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, color: ALMANAC.ink, margin: 0 }}>
          Your HVAC<br />
          <span style={{ fontStyle: 'italic', color: ALMANAC.brandDeep }}>system.</span>
        </h1>
      </div>
      {children}
    </div>
  )

  if (mode === 'loading') {
    return shell(
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <HvacIcon />
        <p style={{ fontSize: 15, color: ALMANAC.inkSoft, textAlign: 'center' }}>
          Reading your HVAC details…
        </p>
      </div>
    )
  }

  if (mode === 'confirm' && extracted) {
    return shell(
      <div>
        <p style={{ fontSize: 14.5, color: ALMANAC.inkSoft, marginBottom: 20, lineHeight: 1.55 }}>
          Here&rsquo;s what we found. Confirm and we&rsquo;ll build your maintenance schedule.
        </p>

        <div style={{ background: ALMANAC.surface, border: `1px solid ${ALMANAC.border}`, borderRadius: 16, padding: '4px 16px', marginBottom: 24 }}>
          <FieldRow label="Name" value={extracted.name} />
          <FieldRow label="Brand" value={extracted.brand} />
          <FieldRow label="Model" value={extracted.model} />
          <FieldRow label="Serial" value={extracted.serial_number} />
          <FieldRow label="Install year" value={extracted.install_year?.toString()} />
          <FieldRow label="Expected life" value={extracted.expected_life_years ? `${extracted.expected_life_years} years` : null} />
          {extracted.notes && <FieldRow label="Notes" value={extracted.notes} />}
        </div>

        {extracted.confidence === 'low' && (
          <p style={{ fontSize: 12.5, color: ALMANAC.muted, marginBottom: 20 }}>
            Low confidence — some fields may be missing. You can edit them later.
          </p>
        )}

        <button
          onClick={handleConfirm}
          disabled={submitting}
          style={{ width: '100%', padding: '15px', borderRadius: 999, border: 0, background: ALMANAC.ink, color: ALMANAC.bg, fontSize: 16, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? 'Saving…' : 'Looks good — save it →'}
        </button>

        <button
          onClick={() => setMode('choose')}
          style={{ width: '100%', marginTop: 12, padding: '14px', borderRadius: 999, border: `1px solid ${ALMANAC.border}`, background: 'transparent', color: ALMANAC.inkSoft, fontSize: 15, cursor: 'pointer' }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (mode === 'text') {
    return shell(
      <div>
        <p style={{ fontSize: 14.5, color: ALMANAC.inkSoft, marginBottom: 20, lineHeight: 1.55 }}>
          Describe what you know — brand, age, anything on the nameplate. Even &ldquo;not much&rdquo; helps.
        </p>
        <textarea
          autoFocus
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder={'e.g. "Carrier unit, installed around 2018, I think it\'s a 3-ton"'}
          rows={4}
          style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: `1px solid ${ALMANAC.border}`, background: ALMANAC.surface, color: ALMANAC.ink, fontSize: 15, fontFamily: 'var(--font-inter)', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        />
        {error && <p style={{ fontSize: 13, color: ALMANAC.danger, marginTop: 8 }}>{error}</p>}
        <button
          onClick={extractFromText}
          disabled={!textInput.trim()}
          style={{ width: '100%', marginTop: 12, padding: '15px', borderRadius: 999, border: 0, background: ALMANAC.ink, color: ALMANAC.bg, fontSize: 16, fontWeight: 600, cursor: textInput.trim() ? 'pointer' : 'not-allowed', opacity: textInput.trim() ? 1 : 0.5 }}
        >
          Extract details →
        </button>
        <button
          onClick={() => setMode('choose')}
          style={{ width: '100%', marginTop: 12, padding: '14px', borderRadius: 999, border: 0, background: 'transparent', color: ALMANAC.muted, fontSize: 14, cursor: 'pointer' }}
        >
          ← Back
        </button>
      </div>
    )
  }

  // Default: choose mode
  return shell(
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <HvacIcon />
      </div>
      <p style={{ fontSize: 14.5, color: ALMANAC.inkSoft, marginBottom: 28, lineHeight: 1.55, textAlign: 'center' }}>
        HVAC is the most expensive system in your home. Let&rsquo;s track it first.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) extractFromPhoto(file)
          }}
        />

        <button
          onClick={() => fileRef.current?.click()}
          style={{ width: '100%', padding: '16px', borderRadius: 14, border: `1.5px solid ${ALMANAC.brand}`, background: ALMANAC.brandSoft, color: ALMANAC.ink, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <span style={{ fontSize: 22 }}>📷</span>
          <span>
            <div style={{ fontWeight: 600 }}>Photo of the nameplate</div>
            <div style={{ fontSize: 12.5, color: ALMANAC.inkSoft, fontWeight: 400, marginTop: 2 }}>We&rsquo;ll read the label automatically</div>
          </span>
        </button>

        <button
          onClick={() => setMode('text')}
          style={{ width: '100%', padding: '16px', borderRadius: 14, border: `1px solid ${ALMANAC.border}`, background: ALMANAC.surface, color: ALMANAC.ink, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14 }}
        >
          <span style={{ fontSize: 22 }}>✏️</span>
          <span>
            <div style={{ fontWeight: 600 }}>Describe it</div>
            <div style={{ fontSize: 12.5, color: ALMANAC.inkSoft, fontWeight: 400, marginTop: 2 }}>Tell us the brand, age, or model</div>
          </span>
        </button>

        {error && <p style={{ fontSize: 13, color: ALMANAC.danger }}>{error}</p>}

        <button
          onClick={handleSkip}
          disabled={submitting}
          style={{ width: '100%', marginTop: 8, padding: '14px', borderRadius: 999, border: 0, background: 'transparent', color: ALMANAC.muted, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer' }}
        >
          {submitting ? 'Skipping…' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}
