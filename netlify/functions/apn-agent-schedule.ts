// A short cron trigger delegates long AI calls to a background function.
// 12:15 UTC daily = 06:15 CST / 07:15 CDT. Insights runs once per UTC week;
// the editor consumes one cleared task per tick; publication needs approval.
export default async ()=>{
  if(process.env.APN_AGENTS_ENABLED!=="true")return;
  const origin=process.env.URL;const token=process.env.APN_WORKER_TOKEN || process.env.APN_OWNER_TOKEN;
  if(!origin || !token)throw new Error("Agent schedule credentials are missing.");
  const r=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify({mode:"all"}),signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw new Error(`Worker trigger HTTP ${r.status}`);
};
export const config={schedule:"15 12 * * *"};
