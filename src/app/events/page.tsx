// Events page — full list with search + state/category filters.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { EventsList } from "@/components/lists/EventsList";
import { getEvents } from "@/lib/data";

export const metadata = { title: "Events — Apostolic Power Network" };

// Always read fresh so newly approved/published content appears immediately.
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="Upcoming"
        title="Apostolic Events"
        subtitle="Revivals, youth rallies, conferences, camp meetings, and more."
        action={<Button href="/submit" size="sm">＋ Submit an Event</Button>}
      />
      <EventsList events={events} />
    </div>
  );
}
