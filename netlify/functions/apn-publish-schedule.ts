// Publication checks are independent of the daily research run and make no AI
// requests. The existing worker verifies exact owner approval before any write.
export default async ()=>{
  if(process.env.APN_AGENTS_ENABLED!=="true"||process.env.APN_PUBLISH_ENABLED!=="true")return;
  const origin=process.env.URL;const token=process.env.APN_WORKER_TOKEN||process.env.APN_OWNER_TOKEN;
  if(!origin||!token)throw new Error("Publication schedule credentials are missing.");
  const r=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify({mode:"publish"}),signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw new Error(`Publication worker trigger HTTP ${r.status}`);
};
export const config={schedule:"*/15 * * * *"};
