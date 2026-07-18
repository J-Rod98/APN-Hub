# APN Hub

A static, curated discovery site for the Apostolic movement: sermons, podcasts,
events, and resources from their original sources.

This first release deliberately has no database, authentication, or admin
panel. Visitors can browse the published catalogue, submit a content suggestion,
and open or play material from its verified source.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Build the deployable static site:

\`\`\`bash
npm run build
\`\`\`

The generated site is written to \`out/\`, which is the Netlify publish
directory.

## Add or update content

Edit \`src/lib/catalog.ts\`. Only add entries that APN has reviewed and that
link to their original source. The site supports:

- Spotify episodes, shows, tracks, albums, and playlists
- YouTube watch, live, short, and embed links
- Direct audio files: \`.mp3\`, \`.m4a\`, \`.aac\`, \`.ogg\`, or \`.wav\`

Those sources receive a real in-page player. Other safe \`https\` sources are
clearly labelled as links out; no visual-only or fake play controls are shown.

The current catalogue starts with the verified Spotify episode provided for
APN. Empty sections show an honest message until more reviewed content is
added.

## Content suggestions

The public **Suggest Content** form posts to a Netlify Function. The function
validates every field, rejects bot-filled honeypots, applies Netlify rate
limiting, and then forwards valid submissions to Formspree. Suggestions are
never automatically published.

Cloudflare Turnstile is optional but recommended before launch. Set both
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Netlify to turn
on the final-submission challenge.

## Launch-list waitlist

The homepage waitlist uses APN's MailerLite embedded-form endpoint. APN keeps
its own visual design and sends the visitor's email through a protected Netlify
endpoint, with client/server validation, a honeypot, rate limiting, and the
MailerLite form's Google reCAPTCHA challenge.

Before enabling it in Netlify:

1. In MailerLite, enable double opt-in on the APN Launch List form and confirm
   that every campaign includes MailerLite's unsubscribe method.
2. Test the confirmation email, duplicate-address behavior, unsubscribe, and
   the form's Google reCAPTCHA challenge.
3. Set `MAILERLITE_DOUBLE_OPT_IN_ENABLED=true` in Netlify only after those
   checks are complete.

Until that setting is true, the form returns a safe error and does not forward
addresses to MailerLite.

## Deploy

Netlify runs \`npm run build\` and publishes \`out/\` as configured in
\`netlify.toml\`. It also deploys the protected server-side suggestion handler
at \`/api/suggest\` and MailerLite-backed launch-list handler at \`/api/waitlist\`.

## Later

When APN has a reliable moderation workflow and enough incoming content to
justify it, a database can be added for submissions, editorial review, events,
and a private admin area. That is intentionally deferred rather than required
for the initial public launch.
