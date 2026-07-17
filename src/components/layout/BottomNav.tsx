"use client";
// Sticky mobile-only bottom nav with active-route highlighting.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-sanctuary-line bg-white/[0.96] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_22px_-18px_rgba(20,60,140,0.45)] backdrop-blur-xl md:hidden">
      {BOTTOM_NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 text-[0.66rem] font-semibold transition",
              active ? "text-sanctuary-link" : "text-sanctuary-muted",
            )}
          >
            <span
              className={cn(
                "text-xl leading-none",
                active && "drop-shadow-[0_0_8px_rgba(47,139,255,0.45)]",
              )}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
