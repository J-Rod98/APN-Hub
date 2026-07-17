"use client";

import { useMemo, useState } from "react";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { SearchInput } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import type { PodcastEpisode } from "@/lib/types";

export function PodcastList({ episodes }: { episodes: PodcastEpisode[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return episodes;
    return episodes.filter((episode) =>
      [episode.title, episode.guest, episode.description, String(episode.episode_number)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [episodes, q]);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={q} onChange={setQ} placeholder="Search episodes…" />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎙️"
          title="No episodes found"
          message="Try a different search term."
          action={<Button href="/submit" size="sm">＋ Suggest a Podcast</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((episode) => (
            <PodcastCard key={episode.id} episode={episode} />
          ))}
        </div>
      )}
    </div>
  );
}
