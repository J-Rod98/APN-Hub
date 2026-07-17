// About page — trust signals: who APN is, what's here, content review, and a
// real contact method. Linked from the footer.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About — Apostolic Power Network",
  description:
    "What Apostolic Power Network is, who it's for, and how content is reviewed before it's shared.",
};

const CONTACT_EMAIL = "jonathanrod98@gmail.com";

export default function AboutPage() {
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="About"
        title="About Apostolic Power Network"
        subtitle="One trusted place to discover sound, Spirit-filled Apostolic content."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mission — spans wide */}
        <Card hover={false} className="p-6 lg:col-span-2">
          <h2 className="mb-2 text-lg font-bold">Our mission</h2>
          <p className="text-ink-muted">
            Apostolic Power Network (APN) exists to help Apostolic Pentecostals
            find trusted preaching, podcasts, events, music, and resources in one
            place — without sifting through the noise of the open internet. Our
            goal is simple: make it easy to discover content that strengthens your
            walk with God and connects you with the wider Apostolic community.
          </p>
        </Card>

        {/* Content review — trust signal */}
        <Card hover={false} className="p-6">
          <div className="mb-2 text-2xl">🛡️</div>
          <h2 className="mb-2 text-lg font-bold">Reviewed before it&apos;s posted</h2>
          <p className="text-sm text-ink-muted">
            APN&apos;s first release is edited by hand. Every featured item is
            checked before it is added to the public catalog and links back to
            its original source.
          </p>
        </Card>

        {/* What you'll find */}
        <Card hover={false} className="p-6">
          <div className="mb-2 text-2xl">📚</div>
          <h2 className="mb-2 text-lg font-bold">What you&apos;ll find</h2>
          <ul className="space-y-1 text-sm text-ink-muted">
            <li>• Apostolic preaching &amp; teaching</li>
            <li>• The APN podcast</li>
            <li>• Events, revivals &amp; conferences</li>
            <li>• Music &amp; worship</li>
            <li>• Downloadable study materials</li>
            <li>• A growing, hand-curated catalog</li>
          </ul>
        </Card>

        {/* Who it's for */}
        <Card hover={false} className="p-6">
          <div className="mb-2 text-2xl">🤝</div>
          <h2 className="mb-2 text-lg font-bold">Who it&apos;s for</h2>
          <p className="text-sm text-ink-muted">
            Apostolic Pentecostals — young adults, families, church members,
            ministers, and anyone seeking solid Apostolic content online. Whether
            you&apos;re growing in the faith or new to it, there&apos;s a place
            for you here.
          </p>
        </Card>

        {/* What we believe */}
        <Card hover={false} className="p-6">
          <div className="mb-2 text-2xl">✝️</div>
          <h2 className="mb-2 text-lg font-bold">What we believe</h2>
          <p className="text-sm text-ink-muted">
            APN serves the Apostolic Pentecostal movement and aims to feature
            content consistent with its core convictions — the oneness of God in
            Christ, and the new-birth experience of Acts 2:38: repentance, baptism
            in the name of Jesus Christ, and the infilling of the Holy Ghost.
          </p>
        </Card>

        {/* Contact / CTA — spans wide */}
        <Card hover={false} className="flex flex-col items-start gap-4 p-6 lg:col-span-3">
          <div>
            <h2 className="mb-2 text-lg font-bold">Get in touch</h2>
            <p className="text-ink-muted">
              Questions, feedback, or a resource to suggest? We&apos;d love to
              hear from you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand to-brand-deep px-5 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5"
            >
              ✉️ Email Us
            </a>
            <Button href="/submit" variant="ghost">Suggest Content</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
