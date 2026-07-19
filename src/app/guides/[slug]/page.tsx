import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { getGuideBySlug, guides } from "@/lib/guides";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  return pageMetadata({
    title: guide?.title ?? "APN Guide",
    description: guide?.description ?? "Practical guidance for pastors and church leaders.",
    path: `/guides/${params.slug}/`,
  });
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}/`),
    publisher: {
      "@type": "Organization",
      name: "Apostolic Power Network",
      url: absoluteUrl("/"),
    },
  };

  return (
    <div className="container-app py-10 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Link href="/guides/" className="mb-7 inline-block text-sm font-semibold text-sanctuary-muted hover:text-sanctuary-link">
        ← Back to APN Guides
      </Link>

      <article className="mx-auto max-w-3xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-sanctuary-link">{guide.eyebrow}</div>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.02em] text-sanctuary-ink sm:text-5xl">
          {guide.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-sanctuary-muted">
          <span>{guide.readingTime}</span>
          <span>Updated {formatDate(guide.publishedAt.slice(0, 10))}</span>
        </div>

        <p className="mt-8 text-[19px] leading-relaxed text-sanctuary-muted">{guide.intro}</p>

        <div className="mt-10 space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-3xl font-medium tracking-[-0.015em] text-sanctuary-ink">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-sanctuary-muted">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {section.bullets && (
                <ul className="mt-5 grid gap-3 rounded-[20px] border border-sanctuary-line bg-white p-5 text-[16px] leading-relaxed text-sanctuary-muted sm:p-6">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3"><span className="text-sanctuary-link">✓</span><span>{bullet}</span></li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <Card hover={false} className="mt-11 p-6 sm:p-7">
          <h2 className="font-serif text-2xl font-medium text-sanctuary-ink">Common questions</h2>
          <div className="mt-5 divide-y divide-sanctuary-line">
            {guide.faqs.map((faq) => (
              <section key={faq.question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="font-bold text-sanctuary-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sanctuary-muted">{faq.answer}</p>
              </section>
            ))}
          </div>
        </Card>

        {guide.references && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl font-medium text-sanctuary-ink">{guide.referencesHeading ?? "Official product information"}</h2>
            <p className="mt-3 text-sm leading-relaxed text-sanctuary-muted">Features, terms, and privacy controls change. Review current provider documentation before making a purchasing or data-handling decision.</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {guide.references.map((reference) => (
                <li key={reference.href}><a href={reference.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-sanctuary-link hover:underline">{reference.label} ↗</a></li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 border-t border-sanctuary-line pt-7 text-sm text-sanctuary-muted">
          Looking for a sermon, event, or trusted resource? <Link href="/" className="font-bold text-sanctuary-link hover:underline">Explore APN →</Link>
        </div>
      </article>
    </div>
  );
}
