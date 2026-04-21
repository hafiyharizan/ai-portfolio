"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { ThemePicker } from "@/components/theme-picker";

const NAV_ITEMS = [
  { num: "01", label: "Work",    href: "#projects" },
  { num: "02", label: "Stack",   href: "#skills" },
  { num: "03", label: "About",   href: "#about" },
  { num: "04", label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="relative z-10 border-b"
      style={{
        borderColor: "var(--line)",
        background: "rgba(7,7,9,0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
    <div className="flex items-center justify-between px-5 py-4 sm:px-10 sm:py-[22px]">
      {/* Mark */}
      <a
        href="#"
        className="flex items-center gap-2.5"
        style={{ fontFamily: "var(--font-jb-mono)", fontSize: 13, fontWeight: 500 }}
        aria-label="Back to top"
      >
        <span
          className="grid h-[26px] w-[26px] place-items-center rounded-[7px] text-[13px] font-bold"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-hot))",
            color: "var(--accent-ink)",
            letterSpacing: "-0.02em",
            boxShadow: "0 0 20px var(--accent-soft)",
          }}
        >
          H
        </span>
        <span>
          hafiy
          <span style={{ color: "var(--muted-foreground)", marginLeft: 2 }}>.dev</span>
        </span>
      </a>

      {/* Desktop nav */}
      <ul className="hidden items-center gap-1 md:flex" style={{ listStyle: "none" }}>
        {NAV_ITEMS.map(({ num, label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 transition-colors duration-200"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 12,
                color: "var(--muted)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-soft)";
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "";
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
              }}
            >
              <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{num}</span>
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Tools */}
      <div className="flex items-center gap-2.5">
        <ThemePicker />

        {/* Open to work status */}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors duration-200"
          style={{
            fontFamily: "var(--font-jb-mono)",
            fontSize: 11,
            color: "var(--muted)",
            borderColor: "var(--line-strong)",
            background: "var(--bg-soft)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--ok)",
              boxShadow: "0 0 10px var(--ok)",
              animation: "pulse-ok 2s ease-in-out infinite",
            }}
          />
          Open to work
        </a>

        {/* Mobile hamburger */}
        <button
          className="grid h-9 w-9 place-items-center rounded-lg border md:hidden"
          style={{ borderColor: "var(--line-strong)", background: "var(--bg-soft)", color: "var(--muted)" }}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>
    </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          className="border-t px-5 py-4 md:hidden"
          style={{ borderColor: "var(--line)", background: "rgba(7,7,9,0.95)", backdropFilter: "blur(12px)" }}
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ num, label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-3"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 13,
                color: "var(--muted)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{num}</span>
              {label}
            </a>
          ))}
          <ThemePicker mode="mobile" />
          <a
            href={SITE_CONFIG.resumeUrl}
            download
            className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--line-strong)", background: "var(--bg-soft)", color: "var(--muted)", fontFamily: "var(--font-jb-mono)" }}
          >
            resume.pdf ↗
          </a>
        </nav>
      )}
    </header>
  );
}
