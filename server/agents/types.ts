import { z } from "zod";
import type { DiscoveryState,DiscoveryProvenance } from "./discovery-types";

export const kindSchema = z.enum(["metadata", "resource", "bible_study", "event", "clip", "technical", "sermon", "podcast", "music", "news"]);
export type Kind = z.infer<typeof kindSchema>;
export const sourceSchema = z.object({
  title: z.string().min(3).max(250), url: z.string().url(),
  kind: z.enum(["owner_page", "transcript", "scripture", "event", "clip_manifest", "public_page", "video_metadata", "podcast_metadata"]),
  text: z.string().min(30).max(45000),
  rights: z.enum(["owned", "permission", "public_domain", "unknown", "link_only"]),
  rightsEvidence: z.string().max(2000), verifiedAt: z.string().datetime(),
  copyrightFlag: z.boolean().default(false),
  clipKey: z.string().nullable().default(null), manifestHash: z.string().nullable().default(null),
});
export type Source = z.infer<typeof sourceSchema> & { id: string; hash: string };
export const taskProposalSchema = z.object({
  title: z.string(), kind: kindSchema, targetPath: z.string(),
  priority: z.enum(["high", "medium", "low"]), rationale: z.string(), evidenceIds: z.array(z.string()),
});
export type Proposal = z.infer<typeof taskProposalSchema>;
export const insightSchema = z.object({ summary: z.string(), uncertainties: z.array(z.string()), tasks: z.array(taskProposalSchema) });
export const draftSchema = z.object({
  title: z.string(), description: z.string(), slug: z.string(), intro: z.string(),
  sections: z.array(z.object({ heading: z.string(), paragraphs: z.array(z.string()), bullets: z.array(z.string()) })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  internalLinks: z.array(z.object({ label: z.string(), path: z.string() })),
  claims: z.array(z.object({ claim: z.string(), sourceId: z.string(), evidence: z.string() })),
  quotes: z.array(z.object({ quote: z.string(), sourceId: z.string() })),
  doctrineFlags: z.array(z.string()), uncertainties: z.array(z.string()),
  event: z.object({ name: z.string(), start: z.string(), end: z.string(), timezone: z.string(), venue: z.string(), organizerUrl: z.string(), sourceId: z.string(), evidence: z.string() }).nullable(),
});
export type Draft = z.infer<typeof draftSchema>;
export type Status = "queued" | "drafting" | "review" | "blocked" | "approved" | "publishing" | "published" | "handed_off" | "rejected" | "failed";
export interface Task extends Proposal {
  editorialPlan?: import("../../src/lib/editorial-plan").EditorialPlan;
  id: string; status: Status; sourceIds: string[]; createdAt: string; updatedAt: string;
  attempts: number; nextAttemptAt?: string; draft?: Draft; draftHash?: string; checks?: string[];
  discovery?:DiscoveryProvenance;
  approval?: { discoveryHash?:string; hash: string; sourceHashes: Record<string,string>; actor: string; at: string; scheduledAt: string; checklist: string[] };
  publication?: { commit?: string; url?: string; at: string; receipt?: string }; error?: string;
}
export type Evidence = { id: string; type: string; observedAt: string; url: string; data: unknown };
export interface Report { failure?: string; id: string; at: string; start: string; end: string; summary: string; uncertainties: string[]; evidence: Evidence[]; taskIds: string[] }
export interface Cost { id: string; agent: string; at: string; model: string; status: "reserved" | "complete" | "uncertain"; reservedUsd: number; inputTokens?: number; outputTokens?: number; estimatedUsd?: number; toolCalls?:number; toolUsd?:number }
export interface State { discovery?:DiscoveryState; version: 1; tasks: Task[]; sources: Source[]; reports: Report[]; costs: Cost[]; actions: { at: string; actor: string; action: string; target: string; detail: string }[]; jobs: Record<string,{ until: string; token: string }> }
export const emptyState = (): State => ({ version: 1, tasks: [], sources: [], reports: [], costs: [], actions: [], jobs: {} });
