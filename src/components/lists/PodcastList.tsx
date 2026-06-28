"use client";
// Browse + search for podcast episodes, with a mini player mockup on top.
import { useMemo, useState } from "react";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { SearchInput } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import type { PodcastEpisode } from "@/lib/types";

// Mini audio player mockup (visual only — wire to a real <audio> later).
function MiniPlayer({ episode }: { episode?: PodcastEpisode }) {
  const [playing, setPlaying] = useState(false);
  if (!episode) return null;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-gradient-to-br from-navy-800 to-navy-850 p-4 shadow-glow-lg">
      <button
        onClick={() => setPlaying((v) => !v)}
        aria-label={playing ? "Pause" : "Play"}
        className="grid h-13 w-13 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
        style={{ width: 52, height: 52 }}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="min-w-0 flex-1">
        <b className="block truncate text-sm">
          {episode.title}
          {episode.episode_number ? ` · Ep. ${episode.episode_number}` : ""}
        </b>
        <small className="text-xs text-ink-muted">Now Playing</small>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-navy-950">
          <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-brand to-brand-bright" />
        </div>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-ink-muted">
        19:42 / {episode.duration}
      </span>
    </div>
  );
}

export function PodcastList({ episodes }: { episodes: PodcastEpisode[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return episodes;
    return episodes.filter((e) =>
      [e.title, e.guest, e.description, String(e.episode_number)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [episodes, q]);

  return (
    <div className="flex flex-col gap-6">
      <MiniPlayer episode={episodes[0]} />
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
          {filtered.map((e) => (
            <PodcastCard key={e.id} episode={e} />
          ))}
        </div>
      )}
    </div>
  );
}
