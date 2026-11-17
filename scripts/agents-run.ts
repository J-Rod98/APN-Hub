import { loadEnvConfig } from "@next/env";
import { FileStore } from "../server/agents/store";
import { tick,type WorkflowMode } from "../server/agents/workflow";
loadEnvConfig(process.env.APN_ENV_DIR || process.cwd());
const mode=process.argv[2]||"all";
if(!["all","insights","editor","publish","discover","discover-sermon","discover-podcast","discover-music","discover-news","discover-event"].includes(mode))throw new Error("Use all, insights, editor, publish, discover or discover-{sermon,podcast,music,news,event}");
const store=new FileStore(process.env.APN_LOCAL_STATE || ".agent-data/state.json");
void tick(store,mode as WorkflowMode).then(async r=>{const s=await store.read();console.log(JSON.stringify({status:r.status,tasks:s.tasks.map(t=>({id:t.id,title:t.title,status:t.status,error:t.error,checks:t.checks})),modelCalls:s.costs.map(c=>({agent:c.agent,status:c.status,inputTokens:c.inputTokens,outputTokens:c.outputTokens,estimatedUsd:c.estimatedUsd}))},null,2));}).catch(e=>{console.error(e.message);process.exitCode=1;});
