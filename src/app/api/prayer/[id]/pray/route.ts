// POST /api/prayer/[id]/pray — atomically increment a prayer's count.
import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const db = getAdminClient();

  // Demo mode: no service role configured — report success without persisting.
  if (!db) {
    return NextResponse.json({ ok: true, demo: true });
  }

  // Uses the SQL function increment_prayer_count() defined in the migration.
  const { data, error } = await db.rpc("increment_prayer_count", {
    p_id: params.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, prayer_count: data });
}
