// ============================================================================
// Playable-media detection.
// ----------------------------------------------------------------------------
// Returns a real, embeddable source ONLY for URLs we can genuinely play
// (Spotify, YouTube, or a direct audio file). Anything else returns null, and
// callers must then NOT render a play control — we never fake playback.
//
// Only allow-listed providers are embedded in an <iframe>; arbitrary
// user-submitted URLs are never framed.
// ============================================================================

import { safeUrl } from "./utils";

export type PlayableKind = "spotify" | "youtube" | "audio";

export interface Playable {
  kind: PlayableKind;
  /** Source to put in the iframe/audio element. */
  src: string;
  /** Original link, for the "open in ..." fallback link. */
  href: string;
}

const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|oga|wav)(\?.*)?$/i;

export function getPlayable(rawUrl: string | null | undefined): Playable | null {
  const url = safeUrl(rawUrl); // http(s) only — blocks javascript: etc.
  if (!url) return null;

  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, "");

  // --- Spotify: /episode/ID, /show/ID, /track/ID, /album/ID, /playlist/ID ---
  if (host === "open.spotify.com") {
    const m = u.pathname.match(/^\/(episode|show|track|album|playlist)\/([A-Za-z0-9]+)/);
    if (m) {
      return { kind: "spotify", src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, href: url };
    }
    return null;
  }

  // --- YouTube: watch?v=ID, youtu.be/ID, /embed/ID, /live/ID ---
  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const v = u.searchParams.get("v");
    if (v) return { kind: "youtube", src: `https://www.youtube.com/embed/${v}`, href: url };
    const m = u.pathname.match(/^\/(embed|live|shorts)\/([A-Za-z0-9_-]+)/);
    if (m) return { kind: "youtube", src: `https://www.youtube.com/embed/${m[2]}`, href: url };
    return null;
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    if (id) return { kind: "youtube", src: `https://www.youtube.com/embed/${id}`, href: url };
    return null;
  }

  // --- Direct audio file ---
  if (AUDIO_EXT.test(u.pathname)) {
    return { kind: "audio", src: url, href: url };
  }

  // Unknown provider — not playable in-page. Caller should link out instead.
  return null;
}
