# Analytics & Search Console — Setup Steps (outside the repo)

These require account access and can't be completed in code. Do them in this order after the site is live on `www.crushbrandmarketing.com`.

## Google Search Console (~10 minutes)

1. Go to https://search.google.com/search-console → Add property → **Domain** property `crushbrandmarketing.com`
2. Verify via the DNS TXT record Google gives you (added at your domain registrar; Netlify DNS works too)
3. Submit the sitemap: `https://www.crushbrandmarketing.com/sitemap.xml`
4. Request indexing for the homepage, /website-pricing/, and /website-design-little-rock-ar/
5. Check back weekly at first: Coverage (any errors?), Performance (which queries show impressions)

## Google Analytics 4 (~15 minutes)

1. Create a GA4 property at https://analytics.google.com → get the `G-XXXXXXX` measurement ID
2. Add the GA4 tag to every page's `<head>` (one shared snippet — ask Claude Code to inject it site-wide once you have the ID)
3. **Important:** the site ships a strict Content-Security-Policy in `netlify.toml`. When adding GA4, extend it:
   - `script-src` += `https://www.googletagmanager.com`
   - add `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com`
4. Mark these as key events (conversions):
   - `form_submit` on the three Netlify forms (the `?sent=1` success URLs make this easy to configure as a page_view-based event)
   - clicks on `tel:` links (configure a click event for links starting with `tel:`)
   - outbound clicks to Calendly

## Call tracking (optional, later)

- If you add a call-tracking number (CallRail etc.), use **number-swapping** so the site's visible (501) 500-4306 stays consistent for NAP/local SEO, and the swap only happens in the visitor's browser.
- Call-tracking service fees are separate from Crush hosting/maintenance rates.

## Netlify (after each deploy)

- Forms tab → confirm the `website-audit`, `contact`, and `contact-home` forms registered (field changes appear after a deploy)
- Forms → Notifications → email submissions to jonathan@crushbrandmarketing.com
- Domain settings → ensure `crushbrandmarketing.com` redirects to `www.crushbrandmarketing.com` (matching the canonical tags)
