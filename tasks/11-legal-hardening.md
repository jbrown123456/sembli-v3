# Task 11 — Legal + Production Hardening

**Phase:** 8
**Owner:** Joey + Claude Code
**Status:** ⚪ Pending
**Blocks:** 12
**Depends on:** 03, 08

## Goal

Ship the legal pages, lock down security headers, rate limits, and production configuration. Nothing here is user-facing magic — it's the unsexy work that makes the app safe to launch publicly.

## Legal pages (Claude Code builds shell, Joey fills copy)

| Route | Page | Notes |
|---|---|---|
| `/privacy` | Privacy Policy | GDPR + CCPA basics. What data we collect, how it's used, how to delete. |
| `/terms` | Terms of Service | Usage rules, disclaimer of warranties, limitation of liability. |
| `/cookies` | Cookie Policy | PostHog, Stripe, Supabase Auth cookies listed. |

All three pages:
- Use `(marketing)` layout (warm light palette)
- Last updated date in frontmatter (update before launch)
- Linked from `MarketingFooter` (already rendered on landing page)
- Linked from in-app settings menu (Task 11 adds a basic settings page)

**Joey's job:** fill in the actual legal text before launch. Claude Code ships the page shells with `[PLACEHOLDER — fill before launch]` callouts.

## Security headers

`next.config.ts` — add `headers()`:

```ts
{
  key: 'X-Frame-Options', value: 'DENY'
  key: 'X-Content-Type-Options', value: 'nosniff'
  key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'
  key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()'
  key: 'Content-Security-Policy', value: "..."
}
```

CSP must allow:
- `'self'` for scripts/styles
- `https://us.i.posthog.com` for PostHog
- `https://js.stripe.com` for Stripe
- `https://*.supabase.co` for Supabase

## Rate limiting

`lib/rateLimit.ts` — simple in-memory + Supabase-backed rate limiter:
- Waitlist signups: 5/hour per IP (already done in Task 10)
- Auth sign-in: 10 attempts/hour per email
- Asset AI extraction: 10/hour per user (already done in Task 05)
- Chat messages: 30/hour per user Pro, 0 Free (already done in Task 07)

Upgrade to Upstash Redis if Vercel serverless restarts become a problem (post-launch).

## Production environment checklist

Joey must complete these in Vercel + Supabase dashboards before Task 12:

- [ ] All env vars set in Vercel Production environment
- [ ] Supabase Auth redirect URLs include `https://sembli.co/auth/callback`
- [ ] Stripe webhook endpoint registered for `https://sembli.co/api/webhooks/stripe`
- [ ] Stripe test mode → live mode keys swapped
- [ ] Sentry DSN and auth token set in Vercel
- [ ] PostHog project key for production (separate from dev key)
- [ ] `NEXT_PUBLIC_SITE_URL=https://sembli.co` set in Vercel

## Settings page

`app/(app)/settings/page.tsx` — simple settings shell:
- Account section: display name (editable), email (read-only), sign out button
- Subscription section: current plan badge, "Manage subscription" → Stripe portal, "Upgrade" CTA if Free
- Legal section: links to Privacy, Terms, Cookies
- Danger zone: "Delete my account" — modal confirming, calls server action to delete profile + Supabase auth user

`deleteAccount` server action:
1. Delete all user data (cascades via FK)
2. Cancel Stripe subscription if active
3. Call `supabase.auth.admin.deleteUser(userId)` via service role
4. Sign out + redirect to `/`

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] `/privacy`, `/terms`, `/cookies` render with placeholder copy
- [ ] Security headers present on all routes (verify via `curl -I`)
- [ ] `X-Frame-Options: DENY` confirmed
- [ ] Settings page renders with account, subscription, legal sections
- [ ] "Delete my account" modal works end-to-end in staging
- [ ] All items in production environment checklist completed by Joey

## Out of scope

- GDPR data export endpoint (post-launch if needed)
- Cookie consent banner (PostHog has anonymous mode; add banner if needed for EU launch)
- Custom 404 / 500 pages — use Next.js defaults for now
