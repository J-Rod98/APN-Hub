// Admin: update a submission's status (approve / reject / publish) and,
// when published, promote it into the matching content table so it goes live.
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/supabase/auth-server";
import { getAdminClient } from "@/lib/supabase/server";
import type { ContentStatus, Submission } from "@/lib/types";

// Map a submission's content_data into a row for its destination table.
function toContentRow(s: Submission): { table: string; row: Record<string, unknown> } | null {
  const d = s.content_data ?? {};
  const base = { status: "published" as ContentStatus };
  switch (s.submission_type) {
    case "event":
      return { table: "events", row: { ...base, title: s.title, description: s.description, source_url: s.source_url, contact_email: s.submitter_email, event_date: d.event_date ?? null, event_time: d.event_time ?? null, city: d.city ?? null, state: d.state ?? null, church_name: d.church_name ?? null, speaker: d.speaker ?? null, category: d.category ?? null } };
    case "sermon":
      return { table: "preaching_items", row: { ...base, title: s.title, description: s.description, media_url: s.source_url, speaker: d.speaker ?? null, topic: d.topic ?? null, scripture_reference: d.scripture_reference ?? null, media_type: d.media_type ?? null } };
    case "podcast":
      return { table: "podcast_episodes", row: { ...base, title: s.title, description: s.description, media_url: s.source_url, episode_number: d.episode_number ? Number(d.episode_number) : null, guest: d.guest ?? null, duration: d.duration ?? null } };
    case "material":
      return { table: "materials", row: { ...base, title: s.title, description: s.description, file_url: s.source_url, category: d.category ?? null, file_type: d.file_type ?? null, is_premium: false } };
    case "prayer":
      return { table: "prayer_requests", row: { status: "approved", title: s.title, request_text: s.description ?? "", name: s.submitter_name, category: d.category ?? null, is_public: true } };
    default:
      // testimony / music / news have no dedicated public table in Phase 1.
      return null;
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { configured, isAdmin } = await checkAdmin();
  if (configured && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) return NextResponse.json({ ok: true, demo: true });

  const body = await req.json().catch(() => ({}));
  const status = body.status as ContentStatus | undefined;
  if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

  // Update the submission record.
  const { data: updated, error } = await db
    .from("submissions")
    .update({ status, admin_notes: body.admin_notes ?? null })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // When published, promote into the live content table (best effort).
  if (status === "published" && updated) {
    const mapped = toContentRow(updated as Submission);
    if (mapped) {
      await db.from(mapped.table).insert(mapped.row);
    }
  }

  return NextResponse.json({ ok: true });
}
