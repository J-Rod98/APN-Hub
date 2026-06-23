// Materials page — resource library with search + category filter.
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { MaterialsList } from "@/components/lists/MaterialsList";
import { getMaterials } from "@/lib/data";

export const metadata = { title: "Materials — Apostolic Power Network" };

export default async function MaterialsPage() {
  const materials = await getMaterials();
  return (
    <div className="container-app py-12">
      <SectionHeader
        eyebrow="Download & Teach"
        title="Apostolic Materials"
        subtitle="Lessons, guides, and church media — all free in Phase 1."
        action={<Button href="/submit" size="sm">＋ Submit a Resource</Button>}
      />
      <MaterialsList materials={materials} />
    </div>
  );
}
