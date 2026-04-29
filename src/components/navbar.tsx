"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import { ThemePicker } from "@/components/theme-picker";

const NAV_ITEMS = [
  { label: "Home",     href: "#" },
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [contactHover, setContactHover] = useState(false);

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b"
      style={{
        borderColor: "var(--line)",
        background: "var(--nav-bg)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex h-[64px] items-center justify-between px-5 sm:px-10">

        {/* Left: open to work / contact me */}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="hidden md:inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all duration-200"
          style={{
            fontFamily: "var(--font-jb-mono)",
            fontSize: 12,
            color: contactHover ? "var(--accent)" : "var(--muted)",
            borderColor: contactHover ? "var(--accent-line)" : "var(--line-strong)",
            background: contactHover ? "var(--accent-soft)" : "var(--bg-soft)",
          }}
          onMouseEnter={() => setContactHover(true)}
          onMouseLeave={() => setContactHover(false)}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200"
            style={{
              background: contactHover ? "var(--accent)" : "var(--ok)",
              boxShadow: contactHover ? "0 0 10px var(--accent)" : "0 0 10px var(--ok)",
              animation: "pulse-ok 2s ease-in-out infinite",
            }}
          />
          {contactHover ? "Contact me" : "Open to work"}
        </a>

        {/* Center: pill nav — desktop */}
        <ul
          className="hidden items-center gap-0.5 rounded-full border px-1.5 py-1 md:flex"
          style={{
            listStyle: "none",
            borderColor: "var(--line-strong)",
            background: "var(--bg-soft)",
          }}
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150"
                style={{ color: "var(--muted)", fontSize: 14 }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--background)";
                  el.style.color = "var(--foreground)";
                  el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "";
                  el.style.color = "var(--muted)";
                  el.style.boxShadow = "";
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemePicker />
          </div>

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
          style={{ borderColor: "var(--line)", background: "var(--drawer-bg)", backdropFilter: "blur(12px)" }}
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center py-3"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 13,
                color: "var(--muted)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              {label}
            </a>
          ))}
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: "var(--line-strong)", background: "var(--bg-soft)", color: "var(--muted)", fontFamily: "var(--font-jb-mono)", fontSize: 12 }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--ok)", boxShadow: "0 0 8px var(--ok)" }} />
            Contact me
          </a>
        </nav>
      )}
    </header>
  );
}
