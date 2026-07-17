import { Card } from "@/components/ui/Card";

const CONTACT_EMAIL = "jonathanrod98@gmail.com";

export function SubmitForm() {
  const link = "mailto:" + CONTACT_EMAIL + "?subject=APN%20content%20suggestion";

  return (
    <Card hover={false} className="max-w-2xl p-6 sm:p-8">
      <h2 className="font-serif text-2xl text-sanctuary-ink">Suggest content by email</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        APN is building its first hand-curated collection. Send a link to the
        original source and a short note about why it would serve the Apostolic
        community.
      </p>
      <a
        href={link}
        className="mt-6 inline-flex rounded-full bg-gradient-to-br from-brand to-brand-deep px-5 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5"
      >
        Suggest Content by Email
      </a>
    </Card>
  );
}
