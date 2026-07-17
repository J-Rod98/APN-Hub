import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Badge";
import { getPreaching, getPreachingById } from "@/lib/data";
import { getPlayable } from "@/lib/media";
import { formatDate, safeUrl } from "@/lib/utils";

export function generateStaticParams() {
  return getPreaching().map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = getPreachingById(params.id);
  return { title: item ? item.title + " — Apostolic Power Network" : "Preaching" };
}

export default function PreachingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = getPreachingById(params.id);
  if (!item) notFound();

  const media = safeUrl(item.media_url);
  const playable = getPlayable(item.media_url);

  return (
    <div className="container-app py-10">
      <Link href="/preaching/" className="mb-6 inline-block text-sm font-semibold text-ink-muted hover:text-ink">
        ← Back to Preaching
      </Link>

      <div className="mx-auto max-w-3xl">
        {item.topic && <Label>{item.topic}</Label>}
        <h1 className="mt-3 text-3xl font-black tracking-tight">{item.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {item.speaker && <span>🎤 {item.speaker}</span>}
          {item.scripture_reference && <span>📖 {item.scripture_reference}</span>}
          {item.media_type && <span className="uppercase">{item.media_type}</span>}
          <span>{formatDate(item.created_at.slice(0, 10))}</span>
        </div>

        {playable && playable.kind !== "audio" && (
          <Card hover={false} className="mt-6 overflow-hidden p-0">
            <iframe
              src={playable.src}
              title={item.title}
              className={playable.kind === "spotify" ? "h-[352px] w-full border-0" : "aspect-video w-full border-0"}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </Card>
        )}
        {playable?.kind === "audio" && (
          <Card hover={false} className="mt-6 p-5">
            <audio controls className="w-full" src={playable.src}>
              Your browser does not support audio playback.
            </audio>
          </Card>
        )}

        {item.description && <p className="mt-6 text-ink-muted">{item.description}</p>}

        {media && (
          <div className="mt-6">
            <Button href={media}>Open original source</Button>
          </div>
        )}
      </div>
    </div>
  );
}
