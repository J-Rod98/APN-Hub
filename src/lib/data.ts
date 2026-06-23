// ============================================================================
// APN Hub — data access layer (server-side)
// ----------------------------------------------------------------------------
// Every page reads through these functions. Each one tries Supabase first and
// transparently falls back to the built-in seed data when Supabase isn't
// configured (or a query errors). This keeps the app fully demoable with zero
// setup while remaining production-ready once env vars are added.
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

// ---------------------------------------------------------------------------
// Public reads (published content only)
// ---------------------------------------------------------------------------

export async function getEvents(): Promise<AppEvent[]> {
  const db = getServerClient();
  if (!db) return sampleEvents;
  const { data, error } = await db
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("event_date", { ascending: true });
  if (error || !data) return sampleEvents;
  return data as AppEvent[];
}

export async function getPreaching(): Promise<PreachingItem[]> {
  const db = getServerClient();
  if (!db) return samplePreaching;
  const { data, error } = await db
    .from("preaching_items")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data) return samplePreaching;
  return data as PreachingItem[];
}

export async function getPodcast(): Promise<PodcastEpisode[]> {
  const db = getServerClient();
  if (!db) return samplePodcast;
  const { data, error } = await db
    .from("podcast_episodes")
    .select("*")
    .eq("status", "published")
    .order("episode_number", { ascending: false });
  if (error || !data) return samplePodcast;
  return data as PodcastEpisode[];
}

export async function getMaterials(): Promise<Material[]> {
  const db = getServerClient();
  if (!db) return sampleMaterials;
  const { data, error } = await db
    .from("materials")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error || !data) return sampleMaterials;
  return data as Material[];
}

export async function getPrayers(): Promise<PrayerRequest[]> {
  const db = getServerClient();
  if (!db) return samplePrayers;
  const { data, error } = await db
    .from("prayer_requests")
    .select("*")
    .eq("is_public", true)
    .in("status", ["approved", "published"])
    .order("created_at", { ascending: false });
  if (error || !data) return samplePrayers;
  return data as PrayerRequest[];
}

// ---------------------------------------------------------------------------
// Single-item reads (for detail pages). Published only for the public site.
// ---------------------------------------------------------------------------

export async function getEventById(id: string): Promise<AppEvent | null> {
  const db = getServerClient();
  if (!db) return sampleEvents.find((e) => e.id === id) ?? null;
  const { data } = await db
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return (data as AppEvent) ?? null;
}

export async function getPreachingById(id: string): Promise<PreachingItem | null> {
  const db = getServerClient();
  if (!db) return samplePreaching.find((p) => p.id === id) ?? null;
  const { data } = await db
    .from("preaching_items")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return (data as PreachingItem) ?? null;
}

export async function getPodcastById(id: string): Promise<PodcastEpisode | null> {
  const db = getServerClient();
  if (!db) return samplePodcast.find((p) => p.id === id) ?? null;
  const { data } = await db
    .from("podcast_episodes")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  return (data as PodcastEpisode) ?? null;
}

// ---------------------------------------------------------------------------
// Admin reads (all statuses) — require service-role client
// ---------------------------------------------------------------------------

export async function getAllSubmissions(): Promise<Submission[]> {
  const db = getAdminClient();
  if (!db) return sampleSubmissions;
  const { data, error } = await db
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return sampleSubmissions;
  return data as Submission[];
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = getAdminClient();
  if (!db) return sampleSubscribers;
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return sampleSubscribers;
  return data as NewsletterSubscriber[];
}

// Admin reads return ALL statuses (not just published) so the dashboard can
// manage drafts/pending/rejected too. In demo mode they reuse the seed data.
export async function getAdminEvents(): Promise<AppEvent[]> {
  const db = getAdminClient();
  if (!db) return sampleEvents;
  const { data, error } = await db.from("events").select("*").order("created_at", { ascending: false });
  return error || !data ? sampleEvents : (data as AppEvent[]);
}

export async function getAdminPreaching(): Promise<PreachingItem[]> {
  const db = getAdminClient();
  if (!db) return samplePreaching;
  const { data, error } = await db.from("preaching_items").select("*").order("created_at", { ascending: false });
  return error || !data ? samplePreaching : (data as PreachingItem[]);
}

export async function getAdminPodcast(): Promise<PodcastEpisode[]> {
  const db = getAdminClient();
  if (!db) return samplePodcast;
  const { data, error } = await db.from("podcast_episodes").select("*").order("created_at", { ascending: false });
  return error || !data ? samplePodcast : (data as PodcastEpisode[]);
}

export async function getAdminMaterials(): Promise<Material[]> {
  const db = getAdminClient();
  if (!db) return sampleMaterials;
  const { data, error } = await db.from("materials").select("*").order("created_at", { ascending: false });
  return error || !data ? sampleMaterials : (data as Material[]);
}

export async function getAdminPrayers(): Promise<PrayerRequest[]> {
  const db = getAdminClient();
  if (!db) return samplePrayers;
  const { data, error } = await db.from("prayer_requests").select("*").order("created_at", { ascending: false });
  return error || !data ? samplePrayers : (data as PrayerRequest[]);
}

/** Aggregate counts for the admin analytics cards. */
export async function getAdminStats() {
  const db = getAdminClient();

  // Fallback (demo) numbers from seed data.
  if (!db) {
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
