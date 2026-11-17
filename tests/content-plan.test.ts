import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTENT_PLAN_SLOTS, CONTENT_PLAN_TARGETS } from "../src/lib/editorial-plan";
import { planTask, saveReviewDraft, fillNextResearchGap } from "../server/agents/content-plan";
import { emptyState, type Draft, type Task } from "../server/agents/types";
import { digest } from "../server/agents/policy";
import { api } from "../server/agents/api";
import { MemoryStore } from "../server/agents/store";
import { eventsForPeriod, eventPeriod, calendarDay } from "../src/lib/event-dates";
import { events } from "../src/lib/catalog";

test("calendar rollover, inclusive end day, unknown dates and archive order", () => {
 const base = events[0];const a = {...base,id:"a",event_date:"2026-12-28",end_date:"2026-12-30",timezone:"America/New_York"};
 assert.equal(eventPeriod(a,new Date("2026-12-31T04:59:59Z")),"Upcoming");
 assert.equal(eventPeriod(a,new Date("2026-12-31T05:00:00Z")),"Past");
 assert.equal(calendarDay(new Date("2026-12-31T05:00:00Z"),"-06:00"),"2026-12-30");
 for(const day of [null,"2026-02-30","2026-13-01","unknown"])assert.equal(eventPeriod({...a,event_date:day},new Date()),"Unknown");
 assert.equal(eventPeriod({...a,event_date:"2027-01-01"},new Date()),"Unknown");
 const past={...a,id:"p",event_date:"2026-01-01",end_date:"2026-01-02"};const unknown={...a,id:"u",event_date:null};const at=new Date("2026-12-31T12:00:00Z");
 assert.deepEqual(eventsForPeriod([past,unknown,a],"Past",at).map(e=>e.id),["a","p"]);
 assert.equal(eventsForPeriod([unknown],"Upcoming",at).length,0);assert.equal(eventsForPeriod([unknown],"All dates",at).length,1);
 assert.equal(eventsForPeriod(events,"Upcoming",new Date("2026-11-17T18:00:00Z")).length,2);
});
test("32 category-balanced slots are retry-safe and never queued as fabricated content", () => {
 assert.equal(CONTENT_PLAN_SLOTS.length,32);for(const t of CONTENT_PLAN_TARGETS)assert.equal(CONTENT_PLAN_SLOTS.filter(s=>s.kind===t.kind).length,t.additions);
 const s=emptyState();const input={slot:"week-1-1",title:"Verify an actual upcoming gathering",researchNote:"The organizer has not supplied a venue or a verified timezone."};
 const t=planTask(s,input);assert.equal(t.status,"blocked");assert.equal(t.draft,undefined);assert.equal(planTask(s,input).id,t.id);assert.equal(s.tasks.length,1);
 assert.throws(()=>planTask(s,{...input,approval:{hash:"invented"}}));
 const second=planTask(s,{...input,slot:"week-1-2"});t.sourceIds=["registered-source"];assert.throws(()=>planTask(s,{slot:"week-1-1",existingId:second.id}),/already/);
 assert.throws(()=>planTask(s,{slot:"week-1-3",existingId:t.id}),/category/);
});
test("researched drafts pass existing validation and cannot import approval or overwrite approved work", async () => {
 const s=emptyState();const t=planTask(s,{slot:"week-1-6",title:"Practical prayer resource for review",researchNote:"Prepare original practical advice with verified Scripture evidence."});
 const src={id:"src",hash:digest("fixture"),title:"Authorized fixture text",url:"https://example.org/fixture",text:"Verified source evidence from this fixture authorizes the sample claim.",kind:"scripture" as const,rights:"public_domain" as const,rightsEvidence:"Public domain test fixture only.",verifiedAt:new Date().toISOString(),copyrightFlag:false,clipKey:null,manifestHash:null};s.sources.push(src);
 const draft:Draft={title:"A practical prayer resource",description:"An original practical prayer resource prepared against the authorized test fixture.",slug:"practical-prayer",intro:"",sections:[{heading:"First",paragraphs:["A practical recommendation."],bullets:[]},{heading:"Next",paragraphs:["Review with your local pastor."],bullets:[]}],faqs:[],claims:[{claim:"Sample claim",sourceId:src.id,evidence:src.text}],quotes:[],internalLinks:[],doctrineFlags:[],uncertainties:[],event:null};
 const input={id:t.id,sourceIds:[src.id],draft};saveReviewDraft(s,input,[],[]);assert.equal(t.status,"review");assert.equal(t.approval,undefined);assert.equal(t.draftHash,digest(t.draft));assert.equal(s.costs.length,0);
 assert.throws(()=>saveReviewDraft(s,{...input,approval:{hash:"fabricated"}},[],[]));
 saveReviewDraft(s,{...input,draft:{...draft,uncertainties:["Needs source confirmation."]}},[],[]);assert.equal(t.status,"blocked");
 t.status="approved";assert.throws(()=>saveReviewDraft(s,input,[],[]),/unapproved/);
 const store=new MemoryStore();store.state=s;const r=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",body:JSON.stringify({action:"review-draft",item:input})}),store);assert.equal(r.status,401);
});

test("Spotify show evidence does not mislabel the latest episode as a show", async () => {
 const {readReference}=await import("../server/agents/public-references");
 const url="https://open.spotify.com/show/fixture123";const calls:string[]=[];
 const ref=await readReference(url,async request=>{calls.push(request);return {url:request,contentType:"text/html",text:'<meta property="og:title" content="Actual fixture show">'};});
 assert.equal(ref.title,"Actual fixture show");assert.deepEqual(calls,[url]);assert.match(ref.text,/not an individual episode/);
 await assert.rejects(()=>readReference(url,async()=>({url,contentType:"text/html",text:"Unavailable"})),/show title/);
});

test("a verified task can fill a research-only slot without losing history or replacing reviewed drafts", () => {
 const s=emptyState();const gap=planTask(s,{slot:"week-2-3",title:"Find a dated original Apostolic report",researchNote:"The current leads have no verified recent publication date."});
 const unsourced={...gap,id:"unsourced-task",editorialPlan:undefined};s.tasks.push(unsourced);assert.throws(()=>planTask(s,{slot:"week-2-3",existingId:unsourced.id}),/Attach verified/);assert.equal(gap.status,"blocked");
 const sourced:Task={...gap,id:"discovery-task-fixture",sourceIds:["verified-source"],editorialPlan:undefined,status:"review" as const};s.tasks.push(sourced);
 planTask(s,{slot:"week-2-3",existingId:sourced.id});assert.equal(gap.status,"rejected");assert.equal(gap.editorialPlan,undefined);assert.equal(sourced.editorialPlan?.slot,"week-2-3");assert.equal(sourced.status,"review");assert.equal(sourced.approval,undefined);assert.equal(s.actions.filter(a=>a.action==="research-gap-filled").length,1);
 const other={...sourced,id:"another-verified-task",editorialPlan:undefined};s.tasks.push(other);assert.throws(()=>planTask(s,{slot:"week-2-3",existingId:other.id}),/already has/);assert.equal(sourced.editorialPlan?.slot,"week-2-3");
});

test("scheduled discovery fills the next news gap only with dated current evidence and no approval", () => {
 const s=emptyState();const gap=planTask(s,{slot:"week-2-3",title:"Find a current Apostolic ministry report",researchNote:"A recent verified original news report is still needed."});
 const task:Task={...gap,id:"discovery-task-news",editorialPlan:undefined,sourceIds:["original-source"],status:"queued",discovery:{candidateId:"fixture",category:"news",url:"https://upci.org/fixture",creator:null,publishedAt:"2025-01-01T00:00:00Z",embedMode:"link",evidenceHash:"fixture",flags:[]}};s.tasks.push(task);
 assert.equal(fillNextResearchGap(s,task),null);assert.equal(gap.status,"blocked");task.discovery!.publishedAt=new Date().toISOString();fillNextResearchGap(s,task);assert.equal(task.editorialPlan?.slot,"week-2-3");assert.equal(gap.status,"rejected");assert.equal(task.status,"queued");assert.equal(task.approval,undefined);assert.ok(s.actions.some(a=>a.action==="research-gap-filled"&&a.actor==="APN Editor"));
});
