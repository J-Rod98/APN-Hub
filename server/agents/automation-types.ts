import { z } from "zod";
export const sourceRuleInput = z.object({label:z.string().min(3).max(120),provider:z.enum(["youtube","spotify","feed"]),url:z.string().url(),category:z.enum(["sermon","podcast","music","news","event"]),includeTerms:z.array(z.string().min(2).max(60)).max(12).default([]),embed:z.boolean().default(false)}).strict();
export type RuleInput=z.infer<typeof sourceRuleInput>;
export type SourceIdentity={provider:"youtube"|"spotify"|"feed";id:string};
export interface SourceRule extends RuleInput {id:string;identity:SourceIdentity;feedUrl:string;verifiedAt:string;verificationHash:string;enabled:boolean;grant:{actor:"owner";at:string;hash:string};lastCheckedAt?:string;lastError?:string}
export interface PolicyAuthorization {mode:"source_policy";ruleId:string;ruleHash:string;hash:string;sourceHashes:Record<string,string>;discoveryHash:string;at:string;scheduledAt:string;day:string;reservationId:string}
export interface AutomationState {enabled:boolean;dailyLimit:number;rules:SourceRule[];runs:{day:string;at:string;found:number;errors:string[]}[];reservations:{id:string;taskId:string;day:string;at:string;status:"reserved"|"published"|"cancelled"}[];digests:{week:string;at:string;publishedIds:string[];exceptionIds:string[];estimatedUsd:number;notes:string[]}[]}
export const emptyAutomation=():AutomationState=>({enabled:false,dailyLimit:2,rules:[],runs:[],reservations:[],digests:[]});
