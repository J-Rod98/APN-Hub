import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getPlayable } from "@/lib/media";
import { safeUrl } from "@/lib/utils";
import type { PodcastEpisode } from "@/lib/types";

export function PodcastCard({ episode }: { episode: PodcastEpisode }) {
  const source = safeUrl(episode.media_url);
  const playable = getPlayable(episode.media_url);

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-sanctuary-chipline bg-sanctuary-chip text-sm font-extrabold text-sanctuary-link">
          EP {episode.episode_number ?? "—"}
        </div>
        <div className="min-w-0">
          <Link href={"/podcast/" + episode.id} className="block truncate font-serif text-[20px] font-medium text-sanctuary-ink hover:text-sanctuary-link">
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
        {source && (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
          >
            {playable ? "Listen ↗" : "Open source ↗"}
          </a>
        )}
        <span className="ml-auto text-xs text-ink-muted">{episode.duration}</span>
      </div>
    </Card>
  );
}
