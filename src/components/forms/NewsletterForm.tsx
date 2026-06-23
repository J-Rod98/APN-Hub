"use client";
// Newsletter / text-updates signup. Posts to /api/newsletter.
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { US_STATES } from "@/lib/constants";

export function NewsletterForm() {
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
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-3">
      <input name="email" type="email" required placeholder="Email address" className="input min-w-[180px] flex-1" />
      <input name="phone" type="tel" placeholder="Phone (optional)" className="input min-w-[160px] flex-1" />
      <select name="state" defaultValue="" className="input min-w-[120px]">
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
