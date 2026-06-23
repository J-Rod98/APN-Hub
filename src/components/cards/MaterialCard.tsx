// Downloadable material card with file-type + free/premium badges.
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileBadge, FreePremiumBadge, Label } from "@/components/ui/Badge";
import type { Material } from "@/lib/types";

export function MaterialCard({ material }: { material: Material }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        {material.file_type && <FileBadge type={material.file_type} />}
        {/* Phase 1: everything is free, but the badge component is ready for APN+ */}
        <FreePremiumBadge premium={material.is_premium} />
      </div>
      {material.category && (
        <div className="mb-2">
          <Label>{material.category}</Label>
        </div>
      )}
      <h3 className="mb-1.5 text-base font-bold">{material.title}</h3>
      {material.description && (
        <p className="mb-4 flex-1 text-sm text-ink-muted">{material.description}</p>
      )}
      <div className="mt-auto">
        <Button
          href={material.file_url ?? "#"}
          size="sm"
          variant="ghost"
        >
          ⬇ Download / View
        </Button>
      </div>
    </Card>
  );
}
