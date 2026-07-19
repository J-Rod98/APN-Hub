import Link from "next/link";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { Card } from "@/components/ui/Card";
import { naycGuides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "NAYC 2027 Planning Guides",
  description: "Independent APN planning guides for North American Youth Congress 2027 in Indianapolis—first-time attendees, parents, chaperones, groups, packing, travel, sessions, and follow-up resources.",
  path: "/nayc-2027/",
});

export default function Nayc2027Page() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Independent Youth Event Planning"
        title="NAYC 2027"
        subtitle="Practical APN guides for North American Youth Congress in Indianapolis. Always confirm registration, hotels, sessions, policies, and event details with NAYC."
        imageIndex={0}
      />

      <section className="mt-8 rounded-[24px] border border-sanctuary-line bg-white p-6 sm:p-7" aria-labelledby="official-information-heading">
        <h2 id="official-information-heading" className="font-serif text-2xl font-medium text-sanctuary-ink">Start with official NAYC information</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-sanctuary-muted">
          APN is an independent planning resource. NAYC is the source for registration, hotels, schedules, policies, and event questions. The official site currently lists July 28–30, 2027, in Indianapolis, with general sessions at Lucas Oil Stadium.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <a href="https://northamericanyouthcongress.com/" target="_blank" rel="noopener noreferrer" className="text-sanctuary-link hover:underline">Official NAYC site ↗</a>
          <a href="https://northamericanyouthcongress.com/faqs/" target="_blank" rel="noopener noreferrer" className="text-sanctuary-link hover:underline">Official FAQ and dates ↗</a>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="nayc-guides-heading">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-link">Plan, attend, follow up</div>
        <h2 id="nayc-guides-heading" className="mt-2 font-serif text-3xl font-medium text-sanctuary-ink">APN NAYC guides</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {naycGuides.map((guide) => (
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
