import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { PreachingList } from "@/components/lists/PreachingList";
import { getPreaching } from "@/lib/data";

export const metadata = { title: "Preaching — Apostolic Power Network" };

export default function PreachingPage() {
  const items = getPreaching();

  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="On Demand"
        title="Apostolic Preaching Library"
        subtitle="Sound doctrine, anytime — built around the truths we hold dear."
        action={<Button href="/submit" size="sm">＋ Suggest a Sermon</Button>}
      />
      <PreachingList items={items} />
    </div>
  );
}
