# Task 05 — Magic Moment: Onboarding → First Asset (HVAC)

**Phase:** 4a
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** —
**Depends on:** 02, 03, 04, #14 (Claude API)

## Goal

The "magic moment" — after completing onboarding, the user adds their first real asset. We route them through adding an HVAC unit: they describe it (or snap a photo of the nameplate), Claude extracts the details, and Sembli creates a structured asset record with an auto-generated maintenance schedule. This is the moment the product earns trust.

## Decision locked (#14)

AI model: **Claude** (Anthropic API). Model: `claude-opus-4-5` for extraction, `claude-haiku-4-5` for quick classification. No OpenAI in v1.

## User flow

```
/onboarding (complete) 
  → /onboarding/add-home   ← new: name + address of the home
  → /onboarding/first-asset  ← HVAC entry point
    → describe it OR photo upload
    → Claude extraction preview
    → confirm + save
  → /dashboard  ← asset visible, maintenance schedule populated
```

## New routes

```
app/(onboarding)/
  onboarding/
    add-home/
      page.tsx         ← Step: name the home, optional address
    first-asset/
      page.tsx         ← Step: add HVAC (chat-style)
      actions.ts       ← Server actions: create home, create asset, generate schedule
```

## HVAC intake flow (`/onboarding/first-asset`)

Three input modes, same result:

1. **Text describe** — "I have a Carrier unit from 2018, not sure of the model" → Claude extracts what it can, marks unknowns as `null`
2. **Photo of nameplate** — User uploads photo → Claude Vision reads make/model/serial/tonnage → auto-fills form
3. **Skip for now** — Creates a blank HVAC asset with no details, defers to later

### Claude extraction prompt (server action)

Input: text description or base64 image
Output (structured JSON):
```json
{
  "name": "Carrier HVAC Unit",
  "make": "Carrier",
  "model": "24ACC636A003",
  "serial_number": "1234567890",
  "install_date": "2018-06-01",
  "warranty_expiry": "2028-06-01",
  "notes": "2-stage, 3 ton, R-410A"
}
```

Use Claude tool use (structured output) so the response is always valid JSON — no parsing fragility.

### Auto-generated maintenance schedule

After asset is created, run a second Claude call to generate the initial maintenance schedule. Prompt includes asset details + current date. Output: array of `maintenance_events` with `due_date`, `title`, `description`, `source: 'ai_generated'`.

Default HVAC schedule (fallback if Claude call fails):
| Event | Frequency | First due |
|---|---|---|
| Replace air filter (1") | Every 3 months | +90 days |
| Replace air filter (4") | Every 6 months | +180 days |
| Annual tune-up | Yearly | +365 days |
| Inspect refrigerant lines | Yearly | +365 days |
| Clean condenser coils | Yearly | +365 days |
| Blower wheel cleaning | Every 2 years | +730 days |

Batch insert all events in a single transaction.

## API route

`app/api/ai/extract-asset/route.ts` — POST, server-only:
- Auth check (session required)
- Rate limit: 10 extractions/hour per user
- Accepts `{ mode: 'text' | 'image', content: string }` (image = base64)
- Returns extracted asset fields + confidence notes
- Uses `lib/anthropic.ts` factory (new file)

### `lib/anthropic.ts`

```ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

New env var: `ANTHROPIC_API_KEY` — add to `.env.example`.

## Dashboard update

After first asset is saved, `/dashboard` should show a real state instead of the stub:
- Asset card (HVAC) with name, category badge, next maintenance due
- "Add another asset" CTA
- Quick link to timeline

Keep it simple — this is Task 05 scope, not full dashboard (Task 06/07 fill it in).

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] Can complete flow from `/onboarding` → add home → add HVAC → `/dashboard`
- [ ] Text description extracts make/model correctly via Claude
- [ ] Photo upload (JPEG/PNG) parses nameplate data via Claude Vision
- [ ] Maintenance schedule (≥4 events) auto-created on asset save
- [ ] Dashboard shows HVAC card after completion
- [ ] Rate limit blocks extraction after 10 calls/hour
- [ ] Works correctly at 375px width

## Out of scope

- Adding non-HVAC assets (later — same pattern, different category)
- Editing asset details after creation (post-launch)
- Document attachment at creation time (Task 07)
- Subscription gating (Task 08)
