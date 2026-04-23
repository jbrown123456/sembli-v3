-- =====================================================================
-- Sembli — guest_sessions: try-before-signup demo cap — migration 0006
-- =====================================================================
-- Tracks unauthenticated visitor message quotas.
-- ID is a UUID from the sembli-guest-id cookie (HttpOnly, server-set).
-- All writes use the service role client (bypasses RLS).
-- =====================================================================

create table if not exists guest_sessions (
  id              text primary key,
  message_count   integer not null default 0,
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now()
);

alter table guest_sessions enable row level security;

-- Anon can read sessions by ID (IDs are unguessable UUIDs; no auth.uid() for guests).
-- All inserts and updates go through service role — no anon write policies needed.
create policy "guest_sessions_select" on guest_sessions
  for select using (true);
