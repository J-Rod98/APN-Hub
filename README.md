# APN Hub

A static, curated discovery site for the Apostolic movement: sermons, podcasts,
events, and resources from their original sources.

Public pages remain a static, curated catalogue. Visitors can browse published
content, submit a suggestion, and open or play material from its verified source.
The optional APN Agent Desk adds a separate private editorial queue and owner
approval API; public browsing does not require authentication or a database.

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

## Launch-list requests

The homepage launch-list form uses Formspree directly from the React client.
It keeps APN's visual design, accepts only an email address, uses client-side
email validation plus a honeypot, and uses Formspree's form handling and spam
protection. The `xzdnenwv` form endpoint is public by design and does not need
an environment variable.

Formspree receives requests; it is not APN's future email-campaign provider.
Before APN sends recurring launch-list updates, configure an email provider with
an unsubscribe method and update the public privacy policy accordingly.

## Deploy

Netlify runs \`npm run build\` and publishes \`out/\` as configured in
\`netlify.toml\`. It also deploys the protected server-side suggestion handler
at \`/api/suggest\`.

## Later

When APN has a reliable moderation workflow and enough incoming content to
justify it, a database can be added for submissions, editorial review, events,
and a private admin area. That is intentionally deferred rather than required
for the initial public launch.


## APN Agent Desk

Two cooperating server-side specialists turn real observations into prioritized
tasks and source-backed drafts. `/owner/agents/` is the owner review dashboard.
Publishing and schedules are disabled until explicitly configured and approved.
Existing catalogue content and intake forms remain unchanged.

Read [the agent runbook](docs/agents-runbook.md) for local commands, deployment,
source rights, doctrine review, costs, Search Console access, and the adapter for
the existing APN Clipper/scheduler. Private audit data and runtime state are
intentionally ignored by git because this repository is public.
