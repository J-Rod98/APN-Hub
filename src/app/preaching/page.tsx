// Preaching page — full library with search + topic filter.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { PreachingList } from "@/components/lists/PreachingList";
import { getPreaching } from "@/lib/data";

export const metadata = { title: "Preaching — Apostolic Power Network" };

// Always read fresh so newly approved/published content appears immediately.
export const dynamic = "force-dynamic";

export default async function PreachingPage() {
  const items = await getPreaching();
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="On Demand"
        title="Apostolic Preaching Library"
        subtitle="Sound doctrine, anytime — built around the truths we hold dear."
        action={<Button href="/submit" size="sm">＋ Submit a Sermon</Button>}
      />
      <PreachingList items={items} />
    </div>
  );
}
