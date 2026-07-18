"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { type WaitlistErrors, validateWaitlist } from "@/lib/waitlist";

const RECAPTCHA_SCRIPT_ID = "apn-mailerlite-recaptcha";
const RECAPTCHA_SITE_KEY = "6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [formError, setFormError] = useState("");
  const [state, setState] = useState<"idle" | "joining" | "success" | "error">("idle");
  const captchaContainer = useRef<HTMLDivElement>(null);
  const captchaToken = useRef("");
  const captchaWidget = useRef<number | null>(null);

  const isLight = variant === "light";

  useEffect(() => {
    let active = true;

    const renderCaptcha = () => {
      if (!active || !window.grecaptcha || !captchaContainer.current || captchaWidget.current !== null) return;

      captchaWidget.current = window.grecaptcha.render(captchaContainer.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token) => {
          captchaToken.current = token;
          setFormError("");
        },
        "expired-callback": () => {
          captchaToken.current = "";
        },
        "error-callback": () => {
          captchaToken.current = "";
          setFormError("We couldn’t add you right now. Please try again shortly.");
          setState("error");
        },
      });
    };

    const existing = document.getElementById(RECAPTCHA_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.grecaptcha) renderCaptcha();
      else existing.addEventListener("load", renderCaptcha, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderCaptcha, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const checked = validateWaitlist({
      email,
      hp_website: form.get("hp_website"),
    });

    if (!checked.ok) {
      setErrors(checked.errors);
      setFormError("");
      setState("error");
      return;
    }

    if (!captchaToken.current) {
      setErrors({});
      setFormError("Please complete the anti-spam check to join the launch list.");
      setState("error");
      return;
    }

    setErrors({});
    setFormError("");
    setState("joining");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: checked.value.email,
          hp_website: checked.value.hp_website,
          captchaToken: captchaToken.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
        errors?: WaitlistErrors;
      };

      if (!response.ok) {
        setErrors(result.errors ?? {});
        setFormError(result.error ?? "We couldn’t add you right now. Please try again shortly.");
        setState("error");
        captchaToken.current = "";
        if (captchaWidget.current !== null) window.grecaptcha?.reset(captchaWidget.current);
        return;
      }

      setState("success");
    } catch {
      setFormError("We couldn’t add you right now. Please try again shortly.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p role="status" className={isLight ? "text-[15px] font-semibold text-white" : "font-semibold text-ink"}>
        Check your inbox to confirm your place on the APN launch list.
      </p>
    );
  }

  const inputClass =
    isLight
      ? "min-w-0 flex-1 rounded-[14px] border-0 bg-white px-4 py-4 text-[15px] text-sanctuary-ink outline-none placeholder:text-sanctuary-soft focus:ring-2 focus:ring-white/70"
      : "min-w-0 flex-1 rounded-full border border-sanctuary-line bg-white px-4 py-3 text-sm text-sanctuary-ink outline-none placeholder:text-sanctuary-soft focus:border-brand";
  const buttonClass =
    isLight
      ? "rounded-[14px] bg-sanctuary-ink px-6 py-4 text-[15px] font-bold text-white transition hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-70"
      : "rounded-full bg-brand px-5 py-3 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <form onSubmit={handleSubmit} className="relative flex max-w-[540px] flex-col gap-3" noValidate>
      <HoneypotField />
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
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          placeholder="Email address"
          className={inputClass}
        />
        <button type="submit" disabled={state === "joining"} className={buttonClass}>
          {state === "joining" ? "Joining…" : "Join the launch list"}
        </button>
      </div>
      <div ref={captchaContainer} className="min-h-[78px]" />
      {errors.email && (
        <p id="newsletter-email-error" role="alert" className={isLight ? "text-sm font-semibold text-white" : "text-sm font-semibold text-red-700"}>
          {errors.email}
        </p>
      )}
      {formError && (
        <p role="alert" className={isLight ? "text-sm font-semibold text-white" : "text-sm font-semibold text-red-700"}>
          {formError}
        </p>
      )}
      <p className={isLight ? "text-[13px] leading-relaxed text-white/85" : "text-xs leading-relaxed text-sanctuary-muted"}>
        One launch email, then occasional curated updates. Unsubscribe anytime. {" "}
        <Link href="/privacy/" className="font-semibold underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
