"use client";
// Browse + filter for the materials/resource library (search + category).
import { useMemo, useState } from "react";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { SearchInput, ChipRow } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";
import { MATERIAL_CATEGORIES } from "@/lib/constants";
import type { Material } from "@/lib/types";

export function MaterialsList({ materials }: { materials: Material[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return materials.filter((m) => {
      const matchesText =
        !term ||
        [m.title, m.description, m.category, m.file_type]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term);
      const matchesCat = category === "All" || m.category === category;
      return matchesText && matchesCat;
    });
  }, [materials, q, category]);

  return (
    <div className="flex flex-col gap-6">
      <SearchInput value={q} onChange={setQ} placeholder="Search materials…" />
      <ChipRow options={MATERIAL_CATEGORIES} active={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No materials found"
          message="Try a different category or search term."
          action={<Button href="/submit" size="sm">＋ Submit a Resource</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      )}
    </div>
  );
}
