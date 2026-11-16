import type { User } from "@netlify/identity";
export function identityOwner(user:User|null,allowed=process.env.APN_IDENTITY_OWNER_EMAIL || "") {
  const owners=allowed.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
  return !!(user?.id && user.email && user.confirmedAt && owners.includes(user.email.toLowerCase()));
}
export function sameOriginMutation(request:Request) {
  return request.method==="GET" || request.method==="HEAD" || request.headers.get("origin")===new URL(request.url).origin;
}

const identityUserUrl="https://www.apostolicpowernetwork.com/.netlify/identity/user";
export type OwnerVerification={status:"absent"|"verified"|"denied"|"unavailable";owner:boolean;retryAfter?:string;reason?:string};
// Verify the actual request cookie with this project's Identity service. Do not
// depend on optional SDK globals, decode unsigned claims, or trust user headers.
export async function verifyOwnerRequest(request:Request,allowed=process.env.APN_IDENTITY_OWNER_EMAIL||"",fetcher:typeof fetch=fetch,runtimeCookie?:string):Promise<OwnerVerification>{
  if(!allowed.trim())return {status:"absent",owner:false,reason:"owner_unconfigured"};
  const matches=(request.headers.get("cookie")||"").split(";").map(s=>s.trim()).filter(s=>s.startsWith("nf_jwt="));
  if(!matches.length&&!runtimeCookie)return {status:"absent",owner:false,reason:"cookie_missing"};
  if(matches.length>1)return {status:"denied",owner:false,reason:"cookie_conflict"};
  let token:string;try{token=decodeURIComponent(matches.length?matches[0].slice("nf_jwt=".length):runtimeCookie!);}catch{return {status:"denied",owner:false,reason:"cookie_malformed"};}
  if(token.length>8192||!/^[-\w]+\.[-\w]+\.[-\w]+$/.test(token))return {status:"denied",owner:false,reason:"cookie_malformed"};
  try{
    const response=await fetcher(identityUserUrl,{method:"GET",headers:{authorization:`Bearer ${token}`,accept:"application/json"},redirect:"error",cache:"no-store",signal:AbortSignal.timeout(5000)});
    if(response.status===401||response.status===403)return {status:"denied",owner:false,reason:"identity_rejected"};
    if(!response.ok){const retry=Number(response.headers.get("retry-after"));return {status:"unavailable",owner:false,retryAfter:String(Number.isFinite(retry)&&retry>0?Math.min(300,Math.ceil(retry)):60),reason:"identity_unavailable"};}
    const user=await response.json() as {id?:unknown;email?:unknown;confirmed_at?:unknown};
    if(typeof user.id!=="string"||typeof user.email!=="string"||typeof user.confirmed_at!=="string")return {status:"denied",owner:false,reason:"identity_profile_incomplete"};
    const owner=identityOwner({id:user.id,email:user.email,confirmedAt:user.confirmed_at},allowed);
    return owner?{status:"verified",owner:true}:{status:"denied",owner:false,reason:user.confirmed_at?"owner_mismatch":"email_unconfirmed"};
  }catch{return {status:"unavailable",owner:false,retryAfter:"60",reason:"identity_unavailable"};}
}
