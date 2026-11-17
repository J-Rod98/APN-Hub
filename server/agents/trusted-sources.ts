import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { fetchReferenceText,canonicalUrl,publicUrl,parseFeed,readReference,type Reference } from "./public-references";
import { sourceRuleInput,type RuleInput,type SourceRule,type SourceIdentity } from "./automation-types";
import { digest,now } from "./policy";
export type TrustedLead={reference:Reference;identity:SourceIdentity;verifiedAt:string;embedAvailable:boolean};
export const INITIAL_SOURCES:RuleInput[]=[
 {label:"Indiana Bible College music",provider:"youtube",url:"https://www.youtube.com/channel/UC9LqUFa30B-v7nNve5FQNhg",category:"music",includeTerms:["ibc live","| live "],embed:true},
 {label:"POA worship",provider:"youtube",url:"https://www.youtube.com/channel/UC_RdUg3ZoasAQ-cDJf72RrA",category:"music",includeTerms:["worship"],embed:true},
 {label:"Hear the Harvest · Iowa District",provider:"spotify",url:"https://open.spotify.com/show/6JDPvDbLUUVx9Mh0F7rh4l",category:"podcast",includeTerms:[],embed:true},
 {label:"UPCI official news",provider:"feed",url:"https://upci.org/feed/",category:"news",includeTerms:[],embed:false},
];
const parser=()=>new XMLParser({ignoreAttributes:false,processEntities:false});
export function youtubeEntries(xml:string,id:string) {
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error("Feed entities are forbidden.");
 const f=parser().parse(xml).feed;const root=String(f?.["yt:channelId"]||"");
 if(!f||!([id,id.slice(2)].includes(root))||f.author?.uri!=="https://www.youtube.com/channel/"+id)throw Error("YouTube feed identity differs from the approved channel.");
 const entries=f.entry?(Array.isArray(f.entry)?f.entry:[f.entry]):[];
 return {title:String(f.title),entries:entries.slice(0,15).filter((e:Record<string,unknown>)=>e["yt:channelId"]===id).map((e:Record<string,any>)=>({id:String(e["yt:videoId"]),title:String(e.title),publishedAt:String(e.published),creator:String(e.author?.name||f.author.name)}))};
}
export function spotifyEntity(html:string,showId:string) {
 const $=load(html);const raw=$("script#__NEXT_DATA__").text();if(!raw)throw Error("Spotify provider metadata is unavailable.");
 const data=JSON.parse(raw).props?.pageProps?.state?.data;const e=data?.entity;
 if(data?.embeded_entity_uri!=="spotify:show:"+showId||e?.relatedEntityUri!=="spotify:show:"+showId||e.type!=="episode"||e.uri!=="spotify:episode:"+e.id||!/^[A-Za-z0-9]{22}$/.test(e.id))throw Error("Spotify episode does not belong to the approved show.");
 return {id:String(e.id),title:String(e.title),creator:String(e.subtitle),publishedAt:String(e.releaseDate?.isoString||""),embedAvailable:e.isPlayable===true&&!e.isExplicit&&!e.isNineteenPlus};
}
export async function verifyRule(input:unknown,read=fetchReferenceText):Promise<Omit<SourceRule,"grant"|"enabled">> {
 const b=sourceRuleInput.parse(input);const u=publicUrl(b.url);let identity:SourceIdentity,feedUrl:string,proof:string;
 if(b.provider==="youtube"){
  if(!["www.youtube.com","youtube.com"].includes(u.hostname)||!["sermon","music","podcast"].includes(b.category))throw Error("Use an official YouTube channel for media listings.");
  let id=/^\/channel\/(UC[A-Za-z0-9_-]{22})\/?$/.exec(u.pathname)?.[1];
  if(!id&&/^\/@[A-Za-z0-9_.-]+$/.test(u.pathname)){const page=await read(u.href,0,2500000);const $=load(page.text);id=/^https:\/\/www.youtube.com\/channel\/(UC[A-Za-z0-9_-]{22})$/.exec($("meta[property='og:url']").attr("content")||"")?.[1];}
  if(!id)throw Error("Paste a verified YouTube channel URL, not a video or search page.");
  feedUrl="https://www.youtube.com/feeds/videos.xml?channel_id="+id;const r=await read(feedUrl);if(r.url!==feedUrl)throw Error("Unexpected channel feed redirect.");youtubeEntries(r.text,id);identity={provider:"youtube",id};proof=r.text;b.url="https://www.youtube.com/channel/"+id;
 }else if(b.provider==="spotify"){
  const id=u.hostname==="open.spotify.com"&&/^\/show\/([A-Za-z0-9]{22})\/?$/.exec(u.pathname)?.[1];if(!id||b.category!=="podcast")throw Error("Use an exact Spotify podcast show URL.");
  feedUrl="https://open.spotify.com/embed/show/"+id;const r=await read(feedUrl);if(r.url!==feedUrl)throw Error("Unexpected podcast redirect.");spotifyEntity(r.text,id);identity={provider:"spotify",id};proof=r.text;b.url="https://open.spotify.com/show/"+id;
 }else{
  if(!["news","event"].includes(b.category)||b.embed)throw Error("Web feeds permit attributed news/event briefs, not media reproduction.");
  const r=await read(u.href);if(publicUrl(r.url).hostname!==u.hostname)throw Error("Feed redirects must stay on the approved publisher host.");
  if(!parseFeed({id:"verify",label:b.label,url:r.url,category:b.category,enabled:true},r.text).length)throw Error("No verifiable entries in this RSS/Atom feed.");
  feedUrl=r.url;identity={provider:"feed",id:feedUrl};proof=r.text;b.url=feedUrl;
 }
 return {...b,id:"rule-"+digest({identity,category:b.category,feedUrl}).slice(0,20),identity,feedUrl,verifiedAt:now(),verificationHash:digest(proof)};
}
export async function trustedLeads(rule:SourceRule,read=fetchReferenceText,reference=readReference):Promise<TrustedLead[]> {
 const r=await read(rule.feedUrl);if(r.url!==rule.feedUrl)throw Error("Source endpoint changed; verify its standing rule.");const identity=rule.identity;const verifiedAt=now();
 if(rule.provider==="youtube"){
  const {entries}=youtubeEntries(r.text,identity.id);const leads:TrustedLead[]=[];
  for(const e of entries.filter((e:{title:string})=>!rule.includeTerms.length||rule.includeTerms.some(term=>e.title.toLowerCase().includes(term.toLowerCase()))).slice(0,4)){
   if(!/^[A-Za-z0-9_-]{11}$/.test(e.id)||!Number.isFinite(Date.parse(e.publishedAt))||Date.parse(e.publishedAt)>Date.now())continue;
   const url="https://www.youtube.com/watch?v="+e.id;const ref=await reference(url);
   const oembed=await read("https://www.youtube.com/oembed?format=json&url="+encodeURIComponent(url));const embed=JSON.parse(oembed.text);const embedAvailable=typeof embed.html==="string"&&embed.html.includes("https://www.youtube.com/embed/"+e.id);
   leads.push({identity,verifiedAt,embedAvailable,reference:{...ref,publishedAt:new Date(e.publishedAt).toISOString(),text:ref.text+"\nVerified original channel feed: "+rule.feedUrl+"\nChannel ID: "+identity.id+"\nPublished: "+e.publishedAt}});
  }return leads;
 }
 if(rule.provider==="spotify"){
  const e=spotifyEntity(r.text,identity.id);const url="https://open.spotify.com/episode/"+e.id;const ref=await reference(url);
  return [{identity,verifiedAt,embedAvailable:e.embedAvailable,reference:{...ref,title:e.title,creator:e.creator,publishedAt:Number.isFinite(Date.parse(e.publishedAt))?new Date(e.publishedAt).toISOString():null,text:ref.text+"\nVerified show: "+rule.url+"\nShow title: "+e.creator+"\nPublished: "+e.publishedAt}}];
 }
 const entries=parseFeed({id:rule.id,label:rule.label,url:rule.feedUrl,category:rule.category,enabled:true},r.text);const leads:TrustedLead[]=[];
 for(const e of entries.filter(e=>new URL(e.url).hostname===new URL(rule.feedUrl).hostname).slice(0,4)){
  const ref=await reference(e.url);if(new URL(ref.url).hostname!==new URL(rule.feedUrl).hostname)continue;
  leads.push({identity,verifiedAt,embedAvailable:false,reference:{...ref,publishedAt:ref.publishedAt||e.publishedAt,text:(ref.text+"\nVerified publisher feed metadata:\n"+e.metadata).slice(0,7500)}});
 }return leads;
}
