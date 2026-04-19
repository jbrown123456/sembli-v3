# Sembli — Claude Code Session Context
> Paste this at the start of every Claude Code session alongside the relevant files.

---

## What Sembli Is
A mobile-first home management app for homeowners who manage complexity — aging parents' homes, multiple properties, high-income homeowners. Core problem: homeowners can't track what they own, what needs attention, and what's coming financially.

**Tagline:** "Your home, remembered."

**Key differentiator:** AI-first (chat with your home data), editorial design aesthetic (not another utility app), sibling/family collaboration built in.

---

## Current Status
- Pre-launch, validation stage
- Reddit ad test ran: $72 spend, 10,440 impressions, 106 clicks, 1.01% CTR — above average, validated problem resonance
- No paying users yet
- Next validation goal: email capture / waitlist signups from real traffic

---

## What's Been Built

### 1. Sembli2 (Legacy v2) — React Native / Expo
- Repo: https://github.com/jbrown123456/Sembli2.git
- Stack: React Native (Ignite boilerplate), TypeScript, Expo
- Has: Auth, Dashboard, Chat, CoreWorkflow, Tables, Onboarding screens
- Backend: Express + TypeScript, `/ai/chat` endpoint wired to Claude API, audit logging, thread management, modular prompts
- **Critical gap: in-memory only store (no database). Data resets on server restart.**
- Backend is production-quality and should be kept. Just needs Supabase wired in.

### 2. Sembli v3 — New UI