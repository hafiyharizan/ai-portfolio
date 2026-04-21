"use client";

import { motion } from "framer-motion";
import { Mail, Globe, ExternalLink, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { EASE_OUT_QUART } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    external: false,
  },
  {
    icon: Globe,
    label: "LinkedIn",
    value: "linkedin.com/in/hafiyharizan",
    href: SITE_CONFIG.linkedin,
    external: true,
  },
  {
    icon: ExternalLink,
    label: "GitHub",
    value: "github.com/hafiyharizan",
    href: SITE_CONFIG.github,
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: SITE_CONFIG.location,
    href: null,
    external: false,
  },
] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: EASE_OUT_QUART },
  }),
};

const viewport = { once: true, margin: "-60px" } as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          label="Contact"
          title="Let's connect"
          subtitle="Whether you're a recruiter, a fellow engineer, or someone with an interesting project — I'd love to hear from you."
        />

        <div className="mx-auto max-w-lg space-y-4">
          {CONTACT_INFO.map((item, i) => {
            const Icon = item.icon;
            const card = (
              <motion.div
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-300 hover:bg-card-hover"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                custom={i}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-5 w-5 text-accent-light" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="truncate font-medium text-foreground transition-colors duration-200 group-hover:text-accent-light">
                    {item.value}
                  </p>
                </div>
              </motion.div>
            );

            if (item.href) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {card}
                </a>
              );
            }
            return <div key={item.label}>{card}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
