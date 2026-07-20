# Project Notes — Crush Brand Marketing site (handoff for the next session)

**Read this first if you're a fresh Claude session picking up this project.**

## What this is
A static (plain HTML/CSS/JS, no build step) lead-generation website for **Crush Brand
Marketing** — a web-design + local-SEO agency serving **Central Arkansas** service
businesses (detailers, contractors, landscapers, cleaners, pressure washing, HVAC,
plumbing, electrical). Dark navy + blue visual identity. 16 pages.

## How the files got here
The owner uploaded `crushbrandmarketing.tar.gz` to the repo root through GitHub's web
uploader. That tarball contains the whole site nested under a `crush-brand-marketing/`
folder. **First task for the next session:** unpack it so the site files sit at the repo
ROOT (index.html at top), then delete the tarball and this-is-fine:

```bash
tar -xzf crushbrandmarketing.tar.gz          # creates ./crush-brand-marketing/
git mv crush-brand-marketing/* .             # or: mv + git add
git rm crushbrandmarketing.tar.gz
# make sure index.html, assets/, about/, etc. are at the repo root, then commit + push
```

Verify with the validator described below, then the repo is Netlify-ready with
**publish directory = `.`** (no base directory, no build command).

## Business facts (all real, keep them exact)
- Phone (call/text): **(501) 500-4306** → `tel:+15015004306`
- Email: **jonathan@crushbrandmarketing.com**
- Booking: **https://calendly.com/jonathan-crushbrandmarketing**
- Domain: **www.crushbrandmarketing.com** (canonical host is the www version)
- Owner: **Jonathan.** The agency grew out of running **Tuff Bros Detailing**
  (tuffbrosdetailing.com) — that's the flagship portfolio/case-study example.

## Pricing (published on /website-pricing/ and teased on the homepage)
One-time website packages (flat, quoted up front):
- **Landing Page — $697** (1 page)
- **Local Business Website — $1,497** (up to 5 pages; "for newer businesses")
- **Local Lead Website — $2,497** ("Most popular"; up to 10 pages, service pages, tracking)
- **Local Authority Website — from $4,497** (custom, location pages, content strategy)

Ongoing (separate, optional, month-to-month):
- Hosting/maintenance **$99–$149/mo** · GBP management **from $300/mo**
- Local SEO **from $750/mo** · Extra service/location page **$200 each** · Reviews: custom

Rule the site states clearly: a **website build** includes an SEO *foundation*; ongoing
**rankings** need continued SEO work. They are different services, priced separately.
**Do not** reintroduce the old "$497" number anywhere except describing a single page.

## Pages (16)
Home, Website Design (Little Rock), Web Design North Little Rock, Local SEO, Google
Business Profile, Website Pricing, Portfolio, Portfolio/Tuff Bros case study, About,
4 industry pages (detailers, landscapers, cleaning, contractors), Website Audit, Contact,
Privacy, plus a 404.html.

## Conversion setup
Primary CTA everywhere: **Get a Free Website Audit**. Secondary: **View Website Packages**.
The audit form (/website-audit/) collects name, business, phone, email, current website,
primary service, service area, what-they-need, budget range, preferred contact — and has
a visible 4-step "what happens next." Forms use **Netlify Forms** (honeypot spam
protection). After first deploy, enable email notifications in Netlify → Forms.

## Guardrails (the owner cares about these)
- No fake reviews, rankings, traffic, clients, or revenue. No guaranteed-rankings claims.
- No "#1 / best agency" claims. Plain, local, straightforward voice.
- Anything not yet verified is a labeled **"NEEDS OWNER INPUT"** placeholder — see below.

## Still NEEDS OWNER INPUT
1. Tuff Bros screenshots → `assets/img/tuff-bros-home.webp`, `-service.webp`, `-mobile.webp`
   (placeholders live on /portfolio/ and /portfolio/tuff-bros-detailing/)
2. Verified case-study numbers — six labeled blocks on the case study (Search Console
   growth, organic traffic, website leads, booked revenue, ranking improvements, testimonial)
3. Owner photo → `assets/img/jonathan.webp` (placeholder on /about/)

## Technical notes
- Validator script (from the prior session) checks links, unique titles/descriptions,
  canonicals, JSON-LD validity, sitemap coverage, single H1. Re-create if missing; it
  should report 16 pages, 0 errors.
- `netlify.toml` sets security headers (CSP, HSTS, etc.) and — important — makes CSS/JS
  **revalidate** (`max-age=0, must-revalidate`) so a redeploy never leaves visitors on a
  stale stylesheet. Images cache 7 days. Keep this.
- If you add Google Analytics, you MUST extend the CSP in netlify.toml
  (`script-src` += googletagmanager, add `connect-src` for google-analytics). See
  `docs/analytics-and-search-console.md`.
- Fonts (Archivo/Inter/JetBrains Mono) load from Google Fonts; a future optimization is
  self-hosting them.

## Owner to-dos outside the repo (details in docs/)
- `docs/google-business-profile-checklist.md` — GBP setup (service-area business, NO home
  address published, categories, UTM links, review process)
- `docs/analytics-and-search-console.md` — Search Console verification + sitemap submit,
  GA4 setup with the CSP change, Netlify Forms notifications, www redirect

## Deploy checklist for the next session
1. Unpack the tarball to repo root, delete it, commit, push.
2. Connect Netlify → this repo → publish dir `.` (no build command).
3. Point crushbrandmarketing.com at the new Netlify site; ensure apex → www redirect.
4. Netlify → Forms → enable email notifications to jonathan@crushbrandmarketing.com.
5. From then on: make edits in this repo and push — Netlify auto-deploys.

_Last updated by the APN-Hub session on 2026-07-14. The same site currently also lives at
`crush-brand-marketing/` inside the J-Rod98/APN-Hub repo, branch
`claude/crush-brand-marketing-site-ga99gm`, which is where it was originally built._
