// Events page — full list with search + state/category filters.
import { Button } from "@/components/ui/Button";
import { EventsList } from "@/components/lists/EventsList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { getEvents } from "@/lib/data";

export const metadata = { title: "Events — Apostolic Power Network" };

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Upcoming"
        title="Apostolic Events"
        subtitle="Verified gatherings, conferences, rallies, and training from across the Apostolic movement."
        action={<Button href="/submit" size="sm">＋ Suggest an Event</Button>}
        imageIndex={0}
      />
      <EventsList events={events} />
    </div>
  );
}
