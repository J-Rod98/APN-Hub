// Base card surface used across the app.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl2 border border-line bg-gradient-to-b from-navy-850 to-navy-900",
        hover &&
          "transition hover:-translate-y-1.5 hover:border-brand-bright/35 hover:shadow-glow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
