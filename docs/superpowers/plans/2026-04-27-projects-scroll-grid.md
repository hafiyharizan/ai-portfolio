# Projects Scroll Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static projects cards grid with a scroll-driven cinematic 3×3 CSS grid where the hero tile shrinks from fullscreen and surrounding project tiles reveal with staggered entrance animations driven by `scrollYProgress`.

**Architecture:** Single `useScroll` source drives all animations via `useTransform`. A `useTransform` callback form handles the dynamically-measured `initialHeroScale`. Two subgrid layers (Layer A = professional edges, Layer B = personal corners) receive independent timing and easing.

**Tech Stack:** Framer Motion v12 (`useScroll`, `useTransform`, `useReducedMotion`, `cubicBezier`, `MotionValue`), Next.js 16, Tailwind CSS, CSS subgrid.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `src/components/sections/projects-legacy.tsx` | Verbatim copy of current `projects.tsx` (revert path) |
| Create | `src/components/sections/project-tile.tsx` | `ProjectTile` + `HeroTile` components |
| Replace | `src/components/sections/projects.tsx` | `ProjectsScroll` — orchestrates scroll, motion values, grid |
| Modify | `src/app/globals.css` | `.project-layer` subgrid class + `@keyframes gradient-drift` |

`page.tsx` import is **unchanged** — it already imports `{ Projects }` from `"@/components/sections/projects"`. The new `projects.tsx` exports `Projects` as its named export alias.

---

## Task 1: Save current projects.tsx as legacy backup

**Files:**
- Create: `src/components/sections/projects-legacy.tsx`

> No tests — pure file copy.

- [ ] **Step 1: Copy current projects.tsx to projects-legacy.tsx**

Read `src/components/sections/projects.tsx` and write its full contents verbatim to `src/components/sections/projects-legacy.tsx`. No changes to the content.

- [ ] **Step 2: Verify the copy**

Run:
```bash
diff src/components/sections/projects.tsx src/components/sections/projects-legacy.tsx
```
Expected: no output (files identical).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/projects-legacy.tsx
git commit -m "chore: save projects static grid as legacy backup"
```

---

## Task 2: Add CSS to globals.css

**Files:**
- Modify: `src/app/globals.css`

> No tests — verified visually.

- [ ] **Step 1: Append project-layer subgrid + gradient-drift keyframe**

Add the following block at the end of `src/app/globals.css`:

```css
/* ——— Projects scroll grid ——— */
.project-layer {
  display: grid;
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}

@supports not (grid-template-columns: subgrid) {
  .project-layer {
    position: absolute;
    inset: 0;
    grid-template-columns: 1fr 1.6fr 1fr;
    grid-template-rows: 1fr 1.6fr 1fr;
    gap: clamp(14px, 1.8vw, 28px);
  }
}

@keyframes gradient-drift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

Note: the parent grid must have `position: relative` for the subgrid fallback `position: absolute` to work — this is handled in `projects.tsx`.

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add project-layer subgrid class and gradient-drift keyframe"
```

---

## Task 3: Build ProjectTile component

**Files:**
- Create: `src/components/sections/project-tile.tsx`

> No unit tests — animation components are verified visually. Skip test steps.

- [ ] **Step 1: Create project-tile.tsx with ProjectTile**

Create `src/components/sections/project-tile.tsx` with the following content:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function picsumUrl(name: string) {
  return `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, "-")}/600/800`;
}

interface ProjectTileProps {
  project: {
    name: string;
    tagline: string;
    tags: readonly string[];
    color?: string;
    href?: string;
  };
  motionOpacity: MotionValue<number>;
  motionScale: MotionValue<number>;
  parallaxY: MotionValue<number>;
  rotation: number;
  type: "personal" | "professional";
  gridColumn: string;
  gridRow: string;
}

export function ProjectTile({
  project,
  motionOpacity,
  motionScale,
  parallaxY,
  rotation,
  type,
  gridColumn,
  gridRow,
}: ProjectTileProps) {
  const [hovered, setHovered] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(!window.matchMedia("(hover: none)").matches);
  }, []);

  const lineColor =
    type === "personal" ? (project.color ?? "#ffffff") : "#ffffff";
  const lineOpacity = type === "professional" ? 0.09 : 0.45;

  return (
    // Outer: scroll-driven entrance (opacity + scale) + parallax
    <motion.div
      style={{
        opacity: motionOpacity,
        scale: motionScale,
        y: parallaxY,
        gridColumn,
        gridRow,
        aspectRatio: "3 / 4",
        position: "relative",
      }}
    >
      {/* Inner: hover lift + rotation + clip */}
      <motion.div
        style={{ width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden", position: "relative" }}
        animate={{
          rotate: canHover && hovered ? 0 : canHover ? rotation : 0,
          scale: hovered ? 1.03 : 1,
        }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {/* Image */}
        <motion.img
          src={picsumUrl(project.name)}
          alt=""
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Top color line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: lineColor,
            opacity: hovered ? 1 : lineOpacity,
            boxShadow: hovered && type === "personal" ? `0 0 8px ${lineColor}` : "none",
            transition: "opacity 0.32s ease, box-shadow 0.32s ease",
          }}
        />

        {/* Always-on gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 45%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Badge */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            ...(type === "personal"
              ? {
                  background: "var(--accent-soft)",
                  color: "var(--accent-light)",
                }
              : {
                  background: "transparent",
                  color: "var(--muted)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }),
          }}
        >
          {type === "personal" ? "Personal" : "Professional"}
        </div>

        {/* Hover overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.32 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 16px 16px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 60%, transparent)",
            pointerEvents: "none",
          }}
        >
          <p
            style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.2 }}
          >
            {project.name}
          </p>
          <p
            style={{ margin: "4px 0 8px", fontSize: 12, color: "rgba(255,255,255,0.65)" }}
          >
            {project.tagline}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* View arrow */}
          {project.href && (
            <motion.a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              animate={{ x: hovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                color: "var(--accent-light)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </motion.a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/project-tile.tsx
git commit -m "feat: add ProjectTile component with hover and entrance animation props"
```

---

## Task 4: Add HeroTile to project-tile.tsx

**Files:**
- Modify: `src/components/sections/project-tile.tsx`

- [ ] **Step 1: Append HeroTile export after ProjectTile**

Add the following at the end of `src/components/sections/project-tile.tsx`:

```tsx
interface HeroTileProps {
  motionScale: MotionValue<number>;
  motionBorderRadius: MotionValue<number>;
  heroCellRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroTile({ motionScale, motionBorderRadius, heroCellRef }: HeroTileProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={heroCellRef}
      style={{
        scale: motionScale,
        borderRadius: motionBorderRadius,
        gridColumn: "2",
        gridRow: "2",
        aspectRatio: "3 / 4",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Placeholder image */}
      <img
        src="https://picsum.photos/seed/portfolio-hero/600/800"
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Ambient gradient drift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, var(--accent), transparent 50%, var(--accent-hot))",
          backgroundSize: "200% 200%",
          animation: "gradient-drift 7s ease-in-out infinite",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      {/* Subtle shimmer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.02)",
          pointerEvents: "none",
        }}
      />

      {/* Hover CTA */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          pointerEvents: "none",
        }}
      >
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>
          Explore my work ↓
        </p>
      </motion.div>
    </motion.div>
  );
}
```

Also add `import React from "react"` or add `type React` to the imports at the top of the file. The `RefObject` type import needs to come from React. Update the import line at the top of `project-tile.tsx` from:

```tsx
import { useEffect, useState } from "react";
```

to:

```tsx
import { useEffect, useRef, useState, type RefObject } from "react";
```

Then update the `HeroTileProps` type to use the named `RefObject` import:

```tsx
interface HeroTileProps {
  motionScale: MotionValue<number>;
  motionBorderRadius: MotionValue<number>;
  heroCellRef: RefObject<HTMLDivElement | null>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/project-tile.tsx
git commit -m "feat: add HeroTile component with ambient drift, shimmer, and hover CTA"
```

---

## Task 5: Build ProjectsScroll in projects.tsx

**Files:**
- Replace: `src/components/sections/projects.tsx`

This is the orchestrator: computes all motion values, renders the grid shell, passes values to tiles.

- [ ] **Step 1: Replace projects.tsx with ProjectsScroll**

Write the following as the full contents of `src/components/sections/projects.tsx`:

```tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import {
  cubicBezier,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { SectionHeading } from "@/components/ui/section-heading";
import { PERSONAL_PROJECTS, PROFESSIONAL_PROJECTS } from "@/lib/constants";
import { HeroTile, ProjectTile } from "./project-tile";

// Easing functions per spec
const easeHero    = cubicBezier(0.65, 0, 0.35, 1); // power2.inOut
const easeLayerAO = cubicBezier(0.61, 1, 0.88, 1); // sine.out
const easeLayerAS = cubicBezier(0.76, 0, 0.24, 1); // power3.inOut
const easeLayerBS = cubicBezier(0.87, 0, 0.13, 1); // power4.inOut

export function Projects() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const heroCellRef = useRef<HTMLDivElement>(null);
  const initialHeroScaleRef = useRef(1);

  const prefersReducedMotion = useReducedMotion() ?? false;

  // Measure natural hero cell size (offsetWidth/Height unaffected by CSS transform)
  useLayoutEffect(() => {
    const update = () => {
      if (!heroCellRef.current) return;
      const w = heroCellRef.current.offsetWidth;
      const h = heroCellRef.current.offsetHeight;
      initialHeroScaleRef.current =
        Math.max(window.innerWidth / w, window.innerHeight / h) * 1.05;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // ── Hero ──────────────────────────────────────────────────────────────
  // Callback form so heroScale always reads the latest initialHeroScaleRef
  const heroScale = useTransform(() => {
    const p = scrollYProgress.get();
    if (prefersReducedMotion) return 1;
    const n = Math.max(0, Math.min(p / 0.75, 1));
    return initialHeroScaleRef.current + (1 - initialHeroScaleRef.current) * easeHero(n);
  });

  const heroBorderRadius = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0, 0.6],
    prefersReducedMotion ? [18, 18] : [0, 18],
    { ease: easeHero },
  );

  // ── Layer A — professional edges (reveals by 0.82) ────────────────────
  // Input range trimmed to the "reveal" window — framer-motion clamps outside
  const layerAOpacity = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0.451, 0.82],
    prefersReducedMotion ? [1, 1] : [0, 1],
    { ease: easeLayerAO },
  );
  const layerAScale = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0.246, 0.82],
    prefersReducedMotion ? [1, 1] : [0, 1],
    { ease: easeLayerAS },
  );

  // ── Layer B — personal corners (reveals by 0.96) ──────────────────────
  const layerBOpacity = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0.528, 0.96],
    prefersReducedMotion ? [1, 1] : [0, 1],
    { ease: easeLayerAO },
  );
  const layerBScale = useTransform(
    scrollYProgress,
    prefersReducedMotion ? [0, 1] : [0.288, 0.96],
    prefersReducedMotion ? [1, 1] : [0, 1],
    { ease: easeLayerBS },
  );

  // ── Parallax (continuous 0 → 1) ───────────────────────────────────────
  const topRowY    = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -24]);
  const bottomRowY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-24, 24]);
  const leftEdgeY  = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [12, -12]);
  const rightEdgeY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const zeroY      = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // ── Data ──────────────────────────────────────────────────────────────
  // Layer A — professional (edges): TC, ML, MR, BC
  const [dream, ndm, five, msqos] = PROFESSIONAL_PROJECTS;
  // Layer B — personal (corners): TL, TR, BL, BR
  const [salasilah, chorequest, fridgeboard, fishscout] = PERSONAL_PROJECTS;

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          label="Projects"
          title="Things I've built"
          subtitle="From production data platforms to personal passion projects."
        />
      </div>

      {/* Scroll wrapper — 240vh desktop, 180vh mobile */}
      <div
        ref={wrapperRef}
        style={{ minHeight: "240vh" }}
        className="relative md:min-h-[240vh] max-md:min-h-[180vh]"
      >
        {/* Sticky viewport */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#09090b",
          }}
        >
          {/* Radial bloom */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(var(--accent-rgb, 180,80,40), 0.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          {/* 3×3 Grid */}
          <div
            style={{
              position: "relative", // required for subgrid fallback
              display: "grid",
              gridTemplateColumns: "1fr 1.6fr 1fr",
              gridTemplateRows: "1fr 1.6fr 1fr",
              gap: "clamp(14px, 1.8vw, 28px)",
              maxWidth: 1400,
              width: "100%",
              height: "100%",
              margin: "0 auto",
              padding: "clamp(14px, 1.8vw, 28px)",
              boxSizing: "border-box",
            }}
          >
            {/* Hero — center [2,2] */}
            <HeroTile
              motionScale={heroScale}
              motionBorderRadius={heroBorderRadius}
              heroCellRef={heroCellRef}
            />

            {/* Layer A — professional edges */}
            <div className="project-layer">
              {/* TC [1,2] — DREAM */}
              <ProjectTile
                project={dream}
                motionOpacity={layerAOpacity}
                motionScale={layerAScale}
                parallaxY={topRowY}
                rotation={0}
                type="professional"
                gridColumn="2"
                gridRow="1"
              />
              {/* ML [2,1] — NDM */}
              <ProjectTile
                project={ndm}
                motionOpacity={layerAOpacity}
                motionScale={layerAScale}
                parallaxY={leftEdgeY}
                rotation={0}
                type="professional"
                gridColumn="1"
                gridRow="2"
              />
              {/* MR [2,3] — FIVE */}
              <ProjectTile
                project={five}
                motionOpacity={layerAOpacity}
                motionScale={layerAScale}
                parallaxY={rightEdgeY}
                rotation={0}
                type="professional"
                gridColumn="3"
                gridRow="2"
              />
              {/* BC [3,2] — MSQoS */}
              <ProjectTile
                project={msqos}
                motionOpacity={layerAOpacity}
                motionScale={layerAScale}
                parallaxY={bottomRowY}
                rotation={0}
                type="professional"
                gridColumn="2"
                gridRow="3"
              />
            </div>

            {/* Layer B — personal corners */}
            <div className="project-layer">
              {/* TL [1,1] — Salasilah */}
              <ProjectTile
                project={salasilah}
                motionOpacity={layerBOpacity}
                motionScale={layerBScale}
                parallaxY={topRowY}
                rotation={-1.2}
                type="personal"
                gridColumn="1"
                gridRow="1"
              />
              {/* TR [1,3] — ChoreQuest */}
              <ProjectTile
                project={chorequest}
                motionOpacity={layerBOpacity}
                motionScale={layerBScale}
                parallaxY={topRowY}
                rotation={1.2}
                type="personal"
                gridColumn="3"
                gridRow="1"
              />
              {/* BL [3,1] — FridgeBoard */}
              <ProjectTile
                project={fridgeboard}
                motionOpacity={layerBOpacity}
                motionScale={layerBScale}
                parallaxY={bottomRowY}
                rotation={1.2}
                type="personal"
                gridColumn="1"
                gridRow="3"
              />
              {/* BR [3,3] — FishScout */}
              <ProjectTile
                project={fishscout}
                motionOpacity={layerBOpacity}
                motionScale={layerBScale}
                parallaxY={bottomRowY}
                rotation={-1.2}
                type="personal"
                gridColumn="3"
                gridRow="3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/projects.tsx
git commit -m "feat: implement scroll-driven cinematic 3x3 projects grid"
```

---

## Task 6: Visual verification

- [ ] **Step 1: Ensure dev server is running**

```bash
npm run dev
```

Open http://localhost:3000 and scroll to the Projects section.

- [ ] **Step 2: Verify hero entrance**

At page top (before scrolling), the hero tile should fill the viewport. As you scroll past the section heading and into the sticky area, the hero shrinks to its center cell position with border-radius animating in.

- [ ] **Step 3: Verify layer reveals**

At ~45–55% scroll through the sticky section, Layer A (professional edge tiles — DREAM, NDM, FIVE, MSQoS) should fade/scale in. At ~55–65%, Layer B (personal corner tiles — Salasilah, ChoreQuest, FridgeBoard, FishScout) should follow.

- [ ] **Step 4: Verify parallax**

As you scroll, top row tiles drift upward, bottom row tiles drift downward. Left/right edge tiles move subtly on Y.

- [ ] **Step 5: Verify hover states**

Hover each tile: container lifts (scale 1.03), image zooms (scale 1.06), color top-line brightens/glows (personal only), hover overlay fades in showing name/tagline/tags and arrow. Corner tiles rotate from ±1.2deg to 0deg.

- [ ] **Step 6: Verify reduced motion**

In browser DevTools → Rendering → "Emulate CSS media feature: prefers-reduced-motion: reduce". Reload. All tiles should be immediately visible at full opacity/scale, hero at natural cell size, no parallax. Hover effects should still work.

- [ ] **Step 7: Commit verification**

```bash
git add -A
git commit -m "feat: projects scroll grid — verified visual and reduced motion"
```

---

## Spec Coverage Checklist

| Spec requirement | Task |
|---|---|
| 3×3 CSS grid, 1fr/1.6fr/1fr tracks, clamp gap | Task 5 grid shell |
| Sticky 100vh container, 240vh/180vh wrapper | Task 5 scroll wrapper |
| Hero starts fullscreen, shrinks to cell | Task 5 `heroScale` callback + `initialHeroScaleRef` |
| Hero border-radius 0px → 18px | Task 5 `heroBorderRadius` |
| Layer A opacity ease sine.out, scale power3.inOut | Task 5 `layerAOpacity/Scale` |
| Layer B scale ease power4.inOut | Task 5 `layerBScale` |
| Layer A outer range 0.82, Layer B outer range 0.96 | Task 5 input ranges |
| Parallax ±24px top/bottom, ±12px left/right | Task 5 parallax MotionValues |
| Reduced motion: all at 1 immediately, no parallax | Task 5 `prefersReducedMotion` guards |
| `.project-layer` subgrid with @supports fallback | Task 2 globals.css |
| `@keyframes gradient-drift` | Task 2 globals.css |
| HeroTile: ambient drift, shimmer, hover CTA | Task 4 |
| ProjectTile: always-on gradient, color top-line, badge | Task 3 |
| Hover: container 1.03, image 1.06, rotation → 0 | Task 3 |
| Rotation ±1.2deg corners, 0 edges/hero | Task 5 rotation props |
| Touch: rotation disabled via `(hover: none)` | Task 3 `canHover` state |
| Picsum placeholder images, seed per project name | Task 3 + Task 4 |
| Professional: unified `#ffffff18` line, no per-project color | Task 3 `lineOpacity: 0.09` |
| Personal: per-project color line, glow on hover | Task 3 `lineColor = project.color` |
| Data mapping: DREAM→TC, NDM→ML, FIVE→MR, MSQoS→BC | Task 5 Layer A |
| Data mapping: Salasilah→TL, ChoreQuest→TR, etc. | Task 5 Layer B |
| `projects-legacy.tsx` revert path documented | Task 1 |
