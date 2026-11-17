import { authenticated } from "../../server/agents/policy";
import { tick,type WorkflowMode } from "../../server/agents/workflow";
import { getStateStore } from "../../server/agents/store";
export default async (request:Request)=>{
  if(!authenticated(request,process.env.APN_WORKER_TOKEN || process.env.APN_OWNER_TOKEN))return;
  if(process.env.APN_AGENTS_ENABLED!=="true")return;
  const body=await request.json() as {mode?:string};
  const mode=body.mode || "all";if(!["all","insights","editor","publish","discover","discover-sermon","discover-podcast","discover-music","discover-news","discover-event"].includes(mode))return;
  await tick(getStateStore(),mode as WorkflowMode);
};
export const config={background:true,rateLimit:{action:"rate_limit",aggregateBy:["ip"],windowSize:60,windowLimit:10}};
