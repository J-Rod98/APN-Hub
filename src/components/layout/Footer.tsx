// Site footer.
import Link from "next/link";
import { BrandMark } from "@/components/ui/FlameLogo";

const cols = [
  {
    title: "Explore",
    links: [
      { href: "/events", label: "Events" },
      { href: "/preaching", label: "Preaching" },
      { href: "/podcast", label: "Podcast" },
      { href: "/materials", label: "Materials" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/prayer", label: "Prayer" },
      { href: "/submit", label: "Bible Studies" },
      { href: "/submit", label: "Submit Event" },
      { href: "/submit", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-navy-950 pb-24 pt-12 md:pb-12">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8 px-5">
        <div className="max-w-xs">
          <BrandMark />
          <p className="mt-3 text-sm text-ink-muted">
            Built for the Apostolic Pentecostal community — one place for
            preaching, prayer, events, materials, and connection.
          </p>
        </div>
        <div className="flex gap-12">
          {cols.map((col) => (
            <div key={col.title}>
              <h5 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-brand-bright">
                {col.title}
              </h5>
              {col.links.map((l, i) => (
                <Link
                  key={`${l.href}-${i}`}
                  href={l.href}
                  className="block py-1 text-sm text-ink-muted hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-line px-5 pt-5 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} Apostolic Power Network
      </div>
    </footer>
  );
}
