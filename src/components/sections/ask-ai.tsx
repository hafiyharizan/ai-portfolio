"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles, Loader2 } from "lucide-react";
import { routeQuestion } from "@/lib/ai-router";

interface Message {
  role: "user" | "model";
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "Tell me about Hafiy",
  "What projects has Hafiy built?",
  "What skills does Hafiy have?",
  "Why should we hire Hafiy?",
];

const INITIAL_MESSAGE: Message = {
  role: "model",
  text: "Hi! I'm Hafiy's AI Twin. Ask me anything about his projects, skills, or experience.",
};

export function AskAI() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    async (question?: string) => {
      const q = (question ?? input).trim();
      if (!q || isStreaming) return;

      setInput("");

      const historyForApi = messages
        .filter((m) => m.text)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }))
        .slice(-6);

      setMessages((prev) => [...prev, { role: "user", text: q }]);

      abortRef.current?.abort();
      const result = routeQuestion(q);

      if (result.source === "canned") {
        setMessages((prev) => [...prev, { role: "model", text: "" }]);
        setIsStreaming(true);
        await new Promise((r) => setTimeout(r, 700));
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "model", text: result.response! };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "model", text: "" }]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, history: historyForApi }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "model",
              text: errText || "Sorry, something went wrong. Please try again.",
            };
            return updated;
          });
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assembled = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assembled += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "model", text: assembled };
            return updated;
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "model",
            text: "Sorry, something went wrong. Please try again.",
          };
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming, messages]
  );

  return (
    <section
      id="ask-ai"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Ask AI about Hafiy"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, var(--accent-soft), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="gradient-text text-sm font-semibold uppercase tracking-widest">
            Ask AI
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Curious about me?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Ask my AI anything about my experience, skills, or projects.
          </p>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: "var(--card)",
            border: "1px solid var(--line-strong)",
            boxShadow:
              "0 0 60px var(--accent-soft), 0 8px 32px rgba(0,0,0,0.35)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 border-b px-5 py-3.5"
            style={{
              borderColor: "var(--line-strong)",
              background: "var(--bg-soft)",
            }}
          >
            <motion.div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hot))",
              }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <Sparkles
                className="h-4 w-4"
                style={{ color: "var(--accent-ink)" }}
              />
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  Hafiy AI
                </span>
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
                  TWIN
                </span>
              </div>
              <div
                className="mt-0.5 flex items-center gap-1.5"
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  fontSize: 10,
                  color: "var(--muted-foreground)",
                }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--ok)" }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                online · digital twin
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex h-[300px] flex-col gap-3 overflow-y-auto p-5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--line-strong) transparent",
            }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                            color: "var(--accent-ink)",
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: "var(--bg-soft)",
                            border: "1px solid var(--line-strong)",
                            color: "var(--foreground)",
                            borderBottomLeftRadius: 4,
                          }
                    }
                  >
                    {msg.text || (isStreaming && i === messages.length - 1) ? (
                      msg.text || (
                        <div
                          className="flex items-center gap-1 py-0.5"
                          role="status"
                          aria-label="Thinking"
                        >
                          {[0, 0.18, 0.36].map((delay, j) => (
                            <motion.span
                              key={j}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: "var(--muted)" }}
                              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay,
                              }}
                            />
                          ))}
                        </div>
                      )
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Chips */}
          <div
            className="flex flex-wrap gap-1.5 border-t px-5 py-3"
            style={{
              borderColor: "var(--line-strong)",
              background: "var(--bg-soft)",
            }}
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(q)}
                disabled={isStreaming}
                className="rounded-lg border px-3 py-1.5 text-[11px] transition-all duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-jb-mono)",
                  background: "var(--card)",
                  borderColor: "var(--line-strong)",
                  color: "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--accent)";
                  el.style.color = "var(--accent-light)";
                  el.style.background = "var(--accent-soft)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--line-strong)";
                  el.style.color = "var(--muted)";
                  el.style.background = "var(--card)";
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Composer */}
          <div
            className="border-t p-4"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <div
              className="flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-200 focus-within:shadow-[0_0_0_3px_var(--accent-soft)]"
              style={{
                background: "var(--bg-soft)",
                borderColor: "var(--line-strong)",
              }}
              onFocusCapture={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onBlurCapture={(e) =>
                (e.currentTarget.style.borderColor = "var(--line-strong)")
              }
            >
              <motion.div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Sparkles
                  className="h-3 w-3"
                  style={{ color: "var(--accent-ink)" }}
                />
              </motion.div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Ask me anything about Hafiy..."
                className="min-w-0 flex-1 bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Ask a question about Hafiy"
                disabled={isStreaming}
              />

              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isStreaming}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hot))",
                  color: "var(--accent-ink)",
                }}
                aria-label="Send question"
              >
                {isStreaming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <SendHorizontal className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
