"use client";

import { motion } from "framer-motion";
import { Mail, Globe, ExternalLink, MapPin, SendHorizontal } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/section-heading";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: Globe,
    label: "LinkedIn",
    value: "linkedin.com/in/hafiyharizan",
    href: SITE_CONFIG.linkedin,
  },
  {
    icon: ExternalLink,
    label: "GitHub",
    value: "github.com/hafiyharizan",
    href: SITE_CONFIG.github,
  },
  {
    icon: MapPin,
    label: "Location",
    value: SITE_CONFIG.location,
    href: null,
  },
] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

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

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column: Contact info cards */}
          <div className="space-y-4">
            {CONTACT_INFO.map((item, i) => {
              const Icon = item.icon;
              const content = (
                <motion.div
                  key={item.label}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-300 hover:bg-card-hover"
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent-light" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="truncate font-medium text-foreground group-hover:text-accent-light transition-colors duration-200">
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
                    target={item.label !== "Email" ? "_blank" : undefined}
                    rel={
                      item.label !== "Email"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="block"
                  >
                    {content}
                  </a>
                );
              }
              return content;
            })}
          </div>

          {/* Right column: Contact form placeholder */}
          <motion.div
            className="rounded-xl border border-border bg-card p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Send a message
            </h3>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
              aria-label="Contact form"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-1.5 block text-sm text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-accent-light focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-accent-light focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="What would you like to discuss?"
                  className="w-full resize-none rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-accent-light focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                }}
              >
                Send Message
                <SendHorizontal className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
