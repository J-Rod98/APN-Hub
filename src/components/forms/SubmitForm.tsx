"use client";

import { ValidationError, useForm } from "@formspree/react";
import { Card } from "@/components/ui/Card";
import { FORMSPREE_FORM_ID } from "@/lib/formspree";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-sanctuary-line bg-white px-4 py-3 text-sanctuary-ink outline-none placeholder:text-sanctuary-soft focus:border-brand";

export function SubmitForm() {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID, {
    data: {
      form_type: "content_suggestion",
      source: "apn_hub",
    },
  });

  if (state.succeeded) {
    return (
      <Card hover={false} className="max-w-2xl p-6 sm:p-8">
        <h2 className="font-serif text-2xl text-ink">Thank you for the suggestion.</h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          APN will review the original source before deciding whether to include it in the collection.
        </p>
      </Card>
    );
  }

  return (
    <Card hover={false} className="max-w-2xl p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-ink">Suggest content for APN</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Share the original link and a short note about why it would serve the Apostolic community.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="suggestion-name" className="text-sm font-bold text-ink">
              Your name
            </label>
            <input
              id="suggestion-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={fieldClass}
            />
            <ValidationError field="name" errors={state.errors} className="mt-1 text-sm text-red-300" />
          </div>

          <div>
            <label htmlFor="suggestion-email" className="text-sm font-bold text-ink">
              Email address
            </label>
            <input
              id="suggestion-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
            />
            <ValidationError field="email" errors={state.errors} className="mt-1 text-sm text-red-300" />
          </div>
        </div>

        <div>
          <label htmlFor="suggestion-type" className="text-sm font-bold text-ink">
            What are you suggesting?
          </label>
          <select id="suggestion-type" name="content_type" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Choose one
            </option>
            <option value="sermon">Sermon or teaching</option>
            <option value="podcast">Podcast episode</option>
            <option value="event">Event or conference</option>
            <option value="resource">Resource or study material</option>
            <option value="other">Something else</option>
          </select>
          <ValidationError field="content_type" errors={state.errors} className="mt-1 text-sm text-red-300" />
        </div>

        <div>
          <label htmlFor="suggestion-source" className="text-sm font-bold text-ink">
            Original link
          </label>
          <input
            id="suggestion-source"
            name="source_url"
            type="url"
            inputMode="url"
            required
            placeholder="https://"
            className={fieldClass}
          />
          <ValidationError field="source_url" errors={state.errors} className="mt-1 text-sm text-red-300" />
        </div>

        <div>
          <label htmlFor="suggestion-message" className="text-sm font-bold text-ink">
            Why should APN feature it?
          </label>
          <textarea
            id="suggestion-message"
            name="message"
            rows={5}
            required
            className={fieldClass}
          />
          <ValidationError field="message" errors={state.errors} className="mt-1 text-sm text-red-300" />
        </div>

        <ValidationError errors={state.errors} className="text-sm font-semibold text-red-300" />

        <button
          type="submit"
          disabled={state.submitting}
          className="inline-flex w-fit rounded-full bg-gradient-to-br from-brand to-brand-deep px-5 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.submitting ? "Sending…" : "Send Suggestion"}
        </button>
      </form>
    </Card>
  );
}
