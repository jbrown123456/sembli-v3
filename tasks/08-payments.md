# Task 08 — Payments: Stripe Checkout + Paywall

**Phase:** 5
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** —
**Depends on:** 03, #13 (pricing — locked below)

## Decision locked (#13)

**Free tier:** 1 home, up to 5 assets, no AI chat (Ask Sembli)
**Pro — $9/month or $79/year:** unlimited homes + assets, Ask Sembli AI, document storage, PDF/photo intake

The AI chat is the gate. Free users can see the shell but hit an upgrade prompt when they tap Ask Sembli or try to add a 6th asset.

## Stripe setup

- **Products:** one product "Sembli Pro"
- **Prices:** two prices — `price_monthly` ($9/month) + `price_yearly` ($79/year)
- **Mode:** Subscription (recurring)
- **Portal:** Stripe Customer Portal for cancel / manage

## Database

Migration `0005_subscriptions.sql`:

```sql
create type subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete'
);

create table subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  owner_id             uuid not null references profiles(id) on delete cascade unique,
  stripe_customer_id   text unique,
  stripe_subscription_id text unique,
  status               subscription_status not null default 'incomplete',
  plan                 text not null default 'free',   -- 'free' | 'pro_monthly' | 'pro_yearly'
  current_period_end   timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table subscriptions enable row level security;
create policy "subscriptions_owner_select" on subscriptions
  for select using (auth.uid() = owner_id);

-- Service role only for writes (webhook handler)
```

Auto-create a `free` subscription row on profile creation (update `handle_new_user` trigger).

## Entitlement helper

`lib/entitlements.ts`:

```ts
export async function getEntitlements(userId: string) {
  // Reads subscriptions table via server client
  // Returns { plan, isPro, assetLimit, canUseAI, canUploadDocs }
}
```

Use this in every gated server action / page — not raw DB reads.

## Routes + pages

| File | What |
|---|---|
| `app/(app)/upgrade/page.tsx` | Upgrade page: Free vs Pro comparison + CTA |
| `app/(app)/upgrade/actions.ts` | `createCheckoutSession`, `createPortalSession` |
| `app/api/webhooks/stripe/route.ts` | Webhook handler — processes `customer.subscription.*` events |

### Checkout flow

1. User taps "Upgrade to Pro" anywhere
2. `createCheckoutSession` server action:
   - Create or retrieve Stripe Customer (store `stripe_customer_id` on `subscriptions`)
   - Create Checkout Session (monthly or yearly price, success/cancel URLs)
   - Redirect to Stripe-hosted checkout
3. On success → Stripe webhook fires `customer.subscription.created`
4. Webhook handler updates `subscriptions` table
5. User lands back at `/dashboard` — now Pro

### Portal flow

Settings page → "Manage subscription" → `createPortalSession` → Stripe portal → user cancels/changes → webhook updates DB.

## Paywall enforcement

Two gates:

**Asset limit (Free: 5 max)**
- In `app/(app)/assets/page.tsx` — check entitlements before showing "Add asset" button
- In the add-asset server action — re-check entitlement, return error if at limit

**AI chat (Pro only)**
- In `/chat` page — render `UpgradePrompt` component if `!isPro`
- In `app/api/chat/route.ts` — return 402 if `!isPro`

Show upgrade prompts in-context, not just redirect. E.g. dimmed composer with "Ask Sembli is a Pro feature — upgrade to unlock" overlay.

## Webhook security

Verify Stripe signature on every webhook:
```ts
const event = stripe.webhooks.constructEvent(
  rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET
)
```

Handle idempotency: check `stripe_subscription_id` before upserting.

## Env vars

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
```

Add all to `.env.example`.

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] Free user can add up to 5 assets — 6th shows upgrade prompt
- [ ] Free user sees upgrade prompt on `/chat`
- [ ] Checkout session created successfully, redirects to Stripe
- [ ] Webhook updates subscription status on `subscription.created` + `subscription.updated` + `subscription.deleted`
- [ ] Pro user has no asset limit and full AI chat access
- [ ] Customer Portal accessible from settings
- [ ] Webhook signature verified — invalid signatures return 400

## Out of scope

- Stripe billing portal custom branding
- Invoice history in-app
- Team/family plans
- Promo codes (can add via Stripe dashboard without code changes)
