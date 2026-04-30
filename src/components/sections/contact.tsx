"use client";

import { motion } from "framer-motion";
import { Mail, Globe, ExternalLink, MapPin, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { EASE_OUT_QUART } from "@/lib/motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_QUART },
  },
};

const viewport = { once: true, margin: "-60px" } as const;

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32" aria-label="Contact">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, var(--accent-soft), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
        >
          <span className="gradient-text text-sm font-semibold uppercase tracking-widest">
            Contact
          </span>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Let's build something great.
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-lg"
            style={{ color: "var(--muted-foreground)" }}
          >
            Available for roles in Perth and remote. Whether it&apos;s a new
            opportunity, a collaboration, or just a chat — I&apos;d love to hear from
            you.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-3 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Email — primary full-width */}
          <motion.a
            href={`mailto:${SITE_CONFIG.email}`}
            className="group col-span-full flex items-center gap-5 rounded-2xl p-5 transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{
              background:
                "linear-gradient(135deg, oklch(from var(--accent) l c h / 0.12) 0%, transparent 60%)",
              border: "1px solid var(--accent-line)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 28px var(--accent-soft), 0 4px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hot))",
              }}
            >
              <Mail className="h-5 w-5" style={{ color: "var(--accent-ink)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Primary contact
              </p>
              <p
                className="truncate font-semibold"
                style={{ fontSize: 16, color: "var(--foreground)" }}
              >
                {SITE_CONFIG.email}
              </p>
            </div>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 opacity-30 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{ color: "var(--accent)" }}
            />
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={SITE_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl p-5 transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--line-strong)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--accent-line)";
              el.style.boxShadow = "0 0 20px var(--accent-soft)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--line-strong)";
              el.style.boxShadow = "";
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--line-strong)",
              }}
            >
              <Globe className="h-4 w-4" style={{ color: "var(--accent)" }} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                LinkedIn
              </p>
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                linkedin.com/in/hafiyharizan
              </p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
              style={{ color: "var(--accent)" }}
            />
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl p-5 transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            style={{
              background: "var(--card)",
              border: "1px solid var(--line-strong)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--accent-line)";
              el.style.boxShadow = "0 0 20px var(--accent-soft)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--line-strong)";
              el.style.boxShadow = "";
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "var(--bg-soft)",
                border: "1px solid var(--line-strong)",
              }}
            >
              <ExternalLink
                className="h-4 w-4"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                GitHub
              </p>
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                github.com/hafiyharizan
              </p>
            </div>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-60"
              style={{ color: "var(--accent)" }}
            />
          </motion.a>

          {/* Location + open-to-work */}
          <motion.div
            className="col-span-full flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5"
            variants={itemVariants}
            style={{
              background: "var(--bg-soft)",
              border: "1px solid var(--line)",
            }}
          >
            <MapPin
              className="h-4 w-4 shrink-0"
              style={{ color: "var(--muted-foreground)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 12,
                color: "var(--muted-foreground)",
              }}
            >
              Based in {SITE_CONFIG.location}
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--ok)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 12,
                color: "var(--ok)",
              }}
            >
              open to work
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
