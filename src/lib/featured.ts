// ============================================================================
// "Featured Today" — picks ONE piece of published content per day, rotating
// deterministically by the calendar day. Deterministic = same pick for the
// whole day on every render (no hydration mismatch, no randomness), and it
// advances to the next item at midnight UTC.
// ============================================================================

import { formatDate } from "./utils";
import type {
  AppEvent,
  PreachingItem,
  PodcastEpisode,
  Material,
} from "./types";

export type FeaturedKind = "event" | "preaching" | "podcast" | "material";

export interface FeaturedItem {
  kind: FeaturedKind;
  icon: string;
  label: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  cta: string;
}

function joinMeta(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(" · ");
}

/**
 * Build one combined pool of featured-able items and return today's pick.
 * Pass in the already-fetched published arrays (no extra DB calls).
 */
export function pickFeaturedOfDay(
  events: AppEvent[],
  preaching: PreachingItem[],
  podcast: PodcastEpisode[],
  materials: Material[],
): FeaturedItem | null {
  const pool: FeaturedItem[] = [];

  for (const e of events) {
    pool.push({
      kind: "event",
      icon: "📅",
      label: "Featured Event",
      title: e.title,
      description: e.description ?? "",
      meta: joinMeta([formatDate(e.event_date), joinMeta([e.city, e.state]), e.church_name]),
      href: `/events/${e.id}`,
      cta: "View Event",
    });
  }
  for (const p of preaching) {
    pool.push({
      kind: "preaching",
      icon: "🎧",
      label: "Featured Message",
      title: p.title,
      description: p.description ?? "",
      meta: joinMeta([p.speaker, p.topic, p.scripture_reference]),
      href: `/preaching/${p.id}`,
      cta: "Watch / Listen",
    });
  }
  for (const p of podcast) {
    pool.push({
      kind: "podcast",
      icon: "🎙️",
      label: "Recommended Podcast",
      title: p.title,
      description: p.description ?? "",
      meta: joinMeta([p.episode_number ? `Ep. ${p.episode_number}` : null, p.guest, p.duration]),
      href: `/podcast/${p.id}`,
      cta: "Listen",
    });
  }
  for (const m of materials) {
    pool.push({
      kind: "material",
      icon: "📄",
      label: "Featured Resource",
      title: m.title,
      description: m.description ?? "",
      meta: joinMeta([m.category, m.file_type]),
      href: "/materials",
      cta: "Download",
    });
  }

  if (pool.length === 0) return null;

  // Days since the Unix epoch (UTC) → stable per day, advances at midnight.
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return pool[dayIndex % pool.length];
}
