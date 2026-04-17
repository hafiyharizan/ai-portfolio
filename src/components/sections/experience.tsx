"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeading label="Experience" title="Where I've worked" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-10">
            {EXPERIENCE.map((entry, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-10"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-accent bg-background" />

                {/* Card */}
                <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:bg-card-hover">
                  <h3 className="text-lg font-bold text-foreground">
                    {entry.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{entry.company}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {entry.period}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {entry.description.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-light" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
