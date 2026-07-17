// Suggestion page — the static launch accepts recommendations by email only.
import { SubmitForm } from "@/components/forms/SubmitForm";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";

export const metadata = { title: "Submit Content — Apostolic Power Network" };

export default function SubmitPage() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Share With the Network"
        title="Suggest Content"
        subtitle="Know an Apostolic sermon, podcast, event, or resource worth sharing? Send APN the original link."
        imageIndex={0}
      />
      <SubmitForm />
    </div>
  );
}
