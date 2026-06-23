// Event card with date badge, location, church, speaker, and details link.
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { dateBadge, formatDate } from "@/lib/utils";
import type { AppEvent } from "@/lib/types";

export function EventCard({ event }: { event: AppEvent }) {
  const badge = dateBadge(event.event_date);
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* banner with date badge + category */}
      <div className="relative flex h-28 items-end bg-gradient-to-br from-brand-deep to-navy-950 p-3.5">
        <div className="absolute left-3.5 top-3.5 rounded-xl border border-line bg-navy-950/70 px-2.5 py-1.5 text-center leading-none">
          <b className="block text-lg">{badge.day}</b>
          <span className="text-[0.62rem] uppercase tracking-wider text-brand-bright">
            {badge.month}
          </span>
        </div>
        {event.category && (
          <span className="rounded-full border border-brand-bright/35 bg-brand-bright/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-brand-bright">
            {event.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold">{event.title}</h3>
        <div className="mb-3 flex flex-col gap-1 text-sm text-ink-muted">
          <span>📅 {formatDate(event.event_date)}{event.event_time ? ` · ${event.event_time}` : ""}</span>
          <span>📍 {[event.city, event.state].filter(Boolean).join(", ") || "Location TBA"}</span>
          {event.church_name && <span>⛪ {event.church_name}</span>}
          {event.speaker && <span>🎤 {event.speaker}</span>}
        </div>
        {event.description && (
          <p className="mb-4 line-clamp-2 text-sm text-ink-muted">{event.description}</p>
        )}
        <div className="mt-auto flex items-center gap-3">
          <Button href={`/events/${event.id}`} size="sm">View Details</Button>
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-bright hover:underline"
            >
              Source ↗
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
