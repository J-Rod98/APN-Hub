"use client";
// Player modal (Sanctuary Light).
//
// Only ever opened for items with a REAL playable source — the design's mock
// progress bar is deliberately replaced with the actual Spotify/YouTube/audio
// embed. Items without playable media never render a play control, so this
// modal can assume `playable` is present.
import { useEffect } from "react";
import type { Playable } from "@/lib/media";

export interface PlayerItem {
  title: string;
  topic: string;
  meta: string;
  badge: string; // VIDEO / AUDIO / PODCAST
  image: string;
  playable: Playable;
}

export function PlayerModal({
  item,
  onClose,
}: {
  item: PlayerItem;
  onClose: () => void;
}) {
  // Close on Escape; lock background scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const { playable } = item;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Player: ${item.title}`}
      className="fixed inset-0 z-[100] flex animate-fadein items-center justify-center bg-[rgba(6,12,28,0.72)] p-4 backdrop-blur-md sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[760px] max-w-full overflow-hidden rounded-[24px] border border-[#26365f] bg-[#0c1330] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]"
      >
        {/* Real player */}
        <div className="relative bg-black">
          <button
            onClick={onClose}
            aria-label="Close player"
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-[rgba(6,12,28,0.75)] text-xl text-white transition hover:bg-[rgba(6,12,28,0.95)]"
          >
            ✕
          </button>

          {playable.kind === "youtube" && (
            <div className="aspect-video w-full">
              <iframe
                src={`${playable.src}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          )}

          {playable.kind === "spotify" && (
            <iframe
              src={playable.src}
              title={item.title}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="h-[232px] w-full border-0"
            />
          )}

          {playable.kind === "audio" && (
            <div className="relative h-[240px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,12,28,0.15)] to-[rgba(6,12,28,0.85)]" />
              <audio
                controls
                autoPlay
                src={playable.src}
                className="absolute inset-x-4 bottom-4 w-[calc(100%-2rem)]"
              />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="px-7 pb-7 pt-6 text-ink">
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-sky">
            {item.topic || item.badge}
          </div>
          <div className="mt-1.5 font-serif text-[28px] leading-tight">{item.title}</div>
          <div className="mt-1 text-sm text-ink-muted">{item.meta}</div>
          <a
            href={playable.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-bold text-sanctuary-sky hover:underline"
          >
            Open original ↗
          </a>
        </div>
      </div>
    </div>
  );
}
