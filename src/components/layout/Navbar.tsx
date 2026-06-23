"use client";
// Sticky top nav with desktop links + mobile hamburger dropdown.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/ui/FlameLogo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-navy-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Apostolic Power Network home">
          <BrandMark />
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-brand/10 text-ink"
                    : "text-ink-muted hover:bg-brand/10 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden md:block">
            <Button href="/submit" size="sm">
              ＋ Submit
            </Button>
          </div>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-line md:hidden"
          >
            <span className={cn("h-0.5 w-4.5 bg-ink transition", open && "translate-y-2 rotate-45")} style={{ width: 18 }} />
            <span className={cn("h-0.5 bg-ink transition", open && "opacity-0")} style={{ width: 18 }} />
            <span className={cn("h-0.5 bg-ink transition", open && "-translate-y-2 -rotate-45")} style={{ width: 18 }} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="flex flex-col gap-1 border-b border-line bg-navy-950/95 px-5 pb-4 pt-1 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold text-ink hover:bg-brand/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
