// Downloadable material card with file-type + free/premium badges.
import { Card } from "@/components/ui/Card";
import { FileBadge, FreePremiumBadge, Label } from "@/components/ui/Badge";
import { safeUrl } from "@/lib/utils";
import type { Material } from "@/lib/types";

// Styled like a ghost button, but a real <a> so we can safely open external
// files in a new tab with rel="noopener".
const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-sanctuary-line " +
  "px-4 py-2 text-sm font-bold text-sanctuary-ink transition hover:-translate-y-0.5 hover:border-[#bcd0f2] " +
  "hover:bg-sanctuary-chip focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30";

export function MaterialCard({ material }: { material: Material }) {
  const url = safeUrl(material.file_url);
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
      <h3 className="mb-1.5 font-serif text-[21px] font-medium text-sanctuary-ink">{material.title}</h3>
      {material.description && (
        <p className="mb-4 flex-1 text-sm text-ink-muted">{material.description}</p>
      )}
      <div className="mt-auto">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={ghostBtn}>
            ⬇ Download / View
          </a>
        ) : (
          <span className="text-sm text-ink-muted">Link coming soon</span>
        )}
      </div>
    </Card>
  );
}
