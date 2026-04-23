# Task 09 — Analytics + Observability

**Phase:** 6
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** —
**Depends on:** 02

## Goal

Wire up full product analytics (PostHog) and error monitoring (Sentry) across the app. Landing page already has PostHog events from Task 10 — this task extends it to the authenticated app shell and adds Sentry.

## PostHog — App events

PostHog provider is already initialized in `lib/posthog.tsx`. Extend with a `useAnalytics` hook for the app shell.

### Event taxonomy

| Event | When | Properties |
|---|---|---|
| `app_loaded` | User lands on any `(app)` route | `{ path }` |
| `onboarding_started` | `/onboarding` mounts | — |
| `onboarding_step_completed` | Each screen advance | `{ step: 1–5 }` |
| `onboarding_completed` | Final "Let's go" | `{ home_name_set, has_hvac }` |
| `asset_created` | Asset saved | `{ category, source: 'manual' \| 'ai_extracted' \| 'photo' }` |
| `maintenance_event_completed` | Event marked done | `{ had_cost, had_vendor }` |
| `maintenance_event_added` | Manual event added | — |
| `chat_message_sent` | User sends a chat message | `{ conversation_id, is_new_conversation }` |
| `chat_tool_used` | Claude uses a tool | `{ tool_name }` |
| `upgrade_prompt_shown` | Paywall displayed | `{ trigger: 'asset_limit' \| 'chat' \| 'docs' }` |
| `upgrade_cta_clicked` | "Upgrade" button tapped | `{ plan: 'monthly' \| 'yearly', source }` |
| `checkout_completed` | Stripe success redirect | `{ plan }` |

### User identification

Call `posthog.identify(userId, { plan, homes_count, assets_count })` after sign-in. Call `posthog.reset()` on sign-out.

### Group analytics (optional, if PostHog plan supports)

Identify home as a group: `posthog.group('home', homeId, { name, year_built })`.

## Sentry

### Install

```bash
pnpm add @sentry/nextjs
```

Run wizard or manually configure `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts` (withSentryConfig wrapper).

### Configuration

- **DSN:** from Sentry project settings
- **Environment:** `process.env.NODE_ENV` (`development` / `production`)
- **Traces:** sample rate 0.1 in prod (10% of transactions)
- **Replay:** 10% sessions, 100% on error
- **PII scrubbing:** mask email + names in breadcrumbs

### Error boundaries

Wrap `app/(app)/layout.tsx` and `app/(marketing)/layout.tsx` with Sentry error boundary. Fallback UI: simple "Something went wrong" with retry button — styled to match each palette.

### Supabase + Stripe error tagging

In server actions and API routes, catch errors and call:
```ts
Sentry.withScope(scope => {
  scope.setTag('source', 'stripe_webhook')
  scope.setUser({ id: userId })
  Sentry.captureException(err)
})
```

## Performance monitoring

PostHog Web Vitals via `next/script` is already in the marketing layout. Add to app layout too:
- LCP, FID, CLS, TTFB tracked as PostHog properties on `app_loaded`

## Env vars

```
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...      # for source map upload (CI only)
SENTRY_ORG=sembli
SENTRY_PROJECT=sembli-app
```

Add all to `.env.example`.

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] All listed PostHog events fire at correct moments (verify in PostHog Live Events)
- [ ] `posthog.identify` called on sign-in, `posthog.reset` on sign-out
- [ ] Sentry DSN configured, test error captured in Sentry dashboard
- [ ] Error boundary shows fallback UI instead of white screen on unhandled throw
- [ ] No PII (email, name) in Sentry breadcrumbs/events
- [ ] Source maps uploaded to Sentry in CI (`SENTRY_AUTH_TOKEN` set in Vercel env)

## Out of scope

- Custom Sentry dashboards / alerts (set up in Sentry UI by Joey)
- PostHog feature flags (post-launch)
- A/B testing
- Revenue analytics (Stripe dashboard covers this)
