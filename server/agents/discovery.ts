import { preaching,podcast,events } from "../../src/lib/catalog";
import approvedMedia from "../../src/content/approved-media.json";
import approvedNews from "../../src/content/approved-news.json";
import { generate,DOCTRINE,type SearchEvidence } from "./model";
import { action,digest,now } from "./policy";
import { defaultDiscovery,discoveryCategories,searchLeadsSchema,type DiscoveryCategory,type DiscoveryCandidate,type DiscoveryState } from "./discovery-types";
import { canonicalUrl,readReference,readFeed,type FeedLead,type Reference } from "./public-references";
import type { State,Task,Source,Draft } from "./types";
import type { StateStore } from "./store";
export function discoveryState(s:State):DiscoveryState{return s.discovery??=defaultDiscovery();}
export const chicagoDay=(at=new Date())=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Chicago"}).format(at);
const knownHost=(url:string)=>["upci.org","aljc.org","upcigc.net","kansasupci.org"].some(h=>new URL(url).hostname===h||new URL(url).hostname.endsWith("."+h));
const normalize=(url:string)=>{try{return canonicalUrl(url);}catch{return url;}};
function existingUrls(){return new Set([...preaching.map(x=>x.media_url),...podcast.map(x=>x.media_url),...events.map(x=>x.source_url),...(approvedMedia as {sourceUrl:string}[]).map(x=>x.sourceUrl),...(approvedNews as {references:{href:string}[]}[]).flatMap(x=>x.references.map(r=>r.href))].filter((v):v is string=>!!v).map(normalize));}
export function candidateFromReference(category:DiscoveryCategory,reference:Reference,searchUrls:string[],feed?:FeedLead):DiscoveryCandidate{
 const url=canonicalUrl(reference.url);const publishedAt=reference.publishedAt||feed?.publishedAt||null;
 const text=(reference.text+(feed?"\nVerified feed metadata:\n"+feed.metadata:"")).slice(0,7500);
 // Strip shared site chrome before relevance checks. A church footer on an
 // unrelated user-submitted conference does not establish Apostolic relevance.
 if(["news","event"].includes(category)&&!/(apostolic|pentecostal|oneness|\bupci\b|\baljc\b|holy ghost|bible quizz|north american youth congress)/i.test(reference.title+" "+reference.text.slice(0,4200)))throw new Error("Apostolic connection is not established by the original article; needs manual research.");
 const flags=["Owner must review Apostolic relevance, doctrine and source identity."];
 if(!knownHost(url))flags.push("Wider lead: this source is not on the initial organization list.");
 if(["sermon","podcast","music"].includes(category))flags.push("Metadata only: no transcript, lyrics or summary of unheard media is available.");
 if(!publishedAt)flags.push("Original publication date is unavailable.");
 if(category==="event")flags.push("Organizer dates, timezone and venue must be verified before approval.");
 return {id:digest(url).slice(0,24),category,url,title:reference.title,creator:reference.creator||feed?.creator||null,publishedAt,text,observedAt:now(),hash:digest({url,text,publishedAt}),flags,searchEvidence:searchUrls,status:"new"};
}
export function prepareCandidate(s:State,id:string,embedMode:"link"|"embed"="link"){
 const ds=discoveryState(s);const c=ds.candidates.find(c=>c.id===id);if(!c||c.status!=="new")throw new Error("Choose a new, verified discovery candidate.");
 if(c.hash!==digest({url:c.url,text:c.text,publishedAt:c.publishedAt}))throw new Error("Candidate evidence changed.");
 const src:Source={id:"discovery-source-"+c.id,hash:digest({url:c.url,text:c.text,rights:"link_only"}),title:c.title,url:c.url,kind:c.category==="event"?"event":["sermon","music"].includes(c.category)?"video_metadata":c.category==="podcast"?"podcast_metadata":"public_page",text:c.text,rights:"link_only",rightsEvidence:"Public reference evidence for an original factual brief, link or original-provider embed only. No transcript, media download, image reuse or clip reproduction rights are granted.",verifiedAt:c.observedAt,copyrightFlag:false,clipKey:null,manifestHash:null};
 const target=c.category==="sermon"?"/preaching/":c.category==="event"?"/events/":"/"+c.category+"/";
 const t:Task={id:"discovery-task-"+c.id,kind:c.category,title:"Prepare "+c.category+": "+c.title,targetPath:target,priority:"medium",rationale:"Original source found by APN discovery. Prepare a source-linked draft for owner review; no popularity or reproduction permission is inferred.",evidenceIds:c.searchEvidence,sourceIds:[src.id],createdAt:now(),updatedAt:now(),status:"queued",attempts:0,discovery:{candidateId:c.id,category:c.category,url:c.url,creator:c.creator,publishedAt:c.publishedAt,embedMode,evidenceHash:c.hash,flags:c.flags}};
 if(s.tasks.some(x=>x.id===t.id))throw new Error("This source already has a task.");s.sources.push(src);s.tasks.push(t);c.status="queued";c.taskId=t.id;action(s,"APN Editor","discovery-task-created",t.id,c.url);return t;
}
export function listingDraft(task:Task,source:Source):Draft{
 const c=task.discovery!;const label=c.category==="sermon"?"sermon":c.category==="podcast"?"podcast":"music video";
 const title=(source.title.length<10?source.title+" | "+label:source.title).slice(0,90);const description=("Explore the original "+label+(c.creator?" from "+c.creator:"")+". Follow the source link for the creator’s recording and complete details.").slice(0,180);
 return {title,description,slug:(title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,65)||"apn-media")+"-"+c.candidateId.slice(0,6),intro:"This listing points to the original creator’s recording. APN has not produced a transcript or reconstructed its teaching, lyrics or quotations from metadata.",sections:[],faqs:[],internalLinks:[],claims:[{claim:"Original provider title: "+source.title,sourceId:source.id,evidence:source.text.slice(0,Math.min(250,source.text.length))}],quotes:[],doctrineFlags:[],uncertainties:[],event:null};
}
const questions:Record<DiscoveryCategory,string>={sermon:"Apostolic Oneness Pentecostal sermons official church YouTube recent preaching",podcast:"Apostolic Oneness Pentecostal podcasts recent official episodes",music:"Apostolic Oneness Pentecostal music official YouTube UPCI Music worship videos",news:"Apostolic Oneness Pentecostal news official ministries recent announcements",event:"upcoming Apostolic Oneness Pentecostal conferences events official organizer dates"};
export async function runDiscovery(store:StateStore,category?:DiscoveryCategory,deps={model:generate,reference:readReference,feed:readFeed}){
 const day=chicagoDay();const chosen=category||discoveryCategories[Math.floor(Date.parse(day)/86400000)%discoveryCategories.length];const base=day+":"+chosen;
 const claimed=await store.update(s=>{const ds=discoveryState(s);if(!ds.settings.enabled||process.env.APN_DISCOVERY_ENABLED==="false")return null;const last=[...ds.runs].reverse().find(r=>r.id.startsWith(base));if(last&&!last.retry)return null;const run={id:base+(last?":retry-"+ds.runs.length:""),day,at:now(),category:chosen,status:"running" as const,found:0,queued:0,duplicates:0,errors:[] as string[],evidenceUrls:[] as string[]};if(last)delete last.retry;ds.runs.push(run);action(s,"APN Editor","discovery-started",run.id,chosen);return {run,settings:structuredClone(ds.settings)};});
 if(!claimed)return {status:"already-ran-or-paused"};
 const errors:string[]=[];let evidence:SearchEvidence={urls:[],calls:0};
 try{
  const feedLeads:FeedLead[]=[];
  for(const feed of claimed.settings.feeds.filter(f=>f.enabled).slice(0,12)){try{feedLeads.push(...await deps.feed(feed));}catch(e){errors.push(feed.label+": "+(e as Error).message);}}
  const search=await deps.model(store,"APN Editor / Discovery",DOCTRINE+" Search the live web for real original sources. Use at most two web-search calls. Return at most eight actual URLs found in the search results. Prefer official channels, artists, churches, ministries and organizers. Discover leads, never approve doctrine or rights. Reject unrelated user-submitted conferences even when hosted on an organization domain. For news seek sources published in the last 90 days; for events seek future dates. Do not invent metadata, transcripts, lyrics, quotations, events, popularity or search demand.",searchLeadsSchema,{date:day,category:chosen,query:questions[chosen],scope:claimed.settings.wideLeads?"Include wider Apostolic leads; explicitly unreviewed.":"Only sources already featured by APN or official UPCI/ALJC outlets.",existingUrls:[...existingUrls()].slice(0,35)}, {search:{allowedDomains:claimed.settings.wideLeads?undefined:["youtube.com","upci.org","aljc.org","upcigc.net","kansasupci.org"],capture:e=>{evidence=e;}}});
  const grounded=new Set(evidence.urls.map(normalize));
  const leads=[...search.leads.filter(l=>{const valid=grounded.has(normalize(l.url));if(!valid)errors.push("Ungrounded search URL discarded: "+l.url);return valid;}).map(l=>({url:l.url,category:l.category,feed:undefined as FeedLead|undefined})),...feedLeads.map(f=>({url:f.url,category:f.category,feed:f}))];
  const seen=existingUrls();const before=await store.read();for(const c of before.discovery?.candidates||[])seen.add(normalize(c.url));
  const unique=leads.filter(l=>{const url=normalize(l.url);if(seen.has(url))return false;seen.add(url);return true;}).slice(0,12);const candidates:DiscoveryCandidate[]=[];
  for(let i=0;i<unique.length;i+=3)await Promise.all(unique.slice(i,i+3).map(async lead=>{try{const ref=await deps.reference(lead.url);const candidate=candidateFromReference(lead.category,ref,evidence.urls.filter(u=>normalize(u)===normalize(lead.url)),lead.feed);if(existingUrls().has(normalize(candidate.url))||before.discovery?.candidates.some(c=>normalize(c.url)===normalize(candidate.url)))return;candidates.push(candidate);}catch(e){errors.push(lead.url+": "+(e as Error).message);}}));
  await store.update(s=>{const ds=discoveryState(s);const run=ds.runs.find(r=>r.id===claimed.run.id)!;run.evidenceUrls=evidence.urls;run.duplicates=leads.length-unique.length;run.errors=[...errors,...search.notes].slice(0,25);
   candidates.sort((a,b)=>unique.findIndex(l=>normalize(l.url)===normalize(a.url))-unique.findIndex(l=>normalize(l.url)===normalize(b.url)));
   for(const c of candidates){if(ds.candidates.some(old=>old.id===c.id)||ds.candidates.length>=250)continue;ds.candidates.push(c);run.found++;}
   const first=[...candidates].sort((a,b)=>Number(b.category===chosen)-Number(a.category===chosen)).slice(0,3);
   for(const c of first){if(ds.candidates.find(x=>x.id===c.id)?.status!=="new")continue;prepareCandidate(s,c.id,"link");run.queued++;}
   run.status="complete";action(s,"APN Editor","discovery-completed",run.id,"Verified "+run.found+" leads; queued "+run.queued+"; duplicates "+run.duplicates+".");
  });return {status:"complete"};
 }catch(e){await store.update(s=>{const run=discoveryState(s).runs.find(r=>r.id===claimed.run.id)!;run.status="failed";run.errors=[...errors,(e as Error).message].slice(0,25);action(s,"APN Editor","discovery-failed",run.id,"Owner retry required; paid search is not repeated automatically.");});throw e;}
}
