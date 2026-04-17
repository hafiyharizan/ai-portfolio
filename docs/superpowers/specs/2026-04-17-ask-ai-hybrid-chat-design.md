# Ask AI — Hybrid Chat Design

**Date:** 2026-04-17
**Status:** Approved

---

## Overview

Upgrade the AskAI section from a pure keyword-matched canned response system to a hybrid routing system. A lightweight client-side scorer decides whether to return a canned response or call a real AI (OpenRouter). This keeps common recruiter questions fast and free, while giving the AI room to handle anything unusual, opinionated, or complex.

---

## Routing Logic

Three checks run in order on every submission:

```
1. Veto check  →  if vetoed         → real AI
2. Score check →  if score < 0.75   → real AI
3. Margin check → if top - second < 0.15 → real AI (ambiguity protection)
4. Otherwise                        → canned response
```

### Veto Phrases (hard block — always real AI)

If the question contains any of the following, skip scoring entirely:

- `"how would you"`
- `"what do you think"`
- `"explain"`
- `"compare"`
- `"tradeoff"`

These signal opinion-based, deep-dive, or analytical questions where a canned answer would feel worse than real AI.

### Scorer (`src/lib/ai-router.ts`)

Each canned category has:
- `phrases: [{ text, weight }]` — multi-word, score higher (2.0× base weight)
- `keywords: [{ text, weight }]` — single words, score lower (1.0× base weight)

Score is normalized against the category's max possible score, producing a value in [0, 1].

**Modifiers:**
- Recruiter prefix boost (× 1.2): question starts with `"tell me"`, `"what is"`, `"can you"`, `"describe"`, `"how has"`
- Tiered length penalty:
  - > 80 chars → × 0.85
  - > 140 chars → × 0.70

**Ambiguity guard:** after scoring all categories, top score must beat second-best by ≥ 0.15. If not, route to real AI even if score ≥ 0.75.

### Canned Categories

| Category | Covers |
|---|---|
| `intro` | About Hafiy, who he is, intro questions |
| `skills` | Tech skills, what he knows, strongest skill |
| `stack` | Tech stack, tools, languages, frameworks |
| `projects` | Personal projects (Salasilah, ChoreJoy, etc.) |
| `experience` | Work history, Telekom Malaysia, roles |
| `contact` | Availability, location, email, how to reach |
| `hire` | Why hire Hafiy, what makes him a good fit |
| `recruiter` | Common recruiter questions (salary, visa, relocation) |

---

## API Route

**Location:** `src/app/api/chat/route.ts`

**Method:** `POST`

**Request body:**
```ts
{
  message: string,
  history: { role: "user" | "assistant", content: string }[]
}
```

**Server-side behaviour:**
1. Validate `message` — reject if missing or empty
2. Validate `history` — filter to valid `{role, content}` shapes only
3. Hard-cap history to last 6 messages after filtering
4. Build system prompt from `constants.ts` data
5. Call OpenRouter with `stream: true`
6. Proxy plain text chunks back to client as they arrive

**System prompt structure:**
```
You are an assistant answering questions about Hafiy Harizan, a software and data engineer based in Perth, Australia.
Do not claim to be Hafiy. Refer to him in the third person.
If something is not in the provided context, say so briefly — do not invent details.

[Hafiy's key facts: role, location, skills, projects, experience — pulled from constants.ts]
```

**Model:** read from `process.env.OPENROUTER_MODEL`, defaulting to `"openai/gpt-oss-120b:free"`.

**API key:** `process.env.OPENROUTER_API_KEY` — must be set in `.env.local`.

**Streaming:** OpenAI SDK (`openai` package, `baseURL: "https://openrouter.ai/api/v1"`), `stream: true`, plain text chunks piped back — no JSON wrapping.

---

## Component State

**Location:** `src/components/sections/ask-ai.tsx`

**New/updated state:**
```ts
response: string
streamingText: string
isStreaming: boolean
responseSource: "canned" | "ai" | null
history: { role: "user" | "assistant", content: string }[]
```

**On every new submission — clear transient state first:**
```
streamingText = ""
isStreaming = false
responseSource = null
response = ""
```

**Canned path:**
1. Set `responseSource = "canned"`
2. Apply 1.5s simulated delay (existing behaviour)
3. Set `response` to canned answer
4. Commit `{ user, assistant }` pair to history

**AI path:**
1. Set `isStreaming = true`, `responseSource = "ai"`
2. Fetch `/api/chat` with `{ message, history: last6 }`
3. Append each plain text chunk to `streamingText` (UI only — not history)
4. On stream complete:
   - Move assembled text to `response`
   - Clear `streamingText`
   - Set `isStreaming = false`
5. Commit full `{ user, assistant }` pair to history (never partial)

**History management:**
- Push pair only when answer is fully complete
- Trim to last 6 entries after each push

**UI badge:** show a small `"AI"` label on the response card when `responseSource === "ai"`, nothing when `"canned"`.

---

## Files Affected

| File | Change |
|---|---|
| `src/lib/ai-router.ts` | New — scorer + veto check + canned response data |
| `src/app/api/chat/route.ts` | New — streaming API route |
| `src/components/sections/ask-ai.tsx` | Updated — new state, routing, streaming display |
| `.env.local` | Add `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL` |
| `package.json` | Add `openai` SDK dependency |

---

## Out of Scope

- Semantic/embedding-based similarity scoring
- LLM-based question classification
- Persistent chat history across page reloads
- Rate limiting or abuse protection
