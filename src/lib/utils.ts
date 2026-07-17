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

/** Format one or two ISO dates without needlessly repeating the year/month. */
export function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "Date TBA";
  if (!end || end === start) return formatDate(start);

  const from = new Date(start + "T00:00:00");
  const to = new Date(end + "T00:00:00");
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${formatDate(start)} – ${formatDate(end)}`;
  }

  const sameYear = from.getFullYear() === to.getFullYear();
  const sameMonth = sameYear && from.getMonth() === to.getMonth();
  const month = from.toLocaleDateString("en-US", { month: "short" });
  if (sameMonth) return `${month} ${from.getDate()}–${to.getDate()}, ${from.getFullYear()}`;
  if (sameYear) {
    const endMonth = to.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${from.getDate()} – ${endMonth} ${to.getDate()}, ${from.getFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
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
