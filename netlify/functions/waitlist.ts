import { type WaitlistInput, validateWaitlist } from "../../src/lib/waitlist";

const MAILERLITE_SUBSCRIBE_ENDPOINT =
  "https://assets.mailerlite.com/jsonp/2516901/forms/193299909718312429/subscribe";
const DOUBLE_OPT_IN_ENABLED = process.env.MAILERLITE_DOUBLE_OPT_IN_ENABLED === "true";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

export default async function waitlist(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 4_000) {
    return json({ error: "We couldn’t add you right now. Please try again shortly." }, 413);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ error: "We couldn’t add you right now. Please try again shortly." }, 400);
  }

  const values = input && typeof input === "object"
    ? input as WaitlistInput & { captchaToken?: unknown }
    : {} as WaitlistInput & { captchaToken?: unknown };
  const checked = validateWaitlist(values);
  if (!checked.ok) {
    return json({ error: "Enter a valid email address.", errors: checked.errors }, 400);
  }

  // Silently accept bot-filled honeypots without passing their data to any provider.
  if (checked.value.hp_website) return json({ ok: true }, 201);

  const captchaToken = typeof values.captchaToken === "string"
    ? values.captchaToken.trim().slice(0, 4096)
    : "";
  if (!captchaToken) {
    return json({ error: "Please complete the anti-spam check to join the launch list." }, 400);
  }

  // MailerLite's form must have double opt-in enabled before this forwarding
  // gate is opened. This prevents a misleading confirmation promise.
  if (!DOUBLE_OPT_IN_ENABLED) {
    return json({ error: "We couldn’t add you right now. Please try again shortly." }, 503);
  }

  try {
    const payload = new URLSearchParams({
      "fields[email]": checked.value.email,
      "g-recaptcha-response": captchaToken,
      "ml-submit": "1",
      anticsrf: "true",
    });
    const forwarded = await fetch(MAILERLITE_SUBSCRIBE_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json, text/html",
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: payload.toString(),
    });

    if (!forwarded.ok) {
      return json({ error: "We couldn’t add you right now. Please try again shortly." }, 502);
    }
  } catch {
    return json({ error: "We couldn’t add you right now. Please try again shortly." }, 502);
  }

  return json({ ok: true }, 201);
}

// Limits repeat attempts before the function runs. The provider remains the
// authority for confirmation, duplicate handling, and unsubscribe behavior.
export const config = {
  path: "/api/waitlist",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip"],
    windowSize: 3600,
    windowLimit: 5,
  },
};
