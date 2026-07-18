import { type SuggestionInput, validateSuggestion } from "../../src/lib/suggestion";

const FORMSPREE_ENDPOINT =
  process.env.FORMSPREE_SUGGESTION_ENDPOINT ?? "https://formspree.io/f/mjgqjoek";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

async function verifyTurnstile(token: string, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const form = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("x-nf-client-connection-ip");
  if (ip) form.set("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export default async function suggest(request: Request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 12_000) {
    return json({ error: "Suggestion is too large." }, 413);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Send a valid form submission." }, 400);
  }

  const checked = validateSuggestion(input as SuggestionInput);
  if (!checked.ok) return json({ error: "Please correct the highlighted fields.", errors: checked.errors }, 400);

  // Silently accept bot-filled honeypots without forwarding their data.
  if (checked.value.hp_website) return json({ ok: true }, 201);

  if (!(await verifyTurnstile(checked.value.turnstileToken, request))) {
    return json({ error: "We could not verify that submission. Please try again." }, 400);
  }

  try {
    const forwarded = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: checked.value.name,
        email: checked.value.email,
        content_type: checked.value.content_type,
        source_url: checked.value.source_url,
        message: checked.value.message,
        form_type: "content_suggestion",
        source: "apn_hub",
      }),
    });

    if (!forwarded.ok) {
      return json({ error: "We could not send your suggestion. Please try again later." }, 502);
    }
  } catch {
    return json({ error: "We could not send your suggestion. Please try again later." }, 502);
  }

  return json({ ok: true }, 201);
}

// Netlify applies this at the edge before the function runs. It is intentionally
// separate from the static site and limits repeated form attempts by IP.
export const config = {
  path: "/api/suggest",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip"],
    windowSize: 3600,
    windowLimit: 5,
  },
};
