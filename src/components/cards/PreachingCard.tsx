// Preaching/sermon card with play icon, topic, scripture, and watch link.
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { safeUrl } from "@/lib/utils";
import type { PreachingItem } from "@/lib/types";

export function PreachingCard({ item }: { item: PreachingItem }) {
  return (
    <Card className="flex gap-4 p-5">
      <a
        href={safeUrl(item.media_url) ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Play ${item.title}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-sm text-white shadow-glow"
      >
        ▶
      </a>
      <div className="min-w-0">
        {item.topic && (
          <small className="text-[0.7rem] font-bold uppercase tracking-wide text-brand-bright">
            {item.topic}
          </small>
        )}
        <Link href={`/preaching/${item.id}`} className="my-1 block text-base font-bold hover:text-brand-bright">
          {item.title}
        </Link>
        <div className="mb-1.5 flex flex-wrap gap-x-3 text-xs text-ink-muted">
          {item.speaker && <span>🎤 {item.speaker}</span>}
          {item.scripture_reference && <span>📖 {item.scripture_reference}</span>}
          {item.media_type && <span className="uppercase">{item.media_type}</span>}
        </div>
        {item.description && (
          <p className="line-clamp-2 text-sm text-ink-muted">{item.description}</p>
        )}
        <a
          href={safeUrl(item.media_url) ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-bold text-brand-bright hover:underline"
        >
          Watch ↗
        </a>
      </div>
    </Card>
  );
}
