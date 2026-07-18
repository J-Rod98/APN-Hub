import { Button } from "@/components/ui/Button";
import { PreachingList } from "@/components/lists/PreachingList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { getPreaching } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apostolic Sermons",
  description: "Browse a hand-curated library of Apostolic sermons and practical Bible teaching.",
  path: "/preaching/",
});

export default function PreachingPage() {
  const items = getPreaching();

  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="On Demand"
        title="Apostolic Preaching Library"
        subtitle="A growing, topic-led collection of sound preaching and practical Apostolic teaching."
        action={<Button href="/submit" variant="ghost" size="sm">Suggest a sermon</Button>}
        imageIndex={1}
      />
      <PreachingList items={items} />
    </div>
  );
}
