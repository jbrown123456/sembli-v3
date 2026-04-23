# Sembli — Task Tracker

**Current phase:** Phase 0 — Foundations / Phase 7 — Landing (parallel)
**Launch target:** TBD
**Last updated:** 2026-04-22 by Cowork

---

## How this file works

This is the **single source of truth** for what Sembli needs to ship and the state of every piece of work. Both Cowork (planning agent) and Claude Code (implementing agent) read and update this file.

**Update protocol:**

- **Cowork** — owns phase structure, creates new tasks, writes briefs into this folder (`tasks/NN-*.md`), updates status when handing work off.
- **Claude Code** — flips tasks `🔵 In progress` when it claims them, `🟢 Done` when shipped, adds brief notes in the **Change log** section (file changed, any deviation from the brief).
- **Joey** — flips human-owned steps (e.g. Vercel signup, pricing decision) to `🟢 Done` as you complete them. Override any status if needed.

**Rule:** if it's not on this board, it's not real. New work gets a row here before it gets code.

---

## Status board

| ID | Task | Phase | Owner | Status | Blocked by | Brief |
|----|------|-------|-------|--------|------------|-------|
| 01 | Foundations — repo, Vercel, Supabase, CI | 0 | Joey + Claude Code | 🟢 Done | — | [01-foundations.md](01-foundations.md) |
| 02 | Frontend skeleton from Claude Design | 1 | Claude Code | 🟢 Done | 01 | [02-frontend-skeleton.md](02-frontend-skeleton.md) |
| 03 | Auth + accounts via Supabase Auth | 2 | Claude Code | 🟢 Done | — | [03-auth.md](03-auth.md) |
| 04 | Data model + RLS policies | 3 | Claude Code | 🟢 Done | — | [04-data-model.md](04-data-model.md) |
| 05 | Magic moment — onboarding → first asset (HVAC) | 4a | Claude Code | 🟢 Done | — | [05-first-asset.md](05-first-asset.md) |
| 06 | Maintenance calendar per property | 4b | Claude Code | 🟢 Done | — | [06-maintenance-calendar.md](06-maintenance-calendar.md) |
| 07 | Chat with AI assistant | 4c | Claude Code | 🟢 Done | 02, 03, 04 | [07-ai-chat.md](07-ai-chat.md) |
| 08 | Payments — Stripe Checkout + paywall | 5 | Claude Code | ⚪ Pending | 03, 13 | [08-payments.md](08-payments.md) |
| 09 | Analytics + observability | 6 | Claude Code | ⚪ Pending | 02 | [09-analytics.md](09-analytics.md) |
| 10 | Landing page — iPhone showcase + waitlist | 7 | Claude Code | 🟢 Done | — | [10-landing-page.md](10-landing-page.md) |
| 11 | Legal + production hardening | 8 | Joey + Claude Code | ⚪ Pending | 03, 08 | [11-legal-hardening.md](11-legal-hardening.md) |
| 12 | Pre-launch QA + launch | 9 | Joey + Claude Code | ⚪ Pending | 05–11 | _brief TBD_ |
| 13 | Decision: pricing + paywall gating | — | Joey | 🟢 Done | — | Free (1 home, 5 assets) / Pro $9mo or $79yr |
| 14 | Decision: AI model (Claude vs. mixed) | — | Joey | 🟢 Done | — | Claude only — Opus for reasoning, Haiku for classification |

### Legend

- ⚪ Pending — not started
- 🔵 In progress
- 🟢 Done
- 🟡 Blocked — waiting on something other than a listed dep
- 🔴 Needs decision — human input required

---

## Currently active

- **Tasks 01–07, 10 all complete.** Core product is built — HVAC intake, timeline, AI chat all wired. Next: Task 09 (analytics) or Task 11 (legal/hardening) before beta launch.
- **Joey action needed:** Wire Supabase env vars + magic link redirect URL, and set ANTHROPIC_API_KEY in Vercel before live testing.

## Open decisions blocking future work

_None — #13 and #14 locked. Task 08 (Stripe) deprioritized until post-beta._

---

## Change log

Append-only. Newest entries at top. Agents add a one-liner when they complete a task or make a notable decision.

- **2026-04-22** (Claude Code) — Task 07 complete. Migration 0005 (conversations + messages + RLS), streaming API route `/api/chat` with agentic tool loop (5 tools: search_assets, get_asset_details, get_maintenance_history, create_maintenance_event, complete_maintenance_event), ChatWindow + MessageBubble (react-markdown) + ToolCallChip + TypingIndicator + ConversationList + UpgradePrompt components. AskSembli FAB updated to pass `?new=1`. Free tier gated behind UpgradePrompt. `pnpm typecheck` clean.
- **2026-04-22** (Claude Code) — Tasks 05, 06, 07 complete. First-asset HVAC intake with Claude Vision, real maintenance timeline, streaming AI chat with 5 tools (search, details, history, create, complete). pnpm typecheck clean.
- **2026-04-22** (Claude Code) — All briefs drafted: 03-auth, 05-first-asset (HVAC), 06-maintenance-calendar, 07-ai-chat, 08-payments, 09-analytics, 11-legal-hardening. Decisions #13 (pricing) and #14 (AI model) locked. Task 03 claimed.
- **2026-04-22** (Claude Code) — Task 10 marked Done. All B1–B8 complete; B9 (Lighthouse) deferred until live Vercel URL exists.
- **2026-04-22** (Claude Code) — Task 02 complete. App shell (`(app)` route group, `AppHeader`, `BottomNav`, `AskSembli` FAB), Chat-first Onboarding ported to Next.js (`/onboarding`, 5 screens), stub pages for `/dashboard`, `/chat`, `/assets`, `/timeline`. Almanac light palette CSS vars added to `globals.css`. `pnpm typecheck` clean.
- **2026-04-22** (Claude Code) — Task 10 B5/B7/B8 complete. 4 prototype screenshots captured via Playwright, wired into iPhone frames. OG/Twitter image, robots, sitemap. PostHog provider + all 5 analytics events. B9 (Lighthouse/a11y) pending Vercel deploy.
- **2026-04-22** (Claude Code) — Task 10 B2/B3/B4/B6 complete. Marketing route, 6 page sections, IPhoneFrame component, waitlist migration + server action. iPhone screens are placeholders — B5 screenshot capture still needed. B7 (SEO/OG), B8 (PostHog), B9 (perf/a11y) pending.
- **2026-04-22** (Claude Code) — Task 01 Part B complete. Next.js scaffold, Supabase client factories, CI, verification page. Commit: `chore: Phase 0 foundations`. Root `TASKS.md` deleted — `tasks/README.md` is canonical.
- **2026-04-22** (Claude Code) — Task 10 B1 complete: Sembli dark tokens in `globals.css`, fonts (Fraunces/Inter/JetBrains Mono) in `layout.tsx`, primitives `Eyebrow`, `Chip`, `SectionHeader`, `Card` in `components/ui/`. Stopped for Joey review before B3.
- **2026-04-22** (Cowork) — Cowork mounted directly at `sembli-v3/tasks/`. Tracker migrated from repo-root `TASKS.md` to `tasks/README.md` so both agents read/write the same file. If `TASKS.md` still exists at repo root, delete it — this is now canonical.
- **2026-04-22** (Cowork) — Task 10 decisions locked: waitlist CTA, iPhone showcase, tagline `Your home, remembered.` Brief written to `10-landing-page.md`.
- **2026-04-22** (Cowork) — Task 10 moved to In progress.
- **2026-04-22** (Cowork) — Task 01 moved to In progress. Repo-scaffold files generated.
- **2026-04-21** (Cowork) — Form factor decision: **mobile-first responsive web PWA** (reversing 2026-04-19 native-mobile call). Stack: Next.js 14 on Vercel, Supabase, Stripe, PostHog, Sentry, Anthropic Claude API.
- **2026-04-21** (Cowork) — V1 scope confirmed: all three user journeys (onboarding→first-asset, maintenance calendar, AI chat). Launch gates: auth + payments + analytics.
