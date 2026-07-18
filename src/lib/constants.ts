// ============================================================================
// APN Hub — shared constants (categories, nav, submission types)
// Single source of truth for dropdowns, filter chips, and navigation.
// ============================================================================

import type { SubmissionType } from "./types";

export const EVENT_CATEGORIES = [
  "Revival",
  "Youth Rally",
  "Conference",
  "Camp Meeting",
  "Music",
  "Prayer",
  "Bible Study",
  "Special Service",
] as const;

export const PREACHING_TOPICS = [
  "Baptism in Jesus' Name",
  "Holy Ghost",
  "Oneness of God",
  "Prayer",
  "Holiness",
  "Worship",
  "Revival",
  "Apostolic Identity",
  "Evangelism",
] as const;

export const MATERIAL_CATEGORIES = [
  "Discipleship & Bible Study",
  "Leadership & Ministry Training",
  "Church Safety",
  "Evangelism & Outreach",
  "Education & Training",
] as const;

export const PRAYER_CATEGORIES = [
  "Healing",
  "Family",
  "Direction",
  "Salvation",
  "Revival",
  "Church",
  "Urgent",
  "Other",
] as const;

export const FILE_TYPES = ["PDF", "DOC", "Canva", "Audio", "Video", "Link"] as const;

// US states (kept short but complete) ----------------------------------------
export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
] as const;

// Submission types shown in the central /submit form -------------------------
export const SUBMISSION_TYPES: { value: SubmissionType; label: string; icon: string }[] = [
  { value: "event", label: "Event", icon: "📅" },
  { value: "sermon", label: "Sermon / Preaching", icon: "🎧" },
  { value: "podcast", label: "Podcast Episode", icon: "🎙️" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "material", label: "Material / Resource", icon: "📄" },
  { value: "testimony", label: "Testimony", icon: "🙌" },
  { value: "news", label: "News Tip", icon: "📰" },
  { value: "prayer", label: "Prayer Request", icon: "🙏" },
];

// Primary navigation ---------------------------------------------------------
// NOTE: "Submit" is intentionally NOT listed here — it renders once as the CTA
// button in the navbar. Having it in both places produced two Submit controls.
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/preaching", label: "Sermons" },
  { href: "/podcast", label: "Podcasts" },
  { href: "/events", label: "Events" },
  { href: "/materials", label: "Resources" },
  { href: "/about", label: "What We Believe" },
] as const;

// Sticky mobile bottom nav (subset, with icons) ------------------------------
export const BOTTOM_NAV = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/events", label: "Events", icon: "📅" },
  { href: "/preaching", label: "Preaching", icon: "🎧" },
  { href: "/materials", label: "Resources", icon: "📄" },
  { href: "/about", label: "Beliefs", icon: "✝️" },
] as const;
