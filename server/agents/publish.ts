import { readFile,writeFile,mkdir,rename } from "node:fs/promises";
import { resolve,dirname } from "node:path";
import { events as curatedEvents } from "../../src/lib/catalog";
import type { Task,State } from "./types";
import { assertApproved,digest,now } from "./policy";

const contentPath=(t:Task)=>t.kind==="metadata"?"src/content/metadata-overrides.json":t.kind==="event"?"src/content/approved-events.json":"src/content/approved-guides.json";
const publicationUrl=(t:Task)=>t.kind==="metadata"?t.targetPath:t.kind==="event"?`/events/${t.draft!.slug}/`:`/guides/${t.draft!.slug}/`;

export function artifact(t:Task,s:State,current:unknown):{path:string;content:unknown} {
  assertApproved(t,s);const d=t.draft!;
  if(t.kind==="metadata")return {path:"src/content/metadata-overrides.json",content:{...(current as object),[t.targetPath]:{title:d.title,description:d.description,approvalHash:t.approval!.hash}}};
  if(!["resource","bible_study","event"].includes(t.kind))throw new Error("This task requires its dedicated technical or clipper handoff.");
  const list=Array.isArray(current)?current:[];
  if(t.kind==="event") {
    const e=d.event;if(!e)throw new Error("Verified event fields are required.");
    if(curatedEvents.some(old=>old.id===d.slug))throw new Error("This event slug is already in the curated catalogue.");
    const record={id:d.slug,title:d.title,description:d.description,event_date:e.start,end_date:e.end,event_time:null,venue:e.venue,city:null,state:null,church_name:null,speaker:null,category:null,image_url:null,image_alt:null,highlights:d.sections.flatMap(section=>section.bullets),source_url:e.organizerUrl,contact_email:null,status:"published",created_at:t.approval!.scheduledAt,approvalHash:t.approval!.hash};
    const old=list.find((event:{id:string;approvalHash?:string})=>event.id===d.slug);
    if(old && old.approvalHash!==record.approvalHash)throw new Error("Event slug collision; owner review required.");
    return {path:"src/content/approved-events.json",content:[...list.filter((event:{id:string})=>event.id!==d.slug),record]};
  }
  const guide={slug:d.slug,eyebrow:t.kind==="bible_study"?"Bible Study":"APN Resource",title:d.title,description:d.description,readingTime:`${Math.max(1,Math.ceil(JSON.stringify(d.sections).split(/\s+/).length/200))} min read`,publishedAt:t.approval!.scheduledAt,intro:d.intro,sections:d.sections,faqs:d.faqs,referencesHeading:"Sources reviewed by APN",references:[...t.sourceIds.map(id=>{const src=s.sources.find(x=>x.id===id)!;return {label:src.title,href:src.url};}),...d.internalLinks.map(l=>({label:l.label,href:l.path}))],approvalHash:t.approval!.hash};
  const old=list.find((g:{slug:string;approvalHash?:string})=>g.slug===d.slug);
  if(old && old.approvalHash!==guide.approvalHash)throw new Error("Guide slug collision; owner revision is required.");
  return {path:"src/content/approved-guides.json",content:[...list.filter((g:{slug:string})=>g.slug!==d.slug),guide]};
}
export async function publishTask(t:Task,s:State) {
  assertApproved(t,s);
  if(process.env.APN_PUBLISH_ENABLED!=="true")throw new Error("Publishing is disabled until the owner enables the reviewed deployment.");
  const path=contentPath(t);
  if(process.env.APN_LOCAL_PUBLISH_DIR){
    if(process.env.CONTEXT)throw new Error("Local artifact publishing is forbidden in hosted runtime.");
    const full=resolve(process.env.APN_LOCAL_PUBLISH_DIR,path);await mkdir(dirname(full),{recursive:true});
    let current:unknown=t.kind==="metadata"?{}:[];try{current=JSON.parse(await readFile(full,"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code!=="ENOENT")throw e;}
    const value=artifact(t,s,current);const temp=full+".tmp";await writeFile(temp,JSON.stringify(value.content,null,2)+"\n");await rename(temp,full);
    return {at:now(),commit:"local-reviewed-artifact",url:publicationUrl(t)};
  }
  const token=process.env.APN_GITHUB_TOKEN;const repository=process.env.APN_GITHUB_REPOSITORY;const branch=process.env.APN_PUBLISH_BRANCH;
  if(!token||!repository||!branch||!/^[-\w.]+\/[-\w.]+$/.test(repository))throw new Error("Configure the APN repository-scoped publishing credential and explicit branch.");
  const headers={authorization:`Bearer ${token}`,accept:"application/vnd.github+json","x-github-api-version":"2022-11-28","content-type":"application/json"};
  const endpoint=`https://api.github.com/repos/${repository}/contents/${path}`;
  const r=await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`,{headers,signal:AbortSignal.timeout(20000)});
  if(!r.ok && r.status!==404)throw new Error(`GitHub read HTTP ${r.status}`);
  const old=r.ok?await r.json() as {sha:string;content:string}:null;
  const current=old?JSON.parse(Buffer.from(old.content,"base64").toString("utf8")):(t.kind==="metadata"?{}:[]);
  const value=artifact(t,s,current);
  // Read-before-write makes a lost response safely reconcilable. The approval
  // hash is a durable publication marker; never duplicate the commit on retry.
  if(digest(current)===digest(value.content))return {at:now(),commit:"reconciled-existing-approved-content",url:publicationUrl(t)};
  const saved=await fetch(endpoint,{method:"PUT",headers,signal:AbortSignal.timeout(20000),body:JSON.stringify({branch,sha:old?.sha,message:`Publish owner-approved APN content (${t.id})`,content:Buffer.from(JSON.stringify(value.content,null,2)+"\n").toString("base64")})});
  if(!saved.ok)throw new Error(`GitHub publish HTTP ${saved.status}; reconcile before retrying.`);
  const body=await saved.json() as {commit:{sha:string}};
  return {at:now(),commit:body.commit.sha,url:publicationUrl(t)};
}
