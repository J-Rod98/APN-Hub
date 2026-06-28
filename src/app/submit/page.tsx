// Submit page — central submission form (event, sermon, podcast, material,
// music, testimony, news, prayer). Everything lands as 'pending' for review.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubmitForm } from "@/components/forms/SubmitForm";

export const metadata = { title: "Submit Content — Apostolic Power Network" };

export default function SubmitPage() {
  return (
    <div className="container-app py-12">
      <SectionHeader
        as="h1"
        eyebrow="Share With the Network"
        title="Submit Content"
        subtitle="Have an event, sermon, podcast, resource, testimony, or prayer request? Submit it here for review."
      />
      <SubmitForm />
    </div>
  );
}
