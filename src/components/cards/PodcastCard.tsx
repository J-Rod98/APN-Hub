"use client";
// Podcast episode card with a play/pause toggle mockup + listen link.
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { safeUrl } from "@/lib/utils";
import type { PodcastEpisode } from "@/lib/types";

export function PodcastCard({ episode }: { episode: PodcastEpisode }) {
  const [playing, setPlaying] = useState(false);
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-gradient-to-br from-navy-800 to-navy-850 text-sm font-extrabold text-brand-bright">
          EP {episode.episode_number ?? "—"}
        </div>
        <div className="min-w-0">
          <Link href={`/podcast/${episode.id}`} className="block truncate text-base font-bold hover:text-brand-bright">
            {episode.title}
          </Link>
          {episode.guest && (
            <small className="text-xs text-ink-muted">Guest: {episode.guest}</small>
          )}
        </div>
      </div>

      {episode.description && (
        <p className="line-clamp-2 text-sm text-ink-muted">{episode.description}</p>
      )}

      <div className="mt-1 flex items-center gap-3">
        <button
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow transition hover:scale-105"
        >
          {playing ? "⏸" : "▶"}
        </button>
        {safeUrl(episode.media_url) && (
          <a
            href={safeUrl(episode.media_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-brand-bright hover:underline"
          >
            Open ↗
          </a>
        )}
        <span className="ml-auto text-xs text-ink-muted">{episode.duration}</span>
      </div>
    </Card>
  );
}
