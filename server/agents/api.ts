import { verifyRule,INITIAL_SOURCES } from "./trusted-sources";
import { automationState,revokePolicy,saveRule,assertPublicationAuthorized } from "./automation-policy";
import { assignSlot, planTask, saveReviewDraft, slotSchema } from "./content-plan";
import { canonicalUrl, readReference } from "./public-references";
import { discoveryState,prepareCandidate, candidateFromReference, existingUrls, listingDraft } from "./discovery";
import { discoveryCategories,discoverySettingsSchema } from "./discovery-types";
import { importUnapprovedState } from "./import-state";
import { sameOriginMutation } from "./owner-identity";
import { z } from "zod";
import { guides } from "../../src/lib/guides";
import { authenticated,action,approve,digest,now,assertApproved,validateDraft,recheckTask } from "./policy";
import { sourceSchema,taskProposalSchema,type Task,type State } from "./types";
import { getStateStore,type StateStore } from "./store";
const json=(v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:{"content-type":"application/json","cache-control":"no-store","x-content-type-options":"nosniff"}});
export function capabilities(){return {openai:!!process.env.OPENAI_API_KEY,searchConsole:["GSC_CLIENT_ID","GSC_CLIENT_SECRET","GSC_REFRESH_TOKEN"].every(k=>!!process.env[k]),netlifyAnalytics:"Owner-imported dated snapshots; no live API configured",publishingEnabled:process.env.APN_PUBLISH_ENABLED==="true",schedulesEnabled:process.env.APN_AGENTS_ENABLED==="true",github:!!process.env.APN_GITHUB_TOKEN,clipper:"Existing publisher bridge; media processing still uses its current host",dailyBudgetUsd:Number(process.env.APN_DAILY_BUDGET_USD||1)};}
const paths=["/","/about/","/preaching/","/podcast/","/events/","/materials/","/guides/","/news/","/music/",...guides.map(g=>`/guides/${g.slug}/`)];
export async function api(request:Request,store?:StateStore,trigger?:(mode:string)=>Promise<void>,identityVerified=false):Promise<Response>{
  const bearer=authenticated(request);
  if(!bearer && !identityVerified)return json({error:"Owner access required."},401);
  if(!bearer && !sameOriginMutation(request))return json({error:"Same-origin owner request required."},403);
  store ??= getStateStore();
  try{
    if(request.method==="GET"){
      const s=await store.read();
      if(new URL(request.url).searchParams.get("view")==="clipper")return json({jobs:s.tasks.filter(t=>t.kind==="clip" && t.status==="approved" && Date.parse(t.approval!.scheduledAt)<=Date.now()).map(t=>{assertApproved(t,s);const src=s.sources.find(src=>t.sourceIds.includes(src.id) && src.clipKey && src.manifestHash);if(!src)throw new Error("Clip task needs a source with exact manifest hash.");return {id:t.id,hash:t.approval!.hash,clipKey:src.clipKey,manifestHash:src.manifestHash,scheduledAt:t.approval!.scheduledAt,copyrightAcknowledged:!src.copyrightFlag || t.approval!.checklist.includes("copyright"),caption:`${t.draft!.title}\n\n${t.draft!.description}\n\nSource: ${src.url}`};})});
      return json({state:s,capabilities:capabilities()});
    }
    if(request.method!=="POST")return json({error:"Method not allowed"},405);
    const text=await request.text();if(Buffer.byteLength(text)>100000)return json({error:"Request too large"},413);
    const b=JSON.parse(text) as Record<string,unknown>;const op=z.string().parse(b.action);
    if(op==="run") {if(process.env.CONTEXT && process.env.APN_AGENTS_ENABLED!=="true")throw new Error("Enable the reviewed server agents before requesting a run.");const mode=z.enum(["all","insights","editor","publish","trusted","discover",...discoveryCategories.map(c=>"discover-"+c)]).parse(b.mode||"all");if(!trigger)throw new Error("Worker trigger is unavailable.");await trigger(mode);return json({status:"accepted"},202);}
    if(op==="automation-pause" || op==="source-pause")return json(await store.update(s=>{revokePolicy(s,op==="source-pause"?z.string().parse(b.id):undefined);return {ok:true};}));
    const verifiedRule = op==="trusted-source" ? await verifyRule(b.source) : null;
    const initialRules = op==="trusted-source-presets" ? await Promise.all(INITIAL_SOURCES.map(source=>verifyRule(source))) : null;
    // Fetch public evidence before the atomic mutation, through the existing
    // SSRF-checked reference reader. No model call or publication occurs here.
    const intake = op === "research-intake" ? z.object({ action: z.literal("research-intake"), category: z.enum(discoveryCategories), url: z.string().url(), slot: slotSchema }).strict().parse(b) : null;
    const reference = intake ? await readReference(intake.url) : null;
    const result=await store.update(s=>{
      if(s.jobs.worker && Date.parse(s.jobs.worker.until)>Date.now())throw new Error("Worker is running; retry after it finishes.");
      if(verifiedRule)return saveRule(s,verifiedRule);
      if(initialRules){const rules=initialRules.map(r=>saveRule(s,r));action(s,"owner","initial-source-policy-approved","automation","Owner selected these four named sources in the APN setup conversation.");return rules;}
      if(op==="automation-settings") {const settings=z.object({enabled:z.boolean(),dailyLimit:z.number().int().min(1).max(2)}).strict().parse(b.settings);const a=automationState(s);if(settings.enabled&&!a.rules.some(r=>r.enabled))throw Error("Approve at least one exact source first.");if(!settings.enabled)revokePolicy(s);a.enabled=settings.enabled;a.dailyLimit=settings.dailyLimit;action(s,"owner","automatic-publishing-settings","automation",`${settings.enabled?"enabled":"paused"}; maximum ${settings.dailyLimit} automatic posts per America/Chicago day.`);return {ok:true};}
      if(op==="plan-slot") return planTask(s, b.item);
      if(op==="review-draft") return saveReviewDraft(s, b.item, paths, guides);
      if(intake && reference) {
        const url = canonicalUrl(reference.url);
        if(existingUrls().has(url)) throw new Error("This source is already public on APN.");
        const ds = discoveryState(s);
        let candidate = ds.candidates.find(c => canonicalUrl(c.url) === url);
        if(candidate && candidate.category !== intake.category) throw new Error("This source is already classified in a different category.");
        if(!candidate) { candidate = candidateFromReference(intake.category, reference, [url]); ds.candidates.push(candidate); }
        const prior = s.tasks.find(t => t.discovery?.candidateId === candidate!.id);
        if(prior && ["rejected","published","publishing","handed_off"].includes(prior.status)) throw new Error("This source has already been resolved.");
        const t = prior || prepareCandidate(s, candidate.id, "link");
        assignSlot(s,t,intake.slot,true);
        if(!t.draft && ["sermon","podcast","music"].includes(t.kind)) {
          const src = s.sources.find(src => t.sourceIds.includes(src.id))!;
          return saveReviewDraft(s, {id:t.id, sourceIds:t.sourceIds, draft:listingDraft(t,src)}, paths, guides);
        }
        // News and events need an original researched draft. Keep them out of
        // the paid worker until one is supplied or explicitly retried.
        if(!t.draft) { t.status="blocked";t.checks=["Research the original report or verify event dates, timezone and venue before drafting."]; }
        return t;
      }
      if(op==="discovery-settings"){const settings=discoverySettingsSchema.parse(b.settings);for(const feed of settings.feeds){const url=new URL(feed.url);if(url.protocol!=="https:"||url.username||url.password)throw new Error("Feeds require a public HTTPS URL.");}discoveryState(s).settings=settings;action(s,"owner","discovery-settings-saved","discovery");return {ok:true};}
      if(op==="discovery-prepare")return prepareCandidate(s,z.string().parse(b.id),z.enum(["link","embed"]).parse(b.embedMode||"link"));
      if(op==="discovery-embedding"){const t=s.tasks.find(t=>t.id===b.id);if(t?.status==="failed"&&(t.approval||t.policyAuthorization))throw Error("Reconcile the possible publication before changing its media use.");if(!t?.discovery||!["sermon","podcast","music"].includes(t.kind)||!["queued","review","blocked","failed","approved"].includes(t.status))throw new Error("Choose an editable discovered media task.");t.discovery.embedMode=z.enum(["link","embed"]).parse(b.embedMode);delete t.approval;withdrawPolicy(s,t);if(t.status==="approved")t.status="review";t.updatedAt=now();action(s,"owner","discovery-embedding-changed",t.id,"Any earlier approval was withdrawn; exact embedding clearance is required.");return t;}
      if(op==="discovery-dismiss"){const candidate=discoveryState(s).candidates.find(c=>c.id===b.id);if(!candidate||candidate.status!=="new")throw new Error("Choose a new discovery candidate.");candidate.status="dismissed";action(s,"owner","discovery-dismissed",candidate.id);return {ok:true};}
      if(op==="discovery-retry"){const run=discoveryState(s).runs.find(r=>r.id===b.id);if(!run||run.status!=="failed")throw new Error("Only failed discovery runs can be retried.");const latest=[...discoveryState(s).runs].reverse().find(r=>r.day===run.day&&r.category===run.category);if(latest?.id!==run.id)throw new Error("A later run has superseded this failure.");run.retry=true;action(s,"owner","discovery-retry-requested",run.id);return {ok:true};}
      if(op==="initial-import"){
        if(process.env.APN_INITIAL_IMPORT_ENABLED!=="true")throw new Error("Initial import is disabled.");
        return importUnapprovedState(s,b.state);
      }
      if(op==="source"){
        const data=sourceSchema.parse(b.source);if(new URL(data.url).protocol!=="https:" || new URL(data.url).username || new URL(data.url).password)throw new Error("Sources need an HTTPS attribution URL.");
        if(data.rights!=="unknown" && data.rightsEvidence.trim().length<15)throw new Error("Describe the actual rights/authorization evidence.");
        if(Date.parse(data.verifiedAt)>Date.now()+60000)throw new Error("Source verification cannot be in the future.");
        const hash=digest(data);const src={...data,id:`source-${digest([data.url,hash,data.rights,data.rightsEvidence]).slice(0,24)}`,hash};
        if(!s.sources.some(x=>x.id===src.id))s.sources.push(src);action(s,"owner","source-added",src.id,data.rights);return src;
      }
      if(op==="snapshot"){
        const data=z.object({periodStart:z.string().date(),periodEnd:z.string().date(),observedAt:z.string().datetime(),pageviews:z.number().int().nonnegative(),uniqueVisitors:z.number().int().nonnegative(),rootNotFound:z.number().int().nonnegative(),notes:z.string().max(5000)}).parse(b.snapshot);
        if(Date.parse(data.periodStart)>Date.parse(data.periodEnd)||Date.parse(data.observedAt)>Date.now()+60000)throw new Error("Snapshot dates are invalid.");
        s.reports.push({id:`netlify-import-${digest(data).slice(0,12)}`,at:now(),start:data.periodStart,end:data.periodEnd,summary:"Owner-imported Netlify Analytics snapshot; automated traffic may be included.",uncertainties:["Imported snapshot; no claim of live API access or human traffic."],taskIds:[],evidence:[{id:`netlify-${digest(data).slice(0,12)}`,type:"netlify-owner-snapshot",observedAt:data.observedAt,url:"https://app.netlify.com/projects/apn-hub/analytics-and-metrics/analytics",data}]});action(s,"owner","netlify-imported",data.observedAt);return {ok:true};
      }
      if(op==="task"){
        const p=taskProposalSchema.parse(b.task);const sourceIds=z.array(z.string()).parse(b.sourceIds);
        if(!paths.includes(p.targetPath))throw new Error("Choose an existing APN target path.");
        if(sourceIds.some(id=>!s.sources.some(src=>src.id===id)))throw new Error("Unknown source.");
        if(p.kind==="metadata" && s.tasks.some(t=>t.kind==="metadata" && t.targetPath===p.targetPath && !["published","rejected"].includes(t.status)))throw new Error("An active metadata task already exists for that page. Resolve it before creating a replacement.");
        const t:Task={...p,id:digest([p.kind,p.targetPath,p.title]).slice(0,24),status:"queued",sourceIds,createdAt:now(),updatedAt:now(),attempts:0};
        if(s.tasks.some(x=>x.id===t.id))throw new Error("This task already exists.");s.tasks.push(t);action(s,"owner","task-created",t.id);return t;
      }
      if(op==="retry-report"){const id=z.string().parse(b.id);const report=s.reports.find(r=>r.id===id);if(!report?.failure)throw new Error("Only a failed report can be retried.");report.id=`${id}-failed-${Date.now()}`;action(s,"owner","insights-retry-requested",id);return {ok:true};}
      const id=z.string().parse(b.id);const t=s.tasks.find(t=>t.id===id);if(!t)throw new Error("Task not found.");
      if(op==="recheck")return recheckTask(s,id,paths,guides);
      if(op==="approve"){
        const checks=validateDraft(t,t.draft!,s.sources.filter(src=>t.sourceIds.includes(src.id)),paths,guides);if(checks.length)throw new Error(checks.join(" "));
        return approve(s,id,z.string().parse(b.hash),z.array(z.string()).parse(b.checklist),z.string().datetime().parse(b.scheduledAt));
      }
      if(op==="reject"){if(["published","handed_off","publishing","drafting"].includes(t.status))throw new Error("This task cannot be rejected now.");t.status="rejected";delete t.approval;withdrawPolicy(s,t);const candidate=s.discovery?.candidates.find(c=>c.taskId===t.id);if(candidate)candidate.status="dismissed";action(s,"owner","rejected",id);return t;}
      if(op==="attach"){
        if(["published","handed_off","publishing","drafting"].includes(t.status))throw new Error("This task cannot be revised now.");
        if(t.status==="failed"&&(t.approval||t.policyAuthorization))throw Error("Reconcile the possible publication before revising its sources.");
        const ids=z.array(z.string()).min(1).parse(b.sourceIds);if(ids.some(id=>!s.sources.some(x=>x.id===id)))throw new Error("Unknown source.");t.sourceIds=ids;t.status="queued";delete t.approval;withdrawPolicy(s,t);delete t.draft;delete t.draftHash;delete t.error;action(s,"owner","sources-attached",id,"Any previous draft approval was invalidated.");return t;
      }
      if(op==="retry"){
        if(!["failed","blocked"].includes(t.status))throw new Error("Only failed/blocked tasks can be retried.");
        if(t.approval||t.policyAuthorization)throw new Error("Publication outcome may be uncertain. Use reconcile, never blindly regenerate an approved draft.");
        if(t.attempts>=3)throw new Error("Maximum attempts reached; create a reviewed replacement task.");t.status="queued";delete t.error;action(s,"owner","retry-requested",id);return t;
      }
      if(op==="reconcile"){
        if(t.status!=="failed" || !(t.approval||t.policyAuthorization))throw new Error("No approved failed publication to reconcile.");assertPublicationAuthorized(t,s);t.status="approved";action(s,"owner","reconciliation-requested",id,"Publisher will check durable approval hash before writing.");return t;
      }
      if(op==="clipper-receipt"){
        if(t.kind==="clip" && t.status==="handed_off" && t.approval?.hash===b.hash && t.publication?.receipt===b.receipt)return t;
        if(t.kind!=="clip"||t.status!=="approved")throw new Error("Clip is not owner-approved.");assertApproved(t,s);
        if(b.hash!==t.approval!.hash)throw new Error("Clip approval changed.");t.status="handed_off";t.publication={at:now(),receipt:z.string().max(300).parse(b.receipt)};action(s,"clipper-bridge","scheduled-by-existing-publisher",id);return t;
      }
      throw new Error("Unknown action.");
    });return json(result);
  }catch(e){return json({error:e instanceof Error?e.message:"Request failed"},400);}
}

function withdrawPolicy(s:State,t:Task){if(t.policyAuthorization){const r=s.automation?.reservations.find(r=>r.id===t.policyAuthorization!.reservationId);if(r&&!t.error)r.status="cancelled";delete t.policyAuthorization;}delete t.automationReview;}
