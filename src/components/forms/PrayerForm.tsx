"use client";
// Public prayer request form. Posts to /api/prayer (lands as 'pending').
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PRAYER_CATEGORIES, US_STATES } from "@/lib/constants";

export function PrayerForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name") || null,
      title: fd.get("title") || null,
      request_text: fd.get("request_text"),
      category: fd.get("category") || null,
      city: fd.get("city") || null,
      state: fd.get("state") || null,
      is_public: fd.get("is_public") === "on",
    };
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card hover={false} className="p-6">
      <h3 className="mb-1 text-lg font-bold">Submit a Prayer Request</h3>
      <p className="mb-4 text-sm text-ink-muted">
        Requests are reviewed before appearing on the public wall.
      </p>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Your name (optional)" className="input" />
        <select name="category" className="input" defaultValue="">
          <option value="">Category…</option>
          {PRAYER_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input name="title" placeholder="Short title (optional)" className="input sm:col-span-2" />
        <textarea
          name="request_text"
          required
          placeholder="Share your prayer request…"
          className="input sm:col-span-2"
          rows={3}
        />
        <input name="city" placeholder="City (optional)" className="input" />
        <select name="state" className="input" defaultValue="">
          <option value="">State (optional)</option>
          {US_STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink-muted sm:col-span-2">
          <input type="checkbox" name="is_public" defaultChecked className="h-4 w-4 accent-[#2f8bff]" />
          Show my request publicly on the prayer wall (uncheck to keep it private)
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Posting…" : "Post Request"}
          </Button>
          {status === "ok" && (
            <p className="mt-3 animate-pop rounded-xl border border-brand-bright/40 bg-brand/15 px-4 py-3 text-sm font-semibold text-brand-bright">
              🙏 Your prayer request has been received and is awaiting review.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-[#ff8a8a]">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}
