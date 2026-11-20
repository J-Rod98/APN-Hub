#!/usr/bin/env node
// One-time owner authorization for APN's read-only Search Console access.
// Uses the dedicated desktop OAuth client (loopback redirect + PKCE), requests
// only webmasters.readonly, confirms the target property is readable, and
// prints the refresh token to store as the GSC_REFRESH_TOKEN Functions secret.
//
//   node scripts/gsc-authorize.mjs
// It asks for the client ID and secret (or reads GSC_CLIENT_ID / GSC_CLIENT_SECRET).
import { createServer } from "node:http";
import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const property = process.env.GSC_PROPERTY || "https://www.apostolicpowernetwork.com/";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
let clientId = process.env.GSC_CLIENT_ID?.trim();
let clientSecret = process.env.GSC_CLIENT_SECRET?.trim();
if (!clientId || !clientSecret) {
  const rl = createInterface({ input: process.stdin });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async prompt => { process.stdout.write(prompt); return ((await lines.next()).value || "").trim(); };
  clientId ||= await ask("Paste the Client ID, then press Enter: ");
  clientSecret ||= await ask("Paste the Client secret, then press Enter: ");
  rl.close();
}
if (!/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(clientId)) {
  console.error(`That Client ID doesn't look right: "${clientId}". It should look like 123456789012-abc123.apps.googleusercontent.com (not the client name, project ID or secret).`);
  process.exit(1);
}
if (!clientSecret) {
  console.error("No Client secret entered.");
  process.exit(1);
}

const verifier = randomBytes(32).toString("base64url");
const challenge = createHash("sha256").update(verifier).digest("base64url");
const state = randomBytes(16).toString("hex");
let redirectUri = "";

function finish(code, message) {
  console[code ? "error" : "log"](message);
  server.close();
  process.exit(code);
}

async function exchange(code) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code, code_verifier: verifier, grant_type: "authorization_code", redirect_uri: redirectUri }),
  });
  const data = await r.json();
  if (!r.ok) throw Error(`Google token exchange failed (HTTP ${r.status}): ${data.error || "unknown error"} ${data.error_description || ""}`);
  if (data.scope !== SCOPE) throw Error(`Unexpected scope granted: ${data.scope}. Expected only ${SCOPE}.`);
  if (!data.refresh_token) throw Error("Google returned no refresh token. Remove APN's access at myaccount.google.com/permissions and run this again.");
  return data;
}

async function checkProperty(accessToken) {
  const r = await fetch("https://www.googleapis.com/webmasters/v3/sites", { headers: { authorization: `Bearer ${accessToken}` } });
  if (!r.ok) throw Error(`Search Console site list failed (HTTP ${r.status}).`);
  const sites = (await r.json()).siteEntry || [];
  const match = sites.find(s => s.siteUrl === property);
  if (!match) console.log(`\nProperties this Google account can see: ${sites.length ? sites.map(s => `${s.siteUrl} (${s.permissionLevel})`).join(", ") : "none"}`);
  return match?.permissionLevel || "not listed";
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname !== "/callback") return res.writeHead(404).end();
  const reply = text => res.writeHead(200, { "content-type": "text/plain; charset=utf-8" }).end(text);
  if (url.searchParams.get("state") !== state) return reply("State mismatch; ignored.");
  if (url.searchParams.get("error")) {
    reply("Authorization was not completed. You can close this tab.");
    return finish(1, `Google returned: ${url.searchParams.get("error")}`);
  }
  try {
    const tokens = await exchange(url.searchParams.get("code"));
    const permission = await checkProperty(tokens.access_token);
    reply("APN Search Console authorization complete. Return to the terminal; you can close this tab.");
    const usable = ["siteOwner", "siteFullUser", "siteRestrictedUser"].includes(permission);
    finish(0, [
      "",
      `Scope granted: ${SCOPE}`,
      `Property ${property}: ${permission}${usable ? " (readable)" : " — NOT readable yet; verify or get access to this property before relying on reports"}`,
      "",
      "Add these to Netlify → Site configuration → Environment variables (scope: Functions, mark the token and secret as secret):",
      `  GSC_PROPERTY=${property}`,
      "  GSC_CLIENT_ID=<the client ID you used>",
      "  GSC_CLIENT_SECRET=<the client secret you used>",
      `  GSC_REFRESH_TOKEN=${tokens.refresh_token}`,
      "",
      "Do not commit or share the refresh token.",
    ].join("\n"));
  } catch (e) {
    reply("Authorization failed. Check the terminal for details.");
    finish(1, e.message);
  }
});

server.listen(0, "127.0.0.1", () => {
  redirectUri = `http://127.0.0.1:${server.address().port}/callback`;
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: SCOPE, access_type: "offline", prompt: "consent", state, code_challenge: challenge, code_challenge_method: "S256" });
  console.log("Open this URL to authorize APN's read-only Search Console access:\n\n" + auth + "\n");
  if (process.platform === "darwin") spawn("open", [auth.toString()], { stdio: "ignore" }).on("error", () => {});
  setTimeout(() => finish(1, "Timed out after 5 minutes without authorization."), 5 * 60 * 1000).unref();
});
