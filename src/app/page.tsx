// Home page — Sanctuary Light, powered by APN's checked-in curated catalog.
import { SanctuaryHome } from "@/components/sanctuary/SanctuaryHome";
import { getEvents, getPodcast, getPreaching } from "@/lib/data";

export default function HomePage() {
  const events = getEvents();
  const preaching = getPreaching();
  const podcast = getPodcast();

  const featuredIndex = preaching.length
    ? Math.floor(Date.now() / 86_400_000) % preaching.length
    : -1;

  return (
    <SanctuaryHome
      events={events}
      preaching={preaching}
      podcast={podcast}
      featuredIndex={featuredIndex}
    />
  );
}
