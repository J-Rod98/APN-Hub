import {test} from "node:test";
import assert from "node:assert/strict";
import {mkdtemp,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {emptyState,type State,type Task} from "../server/agents/types";
import {MemoryStore} from "../server/agents/store";
import {digest,approve} from "../server/agents/policy";
import {automationState,saveRule,authorizeAutomatic,assertPublicationAuthorized,revokePolicy,policyDay} from "../server/agents/automation-policy";
import {storeTrustedLead,verifyAutomaticNews,updateManagementDigest,runTrustedSources} from "../server/agents/automation-workflow";
import {verifyRule,youtubeEntries,spotifyEntity,type TrustedLead} from "../server/agents/trusted-sources";
import {artifact,publishBatch} from "../server/agents/publish";
import {publishNext} from "../server/agents/workflow";
import {api} from "../server/agents/api";
import type {generate} from "../server/agents/model";
const channel="UCaaaaaaaaaaaaaaaaaaaaaa";
function fixture(count=3){
 const s=emptyState();const rule=saveRule(s,{id:"rule-fixture",label:"Official fixture worship",provider:"youtube",url:"https://www.youtube.com/channel/"+channel,feedUrl:"https://www.youtube.com/feeds/videos.xml?channel_id="+channel,identity:{provider:"youtube",id:channel},category:"music",includeTerms:["worship"],embed:true,verifiedAt:new Date().toISOString(),verificationHash:digest("fixture feed")});automationState(s).enabled=true;
 for(let i=0;i<count;i++){const url="https://www.youtube.com/watch?v=fixture000"+i;const lead:TrustedLead={identity:rule.identity,verifiedAt:new Date().toISOString(),embedAvailable:true,reference:{url,title:"Fixture worship recording "+i,creator:"Official fixture church",publishedAt:null,text:"Original provider metadata for Fixture worship recording "+i+". This is source-linked fixture metadata only, not a transcript or lyrics."}};storeTrustedLead(s,rule,lead);}
 return {s,rule};
}
const paths=["/music/","/news/","/about/"];
test("standing rules authorize two exact drafts, never invent owner attestations and bind all source versions",()=>{
 const {s}=fixture();assert.equal(authorizeAutomatic(s,paths,[]).length,2);assert.equal(authorizeAutomatic(s,paths,[]).length,0);assert.equal(s.tasks[2].status,"review");assert.match(s.tasks[2].automaticIssues![0],/allowance/);
 for(const t of s.tasks.slice(0,2)){assert.equal(t.approval,undefined);assertPublicationAuthorized(t,s);assert.equal((artifact(t,s,[]).content as {authorizationMode:string}[])[0].authorizationMode,"source_policy");}
 const t=s.tasks[0];const copy=structuredClone(t);t.draft!.description="A changed and unapproved description with no authorization.";assert.throws(()=>assertPublicationAuthorized(t,s));s.tasks[0]=copy;s.sources.find(src=>copy.sourceIds.includes(src.id))!.hash="changed";assert.throws(()=>assertPublicationAuthorized(copy,s));
});
test("spoofed identities, topic mismatches, uncertain doctrine and unverified embeds stay in exceptions",()=>{
 const {s}=fixture(4);s.tasks[0].discovery!.identity!.id="UCspoof";s.tasks[1].draft!.title="Unrelated college fundraiser";s.tasks[2].draft!.doctrineFlags=["Interpretation is uncertain"];s.tasks[3].discovery!.embedAvailable=false;
 assert.equal(authorizeAutomatic(s,paths,[]).length,0);assert.ok(s.tasks.every(t=>t.status==="review"&&t.automaticIssues!.length));
});
test("pause is immediate even with a worker lease, revokes pending grants and preserves manual decisions",async()=>{
 const {s,rule}=fixture(2);authorizeAutomatic(s,paths,[]);const t=s.tasks[0];const store=new MemoryStore();store.state=s;store.state.jobs.worker={token:"busy",until:new Date(Date.now()+60000).toISOString()};
 const r=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",headers:{origin:"https://apn.example"},body:JSON.stringify({action:"source-pause",id:rule.id})}),store,undefined,true);assert.equal(r.status,200);assert.equal(store.state.tasks[0].status,"review");assert.equal(store.state.tasks[0].policyAuthorization,undefined);assert.equal(store.state.automation!.reservations[0].status,"cancelled");assert.throws(()=>assertPublicationAuthorized(t,store.state));
 const unauth=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",body:JSON.stringify({action:"automation-settings",settings:{enabled:true,dailyLimit:2}})}),store);assert.equal(unauth.status,401);
});
test("the approved source limit cannot be expanded above two through the owner API",async()=>{
 const {s}=fixture(0);const store=new MemoryStore();store.state=s;
 const r=await api(new Request("https://apn.example/api/apn-agents",{method:"POST",headers:{origin:"https://apn.example"},body:JSON.stringify({action:"automation-settings",settings:{enabled:true,dailyLimit:3}})}),store,undefined,true);assert.equal(r.status,400);assert.equal(store.state.automation!.dailyLimit,2);
});
test("provider identity parsers reject unrelated channels and show/episode substitutions",async()=>{
 const xml=`<feed><yt:channelId>${channel.slice(2)}</yt:channelId><title>Fixture church</title><author><uri>https://www.youtube.com/channel/${channel}</uri></author><entry><yt:channelId>${channel}</yt:channelId><yt:videoId>fixture0000</yt:videoId><title>Fixture worship</title><published>2026-11-17T00:00:00Z</published></entry></feed>`;
 assert.equal(youtubeEntries(xml,channel).entries.length,1);assert.throws(()=>youtubeEntries(xml,"UCbbbbbbbbbbbbbbbbbbbbbb"));assert.throws(()=>youtubeEntries('<!ENTITY bad>'+xml,channel));
 const show="6JDPvDbLUUVx9Mh0F7rh4l",episode="6cRQhOqGmbGknytMAjS7kf";const data={props:{pageProps:{state:{data:{embeded_entity_uri:"spotify:show:"+show,entity:{id:episode,uri:"spotify:episode:"+episode,type:"episode",relatedEntityUri:"spotify:show:"+show,title:"Fixture episode",subtitle:"Fixture show",releaseDate:{isoString:"2026-11-17T00:00:00Z"},isPlayable:true}}}}}};
 const html='<script id="__NEXT_DATA__">'+JSON.stringify(data)+'</script>';assert.equal(spotifyEntity(html,show).id,episode);assert.throws(()=>spotifyEntity(html,"anotherShow"));
 await assert.rejects(()=>verifyRule({label:"Untrusted fixture",provider:"youtube",url:"https://attacker.example/channel/"+channel,category:"music",includeTerms:[],embed:true}),/official/);
});
test("news needs an independent source-supported verification; sensitive or failed reviews cannot self-authorize",async()=>{
 const {s,rule}=fixture(0);rule.provider="feed";rule.identity={provider:"feed",id:"https://upci.org/feed/"};rule.url=rule.feedUrl="https://upci.org/feed/";rule.category="news";rule.includeTerms=[];rule.embed=false;saveRule(s,rule);
 const id=storeTrustedLead(s,s.automation!.rules[0],{identity:rule.identity,verifiedAt:new Date().toISOString(),embedAvailable:false,reference:{url:"https://upci.org/fixture-news",title:"Fixture UPCI ministry announcement",creator:"UPCI",publishedAt:new Date().toISOString(),text:"The UPCI ministry announced an original resource for Apostolic congregations. This is test evidence only, not actual news."}})!;const t=s.tasks.find(t=>t.id===id)!;
 t.draft={title:"Fixture UPCI ministry announcement",description:"An original fixture news brief based on the actual supplied publisher evidence.",slug:"fixture-upci-news",intro:"",sections:[{heading:"Announcement",paragraphs:["The UPCI ministry announced a resource."],bullets:[]},{heading:"Source",paragraphs:["Consult the original ministry announcement."],bullets:[]}],faqs:[],claims:[{claim:"A resource was announced.",sourceId:t.sourceIds[0],evidence:"The UPCI ministry announced an original resource"}],quotes:[],internalLinks:[],doctrineFlags:[],uncertainties:[],event:null};t.draftHash=digest(t.draft);t.status="review";
 assert.equal(authorizeAutomatic(s,paths,[]).length,0);const store=new MemoryStore();store.state=s;let calls=0;
 await verifyAutomaticNews(store,(async()=>{calls++;return {supported:false,sensitive:false,doctrineUncertain:false,issues:["Unsupported fixture statement"]};}) as typeof generate);assert.equal(calls,1);assert.equal(authorizeAutomatic(store.state,paths,[]).length,0);
 delete store.state.tasks[0].automationReview;await verifyAutomaticNews(store,(async()=>({supported:true,sensitive:false,doctrineUncertain:false,issues:[]})) as typeof generate);assert.equal(authorizeAutomatic(store.state,paths,[]).length,1);assert.equal(store.state.tasks[0].approval,undefined);
});
test("batch publishing writes multiple files in one Git commit and one non-forced ref update; replay reconciles",async()=>{
 const {s}=fixture(2);authorizeAutomatic(s,paths,[]);const manual:Task={id:"manual",kind:"metadata",title:"APN metadata fixture",targetPath:"/about/",priority:"medium",rationale:"Fixture",evidenceIds:[],sourceIds:["owned"],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),status:"review",attempts:0,draft:{...structuredClone(s.tasks[0].draft!),sections:[],claims:[{claim:"APN fixture",sourceId:"owned",evidence:"APN fixture owned page source text"}]},checks:[]};manual.draftHash=digest(manual.draft);s.sources.push({id:"owned",hash:"fixture-owned",title:"Owned APN page",url:"https://www.apostolicpowernetwork.com/about/",kind:"owner_page",text:"APN fixture owned page source text",rights:"owned",rightsEvidence:"First-party fixture source.",verifiedAt:new Date().toISOString(),copyrightFlag:false,clipKey:null,manifestHash:null});s.tasks.push(manual);approve(s,manual.id,manual.draftHash,["facts","rights","doctrine","originality"],new Date().toISOString());
 const old={...process.env},originalFetch=globalThis.fetch;const calls:{path:string;method:string;body:any}[]=[];let files:Record<string,unknown>={};let tree:Record<string,unknown>={};
 try{process.env.APN_PUBLISH_ENABLED="true";delete process.env.APN_LOCAL_PUBLISH_DIR;process.env.APN_GITHUB_TOKEN="fixture-only-not-transmitted";process.env.APN_GITHUB_REPOSITORY="fixture/APN";process.env.APN_PUBLISH_BRANCH="main";
 globalThis.fetch=(async(input,init)=>{const path=new URL(String(input)).pathname.replace('/repos/fixture/APN','');const method=init?.method||"GET",body=init?.body?JSON.parse(String(init.body)):undefined;calls.push({path,method,body});let data:unknown={};if(path==='/git/ref/heads/main')data={object:{sha:"base"}};else if(path==='/git/commits/base')data={tree:{sha:"base-tree"}};else if(path.startsWith('/contents/')){const value=files[path.slice('/contents/'.length)];if(!value)return new Response('{}',{status:404});data={content:Buffer.from(JSON.stringify(value)).toString('base64')};}else if(path==='/git/trees'){assert.equal(body.base_tree,'base-tree');assert.equal(body.tree.length,2);tree=Object.fromEntries(body.tree.map((e:any)=>[e.path,JSON.parse(e.content)]));data={sha:'next-tree'};}else if(path==='/git/commits'){assert.deepEqual(body.parents,['base']);data={sha:'next-commit'};}else if(path==='/git/refs/heads/main'){assert.equal(body.force,false);files=tree;}else throw Error('Unexpected endpoint '+path);return new Response(JSON.stringify(data),{status:200});}) as typeof fetch;
 const receipts=await publishBatch(s.tasks,s);assert.equal(new Set(Object.values(receipts).map(r=>r.commit)).size,1);assert.equal(calls.filter(c=>c.method==='PATCH').length,1);assert.equal(calls.filter(c=>c.path==='/git/commits'&&c.method==='POST').length,1);const length=calls.length;await publishBatch(s.tasks,s);assert.ok(calls.slice(length).every(c=>c.method==='GET'));
 }finally{globalThis.fetch=originalFetch;for(const k of ["APN_PUBLISH_ENABLED","APN_LOCAL_PUBLISH_DIR","APN_GITHUB_TOKEN","APN_GITHUB_REPOSITORY","APN_PUBLISH_BRANCH"])if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k];}
});
test("paused policy is rechecked before the final external write and quota survives failed attempts",async()=>{
 const {s}=fixture(2);authorizeAutomatic(s,paths,[]);const dir=await mkdtemp(join(tmpdir(),"apn-policy-pause-"));const old={enabled:process.env.APN_PUBLISH_ENABLED,local:process.env.APN_LOCAL_PUBLISH_DIR};
 try{process.env.APN_PUBLISH_ENABLED="true";process.env.APN_LOCAL_PUBLISH_DIR=dir;const paused=structuredClone(s);revokePolicy(paused);await assert.rejects(()=>publishBatch(s.tasks,s,async()=>paused),/authorization/);await assert.rejects(()=>readFile(join(dir,"src/content/approved-media.json")));assert.equal(s.automation!.reservations.filter(r=>r.day===policyDay()).length,2);
 }finally{if(old.enabled===undefined)delete process.env.APN_PUBLISH_ENABLED;else process.env.APN_PUBLISH_ENABLED=old.enabled;if(old.local===undefined)delete process.env.APN_LOCAL_PUBLISH_DIR;else process.env.APN_LOCAL_PUBLISH_DIR=old.local;await rm(dir,{recursive:true,force:true});}
});
test("source intake, automatic authorization and existing publisher complete without model calls or manual approval",async()=>{
 const {s}=fixture(2);const store=new MemoryStore();store.state=s;const dir=await mkdtemp(join(tmpdir(),"apn-automatic-e2e-"));const old={enabled:process.env.APN_PUBLISH_ENABLED,local:process.env.APN_LOCAL_PUBLISH_DIR};try{process.env.APN_PUBLISH_ENABLED="true";process.env.APN_LOCAL_PUBLISH_DIR=dir;await publishNext(store);assert.equal(store.state.tasks.filter(t=>t.status==="published").length,2);assert.ok(store.state.tasks.every(t=>!t.approval));assert.equal(store.state.costs.length,0);await publishNext(store);assert.equal(store.state.automation!.reservations.length,2);updateManagementDigest(store.state);assert.equal(store.state.automation!.digests[0].publishedIds.length,2);}finally{if(old.enabled===undefined)delete process.env.APN_PUBLISH_ENABLED;else process.env.APN_PUBLISH_ENABLED=old.enabled;if(old.local===undefined)delete process.env.APN_LOCAL_PUBLISH_DIR;else process.env.APN_LOCAL_PUBLISH_DIR=old.local;await rm(dir,{recursive:true,force:true});}
});

test("daily quota uses Chicago midnight and concurrent reservations cannot exceed the shared cap",async()=>{
 assert.equal(policyDay(new Date("2026-11-18T05:59:59Z")),"2026-11-17");assert.equal(policyDay(new Date("2026-11-18T06:00:00Z")),"2026-11-18");
 const {s}=fixture(4);const store=new MemoryStore();store.state=s;await Promise.all([store.update(s=>authorizeAutomatic(s,paths,[])),store.update(s=>authorizeAutomatic(s,paths,[]))]);assert.equal(store.state.automation!.reservations.length,2);assert.equal(store.state.tasks.filter(t=>t.policyAuthorization).length,2);
});
test("changing a standing rule withdraws pending grants instead of silently expanding approval",()=>{
 const {s,rule}=fixture(2);authorizeAutomatic(s,paths,[]);saveRule(s,{...rule,includeTerms:["different topic"]});assert.ok(s.tasks.every(t=>t.status==="review"&&!t.policyAuthorization));assert.ok(s.automation!.reservations.every(r=>r.status==="cancelled"));assert.equal(authorizeAutomatic(s,paths,[]).length,0);
});
