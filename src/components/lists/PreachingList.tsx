"use client";
// Browse + filter for preaching (search + topic).
import { useMemo, useState } from "react";
import { PreachingCard } from "@/components/cards/PreachingCard";
import { SearchInput, ChipRow } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { PREACHING_TOPICS } from "@/lib/constants";
import type { PreachingItem } from "@/lib/types";

export function PreachingList({
  items,
  initialQuery = "",
}: {
  items: PreachingItem[];
  /** Seeded from `?q=` (homepage hero search / topic tiles). */
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [topic, setTopic] = useState("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((p) => {
      const matchesText =
        !term ||
        [p.title, p.speaker, p.topic, p.scripture_reference, p.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesTopic = topic === "All" || p.topic === topic;
      return matchesText && matchesTopic;
    });
  }, [items, q, topic]);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={q} onChange={setQ} placeholder="Search preaching…" />
      <ChipRow options={PREACHING_TOPICS} active={topic} onSelect={setTopic} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎧"
          title="No messages found"
          message="Try a different topic or search term."
          action={<Button href="/submit" size="sm">＋ Submit a Sermon</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((p) => (
            <PreachingCard key={p.id} item={p} />
          ))}
        </div>
      )}
    </div>
  );
}
