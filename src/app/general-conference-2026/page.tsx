import Link from "next/link";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { Card } from "@/components/ui/Card";
import { generalConferenceGuides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "UPCI General Conference 2026 Planning Guides",
  description: "Independent APN planning guides for UPCI General Conference 2026 in Salt Lake City—first-time attendees, families, packing, schedule planning, exhibits, travel, and post-conference resources.",
  path: "/general-conference-2026/",
});

export default function GeneralConference2026Page() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Independent Attendee Planning"
        title="General Conference 2026"
        subtitle="Practical APN guides for planning a meaningful UPCI General Conference week in Salt Lake City. Always confirm registration, hotel, schedule, and event details with UPCI."
        imageIndex={2}
      />

      <section className="mt-8 rounded-[24px] border border-sanctuary-line bg-white p-6 sm:p-7" aria-labelledby="official-information-heading">
        <h2 id="official-information-heading" className="font-serif text-2xl font-medium text-sanctuary-ink">Start with UPCI’s official information</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-sanctuary-muted">
          APN is an independent resource guide. UPCI is the source for registration, hotel reservations, the live schedule, exhibits, and event questions. The current conference is scheduled for September 29–October 2 at the Salt Palace Convention Center in Salt Lake City.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <a href="https://www.upcigc.net/" target="_blank" rel="noopener noreferrer" className="text-sanctuary-link hover:underline">Official conference site ↗</a>
          <a href="https://www.upcigc.net/schedule/" target="_blank" rel="noopener noreferrer" className="text-sanctuary-link hover:underline">Official schedule ↗</a>
          <a href="https://www.upcigc.net/faq/" target="_blank" rel="noopener noreferrer" className="text-sanctuary-link hover:underline">Official FAQ ↗</a>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="planning-guides-heading">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-link">Plan, attend, follow up</div>
        <h2 id="planning-guides-heading" className="mt-2 font-serif text-3xl font-medium text-sanctuary-ink">APN General Conference guides</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {generalConferenceGuides.map((guide) => (
            <Card key={guide.slug} className="flex flex-col p-6">
              <h3 className="font-serif text-[24px] font-medium leading-tight text-sanctuary-ink">
                <Link href={`/guides/${guide.slug}/`} className="hover:text-sanctuary-link">{guide.title}</Link>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-sanctuary-muted">{guide.description}</p>
              <Link href={`/guides/${guide.slug}/`} className="mt-5 text-sm font-bold text-sanctuary-link hover:underline">Read guide →</Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
