"use client";
// Admin email/password sign-in (Supabase Auth). Shown when a visitor hits
// /admin without an authorized session.
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FlameLogo } from "@/components/ui/FlameLogo";
import { getBrowserClient } from "@/lib/supabase/browser";

export function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const supabase = getBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Reload so the server layout re-checks the session.
    window.location.reload();
  }

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <Card hover={false} className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <FlameLogo size={40} />
          <h1 className="text-xl font-extrabold">Apostolic Power Network</h1>
          <p className="text-sm text-ink-muted">Sign in to manage content.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input name="email" type="email" required placeholder="Email" className="input" />
          <input name="password" type="password" required placeholder="Password" className="input" />
          {error && (
            <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-[#ff8a8a]">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-ink-muted">
          Admins are managed in the <code>admin_users</code> table and{" "}
          <code>ADMIN_EMAILS</code> env var.
        </p>
      </Card>
    </div>
  );
}

// Sign-out button used in the admin header.
export function SignOutButton() {
  async function signOut() {
    const supabase = getBrowserClient();
    await supabase?.auth.signOut();
    window.location.href = "/";
  }
  return (
    <button
      onClick={signOut}
      className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-muted hover:border-brand hover:text-ink"
    >
      Sign out
    </button>
  );
}
