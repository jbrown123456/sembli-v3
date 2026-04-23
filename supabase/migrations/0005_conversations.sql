-- =============================================================
-- Sembli — AI chat: conversations + messages — migration 0005
-- =============================================================

-- ─── conversations ────────────────────────────────────────────

create table if not exists conversations (
  id          uuid primary key default gen_random_uuid(),
  home_id     uuid not null references homes(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,           -- auto-set from first user message (truncated)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists conversations_home_id_idx    on conversations (home_id);
create index if not exists conversations_user_id_idx    on conversations (user_id);
create index if not exists conversations_updated_at_idx on conversations (updated_at desc);

alter table conversations enable row level security;

create trigger conversations_set_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- User can only access their own conversations (home membership check implicit via user_id)
create policy "conversations_all" on conversations
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid() and user_has_home_access(home_id));


-- ─── messages ─────────────────────────────────────────────────

create table if not exists messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  role             text not null check (role in ('user', 'assistant', 'tool_result')),
  content          text not null,          -- text for user/assistant; JSON for tool_result
  tool_use_id      text,                   -- Anthropic tool_use block id (for tool_result pairing)
  tool_name        text,                   -- which tool was called
  created_at       timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on messages (conversation_id, created_at asc);

alter table messages enable row level security;

-- Access via conversation ownership
create policy "messages_all" on messages
  for all using (
    exists (
      select 1 from conversations
      where conversations.id = conversation_id
        and conversations.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from conversations
      where conversations.id = conversation_id
        and conversations.user_id = auth.uid()
    )
  );
