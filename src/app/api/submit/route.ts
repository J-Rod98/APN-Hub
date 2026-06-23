// POST /api/submit — central content submission intake (always 'pending').
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

const VALID_TYPES = [
  "event", "sermon", "podcast", "music", "material", "testimony", "news", "prayer",
];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.submission_type || !VALID_TYPES.includes(body.submission_type as string)) {
    return NextResponse.json({ error: "Invalid submission_type" }, { status: 400 });
  }

  const db = getServerClient();
  if (!db) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await db.from("submissions").insert({
    submission_type: body.submission_type,
    submitter_name: body.submitter_name ?? null,
    submitter_email: body.submitter_email ?? null,
    title: body.title ?? null,
    description: body.description ?? null,
    content_data: body.content_data ?? {},
    source_url: body.source_url ?? null,
    status: "pending", // admin must approve/publish
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
