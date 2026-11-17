import { z } from "zod";
import { CONTENT_PLAN_ID, CONTENT_PLAN_SLOTS } from "../../src/lib/editorial-plan";
import { action, digest, now, validateDraft } from "./policy";
import { draftSchema, type State, type Task } from "./types";
export const slotSchema = z.string().refine(id => CONTENT_PLAN_SLOTS.some(slot => slot.id === id), "Unknown content-plan slot.");
export function assignSlot(s: State, task: Task, slotId: string, fillResearchGap = false, actor = "owner") {
  const slot = CONTENT_PLAN_SLOTS.find(slot => slot.id === slotSchema.parse(slotId))!;
  if (slot.kind !== task.kind) throw new Error("Content category differs from the plan slot.");
  const occupied = s.tasks.find(t => t.id !== task.id && t.editorialPlan?.id === CONTENT_PLAN_ID && t.editorialPlan.slot === slotId);
  if (task.editorialPlan && task.editorialPlan.slot !== slotId) throw new Error("This task is already assigned to another slot.");
  if (occupied) {
    if (!fillResearchGap || occupied.status !== "blocked" || occupied.draft || occupied.sourceIds.length || occupied.approval || !occupied.id.startsWith("plan-")) throw new Error("This plan slot already has a task.");
    if (!task.sourceIds.length) throw new Error("Attach verified sources before filling a research gap.");
    // A sourced replacement may fill a research-only placeholder. Retain the
    // original gap and audit trail; never supersede a draft or an approval.
    occupied.status = "rejected";occupied.updatedAt = now();delete occupied.editorialPlan;
    action(s, actor, "research-gap-filled", occupied.id, "Replaced by sourced task " + task.id);
  }
  task.editorialPlan = { id: CONTENT_PLAN_ID, slot: slotId, week: slot.week };
  action(s, actor, "content-plan-assigned", task.id, slotId);
  return task;
}
export function fillNextResearchGap(s: State, task: Task) {
  if (!task.sourceIds.length || task.editorialPlan) return null;
  if (task.kind === "news") {
    const published = Date.parse(task.discovery?.publishedAt || "");
    if (!Number.isFinite(published) || published > Date.now() + 86400000 || Date.now() - published > 90 * 86400000) return null;
  }
  const gap = s.tasks.filter(t => t.kind === task.kind && t.editorialPlan?.id === CONTENT_PLAN_ID && t.status === "blocked" && !t.draft && !t.sourceIds.length && !t.approval).sort((a,b) => a.editorialPlan!.week - b.editorialPlan!.week)[0];
  return gap ? assignSlot(s, task, gap.editorialPlan!.slot, true, "APN Editor") : null;
}
export function planTask(s: State, input: unknown) {
  const b = z.object({ slot: slotSchema, existingId: z.string().optional(), title: z.string().min(10).max(200).optional(), researchNote: z.string().min(20).max(4000).optional() }).strict().parse(input);
  if (b.existingId) {
    const task = s.tasks.find(t => t.id === b.existingId);
    if (!task || ["rejected", "publishing", "published", "handed_off"].includes(task.status)) throw new Error("Choose an unpublished active task.");
    return assignSlot(s, task, b.slot, true);
  }
  const existing = s.tasks.find(t => t.editorialPlan?.id === CONTENT_PLAN_ID && t.editorialPlan.slot === b.slot);
  if (existing) return existing;
  if (!b.title || !b.researchNote) throw new Error("A research task needs a title and a specific source gap.");
  const slot = CONTENT_PLAN_SLOTS.find(slot => slot.id === b.slot)!;
  const task: Task = { id: "plan-" + digest([CONTENT_PLAN_ID, b.slot]).slice(0,24), kind: slot.kind, title: b.title, targetPath: slot.kind === "sermon" ? "/preaching/" : slot.kind === "resource" ? "/guides/" : `/${slot.kind === "event" ? "events" : slot.kind}/`, priority: slot.week === 1 ? "high" : "medium", rationale: b.researchNote, evidenceIds: [], sourceIds: [], status: "blocked", checks: [b.researchNote], createdAt: now(), updatedAt: now(), attempts: 0 };
  s.tasks.push(task);return assignSlot(s, task, b.slot);
}
export function saveReviewDraft(s: State, input: unknown, paths: string[], existing: {title:string;description:string;slug?:string}[]) {
  const b = z.object({ id: z.string(), sourceIds: z.array(z.string()).min(1).max(15), draft: draftSchema.strict() }).strict().parse(input);
  const t = s.tasks.find(t => t.id === b.id);
  if (!t || t.approval || !["queued", "review", "blocked", "failed"].includes(t.status)) throw new Error("Only an unapproved editable task can receive a researched draft.");
  if (["sermon", "podcast", "music", "news"].includes(t.kind) && !t.discovery) throw new Error("Original discovery provenance is required.");
  if (b.sourceIds.some(id => !s.sources.some(src => src.id === id))) throw new Error("Unknown source.");
  // Retry the identical request safely; never grant or reconstruct an approval.
  t.sourceIds = [...new Set(b.sourceIds)];t.draft = b.draft;t.draftHash = digest(b.draft);
  t.checks = validateDraft(t, b.draft, s.sources.filter(src => t.sourceIds.includes(src.id)), paths, existing);
  t.status = t.checks.length ? "blocked" : "review";t.updatedAt = now();delete t.error;
  action(s, "owner-assisted research", "researched-draft-saved", t.id, "Prepared outside the APN model worker. No APN API inference charge; owner approval still required.");
  return t;
}
