# Task 02 — Frontend Skeleton

**Phase:** 1  
**Owner:** Claude Code (design thread)  
**Status:** 🔵 In progress  
**Blocks:** 03, 05, 06, 07, 09  

## Goal

Stand up the full app shell in Next.js App Router. No real data, no auth guard (that's Task 03) — just the routes, layouts, page stubs, shared navigation, and the ported Chat-first Onboarding flow from the Claude Design export.

## Design source

`Claude Design` export — Chat-first Onboarding (5-screen flow), Almanac light palette. The full HTML prototype lives in the Sembli Home Tracking workspace folder. Key design decisions:

- **Palette:** Almanac light (warm cream `#FBF8F1`, mustard brand `#E8D26A`, forest accent `#2D4A3A`). This is the **in-app** palette — distinct from the dark marketing palette already in `globals.css`.
- **Fonts:** Fraunces (display/headings), Inter (UI), JetBrains Mono (labels/citations). Already wired in `layout.tsx`.
- **Logo:** Threshold mark — an arched doorway in ink, SVG inline, no image assets needed.
- **Mobile-first:** max-width 430px for app shell. Looks great on 375px iPhone SE upward.

## Route structure

```
app/
  (onboarding)/
    onboarding/
      page.tsx          ← Chat-first 5-screen flow (client component)
  (app)/
    layout.tsx          ← App shell: top header + bottom tab bar + Ask Sembli FAB
    dashboard/
      page.tsx          ← Stub: "Dashboard coming soon"
    chat/
      page.tsx          ← Stub: full-screen chat (Ask Sembli opens here)
    assets/
      page.tsx          ← Stub: asset list
      [id]/
        page.tsx        ← Stub: asset detail
    timeline/
      page.tsx          ← Stub: 10-year outlook timeline
```

## Components to create

| File | What it is |
|---|---|
| `components/app/Logo.tsx` | Threshold SVG mark, accepts `size` + `color` props |
| `components/app/BottomNav.tsx` | 4-tab bar: Home / Chat / Assets / Timeline |
| `components/app/AskSembli.tsx` | Floating "Ask Sembli" pill button, fixed bottom-center |
| `components/app/AppHeader.tsx` | Top bar: logo left, home name center, avatar right |
| `components/onboarding/ChatOnboarding.tsx` | Full 5-screen flow (ported from design export) |
| `components/onboarding/atoms.tsx` | BotBubble, UserBubble, Highlight, ThinkChip, QuickChip, Composer, SourceCard, MonoLabel, Cite |

## Palette additions to globals.css

Add Almanac light CSS variables under a `.app` selector (so they don't conflict with marketing dark theme):

```css
/* Almanac light — used by (app) route group */
--almanac-bg: #FBF8F1;
--almanac-surface: #FFFFFF;
--almanac-surface-alt: #F4EFE2;
--almanac-ink: #1C1A16;
--almanac-ink-soft: #4A453B;
--almanac-muted: #8B8476;
--almanac-border: #E6DFCE;
--almanac-border-soft: #EFE8D6;
--almanac-brand: #E8D26A;
--almanac-brand-deep: #B89A2E;
--almanac-brand-soft: #F6EDB8;
--almanac-accent: #2D4A3A;
--almanac-accent-soft: #DCE5DC;
--almanac-danger: #B4432B;
--almanac-success: #3F6E4A;
```

## Acceptance criteria

- [ ] `pnpm typecheck` passes with zero errors.
- [ ] `/onboarding` renders all 5 screens, step transitions work, final screen navigates to `/dashboard`.
- [ ] `/dashboard`, `/chat`, `/assets`, `/timeline` all render with the app shell (bottom nav, header).
- [ ] Bottom nav highlights the active tab.
- [ ] Ask Sembli FAB visible on all app pages, tapping routes to `/chat`.
- [ ] All screens look correct at 375px width (iPhone SE).
- [ ] No `any` types. No hardcoded colors outside the CSS variable system.

## Out of scope

- Real data (Task 04)
- Auth guard / redirect (Task 03)
- Actual AI chat (Task 07)
- Payments (Task 08)
