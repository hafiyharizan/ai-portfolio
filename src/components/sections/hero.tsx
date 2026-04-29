"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/constants";
import { AskAIModal } from "@/components/ask-ai-modal";
import { useBreakpoint } from "@/hooks/use-breakpoint";

const HEADLINE = ["Hi,", "I'm", "Hafiy"];
const STACK = [
  "TypeScript","React","Next.js","Node.js","Python","PostgreSQL",
  "Redis","Docker","AWS","Azure AI","OpenAI","Tailwind",
  "tRPC","Prisma","GitHub Actions","Vercel","Supabase",
];

type ModuleKey = "js" | "php" | "opencode" | "react" | "postgres";
type Module = {
  key: ModuleKey;
  ico: string;
  icoVariant: "accent" | "blue" | "green";
  name: string;
  ver: string;
  desktopPos: React.CSSProperties;
  mobilePos: React.CSSProperties;
  delay: string;
  hideOnMedium?: boolean;
};

const MODULES: Module[] = [
  { key: "react",    ico: "R",  icoVariant: "accent", name: "react",      ver: "18.3",   desktopPos: { top: "-6%",    left: "-22%" },  mobilePos: { top: "-4%",    left: "-6%" },  delay: "-0.2s"  },
  { key: "js",       ico: "JS", icoVariant: "green",  name: "javascript", ver: "ES2025", desktopPos: { top: "18%",    right: "-26%" }, mobilePos: { top: "30%",    right: "-8%" }, delay: "-1.4s"  },
  { key: "opencode", ico: "◈",  icoVariant: "blue",   name: "opencode",   ver: "latest", desktopPos: { bottom: "24%", left: "-26%" },  mobilePos: { bottom: "22%", left: "-8%" },  delay: "-2.8s"  },
  { key: "postgres", ico: "P",  icoVariant: "accent", name: "postgres",   ver: "16",     desktopPos: { top: "-8%",    right: "-18%" }, mobilePos: {},               delay: "-4.0s", hideOnMedium: true },
  { key: "php",      ico: "P",  icoVariant: "blue",   name: "php",        ver: "8.3",    desktopPos: { top: "42%",    left: "-30%" },  mobilePos: {},               delay: "-5.2s", hideOnMedium: true },
];

const icoStyle: Record<Module["icoVariant"], React.CSSProperties> = {
  accent: { background: "linear-gradient(135deg, var(--accent), var(--accent-hot))", color: "var(--accent-ink)" },
  blue:   { background: "oklch(0.5 0.14 265)", color: "#fff" },
  green:  { background: "linear-gradient(135deg, var(--accent-light), var(--accent-hot))", color: "#fff" },
};

function perthTime() {
  return new Date().toLocaleTimeString("en-AU", {
    timeZone: "Australia/Perth",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

export function Hero() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clock, setClock]         = useState("--:--");
  const portraitRef = useRef<HTMLDivElement>(null);
  const rAFRef      = useRef(0);
  const { isMedium, isSmall } = useBreakpoint();

  useEffect(() => {
    const updateClock = () => setClock(perthTime());
    const timeout = window.setTimeout(updateClock, 0);
    const id = window.setInterval(updateClock, 30_000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (rAFRef.current) return;
      rAFRef.current = requestAnimationFrame(() => {
        const cx = innerWidth / 2, cy = innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        if (portraitRef.current) {
          portraitRef.current.style.transform = `rotateY(${dx * 3.5}deg) rotateX(${-dy * 3.5}deg)`;
        }
        rAFRef.current = 0;
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const gridStyle: React.CSSProperties = isMedium
    ? { gridTemplateColumns: "1fr", gap: 48, padding: isSmall ? "24px 20px 140px" : "36px 28px 140px", minHeight: "unset" }
    : { gridTemplateColumns: "1.25fr 1fr", gap: 72, padding: "40px 48px 80px", minHeight: "calc(100vh - 72px)" };

  const metricsStyle: React.CSSProperties = isSmall
    ? { gridTemplateColumns: "1fr", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }
    : { gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" };

  return (
    <>
      <section
        className="relative z-[2] mx-auto grid items-center"
        style={{ maxWidth: 1440, ...gridStyle }}
        aria-label="Hero"
      >
        {/* ——— Left column ——— */}
        <div className="relative">
          {/* Eyebrow */}
          <div
            className="v2-up mb-6 inline-flex flex-wrap items-center gap-2.5 rounded-full border px-3 py-1.5"
            style={{
              fontFamily: "var(--font-jb-mono)",
              fontSize: 11,
              color: "var(--muted)",
              borderColor: "var(--line-strong)",
              background: "var(--bg-soft)",
              animationDelay: "0.1s",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }}
            />
            <span>Software Engineer</span>
            <span style={{ color: "var(--muted-foreground)" }}>/</span>
            <span>Full-stack</span>
            <span style={{ color: "var(--muted-foreground)" }}>/</span>
            <span>Data &amp; AI</span>
          </div>

          {/* Headline */}
          <h1
            className="text-balance"
            style={{
              fontSize: "clamp(32px, 5.6vw, 78px)",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "var(--foreground)",
            }}
          >
            {HEADLINE.map((word, i) => (
              <span
                key={i}
                className="v2-word mr-[0.22em]"
                style={{
                  animationDelay: `${0.15 + i * 0.06}s`,
                  ...(word === "AI-native" || word === "Hafiy"
                    ? {
                        background: "linear-gradient(110deg, var(--accent) 10%, var(--accent-hot) 50%, var(--accent) 90%)",
                        backgroundSize: "200% 100%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        animation: `reveal-word 0.8s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.06}s forwards, sheen 6s linear ${0.15 + i * 0.06 + 0.8}s infinite`,
                      }
                    : {}),
                }}
              >
                {word}
              </span>
            ))}
            <span
              className="ml-1 inline-block"
              style={{
                width: 3,
                height: "0.85em",
                background: "var(--accent)",
                verticalAlign: "-0.08em",
                boxShadow: "0 0 12px var(--accent)",
                animation: "blink 1s steps(2) infinite",
              }}
            />
          </h1>

          {/* Sub copy */}
          <p
            className="v2-up mt-5 leading-[1.55]"
            style={{ fontSize: isSmall ? 15 : 17, color: "var(--muted)", animationDelay: "0.75s", maxWidth: 540 }}
          >
            I build the whole stack — from{" "}
            <strong style={{ color: "var(--foreground)", fontWeight: 500 }}>
              data pipelines moving millions of records
            </strong>{" "}
            to the UI a customer touches. Now using AI as leverage to ship features small teams used to need ten engineers for.
          </p>

          {/* Metrics strip */}
          <div
            className="v2-up mt-7 grid py-4"
            style={{ maxWidth: 540, animationDelay: "0.88s", ...metricsStyle }}
          >
            {[
              { v: "3M+",   k: "Customers served" },
              { v: "80%",   k: "Manual work removed" },
              { v: "4 yrs", k: "Shipping in production" },
            ].map((m, i) => (
              <div
                key={m.k}
                className="px-[18px]"
                style={{
                  borderLeft: !isSmall && i > 0 ? "1px solid var(--line)" : "none",
                  borderTop: isSmall && i > 0 ? "1px solid var(--line)" : "none",
                  paddingLeft: !isSmall && i === 0 ? 0 : undefined,
                  paddingTop: isSmall && i > 0 ? 12 : undefined,
                  paddingBottom: isSmall && i < 2 ? 12 : undefined,
                  ...(isSmall && i === 0 ? { paddingLeft: 0 } : {}),
                }}
              >
                <div
                  className="flex items-baseline gap-1 text-2xl font-semibold"
                  style={{ letterSpacing: "-0.02em", color: "var(--accent)" }}
                >
                  {m.v}
                </div>
                <div
                  className="mt-1 uppercase"
                  style={{
                    fontFamily: "var(--font-jb-mono)",
                    fontSize: 10,
                    color: "var(--muted-foreground)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {m.k}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="v2-up mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: "1.0s" }}>
            <a
              href="#projects"
              className="group relative inline-flex h-[46px] items-center gap-2.5 rounded-[10px] px-5 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
                letterSpacing: "-0.005em",
                boxShadow: "var(--primary-action-shadow)",
              }}
            >
              View projects
              <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
            </a>

            <button
              onClick={() => setModalOpen(true)}
              className="relative inline-flex h-[46px] items-center gap-2.5 overflow-hidden rounded-[10px] border px-5 text-sm font-medium transition-all duration-200 hover:-translate-y-px"
              style={{
                color: "var(--foreground)",
                borderColor: "var(--line-strong)",
                background: "var(--bg-soft)",
                letterSpacing: "-0.005em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px var(--accent-line), 0 0 24px var(--accent-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--line-strong)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 -z-[1]"
                style={{
                  background: "linear-gradient(110deg, transparent 30%, var(--accent-soft) 50%, transparent 70%)",
                  animation: "shimmer-btn 3s ease-in-out infinite",
                }}
              />
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)", animation: "pulse-ok 1.8s ease-in-out infinite" }}
              />
              Ask my AI
            </button>

            <a
              href={SITE_CONFIG.resumeUrl}
              download
              className="inline-flex h-[46px] items-center px-3.5 text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-jb-mono)", fontSize: 13, color: "var(--muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--foreground)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
            >
              resume.pdf ↗
            </a>
          </div>

          {/* Stack ticker — hide on very small screens */}
          {!isSmall && (
            <div
              className="v2-up mt-8 flex max-w-[600px] items-center gap-4 overflow-hidden"
              style={{ animationDelay: "1.15s" }}
            >
              <span
                className="shrink-0 uppercase"
                style={{ fontFamily: "var(--font-jb-mono)", fontSize: 11, color: "var(--muted-foreground)", letterSpacing: "0.08em" }}
              >
                {"// stack"}
              </span>
              <div
                className="flex flex-1 items-center gap-2.5 overflow-hidden"
                style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
              >
                <div
                  className="flex shrink-0 items-center gap-2.5"
                  style={{ animation: "slide 30s linear infinite", whiteSpace: "nowrap" }}
                >
                  {[...STACK, ...STACK].map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5"
                      style={{
                        fontFamily: "var(--font-jb-mono)",
                        fontSize: 11,
                        borderColor: "var(--line-strong)",
                        background: "var(--bg-soft)",
                        color: "var(--muted)",
                      }}
                    >
                      <span className="h-1 w-1 rounded-full" style={{ background: "var(--accent)" }} />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ——— Right column: portrait ——— */}
        <div
          className="flex items-center justify-center"
          style={isMedium ? { order: -1 } : {}}
        >
          <div
            className="relative"
            style={{ width: isMedium ? "min(340px, 80vw)" : "min(420px, 100%)", perspective: 1400 }}
          >
            <div
              ref={portraitRef}
              className="relative w-full"
              style={{
                aspectRatio: "4/5",
                transformStyle: "preserve-3d",
                transition: "transform 0.15s ease-out",
                animation: "reveal-pop 1s cubic-bezier(0.22,1,0.36,1) 0.4s both",
              }}
            >
              {/* Portrait card */}
              <div
                className="relative h-full w-full overflow-hidden rounded-2xl"
                style={{
                  border: "1px solid var(--line-strong)",
                  background: "var(--card)",
                  boxShadow: "var(--portrait-shadow)",
                }}
              >
                {/* Static fallback — always rendered, video plays on top */}
                <img
                  src="/hero-avatar.png"
                  alt="Hafiy Harizan"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ filter: "saturate(1.05) contrast(1.04)" }}
                />
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  style={{ filter: "saturate(1.05) contrast(1.04)" }}
                >
                  <source src="/hero-avatar.mp4" type="video/mp4" />
                </video>
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "var(--portrait-overlay)" }}
                />

                {/* Top label bar */}
                <div
                  className="absolute left-3.5 right-3.5 top-3.5 z-[4] flex items-center justify-between"
                  style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10 }}
                >
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-1"
                    style={{ background: "var(--glass-bg)", backdropFilter: "blur(10px)", border: "1px solid var(--glass-border)" }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "#e23", boxShadow: "0 0 8px #e23", animation: "pulse-ok 1.2s ease-in-out infinite" }}
                    />
                    LIVE
                  </span>
                  <span
                    className="rounded-full px-2 py-1"
                    style={{ background: "var(--glass-bg)", backdropFilter: "blur(10px)", border: "1px solid var(--glass-border)", color: "var(--muted)" }}
                  >
                    ID_0401
                  </span>
                </div>

                {/* Data bar */}
                <div
                  className="absolute bottom-3 left-3 right-3 z-[4] grid rounded-[10px] px-3 py-2.5"
                  style={{
                    gridTemplateColumns: "1fr auto 1fr",
                    fontFamily: "var(--font-jb-mono)",
                    fontSize: 10,
                    background: "var(--glass-bg-strong)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span style={{ color: "var(--muted-foreground)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>Engineer</span>
                    <span style={{ color: "var(--foreground)" }}>Hafiy Harizan</span>
                  </div>
                  <div className="flex items-center px-3" style={{ color: "var(--muted-foreground)" }}>·</div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span style={{ color: "var(--muted-foreground)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>Local</span>
                    <span>
                      <span style={{ color: "var(--accent)" }}>{clock}</span>
                      {" · Perth"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Corner brackets */}
              {(["tl","tr","bl","br"] as const).map((corner) => (
                <span
                  key={corner}
                  className="pointer-events-none absolute z-[5]"
                  style={{
                    width: 18, height: 18,
                    ...(corner === "tl" && { top: -1, left: -1, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", borderTopLeftRadius: 16 }),
                    ...(corner === "tr" && { top: -1, right: -1, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", borderTopRightRadius: 16 }),
                    ...(corner === "bl" && { bottom: -1, left: -1, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)", borderBottomLeftRadius: 16 }),
                    ...(corner === "br" && { bottom: -1, right: -1, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)", borderBottomRightRadius: 16 }),
                  }}
                />
              ))}

              {/* Floating module badges */}
              {MODULES.map((m) => {
                if (isMedium && m.hideOnMedium) return null;
                const pos = isMedium ? m.mobilePos : m.desktopPos;
                return (
                  <div
                    key={m.key}
                    className="absolute z-[6] flex items-center gap-2.5 rounded-[10px] px-3.5 py-2.5"
                    style={{
                      ...pos,
                      fontFamily: "var(--font-jb-mono)",
                      fontSize: 11,
                      color: "var(--foreground)",
                      background: "var(--module-bg)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid var(--line-strong)",
                      boxShadow: "var(--module-shadow)",
                      animation: `float 7s ease-in-out ${m.delay} infinite`,
                      transform: "translateZ(50px)",
                    }}
                  >
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] text-[11px] font-semibold"
                      style={icoStyle[m.icoVariant]}
                    >
                      {m.ico}
                    </span>
                    <span className="font-medium">{m.name}</span>
                    <span style={{ color: "var(--muted-foreground)", fontSize: 10 }}>{m.ver}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <AskAIModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
