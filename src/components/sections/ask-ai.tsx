"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";
import { routeQuestion, type Message } from "@/lib/ai-router";

const SUGGESTED_QUESTIONS = [
  "What's Hafiy's strongest technical skill?",
  "Tell me about the DREAM project",
  "What makes Hafiy a good fit for a data engineering role?",
  "What personal projects has Hafiy built?",
];

export function AskAI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [responseSource, setResponseSource] = useState<"canned" | "ai" | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = useCallback(
    async (question?: string) => {
      const q = question ?? input;
      if (!q.trim() || isStreaming) return;

      // Clear transient state before each new submission
      setStreamingText("");
      setIsStreaming(false);
      setResponseSource(null);
      setResponse("");

      // Cancel any in-flight request from a previous submission
      abortRef.current?.abort();

      const result = routeQuestion(q);

      if (result.source === "canned") {
        setResponseSource("canned");
        setTimeout(() => {
          const answer = result.response!;
          setResponse(answer);
          setHistory((prev) =>
            [
              ...prev,
              { role: "user" as const, content: q },
              { role: "assistant" as const, content: answer },
            ].slice(-6)
          );
        }, 1500);
        return;
      }

      // Real AI path
      setIsStreaming(true);
      setResponseSource("ai");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          setResponse("Sorry, something went wrong. Please try again.");
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assembled = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assembled += chunk;
          setStreamingText(assembled);
        }

        // Commit to response only when stream is complete
        setResponse(assembled);
        setStreamingText("");
        setIsStreaming(false);
        setHistory((prev) =>
          [
            ...prev,
            { role: "user" as const, content: q },
            { role: "assistant" as const, content: assembled },
          ].slice(-6)
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setResponse("Sorry, something went wrong. Please try again.");
        setIsStreaming(false);
      }
    },
    [input, isStreaming, history]
  );

  // isLoading is true during the canned delay or while the AI stream hasn't started yet
  const isLoading =
    isStreaming ||
    (responseSource === "canned" && !response);
  const displayText = streamingText || response;

  return (
    <section
      id="ask-ai"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-label="Ask AI about Hafiy"
    >
      {/* Radial gradient background accent */}
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

        {/* Input card */}
        <motion.div
          className="relative rounded-2xl border border-border bg-card p-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center gap-3">
            {/* Animated gradient orb */}
            <motion.div
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
              }}
              animate={{
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 0 12px rgba(139,92,246,0.3)",
                  "0 0 24px rgba(37,99,235,0.4)",
                  "0 0 12px rgba(139,92,246,0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>

            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              placeholder="Ask me anything about Hafiy..."
              className="min-w-0 flex-1 bg-transparent py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Ask a question about Hafiy"
            />

            {/* Submit button */}
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isStreaming}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all duration-200 hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send question"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Suggested questions */}
        <motion.div
          className="mt-4 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {SUGGESTED_QUESTIONS.map((question) => (
            <button
              key={question}
              onClick={() => {
                setInput(question);
                handleSubmit(question);
              }}
              disabled={isStreaming}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent-light hover:text-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </motion.div>

        {/* Response area */}
        <AnimatePresence mode="wait">
          {(isLoading || displayText) && (
            <motion.div
              className="mt-8 rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {isLoading && !displayText ? (
                <div
                  className="flex items-center gap-1.5"
                  aria-label="Loading response"
                  role="status"
                >
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="h-2 w-2 rounded-full bg-accent-light"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <motion.p
                    className="leading-relaxed text-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {displayText}
                  </motion.p>
                  {responseSource === "ai" && (
                    <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent-light">
                      AI
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
