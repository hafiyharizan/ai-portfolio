"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EDUCATION } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Education() {
  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading label="Education" title="Academic background" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {EDUCATION.map((entry, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <GraduationCap className="h-5 w-5 text-accent-light" />
              </div>

              <h3 className="text-lg font-bold text-foreground">
                {entry.degree}
              </h3>
              <p className="mt-1 text-sm text-muted">{entry.school}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entry.period}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
