# Task 03 — Auth + Accounts via Supabase Auth

**Phase:** 2
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** 05, 06, 07, 08, 11
**Depends on:** 01, 02

## Goal

Wire in Supabase Auth so users can sign up, sign in, and sign out. Magic-link email is the primary flow (no password to forget). After sign-in, users land at `/dashboard`. Unauthenticated requests to any `(app)` route redirect to `/auth/signin`.

## Auth flows

| Flow | Route | Notes |
|---|---|---|
| Sign in / sign up | `/auth/signin` | Email input → magic link sent |
| Magic link callback | `/auth/callback` | Supabase redirect URI, exchanges code for session |
| Sign out | Server action | Clears session, redirects to `/auth/signin` |
| Onboarding gate | `/onboarding` | After first sign-in (no `profile.onboarding_complete`), redirect here |

No social OAuth in v1. No password flow.

## Middleware

`middleware.ts` at repo root — runs on every `(app)` route:
1. Read session from cookie via `lib/supabase/server.ts`
2. If no session → redirect to `/auth/signin?next=<requested-path>`
3. If session but `profile.onboarding_complete = false` → redirect to `/onboarding`
4. Otherwise → pass through

Marketing routes (`/`, `/auth/*`) are explicitly excluded from the middleware matcher.

## Database

Migration `0002_profiles.sql`:

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Users can only read/write their own profile
create policy "profiles_select_own" on profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

## Pages + components

| File | What |
|---|---|
| `app/(auth)/layout.tsx` | Minimal layout: centered card, no nav |
| `app/(auth)/auth/signin/page.tsx` | Email input + "Send magic link" button |
| `app/(auth)/auth/signin/SignInForm.tsx` | Client component, calls `supabase.auth.signInWithOtp` |
| `app/(auth)/auth/callback/route.ts` | Route handler: exchanges code, redirects to `next` param or `/dashboard` |
| `components/app/SignOutButton.tsx` | Server action, placed in `AppHeader` |

## AppHeader update

Add `SignOutButton` to the right side of the header (next to avatar placeholder). Only renders if session exists — check via server component.

## Onboarding completion

At the end of `ChatOnboarding` (final screen "Let's go" button), call a server action that:
```sql
update profiles set onboarding_complete = true, updated_at = now()
where id = auth.uid();
```
Then navigate to `/dashboard`.

## Environment

No new env vars needed — Supabase URL + anon key already in `.env.example`. The magic link redirect URL must be added to Supabase Auth > URL configuration:
- **Local:** `http://localhost:3000/auth/callback`
- **Prod:** `https://sembli.co/auth/callback`

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] Unauthenticated visit to `/dashboard` redirects to `/auth/signin`
- [ ] Magic link email received within ~30s
- [ ] Clicking link lands on `/dashboard` (or `/onboarding` on first sign-in)
- [ ] Profile row auto-created in `profiles` on signup
- [ ] Sign out clears session, redirects to `/auth/signin`
- [ ] `AppHeader` shows sign-out button when signed in

## Out of scope

- Social OAuth (Google, Apple) — Phase 2+
- Password reset flow
- Account settings / profile edit (Task 11)
- Email verification beyond magic link
