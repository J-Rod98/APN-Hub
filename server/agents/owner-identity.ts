import type { User } from "@netlify/identity";
export function identityOwner(user:User|null,allowed=process.env.APN_IDENTITY_OWNER_EMAIL || "") {
  const owners=allowed.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
  return !!(user?.id && user.email && user.confirmedAt && owners.includes(user.email.toLowerCase()));
}
export function sameOriginMutation(request:Request) {
  return request.method==="GET" || request.method==="HEAD" || request.headers.get("origin")===new URL(request.url).origin;
}
