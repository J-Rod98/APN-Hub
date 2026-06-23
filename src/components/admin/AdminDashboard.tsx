"use client";
// Admin dashboard: analytics cards, submission review queue, content management
// tables (publish/draft/delete), prayer moderation, and subscriber list.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { cn, formatDate } from "@/lib/utils";
import type {
  AppEvent,
  Material,
  PodcastEpisode,
  PreachingItem,
  PrayerRequest,
  Submission,
  NewsletterSubscriber,
  ContentStatus,
} from "@/lib/types";

interface Stats {
  events: number;
  prayers: number;
  materials: number;
  subscribers: number;
  pending: number;
  demo: boolean;
}

interface Props {
  stats: Stats;
  submissions: Submission[];
  events: AppEvent[];
  preaching: PreachingItem[];
  podcast: PodcastEpisode[];
  materials: Material[];
  prayers: PrayerRequest[];
  subscribers: NewsletterSubscriber[];
  demo: boolean;
}

type Tab = "overview" | "submissions" | "events" | "preaching" | "podcast" | "materials" | "prayers" | "subscribers";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "submissions", label: "Submissions" },
  { id: "events", label: "Events" },
  { id: "preaching", label: "Preaching" },
  { id: "podcast", label: "Podcast" },
  { id: "materials", label: "Materials" },
  { id: "prayers", label: "Prayers" },
  { id: "subscribers", label: "Subscribers" },
];

export function AdminDashboard(props: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  // --- API helpers ---------------------------------------------------------
  async function actSubmission(id: string, status: ContentStatus) {
    setBusy(id);
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  async function setContentStatus(table: string, id: string, status: ContentStatus) {
    setBusy(id);
    await fetch(`/api/admin/content/${table}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  async function deleteContent(table: string, id: string) {
    if (!confirm("Delete this item permanently?")) return;
    setBusy(id);
    await fetch(`/api/admin/content/${table}/${id}`, { method: "DELETE" });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="container-app py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
      </div>

      {props.demo && (
        <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          ⚠️ <b>Demo mode</b> — Supabase isn&apos;t configured, so actions won&apos;t
          persist. Add your env vars to enable real content management.
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              tab === t.id
                ? "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
                : "border-line bg-navy-850 text-ink-muted hover:border-brand hover:text-ink",
            )}
          >
            {t.label}
            {t.id === "submissions" && props.stats.pending > 0 && (
              <span className="ml-2 rounded-full bg-black/25 px-2 py-0.5 text-xs">
                {props.stats.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {tab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total Events" value={props.stats.events} icon="📅" />
          <StatCard label="Prayer Requests" value={props.stats.prayers} icon="🙏" />
          <StatCard label="Materials" value={props.stats.materials} icon="📄" />
          <StatCard label="Subscribers" value={props.stats.subscribers} icon="✉️" />
          <StatCard label="Pending" value={props.stats.pending} icon="⏳" highlight />
        </div>
      )}

      {/* Submission review queue ---------------------------------------- */}
      {tab === "submissions" && (
        <div className="flex flex-col gap-3">
          {props.submissions.length === 0 ? (
            <EmptyState icon="📥" title="No submissions yet" />
          ) : (
            props.submissions.map((s) => (
              <Card key={s.id} hover={false} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-md border border-line bg-brand/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-brand-bright">
                        {s.submission_type}
                      </span>
                      <StatusBadge status={s.status} />
                    </div>
                    <h3 className="font-bold">{s.title ?? "(no title)"}</h3>
                    {s.description && (
                      <p className="mt-1 text-sm text-ink-muted">{s.description}</p>
                    )}
                    <p className="mt-1 text-xs text-ink-muted">
                      From {s.submitter_name ?? "Anonymous"}
                      {s.submitter_email ? ` · ${s.submitter_email}` : ""} ·{" "}
                      {formatDate(s.created_at.slice(0, 10))}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <ActionBtn label="Approve" onClick={() => actSubmission(s.id, "approved")} busy={busy === s.id} />
                    <ActionBtn label="Publish" variant="primary" onClick={() => actSubmission(s.id, "published")} busy={busy === s.id} />
                    <ActionBtn label="Reject" variant="danger" onClick={() => actSubmission(s.id, "rejected")} busy={busy === s.id} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Content tables ------------------------------------------------- */}
      {tab === "events" && (
        <ContentTable rows={props.events.map((e) => ({ id: e.id, title: e.title, meta: `${e.city ?? ""} ${e.state ?? ""} · ${e.category ?? ""}`, status: e.status }))} table="events" onStatus={setContentStatus} onDelete={deleteContent} busy={busy} />
      )}
      {tab === "preaching" && (
        <ContentTable rows={props.preaching.map((p) => ({ id: p.id, title: p.title, meta: `${p.speaker ?? ""} · ${p.topic ?? ""}`, status: p.status }))} table="preaching_items" onStatus={setContentStatus} onDelete={deleteContent} busy={busy} />
      )}
      {tab === "podcast" && (
        <ContentTable rows={props.podcast.map((p) => ({ id: p.id, title: `EP ${p.episode_number ?? "—"} · ${p.title}`, meta: p.guest ?? "", status: p.status }))} table="podcast_episodes" onStatus={setContentStatus} onDelete={deleteContent} busy={busy} />
      )}
      {tab === "materials" && (
        <ContentTable rows={props.materials.map((m) => ({ id: m.id, title: m.title, meta: `${m.category ?? ""} · ${m.file_type ?? ""}`, status: m.status }))} table="materials" onStatus={setContentStatus} onDelete={deleteContent} busy={busy} />
      )}
      {tab === "prayers" && (
        <ContentTable rows={props.prayers.map((p) => ({ id: p.id, title: p.title ?? p.request_text.slice(0, 40), meta: `${p.category ?? ""} · 🙏 ${p.prayer_count}`, status: p.status }))} table="prayer_requests" onStatus={setContentStatus} onDelete={deleteContent} busy={busy} approveLabel="approved" />
      )}

      {/* Subscribers --------------------------------------------------- */}
      {tab === "subscribers" && (
        <Card hover={false} className="overflow-hidden">
          {props.subscribers.length === 0 ? (
            <EmptyState icon="✉️" title="No subscribers yet" />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-ink-muted">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {props.subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-line/60">
                    <td className="p-4">{s.email}</td>
                    <td className="p-4 text-ink-muted">{s.phone ?? "—"}</td>
                    <td className="p-4 text-ink-muted">{s.state ?? "—"}</td>
                    <td className="p-4 text-ink-muted">{formatDate(s.created_at.slice(0, 10))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  );
}

// --- Small building blocks --------------------------------------------------
function StatCard({ label, value, icon, highlight }: { label: string; value: number; icon: string; highlight?: boolean }) {
  return (
    <Card hover={false} className={cn("p-5", highlight && "border-gold/30")}>
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm text-ink-muted">{label}</div>
    </Card>
  );
}

function ActionBtn({ label, onClick, busy, variant = "ghost" }: { label: string; onClick: () => void; busy?: boolean; variant?: "ghost" | "primary" | "danger" }) {
  const styles = {
    ghost: "border-line text-ink-muted hover:border-brand hover:text-ink",
    primary: "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white",
    danger: "border-danger/40 text-[#ff8a8a] hover:bg-danger/10",
  }[variant];
  return (
    <button onClick={onClick} disabled={busy} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold transition disabled:opacity-50", styles)}>
      {label}
    </button>
  );
}

interface Row { id: string; title: string; meta: string; status: ContentStatus }
function ContentTable({
  rows,
  table,
  onStatus,
  onDelete,
  busy,
  approveLabel = "published",
}: {
  rows: Row[];
  table: string;
  onStatus: (table: string, id: string, status: ContentStatus) => void;
  onDelete: (table: string, id: string) => void;
  busy: string | null;
  approveLabel?: ContentStatus;
}) {
  if (rows.length === 0) return <EmptyState icon="🗂️" title="Nothing here yet" />;
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <Card key={r.id} hover={false} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{r.title}</span>
              <StatusBadge status={r.status} />
            </div>
            <div className="text-xs text-ink-muted">{r.meta}</div>
          </div>
          <div className="flex shrink-0 gap-2">
            {r.status !== approveLabel && (
              <ActionBtn label={approveLabel === "approved" ? "Approve" : "Publish"} variant="primary" onClick={() => onStatus(table, r.id, approveLabel)} busy={busy === r.id} />
            )}
            {r.status === "published" || r.status === "approved" ? (
              <ActionBtn label="Unpublish" onClick={() => onStatus(table, r.id, "draft")} busy={busy === r.id} />
            ) : null}
            <ActionBtn label="Delete" variant="danger" onClick={() => onDelete(table, r.id)} busy={busy === r.id} />
          </div>
        </Card>
      ))}
    </div>
  );
}
