"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const ROLE_META = [
  {
    idx: "01", year: "2024",
    metric: "3M+", metricSub: "customers served",
    highlight: true,
    tags: ["Python", "SQL", "Azure AI", "Docker", "CI/CD", "REST API"],
  },
  {
    idx: "02", year: "2022",
    metric: "80%", metricSub: "manual work removed",
    highlight: true,
    tags: ["PostgreSQL", "Power BI", "Tableau", "GeoServer", "Spatial SQL"],
  },
  {
    idx: "03", year: "2021",
    metric: "2021", metricSub: "where it began",
    highlight: false,
    tags: ["Python", "SQL", "Data Analytics"],
  },
] as const;

export function Experience() {

  return (
    <section id="experience" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Experience" title="Career trajectory" align="left" />

        <div className="relative">

          {/* Vertical line — draws top to bottom on scroll */}
          <motion.div
            className="absolute w-px"
            style={{
              left: 27,
              top: 34,
              background: "linear-gradient(to bottom, var(--accent) 0%, var(--accent-hot) 50%, var(--accent) 100%)",
              opacity: 0.4,
            }}
            initial={{ height: 0 }}
            whileInView={{ height: "calc(100% - 68px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          />

          <div className="space-y-3">
            {EXPERIENCE.map((entry, i) => {
              const meta = ROLE_META[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-[56px_1fr]"
                >

                  <div className="flex flex-col items-stretch">
                    <motion.span
                      className="pt-4 text-center"
                      style={{ fontFamily: "var(--font-jb-mono)", fontSize: 9, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 3 }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.15 }}
                    >
                      {meta.year}
                    </motion.span>

                    <div className="flex items-center">
                      <div className="flex-1" />

                      <div className="relative">
                        {i === 0 && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ background: "var(--accent)" }}
                            animate={{ scale: [1, 2.2, 2.2], opacity: [0.45, 0, 0] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
                          />
                        )}
                        <motion.div
                          className="relative z-[1] h-[18px] w-[18px] shrink-0 rounded-full border-2"
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 + 0.2 }}
                          style={{
                            borderColor: "var(--accent)",
                            background: i === 0 ? "var(--accent)" : "var(--background)",
                            boxShadow: i === 0
                              ? "0 0 0 2px var(--accent-soft), 0 0 12px var(--accent)"
                              : "0 0 5px var(--accent-soft)",
                          }}
                        />
                      </div>

                      <motion.div
                        className="flex-1"
                        style={{ height: 1, background: "var(--accent)", opacity: 0.5, transformOrigin: "left" }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 + 0.32, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: "var(--line-strong)", background: "var(--card)" }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--accent-line)";
                      el.style.boxShadow = "0 0 0 1px var(--accent-line), 0 12px 40px var(--accent-soft)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "var(--line-strong)";
                      el.style.boxShadow = "";
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">

                      <div
                        className="flex flex-row items-center justify-between gap-4 border-b p-5
                                   sm:flex-col sm:items-start sm:justify-between sm:border-b-0 sm:border-r sm:p-6"
                        style={{ borderColor: "var(--line-strong)", background: "var(--bg-soft)" }}
                      >
                        <div className="flex items-center gap-3 sm:w-full sm:flex-col sm:items-start sm:gap-0">
                          <span style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                            {meta.idx}
                          </span>
                          {i === 0 && (
                            <span
                              className="mt-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 sm:mt-2"
                              style={{
                                fontFamily: "var(--font-jb-mono)", fontSize: 9,
                                color: "var(--accent)", background: "var(--accent-soft)",
                                borderColor: "var(--accent-line)", letterSpacing: "0.08em", textTransform: "uppercase",
                              }}
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)", animation: "pulse-ok 2s ease-in-out infinite" }} />
                              Latest
                            </span>
                          )}
                        </div>

                        <div>
                          <div
                            style={{
                              fontFamily: "var(--font-geist-sans)",
                              fontSize: "clamp(30px, 3.5vw, 46px)",
                              fontWeight: 700, lineHeight: 1, letterSpacing: "-0.03em",
                              ...(meta.highlight
                                ? {
                                    background: "linear-gradient(110deg, var(--accent) 20%, var(--accent-hot) 80%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                  }
                                : { color: "var(--muted-foreground)" }),
                            }}
                          >
                            {meta.metric}
                          </div>
                          <div style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10, color: "var(--muted-foreground)", marginTop: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            {meta.metricSub}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-5 sm:p-7">
                        <div>
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 style={{ fontSize: "clamp(15px, 1.8vw, 19px)", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
                                {entry.title}
                              </h3>
                              <p style={{ fontFamily: "var(--font-jb-mono)", fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                                {entry.company}
                              </p>
                            </div>
                            <span
                              className="shrink-0 rounded-lg border px-3 py-1"
                              style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted-foreground)", borderColor: "var(--line-strong)", background: "var(--background)", whiteSpace: "nowrap" }}
                            >
                              {entry.period}
                            </span>
                          </div>

                          <ul className="mt-4 space-y-2">
                            {entry.description.map((item, j) => (
                              <li key={j} className="flex items-start gap-2.5" style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.55 }}>
                                <span style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10, color: "var(--accent)", marginTop: 3, flexShrink: 0 }}>▸</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {meta.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border px-2.5 py-1"
                              style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted)", borderColor: "var(--line-strong)", background: "var(--bg-soft)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
