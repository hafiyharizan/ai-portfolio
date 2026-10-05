"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, FileText, Mail } from "lucide-react";
import { EXPERIENCE, SITE_CONFIG } from "@/lib/constants";
import { EASE_OUT_QUART } from "@/lib/motion";

const viewport = { once: true, margin: "-60px" } as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.55, delay, ease: EASE_OUT_QUART },
});

function perthNow() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-AU", {
    timeZone: "Australia/Perth",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const hour = Number(
    now.toLocaleString("en-AU", { timeZone: "Australia/Perth", hour: "numeric", hour12: false })
  );
  return { time, working: hour >= 8 && hour < 18 };
}

function usePerthTime() {
  const [state, setState] = useState<{ time: string; working: boolean } | null>(null);
  useEffect(() => {
    const tick = () => setState(perthNow());
    const timeout = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(id);
    };
  }, []);
  return state;
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
    </svg>
  );
}

const SECONDARY_LINKS = [
  { label: "Resume", sub: "PDF", href: SITE_CONFIG.resumeUrl, Icon: FileText },
  { label: "LinkedIn", sub: "in/hafiyharizan", href: SITE_CONFIG.linkedin, Icon: LinkedInMark },
  { label: "GitHub", sub: "hafiyharizan", href: SITE_CONFIG.github, Icon: GitHubMark },
] as const;

export function Contact() {
  const perth = usePerthTime();
  const [copied, setCopied] = useState(false);
  const current = EXPERIENCE[0];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  };

  const statusRows: { k: string; v: string; accent?: boolean }[] = [
    { k: "role", v: "Software Engineer · data platforms" },
    { k: "now", v: `${current.company}` },
    { k: "seeking", v: "Mid–senior SWE roles, data platform teams", accent: true },
    { k: "stack", v: "Python · SQL · Oracle · PostgreSQL · Power BI · Docker" },
    { k: "based", v: "Perth, WA · AWST (UTC+8)" },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32" aria-label="Contact">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-[28px] border"
          style={{ borderColor: "var(--line-strong)", background: "var(--card-surface-gradient)" }}
        >
          {/* Accent hairline along the top edge */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            aria-hidden="true"
            style={{ background: "linear-gradient(90deg, transparent, var(--accent), var(--accent-hot), transparent)" }}
          />
          {/* Glow + fine grid */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(600px circle at 0% 0%, var(--accent-soft), transparent 60%), radial-gradient(500px circle at 100% 100%, var(--accent-soft), transparent 65%)",
              opacity: 0.7,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(var(--subtle-border) 1px, transparent 1px), linear-gradient(90deg, var(--subtle-border) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 70% 80% at 30% 40%, #000 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 30% 40%, #000 20%, transparent 75%)",
            }}
          />

          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:p-14">
            {/* ── Left: pitch + email ───────────────────────────────── */}
            <div className="flex min-w-0 flex-col">
              <motion.p
                {...fadeUp(0.05)}
                className="flex items-center gap-2.5"
                style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}
              >
                <span className="h-px w-6" style={{ background: "var(--accent)" }} />
                Contact
              </motion.p>

              <motion.h2
                {...fadeUp(0.1)}
                className="mt-5 font-bold"
                style={{ fontSize: "clamp(34px, 4.4vw, 58px)", lineHeight: 1.04, letterSpacing: "-0.035em", color: "var(--foreground)" }}
              >
                Got a data platform to build?{" "}
                <span
                  style={{
                    background: "linear-gradient(110deg, var(--accent) 10%, var(--accent-hot) 90%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Let&apos;s talk.
                </span>
              </motion.h2>

              <motion.p
                {...fadeUp(0.15)}
                className="mt-5 max-w-[46ch] leading-relaxed"
                style={{ fontSize: 16, color: "var(--muted)" }}
              >
                I&apos;m looking for mid to senior software engineering roles on data
                platform teams in Perth. Email is the best way to reach me.
              </motion.p>

              {/* Email block */}
              <motion.div
                {...fadeUp(0.2)}
                className="mt-9 rounded-2xl border p-4 sm:p-5"
                style={{ borderColor: "var(--accent-line)", background: "var(--glass-bg)", backdropFilter: "blur(8px)" }}
              >
                <p style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                  Email
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="mt-1.5 block break-all font-semibold transition-colors duration-200"
                  style={{ fontSize: "clamp(19px, 2.6vw, 30px)", letterSpacing: "-0.02em", color: "var(--foreground)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}
                >
                  {SITE_CONFIG.email}
                </a>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="group inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-transform duration-200 hover:-translate-y-px"
                    style={{
                      color: "var(--accent-ink)",
                      background: "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                      boxShadow: "0 8px 24px -10px var(--accent)",
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Send an email
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors duration-200"
                    style={{
                      borderColor: copied ? "var(--accent-line)" : "var(--line-strong)",
                      background: "var(--bg-soft)",
                      color: copied ? "var(--accent)" : "var(--foreground)",
                    }}
                    aria-live="polite"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy address"}
                  </button>
                </div>
              </motion.div>

              {/* Secondary links */}
              <motion.div {...fadeUp(0.25)} className="mt-4 grid grid-cols-3 gap-2.5">
                {SECONDARY_LINKS.map(({ label, sub, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-col gap-3 rounded-xl border p-3.5 transition-all duration-200 hover:-translate-y-0.5 sm:p-4"
                    style={{ borderColor: "var(--line-strong)", background: "var(--bg-soft)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-line)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--line-strong)")}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="h-[18px] w-[18px] text-foreground" />
                      <ArrowUpRight
                        className="h-3.5 w-3.5 opacity-40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        style={{ color: "var(--accent)" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{label}</p>
                      <p className="truncate" style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10.5, color: "var(--muted-foreground)" }}>
                        {sub}
                      </p>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>

            {/* ── Right: status card ─────────────────────────────────── */}
            <motion.div {...fadeUp(0.2)} className="flex min-w-0 flex-col">
              <div
                className="flex flex-1 flex-col overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--line-strong)", background: "var(--module-bg)", boxShadow: "var(--module-shadow)" }}
              >
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--line)" }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-strong)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-strong)" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--line-strong)" }} />
                  <span className="ml-2 truncate" style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted-foreground)" }}>
                    hafiy@perth: ~/status
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6" style={{ fontFamily: "var(--font-jb-mono)", fontSize: 12.5 }}>
                  <p style={{ color: "var(--muted-foreground)" }}>
                    <span style={{ color: "var(--accent)" }}>$</span> cat status.yml
                  </p>

                  <dl className="mt-4 space-y-3">
                    {statusRows.map(({ k, v, accent }) => (
                      <div key={k} className="grid grid-cols-[72px_1fr] gap-3">
                        <dt style={{ color: "var(--muted-foreground)" }}>{k}:</dt>
                        <dd className="min-w-0" style={{ color: accent ? "var(--accent)" : "var(--foreground)", lineHeight: 1.5 }}>
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-5" style={{ color: "var(--muted-foreground)" }}>
                    <span style={{ color: "var(--accent)" }}>$</span>{" "}
                    <span
                      className="inline-block h-[1.1em] w-[0.55em] align-[-0.2em]"
                      style={{ background: "var(--accent)", animation: "blink 1s steps(2) infinite" }}
                      aria-hidden="true"
                    />
                  </p>

                  {/* Live Perth time */}
                  <div className="mt-auto pt-8">
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--line)", background: "var(--subtle-fill)" }}>
                      <div className="flex items-center justify-between gap-3">
                        <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>
                          Local time in Perth
                        </span>
                        {perth && (
                          <span className="inline-flex items-center gap-1.5" style={{ fontSize: 10.5, color: perth.working ? "var(--ok)" : "var(--muted-foreground)" }}>
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                background: perth.working ? "var(--ok)" : "var(--muted-foreground)",
                                boxShadow: perth.working ? "0 0 8px var(--ok)" : "none",
                              }}
                            />
                            {perth.working ? "business hours" : "after hours"}
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-1.5 font-semibold tabular-nums"
                        style={{ fontFamily: "var(--font-geist-sans)", fontSize: 32, letterSpacing: "-0.03em", color: "var(--foreground)" }}
                        suppressHydrationWarning
                      >
                        {perth?.time ?? "--:--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
