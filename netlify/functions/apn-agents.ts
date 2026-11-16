import { getUser } from "@netlify/identity";
import { identityOwner } from "../../server/agents/owner-identity";
import { api } from "../../server/agents/api";
export default async (request:Request)=>{
  let owner=false;
  if(process.env.APN_IDENTITY_OWNER_EMAIL){try{owner=identityOwner(await getUser());}catch{owner=false;}}
  return api(request,undefined,async mode=>{
  const origin=process.env.DEPLOY_PRIME_URL || process.env.URL;
  if(!origin)throw new Error("Netlify deployment URL is unavailable.");
  const result=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${process.env.APN_WORKER_TOKEN || process.env.APN_OWNER_TOKEN}`,"content-type":"application/json"},body:JSON.stringify({mode}),signal:AbortSignal.timeout(10000)});
  if(!result.ok)throw new Error(`Worker trigger HTTP ${result.status}`);
},owner);
};
export const config={path:"/api/apn-agents",rateLimit:{action:"rate_limit",aggregateBy:["ip"],windowSize:60,windowLimit:120}};
