-- =============================================================
-- Sembli core schema — migration 0002
-- =============================================================
-- Tables: profiles, homes, home_members, assets, vendors,
--         maintenance_items, documents
-- Every table has RLS enabled. Helper function
-- user_has_home_access() keeps policies DRY.
-- =============================================================


-- ─── Utility: auto-update updated_at ─────────────────────────

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ─── profiles ─────────────────────────────────────────────────
-- One row per auth.users entry. Auto-created by trigger below.

create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles
  for select using (id = auth.uid());

create policy "profiles_insert_own" on profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid());

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create profile when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ─── homes ────────────────────────────────────────────────────

create table if not exists homes (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references auth.users(id) on delete cascade,
  name                text not null,                -- "Mom's house", "Dad's place"
  address             text,
  city                text,
  state               text,
  zip                 text,
  year_built          integer,
  type                text,                         -- 'single_family', 'condo', 'townhouse', etc.
  owner_relationship  text,                         -- "my mother's home", "my parents' home"
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists homes_owner_id_idx on homes (owner_id);

alter table homes enable row level security;

create trigger homes_set_updated_at
  before update on homes
  for each row execute function set_updated_at();


-- ─── home_members ─────────────────────────────────────────────
-- Enables sibling / family collaboration. Created before the
-- RLS helper so the helper can reference this table.

create table if not exists home_members (
  id          uuid primary key default gen_random_uuid(),
  home_id     uuid not null references homes(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'member'
                check (role in ('owner', 'member')),
  invited_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (home_id, user_id)
);

create index if not exists home_members_user_id_idx on home_members (user_id);

alter table home_members enable row level security;


-- ─── RLS helper ───────────────────────────────────────────────
-- Returns true if the current user is the home owner OR a member.
-- Used by all child-table policies. security definer so it can
-- read home_members without the caller needing direct access.

create or replace function user_has_home_access(p_home_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from homes      where id      = p_home_id and owner_id = auth.uid()
    union all
    select 1 from home_members where home_id = p_home_id and user_id  = auth.uid()
  );
$$;


-- ─── homes RLS policies ───────────────────────────────────────

-- Owner can see their homes; members can see homes they belong to
create policy "homes_select" on homes
  for select using (
    owner_id = auth.uid() or user_has_home_access(id)
  );

-- Only the owner can create a home for themselves
create policy "homes_insert" on homes
  for insert with check (owner_id = auth.uid());

-- Only the owner can update or delete the home record
create policy "homes_update" on homes
  for update using (owner_id = auth.uid());

create policy "homes_delete" on homes
  for delete using (owner_id = auth.uid());


-- ─── home_members RLS policies ────────────────────────────────

-- Members can see their own membership; owners see all members of their homes
create policy "home_members_select" on home_members
  for select using (
    user_id = auth.uid()
    or (select owner_id from homes where id = home_id) = auth.uid()
  );

-- Only the home owner can add members
create policy "home_members_insert" on home_members
  for insert with check (
    (select owner_id from homes where id = home_id) = auth.uid()
  );

-- Only the home owner can remove members
create policy "home_members_delete" on home_members
  for delete using (
    (select owner_id from homes where id = home_id) = auth.uid()
  );


-- ─── assets ───────────────────────────────────────────────────

create table if not exists assets (
  id                   uuid primary key default gen_random_uuid(),
  home_id              uuid not null references homes(id) on delete cascade,
  name                 text not null,
  category             text,          -- 'HVAC', 'Plumbing', 'Electrical', 'Exterior', 'Appliance', 'Contact'
  brand                text,
  model                text,
  serial_number        text,
  install_year         integer,
  last_service_date    date,
  expected_life_years  integer,
  notes                text,
  source               text not null default 'manual'
                         check (source in ('manual', 'voice', 'document', 'ai_inferred')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists assets_home_id_idx on assets (home_id);

alter table assets enable row level security;

create trigger assets_set_updated_at
  before update on assets
  for each row execute function set_updated_at();

create policy "assets_all" on assets
  for all using (user_has_home_access(home_id))
  with check (user_has_home_access(home_id));


-- ─── vendors ──────────────────────────────────────────────────

create table if not exists vendors (
  id          uuid primary key default gen_random_uuid(),
  home_id     uuid not null references homes(id) on delete cascade,
  name        text not null,
  specialty   text,
  phone       text,
  email       text,
  notes       text,
  last_used   date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists vendors_home_id_idx on vendors (home_id);

alter table vendors enable row level security;

create trigger vendors_set_updated_at
  before update on vendors
  for each row execute function set_updated_at();

create policy "vendors_all" on vendors
  for all using (user_has_home_access(home_id))
  with check (user_has_home_access(home_id));


-- ─── maintenance_items ────────────────────────────────────────

create table if not exists maintenance_items (
  id              uuid primary key default gen_random_uuid(),
  home_id         uuid not null references homes(id) on delete cascade,
  asset_id        uuid references assets(id) on delete set null,
  vendor_id       uuid references vendors(id) on delete set null,
  title           text not null,
  description     text,
  due_date        date,
  completed_date  date,
  cost_cents      integer,     -- store in cents; divide by 100 for display
  recurrence      text not null default 'none'
                    check (recurrence in ('none', 'monthly', 'quarterly', 'annual')),
  source          text not null default 'manual'
                    check (source in ('manual', 'ai_suggested', 'voice')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists maintenance_items_home_id_due_date_idx
  on maintenance_items (home_id, due_date);
create index if not exists maintenance_items_asset_id_idx
  on maintenance_items (asset_id);

alter table maintenance_items enable row level security;

create trigger maintenance_items_set_updated_at
  before update on maintenance_items
  for each row execute function set_updated_at();

create policy "maintenance_items_all" on maintenance_items
  for all using (user_has_home_access(home_id))
  with check (user_has_home_access(home_id));


-- ─── documents ────────────────────────────────────────────────

create table if not exists documents (
  id                  uuid primary key default gen_random_uuid(),
  home_id             uuid not null references homes(id) on delete cascade,
  asset_id            uuid references assets(id) on delete set null,
  title               text not null,
  doc_type            text
                        check (doc_type in ('receipt', 'manual', 'permit', 'warranty', 'photo', 'other')),
  storage_path        text not null,   -- Supabase Storage object path
  file_size_bytes     integer,
  mime_type           text,
  ai_processed        boolean not null default false,
  ai_extracted_data   jsonb,           -- structured data parsed by AI (asset names, dates, costs)
  created_at          timestamptz not null default now()
);

create index if not exists documents_home_id_idx on documents (home_id);
create index if not exists documents_asset_id_idx on documents (asset_id);

alter table documents enable row level security;

create policy "documents_all" on documents
  for all using (user_has_home_access(home_id))
  with check (user_has_home_access(home_id));
