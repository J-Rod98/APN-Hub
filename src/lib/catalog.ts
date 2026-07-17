// ============================================================================
// APN's hand-curated launch catalog.
// ----------------------------------------------------------------------------
// This file is the single source of truth for the static first release.
// Add only content APN has verified and has permission to feature. The site
// deliberately shows an honest empty state when a collection has no entries.
// ============================================================================

import type { AppEvent, Material, PodcastEpisode, PreachingItem } from "./types";

const publishedAt = "2026-07-17T00:00:00.000Z";
const childrensMinistriesCalendar =
  "https://upci.org/wp-content/uploads/2026/02/2026-DATES-CM.pdf";

export const events: AppEvent[] = [
  {
    id: "upci-trainup-bismarck-2026",
    title: "UPCI TrainUp — Bismarck",
    description:
      "A UPCI Children’s Ministries training event. See the official calendar for registration and schedule details.",
    event_date: "2026-08-20",
    event_time: null,
    city: "Bismarck",
    state: "ND",
    church_name: null,
    speaker: "Pastor Shane Paulson",
    category: "Conference",
    source_url: childrensMinistriesCalendar,
    contact_email: null,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "upci-general-conference-2026",
    title: "UPCI General Conference 2026",
    description:
      "The United Pentecostal Church International’s annual General Conference in Salt Lake City.",
    event_date: "2026-09-29",
    event_time: null,
    city: "Salt Lake City",
    state: "UT",
    church_name: null,
    speaker: null,
    category: "Conference",
    source_url: "https://upci.org/upci-to-celebrate-80th-anniversary-in-st-louis/",
    contact_email: null,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "upci-trainup-dallas-2026",
    title: "UPCI TrainUp — Dallas",
    description:
      "A UPCI Children’s Ministries training event. See the official calendar for registration and schedule details.",
    event_date: "2026-10-15",
    event_time: null,
    city: "Dallas",
    state: "TX",
    church_name: null,
    speaker: "Pastor Mark Foster",
    category: "Conference",
    source_url: childrensMinistriesCalendar,
    contact_email: null,
    status: "published",
    created_at: publishedAt,
  },
];

export const preaching: PreachingItem[] = [
  {
    id: "through-new-eyes-jonathan-downs",
    title: "Through New Eyes",
    speaker: "Pastor Jonathan Downs",
    topic: null,
    scripture_reference: null,
    description: "A featured message from Calvary Chapel’s online service archive.",
    media_url: "https://www.youtube.com/watch?v=zUO2s9uim0Q",
    media_type: "video",
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "a-call-to-worship-kym-swile",
    title: "A Call To Worship",
    speaker: "Rev. Kym Swile",
    topic: "Worship",
    scripture_reference: null,
    description: "A featured message from Calvary Chapel’s online service archive.",
    media_url: "https://www.youtube.com/watch?v=571Dwsk1Ps8",
    media_type: "video",
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "faithfulness-in-a-fickle-world-john-downs",
    title: "Faithfulness in a Fickle World",
    speaker: "Bishop John Downs",
    topic: null,
    scripture_reference: null,
    description: "A featured message from Calvary Chapel’s online service archive.",
    media_url: "https://www.youtube.com/watch?v=oiH0Vm7NhvI",
    media_type: "video",
    status: "published",
    created_at: publishedAt,
  },
];

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
  {
    id: "apostolic-life-in-the-21st-century",
    title: "Apostolic Life in the 21st Century",
    episode_number: null,
    guest: "Dr. David K. Bernard",
    description:
      "Weekly teaching on Scripture, theology, Christian living, church history, and contemporary issues from an Apostolic Pentecostal perspective.",
    duration: null,
    media_url: "https://open.spotify.com/show/29oEKyZAXievg3dyzdA63s",
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "reflections-upci",
    title: "Reflections UPCI",
    episode_number: null,
    guest: "Ladies Ministries UPCI",
    description:
      "Conversations and Apostolic resources designed to encourage, equip, and empower women for life and service.",
    duration: null,
    media_url: "https://open.spotify.com/show/07xYABSct5gSONhEZ3W82a",
    status: "published",
    created_at: publishedAt,
  },
];

export const materials: Material[] = [
  {
    id: "discipleship-now",
    title: "Discipleship Now",
    category: "Discipleship & Bible Study",
    description:
      "UPCI video and small-group resources for discipleship and church growth.",
    file_type: "Link",
    file_url: "https://discipleshipnow.com/",
    is_premium: false,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "ministry-central",
    title: "Ministry Central",
    category: "Leadership & Ministry Training",
    description:
      "Training and leadership resources for ministers and local church leaders, including free Strategic Growth and SafeChurch material.",
    file_type: "Link",
    file_url: "https://ministrycentral.com/",
    is_premium: false,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "safechurch-upci",
    title: "SafeChurch UPCI",
    category: "Church Safety",
    description:
      "UPCI resources to help churches develop policies and practices that prevent abuse and create a culture of safety.",
    file_type: "Link",
    file_url: "https://upci.org/SafeChurch/",
    is_premium: false,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "upci-church-advancement",
    title: "UPCI Church Advancement",
    category: "Evangelism & Outreach",
    description:
      "Evangelism, discipleship, training, and outreach resources serving diverse communities across North America.",
    file_type: "Link",
    file_url: "https://cv.upci.org/",
    is_premium: false,
    status: "published",
    created_at: publishedAt,
  },
  {
    id: "upci-office-of-education",
    title: "UPCI Office of Education & Endorsement",
    category: "Education & Training",
    description:
      "A directory of Apostolic education, ministry training, Bible colleges, and downloadable resource information.",
    file_type: "Link",
    file_url: "https://oee.upci.org/",
    is_premium: false,
    status: "published",
    created_at: publishedAt,
  },
];
