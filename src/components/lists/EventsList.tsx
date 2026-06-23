"use client";
// Client-side browse + filter for events (search, state, category).
import { useMemo, useState } from "react";
import { EventCard } from "@/components/cards/EventCard";
import { SearchInput, ChipRow, Select } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { EVENT_CATEGORIES, US_STATES } from "@/lib/constants";
import type { AppEvent } from "@/lib/types";

export function EventsList({ events }: { events: AppEvent[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return events.filter((e) => {
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
  }, [events, q, category, state]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <SearchInput value={q} onChange={setQ} placeholder="Search events…" />
          </div>
          <Select value={state} onChange={setState} options={US_STATES} label="All states" />
        </div>
        <ChipRow options={EVENT_CATEGORIES} active={category} onSelect={setCategory} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events match your filters"
          message="Try clearing filters, or be the first to submit an event for your area."
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
