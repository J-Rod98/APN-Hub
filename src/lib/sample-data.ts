// ============================================================================
// APN Hub — built-in seed data (no-database fallback)
// ----------------------------------------------------------------------------
// Mirrors supabase/seed.sql. Used by the data layer when Supabase isn't
// configured, so the full UI renders populated for previews and demos.
// ============================================================================

import type {
  AppEvent,
  PreachingItem,
  PodcastEpisode,
  Material,
  PrayerRequest,
  Submission,
  NewsletterSubscriber,
} from "./types";

const now = "2026-06-22T12:00:00.000Z";

export const sampleEvents: AppEvent[] = [
  { id: "e1", title: "Arkansas Youth Rally", description: "A powerful night of worship and preaching for apostolic youth across the region.", event_date: "2026-07-12", event_time: "7:00 PM", city: "Little Rock", state: "AR", church_name: "First Apostolic Church", speaker: "Rev. D. Mitchell", category: "Youth Rally", source_url: "https://example.com/youth-rally", contact_email: "info@firstapostolic.org", status: "published", created_at: now },
  { id: "e2", title: "Revival Weekend", description: "Three nights of revival — preaching, worship, and prayer for an outpouring.", event_date: "2026-07-19", event_time: "7:30 PM", city: "Dallas", state: "TX", church_name: "Pentecostals of Dallas", speaker: "Pastor J. Reyes", category: "Revival", source_url: "https://example.com/revival", contact_email: "revival@podallas.org", status: "published", created_at: now },
  { id: "e3", title: "Apostolic Music Night", description: "An evening of anointed apostolic worship and special music.", event_date: "2026-07-26", event_time: "6:00 PM", city: "Memphis", state: "TN", church_name: "Holy Ghost Temple", speaker: "Worship & Praise", category: "Music", source_url: "https://example.com/music-night", contact_email: "music@hgtemple.org", status: "published", created_at: now },
  { id: "e4", title: "Summer Camp Meeting", description: "A week of family camp meeting with daily services and youth activities.", event_date: "2026-08-04", event_time: "10:00 AM", city: "Tulsa", state: "OK", church_name: "Apostolic Tabernacle", speaker: "Multiple Speakers", category: "Camp Meeting", source_url: "https://example.com/camp", contact_email: "camp@apostolictab.org", status: "published", created_at: now },
  { id: "e5", title: "Regional Apostolic Conference", description: "Two days of teaching for pastors, leaders, and saints.", event_date: "2026-08-15", event_time: "9:00 AM", city: "Baton Rouge", state: "LA", church_name: "Christ Apostolic Center", speaker: "Bishop A. Carter", category: "Conference", source_url: "https://example.com/conference", contact_email: "events@cacenter.org", status: "published", created_at: now },
];

export const samplePreaching: PreachingItem[] = [
  { id: "p1", title: "Buried With Him in Baptism", speaker: "Rev. D. Mitchell", topic: "Baptism in Jesus' Name", scripture_reference: "Acts 2:38", description: "The biblical pattern of water baptism in the name of Jesus Christ.", media_url: "https://example.com/sermon1", media_type: "video", status: "published", created_at: now },
  { id: "p2", title: "Receiving the Promise", speaker: "Pastor J. Reyes", topic: "Holy Ghost", scripture_reference: "Acts 2:1-4", description: "How to receive the gift of the Holy Ghost with the evidence of speaking in tongues.", media_url: "https://example.com/sermon2", media_type: "video", status: "published", created_at: now },
  { id: "p3", title: "One God Revealed", speaker: "Bishop A. Carter", topic: "Oneness of God", scripture_reference: "Colossians 2:9", description: "Understanding the mighty God in Christ — one God, revealed in Jesus.", media_url: "https://example.com/sermon3", media_type: "audio", status: "published", created_at: now },
  { id: "p4", title: "A Praying Church", speaker: "Sis. R. Daniels", topic: "Prayer", scripture_reference: "1 Thessalonians 5:17", description: "How a praying church becomes a moving, growing church.", media_url: "https://example.com/sermon4", media_type: "video", status: "published", created_at: now },
  { id: "p5", title: "Set Apart", speaker: "Pastor M. Alvarez", topic: "Holiness", scripture_reference: "1 Peter 1:16", description: "Practical holiness for everyday apostolic living.", media_url: "https://example.com/sermon5", media_type: "audio", status: "published", created_at: now },
  { id: "p6", title: "Enter His Presence", speaker: "Worship Team", topic: "Worship", scripture_reference: "Psalm 100:4", description: "Entering His presence through anointed apostolic worship.", media_url: "https://example.com/sermon6", media_type: "video", status: "published", created_at: now },
];

export const samplePodcast: PodcastEpisode[] = [
  { id: "pc1", title: "The Apostolic Life", episode_number: 42, guest: "Pastor M. Alvarez", description: "Staying faithful while traveling in ministry.", duration: "52 min", media_url: "https://example.com/ep42", status: "published", created_at: now },
  { id: "pc2", title: "Revival Conversations", episode_number: 41, guest: "Evang. T. Brooks", description: "What it takes to see revival in your city.", duration: "47 min", media_url: "https://example.com/ep41", status: "published", created_at: now },
  { id: "pc3", title: "Doctrine That Matters", episode_number: 40, guest: "Dr. L. Crane", description: "Why apostolic doctrine still matters today.", duration: "61 min", media_url: "https://example.com/ep40", status: "published", created_at: now },
  { id: "pc4", title: "Stories From the Pew", episode_number: 39, guest: "Sis. R. Daniels", description: "Testimonies of God's faithfulness from everyday saints.", duration: "38 min", media_url: "https://example.com/ep39", status: "published", created_at: now },
];

export const sampleMaterials: Material[] = [
  { id: "m1", title: "Why We Baptize in Jesus' Name", category: "Doctrine Sheets", description: "A clear, scriptural explanation perfect for new converts and seekers.", file_type: "PDF", file_url: "https://example.com/baptism.pdf", is_premium: false, status: "published", created_at: now },
  { id: "m2", title: "30-Day New Convert Guide", category: "New Convert Lessons", description: "A daily devotional path to ground new believers in the faith.", file_type: "PDF", file_url: "https://example.com/newconvert.pdf", is_premium: false, status: "published", created_at: now },
  { id: "m3", title: "Home Bible Study — Lesson 1", category: "Bible Study Lessons", description: "An editable, easy-to-teach lesson for one-on-one home studies.", file_type: "DOC", file_url: "https://example.com/lesson1.doc", is_premium: false, status: "published", created_at: now },
  { id: "m4", title: "Prayer & Fasting Guide", category: "Prayer Guides", description: "A 21-day guided plan with scriptures, prompts, and journaling space.", file_type: "PDF", file_url: "https://example.com/prayer-fasting.pdf", is_premium: false, status: "published", created_at: now },
  { id: "m5", title: "Youth Night Lesson Pack", category: "Youth Lessons", description: "Editable slides, graphics, and discussion guides for youth services.", file_type: "Canva", file_url: "https://example.com/youth-pack", is_premium: false, status: "published", created_at: now },
  { id: "m6", title: "Outreach Follow-Up Card", category: "Outreach Flyers", description: "A printable, editable card to follow up with first-time visitors.", file_type: "Canva", file_url: "https://example.com/followup", is_premium: false, status: "published", created_at: now },
];

export const samplePrayers: PrayerRequest[] = [
  { id: "pr1", name: "Maria", title: "Pray for healing", request_text: "Believing God for a full healing for my mother this week.", category: "Healing", city: "Houston", state: "TX", is_public: true, prayer_count: 24, status: "approved", created_at: now },
  { id: "pr2", name: null, title: "Pray for my family", request_text: "Asking for unity and salvation for my whole household.", category: "Family", city: null, state: null, is_public: true, prayer_count: 41, status: "approved", created_at: now },
  { id: "pr3", name: "James", title: "Pray for direction", request_text: "Seeking God's will for a big decision coming up. Thank you saints.", category: "Direction", city: "Little Rock", state: "AR", is_public: true, prayer_count: 18, status: "approved", created_at: now },
  { id: "pr4", name: null, title: "Pray for revival in my city", request_text: "Crying out for an outpouring of the Spirit across our city.", category: "Revival", city: "Memphis", state: "TN", is_public: true, prayer_count: 63, status: "approved", created_at: now },
];

// A few pending items so the admin dashboard demo has a review queue.
export const sampleSubmissions: Submission[] = [
  { id: "s1", submission_type: "event", submitter_name: "Pastor K. Lewis", submitter_email: "klewis@example.org", title: "Fall Apostolic Conference", description: "A regional conference for leaders and saints.", content_data: { city: "Phoenix", state: "AZ", event_date: "2026-09-20", category: "Conference" }, source_url: "https://example.com/fall-conf", status: "pending", admin_notes: null, created_at: now },
  { id: "s2", submission_type: "testimony", submitter_name: "Anonymous", submitter_email: null, title: "Healed of chronic pain", description: "God healed me after years of pain during a prayer service.", content_data: {}, source_url: null, status: "pending", admin_notes: null, created_at: now },
  { id: "s3", submission_type: "material", submitter_name: "Sis. A. Gomez", submitter_email: "agomez@example.org", title: "Children's Sunday School Pack", description: "12 lessons with coloring pages.", content_data: { category: "Sunday School", file_type: "PDF" }, source_url: "https://example.com/kids-pack", status: "pending", admin_notes: null, created_at: now },
];

export const sampleSubscribers: NewsletterSubscriber[] = [
  { id: "n1", email: "saint1@example.com", phone: null, state: "AR", created_at: now },
  { id: "n2", email: "saint2@example.com", phone: "555-0102", state: "TX", created_at: now },
  { id: "n3", email: "saint3@example.com", phone: null, state: "TN", created_at: now },
];
