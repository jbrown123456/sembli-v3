# Task 07 — Chat with AI Assistant (Ask Sembli)

**Phase:** 4c
**Owner:** Claude Code
**Status:** ⚪ Pending
**Blocks:** —
**Depends on:** 02, 03, 04, #14 (Claude API — locked: Claude)

## Goal

The `/chat` page becomes a real, persistent AI conversation. Ask Sembli knows about the user's home, assets, and maintenance history. It answers questions, gives recommendations, and can create maintenance events or flag issues. Conversations are persisted to Postgres.

## Decision locked (#14)

- Primary model: `claude-opus-4-5` (complex reasoning, tool use)
- Quick responses: `claude-haiku-4-5` (short factual answers)
- No embeddings / vector search in v1 — Claude gets context via structured DB lookup (assets + recent maintenance). Add pgvector in v2 if context window becomes a bottleneck.

## Context strategy

Every conversation turn, build a system prompt that includes:

```
You are Sembli, a knowledgeable home assistant. You help homeowners track, maintain, 
and make smart decisions about their home assets.

USER'S HOME:
- Name: {home.name}
- Address: {home.address}
- Year built: {home.year_built}

ASSETS ({n} total):
{for each asset: category, name, make/model, install_date, warranty_expiry}

UPCOMING MAINTENANCE ({n} events in next 90 days):
{event title, asset, due date}

OVERDUE MAINTENANCE ({n} events):
{event title, asset, days overdue}

Today's date: {date}
```

Keep system prompt under ~2,000 tokens. No document text in v1.

## Claude tools (tool use)

Expose these tools to Claude so it can take action mid-conversation:

| Tool | What it does |
|---|---|
| `create_maintenance_event` | Schedules a new maintenance event for an asset |
| `complete_maintenance_event` | Marks an event complete |
| `get_asset_details` | Returns full details for a specific asset |
| `get_maintenance_history` | Returns completed events for an asset |
| `search_assets` | Finds assets by keyword/category |

Tool calls execute server-side via the streaming route handler. Results are appended as `tool_result` messages and Claude continues.

## API route

`app/api/chat/route.ts` — POST, streaming:

```ts
// Request
{ conversationId: string | null; message: string }

// Response
// Server-Sent Events stream of text delta + tool use events
```

Flow:
1. Auth check
2. Load or create `conversation` record
3. Insert user `message` to DB
4. Build context (home + assets + maintenance)
5. Call Claude with streaming + tools
6. Stream text deltas to client
7. Handle tool calls server-side, insert tool messages to DB
8. On stream end, insert final assistant message to DB

Rate limit: 30 messages/hour per user (Pro), 0 (Free — gated in Task 08).

## Components

| File | What |
|---|---|
| `app/(app)/chat/page.tsx` | Server: loads conversation list, renders shell |
| `components/app/chat/ChatWindow.tsx` | Client: message list + composer |
| `components/app/chat/MessageBubble.tsx` | User / assistant bubble with markdown rendering |
| `components/app/chat/ToolCallChip.tsx` | Inline indicator when Claude uses a tool ("Checking your HVAC…") |
| `components/app/chat/Composer.tsx` | Textarea + send button, handles streaming state |
| `components/app/chat/ConversationList.tsx` | Left/bottom nav of past conversations (mobile: bottom sheet) |
| `components/app/chat/TypingIndicator.tsx` | Three-dot animation during streaming |
| `components/app/chat/UpgradePrompt.tsx` | "Ask Sembli is a Pro feature" gate (Free tier) |

## Markdown rendering

Use `react-markdown` with `remark-gfm` for assistant messages. Style to match Almanac palette — no default prose styles.

## AskSembli FAB update

The existing FAB (from Task 02) already routes to `/chat`. Update it to:
- Pass `?new=1` query param → starts a fresh conversation
- Without param → resumes most recent conversation

## Env vars

```
ANTHROPIC_API_KEY=sk-ant-...   # already added in Task 05
```

## Acceptance criteria

- [ ] `pnpm typecheck` clean
- [ ] Can send a message and receive a streaming response
- [ ] Claude has context about user's home + assets in every turn
- [ ] Tool calls work: "Schedule a filter change for next month" creates a `maintenance_event`
- [ ] Conversation persists across page refreshes
- [ ] Multiple conversations supported
- [ ] Free tier sees upgrade prompt instead of composer
- [ ] TypingIndicator shows during streaming
- [ ] 375px width looks correct

## Out of scope

- Photo/PDF uploads in chat (post-launch)
- Voice input
- Conversation search
- Claude remembers across conversations (v2 — needs embeddings)
