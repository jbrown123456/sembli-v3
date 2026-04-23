# Task 04 — Data Model + RLS Policies

**Phase:** 3  
**Owner:** Claude Code  
**Status:** 🔵 In progress  
**Blocks:** 03 (needs profiles table), 05 (homes + assets), 06 (maintenance_items), 07 (all tables)

## Goal

Define the full Supabase schema for Sembli v1, wire row-level security on every table, and add a typed client export so every future task gets autocomplete for free.

## Tables

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users`. Display name, avatar. Auto-created on signup. |
| `homes` | The core entity. One user → one home to start, many homes later. |
| `home_members` | Future sibling/family collaboration. Owner + invited members per home. |
| `assets` | Tracked systems (HVAC, roof, water heater, etc.). |
| `vendors` | Contractors on file per home. |
| `maintenance_items` | Scheduled + completed tasks. Linked to home and optionally an asset. |
| `documents` | Uploaded files (receipts, manuals, permits). Supabase Storage path + AI-extracted data. |

## RLS strategy

A single helper function `user_has_home_access(home_id)` checks if `auth.uid()` is the owner or a member. All asset/maintenance/document policies call this — keeps them DRY.

- `profiles` — self only
- `homes` — owner can do everything; members can read
- `home_members` — owner manages; members can read their own row
- `assets`, `vendors`, `maintenance_items`, `documents` — any home member can read/write/delete

## Deliverables

1. `supabase/migrations/0002_core_schema.sql` — full schema + RLS
2. `lib/supabase/types.ts` — hand-written types (Supabase CLI can regenerate later once env is live)

## Acceptance criteria

- [ ] Migration file applies cleanly (`supabase db reset` locally)
- [ ] Every table has RLS enabled
- [ ] `user_has_home_access()` helper exists and is `security definer`
- [ ] `handle_new_user()` trigger auto-creates profile on auth signup
- [ ] All foreign keys have appropriate `on delete` behaviour
- [ ] Types file exports `Tables<T>` helper compatible with Supabase client
- [ ] `pnpm typecheck` still passes

## Out of scope

- Auth UI (Task 03)
- Stripe customer/subscription tables (Task 08)
- AI conversation history table (Task 07)
