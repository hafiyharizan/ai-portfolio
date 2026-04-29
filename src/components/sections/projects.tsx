"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import { PERSONAL_PROJECTS, PROFESSIONAL_PROJECTS } from "@/lib/constants";

const HIDDEN_PROJECTS = ["FishScout", "NDM"];

const LOCAL_IMAGES: Record<string, string> = {
  "ChoreQuest":    "/projects/chorequest.png",
  "FridgeBoard":   "/projects/fridgeboard.png",
  "Salasilah":     "/projects/salasilah.png",
  "ApplySmart AI": "/projects/applysmartai.png",
  "DREAM":         "/projects/dream.png",
  "FIVE":          "/projects/five.jpg",
  "MSQoS":         "/projects/msqos.jpg",
};

function imgSrc(name: string) {
  return LOCAL_IMAGES[name] ?? `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, "-")}/600/800`;
}

const RAIL_ITEMS: FocusRailItem[] = [
  ...PERSONAL_PROJECTS.filter((p) => !HIDDEN_PROJECTS.includes(p.name)).map((p) => ({
    id: p.name,
    title: p.name,
    description: p.tagline,
    meta: "Personal • " + p.tags[0],
    imageSrc: imgSrc(p.name),
    href: p.href,
    tags: p.tags,
  })),
  ...PROFESSIONAL_PROJECTS.filter((p) => !HIDDEN_PROJECTS.includes(p.name)).map((p) => ({
    id: p.name,
    title: p.name,
    description: p.description,
    meta: "Professional • " + p.impact,
    imageSrc: imgSrc(p.name),
    tags: p.tags,
  })),
];

type GridItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  type: "Personal" | "Professional";
  href?: string;
  imageSrc: string;
};

const GRID_ITEMS: GridItem[] = [
  ...PERSONAL_PROJECTS.filter((p) => !HIDDEN_PROJECTS.includes(p.name)).map((p) => ({
    id: p.name,
    title: p.name,
    subtitle: p.tagline,
    description: p.description,
    tags: p.tags,
    type: "Personal" as const,
    href: p.href,
    imageSrc: imgSrc(p.name),
  })),
  ...PROFESSIONAL_PROJECTS.filter((p) => !HIDDEN_PROJECTS.includes(p.name)).map((p) => ({
    id: p.name,
    title: p.name,
    subtitle: p.fullName,
    description: p.description,
    tags: p.tags,
    type: "Professional" as const,
    imageSrc: imgSrc(p.name),
  })),
];

function ProjectCard({ item }: { item: GridItem }) {
  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl border transition-[border-color,box-shadow] duration-200"
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
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.imageSrc}
          alt={item.title}
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.includes("picsum")) {
              img.src = `https://picsum.photos/seed/${item.id.toLowerCase().replace(/\s+/g, "-")}/600/800`;
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              fontFamily: "var(--font-jb-mono)",
              background: item.type === "Personal" ? "var(--accent-soft)" : "oklch(0.5 0.14 265 / 0.15)",
              color: item.type === "Personal" ? "var(--accent)" : "oklch(0.75 0.12 265)",
            }}
          >
            {item.type}
          </span>
          <span
            style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10, color: "var(--muted-foreground)" }}
          >
            {item.tags[0]}
          </span>
        </div>

        <h3
          className="font-semibold leading-snug"
          style={{ fontSize: 15, color: "var(--foreground)", letterSpacing: "-0.01em" }}
        >
          {item.title}
        </h3>

        <p
          className="line-clamp-2 flex-1 text-sm leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontSize: 13 }}
        >
          {item.subtitle}
        </p>

        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border px-1.5 py-0.5"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 10,
                color: "var(--muted)",
                borderColor: "var(--line-strong)",
                background: "var(--bg-soft)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {item.href && (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium transition-colors duration-150"
            style={{ color: "var(--accent)", fontFamily: "var(--font-jb-mono)" }}
          >
            View project
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export function Projects() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-start justify-between gap-4">
          <SectionHeading
            label="Projects"
            title="Featured Projects"
            subtitle="From production data platforms to personal passion projects."
            align="left"
          />

          {/* View toggle */}
          <button
            onClick={() => setShowAll((p) => !p)}
            className="mt-1 flex shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
            style={{
              fontFamily: "var(--font-jb-mono)",
              fontSize: 12,
              whiteSpace: "nowrap",
              ...(showAll
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
            {showAll ? (
              <><SlidersHorizontal className="h-3.5 w-3.5" /> Carousel</>
            ) : (
              <><LayoutGrid className="h-3.5 w-3.5" /> View all</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showAll ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-7xl px-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {GRID_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard item={item} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FocusRail items={RAIL_ITEMS} loop autoPlay={false} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
