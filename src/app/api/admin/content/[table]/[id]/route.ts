// Admin: change status (publish/draft/etc.) or delete a content row.
// `table` is whitelisted to prevent arbitrary table access.
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/supabase/auth-server";
import { getAdminClient } from "@/lib/supabase/server";

const ALLOWED = new Set([
  "events",
  "preaching_items",
  "podcast_episodes",
  "materials",
  "prayer_requests",
]);

async function guard(table: string) {
  if (!ALLOWED.has(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }
  const { configured, isAdmin } = await checkAdmin();
  if (configured && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { table: string; id: string } },
) {
  const blocked = await guard(params.table);
  if (blocked) return blocked;

  const db = getAdminClient();
  if (!db) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({}));
  const { error } = await db
    .from(params.table)
    .update({ status: body.status })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { table: string; id: string } },
) {
  const blocked = await guard(params.table);
  if (blocked) return blocked;

  const db = getAdminClient();
  if (!db) return NextResponse.json({ ok: true, demo: true });

  const { error } = await db.from(params.table).delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
