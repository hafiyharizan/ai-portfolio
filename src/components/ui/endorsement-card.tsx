"use client";

import type { PublicEndorsement } from "@/lib/endorsements";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const providerLabel: Record<string, string> = {
  google: "Google",
  github: "GitHub",
  linkedin: "LinkedIn",
};

export function EndorsementCard({ entry }: { entry: PublicEndorsement }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border p-5 transition-[border-color,box-shadow] duration-200"
      style={{ borderColor: "var(--line-strong)", background: "var(--card)" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--accent-line)";
        el.style.boxShadow = "0 0 0 1px var(--accent-line), 0 8px 24px var(--accent-soft)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--line-strong)";
        el.style.boxShadow = "";
      }}
    >
      {/* Quote */}
      <p
        className="flex-1 leading-relaxed"
        style={{ fontSize: 14, color: "var(--muted-foreground)", fontStyle: "italic" }}
      >
        &ldquo;{entry.message}&rdquo;
      </p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 10,
                color: "var(--accent)",
                background: "var(--accent-soft)",
                border: "1px solid var(--accent-line)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--line)" }}>
        {entry.avatar_url ? (
          <img
            src={entry.avatar_url}
            alt={entry.name}
            className="h-9 w-9 rounded-full object-cover"
            style={{ border: "1px solid var(--line-strong)" }}
          />
        ) : (
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            {entry.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="truncate font-semibold"
              style={{ fontSize: 13, color: "var(--foreground)" }}
            >
              {entry.name}
            </span>
            {entry.linkedin_url && (
              <a
                href={entry.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 opacity-50 transition-opacity hover:opacity-100"
                style={{ color: "#0A66C2" }}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
          </div>
          <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
            {entry.role && (
              <>
                <span className="truncate" style={{ fontFamily: "var(--font-jb-mono)" }}>{entry.role}</span>
                <span>·</span>
              </>
            )}
            <span>{timeAgo(entry.created_at)}</span>
            {entry.country && <span>· {entry.country}</span>}
            {providerLabel[entry.provider] && (
              <>
                <span>·</span>
                <span>via {providerLabel[entry.provider]}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
