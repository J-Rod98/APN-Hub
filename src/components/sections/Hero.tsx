// Home hero: headline, CTAs, and a floating phone-style app preview.
import { Button } from "@/components/ui/Button";
import { FlameLogo } from "@/components/ui/FlameLogo";

export function Hero() {
  return (
    <section className="container-app grid items-center gap-12 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="text-center lg:text-left">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-bright">
          Apostolic Power Network
        </div>
        <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.2rem]">
          The Apostolic Community,
          <br />
          <span className="bg-gradient-to-r from-brand-bright to-brand bg-clip-text text-transparent">
            All in One Place
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted lg:mx-0">
          Discover Apostolic events, preaching, podcasts, prayer support, Bible
          study materials, and trusted resources.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Button href="/events">🔥 Find Events</Button>
          <Button href="/prayer" variant="ghost">🙏 Request Prayer</Button>
          <Button href="/submit" variant="ghost">＋ Submit Content</Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-ink-muted lg:justify-start">
          <span><b className="text-ink">120+</b> churches</span>
          <span><b className="text-ink">500+</b> resources</span>
          <span><b className="text-ink">40+</b> events monthly</span>
        </div>
      </div>

      {/* Phone preview */}
      <div className="relative mx-auto w-[300px] max-w-full rounded-[34px] border border-line bg-gradient-to-b from-navy-800 to-navy-850 p-3.5 shadow-glow-lg">
        <div className="absolute left-1/2 top-4 h-1.5 w-[90px] -translate-x-1/2 rounded-full bg-line" />
        <div className="overflow-hidden rounded-[24px] bg-navy-950 px-3.5 pb-4 pt-6">
          <div className="mb-3.5 flex items-center gap-2">
            <FlameLogo size={22} />
            <b className="text-sm">APN Hub</b>
          </div>
          {[
            { tag: "Featured Sermon", title: "Baptism in Jesus' Name", sub: "🎧 Rev. D. Mitchell · 38 min" },
            { tag: "Upcoming Event", title: "Arkansas Youth Rally", sub: "📍 Little Rock, AR · Jul 12" },
            { tag: "Podcast · Ep. 42", title: "The Apostolic Life", sub: "▶ 52 min" },
            { tag: "Download · PDF", title: "Home Bible Study · Lesson 1", sub: "📄 Free · 6 pages" },
          ].map((c, i) => (
            <div
              key={c.title}
              className="mb-2.5 animate-floaty rounded-2xl border border-line bg-gradient-to-br from-navy-850 to-navy-800 p-3"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
              <div className="text-[0.62rem] font-bold uppercase tracking-wider text-brand-bright">
                {c.tag}
              </div>
              <h4 className="my-0.5 text-[0.82rem] font-bold">{c.title}</h4>
              <small className="text-[0.68rem] text-ink-muted">{c.sub}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
