// ============================================================================
// Supabase configuration helpers
// ----------------------------------------------------------------------------
// APN Hub runs with OR without Supabase. These helpers let the data layer
// detect whether real credentials are present and decide between live queries
// and the built-in seed-data fallback.
// ============================================================================

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when public (read) Supabase credentials are configured. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** True when the server has the service-role key (needed for admin writes). */
export const hasServiceRole = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

/** Admin emails allowed into /admin (comma-separated env var). */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
