-- Waitlist table for landing page email capture
create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  source      text not null default 'landing',
  ip          inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- Index for rate-limit query (ip + created_at)
create index if not exists waitlist_ip_created_at_idx on waitlist (ip, created_at);

-- RLS: no public reads, anon can insert via server action only
alter table waitlist enable row level security;

-- No SELECT for anon — admin client handles reads
create policy "no_public_read" on waitlist
  for select using (false);

-- No direct anon INSERT — all inserts go through the service-role server action
-- (service-role bypasses RLS, so no insert policy needed for anon)
