import Link from "next/link";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { Card } from "@/components/ui/Card";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Church Guides for Pastors & Leaders",
  description:
    "Practical, thoughtfully reviewed guides for pastors, church leaders, and Apostolic teams—covering AI, sermon preparation, websites, and church communication.",
  path: "/guides/",
});

export default function GuidesPage() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Practical Church Leadership"
        title="APN Guides"
        subtitle="Clear, practical answers for pastors and church teams—written to help you lead, communicate, and serve with wisdom."
        imageIndex={1}
      />

      <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="APN guides">
        {guides.map((guide) => (
          <Card key={guide.slug} className="flex flex-col p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-link">
              {guide.eyebrow}
            </div>
            <h2 className="mt-3 font-serif text-[25px] font-medium leading-tight text-sanctuary-ink">
              <Link href={`/guides/${guide.slug}/`} className="hover:text-sanctuary-link">
                {guide.title}
              </Link>
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-sanctuary-muted">{guide.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="text-sanctuary-muted">{guide.readingTime}</span>
              <Link href={`/guides/${guide.slug}/`} className="font-bold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline">
                Read guide →
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
