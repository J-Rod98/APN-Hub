import approvedEvents from "../content/approved-events.json";
// ============================================================================
// APN Hub — static catalog access.
// ----------------------------------------------------------------------------
// The first release has no database dependency. Every public page reads the
// manually curated catalog that is committed with the site.
// ============================================================================

import {
  events,
  materials,
  podcast,
  preaching,
} from "./catalog";
import type { AppEvent, Material, PodcastEpisode, PreachingItem } from "./types";

export function getEvents(): AppEvent[] {
  return [...events, ...(approvedEvents as AppEvent[])];
}

export function getPreaching(): PreachingItem[] {
  return preaching;
}

export function getPodcast(): PodcastEpisode[] {
  return podcast;
}

export function getMaterials(): Material[] {
  return materials;
}

export function getEventById(id: string): AppEvent | null {
  return getEvents().find((event) => event.id === id) ?? null;
}

export function getPreachingById(id: string): PreachingItem | null {
  return preaching.find((item) => item.id === id) ?? null;
}

export function getPodcastById(id: string): PodcastEpisode | null {
  return podcast.find((episode) => episode.id === id) ?? null;
}
