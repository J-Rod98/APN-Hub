"use client";
// Client-side browse + filter for events (search, state, category).
import { useMemo, useState } from "react";
import { EventCard } from "@/components/cards/EventCard";
import { SearchInput, ChipRow, Select } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { US_STATES } from "@/lib/constants";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { eventsForPeriod, type EventPeriod } from "@/lib/event-dates";
import type { AppEvent } from "@/lib/types";

export function EventsList({ events }: { events: AppEvent[] }) {
  const at = useCurrentTime();
  const [period, setPeriod] = useState<EventPeriod>("Upcoming");
  const periodEvents = useMemo(() => at ? eventsForPeriod(events, period, at) : [], [events, period, at]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("");
  // Only offer categories that currently have a published event, so visitors
  // never hit an empty filter during the hand-curated launch.
  const categories = useMemo(
    () => Array.from(new Set(periodEvents.map((event) => event.category).filter((value): value is string => Boolean(value)))),
    [periodEvents],
  );

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return periodEvents.filter((e) => {
      const matchesText =
        !term ||
        [e.title, e.description, e.church_name, e.speaker, e.city, e.state, e.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesCat = category === "All" || e.category === category;
      const matchesState = !state || e.state === state;
      return matchesText && matchesCat && matchesState;
    });
  }, [periodEvents, q, category, state]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" aria-label="Event dates">{(["Upcoming", "Past", "All dates"] as const).map(value => <button key={value} type="button" aria-pressed={period === value} onClick={() => { setPeriod(value); setCategory("All"); }} className={`rounded-full border px-4 py-2 text-sm font-semibold ${period === value ? "bg-sanctuary-ink text-white" : "bg-white text-sanctuary-ink"}`}>{value}</button>)}</div>
        <p className="text-xs text-sanctuary-muted">Date-only listings use APN’s America/Chicago calendar. Confirm times with the organizer before traveling.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchInput value={q} onChange={setQ} placeholder="Search events…" />
          </div>
          <Select value={state} onChange={setState} options={US_STATES} label="All states" />
        </div>
        <ChipRow options={categories} active={category} onSelect={setCategory} />
      </div>

      {!at ? <p role="status">Checking event dates…</p> : filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title={period === "Upcoming" ? "No upcoming events match your filters" : "No events match your filters"}
          message="Try another date view or clear your filters. Past gatherings remain in the archive."
          action={<Button href="/submit" size="sm">＋ Submit an Event</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
