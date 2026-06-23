// POST /api/newsletter — add a newsletter subscriber.
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email as string | undefined)?.trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const db = getServerClient();
  if (!db) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await db.from("newsletter_subscribers").insert({
    email,
    phone: body.phone ?? null,
    state: body.state ?? null,
  });

  // Ignore duplicate-email unique violations — treat as already subscribed.
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
