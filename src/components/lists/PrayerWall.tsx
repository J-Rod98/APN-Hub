"use client";
// Public prayer wall with search + category filter.
import { useMemo, useState } from "react";
import { PrayerCard } from "@/components/cards/PrayerCard";
import { SearchInput, ChipRow } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { PRAYER_CATEGORIES } from "@/lib/constants";
import type { PrayerRequest } from "@/lib/types";

export function PrayerWall({ prayers }: { prayers: PrayerRequest[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return prayers.filter((p) => {
      const matchesText =
        !term ||
        [p.title, p.request_text, p.category, p.city, p.state]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesCat = category === "All" || p.category === category;
      return matchesText && matchesCat;
    });
  }, [prayers, q, category]);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={q} onChange={setQ} placeholder="Search prayer requests…" />
      <ChipRow options={PRAYER_CATEGORIES} active={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🙏"
          title="No prayer requests yet"
          message="Be the first to share a request above — the community is ready to pray with you."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PrayerCard key={p.id} prayer={p} />
          ))}
        </div>
      )}
    </div>
  );
}
