'use client'

import { useState } from 'react'
import { submitWaitlist } from '@/app/(marketing)/actions'

export function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    const result = await submitWaitlist(email, 'footer')
    if (result.success) {
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
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(232,210,106,0.03)',
      }}
    >
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.8px] mb-4" style={{ color: 'rgba(232,210,106,0.5)' }}>
          Private beta
        </p>
        <h2
          className="font-heading font-normal tracking-tight mb-4"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#F0EBE0', lineHeight: 1.05 }}
        >
          Be first through the door.
        </h2>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.42)' }}>
          Private beta opens summer 2026. Join the list and we&apos;ll reach out before anyone else.
        </p>

        {state === 'success' ? (
          <p className="text-sm font-mono" style={{ color: '#E8D26A' }}>✓ {message}</p>
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#F0EBE0',
              }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="px-5 py-3 rounded-lg text-sm font-medium transition-opacity disabled:opacity-60 whitespace-nowrap"
              style={{ background: '#E8D26A', color: '#1A1814' }}
            >
              {state === 'loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}

        {state === 'error' && (
          <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{message}</p>
        )}
      </div>
    </section>
  )
}
