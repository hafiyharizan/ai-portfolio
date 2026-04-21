"use client";

import { useEffect, useRef, useState } from "react";
import {
  applyCustomHue,
  applyPreset,
  DEFAULT_THEME,
  isThemeName,
  THEMES,
  THEME_STORAGE_KEY,
  type ThemeName,
} from "@/lib/theme";

type ThemePickerProps = { mode?: "desktop" | "mobile" };

const DEFAULT_HUE = 31;

function getStoredState(): { active: ThemeName | "custom"; hue: number } {
  if (typeof window === "undefined") return { active: DEFAULT_THEME, hue: DEFAULT_HUE };
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored?.startsWith("custom:")) {
    const h = parseFloat(stored.slice(7));
    if (!isNaN(h)) return { active: "custom", hue: h };
  }
  if (stored && isThemeName(stored)) {
    return { active: stored, hue: THEMES.find((t) => t.name === stored)?.hue ?? DEFAULT_HUE };
  }
  return { active: DEFAULT_THEME, hue: DEFAULT_HUE };
}

export function ThemePicker({ mode = "desktop" }: ThemePickerProps) {
  const [active, setActive] = useState<ThemeName | "custom">(DEFAULT_THEME);
  const [hue, setHue] = useState(DEFAULT_HUE);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { active: a, hue: h } = getStoredState();
    setActive(a);
    setHue(h);
    if (a === "custom") applyCustomHue(h);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const handlePreset = (name: ThemeName) => {
    setActive(name);
    setHue(THEMES.find((t) => t.name === name)?.hue ?? DEFAULT_HUE);
    applyPreset(name);
    if (mode === "desktop") setOpen(false);
  };

  const handleHue = (h: number) => {
    setHue(h);
    setActive("custom");
    applyCustomHue(h);
  };

  const currentColor =
    active === "custom"
      ? `oklch(0.72 0.18 ${hue})`
      : (THEMES.find((t) => t.name === active)?.accent ?? "#39a05b");

  const panel = (
    <>
      <p
        style={{
          fontFamily: "var(--font-jb-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          marginBottom: 8,
        }}
      >
        Presets
      </p>
      <div className="flex gap-1.5 mb-4">
        {THEMES.map((t) => {
          const isActive = active === t.name;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => handlePreset(t.name)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-all duration-150"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 10,
                color: isActive ? "var(--foreground)" : "var(--muted)",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                border: `1px solid ${isActive ? "var(--accent-line)" : "transparent"}`,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accentHot})`,
                  boxShadow: isActive ? `0 0 8px ${t.accent}` : "none",
                }}
              />
              {t.label}
            </button>
          );
        })}
      </div>

      <p
        style={{
          fontFamily: "var(--font-jb-mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--muted-foreground)",
          marginBottom: 8,
        }}
      >
        Custom
      </p>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={359}
          value={hue}
          onChange={(e) => handleHue(Number(e.target.value))}
          className="hue-slider w-full"
          aria-label="Custom accent hue"
        />
        <div
          className="mt-2 h-3 rounded-sm"
          style={{ background: currentColor, opacity: 0.8 }}
          aria-hidden="true"
        />
      </div>
    </>
  );

  if (mode === "mobile") {
    return (
      <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--line)" }}>
        <p
          style={{
            fontFamily: "var(--font-jb-mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
            marginBottom: 12,
          }}
        >
          Theme
        </p>
        {panel}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-200"
        style={{
          fontFamily: "var(--font-jb-mono)",
          fontSize: 11,
          color: "var(--muted)",
          borderColor: open ? "var(--accent-line)" : "var(--line-strong)",
          background: "var(--bg-soft)",
        }}
        aria-label="Open theme picker"
        aria-expanded={open}
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: currentColor, boxShadow: `0 0 8px ${currentColor}` }}
        />
        Theme
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 rounded-xl border p-4"
          style={{
            top: "100%",
            width: 216,
            zIndex: 50,
            background: "rgba(14,14,18,0.97)",
            borderColor: "var(--line-strong)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {panel}
        </div>
      )}
    </div>
  );
}
