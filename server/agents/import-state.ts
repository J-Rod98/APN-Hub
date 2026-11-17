import { z } from "zod";
import { sourceSchema,taskProposalSchema,draftSchema,type State } from "./types";
import { digest,action } from "./policy";
const at=z.string().datetime();
const importedSchema=z.object({
 version:z.literal(1),
 sources:z.array(sourceSchema.extend({id:z.string(),hash:z.string()})),
 tasks:z.array(taskProposalSchema.extend({id:z.string(),status:z.enum(["queued","review","blocked","failed","rejected"]),sourceIds:z.array(z.string()),createdAt:at,updatedAt:at,attempts:z.number().int().min(0).max(3),draft:draftSchema.optional(),draftHash:z.string().optional(),checks:z.array(z.string()).optional(),error:z.string().optional(),nextAttemptAt:at.optional()}).strict()),
 reports:z.array(z.object({id:z.string(),at,start:z.string().date(),end:z.string().date(),summary:z.string(),uncertainties:z.array(z.string()),taskIds:z.array(z.string()),failure:z.string().optional(),evidence:z.array(z.object({id:z.string(),type:z.string(),observedAt:at,url:z.string(),data:z.unknown()}))}).strict()),
 costs:z.array(z.object({id:z.string(),agent:z.string(),at,model:z.string(),status:z.enum(["reserved","complete","uncertain"]),reservedUsd:z.number().nonnegative(),inputTokens:z.number().nonnegative().optional(),outputTokens:z.number().nonnegative().optional(),estimatedUsd:z.number().nonnegative().optional(),toolCalls:z.number().int().nonnegative().optional(),toolUsd:z.number().nonnegative().optional()}).strict()),
 actions:z.array(z.object({at,actor:z.string(),action:z.string(),target:z.string(),detail:z.string()})),
 jobs:z.record(z.string(),z.unknown()).refine(v=>Object.keys(v).length===0,"Import cannot include active worker leases.")
}).strict();
export function importUnapprovedState(target:State,input:unknown){
 if(target.tasks.length||target.sources.length||target.reports.length||target.costs.length)throw new Error("Initial import only works on an empty workspace.");
 const parsed=importedSchema.parse(input);
 for(const t of parsed.tasks){
  if(t.sourceIds.some(id=>!parsed.sources.some(s=>s.id===id)))throw new Error("Imported task references an unknown source.");
  if(t.draft && t.draftHash!==digest(t.draft))throw new Error("Imported draft version does not match its content.");
 }
 Object.assign(target,parsed,{jobs:{}});action(target,"owner","initial-state-imported","workspace","Imported unapproved drafts, dated observations and usage history; no content approval was granted.");
 return {tasks:target.tasks.length,reports:target.reports.length,sources:target.sources.length};
}
