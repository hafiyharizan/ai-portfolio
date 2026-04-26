"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Activity } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import {
  PERSONAL_PROJECTS,
  PROFESSIONAL_PROJECTS,
  SITE_CONFIG,
} from "@/lib/constants";
import { EASE_OUT_QUART } from "@/lib/motion";

// ── Mouse-tracking glow ───────────────────────────────────────────────────────

function trackMouse(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({
  children,
  live = false,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: EASE_OUT_QUART }}
      className="mb-6 flex items-center gap-3"
    >
      {live && (
        <span
          className="inline-block h-2 w-2 animate-pulse rounded-full"
          style={{ background: "var(--accent)" }}
        />
      )}
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
      <div
        className="h-px flex-1"
        style={{
          background: "var(--neutral-line-gradient)",
        }}
      />
    </motion.div>
  );
}

// ── Tag pill ──────────────────────────────────────────────────────────────────

function Tag({ children, mono = false }: { children: string; mono?: boolean }) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-[11px] text-muted-foreground ${mono ? "font-mono" : "font-medium"}`}
      style={{
        borderColor: "var(--subtle-border)",
        background: "var(--subtle-fill)",
      }}
    >
      {children}
    </span>
  );
}

// ── Personal project card ─────────────────────────────────────────────────────

type Personal = (typeof PERSONAL_PROJECTS)[number];

function PersonalCard({
  project,
  delay = 0,
}: {
  project: Personal;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: EASE_OUT_QUART }}
      onMouseMove={trackMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300"
      style={
        {
          borderColor: hovered
            ? `color-mix(in srgb, ${project.color} 32%, transparent)`
            : "var(--subtle-border)",
          background: "var(--card-surface-gradient)",
          backdropFilter: "blur(12px)",
          boxShadow: hovered
            ? `0 24px 64px -24px ${project.color}2e, inset 0 0 0 1px ${project.color}12`
            : "none",
        } as CSSProperties
      }
    >
      {/* Radial mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), ${project.color}0b, transparent 42%)`,
        }}
      />

      {/* Left accent bar */}
      <div
        className="pointer-events-none absolute inset-y-5 left-0 w-[3px] rounded-r-full transition-all duration-300"
        style={{
          background: `linear-gradient(to bottom, ${project.color}e0, ${project.color}1a)`,
          opacity: hovered ? 1 : 0.28,
          transform: hovered ? "scaleY(1)" : "scaleY(0.75)",
          transformOrigin: "top",
        }}
      />

      {/* Featured badge */}
      {project.featured && (
        <div
          className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full border px-2.5 py-[5px] text-[10px] font-semibold uppercase tracking-[0.15em]"
          style={{
            borderColor: `${project.color}38`,
            background: `${project.color}0e`,
            color: project.color,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: project.color }}
          />
          Featured
        </div>
      )}

      {/* Header: icon + name + tagline */}
      <div className="relative z-10 flex items-start gap-3 pr-28">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold transition-colors duration-300"
          style={{
            background: `${project.color}13`,
            color: project.color,
            border: `1px solid ${project.color}22`,
          }}
        >
          {project.name[0]}
        </div>
        <div>
          <h3 className="text-[15px] font-bold leading-tight text-foreground transition-colors duration-200 group-hover:text-accent-light">
            {project.name}
          </h3>
          <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
            {project.tagline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-5 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      {/* Tags */}
      <div className="relative z-10 mt-5 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 5).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        {project.tags.length > 5 && (
          <span className="px-1 py-0.5 text-[11px] text-muted-foreground">
            +{project.tags.length - 5}
          </span>
        )}
      </div>

      {/* CTAs */}
      <div className="relative z-10 mt-5 grid grid-cols-2 gap-2">
        <a
          href={SITE_CONFIG.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.name} source code`}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border text-[12px] font-semibold text-muted-foreground transition-all duration-200 hover:border-white/10 hover:text-foreground"
          style={{
            borderColor: "var(--subtle-border)",
            background: "var(--subtle-fill)",
          }}
        >
          <GitBranch className="h-3.5 w-3.5" strokeWidth={2} />
          Code
        </a>
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.name} live demo`}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl text-[12px] font-semibold text-white transition-all duration-200 hover:brightness-110 active:brightness-90"
          style={{
            background: `linear-gradient(135deg, ${project.color}cc, ${project.color}88)`,
            boxShadow: hovered ? `0 8px 28px -8px ${project.color}66` : "none",
            transition: "box-shadow 300ms, filter 200ms",
          }}
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Demo
        </a>
      </div>
    </motion.article>
  );
}

// ── Professional project card ─────────────────────────────────────────────────

type Professional = (typeof PROFESSIONAL_PROJECTS)[number];

function ProfessionalCard({
  project,
  index,
}: {
  project: Professional;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE_OUT_QUART }}
      onMouseMove={trackMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow] duration-300"
      style={{
        borderColor: hovered
          ? "var(--subtle-border-strong)"
          : "var(--subtle-border)",
        background: "var(--card-surface-gradient-alt)",
        boxShadow: hovered ? "var(--card-hover-shadow)" : "none",
      }}
    >
      {/* Neutral radial glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), var(--neutral-glow), transparent 42%)",
        }}
      />

      {/* Top accent gradient line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--accent-line), transparent)",
          opacity: hovered ? 1 : 0.45,
        }}
      />

      {/* Codename */}
      <div className="relative z-10">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground opacity-60">
          {project.name}
        </span>
        <h3 className="mt-1.5 text-sm font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-accent-light">
          {project.fullName}
        </h3>
      </div>

      {/* Impact metric badge */}
      <div
        className="relative z-10 mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5"
        style={{
          background: "var(--accent-soft)",
          border: "1px solid var(--accent-line)",
        }}
      >
        <Activity className="h-3 w-3 text-accent-light" strokeWidth={2.5} />
        <span className="text-[11px] font-bold text-accent-light">
          {project.impact}
        </span>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-4 flex-1 text-xs leading-relaxed text-muted">
        {project.description}
      </p>

      {/* Tags — monospace style */}
      <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map((t) => (
          <Tag key={t} mono>
            {t}
          </Tag>
        ))}
        {project.tags.length > 3 && (
          <span className="px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
            +{project.tags.length - 3}
          </span>
        )}
      </div>
    </motion.article>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Projects"
          title="Things I've built"
          subtitle="Data platforms powering millions of records. Consumer apps shipped and used."
        />

        {/* ── Personal Apps: Asymmetric Bento ──────────────────────── */}
        <div className="mt-4">
          <SectionLabel>Personal Apps</SectionLabel>

          {/*
            5-col bento grid (zigzag):
              Row 1 — Salasilah (3/5)  | ChoreQuest  (2/5)
              Row 2 — FridgeBoard(2/5) | FishScout   (3/5)
            Mobile: single column stack.
          */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <PersonalCard project={PERSONAL_PROJECTS[0]} delay={0} />
            </div>
            <div className="sm:col-span-2">
              <PersonalCard project={PERSONAL_PROJECTS[1]} delay={0.08} />
            </div>
            <div className="sm:col-span-2">
              <PersonalCard project={PERSONAL_PROJECTS[2]} delay={0.16} />
            </div>
            <div className="sm:col-span-3">
              <PersonalCard project={PERSONAL_PROJECTS[3]} delay={0.24} />
            </div>
          </div>
        </div>

        {/* ── Production Systems: Mission Control ──────────────────── */}
        <div className="mt-20">
          <SectionLabel live>Production Systems</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROFESSIONAL_PROJECTS.map((project, i) => (
              <ProfessionalCard key={project.name} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
