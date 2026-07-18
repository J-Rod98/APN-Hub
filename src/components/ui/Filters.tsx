"use client";
// Reusable filter UI: search input + chip row + select. Used by the browse
// lists. Purely presentational — state lives in the parent list component.
import { cn } from "@/lib/utils";

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-sanctuary-line bg-white px-4 py-1 shadow-[0_8px_22px_-20px_rgba(20,60,140,0.45)]">
      <span className="text-lg text-sanctuary-muted">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent py-3 text-base text-sanctuary-ink outline-none placeholder:text-sanctuary-soft"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="grid h-11 w-11 place-items-center text-sanctuary-muted hover:text-sanctuary-ink"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function ChipRow({
  options,
  active,
  onSelect,
}: {
  options: readonly string[];
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {["All", ...options].map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={cn(
            "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === opt
              ? "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
              : "border-sanctuary-line bg-white text-sanctuary-muted hover:border-[#bcd0f2] hover:text-sanctuary-ink",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="min-h-11 rounded-xl border border-sanctuary-line bg-white px-3 py-2.5 text-sm text-sanctuary-ink outline-none focus:border-brand"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
