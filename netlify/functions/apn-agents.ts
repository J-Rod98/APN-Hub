import { verifyOwnerRequest,type OwnerVerification } from "../../server/agents/owner-identity";
import { authenticated } from "../../server/agents/policy";
import { api } from "../../server/agents/api";
export default async (request:Request)=>{
  const verified:OwnerVerification=authenticated(request)?{owner:false,status:"absent"}:await verifyOwnerRequest(request);
  if(verified.status==="unavailable")return Response.json({error:"Your session could not be verified because the sign-in service is temporarily unavailable. Wait and refresh this page; your session has been retained."},{status:503,headers:{"cache-control":"no-store","retry-after":verified.retryAfter||"60"}});
  const owner=verified.owner;
  return api(request,undefined,async mode=>{
  const origin=process.env.DEPLOY_PRIME_URL || process.env.URL;
  if(!origin)throw new Error("Netlify deployment URL is unavailable.");
  const result=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${process.env.APN_WORKER_TOKEN || process.env.APN_OWNER_TOKEN}`,"content-type":"application/json"},body:JSON.stringify({mode}),signal:AbortSignal.timeout(10000)});
  if(!result.ok)throw new Error(`Worker trigger HTTP ${result.status}`);
},owner);
};
export const config={path:"/api/apn-agents",rateLimit:{action:"rate_limit",aggregateBy:["ip"],windowSize:60,windowLimit:120}};
