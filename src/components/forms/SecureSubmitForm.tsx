"use client";

import { FormEvent, useState } from "react";
import { Card } from "@/components/ui/Card";
import { HoneypotField } from "@/components/ui/HoneypotField";
import {
  type SuggestionErrors,
  type SuggestionInput,
  validateSuggestion,
} from "@/lib/suggestion";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-sanctuary-line bg-white px-4 py-3 text-sanctuary-ink outline-none placeholder:text-sanctuary-soft focus:border-brand";

// Netlify Forms: submissions are posted (url-encoded) to the site root with a
// `form-name` matching the detection form in public/__forms.html.
const NETLIFY_FORM_NAME = "apn-suggestions";

function encodeForm(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

type FormStatus =
  | { kind: "idle" }
  | { kind: "pending"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function SecureSubmitForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const [errors, setErrors] = useState<SuggestionErrors>({});

  if (status.kind === "success") {
    return (
      <Card hover={false} className="max-w-2xl p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-ink">Thank you for the suggestion.</h2>
        <p className="mt-3 leading-relaxed text-ink-muted" role="status">
          {status.message}
        </p>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: SuggestionInput = {
      name: form.get("name"),
      email: form.get("email"),
      content_type: form.get("content_type"),
      source_url: form.get("source_url"),
      message: form.get("message"),
      hp_website: form.get("hp_website"),
    };
    const checked = validateSuggestion(input);
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus({ kind: "error", message: "Please correct the highlighted fields and try again." });
      return;
    }

    // A filled honeypot means a bot: show a benign success and send nothing.
    if (checked.value.hp_website) {
      setErrors({});
      setStatus({
        kind: "success",
        message: "APN will review the original source before deciding whether to include it in the collection.",
      });
      return;
    }

    setErrors({});
    setStatus({ kind: "pending", message: "Sending your suggestion…" });
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm({
          "form-name": NETLIFY_FORM_NAME,
          name: checked.value.name,
          email: checked.value.email,
          content_type: checked.value.content_type,
          source_url: checked.value.source_url,
          message: checked.value.message,
          hp_website: "",
        }),
      });
      if (!response.ok) {
        setStatus({ kind: "error", message: "We could not send your suggestion. Please try again." });
        return;
      }
      setStatus({
        kind: "success",
        message: "APN will review the original source before deciding whether to include it in the collection.",
      });
    } catch {
      setStatus({ kind: "error", message: "We could not send your suggestion. Please try again." });
    }
  }

  return (
    <Card hover={false} className="max-w-2xl p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-ink">Suggest content for APN</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Share the original link and a short note about why it would serve the Apostolic community.
      </p>

      <form
        name="apn-suggestions"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="hp_website"
        onSubmit={handleSubmit}
        className="mt-7 grid gap-5"
        noValidate
      >
        <input type="hidden" name="form-name" value="apn-suggestions" />
        <HoneypotField />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" id="suggestion-name" error={errors.name}>
            <input
              id="suggestion-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "suggestion-name-error" : undefined}
              className={fieldClass}
            />
          </Field>
          <Field label="Email address" id="suggestion-email" error={errors.email}>
            <input
              id="suggestion-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "suggestion-email-error" : undefined}
              className={fieldClass}
            />
          </Field>
        </div>

        <Field label="What are you suggesting?" id="suggestion-type" error={errors.content_type}>
          <select
            id="suggestion-type"
            name="content_type"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.content_type)}
            aria-describedby={errors.content_type ? "suggestion-type-error" : undefined}
            className={fieldClass}
          >
            <option value="" disabled>Choose one</option>
            <option value="sermon">Sermon or teaching</option>
            <option value="podcast">Podcast episode</option>
            <option value="event">Event or conference</option>
            <option value="resource">Resource or study material</option>
            <option value="other">Something else</option>
          </select>
        </Field>

        <Field label="Original link" id="suggestion-source" error={errors.source_url}>
          <input
            id="suggestion-source"
            name="source_url"
            type="url"
            inputMode="url"
            required
            maxLength={2048}
            placeholder="https://"
            aria-invalid={Boolean(errors.source_url)}
            aria-describedby={errors.source_url ? "suggestion-source-error" : undefined}
            className={fieldClass}
          />
        </Field>

        <Field label="Why should APN feature it?" id="suggestion-message" error={errors.message}>
          <textarea
            id="suggestion-message"
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={2000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "suggestion-message-error" : undefined}
            className={fieldClass}
          />
        </Field>

        {status.kind === "error" && <p role="alert" className="text-sm font-semibold text-red-700">{status.message}</p>}
        {status.kind === "pending" && <p role="status" className="text-sm font-semibold text-sanctuary-ink">{status.message}</p>}

        <button
          type="submit"
          disabled={status.kind === "pending"}
          className="inline-flex min-h-11 w-fit rounded-full bg-gradient-to-br from-brand to-brand-deep px-5 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status.kind === "pending" ? "Sending…" : "Send Suggestion"}
        </button>
      </form>
    </Card>
  );
}

function Field({ label, id, error, children }: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-ink">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
