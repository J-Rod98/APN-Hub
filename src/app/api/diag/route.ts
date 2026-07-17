// TEMPORARY diagnostic for the deploy preview — remove before merge.
// Reports config presence as booleans and the raw Supabase error. Never returns
// key material.
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const db = getServerClient();
  let query: unknown = "client is null";
  if (db) {
    const { data, error } = await db
      .from("events")
      .select("title")
      .eq("status", "published")
      .limit(2);
    query = error
      ? { ok: false, message: error.message, code: error.code, details: error.details, hint: error.hint }
      : { ok: true, rows: data?.length ?? 0 };
  }

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    context: process.env.CONTEXT ?? null, // Netlify deploy context
    hasUrl: Boolean(url),
    hasAnonKey: Boolean(anon),
    hasServiceKey: Boolean(service),
    urlHostPrefix: url.replace(/^https?:\/\//, "").slice(0, 10),
    anonKeyPrefix: anon.slice(0, 14), // e.g. "sb_publishable" — not the secret part
    dbClient: Boolean(db),
    query,
  });
}
