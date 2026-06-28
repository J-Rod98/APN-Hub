// Podcast episode detail page.
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPodcastById } from "@/lib/data";
import { formatDate, safeUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const ep = await getPodcastById(params.id);
  return { title: ep ? `${ep.title} — Apostolic Power Network` : "Podcast" };
}

export default async function PodcastDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ep = await getPodcastById(params.id);
  if (!ep) notFound();

  const media = safeUrl(ep.media_url);

  return (
    <div className="container-app py-10">
      <Link href="/podcast" className="mb-6 inline-block text-sm font-semibold text-ink-muted hover:text-ink">
        ← Back to Podcast
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-line bg-gradient-to-br from-navy-800 to-navy-850 font-extrabold text-brand-bright">
            EP {ep.episode_number ?? "—"}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{ep.title}</h1>
            <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-ink-muted">
              {ep.guest && <span>Guest: {ep.guest}</span>}
              {ep.duration && <span>{ep.duration}</span>}
              <span>{formatDate(ep.created_at.slice(0, 10))}</span>
            </div>
          </div>
        </div>

        {/* mini player mockup */}
        <Card hover={false} className="mt-6 flex items-center gap-4 p-5">
          <div className="grid h-13 w-13 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow" style={{ width: 52, height: 52 }}>
            ▶
          </div>
          <div className="flex-1">
            <b className="block text-sm">{ep.title}</b>
            <small className="text-xs text-ink-muted">APN Podcast</small>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-navy-950">
              <div className="h-full w-[12%] rounded-full bg-gradient-to-r from-brand to-brand-bright" />
            </div>
          </div>
          <span className="text-xs tabular-nums text-ink-muted">{ep.duration}</span>
        </Card>

        {ep.description && <p className="mt-6 text-ink-muted">{ep.description}</p>}

        {media && (
          <div className="mt-6">
            <Button href={media}>▶ Listen to Episode</Button>
          </div>
        )}
      </div>
    </div>
  );
}
