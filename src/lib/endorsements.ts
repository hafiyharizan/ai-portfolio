export const ENDORSEMENT_TAGS = [
  "Frontend",
  "Backend",
  "Data",
  "Design",
  "Problem Solving",
  "Leadership",
  "Great Portfolio",
] as const;

export type EndorsementTag = (typeof ENDORSEMENT_TAGS)[number];

export type PublicEndorsement = {
  id: string;
  provider: string;
  name: string;
  avatar_url: string | null;
  message: string;
  role: string | null;
  linkedin_url: string | null;
  tags: EndorsementTag[];
  featured: boolean;
  created_at: string;
  country: string | null;
};

export type EndorsementStats = {
  visitors: number;
  engineers: number;
  countries: number;
};

export type EndorsementsResponse = {
  configured: boolean;
  needsSetup?: boolean;
  entries: PublicEndorsement[];
  stats: EndorsementStats;
};

const bannedTerms = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "cunt",
  "dick",
  "slut",
  "whore",
];

export function normalizeTags(tags: unknown): EndorsementTag[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  const allowed = new Set<string>(ENDORSEMENT_TAGS);
  return Array.from(
    new Set(tags.filter((tag): tag is EndorsementTag => allowed.has(tag))),
  ).slice(0, ENDORSEMENT_TAGS.length);
}

export function sanitizeShortText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function hasProfanity(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, " ");
  return bannedTerms.some((term) => normalized.includes(term));
}

export function parseLinkedInUrl(value: unknown) {
  const url = sanitizeShortText(value, 160);
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !["linkedin.com", "www.linkedin.com"].includes(parsed.hostname)
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function emptyEndorsementStats(): EndorsementStats {
  return {
    visitors: 0,
    engineers: 0,
    countries: 0,
  };
}
