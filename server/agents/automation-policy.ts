import { action,assertApproved,digest,now,validateDraft } from "./policy";
import { emptyAutomation,type SourceRule } from "./automation-types";
import type { State,Task } from "./types";
export const automationState=(s:State)=>s.automation??=emptyAutomation();
export const policyDay=(at=new Date())=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Chicago"}).format(at);
export const grantHash=(r:Omit<SourceRule,"grant"|"enabled">|SourceRule)=>digest({id:r.id,label:r.label,provider:r.provider,url:r.url,category:r.category,includeTerms:r.includeTerms,embed:r.embed,identity:r.identity,feedUrl:r.feedUrl});
export function saveRule(s:State,rule:Omit<SourceRule,"grant"|"enabled">) {
 const a=automationState(s);const other=a.rules.find(r=>r.id!==rule.id&&r.identity.provider===rule.identity.provider&&r.identity.id===rule.identity.id&&r.category===rule.category);if(other)throw Error("This exact source already has a rule.");
 const data:SourceRule={...rule,enabled:true,grant:{actor:"owner",at:now(),hash:grantHash(rule)}};const old=a.rules.findIndex(r=>r.id===rule.id);if(old>=0&&a.rules[old].grant.hash!==data.grant.hash)revokePolicy(s,rule.id);if(old>=0)a.rules[old]=data;else a.rules.push(data);
 action(s,"owner","standing-source-approved",data.id,`${data.label}: ${data.category}; ${data.embed?"permitted original player":"source links"}. Grant ${data.grant.hash}`);return data;
}
export function revokePolicy(s:State,ruleId?:string) {
 const a=automationState(s);if(ruleId){const r=a.rules.find(r=>r.id===ruleId);if(!r)throw Error("Source rule not found.");r.enabled=false;}else a.enabled=false;
 for(const t of s.tasks.filter(t=>t.policyAuthorization&&(!ruleId||t.policyAuthorization.ruleId===ruleId)&&t.status==="approved")){
  const reservation=a.reservations.find(r=>r.id===t.policyAuthorization!.reservationId);if(reservation)reservation.status="cancelled";delete t.policyAuthorization;t.status="review";t.automaticIssues=[ruleId?"Source is paused.":"Automatic publishing is paused."];
 }
 action(s,"owner",ruleId?"source-paused":"automatic-publishing-paused",ruleId||"automation");
}
export const sensitiveNews=/(?:\b(?:allegation|lawsuit|abuse|assault|arrest|criminal|scandal|suicide|endorsement|election campaign|investment advice|medical advice|accused|misconduct)\b)/i;
export function automaticIssues(t:Task,s:State,paths:string[],existing:{title:string;description:string;slug?:string}[]) {
 const a=automationState(s);const c=t.discovery;const r=a.rules.find(r=>r.enabled&&r.category===t.kind&&c?.identity?.provider===r.identity.provider&&c.identity.id===r.identity.id);
 const issues:string[]=[];if(!a.enabled)issues.push("Automatic publishing is paused.");if(!r){issues.push("No standing rule for this verified source and content category.");return {rule:r,issues};}
 if(r.grant.hash!==grantHash(r))issues.push("Source rule changed; renew standing approval.");
 if(!t.draft||!c){issues.push("A sourced draft is required.");return {rule:r,issues};}
 if(Date.now()-Date.parse(c.identityVerifiedAt||"")>86400000||!Number.isFinite(Date.parse(c.identityVerifiedAt||"")))issues.push("Re-verify the original source identity within 24 hours.");
 if(!["sermon","podcast","music","news","event"].includes(t.kind))issues.push("Original teaching and clips need individual owner review.");
 issues.push(...validateDraft(t,t.draft,s.sources.filter(src=>t.sourceIds.includes(src.id)),paths,existing));
 if(r.includeTerms.length&&!r.includeTerms.some(term=>t.draft!.title.toLowerCase().includes(term.toLowerCase())))issues.push("Title is outside this source’s approved topic filter.");
 if(t.sourceIds.length!==1||s.sources.some(src=>t.sourceIds.includes(src.id)&&(src.copyrightFlag||src.rights!=="link_only")))issues.push("This source policy permits attributed reference listings and briefs only.");
 if(c.embedMode==="embed"&&(!r.embed||!c.embedAvailable))issues.push("Original-provider embedding is not verified under this rule.");
 if(t.kind==="news"||t.kind==="event"){
  if(sensitiveNews.test(JSON.stringify(t.draft)))issues.push("Sensitive news requires individual owner review.");
  const review=t.automationReview;if(!review||review.hash!==digest(t.draft)||t.sourceIds.some(id=>review.sourceHashes[id]!==s.sources.find(src=>src.id===id)?.hash))issues.push("A separate news verification pass is required.");else issues.push(...review.issues);
 }
 if(t.kind==="event")issues.push("Approve a specific organizer event rule before automatic event publication.");
 return {rule:r,issues:[...new Set(issues)]};
}
export function authorizeAutomatic(s:State,paths:string[],existing:{title:string;description:string;slug?:string}[]) {
 const a=automationState(s);if(!a.enabled)return [];
 const today=policyDay();const used=a.reservations.filter(r=>r.day===today&&r.status!=="cancelled").length;let remaining=Math.max(0,Math.min(2,a.dailyLimit)-used);const authorized:string[]=[];
 const eligible:{t:Task;rule:SourceRule}[]=[];
 for(const t of s.tasks.filter(t=>t.status==="review"&&!t.approval&&!t.policyAuthorization)) {
  const {rule,issues}=automaticIssues(t,s,paths,existing);t.automaticIssues=issues;if(!issues.length&&rule)eligible.push({t,rule});
 }
 const sourceToday=(id:string)=>a.reservations.filter(r=>r.day===today&&r.status!=="cancelled"&&s.tasks.find(t=>t.id===r.taskId)?.policyAuthorization?.ruleId===id).length;
 while(remaining&&eligible.length){
  eligible.sort((x,y)=>Number(y.t.kind==="news")-Number(x.t.kind==="news")||sourceToday(x.rule.id)-sourceToday(y.rule.id)||x.t.createdAt.localeCompare(y.t.createdAt));
  const {t,rule}=eligible.shift()!;
  const hashes=Object.fromEntries(t.sourceIds.map(id=>[id,s.sources.find(src=>src.id===id)!.hash]));const reservationId=digest([t.id,t.draftHash,today,rule.grant.hash]);
  a.reservations.push({id:reservationId,taskId:t.id,day:today,at:now(),status:"reserved"});
  t.policyAuthorization={mode:"source_policy",ruleId:rule.id,ruleHash:rule.grant.hash,hash:digest(t.draft),sourceHashes:hashes,discoveryHash:digest(t.discovery),at:now(),scheduledAt:now(),day:today,reservationId};t.draftHash=t.policyAuthorization.hash;t.status="approved";t.updatedAt=now();t.automaticIssues=[];remaining--;authorized.push(t.id);
  action(s,"source-policy engine","automatic-publication-authorized",t.id,`Standing owner grant ${rule.grant.hash}; daily reservation ${reservationId}. No individual owner checklist was supplied.`);
 }
 for(const {t} of eligible)t.automaticIssues=["Waiting for the next daily automatic publishing allowance."];
 return authorized;

}
export function assertPublicationAuthorized(t:Task,s:State) {
 if(t.approval){assertApproved(t,s);return;}
 const p=t.policyAuthorization;const a=s.automation;const r=a?.rules.find(r=>r.id===p?.ruleId);const reservation=a?.reservations.find(r=>r.id===p?.reservationId);
 if(!p||!a?.enabled||!r?.enabled||r.grant.hash!==p.ruleHash||grantHash(r)!==p.ruleHash||!t.draft||digest(t.draft)!==p.hash||t.draftHash!==p.hash||digest(t.discovery)!==p.discoveryHash||t.sourceIds.some(id=>s.sources.find(src=>src.id===id)?.hash!==p.sourceHashes[id])||Object.keys(p.sourceHashes).length!==t.sourceIds.length||!reservation||reservation.taskId!==t.id||reservation.day!==p.day||reservation.status==="cancelled")throw Error("Exact owner approval or an active, unchanged source-policy authorization is required.");
}
export function authorizationRecord(t:Task) {if(t.approval)return {hash:t.approval.hash,at:t.approval.scheduledAt,embed:t.approval.checklist.includes("embed")};if(t.policyAuthorization)return {hash:t.policyAuthorization.hash,at:t.policyAuthorization.scheduledAt,embed:!!t.discovery?.embedAvailable};throw Error("Publication authorization missing.");}
