// ============================================================================
// Supabase server clients
// ----------------------------------------------------------------------------
// `getServerClient()`  — anon key, respects RLS. For reading published content.
// `getAdminClient()`   — service role key, bypasses RLS. SERVER ONLY. Used by
//                        API routes and the admin dashboard to write/approve.
// Both return null when Supabase isn't configured, so callers can fall back to
// seed data.
// ============================================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  isSupabaseConfigured,
  hasServiceRole,
} from "./config";

let _server: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getServerClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_server) {
    _server = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return _server;
}

export function getAdminClient(): SupabaseClient | null {
  if (!hasServiceRole) return null;
  if (!_admin) {
    _admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}
