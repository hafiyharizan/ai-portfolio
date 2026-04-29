import { NextResponse, type NextRequest } from "next/server";

import {
  emptyEndorsementStats,
  hasProfanity,
  normalizeTags,
  parseLinkedInUrl,
  sanitizeShortText,
  type EndorsementsResponse,
  type PublicEndorsement,
} from "@/lib/endorsements";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type EndorsementRow = PublicEndorsement & {
  status?: string;
};

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt < now) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function mapPublicEndorsement(row: EndorsementRow): PublicEndorsement {
  return {
    id: row.id,
    provider: row.provider,
    name: row.name,
    avatar_url: row.avatar_url,
    message: row.message,
    role: row.role,
    linkedin_url: row.linkedin_url,
    tags: normalizeTags(row.tags),
    featured: row.featured,
    created_at: row.created_at,
    country: row.country,
  };
}

function fallbackResponse(overrides?: Partial<EndorsementsResponse>) {
  return json({
    configured: false,
    entries: [],
    stats: emptyEndorsementStats(),
    ...overrides,
  } satisfies EndorsementsResponse);
}

export async function GET() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return fallbackResponse();
  }

  const { data, error } = await supabase
    .from("endorsements")
    .select(
      "id, provider, name, avatar_url, message, role, linkedin_url, tags, featured, created_at, country",
    )
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    return fallbackResponse({ configured: true, needsSetup: true });
  }

  const entries = (data ?? []).map((row) =>
    mapPublicEndorsement(row as EndorsementRow),
  );

  const engineerTags = new Set(["Frontend", "Backend", "Data", "Problem Solving"]);
  const countries = new Set(entries.map((entry) => entry.country).filter(Boolean));

  return json({
    configured: true,
    entries,
    stats: {
      visitors: entries.length,
      engineers: entries.filter((entry) =>
        entry.tags.some((tag) => engineerTags.has(tag)),
      ).length,
      countries: countries.size,
    },
  } satisfies EndorsementsResponse);
}

export async function POST(request: NextRequest) {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return json({ error: "Endorsements not configured yet." }, { status: 503 });
  }

  // Rate-limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return json({ error: "Please wait a moment before submitting again." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid payload." }, { status: 400 });
  }

  // Honeypot
  if ("website" in body && sanitizeShortText(body.website, 80)) {
    return json({ ok: true, queued: true });
  }

  const name        = sanitizeShortText("name"    in body ? body.name    : "", 90);
  const message     = sanitizeShortText("message" in body ? body.message : "", 240);
  const role        = sanitizeShortText("role"    in body ? body.role    : "", 90) || null;
  const linkedinUrl = parseLinkedInUrl("linkedin_url" in body ? body.linkedin_url : "");

  if (!name) return json({ error: "Name is required." }, { status: 400 });
  if (message.length < 12) {
    return json({ error: "Please write at least 12 characters." }, { status: 400 });
  }
  if (hasProfanity([name, message, role ?? ""].join(" "))) {
    return json({ error: "Please keep it professional and respectful." }, { status: 400 });
  }

  const country = sanitizeShortText(request.headers.get("x-vercel-ip-country") ?? "", 4) || null;

  const { error } = await adminClient
    .from("endorsements")
    .insert({
      name,
      message,
      role,
      linkedin_url: linkedinUrl,
      provider: "guest",
      tags: [],
      approved: false,
      status: "pending",
      featured: false,
      country,
    });

  if (error) {
    return json(
      { error: error.code === "42P01" ? "Table not set up yet." : "Could not save endorsement." },
      { status: error.code === "42P01" ? 503 : 500 },
    );
  }

  return json({ ok: true, queued: true });
}
