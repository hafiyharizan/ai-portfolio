# Skills Globe — Design Spec
**Date:** 2026-04-22
**Section:** `#skills` in `src/components/sections/skills.tsx`

---

## Overview

Replace the current category-card grid with a full 3D interactive globe that displays the tech stack. The globe uses Three.js WebGL for the sphere and DOM elements for the icon pins.

---

## Visual Design

**Background:** `#0b0b14` (near-black navy), matching portfolio theme.

**Starfield:** ~2200 random white dots scattered in deep space behind the globe.

**Globe sphere (Two.js `THREE.Group`):**
- Radius: `390px` in scene units
- **Fill mesh:** `SphereGeometry(R-1, 48, 32)` with `MeshBasicMaterial({ color: #0d0d1a })` — solid dark fill so back-face wireframe is occluded, making it read as a solid 3D sphere.
- **Wireframe:** `EdgesGeometry(SphereGeometry(R, 22, 16))` rendered as `LineSegments`, color `#4455cc`, opacity `0.45`, `depthTest: true`. EdgesGeometry removes triangle diagonals leaving only clean lat/lon grid lines.
- **Halo:** Slightly larger `SphereGeometry(R*1.06)` with `BackSide` rendering, additive blend, `#3322aa` at opacity `0.06` — soft atmospheric edge glow. Static (not in globe group).

**Section heading:** TECH STACK eyebrow label + "My **Skills**" h2 with purple accent on "Skills".

---

## Tech Icons

**13 technologies on the globe:**

| Icon | Tech | Category | Tier |
|---|---|---|---|
| JS | JavaScript | Frontend | Core |
| TS | TypeScript | Frontend | Core |
| React | React | Frontend | Core |
| Next.js | Next.js | Frontend | Core |
| Tailwind | Tailwind CSS | Frontend | Core |
| Python | Python | Backend | Core |
| Node.js | Node.js | Backend | Comfortable |
| PostgreSQL | PostgreSQL | Databases | Comfortable |
| Docker | Docker | DevOps | Comfortable |
| Git → GitHub | GitHub | DevOps | Core |
| Figma | Figma | Design | Comfortable |
| Power BI | Power BI | Data & Viz | Comfortable |
| AWS | AWS | Cloud | Comfortable |

**Icon source:** `https://cdn.simpleicons.org/{slug}/{hex}` — single-colour SVGs with brand colours.

**Placement:** Fibonacci sphere distribution (`fibSphereUnit(n)`) for even spread. Positions stored as unit vectors; world positions = unit * R.

---

## Depth Simulation

All depth effects driven by `facing` — the Z component of the icon's unit normal after applying the globe's current rotation (camera is at +Z):

```
facing = iconUnitNormal.applyEuler(globeGroup.rotation).z
depth  = (facing + 1) / 2    // 0 = back, 1 = front
```

| Property | Back (facing = -1) | Front (facing = +1) |
|---|---|---|
| Opacity | ~0.05 | ~1.0 |
| Scale | 0.50× | 1.00× |
| Blur | up to 2.2px | 0px |
| z-index | low | high |

On hover: scale 1.65×, opacity 1.0, brand-color drop-shadow, no blur.

---

## Interactions

### Auto-rotation (idle)
- Continuous Y-axis rotation at `velY = 0.0022 rad/frame` (~7.5°/sec, ~48s full rotation).
- Implemented via `globeGroup.rotation.y += velY` each frame.
- Slows to `0.0006` when any icon is hovered.

### Drag to rotate
- `pointerdown` → set `dragging = true`, capture pointer.
- `pointermove` → `velY = dx * 0.0045`, `velX = dy * 0.003`, apply directly to `globeGroup.rotation`.
- `pointerup` → `dragging = false`.
- X rotation clamped to `[-0.65, 0.65]` to prevent flipping.

### Inertia + auto-rotation resume
- When not dragging: `velY = velY * 0.938 + autoY * 0.062` each frame.
- After fast drag, velY decays naturally (~0.5s to return to auto speed).
- No explicit timer needed — the EMA blend handles it continuously.

### Hover
- `mouseenter`/`mouseleave` on DOM pin elements.
- Hovered icon: scale 1.65×, brand colour drop-shadow glow, label brightens.
- Globe rotation slows (auto target drops from 0.0022 to 0.0006).
- Tooltip appears: tech name, category, tier badge.

---

## Tooltip

Positioned to the left or right of the hovered icon depending on screen X position. Content:
- Tech name (large, white)
- Category (small, dim)
- Tier badge: "Core" (purple) or "Comfortable" (blue)

---

## Component Architecture

**New file:** `src/components/sections/skills-globe.tsx` (replaces `skills.tsx`)

**Dependencies to add:**
```
npm install three @types/three
```

**Structure:**
```
SkillsGlobe (React component)
├── useRef: containerRef (div), canvasRef (canvas)
├── useEffect: Three.js setup, animation loop, event listeners
│   ├── Scene, Camera (PerspectiveCamera, FOV=55, z=1100)
│   ├── Renderer (WebGLRenderer, antialias, pixelRatio capped at 2)
│   ├── Starfield (THREE.Points, static)
│   ├── globeGroup (THREE.Group, rotates each frame)
│   │   ├── Fill sphere (MeshBasicMaterial, solid dark)
│   │   └── Wireframe (LineSegments, EdgesGeometry)
│   ├── Halo (THREE.Mesh, BackSide, static)
│   ├── Per-frame: update rotation, project icon positions, update DOM
│   └── Cleanup: renderer.dispose(), remove event listeners
├── DOM icon pins (absolutely positioned over canvas)
└── Tooltip (absolutely positioned, opacity-toggled)
```

**Section layout** (unchanged structure):
```tsx
<section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
  <SectionHeading label="Tech Stack" title="My Skills" />
  <div ref={containerRef} className="relative mx-auto" style={{width: '500px', height: '500px'}}>
    <canvas ref={canvasRef} />
    {/* icon pins rendered into containerRef via useEffect */}
  </div>
</section>
```

**Responsive:** Container scales to `min(500px, 90vw)` so it works on mobile.

---

## Performance

- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` — cap at 2× for high-DPI screens.
- `will-change: transform, opacity` on icon pin elements.
- `requestAnimationFrame` loop; dispose on component unmount.
- No post-processing, no shadows, no lights — just geometry + DOM.

---

## Files Changed

| File | Action |
|---|---|
| `src/components/sections/skills.tsx` | Replace content with SkillsGlobe component |
| `src/lib/constants.ts` | No change needed (globe uses inline TECHS data) |
| `package.json` | Add `three`, `@types/three` |

---

## Success Criteria

- Globe reads as a true 3D sphere (not flat ring) on first view.
- Icons clearly show depth — front icons vivid and large, back icons dim and small.
- Drag rotation feels weighted with inertia.
- Auto-rotation resumes smoothly after drag release.
- Hover tooltip shows with no layout jank.
- 60fps on modern hardware.
- No Three.js errors in console.
