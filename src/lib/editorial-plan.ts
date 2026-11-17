export const CONTENT_PLAN_ID = "apn-foundation-2026-11";
export const CONTENT_PLAN_TARGETS = [
  { kind: "sermon", label: "Sermons", baseline: 13, additions: 7 },
  { kind: "podcast", label: "Podcasts", baseline: 3, additions: 5 },
  { kind: "music", label: "Music", baseline: 1, additions: 5 },
  { kind: "news", label: "News", baseline: 0, additions: 4 },
  { kind: "event", label: "Future events", baseline: 2, additions: 6 },
  { kind: "resource", label: "Practical resources", baseline: 5, additions: 5 },
] as const;
const weeks = [
  ["event", "event", "music", "news", "podcast", "resource"],
  ["event", "music", "news", "podcast", "resource", "sermon"],
  ["event", "music", "news", "podcast", "resource", "sermon"],
  ["event", "music", "news", "podcast", "resource", "sermon"],
  ["event", "music", "podcast", "resource", "sermon", "sermon"],
  ["sermon", "sermon"],
] as const;
export const CONTENT_PLAN_SLOTS = weeks.flatMap((kinds, index) => kinds.map((kind, item) => ({ id: `week-${index + 1}-${item + 1}`, week: index + 1, kind })));
export type EditorialPlan = { id: typeof CONTENT_PLAN_ID; slot: string; week: number };
