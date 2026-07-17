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
        title="Apostolic Podcasts"
        subtitle="A hand-picked collection of Apostolic podcast episodes worth a listen — from voices across the movement."
        action={<Button href="/submit" size="sm">＋ Suggest a Podcast</Button>}
      />
      <PodcastList episodes={episodes} />
    </div>
  );
}
