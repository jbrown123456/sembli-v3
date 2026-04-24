'use client'

import { useState } from 'react'
import { submitWaitlist } from '@/app/(marketing)/actions'
import { trackCtaSubmitted, trackWaitlistSuccess } from '@/components/marketing/Analytics'
import { useWaitlist } from '@/components/marketing/WaitlistContext'

export function WaitlistSection() {
  const [email, setEmail] = useState('')
  const { state, message, setState, setMessage } = useWaitlist()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    trackCtaSubmitted('footer')
    const result = await submitWaitlist(email, 'footer')
    if (result.success) {
      trackWaitlistSuccess('footer')
      setState('success')
      setMessage(result.message)
      setEmail('')
    } else {
      setState('error')
      setMessage(result.message)
    }
  }

  return (
    <section
      className="px-6 py-24 md:py-32 text-center"
      style={{
        borderTop: '1px solid rgba(26,24,20,0.08)',
        background: 'rgba(184,134,11,0.06)',
      }}
    >
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.8px] mb-4" style={{ color: 'rgba(184,134,11,0.7)' }}>
          Private beta
        </p>
        <h2
          className="font-heading font-normal tracking-tight mb-4"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#1A1814', lineHeight: 1.05 }}
        >
          Be first through the door.
        </h2>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(26,24,20,0.5)' }}>
          Private beta opens summer 2026. Join the list and we&apos;ll reach out before anyone else.
        </p>

        {state === 'success' ? (
          <p className="text-sm font-mono" style={{ color: '#B8860B' }}>✓ {message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{
                background: 'rgba(26,24,20,0.05)',
                border: '1px solid rgba(26,24,20,0.15)',
                color: '#1A1814',
              }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="px-5 py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60 whitespace-nowrap"
              style={{ background: '#1A1814', color: '#F5F0E8' }}
            >
              {state === 'loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}

        {state === 'error' && (
          <p className="mt-3 text-xs" style={{ color: 'rgba(26,24,20,0.4)' }}>{message}</p>
        )}
      </div>
    </section>
  )
}
