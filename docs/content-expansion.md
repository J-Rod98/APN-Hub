# APN foundation content plan

Confirmed: APN has owner-only review, shared source/task state, daily API budget protection and an approved-only publisher. This change retains the existing Agents SDK and Netlify schedules. The owner authorized a balanced 32-item expansion and stale-event fixes; unpublished drafts remain unapproved.

Planning baseline: 13 sermons, 3 podcasts, 1 music video, 0 news briefs, 2 future events and 5 resource listings, observed November 17, 2026. Existing guides skew toward ministry technology and conference planning. Targets add 7 sermons, 5 podcasts, 5 music videos, 4 news briefs, 6 future events and 5 practical resources.

Review order: six numbered weeks, at most six slots per week. These are editorial priorities, not automatic publication dates. Missing source facts remain blocked. Broader leads retain source and doctrine review flags. Metadata listings must not reconstruct unheard sermons, episodes or lyrics. Recent news requires a dated original report. Event facts expire after seven days and must be reverified before publication.

Owner-authenticated API operations:

- `plan-slot`: assign an existing active task or record a blocked research gap. Slots and categories are fixed; retries do not duplicate tasks.
- `research-intake`: retrieve original evidence using the existing bounded, SSRF-safe reader, reuse any unresolved candidate, assign a slot, and prepare a metadata-only listing for media. News/events wait for researched prose.
- `review-draft`: save externally researched original prose against registered sources. The normal validator computes blocking checks and a fresh draft hash. It cannot accept approvals or revise approved/public content. No APN model request is made by these operations. They log operator-assisted preparation without claiming that external tools have no costs.

Unknowns: source availability, organizer timezone/venue completeness, and wider-lead doctrinal fit. Search Console remains unavailable until verified authorization; content inventory and provider views must never be presented as APN search popularity.

Verification: event date rollover, inclusive end dates, archive sorting, malformed dates and timezone handling; plan category/slot uniqueness; draft imports cannot manufacture approval; unresolved sources remain blocked; existing workflow tests, typecheck, lint, static build and launch checks.
