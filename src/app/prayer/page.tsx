// Prayer page — submission form + public prayer wall.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrayerForm } from "@/components/forms/PrayerForm";
import { PrayerWall } from "@/components/lists/PrayerWall";
import { getPrayers } from "@/lib/data";

export const metadata = { title: "Prayer — Apostolic Power Network" };

// Always read fresh so newly approved prayers appear immediately.
export const dynamic = "force-dynamic";

export default async function PrayerPage() {
  const prayers = await getPrayers();
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="Community Prayer Wall"
        title="We pray for one another"
        subtitle="Post a request, then cover others in prayer with one tap."
      />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <PrayerForm />
        <PrayerWall prayers={prayers} />
      </div>
    </div>
  );
}
