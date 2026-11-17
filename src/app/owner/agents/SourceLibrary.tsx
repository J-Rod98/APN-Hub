"use client";
import { useState } from "react";
import { CONTENT_PLACES, SOURCE_LIBRARY_CHECKED } from "../../../lib/agent-source-library";
import type { SourceRule } from "../../../../server/agents/automation-types";
export default function SourceLibrary({rules=[]}:{rules?:SourceRule[]}) {
  const [filter,setFilter]=useState("all");
  const places=CONTENT_PLACES.filter(p=>filter==="all"||p.categories.some(c=>c===filter));
  return <details className="rounded-2xl border border-[#d2ddd1] bg-white p-5 sm:p-6">
    <summary className="cursor-pointer font-semibold">Content source library · {CONTENT_PLACES.length} places</summary>
    <p className="mt-5 text-xs uppercase tracking-widest text-[#758779]">Places the agents can research</p>
    <h2 className="mt-2 font-serif text-3xl">Content source library</h2>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-[#63766b]">Both agents receive this list when planning or researching content. Only the exact active standing rules can authorize automatic posts. A listed ministry, its links or an event calendar do not grant blanket publishing or reproduction rights.</p>
    <p className="mt-2 text-xs text-[#63766b]">Official sites, provider identities and organization-linked leads checked {SOURCE_LIBRARY_CHECKED}. Each item still needs current source evidence. Approved feeds run hourly; wider web research runs when requested within the AI budget.</p>
    <label className="mt-5 grid max-w-xs gap-2 text-sm font-semibold">Content type<select className="rounded-xl border border-[#c8d5cd] bg-white px-3 py-2" value={filter} onChange={e=>setFilter(e.target.value)}>{["all","sermon","podcast","music","news","event","resource"].map(c=><option key={c} value={c}>{c==="all"?"All places":c}</option>)}</select></label>
    <div className="mt-5 grid gap-4 lg:grid-cols-2">{places.map(p=>{const active=rules.filter(r=>r.enabled&&p.channelUrls?.includes(r.url));return <article key={p.id} className="min-w-0 rounded-xl border border-[#d2ddd1] p-4">
      <p className="text-xs font-semibold text-[#63766b]">{active.length?"Active standing rule: "+active.map(r=>r.category).join(", "):p.ownerSelected?"Owner-requested research · automatic scope pending":"Possible source · research only"}</p>
      <h3 className="mt-2 font-serif text-xl">{p.name}</h3><p className="mt-2 text-xs uppercase text-[#758779]">{p.categories.join(" · ")}</p><p className="mt-3 text-sm leading-6">{p.use}</p>{p.note&&<p className="mt-3 text-xs leading-5 text-amber-900">{p.note}</p>}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><a className="underline" href={p.url} target="_blank" rel="noreferrer">Open source ↗</a><a className="underline" href={p.evidenceUrl} target="_blank" rel="noreferrer">Identity / link evidence ↗</a></div>
    </article>;})}</div>
  </details>;
}
