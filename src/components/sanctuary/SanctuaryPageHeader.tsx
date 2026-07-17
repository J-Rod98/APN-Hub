/* eslint-disable @next/next/no-img-element */
// Shared internal-page masthead. It brings the light editorial system and real
// Apostolic imagery from the homepage to each browse page.
import type { ReactNode } from "react";
import { HERO_IMAGES } from "@/lib/sanctuary";

export function SanctuaryPageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  imageIndex = 0,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  imageIndex?: number;
}) {
  const image = HERO_IMAGES[imageIndex % HERO_IMAGES.length];

  return (
    <section className="relative mb-9 overflow-hidden rounded-[28px] border border-white/30 bg-sanctuary-ink shadow-[0_24px_60px_-34px_rgba(20,60,140,0.75)]">
      <img
        src={image.src}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,16,38,0.9)_0%,rgba(12,29,73,0.79)_52%,rgba(20,82,214,0.54)_100%)]" />
      <a
        href={image.creditHref}
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-4 right-5 z-[1] text-[10px] font-semibold tracking-wide text-white/75 underline decoration-white/40 underline-offset-2 transition hover:text-white sm:bottom-5 sm:right-7"
      >
        {image.credit}
      </a>
      <div className="relative flex min-h-[260px] flex-col justify-end px-6 py-8 sm:min-h-[292px] sm:px-10 sm:py-10">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-sanctuary-sky">
            {eyebrow}
          </div>
          <h1 className="mt-3 font-serif text-[38px] font-medium leading-[1.02] tracking-[-0.02em] text-white sm:text-[52px]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
            {subtitle}
          </p>
        </div>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </section>
  );
}
