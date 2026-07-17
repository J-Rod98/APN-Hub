"use client";
// Newsletter / text-updates signup. Posts to /api/newsletter.
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { US_STATES } from "@/lib/constants";

/**
 * `variant="light"` renders the compact email-only form used on the Sanctuary
 * Light homepage band; the default renders the full dark-theme form.
 */
export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          phone: fd.get("phone") || null,
          state: fd.get("state") || null,
          hp_website: fd.get("hp_website") || "", // honeypot
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  // --- Sanctuary Light band: email + subscribe only ---
  if (variant === "light") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <HoneypotField />
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            name="email"
            type="email"
            required
            aria-label="Email address"
            placeholder="you@church.org"
            className="flex-1 rounded-[14px] border-0 bg-white px-[18px] py-4 text-[15px] text-sanctuary-ink outline-none ring-offset-2 placeholder:text-[#7a8299] focus-visible:ring-2 focus-visible:ring-white"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-[14px] bg-sanctuary-ink px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-125 disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Subscribe"}
          </button>
        </div>
        {status === "ok" ? (
          <div className="animate-pop text-[13px] font-semibold text-white">
            🔥 You&apos;re in — watch for Friday&apos;s email.
          </div>
        ) : status === "error" ? (
          <div className="text-[13px] font-semibold text-white">
            Something went wrong. Please try again.
          </div>
        ) : (
          <div className="text-[13px] text-white/85">
            New sermons, events and prayer needs. Free, always. No spam.
          </div>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
      <HoneypotField />
      <input name="email" type="email" required aria-label="Email address" placeholder="Email address" className="input min-w-[180px] flex-1" />
      <input name="phone" type="tel" aria-label="Phone (optional)" placeholder="Phone (optional)" className="input min-w-[160px] flex-1" />
      <select name="state" aria-label="State" defaultValue="" className="input min-w-[120px]">
        <option value="">State…</option>
        {US_STATES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Joining…" : "Join APN Updates"}
      </Button>
      {status === "ok" && (
        <p className="mt-2 w-full animate-pop text-center text-sm font-semibold text-brand-bright">
          🔥 You&apos;re in! Welcome to the APN Hub community.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 w-full text-center text-sm font-semibold text-[#ff8a8a]">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
