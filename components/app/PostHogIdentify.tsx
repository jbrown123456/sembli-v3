'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/lib/analytics'

interface PostHogIdentifyProps {
  userId: string
  plan: string
  homesCount: number
  assetsCount: number
  homeId?: string
  homeName?: string
  homeYearBuilt?: number | null
}

/**
 * Fires posthog.identify() once per session after auth.
 * Drop into any authenticated server layout as a client leaf node.
 */
export function PostHogIdentify({
  userId,
  plan,
  homesCount,
  assetsCount,
  homeId,
  homeName,
  homeYearBuilt,
}: PostHogIdentifyProps) {
  const { identify, groupHome, track } = useAnalytics()

  useEffect(() => {
    identify(userId, { plan, homes_count: homesCount, assets_count: assetsCount })
    if (homeId) {
      groupHome(homeId, { name: homeName, year_built: homeYearBuilt })
    }
    track('app_loaded', { path: window.location.pathname })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return null
}
