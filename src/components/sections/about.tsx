"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { MapPin, GraduationCap, Briefcase, Cpu, Bike, Fish } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { EASE_OUT_QUART } from "@/lib/motion";

// ─── Spotlight bento card ────────────────────────────────────────────────────

function BentoCard({
  children,
  className,
  cellClass,
}: {
  children: React.ReactNode;
  className?: string;
  cellClass: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
      className={cn("relative overflow-hidden rounded-2xl", cellClass, className)}
      style={{
        background: "var(--bento-card-bg)",
        border: "1px solid var(--bento-card-border)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Top edge highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--bento-edge), transparent)",
        }}
      />
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: lit ? 1 : 0,
          background:
            "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), var(--bento-spotlight), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}

// ─── Live Perth clock ─────────────────────────────────────────────────────────

function PerthClock() {
  const [tick, setTick] = useState<Date | null>(null);

  useEffect(() => {
    setTick(new Date());
    const id = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = tick
    ? new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Perth",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(tick)
    : null;

  const get = (t: string) => parts?.find((p) => p.type === t)?.value ?? "00";
  const day = tick
    ? new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Perth",
        weekday: "long",
        month: "short",
        day: "numeric",
      }).format(tick)
    : null;

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-accent-light" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Perth, WA · AWST
        </span>
        {/* Live pulse dot */}
        <span className="relative ml-auto flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: "var(--accent-light)" }}
          />
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-0.5 font-mono leading-none">
          <span className="text-5xl font-black tracking-tight text-foreground">
            {get("hour")}
          </span>
          <span
            className="text-4xl font-bold"
            style={{ color: "var(--muted-foreground)" }}
          >
            :
          </span>
          <span className="text-5xl font-black tracking-tight text-foreground">
            {get("minute")}
          </span>
          <span
            className="text-4xl font-bold"
            style={{ color: "var(--muted-foreground)" }}
          >
            :
          </span>
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color: "var(--accent-light)" }}
          >
            {get("second")}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">{day}</p>
      </div>
    </div>
  );
}

// ─── Scroll-driven counter ───────────────────────────────────────────────────

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf: number;
    const t0 = performance.now();
    const dur = 1800;
    const run = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Word-by-word animated summary ──────────────────────────────────────────

function AnimatedSummary({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <p
      ref={ref}
      className="text-[13px] leading-relaxed text-muted sm:text-sm"
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          initial={reduced ? false : { opacity: 0, y: 5 }}
          animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
          transition={{
            delay: i * 0.032,
            duration: 0.32,
            ease: EASE_OUT_QUART as [number, number, number, number],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ─── Interest item ────────────────────────────────────────────────────────────

const INTERESTS = [
  {
    Icon: Cpu,
    label: "PC Building",
    blurb: "Custom rigs, cable management, overclocking",
    bg: "rgba(59,130,246,0.12)",
    fg: "#60a5fa",
  },
  {
    Icon: Bike,
    label: "Superbike Rides",
    blurb: "Weekend twisties and open highway",
    bg: "var(--accent-soft)",
    fg: "var(--accent-light)",
  },
  {
    Icon: Fish,
    label: "Fishing",
    blurb: "Early mornings, salt air, patience",
    bg: "rgba(6,182,212,0.12)",
    fg: "#22d3ee",
  },
] as const;

function InterestItem({
  Icon,
  label,
  blurb,
  bg,
  fg,
}: (typeof INTERESTS)[number]) {
  const [open, setOpen] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((o) => !o)}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--subtle-fill)] focus:outline-none"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: bg }}
      >
        <Icon className="h-4 w-4" style={{ color: fg }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-none text-foreground">
          {label}
        </p>
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 3 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden text-xs text-muted-foreground"
            >
              {blurb}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.span
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.18 }}
        className="shrink-0 text-lg leading-none text-muted-foreground select-none"
      >
        +
      </motion.span>
    </motion.button>
  );
}

// ─── About section ────────────────────────────────────────────────────────────

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading label="About" title="The person behind the code" />

        <div className="about-bento">
          {/* ── Photo ──────────────────────────────────────────────────── */}
          <BentoCard cellClass="cell-photo">
            <Image
              src="/hero-avatar.png"
              alt="Hafiy Harizan"
              fill
              className="object-cover object-top"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              priority
            />
            {/* Name overlay */}
            <div
              className="absolute inset-x-0 bottom-0 p-5"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 55%, transparent)",
              }}
            >
              <p className="text-lg font-bold tracking-tight text-white">
                Hafiy Harizan
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                Software &amp; Data Engineer · Perth, AU
              </p>
            </div>
          </BentoCard>

          {/* ── Summary ────────────────────────────────────────────────── */}
          <BentoCard cellClass="cell-summary" className="flex flex-col justify-center gap-3 p-5">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--accent-light)" }}
            >
              About Me
            </p>
            <AnimatedSummary text="Engineer at the intersection of software and data. I build end-to-end systems — robust pipelines, scalable APIs, and clean interfaces. 4+ years shipping production-grade solutions for 3M+ customers at Telekom Malaysia." />
          </BentoCard>

          {/* ── Experience counter ─────────────────────────────────────── */}
          <BentoCard
            cellClass="cell-xp"
            className="flex flex-col justify-between p-5"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-accent-light" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Experience
              </span>
            </div>
            <div>
              <p
                className="text-7xl font-black leading-none tracking-tighter"
                style={{
                  background:
                    "linear-gradient(135deg, var(--foreground) 0%, var(--accent-light) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Counter to={4} suffix="+" />
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Years in production
              </p>
            </div>
          </BentoCard>

          {/* ── Perth clock ────────────────────────────────────────────── */}
          <BentoCard cellClass="cell-clock">
            <PerthClock />
          </BentoCard>

          {/* ── Education ──────────────────────────────────────────────── */}
          <BentoCard
            cellClass="cell-edu"
            className="flex flex-col justify-between p-5"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-accent-light" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Education
              </span>
            </div>
            <div>
              <p className="about-shimmer text-xl font-bold leading-tight">
                Master&apos;s in Data Science
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Universiti Teknologi MARA
              </p>
            </div>
          </BentoCard>

          {/* ── Interests ──────────────────────────────────────────────── */}
          <BentoCard cellClass="cell-interests" className="p-3 sm:p-4">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Outside Work
            </p>
            <div className="space-y-0.5">
              {INTERESTS.map((item) => (
                <InterestItem key={item.label} {...item} />
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
