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
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY ?? "",
});

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash-preview-exp";

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

  try {
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
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    const errMessage = err instanceof Error ? err.message : "AI request failed";
    console.error("[chat/route]", status ?? "", errMessage);
    if (status === 429) {
      return new Response("Rate limit reached — please wait a moment and try again.", { status: 429 });
    }
    return new Response(errMessage || "AI request failed", { status: 502 });
  }
}
