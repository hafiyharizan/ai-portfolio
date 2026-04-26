"use client";

import { useEffect, useRef } from "react";

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spotlight = spotlightRef.current;
    if (!canvas || !spotlight) return;

    const ctx = canvas.getContext("2d")!;
    type Particle = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let particles: Particle[] = [];
    let animId: number;

    function resize() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      canvas!.width = innerWidth * devicePixelRatio;
      canvas!.height = innerHeight * devicePixelRatio;
      canvas!.style.width = innerWidth + "px";
      canvas!.style.height = innerHeight + "px";
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.1 + 0.3,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1 - 0.03,
      a: Math.random() * 0.5 + 0.15,
    }));

    function tick() {
      const particleRgb =
        getComputedStyle(document.documentElement).getPropertyValue("--particle-rgb").trim() ||
        "237,237,240";
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = innerWidth;
        if (p.x > innerWidth) p.x = 0;
        if (p.y < 0) p.y = innerHeight;
        if (p.y > innerHeight) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${particleRgb},${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(tick);
    }
    tick();

    let rAF = 0;
    function onMove(e: PointerEvent) {
      spotlight!.style.setProperty("--mx", e.clientX + "px");
      spotlight!.style.setProperty("--my", e.clientY + "px");
      if (rAF) return;
      rAF = requestAnimationFrame(() => { rAF = 0; });
    }
    window.addEventListener("pointermove", onMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      {/* Gradient blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="v2-blob"
          style={{
            width: 700, height: 700,
            top: "-20%", right: "-12%",
            background: "var(--accent)",
            opacity: "var(--blob-primary-opacity)",
          }}
        />
        <div
          className="v2-blob"
          style={{
            width: 520, height: 520,
            bottom: "-18%", left: "-10%",
            background: "var(--accent-hot)",
            opacity: "var(--blob-secondary-opacity)",
            animationDelay: "-10s",
          }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(to right, rgba(var(--grid-line-rgb), var(--grid-line-alpha)) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--grid-line-rgb), var(--grid-line-alpha)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 70% 50%, black 30%, transparent 85%)",
          }}
        />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[1] opacity-45"
        aria-hidden="true"
      />

      {/* Cursor spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), var(--accent-soft), transparent 55%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
