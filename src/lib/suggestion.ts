// Shared, browser-safe validation for APN content suggestions. The Netlify
// function repeats this validation before forwarding anything to Formspree.

export const SUGGESTION_TYPES = [
  "sermon",
  "podcast",
  "event",
  "resource",
  "other",
] as const;

export type SuggestionType = (typeof SUGGESTION_TYPES)[number];

export type SuggestionInput = {
  name: unknown;
  email: unknown;
  content_type: unknown;
  source_url: unknown;
  message: unknown;
  hp_website?: unknown;
  turnstileToken?: unknown;
};

export type SuggestionPayload = {
  name: string;
  email: string;
  content_type: SuggestionType;
  source_url: string;
  message: string;
  hp_website: string;
  turnstileToken: string;
};

export type SuggestionErrors = Partial<Record<keyof SuggestionPayload, string>>;

const LIMITS = {
  name: 120,
  email: 254,
  source_url: 2048,
  message: 2000,
  hp_website: 200,
  turnstileToken: 4096,
} as const;

function valueOf(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateSuggestion(input: SuggestionInput):
  | { ok: true; value: SuggestionPayload }
  | { ok: false; errors: SuggestionErrors } {
  const value: SuggestionPayload = {
    name: valueOf(input.name, LIMITS.name),
    email: valueOf(input.email, LIMITS.email).toLowerCase(),
    content_type: valueOf(input.content_type, 30) as SuggestionType,
    source_url: valueOf(input.source_url, LIMITS.source_url),
    message: valueOf(input.message, LIMITS.message),
    hp_website: valueOf(input.hp_website, LIMITS.hp_website),
    turnstileToken: valueOf(input.turnstileToken, LIMITS.turnstileToken),
  };
  const errors: SuggestionErrors = {};

  if (value.name.length < 2) errors.name = "Enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!(SUGGESTION_TYPES as readonly string[]).includes(value.content_type)) {
    errors.content_type = "Choose the type of content you are suggesting.";
  }
  if (!isHttpUrl(value.source_url)) {
    errors.source_url = "Enter a valid http or https link.";
  }
  if (value.message.length < 10) {
    errors.message = "Tell us a little more (at least 10 characters).";
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, value };
}

