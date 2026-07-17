// Materials page — resource library with search + category filter.
import { Button } from "@/components/ui/Button";
import { MaterialsList } from "@/components/lists/MaterialsList";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import { getMaterials } from "@/lib/data";

export const metadata = { title: "Materials — Apostolic Power Network" };

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Download & Teach"
        title="Apostolic Materials"
        subtitle="Trusted places to study, prepare, teach, lead, and serve — all linked to their original source."
        action={<Button href="/submit" size="sm">＋ Suggest a Resource</Button>}
        imageIndex={3}
      />
      <MaterialsList materials={materials} />
    </div>
  );
}
