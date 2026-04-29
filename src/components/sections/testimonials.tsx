"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EndorsementCard } from "@/components/ui/endorsement-card";
import { EndorseForm } from "@/components/ui/endorse-form";
import { TESTIMONIALS } from "@/lib/constants";
import type { EndorsementsResponse, PublicEndorsement } from "@/lib/endorsements";

function PlaceholderCard({ t, i }: { t: (typeof TESTIMONIALS)[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 rounded-2xl border p-5"
      style={{
        borderColor: "var(--line-strong)",
        borderStyle: "dashed",
        background: "var(--card)",
      }}
    >
      {/* Sample badge */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="rounded-full border px-2 py-0.5"
          style={{
            fontFamily: "var(--font-jb-mono)",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            borderColor: "var(--line-strong)",
          }}
        >
          sample
        </span>
      </div>

      <p
        className="flex-1 leading-relaxed"
        style={{ fontSize: 14, color: "var(--muted)", fontStyle: "italic" }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="border-t pt-4" style={{ borderColor: "var(--line)" }}>
        <p className="font-semibold" style={{ fontSize: 13, color: "var(--muted)" }}>
          {t.name}
        </p>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-jb-mono)" }}>
          {t.title}
        </p>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const [data, setData]         = useState<EndorsementsResponse | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/endorsements")
      .then((r) => r.json())
      .then((d: EndorsementsResponse) => setData(d))
      .catch(() => {});
  }, []);

  const liveEntries: PublicEndorsement[] = data?.entries ?? [];
  const hasLive = (data?.configured ?? false) && liveEntries.length > 0;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32" aria-label="Testimonials">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mb-12 flex flex-wrap items-start justify-between gap-6">
          {/* Left: label + title */}
          <div>
            <span
              className="gradient-text mb-3 block text-sm font-semibold uppercase tracking-widest"
            >
              Testimonials
            </span>
            <h2
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              What people say
            </h2>
            <p
              className="mt-3 max-w-md text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {hasLive
                ? `${liveEntries.length} verified endorsement${liveEntries.length !== 1 ? "s" : ""} — reviewed by Hafiy.`
                : "Worked with me? Your endorsement helps recruiters see the real picture."}
            </p>
          </div>

          {/* Right: CTA */}
          <button
            onClick={() => setShowForm((p) => !p)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{
              fontFamily: "var(--font-jb-mono)",
              fontSize: 12,
              whiteSpace: "nowrap",
              ...(showForm
                ? {
                    color: "var(--muted)",
                    border: "1px solid var(--line-strong)",
                    background: "var(--bg-soft)",
                  }
                : {
                    color: "var(--accent-ink)",
                    border: "1px solid transparent",
                    background: "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                    boxShadow: "0 0 20px var(--accent-soft), 0 2px 8px var(--accent-soft)",
                  }),
            }}
          >
            {showForm ? "✕ Close" : "+ Endorse Hafiy"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <EndorseForm onClose={() => setShowForm(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasLive
            ? liveEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EndorsementCard entry={entry} />
                </motion.div>
              ))
            : TESTIMONIALS.map((t, i) => (
                <PlaceholderCard key={i} t={t} i={i} />
              ))}
        </div>

        {!hasLive && (
          <motion.p
            className="mt-8 text-center"
            style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted-foreground)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Samples shown — be the first to leave a real endorsement.
          </motion.p>
        )}

      </div>
      <div className="section-divider mx-auto mt-24 max-w-4xl" />
    </section>
  );
}
