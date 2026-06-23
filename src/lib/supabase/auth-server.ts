// Server-side auth helpers (read the logged-in user from cookies in RSC/route
// handlers) and an admin guard used by the admin area + admin APIs.
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  ADMIN_EMAILS,
  isSupabaseConfigured,
} from "./config";

/** Supabase client bound to the request cookies (for Server Components / routes). */
export function getSupabaseRSC() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(toSet: { name: string; value: string; options: CookieOptions }[]) {
        // In Server Components cookie writes throw — middleware handles refresh,
        // so we swallow the error here.
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options }),
          );
        } catch {
          /* no-op in RSC */
        }
      },
    },
  });
}

export interface AdminCheck {
  /** Supabase configured at all? When false, the app runs in demo mode. */
  configured: boolean;
  /** Is the current visitor an authorized admin? */
  isAdmin: boolean;
  email: string | null;
}

/** Determine whether the current request is from an authorized admin. */
export async function checkAdmin(): Promise<AdminCheck> {
  if (!isSupabaseConfigured) {
    // Demo mode: no auth wired up, dashboard is shown read-only.
    return { configured: false, isAdmin: false, email: null };
  }
  const supabase = getSupabaseRSC();
  if (!supabase) return { configured: false, isAdmin: false, email: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase() ?? null;
  const isAdmin = Boolean(email && ADMIN_EMAILS.includes(email));
  return { configured: true, isAdmin, email };
}
