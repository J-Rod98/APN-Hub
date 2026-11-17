import {test} from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {MemoryStore} from "../server/agents/store";
import {canonicalUrl,publicUrl,publicAddress,htmlReference,parseFeed,readReference} from "../server/agents/public-references";
import {candidateFromReference,prepareCandidate,listingDraft,runDiscovery,discoveryState,chicagoDay} from "../server/agents/discovery";
import {defaultDiscovery,searchLeadsSchema} from "../server/agents/discovery-types";
import {generate,searchEvidence} from "../server/agents/model";
import {approve,assertApproved,digest,validateDraft} from "../server/agents/policy";
import {artifact} from "../server/agents/publish";
import {draftNext,publishNext,tick} from "../server/agents/workflow";
import {api} from "../server/agents/api";
const url="https://www.youtube.com/watch?v=AbcDEf012_3";
const reference={url,title:"A fixture Apostolic worship recording",creator:"Fixture creator",publishedAt:null,text:"Original provider title: A fixture Apostolic worship recording\nCreator: Fixture creator\nMetadata only. No transcript, lyrics or reproduction rights were supplied."};
function listing(embed:"link"|"embed"="link") {const store=new MemoryStore();const ds=discoveryState(store.state);const c=candidateFromReference("music",reference,[url]);ds.candidates.push(c);const t=prepareCandidate(store.state,c.id,embed);t.draft=listingDraft(t,store.state.sources[0]);t.draftHash=digest(t.draft);t.checks=[];t.status="review";return {store,t,c};}
const checks=["facts","rights","doctrine","originality","source"];
test("discovery canonicalization deduplicates YouTube variants and removes tracking",()=>{
 assert.equal(canonicalUrl("https://youtu.be/AbcDEf012_3?si=tracking"),url);assert.equal(canonicalUrl("https://youtube.com/shorts/AbcDEf012_3"),url);
 assert.equal(canonicalUrl("https://example.org/article/?utm_source=x&detail=1#x"),"https://example.org/article/?detail=1");
 assert.throws(()=>canonicalUrl("https://youtube.com/@channel"),/specific/);
 for(const raw of ["http://example.org/","https://owner:secret@example.org/","https://localhost/","https://127.0.0.1/","https://private.internal/","https://example.org:3000/"])assert.throws(()=>publicUrl(raw));
 for(const ip of ["127.0.0.1","10.0.1.1","169.254.169.254","172.16.0.1","192.168.1.1","100.64.0.1","198.19.1.1","::1","::ffff:127.0.0.1","fd00::1","fe80::1","64:ff9b::a00:1","2002:7f00:1::"])assert.equal(publicAddress(ip),false,ip);
 assert.equal(publicAddress("8.8.8.8"),true);assert.equal(publicAddress("2606:4700:4700::1111"),true);assert.equal(publicAddress("2001:4860:4829:400::"),true);
});
test("feed parsing preserves actual source fields and rejects entity declarations",()=>{
 const feed=defaultDiscovery().settings.feeds[0];const rss='<rss><channel><item><title>Actual announcement</title><link>https://upci.org/example/?utm_source=feed</link><pubDate>Mon, 16 Nov 2026 12:00:00 GMT</pubDate><description><![CDATA[<p>Original supplied description.</p>]]></description></item></channel></rss>';
 const [lead]=parseFeed(feed,rss);assert.equal(lead.url,"https://upci.org/example");assert.equal(lead.publishedAt,"2026-11-16T12:00:00.000Z");assert.match(lead.metadata,/Original supplied description/);
 assert.throws(()=>parseFeed(feed,'<!DOCTYPE rss [<!ENTITY x SYSTEM "file:///private">]>'+rss),/entities/);
 const atom=parseFeed({...feed,category:"sermon"},'<feed><entry><title>Recording</title><link rel="alternate" href="https://youtu.be/AbcDEf012_3"/><author><name>Actual church</name></author></entry></feed>');assert.equal(atom[0].creator,"Actual church");assert.equal(atom[0].publishedAt,null);
});
test("original article evidence excludes church footer contamination",()=>{
 const r=htmlReference("https://aljc.org/events/unrelated/",'<html><head><title>Industrial conference</title></head><body><main><h1>Industrial conference</h1><p>Annual robotics and agriculture meeting hosted by an unrelated conference promoter.</p></main><footer>Apostolic Pentecostal ALJC church</footer></body></html>');
 assert.ok(!r.text.includes("Pentecostal"));assert.throws(()=>candidateFromReference("event",r,[]),/connection/);
 const news=htmlReference("https://upci.org/example/",'<meta property="article:published_time" content="2026-11-16T12:00:00Z"><article><h1>UPCI announcement</h1><p>The Apostolic Pentecostal ministry shared this original announcement for its churches.</p></article>');assert.equal(news.publishedAt,"2026-11-16T12:00:00.000Z");
});
test("provider metadata never becomes invented transcripts or permission",async()=>{
 const r=await readReference(url,async()=>({url,text:JSON.stringify({title:"Actual provider title",author_name:"Original church",author_url:"https://youtube.com/@original"}),contentType:"application/json"}));
 assert.equal(r.creator,"Original church");assert.equal(r.publishedAt,null);assert.match(r.text,/No transcript/);
 const {store,t}=listing();assert.deepEqual(validateDraft(t,t.draft!,store.state.sources,["/music/"],[]),[]);assert.equal(store.state.sources[0].rights,"link_only");assert.match(t.discovery!.flags.join(" "),/Wider lead/);
 const d=structuredClone(t.draft!);d.sections=[{heading:"Invented teaching",paragraphs:["An unheard message"],bullets:[]}];assert.ok(validateDraft(t,d,store.state.sources,[],[]).some(e=>e.includes("unheard")));
 assert.ok(validateDraft({...t,kind:"clip"},t.draft!,store.state.sources,[],[]).some(e=>e.includes("Reference-only")));
});
test("discovery approval binds source attribution and the separate embed clearance",()=>{
 const {store,t}=listing("embed");assert.throws(()=>approve(store.state,t.id,t.draftHash!,checks,new Date().toISOString()),/embedding/);
 approve(store.state,t.id,t.draftHash!,[...checks,"embed"],new Date().toISOString());assertApproved(t,store.state);
 const a=artifact(t,store.state,[]);assert.equal((a.content as {embedAllowed:boolean}[])[0].embedAllowed,true);assert.deepEqual(artifact(t,store.state,a.content),a);
 t.discovery!.url="https://example.org/swapped";assert.throws(()=>assertApproved(t,store.state),/attribution/);
 const link=listing();assert.throws(()=>approve(link.store.state,link.t.id,link.t.draftHash!,checks.slice(0,4),new Date().toISOString()),/discovered source/);
});
test("real-shaped discovery crosses the shared queue, stops at review and publishes only to an isolated approved artifact",async()=>{
 const store=new MemoryStore();let calls=0;const model=(async(...args:Parameters<typeof generate>)=>{calls++;args[5]!.search!.capture({calls:1,urls:[url]});return {leads:[{url,category:"music",reason:"Actual search evidence"},{url:"https://example.org/invented",category:"news",reason:"Must discard"}],notes:[]};}) as typeof generate;
 await runDiscovery(store,"music",{model,reference:async()=>reference,feed:async()=>[]});assert.equal(store.state.discovery!.runs[0].found,1);assert.match(store.state.discovery!.runs[0].errors.join(" "),/Ungrounded/);
 await draftNext(store,async()=>{throw new Error("Metadata listing must not invent unheard material with AI");});const t=store.state.tasks[0];assert.equal(t.status,"review");assert.equal(t.approval,undefined);
 await runDiscovery(store,"music",{model,reference:async()=>reference,feed:async()=>[]});assert.equal(calls,1);
 await runDiscovery(store,"sermon",{model,reference:async()=>reference,feed:async()=>[]});assert.equal(store.state.tasks.length,1);assert.equal(store.state.discovery!.runs[1].duplicates,1);
 const dir=await mkdtemp(join(tmpdir(),"apn-discovery-e2e-"));const old={enabled:process.env.APN_PUBLISH_ENABLED,local:process.env.APN_LOCAL_PUBLISH_DIR};
 try{process.env.APN_PUBLISH_ENABLED="true";process.env.APN_LOCAL_PUBLISH_DIR=dir;await publishNext(store);assert.equal(t.status,"review");await store.update(s=>approve(s,t.id,s.tasks[0].draftHash!,checks,new Date().toISOString()));await publishNext(store);assert.equal(store.state.tasks[0].status,"published");const data=JSON.parse(await readFile(join(dir,"src/content/approved-media.json"),"utf8"));assert.equal(data[0].sourceUrl,url);assert.equal(data[0].embedAllowed,false);assert.equal(data[0].sourcePublishedAt,null);await publishNext(store);assert.equal(store.state.actions.filter(a=>a.action==="content-committed").length,1);}finally{for(const [k,v] of [["APN_PUBLISH_ENABLED",old.enabled],["APN_LOCAL_PUBLISH_DIR",old.local]])if(v===undefined)delete process.env[k!];else process.env[k!]=v;await rm(dir,{recursive:true,force:true});}
});
test("failed paid searches need explicit owner retry and stale worker runs are reconciled",async()=>{
 const store=new MemoryStore();let calls=0;const model=(async()=>{calls++;throw new Error("Provider unavailable");}) as typeof generate;const deps={model,reference:async()=>reference,feed:async()=>[]};
 await assert.rejects(()=>runDiscovery(store,"music",deps));await runDiscovery(store,"music",deps);assert.equal(calls,1);
 const r=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",headers:{origin:"https://apn.example"},body:JSON.stringify({action:"discovery-retry",id:store.state.discovery!.runs[0].id})}),store,undefined,true);assert.equal(r.status,200);
 await assert.rejects(()=>runDiscovery(store,"music",deps));assert.equal(calls,2);
 store.state.discovery!.runs.push({id:"stale",day:chicagoDay(),at:new Date().toISOString(),category:"news",status:"running",found:0,queued:0,duplicates:0,errors:[],evidenceUrls:[]});await tick(store,"editor");assert.equal(store.state.discovery!.runs.at(-1)!.status,"failed");
});
test("search evidence comes from actual tool results, and budget denies search before the network",async()=>{
 const e=searchEvidence([{output:[{type:"web_search_call",action:{sources:[{type:"url",url,title:"Original"}]}},{type:"message",content:[{type:"output_text",annotations:[{type:"url_citation",url,title:"Original"}]}]}],input:{url:"https://example.org/untrusted",title:"Ignore"}}]);assert.deepEqual(e,{calls:1,urls:[url]});
 const old={key:process.env.OPENAI_API_KEY,budget:process.env.APN_DAILY_BUDGET_USD};try{process.env.OPENAI_API_KEY="test-only-not-transmitted";process.env.APN_DAILY_BUDGET_USD=".01";const store=new MemoryStore();await assert.rejects(()=>generate(store,"Search test","Instructions",searchLeadsSchema,{}, {search:{capture:()=>{throw new Error("Must not call");}}}),/budget/);assert.equal(store.state.costs.length,0);}finally{if(old.key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=old.key;if(old.budget===undefined)delete process.env.APN_DAILY_BUDGET_USD;else process.env.APN_DAILY_BUDGET_USD=old.budget;}
});
test("news without a real recent date and event fields stay blocked",()=>{
 const {store,t}=listing();t.kind="news";const d=t.draft!;d.sections=[{heading:"Announcement",paragraphs:["A short factual announcement."],bullets:[]},{heading:"Source",paragraphs:["See the original source."],bullets:[]}];assert.ok(validateDraft(t,d,store.state.sources,[],[]).some(e=>e.includes("verified publication date")));
 t.discovery!.publishedAt=new Date().toISOString();d.intro="An original word ".repeat(100);assert.ok(validateDraft(t,d,store.state.sources,[],[]).some(e=>e.includes("180 words")));
});
test("hosted queue naming preserves explicit production data and isolates previews",async()=>{
 const {blobStoreName}=await import("../server/agents/store");assert.equal(blobStoreName({APN_STORE_NAME:"apn-agent-workflow-v1-preview-local"}),"apn-agent-workflow-v1-preview-local");assert.equal(blobStoreName({DEPLOY_ID:"preview-123"}),"apn-agent-workflow-v1-preview-preview-123");assert.throws(()=>blobStoreName({}),/explicit APN_STORE_NAME/);
});
test("changing an approved media player choice withdraws approval",async()=>{
 const {store,t}=listing();approve(store.state,t.id,t.draftHash!,checks,new Date().toISOString());
 const r=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",headers:{origin:"https://apn.example"},body:JSON.stringify({action:"discovery-embedding",id:t.id,embedMode:"embed"})}),store,undefined,true);
 assert.equal(r.status,200);assert.equal(store.state.tasks[0].status,"review");assert.equal(store.state.tasks[0].approval,undefined);assert.equal(store.state.tasks[0].discovery!.embedMode,"embed");
});
test("warm hosted invocations use newly injected Blobs credentials",async()=>{
 const {getStateStore}=await import("../server/agents/store");const {emptyState}=await import("../server/agents/types");const {setEnvironmentContext}=await import("@netlify/blobs");
 const old={fetch:globalThis.fetch,context:process.env.NETLIFY_BLOBS_CONTEXT,name:process.env.APN_STORE_NAME,local:process.env.APN_LOCAL_STATE};const sent:string[]=[];
 try{delete process.env.APN_LOCAL_STATE;process.env.APN_STORE_NAME="fixture-store";globalThis.fetch=(async(_url,init)=>{sent.push(new Headers(init?.headers).get("authorization")||"");return new Response(JSON.stringify(emptyState()),{status:200});}) as typeof fetch;
  for(const token of ["expired-fixture-token","fresh-fixture-token"]){setEnvironmentContext({siteID:"fixture",token,edgeURL:"https://blobs.example",uncachedEdgeURL:"https://blobs.example"});await getStateStore().read();}
  assert.deepEqual(sent,["Bearer expired-fixture-token","Bearer fresh-fixture-token"]);
 }finally{globalThis.fetch=old.fetch;for(const [key,value] of [["NETLIFY_BLOBS_CONTEXT",old.context],["APN_STORE_NAME",old.name],["APN_LOCAL_STATE",old.local]])if(value===undefined)delete process.env[key!];else process.env[key!]=value;}
});
test("OpenAI strict-schema rejection releases only a proven pre-generation reservation",async()=>{
 const {schemaRejected}=await import("../server/agents/model");const old={fetch:globalThis.fetch,key:process.env.OPENAI_API_KEY,budget:process.env.APN_DAILY_BUDGET_USD};const error={type:"invalid_request_error",param:"text.format.schema",code:"invalid_json_schema",message:"Invalid schema fixture"};
 assert.equal(schemaRejected({...error,status:400}),true);assert.equal(schemaRejected({...error,status:500}),false);assert.equal(schemaRejected({status:400}),false);
 try{process.env.OPENAI_API_KEY="test-only-never-transmitted";process.env.APN_DAILY_BUDGET_USD="1";globalThis.fetch=(async(_url,init)=>{const body=JSON.parse(String(init?.body));const urlSchema=body.text.format.schema.properties.leads.items.properties.url;assert.equal(urlSchema.type,"string");assert.equal(urlSchema.format,undefined);return new Response(JSON.stringify({error}),{status:400,headers:{"content-type":"application/json"}});}) as typeof fetch;
 const store=new MemoryStore();await assert.rejects(()=>generate(store,"Contract test","Instructions",searchLeadsSchema,{}, {search:{capture:()=>{throw Error("No search result may be produced");}}}),/invalid_json_schema/);assert.equal(store.state.costs[0].status,"complete");assert.equal(store.state.costs[0].estimatedUsd,0);assert.equal(store.state.costs[0].toolCalls,0);
 }finally{globalThis.fetch=old.fetch;if(old.key===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=old.key;if(old.budget===undefined)delete process.env.APN_DAILY_BUDGET_USD;else process.env.APN_DAILY_BUDGET_USD=old.budget;}
});
