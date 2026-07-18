"use client";
// Shared top navigation (Sanctuary Light chrome).
//
// Two variants, one component:
//  - Home: transparent, laid over the full-bleed hero photo.
//  - Everywhere else: a light, sticky editorial bar.
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
          : "sticky top-0 border-b border-sanctuary-line bg-white/[0.92] shadow-[0_8px_24px_-20px_rgba(20,60,140,0.45)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-[82px] max-w-[1240px] items-center justify-between px-5 sm:px-10">
        <Link
          href="/"
          aria-label="Apostolic Power Network home"
          className={isHome ? "text-white" : "text-sanctuary-ink"}
        >
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
                  "inline-flex min-h-11 items-center rounded-[20px] px-[15px] py-[9px] text-sm font-semibold transition",
                  isHome
                    ? active
                      ? "bg-white/[0.14] text-white"
                      : "text-white/80 hover:bg-white/[0.12] hover:text-white"
                    : active
                      ? "bg-sanctuary-chip text-sanctuary-link"
                      : "text-sanctuary-muted hover:bg-sanctuary-chip hover:text-sanctuary-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/preaching/"
            className="hidden min-h-11 items-center rounded-[22px] bg-gradient-to-b from-brand to-brand-deep px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_rgba(20,82,214,0.5)] transition hover:-translate-y-px hover:brightness-110 sm:inline-flex"
          >
            Explore sermons
          </Link>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border lg:hidden",
              isHome ? "border-white/25" : "border-sanctuary-line bg-white",
            )}
          >
            <span className={cn("h-0.5 w-[18px] transition", isHome ? "bg-white" : "bg-sanctuary-ink", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-[18px] transition", isHome ? "bg-white" : "bg-sanctuary-ink", open && "opacity-0")} />
            <span className={cn("h-0.5 w-[18px] transition", isHome ? "bg-white" : "bg-sanctuary-ink", open && "-translate-y-2 -rotate-45")} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className={cn(
          "flex flex-col gap-1 border-b px-5 pb-4 pt-1 backdrop-blur-xl lg:hidden",
          isHome
            ? "border-white/20 bg-[rgba(8,16,38,0.94)]"
            : "border-sanctuary-line bg-white/[0.97]",
        )}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center rounded-xl px-4 py-3 font-semibold",
                isHome
                  ? "text-white hover:bg-white/10"
                  : "text-sanctuary-ink hover:bg-sanctuary-chip",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
