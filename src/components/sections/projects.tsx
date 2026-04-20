"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  TreePine,
  Sparkles,
  LayoutDashboard,
  Fish,
  Database,
  Server,
  Map,
  ShieldCheck,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { PERSONAL_PROJECTS, PROFESSIONAL_PROJECTS } from "@/lib/constants";
import { EASE_OUT_QUART } from "@/lib/motion";

// ---------------------------------------------------------------------------
// Icon mapping
// ---------------------------------------------------------------------------
const ICON_MAP: Record<string, LucideIcon> = {
  tree: TreePine,
  sparkles: Sparkles,
  "layout-dashboard": LayoutDashboard,
  fish: Fish,
  database: Database,
  server: Server,
  map: Map,
  "shield-check": ShieldCheck,
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_QUART },
  },
};

// ---------------------------------------------------------------------------
// Mouse-tracking glow helper
// ---------------------------------------------------------------------------
function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty(
    "--mouse-x",
    `${e.clientX - rect.left}px`,
  );
  e.currentTarget.style.setProperty(
    "--mouse-y",
    `${e.clientY - rect.top}px`,
  );
}

// ---------------------------------------------------------------------------
// Personal Project Card
// ---------------------------------------------------------------------------
function PersonalProjectCard({
  project,
}: {
  project: (typeof PERSONAL_PROJECTS)[number];
}) {
  const Icon = ICON_MAP[project.icon] ?? Sparkles;

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className="glow-card group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
      style={
        {
          "--hover-border": project.color,
        } as React.CSSProperties
      }
      whileHover={{
        borderColor: project.color,
      }}
    >
      {/* Top row: icon + external link */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${project.color}18` }}
        >
          <Icon
            className="h-5 w-5"
            style={{ color: project.color }}
            strokeWidth={1.8}
          />
        </div>

        <ArrowUpRight
          className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          style={{ color: project.color }}
          strokeWidth={2}
        />
      </div>

      {/* Name + tagline */}
      <div className="relative z-10 mt-5">
        <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-white">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
      </div>

      {/* Description */}
      <p className="relative z-10 mt-3 flex-1 text-sm leading-relaxed text-muted">
        {project.description}
      </p>

      {/* Tags */}
      <div className="relative z-10 mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Professional Project Card
// ---------------------------------------------------------------------------
function ProfessionalProjectCard({
  project,
}: {
  project: (typeof PROFESSIONAL_PROJECTS)[number];
}) {
  const Icon = ICON_MAP[project.icon] ?? Database;

  return (
    <motion.div
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className="glow-card group relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 md:flex-row md:items-start md:gap-6"
    >
      {/* Left column: icon + acronym */}
      <div className="relative z-10 flex shrink-0 items-center gap-4 md:flex-col md:items-center md:gap-3 md:pt-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-5 w-5 text-accent-light" strokeWidth={1.8} />
        </div>
        <span className="gradient-text text-2xl font-bold tracking-tight md:text-xl">
          {project.name}
        </span>
      </div>

      {/* Right column: content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <p className="text-sm font-medium text-muted-foreground">
          {project.fullName}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        {/* Impact */}
        <p className="mt-3 text-sm">
          <span className="font-semibold text-accent-light">Impact: </span>
          <span className="font-medium text-foreground">{project.impact}</span>
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Subsection title
// ---------------------------------------------------------------------------
function SubsectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h3
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="mb-8 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
    >
      {children}
    </motion.h3>
  );
}

// ---------------------------------------------------------------------------
// Projects Section
// ---------------------------------------------------------------------------
export function Projects() {
  const personalRef = useRef<HTMLDivElement>(null);
  const professionalRef = useRef<HTMLDivElement>(null);

  const personalInView = useInView(personalRef, {
    once: true,
    margin: "-80px",
  });
  const professionalInView = useInView(professionalRef, {
    once: true,
    margin: "-80px",
  });

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Projects"
          title="Things I've built"
          subtitle="From production data platforms to personal passion projects."
        />

        {/* ---------------------------------------------------------------- */}
        {/* Personal Projects                                                */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-4">
          <SubsectionTitle>Personal Projects</SubsectionTitle>

          <motion.div
            ref={personalRef}
            variants={containerVariants}
            initial="hidden"
            animate={personalInView ? "visible" : "hidden"}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PERSONAL_PROJECTS.map((project) => (
              <PersonalProjectCard key={project.name} project={project} />
            ))}
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Production Projects                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-24">
          <SubsectionTitle>Production Projects</SubsectionTitle>

          <motion.div
            ref={professionalRef}
            variants={containerVariants}
            initial="hidden"
            animate={professionalInView ? "visible" : "hidden"}
            className="grid gap-6 md:grid-cols-2"
          >
            {PROFESSIONAL_PROJECTS.map((project) => (
              <ProfessionalProjectCard key={project.name} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
