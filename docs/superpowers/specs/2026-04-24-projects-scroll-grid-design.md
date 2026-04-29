# Projects Scroll Grid — Design Spec
**Date:** 2026-04-24
**Status:** Approved

---

## Overview

Replace the current static projects grid with a scroll-driven cinematic grid reveal. A 3×3 CSS grid with a sticky viewport container, a center hero tile that shrinks from fullscreen, and two layers of surrounding project tiles that reveal with staggered opacity and scale animations driven by scroll progress. All 8 projects (4 personal, 4 professional) fill the surrounding tiles. The hero center is a portfolio atmosphere image.

Reference: `scroll-animation-with-grid-motion` (vanilla JS, Motion library). Ported to Framer Motion (`useScroll` + `useTransform`).

---

## Layout & Structure

### Section
```
<section id="projects">
  <SectionHeading />          ← normal flow, above sticky area
  <div ref={wrapperRef}>      ← 240vh desktop / 180vh mobile scroll wrapper
    <div sticky 100vh>        ← sticky viewport, overflow: hidden
      <div grid 3×3>          ← centered, max-width 1400px
        <HeroTile />          ← center cell [2,2]
        <div.project-layer>   ← Layer A: edges [1,2] [2,1] [2,3] [3,2]
        <div.project-layer>   ← Layer B: corners [1,1] [1,3] [3,1] [3,3]
      </div>
    </div>
  </div>
</section>
```

### Grid tracks
```css
grid-template-columns: 1fr 1.6fr 1fr
grid-template-rows:    1fr 1.6fr 1fr
gap: clamp(14px, 1.8vw, 28px)
```

Center track is 1.6× surrounding tracks — hero is visually dominant without dwarfing surrounding tiles.

### Background
Sticky container: `background: #09090b` with a centered radial bloom at `rgba(var(--accent-rgb), 0.05)`. Dark luxury, not flat black.

### Scroll height
```
default:            min-height: 240vh
@media (max-width: 768px): min-height: 180vh
```

### Subgrid
`.project-layer` spans full grid area and inherits parent tracks via `subgrid`. Children specify explicit `grid-column` / `grid-row`.

```css
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
  }
}
/* Note: parent grid must have position: relative for the fallback to work */
```

---

## Animation Timing

All animations driven by a single `scrollYProgress` from `useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })`.

### Hero scaler
```
Scale:         scrollYProgress 0 → 0.75  :  initialHeroScale → 1
BorderRadius:  scrollYProgress 0 → 0.60  :  0px → 18px
Easing:        cubicBezier(0.65, 0, 0.35, 1)   (power2.inOut)
```

`initialHeroScale` computed in `useLayoutEffect` via `heroCellRef`:
```ts
const scaleX = window.innerWidth  / rect.width
const scaleY = window.innerHeight / rect.height
initialHeroScale = Math.max(scaleX, scaleY) * 1.05
```
Updated on window resize via event listener.

### Layer A — edge midpoints (reveals first)
Outer scroll range mapped to `[0, 0.82]`:
```
Opacity keyframes [0, 0.55, 1] → values [0, 0, 1]
Scale   keyframes [0, 0.30, 1] → values [0, 0, 1]
Opacity easing: cubicBezier(0.61, 1, 0.88, 1)    (sine.out)
Scale   easing: cubicBezier(0.76, 0, 0.24, 1)    (power3.inOut)
```

At scroll 0.75 (when hero settles), Layer A opacity is ~81% done — tiles are mostly visible, creating a connected arrival rather than a sequential one.

### Layer B — corners (reveals last)
Outer scroll range mapped to `[0, 0.96]`:
```
Same inner keyframe structure as Layer A.
Scale easing: cubicBezier(0.87, 0, 0.13, 1)      (power4.inOut)
```

### Parallax (continuous, 0 → 1)
```
Top row tiles:    y  +24px → -24px
Bottom row tiles: y  -24px → +24px
Left edge tile:   y  +12px → -12px
Right edge tile:  y  -12px → +12px
Hero:             none
```
Maximum values: 24px / 12px. Do not increase.

### Reduced motion
Detect via `useReducedMotion()` hook (`window.matchMedia('prefers-reduced-motion: reduce')`).
When true:
- Hero renders at natural scale immediately (no scaler)
- All tiles: `opacity: 1`, `scale: 1`, no entrance animation
- Parallax disabled
- Scroll wrapper collapses to `height: auto` (no wasted scroll space)
- Hover effects (scale, overlay) remain active

---

## Tile Design

### Shape
```
aspect-ratio:  3 / 4   (portrait — screenshot-ready)
border-radius: 16px    (surrounding tiles)
               18px    (hero final state, animates from 0px)
overflow:      hidden
```

### Always-on gradient overlay
```css
background: linear-gradient(
  to top,
  rgba(0, 0, 0, 0.78) 0%,
  rgba(0, 0, 0, 0.18) 45%,
  transparent 70%
);
```
Ensures readability of badge and color-line at rest. Darkens further on hover via a second scrim layer fading in.

### Project color top-line
```
height:      1px
position:    absolute top-0 inset-x-0
color:       project.color (personal tiles)
             #ffffff18      (professional tiles — unified)
opacity:     0.45 at rest → 1.0 on hover
box-shadow:  none at rest → 0 0 8px project.color on hover
```

### Personal vs Professional badge
Always visible. Top-left corner of each tile.
```
Personal:     bg: accent-soft  text: accent-light  (warm)
Professional: bg: transparent  text: muted  border: 1px rgba(255,255,255,0.12)
Font:         10px uppercase letter-spacing: 0.12em
```

### Corner rotation (static tilt)
```
TL: rotate(-1.2deg)
TR: rotate(+1.2deg)
BL: rotate(+1.2deg)
BR: rotate(-1.2deg)
Edge midpoints: no rotation
Hero:           no rotation
```
Transition to `rotate(0deg)` on hover at `300ms ease`.
Disabled on touch devices via `@media (hover: none)`.

### Hover state (320ms ease throughout)
1. Image zoom:       `scale(1.06)` on `<img>` (inner element only)
2. Container lift:   `scale(1.03)` on tile wrapper
3. Rotation:         → `0deg`
4. Overlay:          `opacity: 0 → 1`
5. Color top-line:   glows
6. Box shadow:       appears on hover only — `0 24px 60px rgba(0,0,0,0.5)`

Do not exceed `scale(1.03)` container / `scale(1.06)` image.

### Hover overlay content
```
Position: absolute bottom-0 inset-x-0
Scrim:    linear-gradient(to top, rgba(0,0,0,0.88) 60%, transparent)

Contents (bottom-up):
  Tags         — 10px pills, rgba(255,255,255,0.15) bg
  Tagline      — 12px muted-light
  Project name — 18px bold white
  View arrow   — accent-colored, bottom-right, icon + micro-slide on hover
```

### Hero tile ambient motion
CSS keyframe animation, always running at rest:
```css
@keyframes gradient-drift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```
Applied to an absolute overlay div with `background-size: 200% 200%`, `animation: gradient-drift 7s ease-in-out infinite`. Subtle shimmer layer on top at `opacity: 0.06`.

Hero hover: `"Explore my work ↓"` label fades in (no project info, no badge).

---

## Data Mapping

```
Hero center:       Atmospheric placeholder (picsum seed: portfolio-hero)

Layer A — edges (professional, outer range → 0.82):
  TC [1,2]: DREAM
  ML [2,1]: NDM
  MR [2,3]: FIVE
  BC [3,2]: MSQoS

Layer B — corners (personal, outer range → 0.96):
  TL [1,1]: Salasilah    #10b981
  TR [1,3]: ChoreQuest   #f59e0b
  BL [3,1]: FridgeBoard  #3b82f6
  BR [3,3]: FishScout    #06b6d4
```

Professional tiles: unified `#ffffff18` top-line, no per-project color.
Personal tiles: per-project `color` field from `constants.ts`.

### Placeholder images
`https://picsum.photos/seed/{slug}/600/800` — fixed seed per project, consistent across renders.

### Real images (future)
Add optional `image?: string` field to `PERSONAL_PROJECTS` and `PROFESSIONAL_PROJECTS` in `constants.ts`. Each tile uses `project.image ?? picsumUrl(project.name)`. No other code changes needed.

---

## File Architecture

```
src/
  components/sections/
    projects-legacy.tsx          ← current projects.tsx renamed verbatim
    projects.tsx                 ← new scroll animation section (ProjectsScroll)
    project-tile.tsx             ← ProjectTile + HeroTile components
  app/
    globals.css                  ← .project-layer + @keyframes gradient-drift
```

No custom hook file needed — use `useReducedMotion` from `'framer-motion'` directly.

`page.tsx` import unchanged: `from "@/components/sections/projects"`.

**Revert:** delete `projects.tsx`, rename `projects-legacy.tsx` → `projects.tsx`.

### Component responsibilities

**`ProjectsScroll` (projects.tsx)**
- `useScroll` → `scrollYProgress`
- `useLayoutEffect` + resize listener → `initialHeroScale`
- `useReducedMotion` → short-circuit all motion values
- All `useTransform` motion values for hero, Layer A, Layer B, parallax
- Renders: section heading, scroll wrapper, sticky container, grid shell, layers, tiles

**`ProjectTile` (project-tile.tsx)**
Props: `project`, `motionOpacity`, `motionScale`, `parallaxY`, `rotation`, `type: 'personal' | 'professional'`
- Local hover state
- Image, gradient, color-line, badge, hover overlay, arrow link

**`HeroTile` (project-tile.tsx)**
Props: `motionScale`, `motionBorderRadius`, `heroCellRef`
- Placeholder image, ambient gradient drift overlay, shimmer, hover CTA
- No badge, no rotation, no parallax, no color-line

**`useReducedMotion`**
Use framer-motion's built-in: `import { useReducedMotion } from 'framer-motion'`. No custom hook file needed. Returns `true` when `prefers-reduced-motion: reduce` is set.

---

## Out of Scope

- Real project screenshots (added later via `image` field)
- Click-through to project detail pages
- Keyboard navigation beyond existing anchor links
- Any change to the section heading copy
