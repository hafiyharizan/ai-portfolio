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

    // Assign to non-null locals so TypeScript tracks narrowing inside closures
    const safeContainer: HTMLDivElement = container;
    const safeCanvas: HTMLCanvasElement = canvas;

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
    const sphereForWire = new THREE.SphereGeometry(R, 22, 16);
    const wireGeo = new THREE.EdgesGeometry(sphereForWire);
    sphereForWire.dispose(); // EdgesGeometry has consumed it; free the source immediately
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

      const labelEl = document.createElement("span");
      labelEl.textContent = tech.name;
      Object.assign(labelEl.style, {
        fontSize: "9px",
        fontWeight: "500",
        letterSpacing: "0.6px",
        color: "rgba(255,255,255,0.55)",
        whiteSpace: "nowrap",
        lineHeight: "1",
      });

      el.appendChild(img);
      el.appendChild(labelEl);
      container.appendChild(el);
      return { el, labelEl };
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
        const opacity = isH
          ? 1
          : facing > 0
            ? Math.pow(facing, 0.48) * 0.9 + 0.08
            : Math.max(0, facing * 0.08 + 0.05);
        const scale = isH ? 1.65 : 0.5 + depth * 0.5;
        const blurPx =
          facing < -0.4 && !isH ? Math.min(2.2, (-facing - 0.4) * 3.5) : 0;

        const { el, labelEl } = pins[i];

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
          className="relative mx-auto overflow-hidden"
          style={{ width: "min(500px, 90vw)", height: "min(500px, 90vw)" }}
        >
          <canvas ref={canvasRef} />
        </div>
      </div>
    </section>
  );
}
