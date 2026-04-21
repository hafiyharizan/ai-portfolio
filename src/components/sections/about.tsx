"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, Database, FolderGit2, GraduationCap } from "lucide-react";
import { EASE_OUT_QUART } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const stats = [
  {
    icon: Briefcase,
    value: "4+",
    label: "Years Experience",
  },
  {
    icon: Database,
    value: "3M+",
    label: "Records Processed",
  },
  {
    icon: FolderGit2,
    value: "5+",
    label: "Personal Projects",
  },
  {
    icon: GraduationCap,
    value: "Master's",
    label: "in Data Science",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: EASE_OUT_QUART,
    },
  }),
};

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading label="About" title="The person behind the code" />

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Left column - Avatar placeholder */}
          <motion.div
            className="flex items-start justify-center lg:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div
                className="rounded-2xl p-[2px]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                }}
              >
                <div className="relative h-72 w-60 overflow-hidden rounded-2xl sm:h-80 sm:w-68">
                  <Image
                    src="/avatar.png"
                    alt="Hafiy Harizan"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
              <div
                className="absolute -bottom-3 -right-3 h-6 w-6 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                }}
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Right column - Bio text */}
          <div className="space-y-5 lg:col-span-3">
            <motion.p
              className="text-base leading-relaxed text-muted sm:text-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
            >
              I am an engineer who lives at the intersection of software
              development and data engineering. I enjoy building things that
              work end to end -- from designing robust backend services and data
              pipelines to crafting clean, intuitive interfaces that put
              information where people need it.
            </motion.p>

            <motion.p
              className="text-base leading-relaxed text-muted sm:text-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={1}
            >
              At Telekom Malaysia, I spent over three years building
              production-grade data platforms that served analytics for more
              than three million customers. I designed automated ELT pipelines,
              built scalable APIs, and delivered dashboards that turned raw
              network data into decisions -- eliminating hours of manual work
              and helping teams move faster.
            </motion.p>

            <motion.p
              className="text-base leading-relaxed text-muted sm:text-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={2}
            >
              I recently relocated to Perth, Australia, with full work rights
              and a fresh perspective. While actively looking for my next role,
              I have been building personal projects -- a family tree app, a
              gamified chore tracker, an AI-powered job assistant -- to keep
              shipping code and exploring new ideas.
            </motion.p>

            <motion.p
              className="text-base leading-relaxed text-muted sm:text-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={3}
            >
              My Master&apos;s in Data Science gave me a strong analytical
              foundation, and my Bachelor&apos;s in Mechatronics Engineering
              taught me to think in systems -- hardware, software, and
              everything in between. That blend of disciplines means I approach
              problems with both rigour and creativity, whether I am optimising
              a query or designing a user flow.
            </motion.p>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:mt-20 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group rounded-xl border border-border bg-card p-6 text-center transition-colors duration-300 hover:border-accent-light/30 hover:bg-card-hover"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
            >
              <stat.icon
                className="mx-auto mb-3 h-5 w-5 text-accent-light transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
