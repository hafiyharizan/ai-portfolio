"use client";

import * as React from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
  tags?: readonly string[];
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const TAP_SPRING = {
  type: "spring" as const,
  stiffness: 450,
  damping: 18,
  mass: 1,
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        if (delta > 0) handleNext();
        else handlePrev();
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) handleNext();
    else if (swipe > swipeConfidenceThreshold) handlePrev();
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  return (
    <div
      className={cn(
        "group relative flex h-[540px] w-full flex-col overflow-hidden outline-none select-none overflow-x-hidden",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Main stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        <motion.div
          className="relative mx-auto flex h-[300px] w-full max-w-6xl items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ perspective: 1200 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            const xOffset = offset * 380;
            const zOffset = -dist * 180;
            const scale = isCenter ? 1 : 0.85;
            const rotateY = offset * -20;
            const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
            const blur = isCenter ? 0 : dist * 6;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute flex flex-col overflow-hidden aspect-[16/10] w-[300px] md:w-[420px] rounded-2xl bg-neutral-900 shadow-2xl",
                  isCenter ? "z-20 ring-1 ring-white/10" : "z-10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale,
                  rotateY,
                  opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                  ...BASE_SPRING,
                  scale: TAP_SPRING,
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                {/* Browser chrome header */}
                <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.07] bg-neutral-950/60 px-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <div className="ml-2 h-3.5 flex-1 rounded-sm bg-white/[0.07]" />
                </div>
                {/* Screenshot */}
                <div className="relative flex-1 overflow-hidden">
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.includes("picsum")) {
                        img.src = `https://picsum.photos/seed/${String(item.id).toLowerCase().replace(/\s+/g, "-")}/1600/1000`;
                      }
                    }}
                    className="h-full w-full object-cover object-top pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & controls */}
        <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center justify-between gap-6 md:flex-row pointer-events-auto">
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left min-h-[96px] justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {activeItem.meta && (
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--accent-light)" }}>
                    {activeItem.meta}
                  </span>
                )}
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: "var(--foreground)" }}>
                  {activeItem.title}
                </h2>
                {activeItem.description && (
                  <p className="max-w-md" style={{ color: "var(--muted)" }}>
                    {activeItem.description}
                  </p>
                )}
                {activeItem.tags && activeItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeItem.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border px-2 py-0.5 text-[11px]"
                        style={{
                          fontFamily: "var(--font-jb-mono)",
                          color: "var(--muted)",
                          borderColor: "var(--line-strong)",
                          background: "var(--bg-soft)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1 rounded-full p-1"
              style={{ background: "var(--card)", border: "1px solid var(--line-strong)" }}
            >
              <button
                onClick={handlePrev}
                className="rounded-full p-3 transition active:scale-95"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-soft)"; (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span
                className="min-w-[40px] text-center text-xs"
                style={{ fontFamily: "var(--font-jb-mono)", color: "var(--muted-foreground)" }}
              >
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-3 transition active:scale-95"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-soft)"; (e.currentTarget as HTMLElement).style.color = "var(--foreground)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {activeItem.href && (
              <Link
                href={activeItem.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-105 active:scale-95"
                style={{ background: "var(--foreground)", color: "var(--background)" }}
              >
                Explore
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
