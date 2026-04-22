# Sembli — Task Tracker

**Current phase:** Phase 0 — Foundations
**Launch target:** TBD
**Last updated:** 2026-04-22 by Claude Code

---

## How this file works

This is the **single source of truth** for what Sembli needs to ship and the state of every piece of work. Both Cowork (planning agent) and Claude Code (implementing agent) read and update this file.

**Update protocol:**

- **Cowork** — owns phase structure, creates new tasks, writes briefs into `tasks/NN-*.md`, updates status when handing work off.
- **Claude Code** — flips tasks `🔵 In progress` when it claims them, `🟢 Done` when shipped, adds brief notes in the **Change log** section (file changed, any deviation from the brief).
- **Joey** — flips human-owned steps (e.g. Vercel signup, pricing decision) to `🟢 Done` as you complete them. Override any status if needed. Add questions/blockers in the task's own brief.

**Rule:** if it's not on this board, it's not real. New work gets a row here before it gets code.

---

## Status board

| ID | Task | Phase | Owner | Status | Blocked by | Brief |
|----|------|-------|-------|--------|------------|-------|
| 01 | Foundations — repo, Vercel, Supabase, CI | 0 | Joey + Claude Code | 🟢 Done | — | [tasks/01-foundations.md](tasks/01-foundations.md) |
| 02 | Frontend skeleton from Claude Design | 1 | Claude Code | ⚪ Pending | 01 | _brief TBD_ |
| 03 | Auth + accounts via Supabase Auth | 2 | Claude Code | ⚪ Pending | 01, 02 | _brief TBD_ |
| 04 | Data model + RLS policies | 3 | Claude Code | ⚪ Pending | 01 | _brief TBD_ |
| 05 | Magic moment — onboarding → first asset | 4a | Claude Code | ⚪ Pending | 02, 03, 04, 14 | _brief TBD_ |
| 06 | Maintenance calendar per property | 4b | Claude Code | ⚪ Pending | 02, 03, 04 | _brief TBD_ |
| 07 | Chat with AI assistant | 4c | Claude Code | ⚪ Pending | 02, 03, 04, 14 | _brief TBD_ |
| 08 | Payments — Stripe Checkout + paywall | 5 | Claude Code | ⚪ Pending | 03, 13 | _brief TBD_ |
| 09 | Analytics + observability | 6 | Claude Code | ⚪ Pending | 02 | _brief TBD_ |
| 10 | Landing page matching FE design system | 7 | Claude Code | ⚪ Pending | 02 | _brief TBD_ |
| 11 | Legal + production hardening | 8 | Joey + Claude Code | ⚪ Pending | 03, 08 | _brief TBD_ |
| 12 | Pre-launch QA + launch | 9 | Joey + Claude Code | ⚪ Pending | 05–11 | _brief TBD_ |
| 13 | 🔴 Decision: pricing + paywall gating | — | Joey | 🔴 Needs decision | — | — |
| 14 | 🔴 Decision: AI model (Claude vs. mixed) | — | Joey | 🔴 Needs decision | — | — |

### Legend

- ⚪ Pending — not started
- 🔵 In progress
- 🟢 Done
- 🟡 Blocked — waiting on something other than a listed dep
- 🔴 Needs decision — human input required

---

## Currently active

**Task 02 — Frontend skeleton.** Brief TBD. Waiting on Cowork to write `tasks/02-frontend-skeleton.md`, or Joey to request a draft. Unblocked now that Task 01 is done.

**Also unblocked:** Task 04 (data model + RLS) — brief TBD.

**Still blocked:** Tasks 03, 05–08 (need 02 or decisions #13/#14 first).

## Open decisions blocking future work

- **#13 — Pricing model.** Blocks Phase 5 (payments). Needed before: free vs. paid tiers, price points, what's gated.
- **#14 — AI model choice.** Blocks Phase 4a and 4c. Claude for assistant is the default; decide whether to mix OpenAI for embeddings/cost.

---

## Change log

Append-only. Newest entries at top. Agents should add a one-liner when they complete a task or make a notable decision.

- **2026-04-22** (Claude Code) — Task 01 Part B complete. Next.js 16 scaffold, Supabase client factories (browser/server/admin), shadcn/ui, CI workflow, verification page, README. Commit: `chore: Phase 0 foundations`. Old React Native prototype archived to `_archive/`. Supabase CLI and pnpm installed. Note: Vercel project + Supabase projects + env vars + DNS still needed from Joey (Part A) before `pnpm dev` can verify the Supabase connection.
- **2026-04-22** (Cowork) — TASKS.md created as single source of truth. Cowork Task list now mirrors this file.
- **2026-04-22** (Cowork) — Task 01 moved to In progress. Repo-scaffold files generated (`CLAUDE.md`, `README-dev.md`, `tasks/01-foundations.md`).
- **2026-04-21** (Cowork) — Form factor decision: **mobile-first responsive web PWA** (reversing the 2026-04-19 native-mobile call). Stack proposed: Next.js 14 on Vercel, Supabase, Stripe, PostHog, Sentry, Anthropic Claude API.
- **2026-04-21** (Cowork) — V1 scope confirmed: all three user journeys (onboarding→first-asset, maintenance calendar, AI chat). Launch gates: auth + payments + analytics.
