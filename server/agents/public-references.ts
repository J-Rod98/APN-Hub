import { request } from "node:https";
import { lookup } from "node:dns/promises";
import { isIP,type LookupFunction } from "node:net";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";
import type { DiscoveryCategory,DiscoveryFeed } from "./discovery-types";
export type Reference={url:string;title:string;creator:string|null;publishedAt:string|null;text:string};
export function publicUrl(raw:string){
 const u=new URL(raw);if(u.protocol!=="https:"||u.username||u.password||(u.port&&u.port!=="443")||isIP(u.hostname)||!u.hostname.includes(".")||/(?:^|\.)(?:localhost|local|internal|test|invalid)$/.test(u.hostname))throw new Error("Only public HTTPS reference URLs are allowed.");
 u.hash="";return u;
}
export function canonicalUrl(raw:string){
 const u=publicUrl(raw);const host=u.hostname.toLowerCase().replace(/^www\./,"");
 if(["youtube.com","m.youtube.com","music.youtube.com","youtu.be"].includes(host)){
  const id=host==="youtu.be"?u.pathname.split("/")[1]:u.searchParams.get("v")||/^\/(?:live|shorts|embed)\/([^/]+)/.exec(u.pathname)?.[1];
  if(id&&/^[A-Za-z0-9_-]{11}$/.test(id))return "https://www.youtube.com/watch?v="+id;
  throw new Error("Use a specific YouTube video, not a search/channel page.");
 }
 u.hostname=u.hostname.toLowerCase();for(const key of [...u.searchParams.keys()])if(/^(?:utm_|fbclid|gclid|si$|feature$)/i.test(key))u.searchParams.delete(key);
 if(u.hostname==="open.spotify.com")u.search="";
 return u.href.replace(/\/$/,"");
}
export function recordingUrl(category:DiscoveryCategory,raw:string){
 try{const u=new URL(canonicalUrl(raw));return u.hostname==="www.youtube.com"||category==="podcast"&&u.hostname==="open.spotify.com"&&/^\/(?:episode|show)\/[A-Za-z0-9]+$/.test(u.pathname);}catch{return false;}
}
export function publicAddress(ip:string){
 if(ip.includes(":"))return /^[23][0-9a-f]{0,3}:/i.test(ip)&&!/^2002:/i.test(ip)&&!/^2001:(?:0{1,4}:|:)/i.test(ip)&&!/^2001:db8:/i.test(ip);
 const a=ip.split(".").map(Number);if(a.length!==4||a.some(x=>!Number.isInteger(x)||x<0||x>255))return false;
 return !(a[0]===0||a[0]===10||a[0]===127||a[0]>=224||(a[0]===169&&a[1]===254)||(a[0]===172&&a[1]>=16&&a[1]<=31)||(a[0]===192&&a[1]===168)||(a[0]===100&&a[1]>=64&&a[1]<=127)||(a[0]===198&&[18,19].includes(a[1])));
}
// Resolve and pin a public address for each HTTPS hop. No caller credentials,
// cookies or private-network redirects are forwarded to discovered sources.
export async function fetchReferenceText(raw:string,hops=0):Promise<{url:string;text:string;contentType:string}>{
 if(hops>3)throw new Error("Too many source redirects.");const u=publicUrl(raw);const addresses=await lookup(u.hostname,{all:true});
 if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))throw new Error("Private-network sources are forbidden.");
 const pinned=addresses.find(a=>a.family===4)||addresses[0];
 const pinnedLookup=((_host,options,callback)=>{if(options.all)callback(null,[pinned]);else callback(null,pinned.address,pinned.family);}) as LookupFunction;
 return new Promise((resolve,reject)=>{
  const req=request(u,{method:"GET",signal:AbortSignal.timeout(15000),lookup:pinnedLookup,headers:{"user-agent":"APN-Discovery/1.0 (public source research)",accept:"text/html,application/rss+xml,application/atom+xml,application/xml,application/json,text/plain"}},res=>{
   if([301,302,303,307,308].includes(res.statusCode||0)&&res.headers.location){res.resume();fetchReferenceText(new URL(res.headers.location,u).href,hops+1).then(resolve,reject);return;}
   if(res.statusCode!==200){res.resume();reject(new Error("Source HTTP "+res.statusCode));return;}
   const contentType=String(res.headers["content-type"]||"");if(!/html|xml|json|text\/plain/i.test(contentType)){res.resume();reject(new Error("Source format requires manual review; no document or media was downloaded."));return;}
   let size=0;const chunks:Buffer[]=[];
   res.on("data",chunk=>{size+=chunk.length;if(size>700000){req.destroy(new Error("Reference exceeds the bounded research size."));return;}chunks.push(chunk);});
   res.on("end",()=>resolve({url:u.href,text:Buffer.concat(chunks).toString("utf8"),contentType}));res.on("error",reject);
  });req.setTimeout(12000,()=>req.destroy(new Error("Source request timed out.")));req.on("error",reject);req.end();
 });
}
const iso=(s:unknown)=>typeof s==="string"&&s.trim()&&Number.isFinite(Date.parse(s))?new Date(s).toISOString():null;
export function htmlReference(url:string,html:string):Reference{
 const $=load(html);const main=$("article").first().length?$("article").first():$("main").first();const title=(main.find("h1").first().text()||$("meta[property='og:title']").attr("content")||$("h1").first().text()||$("title").text()).trim().replace(/\s+/g," ").slice(0,250);
 let publishedAt=iso($("meta[property='article:published_time']").attr("content")||$("time[datetime]").first().attr("datetime"));
 const structured:string[]=[];
 $("script[type='application/ld+json']").each((_i,el)=>{try{const data=JSON.parse($(el).text());const visit=(v:unknown,depth=0)=>{if(depth>8||!v||typeof v!=="object")return;if(Array.isArray(v)){v.slice(0,30).forEach(x=>visit(x,depth+1));return;}const r=v as Record<string,unknown>;if(!publishedAt)publishedAt=iso(r.datePublished);if(String(r["@type"]).includes("Event"))for(const k of ["name","startDate","endDate","eventAttendanceMode","location"])if(r[k])structured.push(k+": "+JSON.stringify(r[k]));if(r["@graph"])visit(r["@graph"],depth+1);};visit(data);}catch{}});
 $("script,style,nav,header,footer,form,svg,noscript").remove();const body=$("article").first().length?$("article").first():$("main").first().length?$("main").first():$("body");
 const text=body.text().replace(/\s+/g," ").trim().slice(0,5200);
 if(!title||text.length<60)throw new Error("Original page does not provide enough readable evidence.");
 return {url:canonicalUrl(url),title,creator:null,publishedAt,text:(title+"\n"+text+(structured.length?"\nOriginal structured event fields:\n"+structured.join("\n"):"")).slice(0,6500)};
}
export async function readReference(raw:string,read=fetchReferenceText):Promise<Reference>{
 const url=canonicalUrl(raw);const u=new URL(url);
 if(u.hostname==="www.youtube.com"||u.hostname==="open.spotify.com"){
  const endpoint=u.hostname==="www.youtube.com"?"https://www.youtube.com/oembed?format=json&url=":"https://open.spotify.com/oembed?url=";
  const r=await read(endpoint+encodeURIComponent(url));const v=JSON.parse(r.text) as {title?:string;author_name?:string;author_url?:string;provider_name?:string};
  if(!v.title)throw new Error("Original provider metadata is unavailable.");
  return {url,title:v.title.slice(0,250),creator:v.author_name||null,publishedAt:null,text:"Original URL: "+url+"\nProvider title: "+v.title+"\nCreator: "+(v.author_name||"Not supplied")+"\nCreator URL: "+(v.author_url||"Not supplied")+"\nMetadata only. No transcript, sermon content, lyrics, audio or reproduction rights were supplied."};
 }
 const r=await read(url);return htmlReference(r.url,r.text);
}
export type FeedLead={url:string;category:DiscoveryCategory;title:string;creator:string|null;publishedAt:string|null;metadata:string};
export function parseFeed(feed:DiscoveryFeed,xml:string):FeedLead[]{
 if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error("Feed declarations with entities are not allowed.");
 const parsed=new XMLParser({ignoreAttributes:false,processEntities:false}).parse(xml);
 const atom=!!parsed.feed;const raw=atom?parsed.feed.entry:parsed.rss?.channel?.item;const entries=raw?(Array.isArray(raw)?raw:[raw]):[];
 const str=(v:unknown):string=>typeof v==="string"?v:typeof v==="number"?String(v):v&&typeof v==="object"?str((v as Record<string,unknown>)["#text"]):"";
 return entries.slice(0,12).flatMap(e=>{try{
  const links=Array.isArray(e.link)?e.link:[e.link];const href=atom?links.find((l:Record<string,string>)=>l?.["@_rel"]==="alternate")?.["@_href"]||links[0]?.["@_href"]:str(e.link);
  const url=canonicalUrl(new URL(href,feed.url).href);const title=str(e.title).slice(0,250);if(!title)return [];
  const creator=str(e.author?.name||e["itunes:author"]||e["dc:creator"])||null;const publishedAt=iso(str(e.published||e.pubDate));
  const summary=load(str(e.summary||e.description||e["content:encoded"])||"").text().replace(/\s+/g," ").slice(0,1200);
  return [{url,category:feed.category,title,creator,publishedAt,metadata:"Feed: "+feed.url+"\nTitle: "+title+"\nCreator: "+(creator||"Not supplied")+"\nPublished: "+(publishedAt||"Not supplied")+"\n"+summary}];
 }catch{return [];}});
}
export async function readFeed(feed:DiscoveryFeed){const r=await fetchReferenceText(feed.url);return parseFeed(feed,r.text);}
