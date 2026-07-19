// Materials page — resource library with search + category filter.
import { Button } from "@/components/ui/Button";
import { MaterialsList } from "@/components/lists/MaterialsList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { Card } from "@/components/ui/Card";
import { getMaterials } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { guides } from "@/lib/guides";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Apostolic Resources",
  description: "Explore trusted Apostolic resources for discipleship, leadership, outreach, and church ministry.",
  path: "/materials/",
});

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Download & Teach"
        title="Apostolic Resources"
        subtitle="Trusted places to study, prepare, teach, lead, and serve — all linked to their original source."
        action={<Button href="/submit" variant="ghost" size="sm">Suggest a resource</Button>}
        imageIndex={3}
      />
      <section className="mt-10" aria-labelledby="guides-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-link">Practical leadership</div>
            <h2 id="guides-heading" className="mt-2 font-serif text-3xl font-medium text-sanctuary-ink">APN Guides</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sanctuary-muted">Search-focused answers for pastors and church teams, from AI and sermon preparation to websites and communication.</p>
          </div>
          <Link href="/guides/" className="text-sm font-bold text-sanctuary-link hover:text-sanctuary-linkhover">Browse all guides →</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {guides.slice(0, 3).map((guide) => (
            <Card key={guide.slug} className="p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-sanctuary-link">{guide.eyebrow}</div>
              <h3 className="mt-2 font-serif text-[21px] font-medium leading-tight text-sanctuary-ink"><Link href={`/guides/${guide.slug}/`} className="hover:text-sanctuary-link">{guide.title}</Link></h3>
              <Link href={`/guides/${guide.slug}/`} className="mt-4 inline-block text-sm font-bold text-sanctuary-link hover:underline">Read guide →</Link>
            </Card>
          ))}
        </div>
      </section>
      <div className="my-10 h-px bg-sanctuary-line" />
      <MaterialsList materials={materials} />
    </div>
  );
}
