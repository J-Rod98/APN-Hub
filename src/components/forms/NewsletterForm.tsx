"use client";

import { ValidationError, useForm } from "@formspree/react";
import { FORMSPREE_FORM_ID } from "@/lib/formspree";

export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID, {
    data: {
      form_type: "newsletter_signup",
      source: "apn_hub",
    },
  });

  if (state.succeeded) {
    return (
      <p className={variant === "light" ? "text-[15px] font-semibold text-white" : "font-semibold text-ink"}>
        You&apos;re on the list. Watch for APN&apos;s first Friday update.
      </p>
    );
  }

  const inputClass =
    variant === "light"
      ? "min-w-0 flex-1 rounded-[14px] border-0 bg-white px-4 py-4 text-[15px] text-sanctuary-ink outline-none placeholder:text-sanctuary-soft focus:ring-2 focus:ring-white/70"
      : "min-w-0 flex-1 rounded-full border border-line bg-navy-950 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-brand-bright";
  const buttonClass =
    variant === "light"
      ? "rounded-[14px] bg-sanctuary-ink px-6 py-4 text-[15px] font-bold text-white transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-70"
      : "rounded-full bg-brand px-5 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[540px] flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email address"
          className={inputClass}
        />
        <button type="submit" disabled={state.submitting} className={buttonClass}>
          {state.submitting ? "Joining…" : "Get Friday updates"}
        </button>
      </div>
      <ValidationError
        field="email"
        prefix="Email"
        errors={state.errors}
        className={variant === "light" ? "text-sm font-semibold text-white" : "text-sm font-semibold text-red-300"}
      />
      <ValidationError
        errors={state.errors}
        className={variant === "light" ? "text-sm font-semibold text-white" : "text-sm font-semibold text-red-300"}
      />
      <p className={variant === "light" ? "text-[13px] text-white/85" : "text-xs text-ink-muted"}>
        Occasional Friday updates. No spam.
      </p>
    </form>
  );
}
