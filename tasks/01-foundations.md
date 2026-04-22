# Task 01 — Foundations

**Phase:** 0
**Blocks:** Phase 1 (FE skeleton), Phase 3 (data model), everything downstream.
**Owner:** Joey (human steps) + Claude Code (scaffolding steps)

## Goal

Stand up the bare infrastructure so we can start building features. No features in this task — just the scaffolding that every later task will sit on top of.

## Part A — Human steps (Joey, ~20 min)

Do these in order. Claude Code can't do these for you (they require account access and clicking).

1. **GitHub repo**
   - Create a new private repo named `sembli` (or `sembli-app`) at github.com.
   - Clone it locally. This is where everything in `repo-scaffold/` gets copied into.

2. **Domain** (if not already owned)
   - Buy the domain you want to launch on (e.g. `sembli.com`, `sembli.app`).
   - Registrar doesn't matter much — Namecheap, Cloudflare, Porkbun all fine.

3. **Vercel project**
   - New project at vercel.com → import the GitHub repo.
   - Leave framework detection as Next.js.
   - Add a placeholder env var so the "missing env" warning goes away — we'll fill real values in step 5.

4. **Supabase projects (TWO of them)**
   - Create `sembli-dev` (development).
   - Create `sembli-prod` (production).
   - Grab the Project URL and anon key from each → you'll paste these into Vercel in step 5.
   - Reason for two: prod data should never touch local dev. Non-negotiable.

5. **Wire env vars into Vercel**
   - Vercel project → Settings → Environment Variables.
   - Add these for **Production**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (from sembli-prod).
   - Add the same three for **Preview** and **Development**, pointing at sembli-dev.

6. **Point the domain at Vercel**
   - Vercel → Domains → add your domain.
   - Update DNS at your registrar per Vercel's instructions.

Once all six are done, tell Claude Code to proceed to Part B.

## Part B — Claude Code steps

Prereq: Part A complete. Repo cloned locally. `.env.local` exists with dev Supabase vars (copy from Vercel).

Do the following:

1. **Scaffold Next.js 14 + TypeScript + Tailwind**
   - `pnpm create next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias="@/*"`
   - Keep `app/` at repo root (not `src/app/`).

2. **Install core dependencies**
   - `pnpm add @supabase/supabase-js @supabase/ssr`
   - `pnpm add -D @types/node`
   - Set up shadcn/ui: `pnpm dlx shadcn@latest init` — use default config with CSS variables.

3. **Create folder structure per CLAUDE.md**
   - `components/ui/` (shadcn target)
   - `lib/supabase/` (empty, for client factories next task)
   - `supabase/migrations/` (empty, for Phase 3)
   - `docs/` with a placeholder `product-context.md` that links to the SEmbli.rtf in the workspace

4. **Supabase client factories** (`lib/supabase/`)
   - `client.ts` — browser client using `createBrowserClient` from `@supabase/ssr`.
   - `server.ts` — server client using `createServerClient` from `@supabase/ssr`, reads cookies.
   - `admin.ts` — server-only client using service role key. Add a comment at the top: "NEVER import from client components."

5. **`.env.example`** at repo root listing all three env vars with empty values + a comment pointing at Vercel for real values.

6. **Mobile-first verification page**
   - Replace `app/page.tsx` with a minimal "Sembli — coming soon" page that renders a single centered div. Must look right at 375px width.
   - Import a Supabase client and run `supabase.auth.getSession()` in a server component, render the result — proves env vars and client wiring work end to end.

7. **GitHub Actions CI** (`.github/workflows/ci.yml`)
   - On pull_request: run `pnpm install`, `pnpm typecheck` (add to package.json: `"typecheck": "tsc --noEmit"`), `pnpm lint`.
   - Use pnpm setup action and Node 20.

8. **README.md** at repo root
   - 10 lines. What Sembli is. Link to CLAUDE.md for conventions, README-dev.md for workflow.

9. **Commit + push**
   - Single commit titled `chore: Phase 0 foundations`.
   - Push to main, confirm Vercel deploys successfully at the custom domain.

## Acceptance criteria

- [ ] Both Supabase projects (dev + prod) exist and have keys.
- [ ] Custom domain resolves to Vercel and serves the placeholder page over HTTPS.
- [ ] `pnpm dev` works locally, page renders, Supabase session query doesn't error.
- [ ] `pnpm typecheck` and `pnpm lint` pass.
- [ ] GitHub Actions runs green on a test PR.
- [ ] No secrets are committed (check `git log -p` for any leak).

## Out of scope for this task

- Auth UI (Phase 2)
- Schema / migrations (Phase 3)
- Any product feature — this is infra only
