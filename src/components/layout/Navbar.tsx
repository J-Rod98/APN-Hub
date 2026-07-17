"use client";
// Shared top navigation (Sanctuary Light chrome).
//
// Two variants, one component:
//  - Home: transparent, laid over the full-bleed hero photo.
//  - Everywhere else: solid dark bar, sticky.
// Both sit on dark backgrounds, so the link styling is identical.
//
// "Submit a Resource" appears ONCE, as the CTA button — it is deliberately not
// in NAV_LINKS (that duplication is what produced two Submit buttons).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/ui/FlameLogo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "z-50",
        isHome
          ? "absolute inset-x-0 top-0" // overlays the hero
          : "sticky top-0 border-b border-line bg-navy-950/80 backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-5 sm:px-10">
        <Link href="/" aria-label="Apostolic Power Network home">
          <BrandMark size={32} />
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-[20px] px-[15px] py-[9px] text-sm font-semibold transition",
                  active
                    ? "bg-white/[0.14] text-white"
                    : "text-white/80 hover:bg-white/[0.12] hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/submit"
            className="hidden rounded-[22px] bg-gradient-to-b from-brand to-brand-deep px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_rgba(20,82,214,0.5)] transition hover:-translate-y-px hover:brightness-110 sm:block"
          >
            Suggest Content
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/25 lg:hidden"
          >
            <span className={cn("h-0.5 w-[18px] bg-white transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-[18px] bg-white transition", open && "opacity-0")} />
            <span className={cn("h-0.5 w-[18px] bg-white transition", open && "-translate-y-2 -rotate-45")} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="flex flex-col gap-1 border-b border-line bg-navy-950/95 px-5 pb-4 pt-1 backdrop-blur-xl lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 font-semibold text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-gradient-to-b from-brand to-brand-deep px-4 py-3 text-center font-bold text-white"
          >
            Suggest Content
          </Link>
        </nav>
      )}
    </header>
  );
}
