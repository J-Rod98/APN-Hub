# APN Agent Desk

## Current boundary

This implementation adds an owner-reviewed workflow around the existing static
site. Deploy it to the existing APN project using the setup below. Publishing
remains disabled independently of deployment. Google verification and the current
clipper queue require their own authorized setup. The private audit at `docs/agents-audit.md` is intentionally git-ignored because
the APN repository is public. Read it locally for confirmed access, private
dependencies and unverified assumptions.

The two normal Agents SDK specialists run in our own Netlify worker. This is an
application-owned loop with typed, validated outputs. Models have no publication,
approval, filesystem, credential or shell tools. Queue orchestration makes their
handoff explicit: Insights produces tasks; Editor consumes cleared tasks.

## Local review

```sh
npm ci
npm run typecheck
npm run test:agents
npm run lint
npm run build
npm run check:launch
npm run agents:desk
```

Open `http://127.0.0.1:8787/owner/agents/`. The local server binds only loopback,
checks Host and Origin, and uses an HttpOnly SameSite cookie without displaying
secrets. The dashboard and API are served from the same local process. `/health`
reports readiness. `PORT` can choose another port. Local state is mode 0600 under
ignored `.agent-data/`; never commit it. A crashed local file lock fails closed;
inspect the previous process before manually removing that lock.

The ignored `.env.local` holds the approved OpenAI key. Keep `APN_PUBLISH_ENABLED`
false during review. `npm run agents:run -- all` invokes a bounded live run; obtain
owner consent to transfer the selected source/analytics data to OpenAI first.
Individual modes: `insights`, `editor`, `publish`. A report runs once per UTC week;
a failed report requires an explicit owner retry through the dashboard. Failed
content calls also need explicit retry. A report or content task is not silently
repeated after an uncertain model response.

First workflow: fetch actual APN pages/robots/sitemap; collect authorized GSC
metrics if available; Insights prioritizes tasks including About metadata;
Editor reads APN's existing first-party About text, drafts title/description and
records exact source excerpts; checks hold a reviewable draft. Missing Google
access remains **unavailable**, not zero. The owner must complete all four
attestations and approve the exact version before publication.

## Sources and review

The Sources tab records actual text, origin URL, rights basis, verification time
and immutable content hash. A link, a YouTube channel, a previous clip, or a
credit line does not establish processing/reproduction permission. Public-domain
Scripture needs a verified edition and actual text. Transcription is evidence
that still needs comparison with the recording, not a guarantee of a quotation.

The agents preserve APN's published Oneness convictions. Additional standards are
`Needs confirmation`. Pattern checks are intentionally limited and must not be
represented as automatic theological certification. Uncertain facts/interpretation,
unmatched quotations, unknown links, missing rights, duplicate titles/slugs,
and stale/incomplete organizer event evidence block approval. Resolve them by
providing better sources and requesting a fresh draft. Owner checks also cover
substantive duplication, originality and the suitability of the final teaching.

Event drafts need a source of kind `event`, current verification (within seven
days at publication), and name, start/end dates, timezone, venue and organizer
URL matching that source. Unknown details cannot be invented. Bible studies
need supplied authorized Scripture text. Other source-linked original guides
use the existing guide renderer, listing, metadata and sitemap. Rendering uses
React text and escaped JSON-LD, not generated HTML.

## Runtime setup and deployment approval

Review the exact branch diff and live/local draft before approving deployment.
The deployment destination is the existing Netlify `apn-hub` site. Merge only
after preserving the separate `netlify-forms-intake` work. Do not merge that PR
or replace forms as part of this workflow without its own review.

Set Functions-only runtime secrets: `OPENAI_API_KEY`, a random owner token of at
least 32 characters (`APN_OWNER_TOKEN`), optionally a separate worker token,
read-only GSC OAuth credentials, and (only if enabling site publication) a
repository-scoped GitHub Contents token. No secret belongs in a NEXT_PUBLIC
variable. The new OpenAI key expires 30 days after creation; rotate it before
expiry. Never copy local secrets to hosting without owner authorization.

Owner phone login uses invite-only Netlify Identity and the confirmed server-side
email allowlist described below. A separate strong owner bearer token supports
initial migration and approved service integrations; keep it private. The public
static `/owner/agents/` shell contains no data. Every API read/write requires a
verified owner identity or valid bearer token. Robots and page metadata disallow
indexing. Missing credentials fail closed. Sensitive state is returned with
`no-store` and no CORS permission.

Netlify Blobs automatically uses the function's authenticated context. Strong
reads and ETag conditional writes serialize the entire private state, including
leases, approvals and cost reservations. Production and previews use separate
stores. Never point a preview at the production store for casual tests. No
existing Supabase tables or credentials are changed.

After the owner approves activation, set `APN_AGENTS_ENABLED=true` and redeploy
the reviewed code. The short scheduled trigger runs daily at **12:15 UTC**
(**06:15 CST / 07:15 CDT**). It calls a background worker because scheduled
functions have a 30-second limit. Insights produces one report per UTC week;
Editor attempts at most one cleared task per tick. Published production deploys
run schedules; previews do not. Scheduled function definitions alone do not
prove a schedule is active—verify the production deploy and worker logs.

`APN_PUBLISH_ENABLED` remains a separate switch. Set `APN_GITHUB_REPOSITORY`
and an explicit `APN_PUBLISH_BRANCH` first. Choose `main` only after approving
that production destination. Owner approval authorizes that exact source-bound
draft at/after its scheduled time. Metadata writes only
`src/content/metadata-overrides.json`; guide content writes only
`src/content/approved-guides.json`; verified events write only
`src/content/approved-events.json`, which feeds the existing catalogue, event
detail pages and sitemap. Unknown optional event fields remain null. These files feed the existing static build.
A GitHub commit result means committed, **not yet verified live**: verify the
Netlify deployment and final page before claiming publication completed.

For an isolated publication check, use a temporary `APN_LOCAL_PUBLISH_DIR` and
`APN_PUBLISH_ENABLED=true`. This writes a reviewed artifact only into that test
directory, not the checkout or Netlify. This mode is rejected in hosted runtime.

## Analytics connections and reporting

GSC is currently unverified. Domain ownership requires the owner's DNS change
or another approved verification method. Separately obtain read-only
`webmasters.readonly` OAuth access for unattended reads and store client ID,
client secret and refresh token. The server requests final data, allows three
days for reporting lag, compares two equal seven-day Pacific-date windows,
requests property totals independently, and returns up to 1,000 query/page and
page rows. Query rows are incomplete by Google's design; do not sum them as
property totals. URL inspection reads Google's stored index result for the
homepage; it is not a live Google crawl or a full property indexing report.

Netlify Web Analytics access was confirmed in the browser, but no supported
server Analytics API credential/feed is configured. The snapshot importer uses
actual dated observations. It never pretends to be a live API or moves a prior
snapshot into the current week. Configure a documented export/feed before
promising unattended Netlify traffic reporting. Real public status, canonical,
robots and sitemap checks can run independently. Root historical 404s still
need method/host/user-agent request details; a current 200 does not resolve them.

## Cost and action ledger

The default model follows the current Agents SDK quickstart (`gpt-6-astra`).
Standard short-context pricing recorded 2026-11-15: $10 input / $50 output per
million tokens. Other built-in dated rates are listed in `server/agents/model.ts`.
Change the model deliberately and verify pricing when doing so. The default
$1 daily AI cap (America/Chicago) is enforced with atomic conservative reservations before calls.
Each call has one model turn, no SDK automatic retries, 3,000 output-token limit,
a bounded input and a timeout. Unknown billing keeps the full reservation.
Actual token usage is logged; dollars are estimates, not invoices. Clipper's
Anthropic, media processing, hosting and storage costs remain outside this ledger.
Action history records requests, attempts, checks, approvals, failures and content
commits without logging secrets. One worker lease prevents overlap. Interrupted
work is marked for owner reconciliation instead of being blindly replayed.

## Existing clipper/scheduler bridge

`~/apn-clipper` remains the existing media engine and approved publisher. Its
current launchd schedules remain unchanged; this means media preparation and
social posting still depend on its host being available. Netlify does not run
Whisper/ffmpeg for this branch. The two new AI agents themselves are server-side.

Read-only inventory is safe:

```sh
python3 scripts/clipper-bridge.py inventory --root ~/apn-clipper
```

Inventory exports only source/clip metadata, attribution, existing captions and
SHA-256 fingerprints of the manifest plus actual media bytes; it grants no
rights and creates no transcript. The bridge refuses queue writes unless the
reviewed `integrations/clipper/publisher-queue-lock.patch` is installed. That
patch serializes the current publisher's entire queue transactions, covering
dashboard approvals and its scheduled publisher too. Review/apply it with the
clipper stopped, then restart the current dashboard. Do not change its times.

Configure `APN_AGENT_URL` and an owner/bridge bearer token securely. Register
only a clip whose rights are documented, using `register --clip-key ...
--rights-evidence ...`. Create a `clip` task with that returned source ID and
review its exact caption and underlying media. On owner approval, `sync` calls
the existing `publisher.approve`, preserving its next-free-slot logic, then
saves the reviewed caption and task provenance. Copyright-flagged media requires
an additional explicit owner acknowledgement, preserving the old approval rule. It does not post a clip. The
current scheduled publisher handles posting later.

Receipts and fingerprints prevent re-enqueueing an acknowledged task. An existing
queue entry without matching provenance is a manual reconciliation condition.
The bridge never steals it, duplicates it or assumes an uncertain previous
write failed. Handoff status means scheduled in the old queue, not posted on
Instagram/Facebook. The dashboard does not invent social performance or a live
post URL. The patch and bridge have not been applied to the current live queue.

## Reference contracts

- [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [Model pricing](https://developers.openai.com/api/docs/pricing)
- [Netlify conditional writes and consistency](https://docs.netlify.com/build/data-and-storage/netlify-blobs/)
- [Scheduled function limits](https://docs.netlify.com/build/functions/scheduled-functions/)
- [Google Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Google URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)


## Phone sign-in

The deployment supports invite-only Netlify Identity with `@netlify/identity`.
`APN_IDENTITY_OWNER_EMAIL` is a server-only allowlist. A logged-in user also needs
a confirmed email matching this allowlist; being a registered visitor does not
grant access. Identity-authenticated writes require a same-origin Origin header.
The owner accepts the invitation and sets their own password. The agent never
sets or reads that password. Authentication links landing on the homepage are
redirected to the owner page without sending their URL fragments to the server.
Server credentials remain private; the owner does not need to handle them.

The temporary `APN_INITIAL_IMPORT_ENABLED` switch permits a one-time import into
an empty workspace. The import schema rejects approvals, published tasks and
active worker leases. Disable it immediately after migration. It exists to move
the tested local draft, dated observations and cost history to the hosted desk
without publishing that private state in GitHub.

### Sign-in troubleshooting

APN's Identity password is separate from the owner's Netlify or Google password.
The sign-in form identifies reset-email throttling separately from rejected
credentials. A single in-flight operation prevents duplicate taps; deadlines in
session storage contain only timestamps. Reset-email requests have a 15-minute
client cooldown, while throttled sign-in attempts have a 60-second retry pause.
These are client pauses, not a promise that Netlify's limits have reset. Reloading
the same tab does not clear them. No password request is retried automatically.

Open the newest invitation/recovery email in the intended browser and complete
its password form. Callback errors are displayed rather than silently discarded;
the dashboard waits for callbacks before checking workspace access. Signed-out
page loads do not show a misleading owner-access warning. A failed workspace
check after successful authentication is shown as an access error separately
from the password form's response. Anonymous API requests still receive401.

For an already-used or expired invitation, choose **Return to sign-in**. An
invitation email is distinct from a password-recovery email; reopening a consumed
invite can return `User not found` even while the account exists. Never delete
and recreate the owner to repair this error.

The current Identity SDK (2.0.1) omits the browser session cookie in its invite
acceptance method. APN completes a single explicit login using the returned
account email after successful acceptance, then checks the owner API. The form
leaves invitation mode before this login so an accepted link is not replayed if
the network fails. The integration test exercises the actual SDK with a wholly
mocked Identity service through browser cookies and server owner verification.

### Owner session verification

The owner API verifies the `nf_jwt` cookie from its actual incoming request with
APN's fixed HTTPS Identity `/user` endpoint. It does not rely on optional SDK
runtime globals or fall back to decoded JWT claims. Identity must return the
confirmed email and ID, and the email must match the server owner allowlist.
Duplicate or malformed cookies and unverified/non-owner accounts fail closed.
Redirects are refused so session tokens cannot be forwarded to another host.
Identity outages return503 with a retry hint and retain the browser session;
they are not presented as an incorrect password. Existing bearer integrations
and same-origin checks on cookie-authenticated writes remain enforced.
