// "Featured Today" banner — a prominent daily-rotating highlight on the home
// page. Renders nothing when there's no published content to feature.
import { Button } from "@/components/ui/Button";
import type { FeaturedItem } from "@/lib/featured";

export function FeaturedToday({ item }: { item: FeaturedItem | null }) {
  if (!item) return null;

  return (
    <section className="container-app pt-14">
      <div className="relative overflow-hidden rounded-[26px] border border-line bg-gradient-to-br from-navy-800 to-navy-900 p-7 shadow-glow-lg [background-image:radial-gradient(700px_320px_at_85%_-20%,rgba(47,139,255,0.22),transparent_60%)] sm:p-9">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="rounded-full border border-brand-bright/35 bg-brand-bright/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-brand-bright">
                🔥 Featured Today · {item.label}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {item.title}
            </h2>
            {item.meta && (
              <p className="mt-2 text-sm font-semibold text-ink-muted">{item.meta}</p>
            )}
            {item.description && (
              <p className="mt-3 max-w-2xl text-ink-muted line-clamp-3">
                {item.description}
              </p>
            )}
          </div>

          <div className="lg:pl-4">
            <Button href={item.href}>{item.cta} →</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
