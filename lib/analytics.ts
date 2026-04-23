/**
 * Sembli analytics — typed PostHog event helpers.
 * Import useAnalytics() in any client component.
 */

'use client'

import { usePostHog } from 'posthog-js/react'

// ─── Event catalogue ──────────────────────────────────────────

export type AnalyticsEvent =
  | { name: 'app_loaded';                  props: { path: string } }
  | { name: 'onboarding_started';          props?: Record<string, never> }
  | { name: 'onboarding_step_completed';   props: { step: number } }
  | { name: 'onboarding_completed';        props: { home_name_set: boolean; has_hvac: boolean } }
  | { name: 'asset_created';               props: { category: string; source: 'manual' | 'ai_extracted' | 'photo' } }
  | { name: 'maintenance_event_completed'; props: { had_cost: boolean; had_vendor: boolean } }
  | { name: 'maintenance_event_added';     props?: Record<string, never> }
  | { name: 'chat_message_sent';           props: { conversation_id: string; is_new_conversation: boolean } }
  | { name: 'chat_tool_used';              props: { tool_name: string } }
  | { name: 'upgrade_prompt_shown';        props: { trigger: 'asset_limit' | 'chat' | 'docs' } }
  | { name: 'upgrade_cta_clicked';         props: { plan: 'monthly' | 'yearly'; source: string } }
  | { name: 'checkout_completed';          props: { plan: string } }

// ─── Hook ─────────────────────────────────────────────────────

export function useAnalytics() {
  const posthog = usePostHog()

  function track<E extends AnalyticsEvent>(event: E['name'], props?: Extract<AnalyticsEvent, { name: E['name'] }>['props']) {
    posthog?.capture(event, props ?? {})
  }

  function identify(userId: string, traits: { plan?: string; homes_count?: number; assets_count?: number }) {
    posthog?.identify(userId, traits)
  }

  function groupHome(homeId: string, traits: { name?: string; year_built?: number | null }) {
    posthog?.group('home', homeId, traits)
  }

  function reset() {
    posthog?.reset()
  }

  return { track, identify, groupHome, reset }
}
