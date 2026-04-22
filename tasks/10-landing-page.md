# Task 10 — Landing Page

**Phase:** 7
**Blocks:** launch (Task 12)
**Owner:** Joey (copy review + screenshot approval) + Claude Code (implementation)

## Goal

Ship a marketing landing page for Sembli that visually and verbally matches the app's design system (extracted from `../DESIGN (sembli v3)/`), captures emails via a waitlist form, and replaces the current Lovable landing page as the destination for Reddit ads.

## Decisions locked (2026-04-22)

- **CTA:** waitlist only — email capture, no auth, no "try the app" button. App isn't live yet.
- **App showcase:** iPhone device frame mockups showing app capabilities. Not desktop iframes. Not full React rebuilds of the prototype.
- **Hero tagline:** `Your home, remembered.` (locked — do not rewrite or A/B).

## Design system reference

Canonical source: `../DESIGN (sembli v3)/` directory (HTML prototypes). Extract from `index.html` as the master tokens file, cross-reference individual screens for components.

- **Palette:** `#1A1814` (bg), `#F0EBE0` (text primary), `#E8D26A` (accent gold), `rgba(255,255,255, 0.04–0.5)` (surface/borders/muted text at graduated opacities)
- **Type:** Fraunces (serif, headlines — italic for accent), Inter (body), JetBrains Mono (eyebrow/label/chip)
- **Radii:** 14px card, 8px button, 4px chip
- **Voice:** literary, confident, adult. Match prototype copy (e.g. "Long-distance caretaker opens the app, talks for two minutes, leaves with a cited 10-year outlook. No forms.")

---

## Part A — Human steps (Joey)

1. Confirm the landing page lives in the main Next.js repo at `app/(marketing)/page.tsx`, not a separate project.
2. Approve the 4 prototype screens selected for iPhone mockups (see B5 below — agent will propose, you approve/swap).
3. Review copy drafts before shipping. Agent writes first pass from prototype copy + memory; you line-edit.
4. Decide: Resend for waitlist confirmation emails now, or skip and just show a success toast for V1? (Recommendation: skip for V1 — one less dependency.)
5. Final mobile eyeball on a real iPhone before DNS cutover.

## Part B — Claude Code steps

### B1. Extract design system (load-bearing — do this first)

- Port the palette, typography, spacing from `../DESIGN (sembli v3)/index.html` into `tailwind.config.ts` and CSS variables in `app/globals.css`.
- Build primitive components in `components/ui/`:
  - `Button` (primary gold-accent, ghost)
  - `Eyebrow` (uppercase mono label)
  - `Chip` (small mono-font tag, used for feature labels)
  - `SectionHeader` (eyebrow + h2)
  - `Card` (translucent-surface card with border and 14px radius)
- These primitives must be the SAME ones the app (Task 02) will use. Don't fork.

### B2. Marketing route scaffold

- `app/(marketing)/page.tsx` — landing page
- `app/(marketing)/layout.tsx` — marketing-specific header/footer, dark theme
- Keep the root `app/layout.tsx` neutral so the app surface (Task 02) can add its own chrome

### B3. Page sections (each its own component in `components/marketing/`)

1. **Hero** — eyebrow ("Sembli · Private beta · April 2026" or similar), h1 `Your home, <em>remembered.</em>` (em in italic gold), sub (~1 sentence of value prop), inline waitlist email capture, iPhone mockup right-aligned on desktop / below text on mobile.
2. **Thesis** — 3-column problem statement. Pull from product context: users hate data entry; home maintenance is fragmented/reactive; AI can convert unstructured inputs into structured intelligence.
3. **HowItWorks** — 3 beats, each with capability headline, short description, iPhone screen showing it:
   - "Talk, don't type." → onboarding/chat screen
   - "Get a 10-year outlook, not a checklist." → dashboard/outlook screen
   - "Every asset, every vendor, one tap." → vendor directory or asset detail
4. **AppShowcase** — larger scroll-triggered section with iPhone frame rotating through 4–5 capability screens (can reuse screens from section 3 plus template-flow).
5. **Waitlist** — final CTA block, email capture, one line setting expectations ("Private beta opens summer 2026" or similar — Joey to confirm).
6. **Footer** — privacy, terms, contact, © 2026 Sembli.

### B4. iPhone device frame component

- `components/ui/IPhoneFrame.tsx` — iPhone 15 silhouette with Dynamic Island, rendered in CSS/SVG (no external image)
- Accepts children (the screen content: image or embedded HTML)
- Size variants: `hero` (tall, ~480px), `showcase` (medium, ~420px), `beat` (smaller, ~320px)
- Subtle shadow, bezel color matches palette (dark warm neutral)
- Must look identical on Safari iOS, Chrome Android, desktop — test all three

### B5. Screen assets

Capture screenshots from these prototype screens at 375px wide:

- `../DESIGN (sembli v3)/02-onboarding.html` — magic-moment / voice-memo / outlook screens
- `../DESIGN (sembli v3)/03-dashboard.html` — dashboard + 10-yr outlook
- `../DESIGN (sembli v3)/04-template-flow.html` — "building live" screen
- `../DESIGN (sembli v3)/06-vendor-directory.html` — on-asset or profile screen

Options:
- **Preferred:** headless Playwright script at repo root — `scripts/capture-screens.ts` that loads each HTML file at 375×812 viewport and screenshots to `public/screenshots/*.webp`. Re-runnable when prototype updates.
- **Fallback:** Joey captures manually on a real device and drops PNGs in `public/screenshots/`.

Propose 4–5 specific screens and wait for Joey's approval before spending time on capture.

### B6. Waitlist backend

- Supabase migration: `supabase/migrations/NNNN_waitlist.sql`
  - `waitlist` table: `id uuid pk default gen_random_uuid()`, `email text unique not null`, `created_at timestamptz default now()`, `source text default 'landing'`, `ip inet`, `user_agent text`
  - RLS: no public SELECT. Anon INSERT allowed only via server action that rate-limits by IP (5/hour).
- Server action `submitWaitlist(email, source)` in `app/(marketing)/actions.ts` — validates format, dedupes on unique, inserts, returns success.
- Wire hero + waitlist sections to the action.
- If URL has `?source=reddit` or `?utm_source=...`, persist that in `source` column.

### B7. SEO + OG

- Meta: title ("Sembli — Your home, remembered."), description, canonical
- `app/opengraph-image.tsx` — dynamic OG using hero tagline + iPhone mockup composition (1200×630)
- `app/twitter-image.tsx` — same
- `app/robots.ts`, `app/sitemap.ts`

### B8. Analytics

PostHog events:
- `landing_page_viewed`
- `landing_cta_focused` (hero email input)
- `landing_cta_submitted` (hero or footer form)
- `landing_waitlist_success`
- `landing_scroll_depth` at 25/50/75/100

### B9. Accessibility + performance

- Keyboard navigable end-to-end
- All images: descriptive alt text
- Color contrast: verify gold-on-dark for body copy passes WCAG AA (it likely fails — use gold only for accents, not body)
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90
- No CLS on hero: preload Fraunces/Inter, reserve iPhone frame dimensions

---

## Acceptance criteria

- [ ] Landing page live at `/` on Vercel (custom domain)
- [ ] Visual parity with prototype: same palette, type, spacing, voice
- [ ] Mobile 375px: every section renders correctly, no horizontal scroll, hero CTA reachable without scroll
- [ ] Desktop 1440px: hero is split (text left, iPhone right), showcase uses full width
- [ ] Waitlist submit end-to-end: row lands in Supabase `waitlist` table, UI shows success
- [ ] Rate limit works: 6th submission from same IP in an hour returns graceful error
- [ ] Lighthouse mobile score ≥ 90 on Performance, Accessibility, SEO
- [ ] PostHog shows all 5 events firing (check in dashboard)
- [ ] OG image renders correctly when URL is pasted into iMessage and Slack
- [ ] Reddit-sourced traffic (URL with `?source=reddit`) is attributed in the `source` column

## Out of scope

- A/B testing (no variants)
- Paid tier messaging (blocked on pricing decision #13)
- Product demo video
- Testimonials (none yet)
- Login or signup flow (that's Task 03)
