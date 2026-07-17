"use client";

import { useEffect, useMemo, useState } from "react";
import { PreachingCard } from "@/components/cards/PreachingCard";
import { SearchInput, ChipRow } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { PREACHING_TOPICS } from "@/lib/constants";
import type { PreachingItem } from "@/lib/types";

export function PreachingList({ items }: { items: PreachingItem[] }) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("All");

  // Read an optional homepage search after hydration so the route remains
  // exportable as static HTML.
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    setQ(search.get("q") ?? "");
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((item) => {
      const matchesText =
        !term ||
        [item.title, item.speaker, item.topic, item.scripture_reference, item.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesTopic = topic === "All" || item.topic === topic;
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
          {filtered.map((item) => (
            <PreachingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
