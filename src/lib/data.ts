// ============================================================================
// APN Hub — data access layer (server-side)
// ----------------------------------------------------------------------------
// Every page reads through these functions.
//
// SEED FALLBACK IS A LOCAL-DEV CONVENIENCE ONLY.
// In production the site must never quietly render sample content: fake events
// and fake prayer requests presented as real is worse than an outage. So:
//
//   * Supabase not configured  -> dev: warn + seed data. production: THROW.
//   * Supabase query fails     -> dev: warn + seed data. production: THROW.
//
// A thrown error surfaces through app/error.tsx as a visible failure state.
// ============================================================================

import { getServerClient, getAdminClient } from "./supabase/server";
import {
  sampleEvents,
  samplePreaching,
  samplePodcast,
  sampleMaterials,
  samplePrayers,
  sampleSubmissions,
  sampleSubscribers,
} from "./sample-data";
import type {
  AppEvent,
  PreachingItem,
  PodcastEpisode,
  Material,
  PrayerRequest,
  Submission,
  NewsletterSubscriber,
} from "./types";

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Decide what to do when we cannot read real data.
 * Production: throw (visible failure). Development: warn loudly + seed data.
 */
function unavailable<T>(sample: T, what: string, reason: string): T {
  const msg = `${what} unavailable: ${reason}`;
  if (IS_PROD) throw new Error(msg);
  console.warn(`[APN] ${msg} — falling back to local seed data (dev only).`);
  return sample;
}

// ---------------------------------------------------------------------------
// Public reads (published content only)
// ---------------------------------------------------------------------------

export async function getEvents(): Promise<AppEvent[]> {
  const db = getServerClient();
  if (!db) return unavailable(sampleEvents, "Events", "Supabase is not configured");
  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true });
  if (error || !data) {
    return unavailable(sampleEvents, "Events", error?.message ?? "no data returned");
  }
  return data as AppEvent[];
}

export async function getPreaching(): Promise<PreachingItem[]> {
  const db = getServerClient();
  if (!db) return unavailable(samplePreaching, "Preaching", "Supabase is not configured");
  const { data, error } = await db
    .from("preaching_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data) {
    return unavailable(samplePreaching, "Preaching", error?.message ?? "no data returned");
  }
  return data as PreachingItem[];
}

export async function getPodcast(): Promise<PodcastEpisode[]> {
  const db = getServerClient();
  if (!db) return unavailable(samplePodcast, "Podcast", "Supabase is not configured");
  const { data, error } = await db
    .from("podcast_episodes")
    .select("*")
    .eq("status", "published")
    .order("episode_number", { ascending: false });
  if (error || !data) {
    return unavailable(samplePodcast, "Podcast", error?.message ?? "no data returned");
  }
  return data as PodcastEpisode[];
}

export async function getMaterials(): Promise<Material[]> {
  const db = getServerClient();
  if (!db) return unavailable(sampleMaterials, "Materials", "Supabase is not configured");
  const { data, error } = await db
    .from("materials")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data) {
    return unavailable(sampleMaterials, "Materials", error?.message ?? "no data returned");
  }
  return data as Material[];
}

export async function getPrayers(): Promise<PrayerRequest[]> {
  const db = getServerClient();
  if (!db) return unavailable(samplePrayers, "Prayer wall", "Supabase is not configured");
  const { data, error } = await db
    .from("prayer_requests")
    .select("*")
    .eq("is_public", true)
    .in("status", ["approved", "published"])
    .order("created_at", { ascending: false });
  if (error || !data) {
    return unavailable(samplePrayers, "Prayer wall", error?.message ?? "no data returned");
  }
  return data as PrayerRequest[];
}

// ---------------------------------------------------------------------------
// Single-item reads (for detail pages). Published only for the public site.
// ---------------------------------------------------------------------------

// NOTE: a null return means "not found" (-> 404). A failed query throws instead,
// so an outage never masquerades as a missing page.

export async function getEventById(id: string): Promise<AppEvent | null> {
  const db = getServerClient();
  if (!db) {
    return unavailable(sampleEvents.find((e) => e.id === id) ?? null, "Event", "Supabase is not configured");
  }
  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`Event unavailable: ${error.message}`);
  return (data as AppEvent) ?? null;
}

export async function getPreachingById(id: string): Promise<PreachingItem | null> {
  const db = getServerClient();
  if (!db) {
    return unavailable(samplePreaching.find((p) => p.id === id) ?? null, "Sermon", "Supabase is not configured");
  }
  const { data, error } = await db
    .from("preaching_items")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`Sermon unavailable: ${error.message}`);
  return (data as PreachingItem) ?? null;
}

export async function getPodcastById(id: string): Promise<PodcastEpisode | null> {
  const db = getServerClient();
  if (!db) {
    return unavailable(samplePodcast.find((p) => p.id === id) ?? null, "Episode", "Supabase is not configured");
  }
  const { data, error } = await db
    .from("podcast_episodes")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(`Episode unavailable: ${error.message}`);
  return (data as PodcastEpisode) ?? null;
}

// ---------------------------------------------------------------------------
// Admin reads (all statuses) — require service-role client
// ---------------------------------------------------------------------------

export async function getAllSubmissions(): Promise<Submission[]> {
  const db = getAdminClient();
  if (!db) return unavailable(sampleSubmissions, "Submissions", "service role key is not configured");
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) {
    return unavailable(sampleSubmissions, "Submissions", error?.message ?? "no data returned");
  }
  return data as Submission[];
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = getAdminClient();
  if (!db) return unavailable(sampleSubscribers, "Subscribers", "service role key is not configured");
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) {
    return unavailable(sampleSubscribers, "Subscribers", error?.message ?? "no data returned");
  }
  return data as NewsletterSubscriber[];
}

// Admin reads return ALL statuses (not just published) so the dashboard can
// manage drafts/pending/rejected too. Showing seed rows in an admin table would
// be actively dangerous (you might "moderate" content that isn't real), so in
// production these throw rather than substitute samples.
export async function getAdminEvents(): Promise<AppEvent[]> {
  const db = getAdminClient();
  if (!db) return unavailable(sampleEvents, "Events (admin)", "service role key is not configured");
  const { data, error } = await db.from("events").select("*").order("created_at", { ascending: false });
  if (error || !data) return unavailable(sampleEvents, "Events (admin)", error?.message ?? "no data");
  return data as AppEvent[];
}

export async function getAdminPreaching(): Promise<PreachingItem[]> {
  const db = getAdminClient();
  if (!db) return unavailable(samplePreaching, "Preaching (admin)", "service role key is not configured");
  const { data, error } = await db.from("preaching_items").select("*").order("created_at", { ascending: false });
  if (error || !data) return unavailable(samplePreaching, "Preaching (admin)", error?.message ?? "no data");
  return data as PreachingItem[];
}

export async function getAdminPodcast(): Promise<PodcastEpisode[]> {
  const db = getAdminClient();
  if (!db) return unavailable(samplePodcast, "Podcast (admin)", "service role key is not configured");
  const { data, error } = await db.from("podcast_episodes").select("*").order("created_at", { ascending: false });
  if (error || !data) return unavailable(samplePodcast, "Podcast (admin)", error?.message ?? "no data");
  return data as PodcastEpisode[];
}

export async function getAdminMaterials(): Promise<Material[]> {
  const db = getAdminClient();
  if (!db) return unavailable(sampleMaterials, "Materials (admin)", "service role key is not configured");
  const { data, error } = await db.from("materials").select("*").order("created_at", { ascending: false });
  if (error || !data) return unavailable(sampleMaterials, "Materials (admin)", error?.message ?? "no data");
  return data as Material[];
}

export async function getAdminPrayers(): Promise<PrayerRequest[]> {
  const db = getAdminClient();
  if (!db) return unavailable(samplePrayers, "Prayers (admin)", "service role key is not configured");
  const { data, error } = await db.from("prayer_requests").select("*").order("created_at", { ascending: false });
  if (error || !data) return unavailable(samplePrayers, "Prayers (admin)", error?.message ?? "no data");
  return data as PrayerRequest[];
}

/** Aggregate counts for the admin analytics cards. */
export async function getAdminStats() {
  const db = getAdminClient();

  // Dev-only demo numbers. In production a missing service role key is a
  // misconfiguration, not something to paper over with sample counts.
  if (!db) {
    if (IS_PROD) throw new Error("Admin stats unavailable: service role key is not configured");
    console.warn("[APN] Admin stats unavailable — using local seed counts (dev only).");
    return {
      events: sampleEvents.length,
      prayers: samplePrayers.length,
      materials: sampleMaterials.length,
      subscribers: sampleSubscribers.length,
      pending: sampleSubmissions.filter((s) => s.status === "pending").length,
      demo: true,
    };
  }

  const head = { count: "exact" as const, head: true };
  const [events, prayers, materials, subscribers, pending] = await Promise.all([
    db.from("events").select("*", head),
    db.from("prayer_requests").select("*", head),
    db.from("materials").select("*", head),
    db.from("newsletter_subscribers").select("*", head),
    db.from("submissions").select("*", head).eq("status", "pending"),
  ]);

  return {
    events: events.count ?? 0,
    prayers: prayers.count ?? 0,
    materials: materials.count ?? 0,
    subscribers: subscribers.count ?? 0,
    pending: pending.count ?? 0,
    demo: false,
  };
}
