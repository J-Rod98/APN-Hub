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
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-navy-950 px-4 py-1">
      <span className="text-lg text-ink-muted">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink-muted"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="text-ink-muted hover:text-ink"
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
            "rounded-full border px-4 py-2 text-sm font-semibold transition",
            active === opt
              ? "border-transparent bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
              : "border-line bg-navy-850 text-ink-muted hover:border-brand hover:text-ink",
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
      className="rounded-xl border border-line bg-navy-950 px-3 py-2.5 text-sm outline-none focus:border-brand"
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
