// Small shared helpers.

/** Join class names, dropping falsy values. (Tiny clsx replacement.) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Only allow http(s) URLs into href attributes. Blocks `javascript:` and other
 * dangerous schemes from user-submitted links. Returns undefined if unsafe.
 */
export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}

/** Format an ISO date string like "2026-07-12" -> "Jul 12, 2026". */
export function formatDate(iso: string | null): string {
  if (!iso) return "Date TBA";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Short month + day for compact date badges: { month: "JUL", day: "12" }. */
export function dateBadge(iso: string | null): { month: string; day: string } {
  if (!iso) return { month: "TBA", day: "--" };
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return { month: "TBA", day: "--" };
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
  };
}
