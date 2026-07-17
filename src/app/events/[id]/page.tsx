import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getEventById, getEvents } from "@/lib/data";
import { resolveEventImage } from "@/lib/event-images";
import { dateBadge, formatDateRange, safeUrl } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

export function generateStaticParams() {
  return getEvents().map((event) => ({ id: event.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = getEventById(params.id);
  return { title: event ? event.title + " — Apostolic Power Network" : "Event" };
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = getEventById(params.id);
  if (!event) notFound();

  const badge = dateBadge(event.event_date);
  const source = safeUrl(event.source_url);
  const eventImage = resolveEventImage(event);
  const image = safeUrl(eventImage.image_url);
  const imageCreditUrl = safeUrl(eventImage.image_credit_url);

  return (
    <div className="container-app py-10 sm:py-12">
      <Link href="/events/" className="mb-6 inline-block text-sm font-semibold text-sanctuary-muted hover:text-sanctuary-link">
        ← Back to Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="relative mb-7 flex min-h-[280px] items-end overflow-hidden rounded-[24px] border border-sanctuary-line bg-gradient-to-br from-brand-deep to-navy-950 p-6 shadow-[0_20px_46px_-28px_rgba(20,60,140,0.7)]">
            {image && <img src={image} alt={eventImage.image_alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,38,0.12),rgba(8,16,38,0.82))]" />
            <div className="absolute left-6 top-6 rounded-[14px] border border-white/45 bg-white/[0.94] px-3 py-2 text-center leading-none">
              <b className="block text-2xl text-sanctuary-ink">{badge.day}</b>
              <span className="text-[0.65rem] uppercase tracking-wider text-sanctuary-link">{badge.month}</span>
            </div>
            {event.category && (
              <span className="relative rounded-full bg-white/[0.92] px-3 py-1 text-xs font-bold uppercase tracking-wide text-sanctuary-ink">
                {event.category}
              </span>
            )}
            {imageCreditUrl && eventImage.image_credit && (
              <a
                href={imageCreditUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-5 right-5 z-[1] rounded-full bg-[#081026]/65 px-2.5 py-1.5 text-[0.62rem] font-semibold tracking-wide text-white/90 backdrop-blur-sm transition hover:bg-[#081026]/85 hover:text-white"
              >
                {eventImage.image_credit}
              </a>
            )}
          </div>

          <h1 className="font-serif text-4xl font-medium tracking-[-0.02em] text-sanctuary-ink sm:text-5xl">{event.title}</h1>
          {event.description && <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-sanctuary-muted">{event.description}</p>}

          {event.highlights.length > 0 && (
            <Card hover={false} className="mt-7 p-6 sm:p-7">
              <h2 className="font-serif text-2xl font-medium text-sanctuary-ink">What to expect</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-sanctuary-muted">
                {event.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-0.5 text-sanctuary-link">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <Card hover={false} className="h-fit p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-sanctuary-link">Event Details</h2>
          <dl className="flex flex-col gap-3.5 text-sm">
            <Detail label="📅 Date" value={formatDateRange(event.event_date, event.end_date)} />
            {event.event_time && <Detail label="◷ Time" value={event.event_time} />}
            <Detail label="📍 Location" value={[event.city, event.state].filter(Boolean).join(", ") || "TBA"} />
            {event.venue && <Detail label="⌂ Venue" value={event.venue} />}
            {event.church_name && <Detail label="⛪ Church" value={event.church_name} />}
            {event.speaker && <Detail label="🎤 Speaker" value={event.speaker} />}
          </dl>

          {source && (
            <a
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-sanctuary-line px-4 py-2 text-sm font-bold text-sanctuary-ink transition hover:border-[#bcd0f2] hover:bg-sanctuary-chip"
            >
              Official details ↗
            </a>
          )}
        </Card>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-sanctuary-muted">{label}</dt>
      <dd className="font-semibold text-sanctuary-ink">{value}</dd>
    </div>
  );
}
