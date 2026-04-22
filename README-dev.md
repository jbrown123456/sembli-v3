# Sembli Dev Workflow — Cowork ↔ Claude Code

This is the day-to-day loop for building Sembli. Two tools, different jobs.

## The split

**Cowork (Anthropic desktop app)** — the architect/PM seat. You do these things here:
- Plan phases, sequence tasks, make product decisions
- Generate PRDs and implementation briefs (the `tasks/NN-*.md` files)
- Decide tradeoffs (pricing, AI model, scope cuts)
- Review progress, update the Task list
- Update product memory

**Claude Code (terminal CLI, run inside this repo)** — the engineer seat. You do these things here:
- Scaffold code, write features, fix bugs
- Run migrations, regenerate types
- Run tests, inspect failures, iterate
- Commit and push

The two tools do **not** share memory. The bridge between them is: **files checked into this repo.** Specifically `CLAUDE.md` (project conventions) and `tasks/NN-*.md` (the brief for the current piece of work).

## Day-to-day loop

1. Open Cowork. Pick the next task in the plan.
2. In Cowork, ask for the implementation brief — it writes `tasks/NN-task-name.md` into the repo.
3. Commit the brief to main (or a branch — your call).
4. Open a terminal in the repo. Run `claude` (Claude Code CLI).
5. Say: *"Implement `tasks/NN-task-name.md`. Ask before making architectural decisions not specified in the brief."*
6. Review the diff, test locally, merge/push.
7. Come back to Cowork. Mark the task complete in the Task list. Pick the next one.

## When to go back to Cowork mid-task

- You hit a decision not covered by the brief (stop Claude Code, ask Cowork, return with an updated brief).
- You want a second opinion on an approach Claude Code proposed.
- You need a PRD, a landing page copy draft, a pricing analysis, a Reddit ad variant, etc. — non-code artifacts.

## When to stay in Claude Code

- Any file editing inside the repo.
- Debugging a failing test or runtime error.
- Git ops, deploys, migration runs.
- Anything where the answer is "change this code."

## Why this works

Claude Code is fastest when it has a tight, well-scoped spec and a clean repo with conventions documented in `CLAUDE.md`. Cowork is best for the think-work that produces those specs. Mixing them in one tool drags both down.
