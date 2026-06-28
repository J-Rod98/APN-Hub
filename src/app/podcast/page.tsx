// Podcast page — episodes with mini player + search.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { PodcastList } from "@/components/lists/PodcastList";
import { getPodcast } from "@/lib/data";

export const metadata = { title: "Podcast — Apostolic Power Network" };

export default async function PodcastPage() {
  const episodes = await getPodcast();
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="Listen"
        title="APN Podcast"
        subtitle="Conversations on faith, doctrine, and apostolic living."
        action={<Button href="/submit" size="sm">＋ Suggest a Guest</Button>}
      />
      <PodcastList episodes={episodes} />
    </div>
  );
}
