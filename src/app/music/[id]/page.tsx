import Link from "next/link";
import { notFound } from "next/navigation";
import { musicVideos } from "@/lib/discovered-content";
import { getPlayable } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";
// Next 14 static export requires one param even for an empty collection.
// The reserved path renders notFound(), never sample content, and is omitted from the sitemap.
export function generateStaticParams(){return musicVideos.length?musicVideos.map(v=>({id:v.id})):[{id:"__no-approved-content__"}];}
export function generateMetadata({params}:{params:{id:string}}){const v=musicVideos.find(v=>v.id===params.id);return pageMetadata({title:v?.title||"Apostolic Music",description:v?.description||"Music reviewed by APN.",path:"/music/"+params.id+"/"});}
export default function MusicVideo({params}:{params:{id:string}}){const v=musicVideos.find(v=>v.id===params.id);if(!v)notFound();const playable=getPlayable(v.sourceUrl,v.embedAllowed);return <article className="container-app max-w-3xl py-12"><Link href="/music/" className="text-sm underline">← Apostolic music</Link><h1 className="mt-5 font-serif text-4xl">{v.title}</h1>{v.creator&&<p className="mt-3 text-sanctuary-muted">Original creator: {v.creator}</p>}<p className="mt-5 text-sanctuary-muted">{v.description}</p>{playable&&playable.kind!=="audio"&&<iframe className="mt-8 aspect-video w-full rounded-2xl border-0" src={playable.src} title={v.title} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen/>}<a href={v.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-full bg-sanctuary-ink px-5 py-3 text-white">Open the original video ↗</a><p className="mt-6 text-sm text-sanctuary-muted">{v.authorizationMode==="source_policy"?"Published under APN’s approved-source policy.":"Selected by APN after individual owner review."} Playback, availability and the original recording remain with the source provider.</p></article>;}
