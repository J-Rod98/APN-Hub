// Admin area guard. Three states:
//   1. Supabase not configured  -> demo mode (read-only dashboard renders).
//   2. Configured, not signed in or not an admin -> login screen.
//   3. Authorized admin -> dashboard with a sign-out header.
import { checkAdmin } from "@/lib/supabase/auth-server";
import { AdminLogin, SignOutButton } from "@/components/admin/AdminLogin";
import { BrandMark } from "@/components/ui/FlameLogo";

export const metadata = { title: "Admin — Apostolic Power Network" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { configured, isAdmin, email } = await checkAdmin();

  // Configured but unauthorized -> show login.
  if (configured && !isAdmin) {
    return <AdminLogin />;
  }

  // Demo mode or authorized admin -> render the dashboard shell.
  return (
    <div>
      <div className="border-b border-line bg-navy-950/60">
        <div className="container-app flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size={26} />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Admin
            </span>
          </div>
          {configured && email ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-ink-muted sm:block">{email}</span>
              <SignOutButton />
            </div>
          ) : null}
        </div>
      </div>
      {children}
    </div>
  );
}
