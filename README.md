# Sembli

AI-native home asset management. Track, maintain, and make decisions about your home with near-zero manual data entry.

Stack: Next.js 16 · Supabase · Vercel · Stripe · PostHog · Anthropic Claude API

## Dev setup

```bash
cp .env.example .env.local   # fill in your Supabase keys
pnpm install
pnpm dev
```

## Commands

```bash
pnpm dev          # local dev server
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
supabase start    # local Supabase (requires Docker)
```

## Docs

- [CLAUDE.md](CLAUDE.md) — project context for AI agents
- [README-dev.md](README-dev.md) — day-to-day workflow (Cowork ↔ Claude Code)
- [TASKS.md](TASKS.md) — task tracker and phase plan
