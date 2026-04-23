'use client'

import { useState } from 'react'
import Image from 'next/image'
import { IPhoneFrame } from '@/components/ui/IPhoneFrame'
import { Eyebrow } from '@/components/ui/eyebrow'
import { submitWaitlist } from '@/app/(marketing)/actions'
import { trackCtaFocused, trackCtaSubmitted, trackWaitlistSuccess } from '@/components/marketing/Analytics'

export function Hero() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    trackCtaSubmitted('hero')
    const result = await submitWaitlist(email, 'hero')
    if (result.success) {
      trackWaitlistSuccess('hero')
      setState('success')
      setMessage(result.message)
      setEmail('')
    } else {
      setState('error')
      setMessage(result.message)
    }
  }

  return (
    <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:gap-16">

        {/* Text */}
        <div className="flex-1 min-w-0">
          <Eyebrow className="mb-4">Sembli · Private beta · 2026</Eyebrow>

          <h1
            className="font-heading font-normal leading-[1.03] tracking-[-2px] mb-5"
            style={{ fontSize: 'clamp(42px, 7vw, 72px)', color: '#1A1814' }}
          >
            Your home,<br />
            <em style={{ fontStyle: 'italic', color: '#B8860B' }}>remembered.</em>
          </h1>

          <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(26,24,20,0.5)' }}>
            Long-distance caretaker opens the app, talks for two minutes, leaves with a cited 10-year outlook. No forms.
          </p>

          {state === 'success' ? (
            <p className="text-sm font-mono" style={{ color: '#B8860B' }}>
              ✓ {message}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={trackCtaFocused}
                className="flex-1 px-4 py-3 rounded-lg text-sm outline-none font-sans"
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

        {/* iPhone mockup */}
        <div className="hidden md:flex justify-center mt-12 md:mt-0 flex-shrink-0">
          <IPhoneFrame size="hero">
            <Image
              src="/screenshots/onboarding-chat.jpg"
              alt="Sembli onboarding — chat-first intake screen"
              width={375}
              height={812}
              className="w-full h-full object-cover object-top"
              priority
            />
          </IPhoneFrame>
        </div>

      </div>
    </section>
  )
}
