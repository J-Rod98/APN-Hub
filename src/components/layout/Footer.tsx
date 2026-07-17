// Shared site footer (Sanctuary Light chrome).
// Light band, four columns, per the approved design.
import Link from "next/link";
import { FlameLogo } from "@/components/ui/FlameLogo";

const cols: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/events", label: "Events" },
      { href: "/preaching", label: "Preaching" },
      { href: "/podcast", label: "Podcasts" },
      { href: "/materials", label: "Resources" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/about", label: "What We Believe" },
      { href: "/#newsletter", label: "Newsletter" },
      { href: "/submit", label: "Suggest Content" },
    ],
  },
  {
    title: "Get in touch",
    links: [{ href: "mailto:jonathanrod98@gmail.com", label: "Contact" }],
  },
];

function FooterLink({ href, label }: { href: string; label: string }) {
  const cls = "text-sanctuary-link hover:text-sanctuary-linkhover transition";
  return href.startsWith("mailto:") ? (
    <a href={href} className={cls}>
      {label}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sanctuary-line2 bg-sanctuary-footer pb-24 md:pb-0">
      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-[52px] sm:px-10">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3.5 flex items-center gap-2.5">
              <FlameLogo size={28} />
              <span className="text-[15px] font-bold text-sanctuary-ink">
                Apostolic Power Network
              </span>
            </div>
            <p className="m-0 max-w-[300px] text-sm leading-relaxed text-sanctuary-muted">
              Sound, Spirit-filled content from across the Apostolic movement —
              built for the community.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-[13px] font-bold text-sanctuary-ink">
                {col.title}
              </div>
              <div className="flex flex-col gap-2.5 text-sm">
                {col.links.map((l) => (
                  <FooterLink key={`${col.title}-${l.href}-${l.label}`} {...l} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-sanctuary-line2 pt-5 text-[13px] text-sanctuary-soft">
          <span>© {new Date().getFullYear()} Apostolic Power Network</span>
          <span className="flex gap-4">
            <FooterLink href="/about" label="What We Believe" />
            <FooterLink href="/privacy" label="Privacy Policy" />
          </span>
        </div>
      </div>
    </footer>
  );
}
