import { FileStore } from "../server/agents/store";
import { recheckTask } from "../server/agents/policy";
import { guides } from "../src/lib/guides";
const id=process.argv[2];if(!id)throw new Error("Pass an unapproved task ID.");
const store=new FileStore(process.env.APN_LOCAL_STATE || ".agent-data/state.json");
const paths=["/","/about/","/preaching/","/podcast/","/events/","/materials/","/guides/",...guides.map(g=>`/guides/${g.slug}/`)];
void store.update(s=>recheckTask(s,id,paths,guides)).then(t=>console.log(JSON.stringify({id:t.id,status:t.status,checks:t.checks,ownerApproved:!!t.approval},null,2))).catch(e=>{console.error(e.message);process.exitCode=1;});
