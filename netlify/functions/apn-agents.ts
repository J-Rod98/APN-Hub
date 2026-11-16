import { verifyOwnerRequest,type OwnerVerification } from "../../server/agents/owner-identity";
import { authenticated } from "../../server/agents/policy";
import type { Context } from "@netlify/functions";
import { api } from "../../server/agents/api";
export default async (request:Request,context?:Context)=>{
  let runtimeCookie:string|undefined;try{runtimeCookie=context?.cookies.get("nf_jwt");}catch{}
  const verified:OwnerVerification=authenticated(request)?{owner:false,status:"absent"}:await verifyOwnerRequest(request,undefined,undefined,runtimeCookie);
  if(verified.status==="unavailable")return Response.json({error:"Your session could not be verified because the sign-in service is temporarily unavailable. Wait and refresh this page; your session has been retained."},{status:503,headers:{"cache-control":"no-store","retry-after":verified.retryAfter||"60"}});
  const owner=verified.owner;
  const response=await api(request,undefined,async mode=>{
  const origin=process.env.DEPLOY_PRIME_URL || process.env.URL;
  if(!origin)throw new Error("Netlify deployment URL is unavailable.");
  const result=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${process.env.APN_WORKER_TOKEN || process.env.APN_OWNER_TOKEN}`,"content-type":"application/json"},body:JSON.stringify({mode}),signal:AbortSignal.timeout(10000)});
  if(!result.ok)throw new Error(`Worker trigger HTTP ${result.status}`);
},owner);
  if(response.status===401)return Response.json({error:"Owner access required.",code:verified.reason||verified.status},{status:401,headers:{"cache-control":"no-store","x-content-type-options":"nosniff"}});
  return response;
};
export const config={path:"/api/apn-agents",rateLimit:{action:"rate_limit",aggregateBy:["ip"],windowSize:60,windowLimit:120}};
