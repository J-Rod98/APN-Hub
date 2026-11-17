# APN discovery workflow

Confirmed: APN uses the existing Agents SDK worker, private shared queue, exact-version owner approvals, and a daily AI budget. Content publishing is separately disabled. The current clipper remains the media-processing/publishing engine; its example channel is not a real discovery source.

Jon requested wider Apostolic leads, clearly flagged for review. Familiar sources and broader search results are research leads, not theological certification or permission to reproduce sermons, podcasts, music, photographs or articles. Discovery records public metadata and reference text, never invented transcripts. Only the owner can approve publication.

Implementation scope: bounded web search and RSS/Atom feeds; original-source verification; canonical URL deduplication; sourced draft tasks for sermons, podcasts, music, news and events; a Discovery tab; and approved-content integrations with the existing public pages plus news/music pages. Unknown dates, doctrine, rights and event details remain explicit review issues.

## Operation

The existing Netlify background worker handles discovery; the browser can be closed. The existing daily 12:15 UTC trigger rotates sermon, podcast, music, news and event searches by the Chicago calendar date, followed by one queued draft. Insights remains weekly. Discovery failure does not suppress independent editing in the daily workflow. Each category can be searched once per Chicago day, with an explicit owner retry after failure; interrupted workers become failed for review. No automatic paid model retries are made. A later run supersedes earlier failure-retry controls. Proven OpenAI `invalid_json_schema` rejections release their unused reservation; transport/billing uncertainty keeps its reservation.

Open `/owner/agents/` on phone or desktop and choose **Discovery**. Select a category, then **Search & prepare drafts**. Search uses at most two web-search calls, original-source verification and enabled RSS/Atom feeds. Up to three verified sources enter the shared queue. Other leads can be prepared or dismissed. **Prepare next queued draft** consumes the existing queue in priority order. The owner can request an original-provider player on a media task; changing this choice withdraws an earlier approval. Link-only is the default. All approval checkboxes and an explicit publication time are required. The separate publication switch and GitHub credential remain prerequisites to publication.

Media drafts are factual metadata listings for individual YouTube recordings or Spotify podcast episodes/shows. Directories cannot be prepared as recordings. APN does not invent sermon summaries, quotations, lyrics, transcripts, guests, speakers or dates. Source channel/creator is attributed as such. Reproducing or clipping recordings still requires the existing authorized transcript/manifest workflow and its rights records; discovery does not enable the Mac clipper or change its queue. News uses original attributed briefs capped at 180 words across visible draft fields, requires a verified publication date within 90 days, and permits no copied quotations. Stale/undated news is blocked before any paid drafting request; historical feed entries are flagged. Genuine uncertainties and doctrine flags remain blocking; routine owner-review reminders belong to the separate mandatory attestations. Events retain organizer-evidence requirements for dates, timezone and venue. Incomplete evidence blocks approval. Broader sources are leads for human doctrine/source review, not a declaration of affiliation.

Canonical URLs are deduplicated against the current catalogue, approved content and all prior candidates, including dismissed leads. Public-page reads are bounded, HTTPS-only and credential-free; DNS is checked and pinned on each redirect. Unrelated content with a church footer fails the article relevance check. Original evidence snapshots, search-result links, actions, model tokens and search-call charges are stored in the private queue. The existing daily AI budget is shared by both agents. Search reserves extra capacity for tool context and charges, and uncertain billing retains its reservation. Hosting and existing media-processing costs are excluded.

## Deployment and state preservation

Production explicitly pins `APN_STORE_NAME` to the existing populated store, `apn-agent-workflow-v1-preview-local`. That historical name was verified against the existing three tasks, sixteen sources, two reports and $0.1221 usage history; no migration or deletion was performed. The runtime does not reliably provide `CONTEXT`/`DEPLOY_ID`. New unspecified runtimes fail closed rather than sharing an implicit preview fallback. Preview deployments require their own explicit store or deploy-specific name. Production credentials remain scoped to production Functions. Hosted storage clients are created per invocation so expiring Netlify context tokens are not retained across warm invocations.

`APN_DISCOVERY_ENABLED=true` enables production discovery. `APN_PUBLISH_ENABLED=false` remains unchanged. Approved-only media/news JSON files start empty. Existing sermon/podcast/event pages merge approved records with the current catalogue. New `/news/` and `/music/` indexes show truthful empty states until publication. Next 14 static export needs a reserved parameter for an empty dynamic route; that parameter renders `notFound()` and is excluded from the sitemap. The initial-import endpoint remains disabled and its old-format schema deliberately rejects new discovery state rather than importing unverified approvals or provenance.

Actual Search Console metrics still require verified ownership and read-only authorization. Netlify traffic remains dated owner-imported observations. Discovery does not infer search demand or popularity from search results.

## Primary references

- OpenAI Agents SDK: https://developers.openai.com/api/docs/guides/agents/sdk
- OpenAI web search and source evidence: https://developers.openai.com/api/docs/guides/tools-web-search
- OpenAI tool pricing (verified November 16, 2026): https://developers.openai.com/api/docs/pricing — search tool charge $10 per 1,000 calls, plus model/search context token charges.
- Netlify Blobs runtime configuration: https://docs.netlify.com/build/data-and-storage/netlify-blobs/

## Owner-approved publishing activation

Publishing writes only the exact owner-approved artifact to `J-Rod98/APN-Hub` on `main`, then Netlify's existing Git integration builds the site. The server needs a dedicated fine-grained GitHub credential with Contents read/write and Metadata read, restricted to APN-Hub. Store it as the secret `APN_GITHUB_TOKEN` in production Functions only; set `APN_GITHUB_REPOSITORY=J-Rod98/APN-Hub`, `APN_PUBLISH_BRANCH=main`, and enable `APN_PUBLISH_ENABLED` only after this credential is ready. No personal Git credential is copied from the Mac into the runtime.

The separate `apn-publish-schedule` checks approved, due items every 15 minutes without calling AI. The owner can also choose **Publish approved now**. Research stays on its existing daily schedule. Both agent activation and publishing flags must be enabled; every write still rechecks the draft hash, source versions, discovery provenance, required owner attestations and earliest publication time. GitHub conditional writes and durable approval hashes make a lost response reconcilable. A content commit is not proof of a successful deploy: verify the resulting Netlify deployment and public page before reporting the item live.
