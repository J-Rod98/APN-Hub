# Crush Brand Marketing — website

Static, dependency-free marketing site for **Crush Brand Marketing**
(local SEO websites & lead generation for Arkansas service businesses).

## Pages

| Path | Purpose |
|---|---|
| `/` | Homepage — positioning, services, who we help, FAQ, contact form |
| `/local-seo-little-rock-ar/` | Local SEO service page (Little Rock, AR) |
| `/website-design-little-rock-ar/` | Website design service page (Little Rock, AR) |
| `/google-business-profile-optimization/` | Google Business Profile service page |
| `/seo-for-detailers/` | Industry page — detailers / ceramic coating |
| `/seo-for-landscapers/` | Industry page — landscaping companies |
| `/seo-for-cleaning-companies/` | Industry page — cleaning businesses |
| `/seo-for-contractors/` | Industry page — roofers, fence, concrete, HVAC |
| `/website-audit/` | Free audit offer + request form |
| `/contact/` | Contact page + full form |

Plus `sitemap.xml` and `robots.txt` at the root.

## How it's built

- Plain HTML/CSS/JS — no build step, no framework. Shared styles in
  `assets/css/styles.css`, shared behavior in `assets/js/main.js`.
- Every page has a unique `<title>`, meta description, canonical tag,
  Open Graph tags, and JSON-LD structured data (LocalBusiness /
  ProfessionalService, Organization, WebSite, Service, FAQPage,
  BreadcrumbList, ContactPage).
- Internal links and asset paths are **root-absolute** (`/assets/...`,
  `/contact/`), so the site must be served from a domain root —
  opening the files directly in a browser (`file://`) won't load CSS.
  Preview locally with: `python3 -m http.server 8080` from this folder.

## Deploying

Deploy this folder (`crush-brand-marketing/`) as its own site on Netlify
(or any static host) with the domain `www.crushbrandmarketing.com`:

1. Netlify → Add new site → set **Base directory** to `crush-brand-marketing`,
   **Publish directory** to `crush-brand-marketing` (no build command).
2. Point the `crushbrandmarketing.com` domain at it.
3. **Forms:** the three forms (`contact`, `contact-home`, `website-audit`)
   use Netlify Forms (`data-netlify="true"`). After the first deploy,
   enable email notifications in Netlify → Forms so submissions reach
   jonathan@crushbrandmarketing.com. On a non-Netlify host, replace the
   forms with Formspree/Basin or a small backend.

## Manual follow-ups

- Replace `assets/img/og-image.png` if you want a custom social share image.
- Add Google Analytics / call-tracking snippets when ready.
- Update the phone number if a local Arkansas number is added later.
