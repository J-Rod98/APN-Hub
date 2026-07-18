// Suggestion page — the static launch accepts recommendations by email only.
import { SecureSubmitForm } from "@/components/forms/SecureSubmitForm";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Suggest Content",
  description: "Suggest an Apostolic sermon, podcast, event, or resource for APN to review.",
  path: "/submit/",
});

export default function SubmitPage() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Share With the Network"
        title="Suggest Content"
        subtitle="Know an Apostolic sermon, podcast, event, or resource worth sharing? Send APN the original link."
        imageIndex={0}
      />
      <SecureSubmitForm />
    </div>
  );
}
