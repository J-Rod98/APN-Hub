"use client";
// "I Prayed" button: optimistic count + POST to the increment API.
// Falls back to a purely local count when the API isn't available (demo mode).
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PrayerButton({
  prayerId,
  initialCount,
}: {
  prayerId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [done, setDone] = useState(false);

  async function handlePray() {
    if (done) return; // one tap per session
    setDone(true);
    setCount((c) => c + 1); // optimistic update

    try {
      const res = await fetch(`/api/prayer/${prayerId}/pray`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.prayer_count === "number") setCount(data.prayer_count);
      }
    } catch {
      // Demo mode / offline: keep the optimistic count, no error shown.
    }
  }

  return (
    <button
      onClick={handlePray}
      disabled={done}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition",
        done
          ? "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white"
          : "border-line bg-brand/10 text-ink hover:border-brand hover:bg-brand/20",
      )}
    >
      {done ? "✓ Prayed" : "🙏 I Prayed"}
      <span className="rounded-full bg-black/25 px-2 py-0.5 text-xs">{count}</span>
    </button>
  );
}
