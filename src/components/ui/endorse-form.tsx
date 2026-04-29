"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type State = "idle" | "submitting" | "done" | "error";

export function EndorseForm({ onClose }: { onClose?: () => void }) {
  const [name, setName]           = useState("");
  const [role, setRole]           = useState("");
  const [linkedinUrl, setLinkedin] = useState("");
  const [message, setMessage]     = useState("");
  const [state, setState]         = useState<State>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  async function submit() {
    if (!name.trim() || message.trim().length < 12) return;
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/endorsements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || undefined,
          linkedin_url: linkedinUrl.trim() || undefined,
          message: message.trim(),
          website: "", // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: "var(--accent-line)", background: "var(--accent-soft)" }}
      >
        <p className="font-semibold" style={{ color: "var(--accent)", fontSize: 15 }}>
          Thanks — endorsement received!
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
          It'll show up here after Hafiy reviews it.
        </p>
      </div>
    );
  }

  const busy = state === "submitting";
  const canSubmit = name.trim().length > 0 && message.trim().length >= 12;

  const inputStyle = {
    borderColor: "var(--line-strong)",
    background: "var(--bg-soft)",
    color: "var(--foreground)",
    outline: "none",
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "var(--accent-line)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "var(--line-strong)";
    },
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "var(--line-strong)", background: "var(--card)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold" style={{ fontSize: 14, color: "var(--foreground)" }}>
          Leave an endorsement
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm opacity-40 hover:opacity-70 transition-opacity"
            style={{ color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          maxLength={90}
          placeholder="Your name *"
          className="rounded-xl border px-3.5 py-2.5 text-sm"
          style={inputStyle}
          onFocus={focusHandlers.onFocus}
          onBlur={focusHandlers.onBlur}
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={busy}
          maxLength={90}
          placeholder="Your role (optional)"
          className="rounded-xl border px-3.5 py-2.5 text-sm"
          style={inputStyle}
          onFocus={focusHandlers.onFocus}
          onBlur={focusHandlers.onBlur}
        />
      </div>

      <div className="relative mt-3">
        <input
          value={linkedinUrl}
          onChange={(e) => setLinkedin(e.target.value)}
          disabled={busy}
          placeholder="LinkedIn profile URL (optional — adds credibility)"
          className="w-full rounded-xl border px-3.5 py-2.5 text-sm"
          style={inputStyle}
          onFocus={focusHandlers.onFocus}
          onBlur={focusHandlers.onBlur}
        />
        {linkedinUrl.trim() && (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px]"
            style={{ fontFamily: "var(--font-jb-mono)", color: "var(--accent)" }}
          >
            ✓ verified link
          </span>
        )}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={busy}
        maxLength={240}
        rows={3}
        placeholder="What was it like working with Hafiy? *"
        className="mt-3 w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm"
        style={{ ...inputStyle, fontFamily: "inherit" }}
        onFocus={focusHandlers.onFocus}
        onBlur={focusHandlers.onBlur}
      />
      <p className="mb-3 mt-1 text-right" style={{ fontFamily: "var(--font-jb-mono)", fontSize: 10, color: "var(--muted-foreground)" }}>
        {message.length}/240
      </p>

      <input name="website" type="text" className="hidden" tabIndex={-1} aria-hidden="true" />

      {(state === "error") && (
        <p className="mb-3 rounded-lg px-3 py-2 text-xs" style={{ background: "oklch(0.3 0.12 25 / 0.3)", color: "oklch(0.75 0.18 25)" }}>
          {errorMsg}
        </p>
      )}

      <button
        onClick={submit}
        disabled={busy || !canSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 hover:-translate-y-px disabled:opacity-40 disabled:translate-y-0"
        style={{
          background: "linear-gradient(135deg, var(--accent), var(--accent-hot))",
          color: "var(--accent-ink)",
          boxShadow: canSubmit ? "0 0 16px var(--accent-soft)" : "none",
        }}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {busy ? "Submitting…" : "Submit endorsement"}
      </button>
    </div>
  );
}
