# Skills Globe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the category-card grid in `skills.tsx` with a full 3D interactive globe that displays 13 tech-stack icons using Three.js WebGL + DOM overlay pins.

**Architecture:** A `useEffect` bootstraps Three.js once (scene, renderer, globe geometry, DOM pins) and runs a `requestAnimationFrame` loop that directly mutates DOM pin styles each frame — no React state updates in the hot path. Mutable interaction state (velocity, drag, hovered index) lives as `let` variables inside the closure.

**Tech Stack:** Three.js, TypeScript, React 19, Next.js 16.2.1, Vitest

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/globe-techs.ts` | Create | `GlobeTech` type, `GLOBE_TECHS` array (13 entries), `fibSphereUnit` fn |
| `src/lib/globe-techs.test.ts` | Create | Vitest tests for data integrity + math correctness |
| `src/components/sections/skills.tsx` | Replace | Three.js globe component — full implementation |
| `package.json` | Modify | Add `three` + `@types/three` |

---

## Task 1: Install Three.js

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

```bash
npm install three
npm install --save-dev @types/three
```

Expected output: both packages resolve without errors.

- [ ] **Step 2: Verify install**

```bash
node -e "const THREE = require('three'); console.log(THREE.REVISION)"
```

Expected output: prints a revision number like `161` (no error).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install three.js for skills globe"
```

---

## Task 2: Create `src/lib/globe-techs.ts`

**Files:**
- Create: `src/lib/globe-techs.ts`

- [ ] **Step 1: Write the file**

Create `src/lib/globe-techs.ts`:

```ts
export interface GlobeTech {
  name: string;
  cat: string;
  tier: "core" | "comfortable";
  icon: string;
  color: string;
}

export const GLOBE_TECHS: GlobeTech[] = [
  { name: "JavaScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",    color: "#F7DF1E" },
  { name: "TypeScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/typescript/4C8EDA",    color: "#4C8EDA" },
  { name: "React",       cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/react/61DAFB",         color: "#61DAFB" },
  { name: "Next.js",     cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/nextdotjs/D4D4EE",     color: "#D4D4EE" },
  { name: "Tailwind",    cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/tailwindcss/22D3EE",   color: "#22D3EE" },
  { name: "Python",      cat: "Backend",    tier: "core",        icon: "https://cdn.simpleicons.org/python/FFD43B",        color: "#FFD43B" },
  { name: "Node.js",     cat: "Backend",    tier: "comfortable", icon: "https://cdn.simpleicons.org/nodedotjs/74C948",     color: "#74C948" },
  { name: "PostgreSQL",  cat: "Databases",  tier: "comfortable", icon: "https://cdn.simpleicons.org/postgresql/6589E8",   color: "#6589E8" },
  { name: "Docker",      cat: "DevOps",     tier: "comfortable", icon: "https://cdn.simpleicons.org/docker/2496ED",       color: "#2496ED" },
  { name: "GitHub",      cat: "DevOps",     tier: "core",        icon: "https://cdn.simpleicons.org/github/C0C0DC",       color: "#C0C0DC" },
  { name: "Figma",       cat: "Design",     tier: "comfortable", icon: "https://cdn.simpleicons.org/figma/F24E1E",        color: "#F24E1E" },
  { name: "Power BI",    cat: "Data & Viz", tier: "comfortable", icon: "https://cdn.simpleicons.org/powerbi/F2C811",      color: "#F2C811" },
  { name: "AWS",         cat: "Cloud",      tier: "comfortable", icon: "https://cdn.simpleicons.org/amazonaws/FF9900",    color: "#FF9900" },
];

/**
 * Fibonacci sphere — returns n evenly-spaced unit vectors as [x, y, z] tuples.
 * Pure function; no Three.js dependency so it's testable in a Node environment.
 */
export function fibSphereUnit(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y  = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const t  = phi * i;
    pts.push([Math.cos(t) * rr, y, Math.sin(t) * rr]);
  }
  return pts;
}
```

- [ ] **Step 2: Confirm TypeScript compiles**

```bash
npx tsc --noEmit --project tsconfig.json
```

Expected output: no errors related to `globe-techs.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/globe-techs.ts
git commit -m "feat: add GLOBE_TECHS data and fibSphereUnit"
```

---

## Task 3: Create `src/lib/globe-techs.test.ts`

**Files:**
- Create: `src/lib/globe-techs.test.ts`
- Test: `src/lib/globe-techs.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/globe-techs.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { GLOBE_TECHS, fibSphereUnit } from "./globe-techs";

describe("GLOBE_TECHS", () => {
  it("has 13 entries", () => {
    expect(GLOBE_TECHS).toHaveLength(13);
  });

  it("each entry has required fields", () => {
    for (const tech of GLOBE_TECHS) {
      expect(tech.name).toBeTruthy();
      expect(tech.cat).toBeTruthy();
      expect(["core", "comfortable"]).toContain(tech.tier);
      expect(tech.icon).toMatch(/^https:\/\/cdn\.simpleicons\.org\//);
      expect(tech.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("no duplicate names", () => {
    const names = GLOBE_TECHS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("fibSphereUnit", () => {
  it("returns n points", () => {
    expect(fibSphereUnit(13)).toHaveLength(13);
  });

  it("each point is a unit vector (length ≈ 1)", () => {
    for (const [x, y, z] of fibSphereUnit(13)) {
      const len = Math.sqrt(x * x + y * y + z * z);
      expect(len).toBeCloseTo(1, 5);
    }
  });

  it("first point is at top pole (y ≈ 1)", () => {
    const [[, y]] = fibSphereUnit(13);
    expect(y).toBeCloseTo(1, 5);
  });

  it("last point is at bottom pole (y ≈ -1)", () => {
    const pts = fibSphereUnit(13);
    const [, y] = pts[pts.length - 1];
    expect(y).toBeCloseTo(-1, 5);
  });

  it("returns distinct points (no duplicates)", () => {
    const pts = fibSphereUnit(13);
    const strs = pts.map((p) => p.join(","));
    expect(new Set(strs).size).toBe(13);
  });
});
```

- [ ] **Step 2: Run tests — expect them to pass** (they are data + math tests on pure functions; they should pass immediately once globe-techs.ts exists)

```bash
npm test -- globe-techs
```

Expected output:

```
✓ src/lib/globe-techs.test.ts (6)
  ✓ GLOBE_TECHS > has 13 entries
  ✓ GLOBE_TECHS > each entry has required fields
  ✓ GLOBE_TECHS > no duplicate names
  ✓ fibSphereUnit > returns n points
  ✓ fibSphereUnit > each point is a unit vector (length ≈ 1)
  ✓ fibSphereUnit > first point is at top pole (y ≈ 1)
  ✓ fibSphereUnit > last point is at bottom pole (y ≈ -1)
  ✓ fibSphereUnit > returns distinct points (no duplicates)

Test Files  1 passed (1)
Tests       8 passed (8)
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/globe-techs.test.ts
git commit -m "test: add globe-techs data and fibSphereUnit tests"
```

---

## Task 4: Rewrite `src/components/sections/skills.tsx`

**Files:**
- Modify: `src/components/sections/skills.tsx` (full rewrite)

> Note: `page.tsx` imports `{ Skills }` from `@/components/sections/skills` — the named export is preserved, so no change needed in `page.tsx`.

> Note: Three.js cannot be unit-tested in this project's `environment: "node"` vitest config. Visual verification via dev server is the test for this task.

- [ ] **Step 1: Rewrite `src/components/sections/skills.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SectionHeading } from "@/components/ui/section-heading";
import { GLOBE_TECHS, fibSphereUnit } from "@/lib/globe-techs";

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const W = container.clientWidth;
    const H = container.clientHeight;
    const R = 390;

    // ── Scene ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 10000);
    camera.position.set(0, 0, 1100);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x0b0b14, 1);

    // ── Starfield ──
    const starVerts: number[] = [];
    for (let i = 0; i < 2200; i++) {
      starVerts.push(
        (Math.random() - 0.5) * 9000,
        (Math.random() - 0.5) * 9000,
        (Math.random() - 0.5) * 9000 - 1500,
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starVerts, 3));
    scene.add(
      new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 1.2,
          transparent: true,
          opacity: 0.35,
          sizeAttenuation: true,
        }),
      ),
    );

    // ── Globe group ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Solid fill sphere — occludes back-face wireframe lines via depthTest
    globeGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R - 1, 48, 32),
        new THREE.MeshBasicMaterial({ color: 0x0d0d1a }),
      ),
    );

    // Clean lat/lon wireframe — EdgesGeometry removes triangle diagonals
    const wireGeo = new THREE.EdgesGeometry(new THREE.SphereGeometry(R, 22, 16));
    globeGroup.add(
      new THREE.LineSegments(
        wireGeo,
        new THREE.LineBasicMaterial({
          color: 0x4455cc,
          transparent: true,
          opacity: 0.45,
          depthTest: true,
        }),
      ),
    );

    // Atmospheric halo — BackSide, additive, static (not in globeGroup)
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.06, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x3322aa,
          transparent: true,
          opacity: 0.06,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthTest: false,
        }),
      ),
    );

    // ── Icon positions (unit vectors + world positions) ──
    const unitTuples = fibSphereUnit(GLOBE_TECHS.length);
    const iconUnits = unitTuples.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const iconWorld = iconUnits.map((v) => v.clone().multiplyScalar(R));

    // ── DOM pins ──
    const pins = GLOBE_TECHS.map((tech) => {
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "auto",
        cursor: "default",
        willChange: "transform, opacity, filter",
        transformOrigin: "50% 50%",
      });

      const img = document.createElement("img");
      img.src = tech.icon;
      img.alt = tech.name;
      Object.assign(img.style, {
        width: "36px",
        height: "36px",
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
      });

      const label = document.createElement("span");
      label.textContent = tech.name;
      Object.assign(label.style, {
        fontSize: "9px",
        fontWeight: "500",
        letterSpacing: "0.6px",
        color: "rgba(255,255,255,0.55)",
        whiteSpace: "nowrap",
        lineHeight: "1",
      });

      el.appendChild(img);
      el.appendChild(label);
      container.appendChild(el);
      return el;
    });

    // ── Tooltip ──
    const tooltipEl = document.createElement("div");
    Object.assign(tooltipEl.style, {
      position: "absolute",
      zIndex: "30",
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.12s ease",
    });

    const ttInner = document.createElement("div");
    Object.assign(ttInner.style, {
      background: "rgba(7,5,22,0.93)",
      border: "1px solid rgba(120,90,245,0.26)",
      borderRadius: "10px",
      padding: "12px 16px 13px",
      backdropFilter: "blur(20px)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
      minWidth: "120px",
    });

    const ttName = document.createElement("div");
    Object.assign(ttName.style, {
      fontSize: "13px",
      fontWeight: "600",
      color: "#f0eeff",
      marginBottom: "2px",
    });

    const ttCat = document.createElement("div");
    Object.assign(ttCat.style, {
      fontSize: "10px",
      color: "#3e3e58",
      marginBottom: "9px",
    });

    const ttTier = document.createElement("span");
    Object.assign(ttTier.style, {
      fontSize: "9px",
      fontWeight: "700",
      letterSpacing: "1.1px",
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: "20px",
      display: "inline-block",
    });

    ttInner.appendChild(ttName);
    ttInner.appendChild(ttCat);
    ttInner.appendChild(ttTier);
    tooltipEl.appendChild(ttInner);
    container.appendChild(tooltipEl);

    // ── Interaction state ──
    let hovered = -1;
    let velY = 0.0022;
    let velX = 0;
    let dragging = false;
    let pX = 0;
    let pY = 0;

    pins.forEach((el, i) => {
      el.addEventListener("mouseenter", () => { hovered = i; });
      el.addEventListener("mouseleave", () => {
        hovered = -1;
        tooltipEl.style.opacity = "0";
      });
    });

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      pX = e.clientX;
      pY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - pX;
      const dy = e.clientY - pY;
      velY = dx * 0.0045;
      velX = dy * 0.003;
      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = Math.max(-0.65, Math.min(0.65, globeGroup.rotation.x + velX));
      pX = e.clientX;
      pY = e.clientY;
    }

    function onPointerUp() {
      dragging = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    const ro = new ResizeObserver(() => {
      const nW = container.clientWidth;
      const nH = container.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    });
    ro.observe(container);

    // ── Render loop ──
    const tmp = new THREE.Vector3();
    let rafId = 0;

    function animate() {
      rafId = requestAnimationFrame(animate);

      if (!dragging) {
        const autoY = hovered >= 0 ? 0.0006 : 0.0022;
        velY = velY * 0.938 + autoY * 0.062;
        velX *= 0.9;
      }

      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = Math.max(-0.65, Math.min(0.65, globeGroup.rotation.x + velX));

      const euler = globeGroup.rotation;
      const cW = container.clientWidth;
      const cH = container.clientHeight;

      iconWorld.forEach((localPt, i) => {
        tmp.copy(localPt).applyEuler(euler);

        const facing = iconUnits[i].clone().applyEuler(euler).z;
        const depth = (facing + 1) / 2;

        const proj = tmp.clone().project(camera);
        const sx = ((proj.x + 1) / 2) * cW;
        const sy = ((-proj.y + 1) / 2) * cH;

        const isH = i === hovered;
        const opacity = isH
          ? 1
          : facing > 0
            ? Math.pow(facing, 0.48) * 0.9 + 0.08
            : Math.max(0, facing * 0.08 + 0.05);
        const scale = isH ? 1.65 : 0.5 + depth * 0.5;
        const blurPx =
          facing < -0.4 && !isH ? Math.min(2.2, (-facing - 0.4) * 3.5) : 0;

        const el = pins[i];
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = isH ? "999" : String(Math.round(depth * 800));
        el.style.transform = `translate(-50%, -54%) scale(${scale.toFixed(3)})`;

        const labelEl = el.querySelector<HTMLSpanElement>("span")!;

        if (isH) {
          const c = GLOBE_TECHS[i].color;
          el.style.filter = `drop-shadow(0 0 10px ${c}cc) drop-shadow(0 0 4px ${c}88) brightness(1.15)`;
          labelEl.style.color = "rgba(255,255,255,0.95)";
          labelEl.style.fontWeight = "600";

          const side = sx > cW / 2 ? 44 : -(130 + 44);
          tooltipEl.style.left = `${sx + side}px`;
          tooltipEl.style.top = `${sy - 24}px`;
          ttName.textContent = GLOBE_TECHS[i].name;
          ttCat.textContent = GLOBE_TECHS[i].cat;
          const tierLabel =
            GLOBE_TECHS[i].tier.charAt(0).toUpperCase() + GLOBE_TECHS[i].tier.slice(1);
          ttTier.textContent = tierLabel;
          if (GLOBE_TECHS[i].tier === "core") {
            ttTier.style.background = "rgba(157,124,247,0.14)";
            ttTier.style.color = "#b49cf8";
            ttTier.style.border = "1px solid rgba(157,124,247,0.24)";
          } else {
            ttTier.style.background = "rgba(78,148,255,0.12)";
            ttTier.style.color = "#7eb5ff";
            ttTier.style.border = "1px solid rgba(78,148,255,0.24)";
          }
          tooltipEl.style.opacity = "1";
        } else {
          el.style.filter = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : "none";
          labelEl.style.color = "rgba(255,255,255,0.55)";
          labelEl.style.fontWeight = "500";
        }
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      ro.disconnect();
      renderer.dispose();
      pins.forEach((p) => p.remove());
      tooltipEl.remove();
    };
  }, []);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Tech Stack" title="My Skills" />
        <div
          ref={containerRef}
          className="relative mx-auto overflow-hidden"
          style={{ width: "min(500px, 90vw)", height: "min(500px, 90vw)" }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Confirm TypeScript compiles**

```bash
npx tsc --noEmit --project tsconfig.json
```

Expected output: no errors.

- [ ] **Step 3: Run the dev server**

```bash
npm run dev
```

Expected: `✓ Ready on http://localhost:3000`

- [ ] **Step 4: Visual verification checklist**

Navigate to `http://localhost:3000` and scroll to `#skills`. Verify each item:

- [ ] Globe reads as a true 3D sphere — back-face wireframe lines are hidden (not an X-ray hollow shell)
- [ ] Purple/blue lat-lon grid lines visible, not noisy triangles
- [ ] Soft atmospheric halo around the globe edge
- [ ] Starfield dots visible in the background
- [ ] All 13 tech icons visible at various depth levels
- [ ] Front icons are large and vivid; back icons are small and dim/blurred
- [ ] Globe auto-rotates slowly (≈ 48s per full rotation)
- [ ] Click and drag rotates the globe; releasing lets it spin down with inertia
- [ ] Dragging fast then releasing shows smooth decay back to auto-speed
- [ ] Hover on any icon: scale up, brand-colour glow, tooltip appears
- [ ] Tooltip shows: tech name, category, tier badge (purple for Core, blue for Comfortable)
- [ ] Tooltip switches sides correctly (left/right depending on icon position)
- [ ] No Three.js errors or warnings in browser console
- [ ] No layout shift or overflow outside the globe container

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/skills.tsx
git commit -m "feat: replace skills cards with 3D globe"
```

---

## Self-Review Checklist

Spec vs plan coverage:

| Spec requirement | Covered by |
|---|---|
| `#0b0b14` background | Task 4 — `renderer.setClearColor(0x0b0b14)` |
| 2200 starfield dots | Task 4 — starfield loop |
| `EdgesGeometry` wireframe `#4455cc` 0.45 opacity | Task 4 — wireGeo/wireMat |
| Solid fill sphere `#0d0d1a` for depth occlusion | Task 4 — fillMesh |
| Halo `#3322aa` BackSide 0.06 opacity | Task 4 — haloMesh |
| 13 specific tech icons with CDN URLs | Task 2 — GLOBE_TECHS |
| Fibonacci sphere distribution | Task 2 — fibSphereUnit; Task 4 — unitTuples→iconUnits |
| Depth: opacity/scale/blur/z-index from facing.z | Task 4 — animate loop formulas |
| Auto-rotation 0.0022 rad/frame | Task 4 — velY init + autoY |
| Slow to 0.0006 on hover | Task 4 — `hovered >= 0 ? 0.0006 : 0.0022` |
| EMA blend for auto-rotation resume | Task 4 — `velY = velY * 0.938 + autoY * 0.062` |
| Drag: velY = dx*0.0045, velX = dy*0.003 | Task 4 — onPointerMove |
| X rotation clamped ±0.65 | Task 4 — Math.max/min on rotation.x |
| Hover: scale 1.65×, brand drop-shadow | Task 4 — isH branch in animate |
| Tooltip: name, category, tier badge | Task 4 — ttName/ttCat/ttTier DOM |
| Tooltip side: left or right based on x position | Task 4 — `sx > cW / 2 ? 44 : -(130+44)` |
| `setPixelRatio(min(devicePixelRatio, 2))` | Task 4 — renderer setup |
| Cleanup on unmount | Task 4 — useEffect return |
| Responsive: `min(500px, 90vw)` | Task 4 — container style |
| `{ Skills }` named export preserved | Task 4 — `export function Skills()` |
