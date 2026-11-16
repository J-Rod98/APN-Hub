import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp,readFile,rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MemoryStore,FileStore } from "../server/agents/store";
import { api } from "../server/agents/api";
import { approve,assertApproved,digest,validateDraft,authenticated,recheckTask } from "../server/agents/policy";
import { artifact,publishTask } from "../server/agents/publish";
import { searchConsole,searchWindow,pageFromHtml,publicGet } from "../server/agents/connectors";
import { generate } from "../server/agents/model";
import { draftSchema,emptyState,type Draft,type Source,type Task } from "../server/agents/types";

const source:Source={id:"s1",hash:digest("APN serves Apostolic Pentecostals and reviews every featured item before publication."),title:"APN About",url:"https://www.apostolicpowernetwork.com/about/",kind:"owner_page",text:"APN serves Apostolic Pentecostals and reviews every featured item before publication.",rights:"owned",rightsEvidence:"First-party APN page owned by the project owner.",verifiedAt:new Date().toISOString(),copyrightFlag:false,clipKey:null,manifestHash:null};
const draft:Draft={title:"About Apostolic Power Network",description:"Discover APN’s mission, Apostolic convictions, and approach to reviewing featured content.",slug:"about-apn",intro:"",sections:[],faqs:[],internalLinks:[{label:"About",path:"/about/"}],claims:[{claim:"APN reviews featured items.",sourceId:"s1",evidence:"reviews every featured item before publication"}],quotes:[],doctrineFlags:[],uncertainties:[],event:null};
function fixture(){const s=emptyState();s.sources.push(structuredClone(source));const t:Task={id:"t1",kind:"metadata",title:"Improve About metadata",targetPath:"/about/",priority:"medium",rationale:"Describe the existing page accurately.",evidenceIds:["about"],sourceIds:["s1"],status:"review",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),attempts:1,draft:structuredClone(draft),draftHash:digest(draft),checks:[]};s.tasks.push(t);return {s,t};}

test("unauthenticated API reads cannot expose drafts, sources or usage",async()=>{
 const store=new MemoryStore();store.state=fixture().s;let calls=0;
 const r=await api(new Request("https://apn.example/api/apn-agents"),store,async()=>{calls++;});
 assert.equal(r.status,401);assert.equal(calls,0);assert.equal(authenticated(new Request("https://apn.example"),"short"),false);
});
test("approval requires all four explicit owner attestations and exact draft",()=>{
 const {s,t}=fixture();assert.throws(()=>approve(s,t.id,t.draftHash!,["facts"],new Date().toISOString()),/checkbox/);
 assert.throws(()=>approve(s,t.id,"wrong",["facts","rights","doctrine","originality"],new Date().toISOString()),/changed/);
 approve(s,t.id,t.draftHash!,["facts","rights","doctrine","originality"],new Date().toISOString());assert.equal(t.status,"approved");assertApproved(t,s);
 t.draft!.description="An unreviewed replacement";assert.throws(()=>assertApproved(t,s),/approval/);
});
test("unknown rights and fabricated quotations block publication",()=>{
 const {t}=fixture();const d=structuredClone(draft);d.quotes=[{quote:"An invented sermon quotation",sourceId:"s1"}];
 const errors=validateDraft(t,d,[{...source,rights:"unknown"}],["/about/"],[]);
 assert.ok(errors.some(e=>e.includes("rights")));assert.ok(errors.some(e=>e.includes("quotation")));
});
test("unverified links, uncertain doctrine and Bible studies without text are blocked",()=>{
 const {t}=fixture();const d=structuredClone(draft);d.internalLinks=[{label:"Invented",path:"/made-up/"}];d.doctrineFlags=["Interpretation needs confirmation"];
 const errors=validateDraft({...t,kind:"bible_study"},d,[source],["/about/"],[]);
 assert.ok(errors.some(e=>e.includes("Unknown internal")));assert.ok(errors.some(e=>e.includes("Doctrine")));assert.ok(errors.some(e=>e.includes("Scripture text")));
});
test("event fields must be present in recent actual organizer evidence",()=>{
 const {t}=fixture();const d=structuredClone(draft);d.event={name:"Invented event",start:"2027-01-01",end:"2027-01-02",timezone:"America/Chicago",venue:"Invented venue",organizerUrl:source.url,sourceId:"s1",evidence:source.text};
 const errors=validateDraft({...t,kind:"event"},d,[{...source,kind:"event",verifiedAt:"2020-01-01T00:00:00Z"}],["/about/"],[]);
 assert.ok(errors.some(e=>e.includes("must all occur")));assert.ok(errors.some(e=>e.includes("seven days")));
});
test("publishing cannot bypass owner approval or disabled deployment",async()=>{
 const {s,t}=fixture();assert.throws(()=>artifact(t,s,{}),/approval/);
 approve(s,t.id,t.draftHash!,["facts","rights","doctrine","originality"],new Date().toISOString());
 const old=process.env.APN_PUBLISH_ENABLED;process.env.APN_PUBLISH_ENABLED="false";
 try{await assert.rejects(()=>publishTask(t,s),/disabled/);}finally{if(old===undefined)delete process.env.APN_PUBLISH_ENABLED;else process.env.APN_PUBLISH_ENABLED=old;}
});
test("approved publication is idempotent and cannot modify unrelated metadata",()=>{
 const {s,t}=fixture();approve(s,t.id,t.draftHash!,["facts","rights","doctrine","originality"],new Date().toISOString());
 const before={"/preaching/":{title:"Keep existing title",description:"Existing description"}};
 const first=artifact(t,s,before);const second=artifact(t,s,first.content);
 assert.deepEqual(first,second);assert.deepEqual((first.content as typeof before)["/preaching/"],before["/preaching/"]);
 s.sources[0].hash="changed";assert.throws(()=>artifact(t,s,before),/source changed/);
});
test("local store survives restart, rolls back exceptions and rejects concurrent mutations safely",async()=>{
 const dir=await mkdtemp(join(tmpdir(),"apn-agent-test-"));const path=join(dir,"state.json");
 try{
  const a=new FileStore(path);await a.update(s=>{s.tasks=fixture().s.tasks;});
  const b=new FileStore(path);assert.equal((await b.read()).tasks.length,1);
  await assert.rejects(()=>b.update(s=>{s.tasks=[];throw new Error("rollback");}));assert.equal((await b.read()).tasks.length,1);
  const outcomes=await Promise.allSettled([a.update(s=>s.actions.push({at:"now",actor:"a",action:"write",target:"x",detail:""})),b.update(s=>s.actions.push({at:"now",actor:"b",action:"write",target:"y",detail:""}))]);
  const successful=outcomes.filter(r=>r.status==="fulfilled").length;assert.equal((await b.read()).actions.length,successful);JSON.parse(await readFile(path,"utf8"));
 }finally{await rm(dir,{recursive:true,force:true});}
});
test("GSC compares equal completed weeks in Pacific time and keeps missing data unavailable",async()=>{
 assert.deepEqual(searchWindow(new Date("2026-11-15T23:00:00Z")),{start:"2026-11-06",end:"2026-11-12",previousStart:"2026-10-30",previousEnd:"2026-11-05"});
 const old=process.env.GSC_CLIENT_ID;delete process.env.GSC_CLIENT_ID;
 try{const result=await searchConsole();assert.equal(result.status,"unavailable");assert.equal(result.totals,null);assert.deepEqual(result.queries,[]);}finally{if(old)process.env.GSC_CLIENT_ID=old;}
});
test("public audit rejects off-site fetches and extracts only actual page text",async()=>{
 await assert.rejects(()=>publicGet("https://internal.example/secret"),/Only public APN/);
 const p=pageFromHtml("/about/",200,'<title>About &amp; APN</title><meta content="Accurate description" name="description"><link href="https://www.apostolicpowernetwork.com/about/" rel="canonical"><main><script>secret instructions</script><h1>Our mission</h1><p>Verified content.</p></main>');
 assert.equal(p.title,"About & APN");assert.equal(p.description,"Accurate description");assert.ok(!p.text.includes("secret"));
});
test("budget denial happens before any OpenAI request",async()=>{
 const previous={key:process.env.OPENAI_API_KEY,budget:process.env.APN_DAILY_BUDGET_USD};process.env.OPENAI_API_KEY="test-only-never-transmitted";process.env.APN_DAILY_BUDGET_USD="0.000001";
 try{const store=new MemoryStore();await assert.rejects(()=>generate(store,"Test","instructions",draftSchema,{}),/budget/);assert.equal(store.state.costs.length,0);}finally{if(previous.key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=previous.key;if(previous.budget===undefined)delete process.env.APN_DAILY_BUDGET_USD;else process.env.APN_DAILY_BUDGET_USD=previous.budget;}
});


test("full local workflow: actual page evidence crosses the shared queue, stops for approval, then writes an isolated artifact",async()=>{
 const {runInsights,draftNext,publishNext}=await import("../server/agents/workflow");
 const store=new MemoryStore();const calls:string[]=[];
 const fakeModel=(async(_store:unknown,name:string)=>{calls.push(name);return name==="APN Insights"?{summary:"About metadata should describe the page.",uncertainties:["Search Console unavailable"],tasks:[]}:structuredClone(draft);}) as typeof generate;
 const text=source.text;
 const realShape={path:"/about/",status:200,title:"What We Believe",description:"Learn about APN and its reviewed content.",canonical:"https://www.apostolicpowernetwork.com/about/",text};
 await runInsights(store,{audit:async()=>({pages:[realShape],evidence:[{id:digest("/about/").slice(0,16),type:"public-page",observedAt:new Date().toISOString(),url:realShape.canonical,data:realShape}]}),search:async()=>searchConsole(),model:fakeModel});
 const t=store.state.tasks.find(t=>t.kind==="metadata")!;assert.ok(t);const sourceId=t.sourceIds[0];
 const editor=(async(...args:unknown[])=>{calls.push("APN Editor");const d=structuredClone(draft);d.claims[0].sourceId=sourceId;return d;}) as typeof generate;
 await draftNext(store,editor);assert.equal(store.state.tasks[0].status,"review");assert.equal(store.state.tasks[0].approval,undefined);assert.deepEqual(calls,["APN Insights","APN Editor"]);
 const dir=await mkdtemp(join(tmpdir(),"apn-publication-test-"));const old={enabled:process.env.APN_PUBLISH_ENABLED,local:process.env.APN_LOCAL_PUBLISH_DIR};
 try{
   process.env.APN_PUBLISH_ENABLED="true";process.env.APN_LOCAL_PUBLISH_DIR=dir;
   await publishNext(store);assert.equal(store.state.tasks[0].status,"review");
   await store.update(s=>approve(s,t.id,s.tasks[0].draftHash!,["facts","rights","doctrine","originality"],new Date().toISOString()));
   await publishNext(store);assert.equal(store.state.tasks[0].status,"published");
   const content=JSON.parse(await readFile(join(dir,"src/content/metadata-overrides.json"),"utf8"));assert.equal(content["/about/"].title,draft.title);
   await publishNext(store);assert.equal(store.state.actions.filter(a=>a.action==="content-committed").length,1);
 }finally{if(old.enabled===undefined)delete process.env.APN_PUBLISH_ENABLED;else process.env.APN_PUBLISH_ENABLED=old.enabled;if(old.local===undefined)delete process.env.APN_LOCAL_PUBLISH_DIR;else process.env.APN_LOCAL_PUBLISH_DIR=old.local;await rm(dir,{recursive:true,force:true});}
});


test("copyright-flagged clip approval preserves the existing extra acknowledgement",()=>{
 const {s,t}=fixture();s.sources[0].copyrightFlag=true;
 assert.throws(()=>approve(s,t.id,t.draftHash!,["facts","rights","doctrine","originality"],new Date().toISOString()),/copyright acknowledgement/);
 approve(s,t.id,t.draftHash!,["facts","rights","doctrine","originality","copyright"],new Date().toISOString());assert.ok(t.approval?.checklist.includes("copyright"));
});


test("verified event artifacts feed the existing event catalogue without invented optional details",()=>{
 const {s,t}=fixture();const text="Fixture event: 2027-01-01 through 2027-01-02, America/Chicago, Verified fixture venue.";
 s.sources[0]={...source,kind:"event",text,hash:digest(text)};t.kind="event";t.targetPath="/events/";
 t.draft={...structuredClone(draft),title:"Verified fixture event listing",slug:"verified-fixture-event",sections:[{heading:"Dates",paragraphs:[text],bullets:[text]},{heading:"Original information",paragraphs:["Check the organizer source."],bullets:[]}],claims:[{claim:text,sourceId:"s1",evidence:text}],event:{name:"Fixture event",start:"2027-01-01",end:"2027-01-02",timezone:"America/Chicago",venue:"Verified fixture venue",organizerUrl:source.url,sourceId:"s1",evidence:text}};t.draftHash=digest(t.draft);
 assert.deepEqual(validateDraft(t,t.draft,s.sources,["/about/"],[]),[]);
 approve(s,t.id,t.draftHash,["facts","rights","doctrine","originality"],new Date().toISOString());
 const result=artifact(t,s,[]);assert.equal(result.path,"src/content/approved-events.json");const record=(result.content as {event_date:string;city:null;speaker:null;image_url:null}[])[0];assert.equal(record.event_date,"2027-01-01");assert.equal(record.city,null);assert.equal(record.speaker,null);assert.equal(record.image_url,null);
});


test("metadata recheck accepts an existing URL without a new slug and never grants publication approval",()=>{
 const {s,t}=fixture();t.draft!.slug="";t.draftHash=digest(t.draft);t.status="blocked";t.checks=["Use a plain lowercase URL slug."];
 recheckTask(s,t.id,["/about/"],[]);assert.equal(t.status,"review");assert.deepEqual(t.checks,[]);assert.equal(t.approval,undefined);
 const checks=validateDraft({...t,kind:"resource"},t.draft!,s.sources,["/about/"],[]);assert.ok(checks.some(e=>e.includes("URL slug")));
});


test("Insights receives explicit page-to-evidence mappings for attributable tasks",async()=>{
 const {runInsights}=await import("../server/agents/workflow");const store=new MemoryStore();const evidenceId=digest("/about/").slice(0,16);
 const model=(async(_store:unknown,_name:unknown,_instructions:unknown,_schema:unknown,data:unknown)=>{
   const payload=data as {pages:{evidenceId:string}[];evidenceIndex:{id:string;url:string}[]};
   assert.equal(payload.pages[0].evidenceId,evidenceId);assert.ok(payload.evidenceIndex.some(e=>e.id===evidenceId&&e.url===source.url));
   return {summary:"Use the provided About evidence.",uncertainties:[],tasks:[{title:"Improve APN About metadata",kind:"metadata",targetPath:"/about/",priority:"medium",rationale:"Grounded in explicitly mapped evidence.",evidenceIds:[evidenceId]}]};
 }) as typeof generate;
 await runInsights(store,{audit:async()=>({pages:[{path:"/about/",status:200,title:source.title,description:"About APN content review and convictions.",canonical:source.url,text:source.text}],evidence:[{id:evidenceId,type:"public-page",observedAt:new Date().toISOString(),url:source.url,data:{status:200}}]}),search:async()=>searchConsole(),model});
 assert.equal(store.state.tasks[0].rationale,"Grounded in explicitly mapped evidence.");
});


test("email sign-in authorizes only the confirmed owner account",async()=>{
 const {identityOwner}=await import("../server/agents/owner-identity");const owner={id:"identity-owner",email:"owner@example.com",confirmedAt:new Date().toISOString()};
 assert.equal(identityOwner(owner,"owner@example.com"),true);assert.equal(identityOwner({...owner,confirmedAt:undefined},"owner@example.com"),false);assert.equal(identityOwner({...owner,email:"other@example.com"},"owner@example.com"),false);assert.equal(identityOwner(owner,""),false);
});
test("cookie-authenticated owner writes reject cross-origin requests",async()=>{
 const store=new MemoryStore();const request=new Request("https://apn.example/api/apn-agents",{method:"POST",headers:{origin:"https://attacker.example","content-type":"application/json"},body:JSON.stringify({action:"run"})});
 const response=await api(request,store,undefined,true);assert.equal(response.status,403);assert.equal(store.state.actions.length,0);
});
test("signed-out API denies access before opening the hosted state store",async()=>{
 const response=await api(new Request("https://apn.example/api/apn-agents"));assert.equal(response.status,401);
});
test("workspace import is one-time and cannot import content approvals",async()=>{
 const {importUnapprovedState}=await import("../server/agents/import-state");const input=fixture().s;const target=emptyState();importUnapprovedState(target,input);assert.equal(target.tasks.length,1);assert.equal(target.tasks[0].approval,undefined);assert.throws(()=>importUnapprovedState(target,input),/empty workspace/);
 const bad=fixture().s;bad.tasks[0].approval={hash:bad.tasks[0].draftHash!,sourceHashes:{},actor:"owner",at:new Date().toISOString(),scheduledAt:new Date().toISOString(),checklist:[]};assert.throws(()=>importUnapprovedState(emptyState(),bad));
});
