// ============================================================================
// APN's hand-curated launch catalog.
// ----------------------------------------------------------------------------
// This file is the single source of truth for the static first release.
// Add only content APN has verified and has permission to feature. The site
// deliberately shows an honest empty state when a collection has no entries.
// ============================================================================

import type { AppEvent, Material, PodcastEpisode, PreachingItem } from "./types";

const publishedAt = "2026-07-16T00:00:00.000Z";

export const events: AppEvent[] = [];

export const preaching: PreachingItem[] = [];

export const podcast: PodcastEpisode[] = [
  {
    id: "cleansing-of-the-leper",
    title: "The Cleansing of the Leper",
    episode_number: null,
    guest: null,
    description: "Listen to this featured Apostolic message on Spotify.",
    duration: null,
    media_url: "https://open.spotify.com/episode/1kfHQ5k62CQgN8iUgbcbbs",
    status: "published",
    created_at: publishedAt,
  },
];

export const materials: Material[] = [];
