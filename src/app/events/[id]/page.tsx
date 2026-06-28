// Event detail page.
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getEventById } from "@/lib/data";
import { dateBadge, formatDate, safeUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);
  return { title: event ? `${event.title} — Apostolic Power Network` : "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);
  if (!event) notFound();

  const badge = dateBadge(event.event_date);

  return (
    <div className="container-app py-10">
      <Link href="/events" className="mb-6 inline-block text-sm font-semibold text-ink-muted hover:text-ink">
        ← Back to Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          {/* banner */}
          <div className="relative mb-6 flex h-44 items-end rounded-xl2 border border-line bg-gradient-to-br from-brand-deep to-navy-950 p-5">
            <div className="absolute left-5 top-5 rounded-xl border border-line bg-navy-950/70 px-3 py-2 text-center leading-none">
              <b className="block text-2xl">{badge.day}</b>
              <span className="text-[0.65rem] uppercase tracking-wider text-brand-bright">{badge.month}</span>
            </div>
            {event.category && (
              <span className="rounded-full border border-brand-bright/35 bg-brand-bright/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-bright">
                {event.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black tracking-tight">{event.title}</h1>
          {event.description && (
            <p className="mt-4 text-ink-muted">{event.description}</p>
          )}
        </div>

        {/* details sidebar */}
        <Card hover={false} className="h-fit p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-brand-bright">
            Event Details
          </h2>
          <dl className="flex flex-col gap-3 text-sm">
            <Detail label="📅 Date" value={`${formatDate(event.event_date)}${event.event_time ? ` · ${event.event_time}` : ""}`} />
            <Detail label="📍 Location" value={[event.city, event.state].filter(Boolean).join(", ") || "TBA"} />
            {event.church_name && <Detail label="⛪ Church" value={event.church_name} />}
            {event.speaker && <Detail label="🎤 Speaker" value={event.speaker} />}
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            {safeUrl(event.source_url) && (
              <a
                href={safeUrl(event.source_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-bold transition hover:border-brand-bright hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright/60"
              >
                Visit Source ↗
              </a>
            )}
            {event.contact_email && (
              <a
                href={`mailto:${event.contact_email}`}
                className="text-center text-sm font-semibold text-brand-bright hover:underline"
              >
                ✉️ {event.contact_email}
              </a>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
