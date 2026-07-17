// ============================================================================
// "Sanctuary Light" design assets.
// ----------------------------------------------------------------------------
// TEMPORARY LAUNCH ASSETS: these Unsplash photos come from the approved design
// and stand in until real thumbnails exist. Content tables have no image column
// yet, so sermon art is assigned deterministically by index (stable per card,
// never random). To replace: add an `image_url` to the content model and read
// it here instead.
// ============================================================================

import { PREACHING_TOPICS } from "./constants";

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`;

/** Rotating full-bleed hero backgrounds (4, cross-fading). */
export const HERO_IMAGE_IDS = [
  "1507692049790-de58290a4334",
  "1478147427282-58a87a120781",
  "1579975096649-e773152b04cb",
  "1622598453695-4fbaf151aadc",
];

export const heroImage = (i: number, w = 2200) => unsplash(HERO_IMAGE_IDS[i], w);

/** Sermon card art — cycles the design's three photos by index. */
const SERMON_IMAGE_IDS = [
  "1438232992991-995b7058bbb3",
  "1477281765962-ef34e8bb0967",
  "1508829040592-72f179f8a73f",
];

export const sermonImage = (i: number, w = 800) =>
  unsplash(SERMON_IMAGE_IDS[i % SERMON_IMAGE_IDS.length], w);

export const prayerImage = (w = 900) => unsplash("1550633600-4cfc6929e592", w);
export const newsletterImage = (w = 1600) => unsplash("1579975096649-e773152b04cb", w);

/** "Browse by Topic" tiles — mapped to the real preaching topics we filter by. */
export const TOPIC_TILES: { topic: string; label: string; icon: string; blurb: string; warm: boolean }[] = [
  { topic: "Baptism in Jesus' Name", label: "Baptism", icon: "💧", blurb: "Acts 2:38 & the new birth", warm: false },
  { topic: "Holy Ghost", label: "Holy Ghost", icon: "🔥", blurb: "The promise & infilling", warm: true },
  { topic: "Oneness of God", label: "Oneness", icon: "✝️", blurb: "The one true God", warm: false },
  { topic: "Holiness", label: "Holiness", icon: "🕊️", blurb: "A consecrated life", warm: true },
  { topic: "Prayer", label: "Prayer", icon: "🙏", blurb: "The altar & intercession", warm: false },
  { topic: "Apostolic Identity", label: "Identity", icon: "🧭", blurb: "Who we are & what we believe", warm: true },
  { topic: "Worship", label: "Worship", icon: "🙌", blurb: "Entering His presence", warm: false },
  { topic: "Revival", label: "Revival", icon: "⛰️", blurb: "Outpouring & the altar", warm: true },
  { topic: "Evangelism", label: "Missions", icon: "🌍", blurb: "Reaching the world", warm: false },
];

// Guard: every tile must map to a real topic we can filter preaching by.
export const VALID_TOPIC_TILES = TOPIC_TILES.filter((t) =>
  (PREACHING_TOPICS as readonly string[]).includes(t.topic),
);
