# Task 12 — Pre-launch QA + launch

**Phase:** 9  
**Owner:** Joey + Claude Code  
**Status:** 🔵 In progress  
**Blocked by:** Tasks 05–11 ✅, Joey environment checklist (see Task 11)

---

## Goal

Confirm the app is shippable. No new features — only verification, fixes, and go/no-go on launch.

---

## Claude Code responsibilities

### A — Automated checks (run locally)

- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm lint` — zero errors / warnings
- [ ] Spot-check critical routes render without crashes (visual review)

### B — Route audit

Verify every route exists and is guarded correctly:

| Route | Auth required | Notes |
|-------|--------------|-------|
| `/` | No | Marketing landing page |
| `/privacy`, `/terms`, `/cookies` | No | Legal pages |
| `/auth/signin` | No | Redirects → /dashboard if authed |
| `/auth/callback` | No | Exchange magic link code |
| `/auth/signout` | No | Clears session, redirects → /signin |
| `/onboarding` | Yes | Redirects → /dashboard if onboarding_complete |
| `/dashboard` | Yes | Home dashboard |
| `/assets` | Yes | Asset inventory |
| `/assets/[id]` | Yes | Asset detail |
| `/chat` | Yes | AI chat (Pro gate) |
| `/timeline` | Yes | Maintenance calendar |
| `/settings` | Yes | Account + subscription |
| `/upgrade` | Yes | Stripe Checkout CTA |
| `/api/chat` | Yes (Pro) | SSE stream |
| `/api/ai/extract-asset` | Yes | Vision intake |
| `/api/webhooks/stripe` | No (sig verify) | Stripe events |

### C — Paywall audit

- Free users hitting `/api/chat` → 403 with upgrade message ✅ (wired)
- Free users at 5 assets → asset creation blocked (verify in `first-asset` actions)
- `/upgrade` shows "You're on Pro ✓" for Pro users ✅ (wired via entitlements)

### D — Mobile layout check

- [ ] Landing page at 375px: hero, iPhone frame, waitlist form all visible
- [ ] Dashboard at 375px: asset cards, BottomNav, FAB don't overlap
- [ ] Onboarding at 375px: chat bubbles fit, CTA buttons full-width
- [ ] Settings at 375px: all sections readable

---

## Joey responsibilities (blocking launch)

Complete the production environment checklist from Task 11:

- [ ] All env vars set in Vercel Production environment (see `.env.example`)
- [ ] Supabase Auth redirect URLs include `https://sembli.co/auth/callback`
- [ ] Supabase migrations run on prod project (`supabase db push`)
- [ ] Stripe webhook endpoint registered: `https://sembli.co/api/webhooks/stripe`
  - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Stripe test mode → live mode keys swapped
- [ ] Sentry DSN set in Vercel (create project at sentry.io)
- [ ] PostHog production project key (create at posthog.com)
- [ ] `NEXT_PUBLIC_SITE_URL=https://sembli.co` set in Vercel
- [ ] Domain DNS pointing at Vercel + HTTPS confirmed
- [ ] Fill placeholder legal copy in `/privacy`, `/terms`, `/cookies`

---

## Go/no-go criteria

**Must pass:**
- [ ] `pnpm typecheck` clean
- [ ] `pnpm lint` clean  
- [ ] Auth flow (magic link → onboarding → dashboard) works end-to-end on staging
- [ ] Stripe Checkout completes in test mode → subscription row updated
- [ ] Stripe webhook updates subscription status correctly
- [ ] Pro paywall blocks free users from AI chat
- [ ] Landing page waitlist form submits successfully
- [ ] All production env vars set in Vercel

**Nice to have (post-launch):**
- Lighthouse performance score ≥ 80 on mobile
- Legal pages have real copy (not placeholder)
- GDPR cookie consent banner

---

## Out of scope for launch

- End-to-end test suite (Playwright/Vitest) — add post-launch
- Custom 404/500 pages — Next.js defaults are fine
- In-app notifications — post-launch
- Multi-home management — post-launch
