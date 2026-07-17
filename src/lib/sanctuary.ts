// ============================================================================
// "Sanctuary Light" design assets.
// ----------------------------------------------------------------------------
// Hero photography is drawn from UPCI's public homepage imagery. It depicts
// real Apostolic Pentecostal worship, baptism, missions, and community rather
// than generic or generated imagery. The images remain hosted by UPCI and are
// credited wherever they appear in the experience.
// ============================================================================

import { PREACHING_TOPICS } from "./constants";

const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`;

/** Rotating full-bleed hero backgrounds (4, cross-fading). */
export const HERO_IMAGES = [
  {
    src: "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider8.jpg",
    alt: "A worshipper with raised hands at a UPCI gathering.",
    credit: "Photo courtesy of UPCI",
    creditHref: "https://upci.org/",
  },
  {
    src: "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider4.jpg",
    alt: "UPCI worship leaders singing together.",
    credit: "Photo courtesy of UPCI",
    creditHref: "https://upci.org/",
  },
  {
    src: "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider7.jpg",
    alt: "A baptism at an Apostolic Pentecostal church.",
    credit: "Photo courtesy of UPCI",
    creditHref: "https://upci.org/",
  },
  {
    src: "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider6.jpg",
    alt: "Children smiling at a UPCI global ministry gathering.",
    credit: "Photo courtesy of UPCI",
    creditHref: "https://upci.org/",
  },
] as const;

export const heroImage = (i: number) => HERO_IMAGES[i % HERO_IMAGES.length].src;

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
