import { Button } from "@/components/ui/Button";
import { PreachingList } from "@/components/lists/PreachingList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { getPreaching } from "@/lib/data";

export const metadata = { title: "Preaching — Apostolic Power Network" };

export default function PreachingPage() {
  const items = getPreaching();

  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="On Demand"
        title="Apostolic Preaching Library"
        subtitle="A growing, topic-led collection of sound preaching and practical Apostolic teaching."
        action={<Button href="/submit" size="sm">＋ Suggest a Sermon</Button>}
        imageIndex={1}
      />
      <PreachingList items={items} />
    </div>
  );
}
