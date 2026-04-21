"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Frontend: { bg: "bg-blue-500/10", text: "text-blue-400" },
  Backend: { bg: "bg-accent/10", text: "text-accent-light" },
  Databases: { bg: "bg-amber-500/10", text: "text-amber-400" },
  "AI & Cloud": { bg: "bg-accent/10", text: "text-accent-light" },
  "Data & Viz": { bg: "bg-rose-500/10", text: "text-rose-400" },
  "DevOps & Tools": { bg: "bg-cyan-500/10", text: "text-cyan-400" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function Skills() {
  const categories = Object.entries(SKILLS) as [string, readonly string[]][];

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Skills" title="My toolkit" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
        >
          {categories.map(([category, skills]) => {
            const colors = CATEGORY_COLORS[category] ?? {
              bg: "bg-gray-500/10",
              text: "text-gray-400",
            };

            return (
              <motion.div
                key={category}
                variants={cardVariants}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card-hover"
              >
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                  {category}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-sm ${colors.bg} ${colors.text}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
