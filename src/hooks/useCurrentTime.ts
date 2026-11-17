"use client";
import { useEffect, useState } from "react";
// Static exports must use the visitor's current clock, not the last build date.
// Null on both server and first client render prevents stale upcoming claims.
export function useCurrentTime() {
  const [at, setAt] = useState<Date | null>(null);
  useEffect(() => {
    const refresh = () => setAt(new Date());
    refresh();
    const timer = setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);
  return at;
}
