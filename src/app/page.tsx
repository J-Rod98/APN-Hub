// Home page — "Sanctuary Light" design, wired to real published content.
//
// Data is fetched here (server) and handed to the client component that owns
// the hero rotation and the player modal.
import { SanctuaryHome } from "@/components/sanctuary/SanctuaryHome";
import { getEvents, getPreaching, getPodcast, getPrayers } from "@/lib/data";

// Rendered per request, like the other content pages. Deliberately NOT ISR:
// prerendering at build time would make a transient Supabase outage fail the
// whole deploy, and content must never be served from a stale/seeded snapshot.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, preaching, podcast, prayers] = await Promise.all([
    getEvents(),
    getPreaching(),
    getPodcast(),
    getPrayers(),
  ]);

  // Today's featured sermon — computed on the server so SSR and the client
  // agree (a client-side Date.now() could straddle a day boundary and mismatch).
  const featuredIndex = preaching.length
    ? Math.floor(Date.now() / 86_400_000) % preaching.length
    : -1;

  return (
    <SanctuaryHome
      events={events}
      preaching={preaching}
      podcast={podcast}
      prayers={prayers}
      featuredIndex={featuredIndex}
    />
  );
}
