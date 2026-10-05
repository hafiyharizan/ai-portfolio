import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  SITE_CONFIG,
  SKILLS,
  PERSONAL_PROJECTS,
  PROFESSIONAL_PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
} from "@/lib/constants";

const client = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

// Tried in order. "gemini-flash-latest" is Google's alias for the current Flash
// model, so it keeps working when individual model versions are retired.
const MODELS = [
  ...new Set([process.env.GEMINI_MODEL, "gemini-flash-latest", "gemini-2.5-flash"].filter(Boolean)),
] as string[];

const UNAVAILABLE_MESSAGE = `The AI assistant is unavailable right now. You can reach Hafiy directly at ${SITE_CONFIG.email}.`;

const SYSTEM_PROMPT = `You are an assistant answering questions about Hafiy Harizan, a software and data engineer based in Perth, Australia.
Do not claim to be Hafiy. Refer to him in the third person.
Only state facts that appear in the context below. If a technology, employer, project or number is not listed, say it isn't listed in his experience — never guess or imply experience he hasn't listed.
For example, if asked about a tool that isn't in the Skills or Experience sections (such as Kubernetes), say it isn't part of his listed experience.

## Current role
${EXPERIENCE[0].title} at ${EXPERIENCE[0].company} (${EXPERIENCE[0].period}).

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
).join("\n")}

## Education
${EDUCATION.map((e) => `- ${e.degree}, ${e.school} (${e.period})`).join("\n")}

## Certifications
${CERTIFICATIONS.map((c) => `- ${c.name} (${c.period})`).join("\n")}`;

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

  if (!process.env.GEMINI_API_KEY) {
    console.error("[chat/route] GEMINI_API_KEY is not set");
    return new Response(UNAVAILABLE_MESSAGE, { status: 503 });
  }

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...validHistory,
    { role: "user" as const, content: message },
  ];

  try {
    let stream: Awaited<ReturnType<typeof createStream>> | undefined;
    let lastErr: unknown;
    for (const model of MODELS) {
      try {
        stream = await createStream(model, messages);
        break;
      } catch (err) {
        lastErr = err;
        const status = (err as { status?: number }).status;
        console.error("[chat/route]", model, status ?? "", err instanceof Error ? err.message : err);
        // Rate limits and server errors won't be fixed by another model name.
        if (status === 429 || (status !== undefined && status >= 500)) break;
      }
    }
    if (!stream) throw lastErr;
    const completion = stream;

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 429) {
      return new Response("Rate limit reached — please wait a moment and try again.", { status: 429 });
    }
    // Upstream details stay in the server log; visitors get a friendly message.
    if (status === 400 || status === 401 || status === 403) {
      console.error("[chat/route] Gemini rejected the request — check GEMINI_API_KEY is valid and GEMINI_MODEL (if set) exists.");
    }
    return new Response(UNAVAILABLE_MESSAGE, { status: 502 });
  }
}

function createStream(
  model: string,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
  return client.chat.completions.create({ model, stream: true, messages });
}
