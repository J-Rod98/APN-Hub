import {recordingUrl} from "./public-references";
import { createHash, timingSafeEqual } from "node:crypto";
import type { Draft, Source, State, Task } from "./types";
export const SITE="https://www.apostolicpowernetwork.com";
export const digest=(v:unknown)=>createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");
export const now=()=>new Date().toISOString();
export function action(s:State,actor:string,event:string,target:string,detail="") {
  s.actions.push({at:now(),actor,action:event,target,detail});
}
export function authenticated(request:Request,secret=process.env.APN_OWNER_TOKEN) {
  if(!secret || secret.length<32)return false;
  const value=request.headers.get("authorization")?.replace(/^Bearer /,"") || "";
  const a=Buffer.from(digest(value));const b=Buffer.from(digest(secret));return timingSafeEqual(a,b);
}
export function permittedSource(s:Source) { return s.rights!=="unknown" && s.rightsEvidence.trim().length>=15; }
export function validateDraft(task:Task,d:Draft,sources:Source[],paths:string[],existing:{title:string;description:string;slug?:string}[]):string[] {
  const errors:string[]=[];const sourceMap=new Map(sources.map(s=>[s.id,s]));
  if(!sources.length || sources.some(s=>!permittedSource(s))) errors.push("Source rights or processing authorization is missing.");
  if(d.title.length<10 || d.title.length>90 || d.description.length<40 || d.description.length>180) errors.push("Check title and description lengths.");
  if(["resource","bible_study","event","sermon","podcast","music","news"].includes(task.kind) && !/^[-a-z0-9]+$/.test(d.slug)) errors.push("Use a plain lowercase URL slug.");
  for(const link of d.internalLinks) if(!paths.includes(link.path)) errors.push(`Unknown internal link: ${link.path}`);
  for(const q of d.quotes) if(!sourceMap.get(q.sourceId)?.text.includes(q.quote) || !q.quote.trim()) errors.push("A quotation could not be matched exactly to its source.");
  for(const c of d.claims) if(!sourceMap.get(c.sourceId)?.text.includes(c.evidence) || c.evidence.trim().length<12) errors.push("A factual claim lacks a source excerpt.");
  if(!d.claims.length) errors.push("The draft needs source-backed claims.");
  const visible=[d.title,d.description,d.intro,...d.sections.flatMap(s=>[s.heading,...s.paragraphs,...s.bullets]),...d.faqs.flatMap(f=>[f.question,f.answer])].join("\n");
  for(const match of visible.matchAll(/[“"]([^”"]{8,})[”"]/g)) if(!sources.some(s=>s.text.includes(match[1]))) errors.push("An inline quotation could not be matched to a source.");
  if(d.doctrineFlags.length) errors.push(...d.doctrineFlags.map(f=>`Doctrine review: ${f}`));
  if(d.uncertainties.length) errors.push(...d.uncertainties.map(f=>`Needs confirmation: ${f}`));
  if(task.kind==="metadata" && (d.sections.length || d.event)) errors.push("Metadata tasks may only change title and description.");
  if(!["metadata","clip","sermon","podcast","music"].includes(task.kind) && d.sections.length<2) errors.push("A guide needs at least two original sections.");
  if(sources.some(s=>s.rights==="link_only")&&!["sermon","podcast","music","news","event"].includes(task.kind))errors.push("Reference-only sources do not authorize reproduction, teaching adaptation or clips.");
  if(task.discovery){
    if(!sources.some(s=>s.url===task.discovery!.url))errors.push("Discovery attribution differs from its evidence source.");
    if(["sermon","podcast","music"].includes(task.kind)&&!recordingUrl(task.discovery.category,task.discovery.url))errors.push("A media listing must point to an individual original-provider recording, not a directory.");
    if(["sermon","podcast","music"].includes(task.kind)&&(d.quotes.length||d.sections.length||d.faqs.length))errors.push("Metadata-only listings cannot summarize unheard media, transcripts or lyrics.");
    if(task.kind==="news"){
      if(d.quotes.length)errors.push("News briefs must paraphrase and attribute; no copied quotations.");
      if(visible.split(/\s+/).filter(Boolean).length>180)errors.push("Keep the original news brief within 180 words including metadata.");
      const published=Date.parse(task.discovery.publishedAt||"");if(!Number.isFinite(published)||published>Date.now()+86400000||Date.now()-published>90*86400000)errors.push("News needs a verified publication date within the last 90 days.");
    }
  }
  const text=JSON.stringify(d).toLowerCase();
  if(/three (?:separate|distinct) (?:divine )?(?:persons|gods)|baptism is (?:merely|only) symbolic|jesus is (?:not god|a created being)/i.test(text)) errors.push("Doctrinal wording conflicts with APN's published Oneness convictions.");
  // Heuristics only: theological correctness and originality still require the
  // owner checklist. These checks must never claim to certify either one.
  if(task.kind==="bible_study" && !sources.some(s=>s.kind==="scripture")) errors.push("Bible studies require an authorized Scripture text, not model recall.");
  if(task.kind==="clip" && !sources.some(s=>s.kind==="clip_manifest" && s.clipKey && s.manifestHash)) errors.push("Clip handoff requires the exact existing media/manifest fingerprint.");
  if(task.kind==="event") {
    const e=d.event;const src=e && sourceMap.get(e.sourceId);
    if(!e || !src || src.kind!=="event" || !src.text.includes(e.evidence) || e.evidence.length<20) errors.push("An event requires current organizer evidence.");
    else {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(e.start) || !/^\d{4}-\d{2}-\d{2}$/.test(e.end) || !Number.isFinite(Date.parse(e.start)) || !Number.isFinite(Date.parse(e.end)) || e.end<e.start) errors.push("Event start and end must be verified ISO dates in order.");
      for(const field of [e.name,e.start,e.end,e.timezone,e.venue]) if(!field.trim() || !src.text.toLowerCase().includes(field.toLowerCase())) errors.push("Event name, dates, timezone and venue must all occur in the verified source text.");
      if(task.discovery&&Date.parse(e.end+"T23:59:59Z")+14*3600000<Date.now())errors.push("This discovered event has ended; verify a future or ongoing organizer listing.");
      if(e.organizerUrl!==src.url) errors.push("Event organizer URL differs from the source.");
      if(Date.now()-Date.parse(src.verifiedAt)>7*86400000) errors.push("Re-verify event information within seven days of publication.");
    }
  }
  const normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(Boolean);
  const words=new Set(normalize(d.title));
  for(const old of existing) {
    if(task.kind!=="metadata" && old.slug===d.slug) errors.push("That guide slug already exists.");
    const other=new Set(normalize(old.title));const union=new Set([...words,...other]);
    const shared=[...words].filter(w=>other.has(w)).length;
    if(task.kind!=="metadata" && shared/Math.max(1,union.size)>.8) errors.push(`Potential duplicate: ${old.title}`);
  }
  return [...new Set(errors)];
}
export const CHECKLIST=["facts","rights","doctrine","originality"];
export function approve(s:State,id:string,hash:string,checklist:string[],scheduledAt:string) {
  const t=s.tasks.find(x=>x.id===id);if(!t || t.status!=="review" || !t.draft || t.draftHash!==hash) throw new Error("Draft changed or is not ready for approval.");
  if(t.checks?.length)throw new Error("Resolve all blocking checks before approval.");
  if(CHECKLIST.some(k=>!checklist.includes(k)))throw new Error("Complete every owner review checkbox.");
  if(!Number.isFinite(Date.parse(scheduledAt)))throw new Error("Choose a valid publication time.");
  const copyrightRequired=s.sources.some(src=>t.sourceIds.includes(src.id) && src.copyrightFlag);
  if(copyrightRequired && !checklist.includes("copyright"))throw new Error("The clipper requires a separate copyright acknowledgement for this flagged media.");
  if(t.discovery&&!checklist.includes("source"))throw new Error("Confirm the discovered source, category and Apostolic relevance.");
  if(t.discovery?.embedMode==="embed"&&!checklist.includes("embed"))throw new Error("Verify original-player embedding and clearance for this media use.");
  const sourceHashes:Record<string,string>={};
  for(const id of t.sourceIds){const src=s.sources.find(x=>x.id===id);if(!src || !permittedSource(src))throw new Error("Source rights changed.");sourceHashes[id]=src.hash;}
  t.approval={hash,sourceHashes,actor:"owner",at:now(),scheduledAt,checklist:[...CHECKLIST,...(copyrightRequired?["copyright"]:[]),...(t.discovery?["source"]:[]),...(t.discovery?.embedMode==="embed"?["embed"]:[])],...(t.discovery?{discoveryHash:digest(t.discovery)}:{})};
  t.status="approved";t.updatedAt=now();action(s,"owner","approved",t.id,hash);
  return t;
}
export function assertApproved(t:Task,s:State) {
  if(!t.draft || !t.approval || t.approval.hash!==digest(t.draft) || t.approval.hash!==t.draftHash)throw new Error("Exact draft approval is required.");
  if(t.discovery&&t.approval.discoveryHash!==digest(t.discovery))throw new Error("Approved discovery attribution or embedding choice changed.");
  for(const id of t.sourceIds){const src=s.sources.find(x=>x.id===id);if(!src || src.hash!==t.approval.sourceHashes[id] || !permittedSource(src))throw new Error("Approved source changed.");}
}


// Metadata edits retain an existing URL. A slug is needed only when creating a
// new resource, study or event page; rechecking never grants owner approval.
export function recheckTask(s:State,id:string,paths:string[],existing:{title:string;description:string;slug?:string}[]) {
  const t=s.tasks.find(t=>t.id===id);
  if(!t || !t.draft || !["blocked","review"].includes(t.status) || t.approval)throw new Error("Only an unapproved draft can be rechecked.");
  t.checks=validateDraft(t,t.draft,s.sources.filter(src=>t.sourceIds.includes(src.id)),paths,existing);
  t.draftHash=digest(t.draft);t.status=t.checks.length?"blocked":"review";t.updatedAt=now();
  action(s,"APN Editor","draft-rechecked",t.id,t.checks.length?`${t.checks.length} blocking checks remain`:"Awaiting owner review; no publication approval granted.");
  return t;
}
