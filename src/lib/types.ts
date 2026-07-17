// ============================================================================
// APN Hub — content models
// ----------------------------------------------------------------------------
// These TypeScript types define APN's local, hand-curated content catalog.
// ============================================================================

export type ContentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "published"
  | "draft";

export type SubmissionType =
  | "event"
  | "sermon"
  | "podcast"
  | "music"
  | "material"
  | "testimony"
  | "news"
  | "prayer";

export type MediaType = "video" | "audio";

export type FileType = "PDF" | "DOC" | "Canva" | "Audio" | "Video" | "Link";

// Shared timestamp fields ----------------------------------------------------
interface Timestamps {
  created_at: string;
  updated_at?: string;
}

export interface AppEvent extends Timestamps {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null; // ISO date
  /** Inclusive final date for multi-day gatherings. */
  end_date: string | null;
  event_time: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  church_name: string | null;
  speaker: string | null;
  category: string | null;
  /** A public, source-owned event or ministry image. Never a generated image. */
  image_url: string | null;
  image_alt: string | null;
  /** Attribution for the image shown on the public event card. */
  image_credit?: string | null;
  image_credit_url?: string | null;
  /** Short, verified details shown on the event page. */
  highlights: string[];
  source_url: string | null;
  contact_email: string | null;
  status: ContentStatus;
}

export interface PreachingItem extends Timestamps {
  id: string;
  title: string;
  speaker: string | null;
  topic: string | null;
  scripture_reference: string | null;
  description: string | null;
  media_url: string | null;
  media_type: MediaType | null;
  status: ContentStatus;
}

export interface PodcastEpisode extends Timestamps {
  id: string;
  title: string;
  /** Official podcast or episode cover shown wherever this item is played. */
  image_url?: string | null;
  image_alt?: string | null;
  episode_number: number | null;
  guest: string | null;
  description: string | null;
  duration: string | null;
  media_url: string | null;
  status: ContentStatus;
}

export interface Material extends Timestamps {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  file_type: FileType | null;
  file_url: string | null;
  is_premium: boolean;
  status: ContentStatus;
}

export interface PrayerRequest extends Timestamps {
  id: string;
  name: string | null;
  title: string | null;
  request_text: string;
  category: string | null;
  city: string | null;
  state: string | null;
  is_public: boolean;
  prayer_count: number;
  status: ContentStatus;
}

export interface Submission extends Timestamps {
  id: string;
  submission_type: SubmissionType;
  submitter_name: string | null;
  submitter_email: string | null;
  title: string | null;
  description: string | null;
  content_data: Record<string, unknown>;
  source_url: string | null;
  status: ContentStatus;
  admin_notes: string | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  phone: string | null;
  state: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: "event" | "preaching" | "material" | "prayer";
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "editor";
  created_at: string;
}
