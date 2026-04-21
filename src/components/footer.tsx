"use client";

import { useEffect, useState } from "react";

function perthTime() {
  return new Date().toLocaleTimeString("en-AU", {
    timeZone: "Australia/Perth",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function Footer() {
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    setClock(perthTime());
    const id = setInterval(() => setClock(perthTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-[5] flex items-center justify-between px-10 py-3.5"
      style={{
        fontFamily: "var(--font-jb-mono)",
        fontSize: 10,
        color: "var(--muted-foreground)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderTop: "1px solid var(--line)",
        background: "linear-gradient(to top, rgba(7,7,9,0.85), transparent)",
        backdropFilter: "blur(6px)",
      }}
      role="contentinfo"
    >
      <div className="flex items-center gap-5">
        <span>© 2026</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>PER {clock}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>v2.0.0</span>
      </div>
      <div className="flex items-center gap-5">
        <span>github.com/hafiyharizan</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>↓ scroll for work</span>
      </div>
    </footer>
  );
}
