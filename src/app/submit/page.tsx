// Suggestion page — the static launch accepts recommendations by email only.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubmitForm } from "@/components/forms/SubmitForm";

export const metadata = { title: "Submit Content — Apostolic Power Network" };

export default function SubmitPage() {
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="Share With the Network"
        title="Suggest Content"
        subtitle="Know an Apostolic sermon, podcast, event, or resource worth sharing? Send APN the original link."
      />
      <SubmitForm />
    </div>
  );
}
