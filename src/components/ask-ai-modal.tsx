"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { routeQuestion, type Message } from "@/lib/ai-router";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CHIPS = [
  "Tell me about Hafiy",
  "What projects has he built?",
  "Why should we hire him?",
  "What tech stack does he use?",
  "Is he available in Perth?",
];

type ChatMsg = { role: "user" | "ai"; text: string; streaming?: boolean };

export function AskAIModal({ isOpen, onClose }: Props) {
  const { isSmall } = useBreakpoint();
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "ai", text: "Hey — I'm Hafiy's AI. Ask me anything about his work, projects, or whether he's the right fit for your team." },
  ]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const [history, setHistory] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => taRef.current?.focus(), 450);
  }, [isOpen]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isBusy) return;
    setShowChips(false);
    setIsBusy(true);
    setInput("");

    setMsgs((prev) => [...prev, { role: "user", text }]);

    const result = routeQuestion(text);

    if (result.source === "canned") {
      setMsgs((prev) => [...prev, { role: "ai", text: "", streaming: true }]);
      await new Promise((r) => setTimeout(r, 1200));
      const answer = result.response!;
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "ai", text: answer };
        return copy;
      });
      setHistory((h) => [...h, { role: "user", content: text }, { role: "assistant", content: answer }].slice(-6) as Message[]);
      setIsBusy(false);
      return;
    }

    // Real AI path
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setMsgs((prev) => [...prev, { role: "ai", text: "", streaming: true }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        setMsgs((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "ai", text: errText || "Sorry, something went wrong. Please try again." };
          return copy;
        });
        setIsBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
        const snap = assembled;
        setMsgs((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "ai", text: snap, streaming: true };
          return copy;
        });
      }

      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "ai", text: assembled };
        return copy;
      });
      setHistory((h) => [...h, { role: "user", content: text }, { role: "assistant", content: assembled }].slice(-6) as Message[]);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "ai", text: "Couldn't reach my brain just now. Try again or email hafiyharizan@gmail.com." };
        return copy;
      });
    } finally {
      setIsBusy(false);
    }
  }, [isBusy, history]);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[50] transition-opacity duration-300"
        style={{
          background: "var(--modal-scrim)",
          backdropFilter: "blur(8px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — right-panel on desktop, bottom-sheet on mobile */}
      <aside
        className="fixed z-[51] flex flex-col overflow-hidden rounded-2xl"
        style={
          isSmall
            ? {
                left: 12, right: 12, bottom: 12,
                width: "auto",
                height: "80vh",
                background: "var(--modal-surface)",
                border: "1px solid var(--line-strong)",
                boxShadow: "var(--modal-shadow-mobile)",
                transform: isOpen ? "translateY(0)" : "translateY(110%)",
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }
            : {
                top: "50%",
                right: 40,
                width: "min(440px, calc(100vw - 32px))",
                height: "min(680px, calc(100vh - 48px))",
                background: "var(--modal-surface)",
                border: "1px solid var(--line-strong)",
                boxShadow: "var(--modal-shadow-desktop)",
                transform: isOpen ? "translate(0, -50%)" : "translate(120%, -50%)",
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }
        }
        role="dialog"
        aria-labelledby="aiModalTitle"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 pb-4 pt-[18px]"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg"
            style={{ border: "1px solid var(--line-strong)" }}
          >
            <Image src="/avatar.png" alt="" fill className="object-cover object-top" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--ok)", border: "2px solid var(--avatar-status-ring)" }}
            />
          </div>
          <div className="flex-1">
            <div
              className="flex items-center gap-1.5 text-[15px] font-medium"
              style={{ letterSpacing: "-0.01em" }}
              id="aiModalTitle"
            >
              Ask Hafiy
              <span
                className="rounded px-1.5 py-0.5 text-[9px]"
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  background: "var(--accent-soft)",
                  color: "var(--accent-light)",
                  border: "1px solid var(--accent-line)",
                  letterSpacing: "0.08em",
                }}
              >
                AI
              </span>
            </div>
            <div
              className="mt-0.5"
              style={{
                fontFamily: "var(--font-jb-mono)",
                fontSize: 10,
                color: "var(--muted-foreground)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              digital twin · online
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-[30px] w-[30px] place-items-center rounded-lg transition-colors duration-200"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-soft)";
              (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "";
              (e.currentTarget as HTMLElement).style.color = "var(--muted)";
            }}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Chat */}
        <div
          ref={chatRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto p-5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--line-strong) transparent" }}
        >
          {msgs.map((m, i) => (
            <div
              key={i}
              className="max-w-[88%] rounded-xl px-3.5 py-[11px] text-sm leading-[1.55]"
              style={
                m.role === "user"
                  ? { alignSelf: "flex-end", background: "var(--foreground)", color: "var(--background)", borderBottomRightRadius: 4 }
                  : { alignSelf: "flex-start", background: "var(--bg-soft)", border: "1px solid var(--line)", color: "var(--foreground)", borderBottomLeftRadius: 4 }
              }
            >
              {m.streaming && !m.text ? (
                <span className="inline-flex gap-1 py-0.5">
                  {[0, 0.15, 0.3].map((d, idx) => (
                    <span
                      key={idx}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--muted)", opacity: 0.4, animation: `bounce-dot 1.2s ease-in-out ${d}s infinite` }}
                    />
                  ))}
                </span>
              ) : (
                <>
                  {m.text}
                  {m.streaming && (
                    <span
                      className="ml-0.5 inline-block h-3.5 w-1.5 align-[-2px]"
                      style={{ background: "var(--accent)", animation: "blink 1s steps(2) infinite" }}
                    />
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Chips */}
        {showChips && (
          <div className="flex flex-wrap gap-1.5 px-5 pb-3">
            {CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => send(c)}
                className="rounded-md border px-2.5 py-1.5 text-[11px] transition-all duration-200"
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  background: "var(--bg-soft)",
                  borderColor: "var(--line)",
                  color: "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--line)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-soft)";
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form
          className="flex items-end gap-2 border-t px-3.5 pb-3.5 pt-3"
          style={{ borderColor: "var(--line)" }}
          onSubmit={(e) => { e.preventDefault(); send(input); }}
        >
          <div
            className="flex flex-1 items-center rounded-[10px] border px-3 py-[9px] transition-all duration-200 focus-within:shadow-[0_0_0_3px_var(--accent-soft)]"
            style={{
              background: "var(--bg-soft)",
              borderColor: "var(--line)",
            }}
            onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--line)")}
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              rows={1}
              placeholder="Ask anything about Hafiy…"
              className="flex-1 resize-none bg-transparent text-[13.5px] leading-[1.4] outline-none"
              style={{ color: "var(--foreground)", maxHeight: 100, fontFamily: "var(--font-sans)" }}
              aria-label="Chat input"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </aside>
    </>
  );
}
