"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import { PERSONAL_PROJECTS, PROFESSIONAL_PROJECTS } from "@/lib/constants";

function picsumUrl(name: string) {
  return `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, "-")}/600/800`;
}

const RAIL_ITEMS: FocusRailItem[] = [
  ...PERSONAL_PROJECTS.map((p) => ({
    id: p.name,
    title: p.name,
    description: p.tagline,
    meta: "Personal • " + p.tags[0],
    imageSrc: picsumUrl(p.name),
    href: p.href,
  })),
  ...PROFESSIONAL_PROJECTS.map((p) => ({
    id: p.name,
    title: p.name,
    description: p.description,
    meta: "Professional • " + p.impact,
    imageSrc: picsumUrl(p.name),
  })),
];

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Projects"
          title="Things I've built"
          subtitle="From production data platforms to personal passion projects."
        />
      </div>
      <FocusRail items={RAIL_ITEMS} loop autoPlay={false} />
    </section>
  );
}
