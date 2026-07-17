import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPodcast, getPodcastById } from "@/lib/data";
import { getPlayable } from "@/lib/media";
import { formatDate, safeUrl } from "@/lib/utils";

export function generateStaticParams() {
  return getPodcast().map((episode) => ({ id: episode.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const episode = await getPodcastById(params.id);
  return { title: episode ? episode.title + " — Apostolic Power Network" : "Podcast" };
}

export default async function PodcastDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const episode = await getPodcastById(params.id);
  if (!episode) notFound();

  const media = safeUrl(episode.media_url);
  const playable = getPlayable(episode.media_url);

  return (
    <div className="container-app py-10">
      <Link href="/podcast" className="mb-6 inline-block text-sm font-semibold text-ink-muted hover:text-ink">
        ← Back to Podcast
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-line bg-gradient-to-br from-navy-800 to-navy-850 font-extrabold text-brand-bright">
            EP {episode.episode_number ?? "—"}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{episode.title}</h1>
            <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-ink-muted">
              {episode.guest && <span>Guest: {episode.guest}</span>}
              {episode.duration && <span>{episode.duration}</span>}
              <span>{formatDate(episode.created_at.slice(0, 10))}</span>
            </div>
          </div>
        </div>

        {playable?.kind === "audio" && (
          <Card hover={false} className="mt-6 p-5">
            <audio controls className="w-full" src={playable.src}>
              Your browser does not support audio playback.
            </audio>
          </Card>
        )}
        {playable && playable.kind !== "audio" && (
          <Card hover={false} className="mt-6 overflow-hidden p-0">
            <iframe
              src={playable.src}
              title={episode.title}
              className={playable.kind === "spotify" ? "h-[352px] w-full border-0" : "aspect-video w-full border-0"}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </Card>
        )}

        {episode.description && <p className="mt-6 text-ink-muted">{episode.description}</p>}

        {media && (
          <div className="mt-6">
            <Button href={media}>Open original source</Button>
          </div>
        )}
      </div>
    </div>
  );
}
