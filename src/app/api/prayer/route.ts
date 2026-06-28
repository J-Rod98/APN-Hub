// POST /api/prayer — create a public prayer request (always 'pending').
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a real user never fills hp_website. Pretend success, drop silently.
  if (body.hp_website) {
    return NextResponse.json({ ok: true });
  }

  if (!body.request_text) {
    return NextResponse.json({ error: "request_text is required" }, { status: 400 });
  }
  // Basic length guard against abusive payloads.
  if (String(body.request_text).length > 5000) {
    return NextResponse.json({ error: "request_text too long" }, { status: 400 });
  }

  const db = getServerClient();
  // Demo mode: no database configured — pretend success so the UI flows work.
  if (!db) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await db.from("prayer_requests").insert({
    name: body.name ?? null,
    title: body.title ?? null,
    request_text: body.request_text,
    category: body.category ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    is_public: body.is_public ?? true,
    status: "pending", // never auto-publish
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
