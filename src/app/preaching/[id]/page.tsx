// Preaching detail page.
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Badge";
import { getPreachingById } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getPreachingById(params.id);
  return { title: item ? `${item.title} — Apostolic Power Network` : "Preaching" };
}

export default async function PreachingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getPreachingById(params.id);
  if (!item) notFound();

  return (
    <div className="container-app py-10">
      <Link href="/preaching" className="mb-6 inline-block text-sm font-semibold text-ink-muted hover:text-ink">
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

        {/* media placeholder */}
        <Card hover={false} className="mt-6 flex aspect-video items-center justify-center bg-navy-950">
          <a
            href={item.media_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-xl text-white shadow-glow transition hover:scale-105"
            aria-label="Play"
          >
            ▶
          </a>
        </Card>

        {item.description && (
          <p className="mt-6 text-ink-muted">{item.description}</p>
        )}

        {item.media_url && (
          <div className="mt-6">
            <Button href={item.media_url}>▶ Watch / Listen</Button>
          </div>
        )}
      </div>
    </div>
  );
}
