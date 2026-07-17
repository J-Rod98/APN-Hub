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
        "rounded-[20px] border border-sanctuary-line bg-white shadow-[0_8px_26px_-20px_rgba(20,60,140,0.45)]",
        hover &&
          "transition hover:-translate-y-1.5 hover:border-[#bcd0f2] hover:shadow-[0_20px_42px_-24px_rgba(20,60,140,0.55)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
