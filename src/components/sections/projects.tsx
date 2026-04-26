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

const easeHero    = cubicBezier(0.65, 0, 0.35, 1);
const easeLayerAO = cubicBezier(0.61, 1, 0.88, 1);
const easeLayerAS = cubicBezier(0.76, 0, 0.24, 1);
const easeLayerBS = cubicBezier(0.87, 0, 0.13, 1);

export function Projects() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const heroCellRef = useRef<HTMLDivElement>(null);
  const initialHeroScaleRef = useRef(1);

  const prefersReducedMotion = useReducedMotion() ?? false;

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

  const topRowY    = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -24]);
  const bottomRowY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-24, 24]);
  const leftEdgeY  = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [12, -12]);
  const rightEdgeY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);

  const [dream, ndm, five, msqos] = PROFESSIONAL_PROJECTS;
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

      <div
        ref={wrapperRef}
        className="relative md:min-h-[240vh] max-md:min-h-[180vh]"
        style={prefersReducedMotion ? { minHeight: "auto" } : undefined}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#09090b",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(180,80,40,0.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
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
            <HeroTile
              motionScale={heroScale}
              motionBorderRadius={heroBorderRadius}
              heroCellRef={heroCellRef}
            />

            <div className="project-layer">
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

            <div className="project-layer">
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
