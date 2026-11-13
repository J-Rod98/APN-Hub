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

## Intake forms (Netlify Forms)

Both intake forms use **Netlify Forms**. They are plain React forms that post
(url-encoded) to the site root with a `form-name`, and are registered with
Netlify via the static `public/__forms.html` detection file. Submissions appear
in the Netlify dashboard under **Forms** and can be emailed to a notification
address configured there. No API keys, endpoints, or environment variables are
required.

- **Suggest Content** (`/submit`) — `form-name: apn-suggestions` (name, email,
  content type, source link, message). Client-side validation plus a honeypot.
  Suggestions are never automatically published — review them in Netlify, then
  add approved items to `src/lib/catalog.ts` and redeploy.
- **Launch-list signup** (homepage) — `form-name: apn-waitlist` (email only),
  with client-side email validation and a honeypot.

Spam protection: each form uses a honeypot (`hp_website`, declared to Netlify
via `data-netlify-honeypot`); reCAPTCHA can be enabled per form in the Netlify
UI if needed.

Netlify Forms is a capture inbox, not an email-campaign provider. Before APN
sends recurring launch-list updates, export the collected emails to a provider
with an unsubscribe method and update the public privacy policy accordingly.

> **Note:** Netlify Forms only records submissions on deployed Netlify builds
> (including deploy previews) — form posts are not captured by `next dev` or a
> local `next build`.

## Deploy

Netlify runs \`npm run build\` and publishes \`out/\` as configured in
\`netlify.toml\`. It also deploys the protected server-side suggestion handler
at \`/api/suggest\`.

## Later

When APN has a reliable moderation workflow and enough incoming content to
justify it, a database can be added for submissions, editorial review, events,
and a private admin area. That is intentionally deferred rather than required
for the initial public launch.
