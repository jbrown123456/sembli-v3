# Task 06 — Maintenance Calendar Per Property

**Phase:** 4b
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** —
**Depends on:** 02, 03, 04

## Goal

The `/timeline` page becomes a real, interactive maintenance calendar. Users see upcoming events across all assets, can mark events complete, add manual events, and see a 10-year outlook. No AI generation here — that's Task 05. This is the display + CRUD layer.

## Views

Two tabs on the timeline page:

| Tab | What |
|---|---|
| **Upcoming** | List of events due in next 12 months, sorted by date, grouped by month |
| **All / History** | Full chronological list including completed/skipped, filterable by asset |

## Data shape

Reads from `maintenance_events` joined to `assets` → `homes`. All filtered to `auth.uid()` via RLS (no extra filtering needed in app layer).

## Components

| File | What |
|---|---|
| `app/(app)/timeline/page.tsx` | Server component: fetches events, passes to client |
| `components/app/timeline/EventList.tsx` | Upcoming events grouped by month |
| `components/app/timeline/EventCard.tsx` | Single event row: icon, title, asset name, due date, status badge, action menu |
| `components/app/timeline/CompleteModal.tsx` | Bottom sheet: confirm completion, optional cost + notes + vendor |
| `components/app/timeline/AddEventModal.tsx` | Bottom sheet: manual event form (title, asset, due date) |
| `components/app/timeline/MonthGroup.tsx` | Month header with count badge |
| `components/app/timeline/EmptyState.tsx` | "No events yet — add your first asset to get started" |

## Server actions (`app/(app)/timeline/actions.ts`)

```ts
completeEvent(eventId: string, data: { cost?: number; notes?: string; vendor?: string }): Promise<void>
skipEvent(eventId: string): Promise<void>
addManualEvent(data: { assetId: string; title: string; dueDate: string; description?: string }): Promise<void>
deleteEvent(eventId: string): Promise<void>
```

All actions:
1. Verify `auth.uid()` owns the event (re-check RLS at app layer for defense-in-depth)
2. Mutate
3. `revalidatePath('/timeline')`

## Event states + visual treatment

| Status | Color | Icon |
|---|---|---|
| `scheduled` (future) | `--almanac-ink` | calendar |
| `scheduled` (overdue — past due_date) | `--almanac-danger` | alert |
| `completed` | `--almanac-success` | check |
| `skipped` | `--almanac-muted` | slash |
| `ai_generated` badge | `--almanac-brand-deep` | sparkle |

## Dashboard widget

Update `/dashboard` (from Task 05 stub) to include a "Next up" widget: the 3 nearest due events, each tappable → navigates to `/timeline`. This replaces the Task 05 asset-only stub.

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] `/timeline` renders real events from DB for authenticated user
- [ ] Overdue events visually distinct (red, sorted to top of upcoming)
- [ ] Mark complete: modal captures optional cost/notes, event flips to `completed`
- [ ] Skip: event flips to `skipped`
- [ ] Add manual event: form validates, saves, appears in list
- [ ] Delete event: confirm + remove
- [ ] Empty state shown when no events
- [ ] Dashboard widget shows 3 nearest events
- [ ] 375px width looks correct

## Out of scope

- Push/email notifications for upcoming events
- Recurring event auto-generation (handled by Task 05 on asset creation)
- Vendor lookup or booking
- Calendar sync (Google/Apple)
