/* eslint-disable @next/next/no-img-element */
// Event card with a source-owned image, date badge, location, and details link.
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { resolveEventImage } from "@/lib/event-images";
import { dateBadge, formatDateRange, safeUrl } from "@/lib/utils";
import type { AppEvent } from "@/lib/types";

export function EventCard({ event }: { event: AppEvent }) {
  const badge = dateBadge(event.event_date);
  const eventImage = resolveEventImage(event);
  const image = safeUrl(eventImage.image_url);
  const imageCreditUrl = safeUrl(eventImage.image_credit_url);
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Image has an official source and remains externally hosted. */}
      <div className="relative flex h-40 items-end bg-gradient-to-br from-brand-deep to-navy-950 p-3.5">
        {image && (
          <img src={image} alt={eventImage.image_alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,38,0.08),rgba(8,16,38,0.72))]" />
        <div className="absolute left-3.5 top-3.5 rounded-xl border border-white/45 bg-white/[0.94] px-2.5 py-1.5 text-center leading-none shadow-sm">
          <b className="block text-lg text-sanctuary-ink">{badge.day}</b>
          <span className="text-[0.62rem] uppercase tracking-wider text-sanctuary-link">
            {badge.month}
          </span>
        </div>
        {event.category && (
          <span className="relative rounded-full bg-white/[0.92] px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-sanctuary-ink">
            {event.category}
          </span>
        )}
        {imageCreditUrl && eventImage.image_credit && (
          <a
            href={imageCreditUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 z-[1] rounded-full bg-[#081026]/65 px-2 py-1 text-[0.58rem] font-semibold tracking-wide text-white/90 backdrop-blur-sm transition hover:bg-[#081026]/85 hover:text-white"
          >
            {eventImage.image_credit}
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 font-serif text-[23px] font-medium leading-tight text-sanctuary-ink">{event.title}</h3>
        <div className="mb-3 flex flex-col gap-1 text-sm text-sanctuary-muted">
          <span>📅 {formatDateRange(event.event_date, event.end_date)}{event.event_time ? ` · ${event.event_time}` : ""}</span>
          <span>📍 {[event.city, event.state].filter(Boolean).join(", ") || "Location TBA"}</span>
          {event.venue && <span>⌂ {event.venue}</span>}
          {event.church_name && <span>⛪ {event.church_name}</span>}
          {event.speaker && <span>🎤 {event.speaker}</span>}
        </div>
        {event.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-sanctuary-muted">{event.description}</p>
        )}
        <div className="mt-auto flex items-center gap-3">
          <Button href={`/events/${event.id}`} size="sm">View Details</Button>
          {safeUrl(event.source_url) && (
            <a
              href={safeUrl(event.source_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
