"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Grid3X3 } from "lucide-react";
import * as THREE from "three";
import { SectionHeading } from "@/components/ui/section-heading";
import { SKILLS } from "@/lib/constants";
import { GLOBE_TECHS, fibSphereUnit } from "@/lib/globe-techs";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const skillGroups = Object.entries(SKILLS);
const skillCount = skillGroups.reduce((total, [, skills]) => total + skills.length, 0);

function makeLatitude(radius: number, y: number, segments = 160) {
  const ringRadius = Math.sqrt(Math.max(0, radius * radius - y * y));
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * ringRadius, y, Math.sin(a) * ringRadius));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

function makeMeridian(radius: number, rotationY: number, segments = 160) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.sin(a) * radius, Math.cos(a) * radius, 0));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.rotateY(rotationY);
  return geometry;
}

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelId = useId();
  const [showAllSkills, setShowAllSkills] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Assign to non-null locals so TypeScript tracks narrowing inside closures
    const safeContainer: HTMLDivElement = container;
    const safeCanvas: HTMLCanvasElement = canvas;

    const W = container.clientWidth;
    const H = container.clientHeight;
    if (W === 0 || H === 0) return;
    const R = Math.min(W, H) * 0.365;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Scene ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 1, 4000);
    camera.position.set(0, 0, 760);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvas.style.background = "transparent";

    // ── Globe group ──
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(R - 1, 96, 64),
      new THREE.ShaderMaterial({
        uniforms: {
          baseColor: { value: new THREE.Color("#090a17") },
          glowColor: { value: new THREE.Color("#4455ff") },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorld;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 baseColor;
          uniform vec3 glowColor;
          varying vec3 vNormal;
          varying vec3 vWorld;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorld);
            float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.0);
            float light = smoothstep(-0.15, 0.9, dot(normalize(vNormal), normalize(vec3(-0.45, 0.65, 0.75))));
            vec3 color = baseColor + glowColor * (rim * 0.12 + light * 0.025);
            gl_FragColor = vec4(color, 0.96);
          }
        `,
        transparent: true,
        depthWrite: true,
        depthTest: true,
      }),
    );
    globeGroup.add(surface);

    const gridGroup = new THREE.Group();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x5265ff,
      transparent: true,
      opacity: 0.14,
      depthTest: true,
      depthWrite: false,
    });

    [-0.52, 0, 0.52].forEach((ratio) => {
      gridGroup.add(new THREE.Line(makeLatitude(R * 1.004, R * ratio), lineMaterial));
    });

    for (let i = 0; i < 6; i++) {
      gridGroup.add(new THREE.Line(makeMeridian(R * 1.006, (i / 6) * Math.PI), lineMaterial));
    }
    globeGroup.add(gridGroup);

    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.012, 96, 64),
      new THREE.MeshBasicMaterial({
        color: 0x5366ff,
        transparent: true,
        opacity: 0.025,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    );
    scene.add(rim);

    // Atmospheric halo — BackSide, additive, static (not in globeGroup)
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R * 1.12, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0x3f4fff,
          transparent: true,
          opacity: 0.03,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          depthTest: false,
        }),
      ),
    );

    // ── Icon positions (unit vectors + world positions) ──
    const unitTuples = fibSphereUnit(GLOBE_TECHS.length);
    const iconUnits = unitTuples.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const iconWorld = iconUnits.map((v) => v.clone().multiplyScalar(R * 1.035));

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
        transition: "filter 160ms ease",
        userSelect: "none",
      });

      const badge = document.createElement("div");
      Object.assign(badge.style, {
        width: "42px",
        height: "42px",
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.025))",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 24px rgba(0,0,0,0.34)",
        backdropFilter: "blur(10px)",
      });

      const img = document.createElement("img");
      img.src = tech.icon;
      img.alt = tech.name;
      img.width = 28;
      img.height = 28;
      Object.assign(img.style, {
        width: "28px",
        height: "28px",
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
      });

      const labelEl = document.createElement("span");
      labelEl.textContent = tech.name;
      Object.assign(labelEl.style, {
        fontSize: "10px",
        fontWeight: "600",
        letterSpacing: "0",
        color: "rgba(245,247,255,0.7)",
        whiteSpace: "nowrap",
        lineHeight: "1",
        textShadow: "0 1px 10px rgba(0,0,0,0.75)",
      });

      badge.appendChild(img);
      el.appendChild(badge);
      el.appendChild(labelEl);
      container.appendChild(el);
      return { el, badge, labelEl };
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
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "8px",
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
    let velY = reducedMotion ? 0 : 0.00145;
    let velX = 0;
    let dragging = false;
    let pX = 0;
    let pY = 0;

    pins.forEach(({ el }, i) => {
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
      safeCanvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - pX;
      const dy = e.clientY - pY;
      velY = dx * 0.0034;
      velX = dy * 0.003;
      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = clamp(globeGroup.rotation.x + velX, -0.58, 0.58);
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
        const autoY = reducedMotion ? 0 : hovered >= 0 ? 0.00035 : 0.00145;
        velY = velY * 0.945 + autoY * 0.055;
        velX *= 0.9;
      }

      globeGroup.rotation.y += velY;
      globeGroup.rotation.x = clamp(globeGroup.rotation.x + velX, -0.58, 0.58);

      const euler = globeGroup.rotation;
      const cW = safeContainer.clientWidth;
      const cH = safeContainer.clientHeight;

      iconWorld.forEach((localPt, i) => {
        tmp.copy(localPt).applyEuler(euler);

        const facing = iconUnits[i].clone().applyEuler(euler).z;
        const depth = (facing + 1) / 2;

        tmp.project(camera);
        const sx = ((tmp.x + 1) / 2) * cW;
        const sy = ((-tmp.y + 1) / 2) * cH;

        const isH = i === hovered;
        const front = clamp((facing - 0.16) / 0.78, 0, 1);
        const opacity = isH ? 1 : Math.pow(front, 1.25) * 0.94;
        const scale = isH ? 1.22 : 0.68 + front * 0.3;
        const blurPx =
          facing < 0.28 && !isH ? Math.min(1.4, (0.28 - facing) * 2.8) : 0;

        const { el, badge, labelEl } = pins[i];
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = isH ? "999" : String(Math.round(depth * 800));
        el.style.transform = `translate(-50%, -56%) scale(${scale.toFixed(3)})`;
        el.style.pointerEvents = facing > 0.28 ? "auto" : "none";
        el.style.visibility = opacity > 0.025 || isH ? "visible" : "hidden";

        if (isH) {
          const c = GLOBE_TECHS[i].color;
          el.style.filter = `drop-shadow(0 0 14px ${c}aa) brightness(1.12)`;
          badge.style.borderColor = `${c}66`;
          badge.style.background = `linear-gradient(145deg, rgba(255,255,255,0.16), ${c}18)`;
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
          el.style.filter = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px) saturate(0.85)` : "saturate(0.95)";
          badge.style.borderColor = "rgba(255,255,255,0.12)";
          badge.style.background = "linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.025))";
          labelEl.style.opacity = facing > 0.62 ? "1" : "0";
          labelEl.style.color = "rgba(245,247,255,0.7)";
          labelEl.style.fontWeight = "500";
        }
      });

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      safeCanvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      ro.disconnect();

      // Dispose all GPU resources in the scene graph
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else mesh.material.dispose();
        }
      });
      renderer.dispose();

      pins.forEach(({ el }) => el.remove());
      tooltipEl.remove();
    };
  }, []);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading label="Tech Stack" title="My Skills" />
        <div
          ref={containerRef}
          className="relative mx-auto overflow-visible"
          style={{ width: "min(500px, 90vw)", height: "min(500px, 90vw)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[16%] bottom-[10%] h-[13%] rounded-full bg-black/28 blur-3xl"
          />
          <canvas
            ref={canvasRef}
            className="relative z-10 h-full w-full drop-shadow-[0_30px_70px_rgba(23,34,95,0.22)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, #000 0 70%, rgba(0,0,0,0.82) 76%, transparent 84%)",
              maskImage:
                "radial-gradient(circle at 50% 50%, #000 0 70%, rgba(0,0,0,0.82) 76%, transparent 84%)",
            }}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-expanded={showAllSkills}
            aria-controls={panelId}
            onClick={() => setShowAllSkills((open) => !open)}
            className="group inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium text-foreground/85 backdrop-blur-md transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            style={{
              background: "var(--bg-soft)",
              borderColor: "var(--line-strong)",
              boxShadow: "var(--module-shadow)",
            }}
          >
            <Grid3X3 className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>{showAllSkills ? "Hide all skills" : "View all skills"}</span>
            <span
              className="rounded-full border px-2 py-0.5 text-[11px] leading-none text-muted"
              style={{ borderColor: "var(--line-strong)" }}
            >
              {skillCount}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform duration-300 ${
                showAllSkills ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out ${
            showAllSkills ? "mt-10 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className="mx-auto max-w-4xl border-y py-7"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                {skillGroups.map(([category, skills]) => (
                  <div
                    key={category}
                    className="border-t pt-4 first:border-t-0 sm:first:border-t lg:[&:nth-child(-n+3)]:border-t-0"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <div className="mb-3 flex items-baseline justify-between gap-4">
                      <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                      <span className="text-[11px] font-medium text-muted">{skills.length}</span>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-full border px-2.5 py-1 text-xs leading-5 text-muted transition-colors hover:text-foreground"
                          style={{ borderColor: "var(--line-strong)", background: "var(--subtle-fill)" }}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
