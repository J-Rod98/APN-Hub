import { runDiscovery,listingDraft } from "./discovery";
import { discoveryCategories,type DiscoveryCategory } from "./discovery-types";
import { randomUUID } from "node:crypto";
import { guides } from "../../src/lib/guides";
import { auditPublicSite, searchConsole, searchWindow, type PageAudit } from "./connectors";
import { DOCTRINE, generate } from "./model";
import { action, assertApproved, digest, now, permittedSource, SITE, validateDraft } from "./policy";
import { publishTask } from "./publish";
import { draftSchema, insightSchema, type Evidence, type Proposal, type Source, type State, type Task } from "./types";
import type { StateStore } from "./store";

export function weekId(at=new Date()) {const d=new Date(at);d.setUTCHours(0,0,0,0);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
function putTask(s:State,p:Proposal,sourceIds:string[]) {
  const active=s.tasks.find(t=>p.kind==="metadata" && t.kind===p.kind && t.targetPath===p.targetPath && !["published","rejected"].includes(t.status));
  if(active)return active.id;
  const id=digest([p.kind,p.targetPath,p.kind==="metadata"?"":p.title.toLowerCase(),sourceIds]).slice(0,24);
  if(s.tasks.some(t=>t.id===id))return id;
  s.tasks.push({...p,id,status:"queued",sourceIds,createdAt:now(),updatedAt:now(),attempts:0});action(s,"APN Insights","task-created",id,p.title);return id;
}
export function ownedPage(p:PageAudit):Source {
  const hash=digest(p.text);return {id:`owner-${digest(p.path).slice(0,12)}-${hash.slice(0,12)}`,hash,title:p.title,url:SITE+p.path,kind:"owner_page",text:p.text,rights:"owned",rightsEvidence:"Existing APN first-party published page; owner requested improvements to this website.",verifiedAt:now(),copyrightFlag:false,clipKey:null,manifestHash:null};
}
export async function runInsights(store:StateStore,deps={audit:auditPublicSite,search:searchConsole,model:generate}) {
  const id=weekId();if((await store.read()).reports.some(r=>r.id===id))return;
  const {pages,evidence}=await deps.audit();const gsc=await deps.search();
  const at=now();evidence.push({id:"gsc",type:"search-console",observedAt:at,url:"https://search.google.com/search-console",data:gsc});
  const state=await store.read();
  // Imported Netlify observations remain dated evidence. Never turn a missing
  // credential, stale export, or unavailable measurement into a zero.
  const snapshot=state.reports.flatMap(r=>r.evidence).filter(e=>e.type==="netlify-owner-snapshot").sort((a,b)=>b.observedAt.localeCompare(a.observedAt))[0];
  if(snapshot)evidence.push({...snapshot,data:{snapshot:snapshot.data,ageDays:(Date.now()-Date.parse(snapshot.observedAt))/86400000,collection:"Owner-imported; not a live Netlify API connection"}});
  else evidence.push({id:"netlify-access",type:"access-gap",observedAt:at,url:"https://app.netlify.com/projects/apn-hub/analytics-and-metrics/analytics",data:{status:"unavailable",reason:"No current Netlify export or supported server analytics connection."}});
  const compact={pages:pages.map(({text,...p})=>({...p,evidenceId:digest(p.path).slice(0,16)})),searchConsole:{...gsc,evidenceId:"gsc"},netlify:snapshot?{evidenceId:snapshot.id,observedAt:snapshot.observedAt,data:snapshot.data}:null,existingGuides:guides.map(g=>({slug:g.slug,title:g.title})),evidenceIds:evidence.map(e=>e.id),evidenceIndex:evidence.map(({id,type,url,observedAt})=>({id,type,url,observedAt})),firstWorkflow:"Prioritize a bounded metadata improvement for /about/ based on its current mission, audience, content review and convictions. Keep technical access/error investigations separate from content writing."};
  let insights;
  try { insights=await deps.model(store,"APN Insights",`${DOCTRINE} You are the analytics and SEO specialist. Analyze only supplied observations. Distinguish evidence, inference and missing access. Traffic, people, referrers and GSC clicks are different. Never infer queries or rankings without GSC rows. Propose at most 6 useful tasks with evidenceIds from the provided list and targetPath from the supplied pages. Use technical tasks for access and unproven HTTP errors. Prioritize by observed impact and confidence. Identify useful content gaps but do not fabricate search demand. The other agent will consume tasks after source clearance.`,insightSchema,compact); } catch(e) {
    const failure=e instanceof Error?e.message:"Insights failed";
    await store.update(s=>{if(!s.reports.some(r=>r.id===id)){const w=searchWindow();s.reports.push({id,at,start:w.start,end:w.end,summary:"Insights could not complete. Recorded observations remain available; no performance conclusions were generated.",failure,uncertainties:[failure,"Owner retry is required; no automatic repeated model call."],evidence,taskIds:[]});}});
    throw e;
  }
  await store.update(s=>{
    if(s.reports.some(r=>r.id===id))return;
    const sourceByPath=new Map<string,string>();
    for(const page of pages.filter(p=>p.status===200 && p.text.length>=30)){
      const src=ownedPage(page);if(!s.sources.some(x=>x.id===src.id))s.sources.push(src);sourceByPath.set(page.path,src.id);
    }
    const proposals=insights.tasks.slice(0,6).filter(p=>pages.some(page=>page.path===p.targetPath) && p.evidenceIds.length && p.evidenceIds.every(id=>evidence.some(e=>e.id===id)));
    const about=pages.find(p=>p.path==="/about/" && p.status===200);
    if(about && !proposals.some(p=>p.kind==="metadata" && p.targetPath==="/about/")) proposals.push({title:"Improve APN About page metadata",kind:"metadata",priority:"medium",targetPath:"/about/",rationale:"The existing page introduces APN mission, reviewed content, audience and convictions; make metadata accurately summarize that page.",evidenceIds:[digest("/about/").slice(0,16)]});
    // First-party metadata can proceed. Novel teaching/events/third-party media
    // require dedicated authorized sources instead of treating a linked page
    // as permission to reproduce its content.
    const taskIds=proposals.map(p=>putTask(s,p,p.kind==="metadata" && sourceByPath.has(p.targetPath)?[sourceByPath.get(p.targetPath)!]:[]));
    const w=searchWindow();s.reports.push({id,at,start:w.start,end:w.end,summary:insights.summary,uncertainties:[...insights.uncertainties,...(gsc.status!=="available"?["Search Console metrics and indexing are unavailable; verify APN ownership and configure read-only authorization."]:[])],evidence,taskIds});
    action(s,"APN Insights","report-created",id,"Real observations; missing sources remain unavailable.");
  });
}
export async function draftNext(store:StateStore,generateDraft:typeof generate=generate) {
  const task=await store.update(s=>{
    const rank={high:0,medium:1,low:2};
    const t=s.tasks.filter(t=>t.status==="queued" && t.kind!=="technical").sort((a,b)=>rank[a.priority]-rank[b.priority]||a.createdAt.localeCompare(b.createdAt))[0];
    if(!t)return null;
    const sources=t.sourceIds.map(id=>s.sources.find(x=>x.id===id)).filter((x):x is Source=>!!x);
    if(!sources.length || sources.some(src=>!permittedSource(src))){t.status="blocked";t.error="Add source text and processing/publication rights before drafting.";action(s,"APN Editor","source-blocked",t.id);return null;}
    if(t.kind==="news"&&t.discovery){const published=Date.parse(t.discovery.publishedAt||"");if(!Number.isFinite(published)||published>Date.now()+86400000||Date.now()-published>90*86400000){t.status="blocked";t.error="News needs a verified original publication date within 90 days; no model call was made.";action(s,"APN Editor","news-date-blocked",t.id);return null;}}
    if(t.attempts>=3){t.status="failed";t.error="Maximum draft attempts reached.";return null;}
    t.status="drafting";t.attempts++;t.updatedAt=now();action(s,"APN Editor","draft-started",t.id);return structuredClone(t);
  });
  if(!task)return;
  try{
    const s=await store.read();const sources=s.sources.filter(src=>task.sourceIds.includes(src.id));
    const paths=["/","/about/","/preaching/","/podcast/","/events/","/materials/","/guides/","/news/","/music/",...guides.map(g=>`/guides/${g.slug}/`)];
    const d=task.discovery&&["sermon","podcast","music"].includes(task.kind)?listingDraft(task,sources[0]):await generateDraft(store,"APN Editor",`${DOCTRINE} You are the original content research and editing specialist. Consume this prioritized task using only the supplied authorized sources. Accurate metadata, useful original writing and verified internal links matter more than volume. Never reconstruct a missing transcript or quote from memory. Every factual claim must include an exact supporting source excerpt. Quotes must be exact substrings. For metadata tasks return only a title and description; set intro empty, sections/faqs empty, event null. For a resource or Bible study write original sections; a Bible study must use supplied Scripture text. Event fields must exactly occur in organizer evidence including timezone. Use only the provided internal paths. Flag anything uncertain instead of completing it. For news, write an original attributed factual brief of at most 180 words across ALL visible fields, with two short sections, no quotations, and only facts supported by actual source excerpts. Link-only sources authorize a reference brief, not reproduction or invented interviews. Write plain prose, without Markdown link syntax; put links only in the structured internalLinks field. Use uncertainties and doctrineFlags only for specific unresolved facts or interpretations. Routine owner approval, source-identity checks and Apostolic relevance review already have mandatory dashboard attestations; do not repeat those reminders as factual uncertainties. Do not claim a checklist, doctrine, source rights or publication was approved.`,draftSchema,{task,sources:sources.map(({hash,...src})=>src),paths,existingTitles:guides.map(g=>g.title)});
    await store.update(s=>{
      const current=s.tasks.find(t=>t.id===task.id)!;if(current.status!=="drafting")return;
      const checks=validateDraft(current,d,s.sources.filter(src=>current.sourceIds.includes(src.id)),paths,guides);
      current.draft=d;current.draftHash=digest(d);current.checks=checks;delete current.approval;current.updatedAt=now();current.status=checks.length?"blocked":"review";
      action(s,"APN Editor","draft-completed",task.id,checks.length?`${checks.length} blocking checks`:"Awaiting owner review");
    });
  }catch(e){await store.update(s=>{const t=s.tasks.find(t=>t.id===task.id)!;t.status="failed";t.error=e instanceof Error?e.message:"Draft failed";t.updatedAt=now();action(s,"APN Editor","draft-failed",task.id,t.error);});}
}
export async function publishNext(store:StateStore) {
  if(process.env.APN_PUBLISH_ENABLED!=="true")return;
  const task=await store.update(s=>{
    const t=s.tasks.find(t=>t.status==="approved" && t.kind!=="clip" && Date.parse(t.approval!.scheduledAt)<=Date.now());
    if(!t)return null;assertApproved(t,s);
    t.status="publishing";t.updatedAt=now();action(s,"publisher","publish-started",t.id);return structuredClone(t);
  });
  if(!task)return;
  try {
    const s=await store.read();const sources=s.sources.filter(src=>task.sourceIds.includes(src.id));
    const paths=["/","/about/","/preaching/","/podcast/","/events/","/materials/","/guides/","/news/","/music/",...guides.map(g=>`/guides/${g.slug}/`)];
    const checks=validateDraft(task,task.draft!,sources,paths,guides);
    if(checks.length)throw new Error(checks.join(" "));
    const publication=await publishTask(task,s);
    await store.update(s=>{const t=s.tasks.find(t=>t.id===task.id)!;assertApproved(t,s);t.status="published";t.publication=publication;t.updatedAt=now();action(s,"publisher","content-committed",t.id,publication.commit);});
  }catch(e){await store.update(s=>{const t=s.tasks.find(t=>t.id===task.id)!;t.status="failed";t.error=e instanceof Error?e.message:"Publication failed; reconcile before retrying";t.updatedAt=now();action(s,"publisher","publish-failed",t.id,t.error);});}
}
export type WorkflowMode="all"|"insights"|"editor"|"publish"|"discover"|`discover-${DiscoveryCategory}`;
export async function tick(store:StateStore,mode:WorkflowMode="all") {
  const token=randomUUID();const acquired=await store.update(s=>{
    if(s.jobs.worker && Date.parse(s.jobs.worker.until)>Date.now())return false;
    for(const t of s.tasks.filter(t=>["drafting","publishing"].includes(t.status))){t.status="failed";t.error="Previous worker interrupted. Reconcile before owner retry; do not assume the external action failed.";action(s,"worker","interrupted",t.id);}
    for(const r of s.discovery?.runs||[])if(r.status==="running"){r.status="failed";r.errors.push("Previous worker interrupted; explicit owner retry required.");action(s,"worker","discovery-interrupted",r.id);}
    s.jobs.worker={token,until:new Date(Date.now()+12*60000).toISOString()};return true;
  });
  if(!acquired)return {status:"busy"};
  try{
    if(mode==="insights")await runInsights(store);
    if(mode==="all")try{await runInsights(store);}catch(e){await store.update(s=>action(s,"worker","insights-stage-failed",mode,(e as Error).message));}
    if(mode==="discover"||mode.startsWith("discover-"))await runDiscovery(store,mode.startsWith("discover-")?mode.slice(9) as DiscoveryCategory:undefined);
    if(mode==="all")try{await runDiscovery(store);}catch(e){await store.update(s=>action(s,"worker","discovery-stage-failed",mode,(e as Error).message));}
    if(mode==="all"||mode==="editor"||mode.startsWith("discover"))await draftNext(store);
    if(mode==="all"||mode==="publish")await publishNext(store);
    return {status:"complete"};
  }catch(e){await store.update(s=>action(s,"worker","run-failed",mode,e instanceof Error?e.message:"Run failed"));throw e;}
  finally{await store.update(s=>{if(s.jobs.worker?.token===token)delete s.jobs.worker;});}
}
