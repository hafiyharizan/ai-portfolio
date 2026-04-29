"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Loader2, Star, Trash2, X } from "lucide-react";

type AdminEndorsement = {
  id: string;
  name: string;
  provider: string;
  message: string;
  role: string | null;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function EndorsementsAdmin() {
  const [entries, setEntries] = useState<AdminEndorsement[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingAction, startTransition] = useTransition();

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/endorsements", {
        cache: "no-store",
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Could not load moderation queue.");
        setEntries([]);
        return;
      }
      setEntries(payload.endorsements ?? []);
    } catch {
      setError("Could not load moderation queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function moderate(id: string, action: "approve" | "reject" | "feature" | "unfeature" | "delete") {
    startTransition(async () => {
      const response =
        action === "delete"
          ? await fetch(`/api/admin/endorsements?id=${id}`, { method: "DELETE" })
          : await fetch("/api/admin/endorsements", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, action }),
            });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload.error ?? "Could not update endorsement.");
        return;
      }

      await refresh();
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Endorsement moderation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Approve, reject, feature, or remove visitor endorsements.
        </p>
      </div>

      {error ? (
        <div
          className="mb-6 rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--danger-border)",
            background: "var(--danger-bg)",
            color: "var(--danger-text)",
          }}
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border"
              style={{
                borderColor: "var(--line)",
                background: "var(--card-surface-gradient)",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border p-5"
              style={{
                borderColor: "var(--line)",
                background: "var(--card-surface-gradient)",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{entry.name}</p>
                    <span className="rounded-full border px-2 py-1 text-[11px] text-muted-foreground" style={{ borderColor: "var(--line-strong)" }}>
                      {entry.provider}
                    </span>
                    <span className="rounded-full border px-2 py-1 text-[11px]" style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent-light)" }}>
                      {entry.status}
                    </span>
                    {entry.featured ? (
                      <span className="rounded-full border px-2 py-1 text-[11px]" style={{ borderColor: "var(--accent-line)", color: "var(--accent-light)" }}>
                        featured
                      </span>
                    ) : null}
                  </div>
                  {entry.role ? (
                    <p className="mt-1 text-sm text-muted-foreground">{entry.role}</p>
                  ) : null}
                  <p className="mt-3 text-sm leading-relaxed text-muted">{entry.message}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.tags?.map((tag) => (
                      <span key={tag} className="rounded-full border px-2.5 py-1 text-[11px] text-muted-foreground" style={{ borderColor: "var(--line-strong)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Submitted {formatDate(entry.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:w-[320px] lg:justify-end">
                  <button
                    type="button"
                    onClick={() => moderate(entry.id, "approve")}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium"
                    style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)", color: "var(--accent-light)" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate(entry.id, entry.featured ? "unfeature" : "feature")}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-foreground"
                    style={{ borderColor: "var(--line-strong)", background: "var(--subtle-fill)" }}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {entry.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate(entry.id, "reject")}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium text-muted"
                    style={{ borderColor: "var(--line-strong)", background: "var(--subtle-fill)" }}
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => moderate(entry.id, "delete")}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium"
                    style={{ borderColor: "var(--danger-border)", background: "var(--danger-bg)", color: "var(--danger-text)" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!entries.length ? (
            <div
              className="rounded-2xl border px-5 py-10 text-center text-sm text-muted-foreground"
              style={{ borderColor: "var(--line)", background: "var(--subtle-fill)" }}
            >
              No endorsements in the moderation queue yet.
            </div>
          ) : null}
        </div>
      )}

      {pendingAction ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating moderation queue...
        </div>
      ) : null}
    </div>
  );
}
