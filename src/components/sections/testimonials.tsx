"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32"
      aria-label="Testimonials"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading label="Testimonials" title="What people say" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={i}
              className="group rounded-xl border border-border bg-card p-6 transition-colors duration-300 hover:bg-card-hover"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
            >
              <Quote
                className="mb-4 h-6 w-6 text-accent-light opacity-50"
                aria-hidden="true"
              />
              <p className="mb-6 italic leading-relaxed text-muted">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mt-10 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Testimonials are placeholders — real endorsements coming soon.
        </motion.p>
      </div>

      <div className="section-divider mx-auto mt-24 max-w-4xl" />
    </section>
  );
}
