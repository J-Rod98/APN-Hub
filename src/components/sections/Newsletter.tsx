// Newsletter / text-updates CTA block (used on home + reusable).
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Newsletter() {
  return (
    <section className="container-app py-14">
      <div className="rounded-[26px] border border-line bg-gradient-to-b from-navy-800 to-navy-900 px-7 py-12 text-center [background-image:radial-gradient(600px_280px_at_50%_0%,rgba(47,139,255,0.2),transparent_60%)]">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
          Stay Connected
        </div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          Get Apostolic updates every week
        </h2>
        <p className="mt-2 text-ink-muted">
          Events, preaching, and prayer needs — straight to your inbox or phone.
        </p>
        <NewsletterForm />
      </div>
    </section>
  );
}
