/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { getVideoThumbnail } from "@/lib/media";
import { safeUrl } from "@/lib/utils";
import type { PreachingItem } from "@/lib/types";

export function PreachingCard({ item }: { item: PreachingItem }) {
  const media = safeUrl(item.media_url);
  const thumbnail = getVideoThumbnail(item.media_url);

  return (
    <Card className="flex gap-4 p-5">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt=""
          className="h-20 w-28 shrink-0 rounded-xl object-cover"
        />
      ) : media ? (
        <a
          href={media}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={"Open " + item.title}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-sm text-white shadow-glow"
        >
          ↗
        </a>
      ) : (
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-800 text-sm text-ink-muted"
        >
          —
        </div>
      )}
      <div className="min-w-0">
        {item.topic && (
          <small className="text-[0.7rem] font-bold uppercase tracking-wide text-sanctuary-link">
            {item.topic}
          </small>
        )}
        <Link href={"/preaching/" + item.id} className="my-1 block font-serif text-[21px] font-medium text-sanctuary-ink hover:text-sanctuary-link">
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
        {media && (
          <a
            href={media}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
          >
            Watch ↗
          </a>
        )}
      </div>
    </Card>
  );
}
