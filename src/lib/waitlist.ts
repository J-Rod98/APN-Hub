// Shared validation for the APN launch-list form. It intentionally accepts
// only an email address; no name or other profile data is collected here.

export type WaitlistInput = {
  email: unknown;
  hp_website?: unknown;
};

export type WaitlistPayload = {
  email: string;
  hp_website: string;
};

export type WaitlistErrors = Partial<Record<keyof WaitlistPayload, string>>;

const EMAIL_MAX_LENGTH = 254;

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateWaitlist(input: WaitlistInput):
  | { ok: true; value: WaitlistPayload }
  | { ok: false; errors: WaitlistErrors } {
  const value: WaitlistPayload = {
    email: text(input.email, EMAIL_MAX_LENGTH).toLowerCase(),
    hp_website: text(input.hp_website, 200),
  };
  const errors: WaitlistErrors = {};

  if (!isEmail(value.email)) {
    errors.email = "Enter a valid email address.";
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
