// Home page — Sanctuary Light, powered by APN's checked-in curated catalog.
import { SanctuaryHome } from "@/components/sanctuary/SanctuaryHome";
import { getEvents, getPodcast, getPreaching } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apostolic Power Network",
  description: "Discover trusted Apostolic sermons, podcasts, events, and resources in one place.",
  path: "/",
});

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
