import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Newsletter() {
  return (
    <section id="newsletter" className="container-app py-14 scroll-mt-20">
      <div className="rounded-[26px] border border-line bg-gradient-to-b from-navy-800 to-navy-900 px-7 py-12 text-center [background-image:radial-gradient(600px_280px_at_50%_0%,rgba(47,139,255,0.2),transparent_60%)]">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
          Stay connected
        </div>
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          Be first to receive the APN roundup.
        </h2>
        <p className="mt-2 text-white/80">
          Join the launch list for hand-picked sermons, upcoming events, and trusted Apostolic resources. We&apos;ll email you when the first curated roundup is ready.
        </p>
        <div className="mx-auto mt-6 text-left sm:max-w-[540px]"><NewsletterForm variant="light" /></div>
      </div>
    </section>
  );
}
