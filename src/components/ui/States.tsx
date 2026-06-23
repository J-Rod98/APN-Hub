// Shared empty / loading / error states for content sections.
import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({
  icon = "📭",
  title,
  message,
  action,
}: {
  icon?: string;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <Card hover={false} className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink-muted">{message}</p>}
      {action}
    </Card>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <Card hover={false} className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-4xl">⚠️</div>
      <h3 className="text-lg font-bold">Something went wrong</h3>
      <p className="max-w-sm text-sm text-ink-muted">
        {message ?? "We couldn't load this content. Please try again shortly."}
      </p>
    </Card>
  );
}

// Skeleton card grid used by route-level loading.tsx files.
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-48 animate-pulse rounded-xl2 border border-line bg-navy-850/60"
        />
      ))}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-ink-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand-bright" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
