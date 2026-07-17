// Small pill badges: category labels, file types, status, free/premium.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/types";

// Category "label" pill (electric blue) used on cards.
export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-sanctuary-chipline bg-sanctuary-chip px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-sanctuary-link">
      {children}
    </span>
  );
}

// File-type badge with color coding.
const fileColors: Record<string, string> = {
  PDF: "bg-danger/15 text-[#ff8a8a] border-danger/30",
  DOC: "bg-sanctuary-chip text-sanctuary-link border-sanctuary-chipline",
  Canva: "bg-[#a863ff]/15 text-[#c79bff] border-[#a863ff]/30",
  Audio: "bg-success/15 text-success border-success/30",
  Video: "bg-gold/15 text-gold border-gold/30",
  Link: "bg-sanctuary-chip text-sanctuary-muted border-sanctuary-chipline",
};

export function FileBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
        fileColors[type] ?? fileColors.Link,
      )}
    >
      {type}
    </span>
  );
}

export function FreePremiumBadge({ premium }: { premium: boolean }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
        premium
          ? "bg-gold/15 text-gold border-gold/30"
          : "bg-success/15 text-success border-success/30",
      )}
    >
      {premium ? "Premium" : "Free"}
    </span>
  );
}

// Status badge for the admin dashboard.
const statusColors: Record<ContentStatus, string> = {
  pending: "bg-gold/15 text-gold border-gold/30",
  approved: "bg-sanctuary-chip text-sanctuary-link border-sanctuary-chipline",
  rejected: "bg-danger/15 text-[#ff8a8a] border-danger/30",
  published: "bg-success/15 text-success border-success/30",
  draft: "bg-sanctuary-chip text-sanctuary-muted border-sanctuary-chipline",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        "rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide",
        statusColors[status],
      )}
    >
      {status}
    </span>
  );
}
