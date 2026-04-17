"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SendHorizontal, Sparkles } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What's Hafiy's strongest technical skill?",
  "Tell me about the DREAM project",
  "What makes Hafiy a good fit for a data engineering role?",
  "What personal projects has Hafiy built?",
];

const CANNED_RESPONSES: Record<string, string> = {
  skill:
    "Hafiy's strongest technical skill is data engineering — specifically designing and building end-to-end ELT pipelines, scalable data platforms, and automated workflows using Python, SQL, and cloud services. He pairs this with strong full-stack development skills in React, Next.js, and TypeScript, making him equally comfortable building the frontend that consumes the data.",
  dream:
    "DREAM (Data Repository for Exploratory Analysis and Management) was a centralised data platform Hafiy designed at Telekom Malaysia. It featured automated ingestion, transformation, and API-based data access — reducing data preparation time from hours to minutes. The project showcased his ability to architect production-grade data systems that serve both analysts and downstream applications.",
  fit: "Hafiy brings 4+ years of hands-on experience building production data pipelines processing millions of records daily. He's automated compliance reporting (100% on-time submissions), designed scalable data mart architectures, and integrated ML outputs into analytics workflows. His unique blend of software engineering and data engineering means he builds robust, maintainable systems — not just scripts.",
  projects:
    "Hafiy has built several personal projects including Salasilah (a family tree and genealogy app using Next.js and D3.js), ChoreJoy (a gamified family chore app with React and Node.js), FridgeBoard (a household organization hub as a PWA), an Expense Tracker with rich analytics dashboards, and ApplyAI — an AI-powered job application assistant leveraging the OpenAI API.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("skill") || lower.includes("strongest") || lower.includes("best at")) {
    return CANNED_RESPONSES.skill;
  }
  if (lower.includes("dream") || lower.includes("data repository")) {
    return CANNED_RESPONSES.dream;
  }
  if (
    lower.includes("fit") ||
    lower.includes("data engineering role") ||
    lower.includes("why") ||
    lower.includes("hire") ||
    lower.includes("good")
  ) {
    return CANNED_RESPONSES.fit;
  }
  if (
    lower.includes("project") ||
    lower.includes("built") ||
    lower.includes("personal") ||
    lower.includes("portfolio")
  ) {
    return CANNED_RESPONSES.projects;
  }
  return "Hafiy is a software and data engineer based in Perth, Australia with 4+ years of experience across full-stack development, data engineering, analytics platforms, and AI-enabled solutions. He's passionate about building scalable, well-crafted systems. Feel free to ask about his skills, projects, or experience!";
}

export function AskAI() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = useCallback(
    (question?: string) => {
      const q = question || input;
      if (!q.trim() || isLoading) return;

      setInput(q);
      setIsLoading(true);
      setResponse("");

      setTimeout(() => {
        setResponse(getResponse(q));
        setIsLoading(false);
      }, 1500);
    },
    [input, isLoading]
  );

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
              disabled={!input.trim() || isLoading}
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
              disabled={isLoading}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted transition-all duration-200 hover:border-accent-light hover:text-accent-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {question}
            </button>
          ))}
        </motion.div>

        {/* Response area */}
        <AnimatePresence mode="wait">
          {(isLoading || response) && (
            <motion.div
              className="mt-8 rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {isLoading ? (
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
                <motion.p
                  className="leading-relaxed text-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {response}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
