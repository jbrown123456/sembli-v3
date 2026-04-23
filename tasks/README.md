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
| 02 | Frontend skeleton from Claude Design | 1 | Claude Code | ⚪ Pending | 01 | _brief TBD_ |
| 03 | Auth + accounts via Supabase Auth | 2 | Claude Code | ⚪ Pending | 01, 02 | _brief TBD_ |
| 04 | Data model + RLS policies | 3 | Claude Code | ⚪ Pending | 01 | _brief TBD_ |
| 05 | Magic moment — onboarding → first asset | 4a | Claude Code | ⚪ Pending | 02, 03, 04, 14 | _brief TBD_ |
| 06 | Maintenance calendar per property | 4b | Claude Code | ⚪ Pending | 02, 03, 04 | _brief TBD_ |
| 07 | Chat with AI assistant | 4c | Claude Code | ⚪ Pending | 02, 03, 04, 14 | _brief TBD_ |
| 08 | Payments — Stripe Checkout + paywall | 5 | Claude Code | ⚪ Pending | 03, 13 | _brief TBD_ |
| 09 | Analytics + observability | 6 | Claude Code | ⚪ Pending | 02 | _brief TBD_ |
| 10 | Landing page — iPhone showcase + waitlist | 7 | Claude Code | 🔵 In progress | 01, B1 of 10 | [10-landing-page.md](10-landing-page.md) |
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

- **Task 10 — Landing Page.** B1 done (design tokens, fonts, primitives). Next: pick up from B3 per brief.
- **Task 10 — Landing Page.** Decisions locked 2026-04-22: waitlist CTA, iPhone showcase (not desktop iframes), tagline `Your home, remembered.` Brief ready in `10-landing-page.md`. Claude Code can start B1 (extract design system) as soon as the shared Tailwind config exists from Task 01.

## Open decisions blocking future work

- **#13 — Pricing model.** Blocks Phase 5 (payments). Need: free vs. paid tiers, price points, what's gated.
- **#14 — AI model choice.** Blocks Phase 4a and 4c. Claude for the assistant is the default; decide whether to mix OpenAI for embeddings/cost.

---

## Change log

Append-only. Newest entries at top. Agents add a one-liner when they complete a task or make a notable decision.

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
