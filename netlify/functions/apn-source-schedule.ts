// Hourly trusted-source intake; shared leases and the daily budget/cap apply.
export default async()=>{
 if(process.env.APN_AGENTS_ENABLED!=="true"||process.env.APN_PUBLISH_ENABLED!=="true")return;
 const origin=process.env.URL,token=process.env.APN_WORKER_TOKEN||process.env.APN_OWNER_TOKEN;if(!origin||!token)throw Error("Source schedule credentials missing.");
 const r=await fetch(`${origin}/.netlify/functions/apn-agent-worker`,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify({mode:"trusted"}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error("Trusted worker trigger HTTP "+r.status);
};
export const config={schedule:"5 * * * *"};
