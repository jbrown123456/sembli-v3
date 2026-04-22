# Sembli — Project Context for Claude Code

This file is read automatically by Claude Code at the start of every session in this repo. Keep it concise and current — it's the persistent system context for anyone (human or agent) working in this codebase.

## What Sembli is

AI-native, chat-first home asset management. Users track, maintain, and make decisions about physical assets in their home (HVAC, roof, appliances, vehicles) with near-zero manual data entry. Multimodal inputs (photos, PDFs, video) get converted into structured asset intelligence via AI.

Canonical product context: `docs/product-context.md` (copied from SEmbli.rtf).

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui. Mobile-first responsive web app (PWA).
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions).
- **Hosting:** Vercel (preview + prod).
- **Payments:** Stripe (Checkout + Customer Portal + webhooks).
- **Analytics:** PostHog. **Errors:** Sentry.
- **AI:** Anthropic Claude API for the assistant. (Embedding provider TBD — see `tasks/14-decision-ai-model.md`.)

## Repo conventions

- `app/` — Next.js routes (App Router).
- `components/` — shared UI. Keep primitives in `components/ui/`.
- `lib/` — server-side utils, Supabase client factories, AI helpers.
- `supabase/migrations/` — SQL migrations. Every schema change goes here, never in the dashboard.
- `tasks/` — implementation briefs generated from planning. Work one brief at a time.
- `docs/` — product context, ADRs.

## Rules Claude Code must follow

- **RLS is non-negotiable.** Every new table gets row-level security policies in the same migration that creates it. No exceptions.
- **Typed Supabase client only.** Regenerate types (`supabase gen types typescript`) whenever a migration lands.
- **No secrets in the repo.** Use `.env.local` (gitignored) and Vercel env vars.
- **Commits are small and topical.** One task brief ≈ one or a few commits, not one mega-commit.
- **Ask before architectural decisions.** If a task brief doesn't specify it, stop and ask rather than guessing.
- **Mobile-first.** Every screen must look right at 375px wide before anything else.

## Dev commands

(Fill these in after Phase 0 scaffolding lands.)

```
pnpm dev         # local dev server
pnpm typecheck   # TS check
pnpm lint        # eslint
pnpm test        # tests (once added)
supabase start   # local Supabase
```

## Where planning lives

`TASKS.md` at the repo root is the **single source of truth** for all work — phase plan, status board, open decisions, change log. Read it at the start of every session. Update it when you claim or complete a task, per the update protocol inside the file. If a task brief is ambiguous, ask Joey — don't invent requirements.

High-level roadmap and decisions happen in Cowork mode (Anthropic desktop app). Joey generates implementation briefs there and drops them into `tasks/`. Both Cowork and Claude Code update `TASKS.md` so the plan stays in sync across both tools.
