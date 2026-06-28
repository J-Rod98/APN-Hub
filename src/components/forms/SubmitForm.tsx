"use client";
// Central content submission form. Fields adapt to the selected submission type.
// Everything posts to /api/submit and is stored as 'pending' for admin review.
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HoneypotField } from "@/components/ui/HoneypotField";
import {
  SUBMISSION_TYPES,
  EVENT_CATEGORIES,
  PREACHING_TOPICS,
  MATERIAL_CATEGORIES,
  PRAYER_CATEGORIES,
  FILE_TYPES,
  US_STATES,
} from "@/lib/constants";
import type { SubmissionType } from "@/lib/types";

export function SubmitForm() {
  const [type, setType] = useState<SubmissionType>("event");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Common fields go top-level; type-specific fields collapse into content_data.
    const common = ["submission_type", "submitter_name", "submitter_email", "title", "description", "source_url", "hp_website"];
    const content_data: Record<string, unknown> = {};
    fd.forEach((value, key) => {
      if (!common.includes(key)) content_data[key] = value;
    });

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_type: type,
          submitter_name: fd.get("submitter_name") || null,
          submitter_email: fd.get("submitter_email") || null,
          title: fd.get("title") || null,
          description: fd.get("description") || null,
          source_url: fd.get("source_url") || null,
          hp_website: fd.get("hp_website") || "", // honeypot
          content_data,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
      setType("event");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Card hover={false} className="p-6 sm:p-8">
      {/* Type picker */}
      <label className="mb-2 block text-sm font-semibold text-ink-muted">
        What are you submitting?
      </label>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {SUBMISSION_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={
              "rounded-full border px-4 py-2 text-sm font-semibold transition " +
              (type === t.value
                ? "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
                : "border-line bg-navy-850 text-ink-muted hover:border-brand hover:text-ink")
            }
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <HoneypotField />
        {/* --- Always shown --- */}
        <input name="submitter_name" aria-label="Your name" placeholder="Your name" className="input" />
        <input name="submitter_email" type="email" aria-label="Your email" placeholder="Your email" className="input" />
        <input
          name="title"
          required
          aria-label={type === "prayer" ? "Prayer title" : "Title"}
          placeholder={type === "prayer" ? "Prayer title" : "Title"}
          className="input sm:col-span-2"
        />
        <textarea
          name="description"
          aria-label={type === "prayer" ? "Your prayer request" : "Description"}
          placeholder={type === "prayer" ? "Your prayer request…" : "Description"}
          rows={3}
          className="input sm:col-span-2"
        />

        {/* --- Dynamic fields per type --- */}
        {type === "event" && (
          <>
            <input name="event_date" type="date" aria-label="Event date" className="input" />
            <input name="event_time" aria-label="Event time" placeholder="Time (e.g. 7:00 PM)" className="input" />
            <input name="city" aria-label="City" placeholder="City" className="input" />
            <select name="state" aria-label="State" defaultValue="" className="input">
              <option value="">State</option>
              {US_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <input name="church_name" aria-label="Church name" placeholder="Church name" className="input" />
            <input name="speaker" aria-label="Speaker" placeholder="Speaker" className="input" />
            <select name="category" aria-label="Event category" defaultValue="" className="input sm:col-span-2">
              <option value="">Event category</option>
              {EVENT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </>
        )}

        {type === "sermon" && (
          <>
            <input name="speaker" aria-label="Speaker" placeholder="Speaker" className="input" />
            <select name="topic" aria-label="Topic" defaultValue="" className="input">
              <option value="">Topic</option>
              {PREACHING_TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input name="scripture_reference" aria-label="Scripture reference" placeholder="Scripture reference" className="input" />
            <select name="media_type" aria-label="Media type" defaultValue="" className="input">
              <option value="">Media type</option>
              <option>video</option>
              <option>audio</option>
            </select>
          </>
        )}

        {type === "podcast" && (
          <>
            <input name="episode_number" type="number" aria-label="Episode number" placeholder="Episode #" className="input" />
            <input name="guest" aria-label="Guest" placeholder="Guest" className="input" />
            <input name="duration" aria-label="Duration" placeholder="Duration (e.g. 52 min)" className="input sm:col-span-2" />
          </>
        )}

        {type === "music" && (
          <>
            <input name="artist" aria-label="Artist / group" placeholder="Artist / group" className="input" />
            <input name="release_type" aria-label="Release type" placeholder="Type (single, album, live…)" className="input" />
          </>
        )}

        {type === "material" && (
          <>
            <select name="category" aria-label="Material category" defaultValue="" className="input">
              <option value="">Material category</option>
              {MATERIAL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select name="file_type" aria-label="File type" defaultValue="" className="input">
              <option value="">File type</option>
              {FILE_TYPES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </>
        )}

        {type === "testimony" && (
          <input name="city" aria-label="City / State (optional)" placeholder="City / State (optional)" className="input sm:col-span-2" />
        )}

        {type === "news" && (
          <input name="news_source" aria-label="Where did this happen?" placeholder="Where did this happen?" className="input sm:col-span-2" />
        )}

        {type === "prayer" && (
          <select name="category" aria-label="Prayer category" defaultValue="" className="input sm:col-span-2">
            <option value="">Prayer category</option>
            {PRAYER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        )}

        {/* Source/link applies to most types */}
        {type !== "prayer" && type !== "testimony" && (
          <input name="source_url" aria-label="Link / source URL (optional)" placeholder="Link / source URL (optional)" className="input sm:col-span-2" />
        )}

        <div className="sm:col-span-2">
          <p className="mb-3 text-xs text-ink-muted">
            🔒 All submissions are reviewed by an admin before they appear publicly.
            Nothing is published automatically.
          </p>
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Submitting…" : "Submit for Review"}
          </Button>
          {status === "ok" && (
            <p className="mt-3 animate-pop rounded-xl border border-brand-bright/40 bg-brand/15 px-4 py-3 text-sm font-semibold text-brand-bright">
              ✅ Thank you! Your submission was received and is pending review.
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
