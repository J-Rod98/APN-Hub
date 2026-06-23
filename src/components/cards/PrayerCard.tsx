// Public prayer wall card.
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Badge";
import { PrayerButton } from "@/components/PrayerButton";
import { formatDate } from "@/lib/utils";
import type { PrayerRequest } from "@/lib/types";

export function PrayerCard({ prayer }: { prayer: PrayerRequest }) {
  return (
    <Card className="flex flex-col p-5">
      {prayer.category && (
        <div className="mb-2">
          <Label>{prayer.category}</Label>
        </div>
      )}
      <h4 className="mb-1.5 text-base font-bold">
        {prayer.title ?? "Prayer Request"}
      </h4>
      <p className="mb-3 flex-1 text-sm text-ink-muted">{prayer.request_text}</p>
      <div className="mb-3 flex flex-wrap gap-x-3 text-xs text-ink-muted">
        {prayer.name && <span>— {prayer.name}</span>}
        {(prayer.city || prayer.state) && (
          <span>📍 {[prayer.city, prayer.state].filter(Boolean).join(", ")}</span>
        )}
        <span>{formatDate(prayer.created_at.slice(0, 10))}</span>
      </div>
      <div className="mt-auto">
        <PrayerButton prayerId={prayer.id} initialCount={prayer.prayer_count} />
      </div>
    </Card>
  );
}
