"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
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
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) {
      setCanHover(false);
    }
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

        {/* Non-interactive scrim gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 60%, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Interactive content */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.32 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 16px 16px",
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.2 }}>
            {project.name}
          </p>
          <p style={{ margin: "4px 0 8px", fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
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
