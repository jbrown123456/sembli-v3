'use client'

import { useEffect, useRef } from 'react'
import posthog from 'posthog-js'

export function LandingAnalytics() {
  const scrollFired = useRef(new Set<number>())

  useEffect(() => {
    posthog.capture('landing_page_viewed')

    const thresholds = [25, 50, 75, 100]

    function onScroll() {
      const pct = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      for (const t of thresholds) {
        if (pct >= t && !scrollFired.current.has(t)) {
          scrollFired.current.add(t)
          posthog.capture('landing_scroll_depth', { depth: t })
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}

export function trackCtaFocused() {
  posthog.capture('landing_cta_focused')
}

export function trackCtaSubmitted(source: string) {
  posthog.capture('landing_cta_submitted', { source })
}

export function trackWaitlistSuccess(source: string) {
  posthog.capture('landing_waitlist_success', { source })
}
