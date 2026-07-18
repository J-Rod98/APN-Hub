"use client";
/* eslint-disable @next/next/no-img-element */
// ============================================================================
// Sanctuary Light homepage.
// ----------------------------------------------------------------------------
// Implements the approved "APN Sanctuary Light" design, wired to APN's local
// curated catalog. Two rules this file holds to:
//   1. Play controls render ONLY when getPlayable() finds a real media source.
//      Items without playable media link to their detail page instead — we
//      never show a play button that can't play.
//   2. Hero photos are public UPCI imagery; sermon thumbnails come from each
//      original video where available (see lib/sanctuary.ts).
// ============================================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlayerModal, type PlayerItem } from "./PlayerModal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getPlayable, getVideoThumbnail } from "@/lib/media";
import {
  HERO_IMAGES,
  newsletterImage,
  sermonImage,
  VALID_TOPIC_TILES,
} from "@/lib/sanctuary";
import { resolveEventImage } from "@/lib/event-images";
import { dateBadge, safeUrl } from "@/lib/utils";
import type {
  AppEvent,
  PodcastEpisode,
  PreachingItem,
} from "@/lib/types";

interface Props {
  events: AppEvent[];
  preaching: PreachingItem[];
  podcast: PodcastEpisode[];
  /** Index of today's featured sermon, computed server-side to avoid hydration drift. */
  featuredIndex: number;
}

// --- helpers ---------------------------------------------------------------

function sermonToPlayer(p: PreachingItem, i: number): PlayerItem | null {
  const playable = getPlayable(p.media_url);
  if (!playable) return null;
  return {
    title: p.title,
    topic: p.topic ?? "",
    meta: [p.speaker, p.scripture_reference].filter(Boolean).join(" · "),
    badge: playable.kind === "youtube" ? "VIDEO" : "AUDIO",
    image: getVideoThumbnail(p.media_url) ?? sermonImage(i),
    playable,
  };
}

function podcastToPlayer(e: PodcastEpisode, i: number): PlayerItem | null {
  const playable = getPlayable(e.media_url);
  if (!playable) return null;
  return {
    title: e.title,
    topic: "Podcast",
    meta: [e.guest ? `with ${e.guest}` : null, e.duration].filter(Boolean).join(" · "),
    badge: "PODCAST",
    image: e.image_url ?? sermonImage(i),
    playable,
  };
}

const PlayTriangle = ({ size = 20 }: { size?: number }) => (
  <span
    aria-hidden
    style={{
      borderLeft: `${size}px solid #1452d6`,
      borderTop: `${size * 0.6}px solid transparent`,
      borderBottom: `${size * 0.6}px solid transparent`,
      marginLeft: size * 0.25,
    }}
  />
);

// ============================================================================

export function SanctuaryHome({ events, preaching, podcast, featuredIndex }: Props) {
  const [playing, setPlaying] = useState<PlayerItem | null>(null);
  const [q, setQ] = useState("");
  const router = useRouter();

  const sermons = useMemo(() => preaching.slice(0, 3), [preaching]);
  const featured = useMemo(() => {
    if (featuredIndex < 0 || !preaching[featuredIndex]) return null;
    return { item: preaching[featuredIndex], player: sermonToPlayer(preaching[featuredIndex], featuredIndex) };
  }, [preaching, featuredIndex]);
  const topicTiles = useMemo(
    () => VALID_TOPIC_TILES.filter((tile) => preaching.some((item) => item.topic === tile.topic)),
    [preaching],
  );

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/preaching/?q=${encodeURIComponent(term)}` : "/preaching/");
  }

  return (
    <div className="bg-sanctuary-bg text-sanctuary-ink">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[760px] flex-col overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[0].src}
            alt=""
            aria-hidden
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-slide absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,38,0.84)_0%,rgba(8,16,38,0.62)_50%,rgba(10,20,48,0.88)_100%)] sm:bg-[linear-gradient(180deg,rgba(8,16,38,0.72)_0%,rgba(8,16,38,0.35)_42%,rgba(10,20,48,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_78%_8%,rgba(47,139,255,0.28),transparent_62%)]" />
        <a
          href={HERO_IMAGES[0].creditHref}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-4 right-5 z-[3] rounded-full border border-white/25 bg-[#081026]/55 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white/85 backdrop-blur-sm transition hover:bg-[#081026]/80 hover:text-white sm:bottom-5 sm:right-8"
        >
          {HERO_IMAGES[0].credit}
        </a>

        {/* content (pt clears the overlaid navbar) */}
        <div className="relative z-[2] mx-auto flex w-full max-w-[1240px] flex-1 flex-col justify-center px-5 pb-8 pt-[122px] sm:px-10">
          <div className="max-w-[760px] animate-fadein">
            <div className="inline-flex items-center gap-2 rounded-[22px] border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#bfe0ff] backdrop-blur-sm">
              ✦ Spirit-filled · Trustworthy · Free
            </div>
            <h1 className="mt-6 font-serif text-[40px] font-medium leading-[1.04] tracking-[-0.02em] text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.3)] sm:text-[54px] lg:text-[66px]">
              The Apostolic movement,
              <br />
              gathered in <span className="italic text-sanctuary-sky">one place</span>.
            </h1>
            <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-white/90 sm:text-[19px]">
              Discover trusted sermons, podcasts, events, and resources from across
              the network.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/preaching/"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-sanctuary-ink shadow-[0_12px_28px_rgba(8,16,38,0.32)] transition hover:-translate-y-px hover:bg-sanctuary-chip"
              >
                Explore sermons
              </Link>
              <Link
                href="/events/"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/45 bg-white/[0.12] px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                Browse events
              </Link>
            </div>

            {/* search */}
            <div className="mt-6 max-w-[660px]">
              <div className="mb-2.5 text-[13px] font-semibold text-[#bfe0ff]">
                Search sermons, speakers, or topics
              </div>
              <form
                onSubmit={onSearch}
                className="flex gap-2.5 rounded-[18px] bg-white p-2 pl-[18px] shadow-[0_18px_40px_-14px_rgba(8,16,38,0.55)]"
              >
                <div className="flex flex-1 items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
                    <circle cx="11" cy="11" r="7" stroke="#8a93b0" strokeWidth="2" />
                    <path d="M20 20l-3.2-3.2" stroke="#8a93b0" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    type="search"
                    aria-label="Search sermons, speakers, or topics"
                    placeholder="Search sermons, speakers, or topics…"
                    className="flex-1 border-0 bg-transparent py-3 text-[15.5px] text-sanctuary-ink outline-none placeholder:text-[#8a93b0]"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-11 rounded-[13px] bg-gradient-to-b from-brand to-brand-deep px-6 text-[15px] font-bold text-white transition hover:brightness-110"
                >
                  Search
                </button>
              </form>

            </div>
          </div>
        </div>

        {/* trust row + featured card */}
        <div className="relative z-[2] mx-auto flex w-full max-w-[1240px] flex-wrap items-end justify-between gap-6 px-5 pb-10 sm:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5 text-white">
            {["Manually curated", "Linked to original sources", "Always free"].map(
              (t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="hidden h-4 w-px bg-white/25 sm:block" />}
                  <span className="inline-flex items-center gap-2 text-sm text-white/90">
                    <span className="text-sanctuary-sky">✓</span> {t}
                  </span>
                </span>
              ),
            )}
          </div>

          {featured && (
            <FeaturedCard
              title={featured.item.title}
              meta={[featured.item.speaker, featured.item.media_type ? undefined : null]
                .filter(Boolean)
                .join(" · ")}
              image={getVideoThumbnail(featured.item.media_url) ?? sermonImage(featuredIndex)}
              player={featured.player}
              href={`/preaching/${featured.item.id}`}
              onPlay={setPlaying}
            />
          )}
        </div>
      </section>

      {/* ================= FEATURED PREACHING ================= */}
      <section className="mx-auto max-w-[1240px] px-5 pt-[88px] sm:px-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-sanctuary-link">
              On demand
            </div>
            <h2 className="mt-2 font-serif text-[30px] font-medium text-sanctuary-ink sm:text-[40px]">
              Sound preaching, gathered in one place.
            </h2>
            <p className="mt-2.5 text-[15px] text-sanctuary-muted">
              <span className="text-sanctuary-link">✓</span> Hand-picked for the
              first APN collection.{" "}
              <Link href="/about" className="font-bold text-sanctuary-link hover:text-sanctuary-linkhover">
                Our standards →
              </Link>
            </p>
          </div>
          <Link href="/preaching/" className="text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover">
            View all →
          </Link>
        </div>

        {sermons.length === 0 ? (
          <EmptyPanel text="No sermons published yet." href="/submit" cta="Submit a sermon" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((p, i) => {
              const player = sermonToPlayer(p, i);
              const thumbnail = getVideoThumbnail(p.media_url) ?? sermonImage(i);
              return (
                <article
                  key={p.id}
                  className="overflow-hidden rounded-[20px] border border-sanctuary-line bg-white shadow-[0_10px_30px_-18px_rgba(20,60,140,0.4)] transition duration-200 hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-22px_rgba(20,60,140,0.55)]"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img src={thumbnail} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,16,38,0.05)] to-[rgba(8,16,38,0.5)]" />
                    {/* Badge reflects the real media type; falls back to a neutral label. */}
                    <span className="absolute left-3.5 top-3.5 rounded-xl bg-white/[0.92] px-2.5 py-1 text-[11px] font-bold tracking-wide text-sanctuary-ink">
                      {player ? player.badge : (p.media_type?.toUpperCase() ?? "MESSAGE")}
                    </span>
                    {/* Play button ONLY when we have real playable media. */}
                    {player ? (
                      <button
                        onClick={() => setPlaying(player)}
                        aria-label={`Play ${p.title}`}
                        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-[0_12px_30px_rgba(8,16,38,0.4)] transition hover:scale-110 hover:bg-white"
                      >
                        <PlayTriangle />
                      </button>
                    ) : null}
                  </div>
                  <div className="px-[22px] pb-[22px] pt-5">
                    {p.topic && (
                      <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-sanctuary-link">
                        {p.topic}
                      </div>
                    )}
                    <Link
                      href={`/preaching/${p.id}`}
                      className="mb-1.5 mt-1.5 block font-serif text-[23px] text-sanctuary-ink hover:text-sanctuary-link"
                    >
                      {p.title}
                    </Link>
                    <div className="text-[13px] text-sanctuary-muted">
                      {[p.speaker, p.scripture_reference].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* divider */}
      <div className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-10">
        <div className="h-px bg-[linear-gradient(90deg,transparent,#d5deef_20%,#d5deef_80%,transparent)]" />
      </div>

      {/* ================= EVENTS + PODCASTS ================= */}
      <section className="mx-auto grid max-w-[1240px] gap-11 px-5 pt-[72px] sm:px-10 lg:grid-cols-[1.3fr_1fr]">
        {/* Events */}
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-sanctuary-link">
                Upcoming
              </div>
              <h2 className="mt-2 font-serif text-[32px] font-medium text-sanctuary-ink">
                Upcoming Apostolic gatherings
              </h2>
            </div>
            <Link href="/events" className="text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover">
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-3.5">
            {events.length === 0 ? (
              <EmptyPanel text="No events published yet." href="/submit" cta="Submit an event" />
            ) : (
              events.slice(0, 3).map((e) => {
                const b = dateBadge(e.event_date);
                const artwork = resolveEventImage(e);
                const image = safeUrl(artwork.image_url);
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.id}`}
                    className="flex items-center gap-4 rounded-[18px] border border-sanctuary-line bg-white p-[18px] transition hover:border-[#bcd0f2] hover:shadow-[0_14px_32px_-20px_rgba(20,60,140,0.5)]"
                  >
                    {image ? (
                      <div className="relative h-[68px] w-[88px] shrink-0 overflow-hidden rounded-[14px] bg-sanctuary-chip">
                        <img
                          src={image}
                          alt={artwork.image_alt ?? `${e.title} event artwork`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-1.5 left-1.5 rounded-md bg-[#081026]/85 px-1.5 py-1 text-center leading-none text-white shadow-sm">
                          <div className="text-[8px] font-bold tracking-[0.08em] text-white/80">
                            {b.month}
                          </div>
                          <div className="font-serif text-[16px]">{b.day}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="min-w-[66px] rounded-[14px] border border-sanctuary-chipline bg-sanctuary-chip px-4 py-3 text-center">
                        <div className="text-[11px] font-bold tracking-[0.08em] text-sanctuary-link">
                          {b.month}
                        </div>
                        <div className="font-serif text-[26px] leading-none text-sanctuary-ink">
                          {b.day}
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-[17px] font-bold text-sanctuary-ink">{e.title}</div>
                      <div className="mt-0.5 text-[13px] text-sanctuary-muted">
                        {[e.church_name, [e.city, e.state].filter(Boolean).join(", "), e.event_time]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                    {e.category && (
                      <span className="hidden rounded-xl bg-brand/[0.12] px-3 py-1.5 text-[11px] font-bold text-sanctuary-link sm:block">
                        {e.category}
                      </span>
                    )}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Podcasts */}
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-sanctuary-gold">
                Listen
              </div>
              <h2 className="mt-2 font-serif text-[32px] font-medium text-sanctuary-ink">
                Podcasts
              </h2>
            </div>
            <Link href="/podcast" className="text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover">
              Listen →
            </Link>
          </div>
          <div className="flex flex-col gap-3.5">
            {podcast.length === 0 ? (
              <EmptyPanel text="No episodes yet." href="/submit" cta="Suggest a podcast" />
            ) : (
              podcast.slice(0, 3).map((ep, i) => {
                const player = podcastToPlayer(ep, i);
                const coverImage = ep.image_url;
                const grads = [
                  "from-[#2f8bff] to-[#1452d6]",
                  "from-[#4fc3ff] to-[#2f8bff]",
                  "from-[#e0a437] to-[#c88a20]",
                ];
                return (
                  <div
                    key={ep.id}
                    className="flex gap-4 rounded-[18px] border border-sanctuary-line bg-white p-[15px] transition hover:border-[#bcd0f2] hover:shadow-[0_14px_32px_-20px_rgba(20,60,140,0.5)]"
                  >
                    {player ? (
                      <button
                        onClick={() => setPlaying(player)}
                        aria-label={`Play ${ep.title}`}
                        className={`relative grid h-[60px] w-[60px] shrink-0 place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br text-[23px] transition hover:scale-105 ${grads[i % 3]}`}
                      >
                        {coverImage && (
                          <img
                            src={coverImage}
                            alt={ep.image_alt ?? `${ep.title} podcast artwork`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        )}
                        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-white/90 shadow-sm">
                          <PlayTriangle size={10} />
                        </span>
                      </button>
                    ) : (
                      <div
                        className={`grid h-[60px] w-[60px] shrink-0 place-items-center rounded-[14px] bg-gradient-to-br text-[23px] ${grads[i % 3]}`}
                      >
                        🎙️
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-sanctuary-gold">
                        {[ep.episode_number ? `EP. ${ep.episode_number}` : null, ep.duration?.toUpperCase()]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      <Link
                        href={`/podcast/${ep.id}`}
                        className="mt-0.5 block truncate text-[15px] font-bold text-sanctuary-ink hover:text-sanctuary-link"
                      >
                        {ep.title}
                      </Link>
                      {ep.guest && (
                        <div className="truncate text-xs text-sanctuary-muted">with {ep.guest}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ================= BROWSE BY TOPIC ================= */}
      {topicTiles.length > 0 && (
      <section className="mx-auto max-w-[1240px] px-5 pt-[88px] sm:px-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-sanctuary-link">
              Find what you need
            </div>
            <h2 className="mt-2 font-serif text-[30px] font-medium text-sanctuary-ink sm:text-[40px]">
              Browse by Topic
            </h2>
            <p className="mt-2 text-[15px] text-sanctuary-muted sm:text-base">
              Every sermon, podcast, and resource is organized by subject — jump
              straight to what you&apos;re studying.
            </p>
          </div>
          <Link href="/preaching" className="text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover">
            All topics →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicTiles.map((t) => (
            <Link
              key={t.topic}
              href={`/preaching/?q=${encodeURIComponent(t.topic)}`}
              className="flex items-center gap-4 rounded-[18px] border border-sanctuary-line bg-white px-[22px] py-5 shadow-[0_8px_26px_-20px_rgba(20,60,140,0.45)] transition hover:-translate-y-1 hover:border-[#bcd0f2] hover:shadow-[0_20px_40px_-22px_rgba(20,60,140,0.55)]"
            >
              <span
                className={`grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[13px] text-[22px] ${
                  t.warm
                    ? "bg-[linear-gradient(135deg,#fff0d6,#ffe0a8)]"
                    : "bg-[linear-gradient(135deg,#e6f0ff,#cfe2ff)]"
                }`}
                aria-hidden
              >
                {t.icon}
              </span>
              <span>
                <span className="block font-serif text-[21px] leading-tight text-sanctuary-ink">
                  {t.label}
                </span>
                <span className="mt-0.5 block text-[13px] text-sanctuary-soft">{t.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* ================= LAUNCH LIST ================= */}
      <section id="newsletter" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pt-[88px] sm:px-10">
        <div className="relative grid items-center gap-11 overflow-hidden rounded-[28px] px-6 py-12 shadow-[0_28px_60px_-24px_rgba(20,82,214,0.5)] sm:px-[52px] sm:py-[60px] lg:grid-cols-[1fr_0.9fr]">
          <img src={newsletterImage()} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(20,82,214,0.94),rgba(47,139,255,0.82))]" />
          <div className="relative">
            <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/75">
              Stay connected
            </div>
            <h2 className="m-0 mb-3 font-serif text-[30px] font-medium text-white sm:text-[38px]">
              Be first to receive the APN roundup.
            </h2>
            <p className="m-0 text-[15px] leading-relaxed text-white/90 sm:text-base">
              Join the launch list for hand-picked sermons, upcoming events, and trusted Apostolic resources. We&apos;ll email you when the first curated roundup is ready.
            </p>
          </div>
          <div className="relative w-full">
            <NewsletterForm variant="light" />
          </div>
        </div>
      </section>

      <div className="h-20" />

      {/* Player modal — only ever mounted for real playable media. */}
      {playing && <PlayerModal item={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}

// --- small pieces ----------------------------------------------------------

function FeaturedCard({
  title,
  meta,
  image,
  player,
  href,
  onPlay,
}: {
  title: string;
  meta: string;
  image: string;
  player: PlayerItem | null;
  href: string;
  onPlay: (p: PlayerItem) => void;
}) {
  const inner = (
    <>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        {player && (
          <div className="absolute inset-0 grid place-items-center bg-[rgba(8,16,38,0.35)]">
            <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white">
              <PlayTriangle size={9} />
            </span>
          </div>
        )}
      </div>
      <div className="text-white">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-sky">
          Featured today
        </div>
        <div className="mt-0.5 font-serif text-[18px]">{title}</div>
        {meta && <div className="mt-0.5 text-xs text-white/75">{meta}</div>}
      </div>
    </>
  );

  const cls =
    "flex w-[340px] max-w-full animate-floaty items-center gap-3.5 rounded-[18px] border border-white/20 bg-[rgba(12,20,44,0.55)] p-3.5 text-left backdrop-blur-md transition hover:border-white/35 hover:bg-[rgba(12,20,44,0.72)]";

  // Play in place when we have real media; otherwise just link to the sermon.
  return player ? (
    <button onClick={() => onPlay(player)} className={cls} aria-label={`Play ${title}`}>
      {inner}
    </button>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function EmptyPanel({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-sanctuary-line bg-white/60 p-8 text-center">
      <p className="m-0 text-sm text-sanctuary-muted">{text}</p>
      <Link href={href} className="mt-2 inline-block text-sm font-bold text-sanctuary-link">
        {cta} →
      </Link>
    </div>
  );
}
