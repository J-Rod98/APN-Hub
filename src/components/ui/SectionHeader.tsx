// Reusable section heading: eyebrow + title + optional subtitle.
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-[2rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-ink-muted">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
