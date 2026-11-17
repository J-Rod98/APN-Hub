import { discoveredMedia } from "./discovered-content";
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
  return [...preaching,...discoveredMedia.filter(x=>x.kind==="sermon").map((x):PreachingItem=>({id:x.id,title:x.title,description:x.description,speaker:null,source_creator:x.creator,topic:null,scripture_reference:null,media_url:x.sourceUrl,media_type:"video",embed_allowed:x.embedAllowed,status:"published",created_at:x.publishedAt}))];
}

export function getPodcast(): PodcastEpisode[] {
  return [...podcast,...discoveredMedia.filter(x=>x.kind==="podcast").map((x):PodcastEpisode=>({id:x.id,title:x.title,description:x.description,episode_number:null,source_creator:x.creator,guest:null,duration:null,media_url:x.sourceUrl,embed_allowed:x.embedAllowed,status:"published",created_at:x.publishedAt}))];
}

export function getMaterials(): Material[] {
  return materials;
}

export function getEventById(id: string): AppEvent | null {
  return getEvents().find((event) => event.id === id) ?? null;
}

export function getPreachingById(id: string): PreachingItem | null {
  return getPreaching().find((item) => item.id === id) ?? null;
}

export function getPodcastById(id: string): PodcastEpisode | null {
  return getPodcast().find((episode) => episode.id === id) ?? null;
}
