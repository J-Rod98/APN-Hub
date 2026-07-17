# APN Hub

A static, curated discovery site for the Apostolic movement: sermons, podcasts,
events, and resources from their original sources.

This first release deliberately has no database, authentication, public forms,
admin panel, or invented demo content. Visitors can browse the published
catalogue and open or play material from its verified source.

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

## Content suggestions and newsletter

The newsletter and **Suggest Content** forms submit through Formspree. Both
label their submissions with a form type, so they can share one inbox while
remaining distinguishable in the Formspree dashboard. Suggestions are still
reviewed before they are added to the public catalog.

## Deploy

Netlify runs \`npm run build\` and publishes \`out/\` as configured in
\`netlify.toml\`. No environment variables are required for this release.

## Later

When APN has a reliable moderation workflow and enough incoming content to
justify it, a database can be added for submissions, editorial review, events,
and a private admin area. That is intentionally deferred rather than required
for the initial public launch.
