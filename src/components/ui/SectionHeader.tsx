// Reusable section heading: eyebrow + title + optional subtitle.
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  /** Heading level — use "h1" for a page's main title, "h2" for sections. */
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
            {eyebrow}
          </div>
        )}
        <Heading className="text-2xl font-extrabold tracking-tight sm:text-[2rem]">
          {title}
        </Heading>
        {subtitle && (
          <p className="mt-2 max-w-xl text-ink-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
