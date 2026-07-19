import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const site = "https://apn-hub.netlify.app";

const [
  robots,
  sitemap,
  home,
  preaching,
  privacy,
  searchSource,
  formSource,
  functionSource,
  waitlistFormSource,
  waitlistFunctionSource,
] = await Promise.all([
  read("out/robots.txt"),
  read("out/sitemap.xml"),
  read("out/index.html"),
  read("out/preaching/index.html"),
  read("out/privacy/index.html"),
  read("src/components/lists/PreachingList.tsx"),
  read("src/components/forms/SecureSubmitForm.tsx"),
  read("netlify/functions/suggest.ts"),
  read("src/components/forms/NewsletterForm.tsx"),
  read("netlify/functions/waitlist.ts"),
]);

assert.match(robots, /User-Agent: \*/);
assert.match(robots, /Allow: \//);
assert.match(robots, new RegExp(`${site}/sitemap\\.xml`));
assert.match(sitemap, new RegExp(`${site}/preaching/`));
assert.match(sitemap, new RegExp(`${site}/events/`));
assert.match(home, new RegExp(`rel="canonical" href="${site}/"`));
assert.match(preaching, new RegExp(`rel="canonical" href="${site}/preaching/"`));
assert.match(home, /Be first to receive the APN roundup\./);
assert.match(home, /Join the launch list/);
assert.match(home, /One launch email, then occasional curated updates\. Unsubscribe anytime\./);
assert.doesNotMatch(home, /Get the week ahead, every Friday/);
assert.match(privacy, /Effective date: (?:<!-- -->)?July 17, 2026/);
assert.match(privacy, /APN uses MailerLite to manage the launch list and send APN updates\./);
assert.match(privacy, /rate-limit requests, and a hidden honeypot rejects automated submissions\./);
assert.match(searchSource, /No results for/);
assert.match(searchSource, /Browse all sermons/);
assert.match(formSource, /HoneypotField/);
assert.match(formSource, /role="alert"/);
assert.match(formSource, /role="status"/);
assert.match(functionSource, /request\.method !== "POST"/);
assert.match(functionSource, /rateLimit/);
assert.match(functionSource, /validateSuggestion/);
assert.match(waitlistFormSource, /\/api\/waitlist/);
assert.doesNotMatch(waitlistFormSource, /recaptcha/i);
assert.match(waitlistFormSource, /Check your inbox to confirm your place on the APN launch list\./);
assert.match(waitlistFormSource, /Joining…/);
assert.match(waitlistFormSource, /Privacy Policy/);
assert.match(waitlistFunctionSource, /request\.method !== "POST"/);
assert.match(waitlistFunctionSource, /rateLimit/);
assert.match(waitlistFunctionSource, /validateWaitlist/);
assert.match(waitlistFunctionSource, /assets\.mailerlite\.com/);
assert.match(waitlistFunctionSource, /MAILERLITE_DOUBLE_OPT_IN_ENABLED/);

console.log("Launch checks passed.");
