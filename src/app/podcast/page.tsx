// Podcast page — episodes with mini player + search.
import { Button } from "@/components/ui/Button";
import { PodcastList } from "@/components/lists/PodcastList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { getPodcast } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apostolic Podcasts",
  description: "Listen to hand-picked Apostolic podcasts and teaching from trusted voices across the movement.",
  path: "/podcast/",
});

export default async function PodcastPage() {
  const episodes = await getPodcast();
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Listen"
        title="Apostolic Podcasts"
        subtitle="A hand-picked collection of Apostolic podcast episodes worth a listen — from voices across the movement."
        action={<Button href="/submit" variant="ghost" size="sm">Suggest a podcast</Button>}
        imageIndex={2}
      />
      <PodcastList episodes={episodes} />
    </div>
  );
}
