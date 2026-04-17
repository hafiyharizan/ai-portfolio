# Ask AI Hybrid Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the AskAI section to route questions to instant canned responses or real streaming AI (OpenRouter) using a confidence scorer with veto logic, weighted phrase/keyword matching, and ambiguity protection.

**Architecture:** A pure client-side scorer (`ai-router.ts`) decides routing before any network call is made. The real AI path calls a Next.js App Router streaming handler that proxies OpenRouter responses as plain text. The component tracks a rolling 6-message history and streams AI replies word-by-word.

**Tech Stack:** Next.js 16 App Router, `openai` SDK (OpenRouter-compatible), Vitest for unit tests, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/ai-router.ts` | Create | Types, veto check, canned data, scorer, routing function |
| `src/lib/ai-router.test.ts` | Create | Unit tests for ai-router |
| `src/app/api/chat/route.ts` | Create | Streaming POST handler via OpenRouter |
| `src/components/sections/ask-ai.tsx` | Modify | New state, routing integration, streaming display |
| `vitest.config.ts` | Create | Vitest config with `@` path alias |
| `package.json` | Modify | Add `openai`, `vitest` |
| `.env.local` | Modify | `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` |

---

## Task 1: Install dependencies and configure test runner

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Modify: `.env.local`

- [ ] **Step 1: Install openai SDK and vitest**

```bash
npm install openai
npm install -D vitest
```

Expected: both appear in `package.json` dependencies.

- [ ] **Step 2: Add test scripts to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest.config.ts**

Create `vitest.config.ts` at the project root:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 4: Add env vars to .env.local**

Add to `.env.local` (create it if it doesn't exist — it is git-ignored):

```
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b:free
```

- [ ] **Step 5: Verify vitest runs**

```bash
npm test
```

Expected: "No test files found" or 0 tests passing — no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add openai SDK and vitest"
```

---

## Task 2: Create ai-router.ts — types and veto check

**Files:**
- Create: `src/lib/ai-router.ts`
- Create: `src/lib/ai-router.test.ts`

- [ ] **Step 1: Write the failing test for isVetoed**

Create `src/lib/ai-router.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { isVetoed } from "./ai-router";

describe("isVetoed", () => {
  it("vetoes opinion and deep-dive phrases", () => {
    expect(isVetoed("what do you think about his skills")).toBe(true);
    expect(isVetoed("how would you describe his approach")).toBe(true);
    expect(isVetoed("can you explain his data pipeline work")).toBe(true);
    expect(isVetoed("compare his background with a senior engineer")).toBe(true);
    expect(isVetoed("what tradeoff did he make on the DREAM project")).toBe(true);
  });

  it("does not veto clean recruiter questions", () => {
    expect(isVetoed("what is Hafiy's strongest skill")).toBe(false);
    expect(isVetoed("tell me about his projects")).toBe(false);
    expect(isVetoed("what tech stack does he use")).toBe(false);
    expect(isVetoed("how can I contact Hafiy")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test — expect failure (module not found)**

```bash
npm test
```

Expected: FAIL — `Cannot find module './ai-router'`

- [ ] **Step 3: Create src/lib/ai-router.ts with types and isVetoed**

```typescript
export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export type ResponseSource = "canned" | "ai";

export interface RouterResult {
  source: ResponseSource;
  category?: string;
  response?: string;
}

interface WeightedTerm {
  text: string;
  weight: number;
}

interface CategoryConfig {
  response: string;
  phrases: WeightedTerm[];
  keywords: WeightedTerm[];
}

const VETO_PHRASES = [
  "how would you",
  "what do you think",
  "explain",
  "compare",
  "tradeoff",
];

export function isVetoed(input: string): boolean {
  const lower = input.toLowerCase();
  return VETO_PHRASES.some((phrase) => lower.includes(phrase));
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test
```

Expected: 5 passing tests (all isVetoed tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai-router.ts src/lib/ai-router.test.ts
git commit -m "feat: add ai-router types and veto check with tests"
```

---

## Task 3: Add canned response data

**Files:**
- Modify: `src/lib/ai-router.ts`

- [ ] **Step 1: Append CATEGORIES to ai-router.ts**

Append the following after `isVetoed` in `src/lib/ai-router.ts`:

```typescript
export const CATEGORIES: Record<string, CategoryConfig> = {
  intro: {
    response:
      "Hafiy Harizan is a software and data engineer based in Perth, Australia, with 4+ years of experience. He specialises in building end-to-end data pipelines, full-stack web applications, and AI-enabled solutions — comfortable across the full stack from React and Next.js on the frontend to Python, SQL, and cloud services on the data and backend layer.",
    phrases: [
      { text: "who is hafiy", weight: 4 },
      { text: "tell me about hafiy", weight: 4 },
      { text: "about hafiy", weight: 3.5 },
      { text: "introduce hafiy", weight: 3 },
    ],
    keywords: [
      { text: "background", weight: 1.5 },
      { text: "overview", weight: 1.5 },
      { text: "introduction", weight: 1.5 },
    ],
  },
  skills: {
    response:
      "Hafiy's strongest technical skill is data engineering — specifically designing and building end-to-end ELT pipelines, scalable data platforms, and automated workflows using Python, SQL, and cloud services. He pairs this with strong full-stack development skills in React, Next.js, and TypeScript, making him equally comfortable building the frontend that consumes the data.",
    phrases: [
      { text: "strongest skill", weight: 4 },
      { text: "technical skill", weight: 4 },
      { text: "best at", weight: 3.5 },
      { text: "what skills", weight: 3 },
      { text: "what can he do", weight: 3 },
    ],
    keywords: [
      { text: "skill", weight: 2 },
      { text: "strongest", weight: 2 },
      { text: "expertise", weight: 1.5 },
      { text: "abilities", weight: 1 },
    ],
  },
  stack: {
    response:
      "Hafiy's core tech stack includes TypeScript, React, and Next.js for frontend; Python, Node.js, and PHP for backend; PostgreSQL, MySQL, and MariaDB for databases; and Docker, GitLab CI/CD, and Linux for DevOps. On the data and AI side he works with Azure AI Studio, Azure OpenAI, Power BI, Tableau, Pandas, and NumPy.",
    phrases: [
      { text: "tech stack", weight: 4.5 },
      { text: "technology stack", weight: 4.5 },
      { text: "what technologies", weight: 3.5 },
      { text: "what tools", weight: 3 },
      { text: "what languages", weight: 3 },
      { text: "what frameworks", weight: 3 },
    ],
    keywords: [
      { text: "stack", weight: 3 },
      { text: "technologies", weight: 2 },
      { text: "tools", weight: 1 },
      { text: "languages", weight: 1 },
      { text: "frameworks", weight: 1 },
    ],
  },
  projects: {
    response:
      "Hafiy has built several personal projects: Salasilah (a family tree and genealogy app using Next.js and D3.js), ChoreJoy (a gamified family chore app with React and Node.js), FridgeBoard (a household organization hub as a PWA), an Expense Tracker with rich analytics dashboards, and ApplyAI — an AI-powered job application assistant. Professionally, his flagship project was DREAM (Data Repository for Exploratory Analysis and Management), a centralised data platform at Telekom Malaysia that reduced data preparation time from hours to minutes.",
    phrases: [
      { text: "personal projects", weight: 4 },
      { text: "what has hafiy built", weight: 4 },
      { text: "tell me about the dream", weight: 4.5 },
      { text: "dream project", weight: 4.5 },
      { text: "what projects", weight: 3 },
      { text: "projects hafiy", weight: 3.5 },
    ],
    keywords: [
      { text: "project", weight: 2 },
      { text: "built", weight: 1.5 },
      { text: "dream", weight: 3 },
      { text: "salasilah", weight: 3 },
      { text: "chorejoy", weight: 3 },
      { text: "fridgeboard", weight: 3 },
      { text: "applyai", weight: 3 },
    ],
  },
  experience: {
    response:
      "Hafiy spent 4+ years at Telekom Malaysia in progressively senior engineering roles — starting as a Trainee, moving to Network Geospatial Viz Solution Engineer, and most recently Visualisation & Software Engineer. His work spanned production data pipeline engineering, geospatial analytics, full-stack development, and integrating ML outputs into analytics platforms processing data from 3M+ customers.",
    phrases: [
      { text: "work experience", weight: 4.5 },
      { text: "where has hafiy worked", weight: 4 },
      { text: "career history", weight: 4 },
      { text: "work history", weight: 4 },
      { text: "telekom malaysia", weight: 4.5 },
      { text: "previous role", weight: 3 },
    ],
    keywords: [
      { text: "experience", weight: 2 },
      { text: "worked", weight: 1.5 },
      { text: "career", weight: 2 },
      { text: "telekom", weight: 3 },
      { text: "role", weight: 0.5 },
    ],
  },
  contact: {
    response:
      "Hafiy is based in Perth, Australia, and is actively seeking new opportunities. You can reach him at hafiyharizan@gmail.com or connect on LinkedIn at linkedin.com/in/hafiyharizan. He's open to discussing roles in software engineering, data engineering, and analytics.",
    phrases: [
      { text: "how to contact", weight: 4.5 },
      { text: "how to reach", weight: 4.5 },
      { text: "get in touch", weight: 4 },
      { text: "contact hafiy", weight: 4.5 },
      { text: "is hafiy available", weight: 4 },
      { text: "open to work", weight: 4 },
    ],
    keywords: [
      { text: "contact", weight: 2.5 },
      { text: "email", weight: 2.5 },
      { text: "reach", weight: 2 },
      { text: "available", weight: 2 },
      { text: "linkedin", weight: 2.5 },
      { text: "availability", weight: 2.5 },
    ],
  },
  hire: {
    response:
      "Hafiy brings 4+ years of hands-on experience building production data pipelines processing millions of records daily. He's automated compliance reporting (100% on-time submissions), designed scalable data mart architectures, and integrated ML outputs into analytics workflows. His unique blend of software engineering and data engineering means he builds robust, maintainable systems — not just scripts.",
    phrases: [
      { text: "why hire hafiy", weight: 4.5 },
      { text: "why should we hire", weight: 4.5 },
      { text: "good fit", weight: 3.5 },
      { text: "what makes hafiy", weight: 3.5 },
      { text: "data engineering role", weight: 3.5 },
    ],
    keywords: [
      { text: "hire", weight: 2 },
      { text: "fit", weight: 1.5 },
      { text: "value", weight: 1 },
      { text: "strength", weight: 1 },
    ],
  },
  recruiter: {
    response:
      "Hafiy is based in Perth, Australia, and is actively looking for software or data engineering roles. He has 4+ years of professional experience and is open to discussing requirements, timelines, and opportunities. The best way to reach him is at hafiyharizan@gmail.com.",
    phrases: [
      { text: "currently looking", weight: 4 },
      { text: "open to opportunities", weight: 4 },
      { text: "notice period", weight: 4.5 },
      { text: "when can he start", weight: 4.5 },
      { text: "salary expectations", weight: 4.5 },
      { text: "working rights", weight: 4.5 },
      { text: "visa status", weight: 4.5 },
      { text: "right to work", weight: 4.5 },
    ],
    keywords: [
      { text: "salary", weight: 3 },
      { text: "notice", weight: 3 },
      { text: "visa", weight: 3 },
      { text: "relocate", weight: 2 },
      { text: "remote", weight: 1 },
      { text: "hybrid", weight: 1 },
    ],
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/ai-router.ts
git commit -m "feat: add canned response data for 8 categories"
```

---

## Task 4: Implement scorer and routing function

**Files:**
- Modify: `src/lib/ai-router.ts`
- Modify: `src/lib/ai-router.test.ts`

- [ ] **Step 1: Write failing tests for routeQuestion**

Replace `src/lib/ai-router.test.ts` with the full file (includes existing veto tests):

```typescript
import { describe, it, expect } from "vitest";
import { isVetoed, routeQuestion } from "./ai-router";

describe("isVetoed", () => {
  it("vetoes opinion and deep-dive phrases", () => {
    expect(isVetoed("what do you think about his skills")).toBe(true);
    expect(isVetoed("how would you describe his approach")).toBe(true);
    expect(isVetoed("can you explain his data pipeline work")).toBe(true);
    expect(isVetoed("compare his background with a senior engineer")).toBe(true);
    expect(isVetoed("what tradeoff did he make on the DREAM project")).toBe(true);
  });

  it("does not veto clean recruiter questions", () => {
    expect(isVetoed("what is Hafiy's strongest skill")).toBe(false);
    expect(isVetoed("tell me about his projects")).toBe(false);
    expect(isVetoed("what tech stack does he use")).toBe(false);
    expect(isVetoed("how can I contact Hafiy")).toBe(false);
  });
});

describe("routeQuestion", () => {
  it("vetoed questions always route to ai", () => {
    expect(routeQuestion("can you explain his pipeline architecture").source).toBe("ai");
    expect(routeQuestion("what do you think about his skill level").source).toBe("ai");
  });

  it("skills question routes to canned with correct category", () => {
    const result = routeQuestion("what is Hafiy's strongest technical skill");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("skills");
    expect(typeof result.response).toBe("string");
  });

  it("experience question routes to canned", () => {
    const result = routeQuestion("tell me about his work experience");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("experience");
  });

  it("contact question routes to canned", () => {
    const result = routeQuestion("how to contact Hafiy");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("contact");
  });

  it("ambiguous multi-topic question routes to ai", () => {
    // projects and skills both fire — margin too small
    const result = routeQuestion("tell me about his projects and skills");
    expect(result.source).toBe("ai");
  });

  it("low confidence question routes to ai", () => {
    const result = routeQuestion("is he a morning person");
    expect(result.source).toBe("ai");
  });
});
```

- [ ] **Step 2: Run tests — expect failure on routeQuestion import**

```bash
npm test
```

Expected: FAIL — `routeQuestion is not exported from ./ai-router`

- [ ] **Step 3: Append scorer and routeQuestion to ai-router.ts**

Append after the `CATEGORIES` block in `src/lib/ai-router.ts`:

```typescript
const RECRUITER_PREFIXES = [
  "tell me",
  "what is",
  "can you",
  "describe",
  "how has",
  "how can",
];

// Normalize raw score against a cap of 8 — a score of 8+ raw = 1.0 confidence.
// Tune phrase/keyword weights so a clear single-topic question scores ~6-8 raw.
// If a test routes to "ai" unexpectedly, increase phrase weights for that category
// rather than lowering the threshold.
function scoreCategory(input: string, config: CategoryConfig): number {
  const lower = input.toLowerCase();
  let raw = 0;

  for (const phrase of config.phrases) {
    if (lower.includes(phrase.text)) raw += phrase.weight;
  }
  for (const kw of config.keywords) {
    if (lower.includes(kw.text)) raw += kw.weight;
  }

  const startsWithRecruiter = RECRUITER_PREFIXES.some((prefix) =>
    lower.trimStart().startsWith(prefix)
  );
  if (startsWithRecruiter) raw *= 1.2;

  if (input.length > 140) raw *= 0.7;
  else if (input.length > 80) raw *= 0.85;

  return Math.min(raw / 8, 1);
}

export function routeQuestion(input: string): RouterResult {
  if (isVetoed(input)) return { source: "ai" };

  const scores = Object.entries(CATEGORIES).map(([category, config]) => ({
    category,
    score: scoreCategory(input, config),
  }));

  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];

  if (top.score >= 0.75 && top.score - second.score >= 0.15) {
    return {
      source: "canned",
      category: top.category,
      response: CATEGORIES[top.category].response,
    };
  }

  return { source: "ai" };
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test
```

Expected: all tests green.

If a routing test fails (e.g. a "canned" case routes to "ai"), increase the phrase weights for that category in `CATEGORIES` — do not change the 0.75 threshold. Re-run until green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ai-router.ts src/lib/ai-router.test.ts
git commit -m "feat: implement scorer and routing function with tests"
```

---

## Task 5: Create the streaming API route

**Files:**
- Create: `src/app/api/chat/route.ts`

- [ ] **Step 1: Check the Next.js 16 streaming route docs**

Read the relevant streaming guide before writing the handler:

```bash
ls node_modules/next/dist/docs/
```

Open and skim any file related to route handlers or streaming — look for any breaking changes to `Response`, `ReadableStream`, or route handler exports in Next.js 16.

- [ ] **Step 2: Create src/app/api/chat/route.ts**

```typescript
import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  SITE_CONFIG,
  SKILLS,
  PERSONAL_PROJECTS,
  PROFESSIONAL_PROJECTS,
  EXPERIENCE,
} from "@/lib/constants";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

const MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-120b:free";

const SYSTEM_PROMPT = `You are an assistant answering questions about Hafiy Harizan, a software and data engineer based in Perth, Australia.
Do not claim to be Hafiy. Refer to him in the third person.
If something is not in the provided context, say so briefly — do not invent details.

## About Hafiy
${SITE_CONFIG.description}
Location: ${SITE_CONFIG.location}
Email: ${SITE_CONFIG.email}

## Skills
${Object.entries(SKILLS)
  .map(([cat, skills]) => `${cat}: ${(skills as readonly string[]).join(", ")}`)
  .join("\n")}

## Personal Projects
${PERSONAL_PROJECTS.map((p) => `- ${p.name} (${p.tagline}): ${p.description}`).join("\n")}

## Professional Projects
${PROFESSIONAL_PROJECTS.map(
  (p) => `- ${p.name} — ${p.fullName}: ${p.description} Impact: ${p.impact}`
).join("\n")}

## Experience
${EXPERIENCE.map(
  (e) => `- ${e.title} at ${e.company} (${e.period}): ${e.description.join(" ")}`
).join("\n")}`;

type HistoryMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(m: unknown): m is HistoryMessage {
  if (typeof m !== "object" || m === null) return false;
  const msg = m as Record<string, unknown>;
  return (
    (msg.role === "user" || msg.role === "assistant") &&
    typeof msg.content === "string" &&
    msg.content.length > 0
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).message !== "string" ||
    !(body as Record<string, unknown>).message
  ) {
    return new Response("Missing or empty message", { status: 400 });
  }

  const { message, history = [] } = body as {
    message: string;
    history: unknown[];
  };

  const validHistory = (Array.isArray(history) ? history : [])
    .filter(isValidMessage)
    .slice(-6);

  const stream = await client.chat.completions.create({
    model: MODEL,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...validHistory,
      { role: "user", content: message },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
```

- [ ] **Step 3: Test the route manually**

Start the dev server (make sure `.env.local` has a valid `OPENROUTER_API_KEY`):

```bash
npm run dev
```

In a second terminal:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What data engineering projects has Hafiy worked on?", "history": []}' \
  --no-buffer
```

Expected: streaming plain text chunks about Hafiy's projects appear in the terminal as they arrive.

If you get a 500: check that the dev server was restarted after `.env.local` was created — Next.js only reads env files at startup.

If you get an OpenRouter error: verify the API key is correct and the model name `openai/gpt-oss-120b:free` is still available at openrouter.ai/models.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add streaming OpenRouter chat API route"
```

---

## Task 6: Update ask-ai.tsx component

**Files:**
- Modify: `src/components/sections/ask-ai.tsx`

- [ ] **Step 1: Replace ask-ai.tsx with the updated component**

Full replacement for `src/components/sections/ask-ai.tsx`:

```typescript
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";
import { routeQuestion, type Message } from "@/lib/ai-router";

const SUGGESTED_QUESTIONS = [
  "What's Hafiy's strongest technical skill?",
  "Tell me about the DREAM project",
  "What makes Hafiy a good fit for a data engineering role?",
  "What personal projects has Hafiy built?",
];

export function AskAI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [responseSource, setResponseSource] = useState<"canned" | "ai" | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(
    async (question?: string) => {
      const q = question ?? input;
      if (!q.trim() || isStreaming) return;

      // Clear transient state before each new submission
      setStreamingText("");
      setIsStreaming(false);
      setResponseSource(null);
      setResponse("");

      // Cancel any in-flight request from a previous submission
      abortRef.current?.abort();

      const result = routeQuestion(q);

      if (result.source === "canned") {
        setResponseSource("canned");
        setTimeout(() => {
          const answer = result.response!;
          setResponse(answer);
          setHistory((prev) =>
            [
              ...prev,
              { role: "user" as const, content: q },
              { role: "assistant" as const, content: answer },
            ].slice(-6)
          );
        }, 1500);
        return;
      }

      // Real AI path
      setIsStreaming(true);
      setResponseSource("ai");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setResponse("Sorry, something went wrong. Please try again.");
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assembled = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assembled += chunk;
          setStreamingText(assembled);
        }

        // Commit to response only when stream is complete
        setResponse(assembled);
        setStreamingText("");
        setIsStreaming(false);
        setHistory((prev) =>
          [
            ...prev,
            { role: "user" as const, content: q },
            { role: "assistant" as const, content: assembled },
          ].slice(-6)
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setResponse("Sorry, something went wrong. Please try again.");
        setIsStreaming(false);
      }
    },
    [input, isStreaming, history]
  );

  // isLoading is true during the canned delay or while the AI stream hasn't started yet
  const isLoading =
    isStreaming ||
    (responseSource === "canned" && !response);
  const displayText = streamingText || response;

  return (
    <section
      id="ask-ai"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Ask AI about Hafiy"
    >
      {/* Radial gradient background accent */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(109, 40, 217, 0.08), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Heading */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="gradient-text text-sm font-semibold uppercase tracking-widest">
            Ask AI
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Curious about me?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Ask my AI anything about my experience, skills, or projects.
          </p>
        </motion.div>

        {/* Input card */}
        <motion.div
          className="relative rounded-2xl border border-border bg-card p-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center gap-3">
            {/* Animated gradient orb */}
            <motion.div
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              }}
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 12px rgba(139,92,246,0.3)",
                  "0 0 24px rgba(37,99,235,0.4)",
                  "0 0 12px rgba(139,92,246,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Ask me anything about Hafiy..."
              className="min-w-0 flex-1 bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Ask a question about Hafiy"
            />

            {/* Submit button */}
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isStreaming}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all duration-200 hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send question"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Suggested questions */}
        <motion.div
          className="mt-4 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => {
                setInput(question);
                handleSubmit(question);
              }}
              disabled={isStreaming}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent-light hover:text-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </motion.div>

        {/* Response area */}
        <AnimatePresence mode="wait">
          {(isLoading || displayText) && (
            <motion.div
              className="mt-8 rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {isLoading && !displayText ? (
                <div
                  className="flex items-center gap-1.5"
                  aria-label="Loading response"
                  role="status"
                >
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <motion.p
                    className="leading-relaxed text-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {displayText}
                  </motion.p>
                  {responseSource === "ai" && (
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-light">
                      AI
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Test in browser**

```bash
npm run dev
```

Open `http://localhost:3000` and verify these three paths:

1. Click **"What's Hafiy's strongest technical skill?"** — should show loading dots for ~1.5s, then canned text with no AI badge.
2. Type **"what do you think about his approach to data engineering?"** — should call real AI, stream text word-by-word, show **AI** badge when done.
3. After step 2, type **"tell me more about that"** — should include prior context in the API call (response will reference the previous answer).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ask-ai.tsx
git commit -m "feat: hybrid Ask AI with confidence routing and streaming"
```

---

## Self-Review Notes

- Veto check is a hard gate before scoring — matches spec ✅
- Ambiguity guard (top - second ≥ 0.15) is in `routeQuestion` — matches spec ✅
- Tiered length penalty (>80 → ×0.85, >140 → ×0.70) is in `scoreCategory` — matches spec ✅
- History committed only after full answer (canned: after timeout, AI: after stream complete) — matches spec ✅
- `responseSource` is explicit state, not inferred — matches spec ✅
- Transient state cleared at submission start — matches spec ✅
- Server validates and caps history independently of client — matches spec ✅
- Model is configurable via `OPENROUTER_MODEL` env var — matches spec ✅
