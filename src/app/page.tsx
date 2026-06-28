// Home page — hero + featured-of-the-day + featured sections + prayer wall + newsletter.
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { FeaturedToday } from "@/components/sections/FeaturedToday";
import { Newsletter } from "@/components/sections/Newsletter";
import { pickFeaturedOfDay } from "@/lib/featured";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/States";
import { EventCard } from "@/components/cards/EventCard";
import { PreachingCard } from "@/components/cards/PreachingCard";
import { PodcastCard } from "@/components/cards/PodcastCard";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { PrayerCard } from "@/components/cards/PrayerCard";
import {
  getEvents,
  getPreaching,
  getPodcast,
  getMaterials,
  getPrayers,
} from "@/lib/data";

// Re-render frequently (ISR) so newly published content and the daily
// "Featured Today" pick stay current.
export const revalidate = 300;

export default async function HomePage() {
  // Fetch everything in parallel; each call falls back to seed data.
  const [events, preaching, podcast, materials, prayers] = await Promise.all([
    getEvents(),
    getPreaching(),
    getPodcast(),
    getMaterials(),
    getPrayers(),
  ]);

  // Today's rotating highlight, chosen deterministically from published content.
  const featured = pickFeaturedOfDay(events, preaching, podcast, materials);

  return (
    <>
      <Hero />
      <FeaturedToday item={featured} />

      {/* Featured Events */}
      <section className="container-app py-14">
        <SectionHeader
          eyebrow="Upcoming"
          title="Featured Events"
          subtitle="Gatherings happening across the network."
          action={
            <Link href="/events" className="text-sm font-bold text-brand-bright hover:underline">
              View all →
            </Link>
          }
        />
        {events.length === 0 ? (
          <EmptyState icon="📅" title="No events yet" message="Check back soon — or submit one." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* Latest Preaching */}
      <section className="container-app py-14">
        <SectionHeader
          eyebrow="On Demand"
          title="Latest Preaching"
          action={
            <Link href="/preaching" className="text-sm font-bold text-brand-bright hover:underline">
              View all →
            </Link>
          }
        />
        {preaching.length === 0 ? (
          <EmptyState icon="🎧" title="No messages yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {preaching.slice(0, 4).map((p) => <PreachingCard key={p.id} item={p} />)}
          </div>
        )}
      </section>

      {/* Latest Podcast */}
      <section className="container-app py-14">
        <SectionHeader
          eyebrow="Listen"
          title="Podcasts We Recommend"
          action={
            <Link href="/podcast" className="text-sm font-bold text-brand-bright hover:underline">
              View all →
            </Link>
          }
        />
        {podcast.length === 0 ? (
          <EmptyState icon="🎙️" title="No episodes yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {podcast.slice(0, 2).map((p) => <PodcastCard key={p.id} episode={p} />)}
          </div>
        )}
      </section>

      {/* Featured Materials */}
      <section className="container-app py-14">
        <SectionHeader
          eyebrow="Download & Teach"
          title="Featured Materials"
          action={
            <Link href="/materials" className="text-sm font-bold text-brand-bright hover:underline">
              View all →
            </Link>
          }
        />
        {materials.length === 0 ? (
          <EmptyState icon="📄" title="No materials yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.slice(0, 3).map((m) => <MaterialCard key={m.id} material={m} />)}
          </div>
        )}
      </section>

      {/* Prayer Wall Preview */}
      <section className="container-app py-14">
        <SectionHeader
          eyebrow="Community"
          title="Prayer Wall"
          subtitle="We pray for one another."
          action={
            <Link href="/prayer" className="text-sm font-bold text-brand-bright hover:underline">
              View wall →
            </Link>
          }
        />
        {prayers.length === 0 ? (
          <EmptyState icon="🙏" title="No prayer requests yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prayers.slice(0, 3).map((p) => <PrayerCard key={p.id} prayer={p} />)}
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
