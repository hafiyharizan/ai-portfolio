"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EndorsementCard } from "@/components/ui/endorsement-card";
import { EndorseForm } from "@/components/ui/endorse-form";
import type { EndorsementsResponse, PublicEndorsement } from "@/lib/endorsements";

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

  // No approved endorsements yet: show a slim invite instead of sample quotes.
  if (!hasLive) {
    return (
      <section id="testimonials" className="relative py-16" aria-label="Endorsements">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Worked with Hafiy? An endorsement helps hiring teams see the real picture.
            </p>
            <button
              onClick={() => setShowForm((p) => !p)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2 transition-colors"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 12,
                color: "var(--muted)",
                borderColor: "var(--line-strong)",
                background: "var(--bg-soft)",
              }}
            >
              {showForm ? "✕ Close" : "+ Leave an endorsement"}
            </button>
          </div>
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="mt-6"
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
        </div>
      </section>
    );
  }

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
              {`${liveEntries.length} verified endorsement${liveEntries.length !== 1 ? "s" : ""} — reviewed by Hafiy.`}
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
          {liveEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <EndorsementCard entry={entry} />
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
