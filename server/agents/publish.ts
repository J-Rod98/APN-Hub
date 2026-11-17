import { readFile,writeFile,mkdir,rename } from "node:fs/promises";
import { resolve,dirname } from "node:path";
import { events as curatedEvents } from "../../src/lib/catalog";
import type { Task,State } from "./types";
import { digest,now } from "./policy";

import { assertPublicationAuthorized,authorizationRecord } from "./automation-policy";

export const contentPath=(t:Task)=>t.kind==="news"?"src/content/approved-news.json":["sermon","podcast","music"].includes(t.kind)?"src/content/approved-media.json":t.kind==="metadata"?"src/content/metadata-overrides.json":t.kind==="event"?"src/content/approved-events.json":"src/content/approved-guides.json";
export const publicationUrl=(t:Task)=>t.kind==="news"?`/news/${t.draft!.slug}/`:t.kind==="sermon"?`/preaching/${t.draft!.slug}/`:t.kind==="podcast"?`/podcast/${t.draft!.slug}/`:t.kind==="music"?`/music/${t.draft!.slug}/`:t.kind==="metadata"?t.targetPath:t.kind==="event"?`/events/${t.draft!.slug}/`:`/guides/${t.draft!.slug}/`;

export function artifact(t:Task,s:State,current:unknown):{path:string;content:unknown} {
  assertPublicationAuthorized(t,s);const d=t.draft!;const auth=authorizationRecord(t);
  if(t.kind==="metadata")return {path:"src/content/metadata-overrides.json",content:{...(current as object),[t.targetPath]:{title:d.title,description:d.description,approvalHash:auth.hash,...(t.policyAuthorization?{authorizationMode:"source_policy",sourcePolicyId:t.policyAuthorization.ruleId,sourcePolicyHash:t.policyAuthorization.ruleHash}:{})}}};
  if(["news","sermon","podcast","music"].includes(t.kind)){
    if(!t.discovery)throw new Error("Discovery provenance is required for this content.");
    const list=Array.isArray(current)?current:[];
    if(t.kind==="news"){
      const record={slug:d.slug,title:d.title,description:d.description,intro:d.intro,sections:d.sections,internalLinks:d.internalLinks,references:t.sourceIds.map(id=>{const src=s.sources.find(x=>x.id===id)!;return {label:src.title,href:src.url};}),sourcePublishedAt:t.discovery.publishedAt,publishedAt:auth.at,approvalHash:auth.hash,...(t.policyAuthorization?{authorizationMode:"source_policy",sourcePolicyId:t.policyAuthorization.ruleId,sourcePolicyHash:t.policyAuthorization.ruleHash}:{})};
      const old=list.find((x:{slug:string;approvalHash?:string})=>x.slug===d.slug);if(old&&old.approvalHash!==record.approvalHash)throw new Error("News slug collision; owner revision required.");
      return {path:contentPath(t),content:[...list.filter((x:{slug:string})=>x.slug!==d.slug),record]};
    }
    const record={id:d.slug,kind:t.kind,title:d.title,description:d.description,sourceUrl:t.discovery.url,creator:t.discovery.creator,sourcePublishedAt:t.discovery.publishedAt,embedAllowed:t.discovery.embedMode==="embed"&&auth.embed,publishedAt:auth.at,approvalHash:auth.hash,...(t.policyAuthorization?{authorizationMode:"source_policy",sourcePolicyId:t.policyAuthorization.ruleId,sourcePolicyHash:t.policyAuthorization.ruleHash}:{})};
    const old=list.find((x:{id:string;sourceUrl:string;approvalHash?:string})=>x.id===d.slug||x.sourceUrl===record.sourceUrl);if(old&&(old.id!==d.slug||old.approvalHash!==record.approvalHash))throw new Error("Media source or slug already exists; owner revision required.");
    return {path:contentPath(t),content:[...list.filter((x:{id:string})=>x.id!==d.slug),record]};
  }
  if(!["resource","bible_study","event"].includes(t.kind))throw new Error("This task requires its dedicated technical or clipper handoff.");
  const list=Array.isArray(current)?current:[];
  if(t.kind==="event") {
    const e=d.event;if(!e)throw new Error("Verified event fields are required.");
    if(curatedEvents.some(old=>old.id===d.slug))throw new Error("This event slug is already in the curated catalogue.");
    const record={id:d.slug,title:d.title,description:d.description,event_date:e.start,end_date:e.end,event_time:null,timezone:e.timezone||null,venue:e.venue,city:null,state:null,church_name:null,speaker:null,category:null,image_url:null,image_alt:null,highlights:d.sections.flatMap(section=>section.bullets),source_url:e.organizerUrl,contact_email:null,status:"published",created_at:auth.at,approvalHash:auth.hash,...(t.policyAuthorization?{authorizationMode:"source_policy",sourcePolicyId:t.policyAuthorization.ruleId,sourcePolicyHash:t.policyAuthorization.ruleHash}:{})};
    const old=list.find((event:{id:string;approvalHash?:string})=>event.id===d.slug);
    if(old && old.approvalHash!==record.approvalHash)throw new Error("Event slug collision; owner review required.");
    return {path:"src/content/approved-events.json",content:[...list.filter((event:{id:string})=>event.id!==d.slug),record]};
  }
  const guide={slug:d.slug,eyebrow:t.kind==="bible_study"?"Bible Study":"APN Resource",title:d.title,description:d.description,readingTime:`${Math.max(1,Math.ceil(JSON.stringify(d.sections).split(/\s+/).length/200))} min read`,publishedAt:auth.at,intro:d.intro,sections:d.sections,faqs:d.faqs,referencesHeading:"Sources reviewed by APN",references:[...t.sourceIds.map(id=>{const src=s.sources.find(x=>x.id===id)!;return {label:src.title,href:src.url};}),...d.internalLinks.map(l=>({label:l.label,href:l.path}))],approvalHash:auth.hash,...(t.policyAuthorization?{authorizationMode:"source_policy",sourcePolicyId:t.policyAuthorization.ruleId,sourcePolicyHash:t.policyAuthorization.ruleHash}:{})};
  const old=list.find((g:{slug:string;approvalHash?:string})=>g.slug===d.slug);
  if(old && old.approvalHash!==guide.approvalHash)throw new Error("Guide slug collision; owner revision is required.");
  return {path:"src/content/approved-guides.json",content:[...list.filter((g:{slug:string})=>g.slug!==d.slug),guide]};
}
export async function publishTask(t:Task,s:State) { return (await publishBatch([t],s))[t.id]; }
export async function publishBatch(tasks:Task[],state:State,latest:()=>Promise<State>=async()=>state) {
  if(process.env.APN_PUBLISH_ENABLED!=="true")throw new Error("Publishing is disabled until the owner enables the reviewed deployment.");
  for(const t of tasks)assertPublicationAuthorized(t,state);
  const paths=[...new Set(tasks.map(contentPath))];const files=new Map<string,unknown>();
  const empty=(path:string)=>path.endsWith("metadata-overrides.json")?{}:[];
  const fold=()=>{for(const t of tasks){const value=artifact(t,state,files.get(contentPath(t)));files.set(value.path,value.content);}};
  const receipt=(commit:string)=>Object.fromEntries(tasks.map(t=>[t.id,{at:now(),commit,url:publicationUrl(t)}]));
  if(process.env.APN_LOCAL_PUBLISH_DIR){
    if(process.env.CONTEXT)throw new Error("Local artifact publishing is forbidden in hosted runtime.");
    for(const path of paths){let current=empty(path);try{current=JSON.parse(await readFile(resolve(process.env.APN_LOCAL_PUBLISH_DIR,path),"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;}files.set(path,current);}
    fold();const fresh=await latest();for(const t of tasks)assertPublicationAuthorized(t,fresh);
    for(const [path,value] of files){const full=resolve(process.env.APN_LOCAL_PUBLISH_DIR,path);await mkdir(dirname(full),{recursive:true});await writeFile(full+".tmp",JSON.stringify(value,null,2)+"\n");await rename(full+".tmp",full);}
    return receipt("local-reviewed-artifact");
  }
  const token=process.env.APN_GITHUB_TOKEN,repository=process.env.APN_GITHUB_REPOSITORY,branch=process.env.APN_PUBLISH_BRANCH;
  if(!token||!repository||!branch||!/^[-\w.]+\/[-\w.]+$/.test(repository))throw Error("Configure the APN repository-scoped publishing credential and explicit branch.");
  const endpoint=`https://api.github.com/repos/${repository}`;
  const headers={authorization:`Bearer ${token}`,accept:"application/vnd.github+json","x-github-api-version":"2022-11-28","content-type":"application/json"};
  const request=async(path:string,method="GET",body?:unknown,missing=false)=>{const r=await fetch(endpoint+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});if(missing&&r.status===404)return null;if(!r.ok)throw Error(`GitHub ${method} HTTP ${r.status}; reconcile before retrying.`);return r.json();};
  const ref=await request("/git/ref/heads/"+branch);const base=ref.object.sha;const commit=await request("/git/commits/"+base);
  const originals=new Map<string,string>();
  for(const path of paths){const record=await request(`/contents/${path}?ref=${encodeURIComponent(base)}`,"GET",undefined,true);const value=record?JSON.parse(Buffer.from(record.content,"base64").toString("utf8")):empty(path);files.set(path,value);originals.set(path,digest(value));}
  fold();const changed=[...files].filter(([path,value])=>digest(value)!==originals.get(path));
  if(!changed.length)return receipt("reconciled-existing-approved-content");
  // A single Git tree/ref update atomically publishes all content files.
  const tree=await request("/git/trees","POST",{base_tree:commit.tree.sha,tree:changed.map(([path,value])=>({path,mode:"100644",type:"blob",content:JSON.stringify(value,null,2)+"\n"}))});
  const next=await request("/git/commits","POST",{message:`Publish APN batch (${tasks.length} authorized items)`,tree:tree.sha,parents:[base]});
  const fresh=await latest();for(const task of tasks)assertPublicationAuthorized(task,fresh);
  await request("/git/refs/heads/"+branch,"PATCH",{sha:next.sha,force:false});
  return receipt(next.sha);
}
