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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    async (question?: string) => {
      const q = (question ?? input).trim();
      if (!q || isStreaming) return;

      setInput("");

      // Capture history before adding the new user message
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
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(109, 40, 217, 0.08), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Heading */}
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

        {/* Chat card */}
        <motion.div
          className="overflow-hidden rounded-2xl border border-border bg-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Message history */}
          <div className="flex h-[360px] flex-col gap-4 overflow-y-auto p-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-tr-none bg-accent text-white"
                        : "rounded-tl-none border border-border bg-background text-foreground"
                    }`}
                  >
                    {msg.text || (isStreaming && i === messages.length - 1) ? (
                      msg.text || (
                        <div className="flex items-center gap-1" role="status" aria-label="Thinking">
                          {[0, 0.2, 0.4].map((delay, j) => (
                            <motion.span
                              key={j}
                              className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay }}
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

          {/* Suggested questions */}
          <div className="flex flex-wrap gap-2 border-t border-border px-6 py-4">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(q)}
                disabled={isStreaming}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition-all duration-200 hover:border-accent-light hover:text-accent-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2">
              <motion.div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 8px rgba(139,92,246,0.3)",
                    "0 0 16px rgba(37,99,235,0.4)",
                    "0 0 8px rgba(139,92,246,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Ask me anything about Hafiy..."
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Ask a question about Hafiy"
                disabled={isStreaming}
              />

              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isStreaming}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-all duration-200 hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-40"
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
