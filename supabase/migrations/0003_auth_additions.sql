-- =============================================================
-- Sembli auth additions — migration 0003
-- =============================================================
-- Adds: onboarding_complete flag on profiles
--       subscriptions table for Stripe paywall (Task 08)
-- =============================================================


-- ─── profiles: onboarding flag ───────────────────────────────

alter table profiles
  add column if not exists onboarding_complete boolean not null default false;


-- ─── subscriptions ────────────────────────────────────────────
-- One row per user. Free tier auto-created on signup.

create table if not exists subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  owner_id                uuid not null references profiles(id) on delete cascade unique,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan                    text not null default 'free'
                            check (plan in ('free', 'pro_monthly', 'pro_yearly')),
  status                  text not null default 'active'
                            check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table subscriptions enable row level security;

-- Users can read their own subscription
create policy "subscriptions_select_own" on subscriptions
  for select using (auth.uid() = owner_id);

-- Only service role can write (webhook handler uses admin client)
-- No insert/update/delete policy — admin client bypasses RLS

create trigger subscriptions_set_updated_at
  before update on subscriptions
  for each row execute function set_updated_at();


-- ─── Auto-create free subscription on signup ─────────────────
-- Extends the existing handle_new_user trigger

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;

  insert into subscriptions (owner_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (owner_id) do nothing;

  return new;
end;
$$;
