import { SITE, digest, now } from "./policy";
import type { Evidence } from "./types";

export type PageAudit={ path:string;status:number|null;title:string;description:string;canonical:string;text:string;error?:string };
const unescape=(s:string)=>s.replace(/&amp;/g,"&").replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">");
export function pageFromHtml(path:string,status:number,html:string):PageAudit {
  const attr=(tag:string,name:string)=>new RegExp(`${name}=["']([^"']*)["']`,"i").exec(tag)?.[1] || "";
  const metas=html.match(/<meta\b[^>]*>/gi) || [];
  const links=html.match(/<link\b[^>]*>/gi) || [];
  const main=/<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] || html;
  const text=unescape(main.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()).slice(0,18000);
  return {path,status,title:unescape(/<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] || ""), description:unescape(attr(metas.find(t=>attr(t,"name").toLowerCase()==="description") || "","content")), canonical:attr(links.find(t=>attr(t,"rel")==="canonical") || "","href"),text};
}
export async function publicGet(path:string,requestFetch:typeof fetch=fetch) {
  const u=new URL(path,SITE);if(u.origin!==SITE || !u.pathname.startsWith("/"))throw new Error("Only public APN pages may be audited.");
  const response=await requestFetch(u,{redirect:"manual",signal:AbortSignal.timeout(15000),headers:{"user-agent":"APN-Insights/1.0 (owner website audit)"}});
  if(Number(response.headers.get("content-length")||0)>1_000_000)throw new Error("Public page is too large.");
  const reader=response.body?.getReader();let text="";let size=0;const decoder=new TextDecoder();
  if(reader)for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1_000_000){await reader.cancel();throw new Error("Public page is too large.");}text+=decoder.decode(value,{stream:true});}
  return {status:response.status,text,location:response.headers.get("location")};
}
export async function auditPublicSite() {
  const pages:PageAudit[]=[];const evidence:Evidence[]=[];const paths=["/","/about/","/preaching/","/podcast/","/events/","/materials/","/guides/"];
  for(const path of ["/robots.txt","/sitemap.xml"]) {
    try {
      const r=await publicGet(path);evidence.push({id:digest(path).slice(0,16),type:"public-file",observedAt:now(),url:SITE+path,data:{status:r.status,text:r.text.slice(0,40000)}});
      if(path==="/sitemap.xml") for(const m of r.text.matchAll(/<loc>([^<]+)<\/loc>/g)){
        const u=new URL(unescape(m[1]));if(u.origin===SITE && paths.length<16 && !paths.includes(u.pathname))paths.push(u.pathname);
      }
    }catch{evidence.push({id:digest(path).slice(0,16),type:"public-file",observedAt:now(),url:SITE+path,data:{status:null,error:"Fetch unavailable"}});}
  }
  for(let i=0;i<paths.length;i+=3){
    const batch=await Promise.all(paths.slice(i,i+3).map(async path=>{
      try{const r=await publicGet(path);return pageFromHtml(path,r.status,r.text);}catch{return {path,status:null,title:"",description:"",canonical:"",text:"",error:"Public page could not be fetched"};}
    }));pages.push(...batch);
  }
  for(const p of pages)evidence.push({id:digest(p.path).slice(0,16),type:"public-page",observedAt:now(),url:SITE+p.path,data:{...p,text:undefined}});
  return {pages,evidence};
}
export function searchWindow(at=new Date()) {
  // Search Console dates use Pacific time. End three completed dates behind the
  // current Pacific date and request final data only, then compare equal weeks.
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(at);
  const get=(t:string)=>parts.find(p=>p.type===t)!.value;
  const day=new Date(`${get("year")}-${get("month")}-${get("day")}T12:00:00Z`);
  const date=(offset:number)=>new Date(day.getTime()+offset*86400000).toISOString().slice(0,10);
  return {start:date(-9),end:date(-3),previousStart:date(-16),previousEnd:date(-10)};
}
export async function searchConsole(at=new Date(),requestFetch:typeof fetch=fetch) {
  const window=searchWindow(at);const property=process.env.GSC_PROPERTY || "sc-domain:apostolicpowernetwork.com";
  const missing=["GSC_CLIENT_ID","GSC_CLIENT_SECRET","GSC_REFRESH_TOKEN"].filter(k=>!process.env[k]);
  if(missing.length)return {status:"unavailable",reason:"APN ownership verification and read-only Search Console API authorization are required.",window,totals:null,previousTotals:null,queries:[],pages:[],inspection:null};
  try{
    const tokenResponse=await requestFetch("https://oauth2.googleapis.com/token",{method:"POST",signal:AbortSignal.timeout(15000),body:new URLSearchParams({client_id:process.env.GSC_CLIENT_ID!,client_secret:process.env.GSC_CLIENT_SECRET!,refresh_token:process.env.GSC_REFRESH_TOKEN!,grant_type:"refresh_token"})});
    if(!tokenResponse.ok)throw new Error(`Google token HTTP ${tokenResponse.status}`);
    const token=await tokenResponse.json() as {access_token:string};
    const headers={authorization:`Bearer ${token.access_token}`,"content-type":"application/json"};
    const query=async(start:string,end:string,dimensions:string[],rowLimit=1000)=>{
      const r=await requestFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,{method:"POST",headers,signal:AbortSignal.timeout(20000),body:JSON.stringify({startDate:start,endDate:end,dimensions,type:"web",dataState:"final",rowLimit})});
      if(!r.ok)throw new Error(`Search Console HTTP ${r.status}`);
      return await r.json() as {rows?:{keys?:string[];clicks:number;impressions:number;ctr:number;position:number}[]};
    };
    const [total,previous,queries,pages]=await Promise.all([query(window.start,window.end,[]),query(window.previousStart,window.previousEnd,[]),query(window.start,window.end,["query","page"]),query(window.start,window.end,["page"])]);
    let inspection:unknown=null;
    const inspected=await requestFetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",{method:"POST",headers,signal:AbortSignal.timeout(20000),body:JSON.stringify({inspectionUrl:SITE+"/",siteUrl:property,languageCode:"en-US"})});
    if(inspected.ok)inspection=await inspected.json();else inspection={status:"unavailable",httpStatus:inspected.status};
    return {status:"available",property,window,totals:total.rows?.[0]??null,previousTotals:previous.rows?.[0]??null,queries:queries.rows??[],pages:pages.rows??[],inspection,limitations:"Top 1,000 query/page and page rows; anonymized queries and Google internal limits can omit rows. Totals are a separate property aggregate, not a sum of query rows. Empty results mean no rows returned, not proof of no searches."};
  }catch(e){return {status:"unavailable",reason:e instanceof Error?e.message:"Search Console failed",window,totals:null,previousTotals:null,queries:[],pages:[],inspection:null};}
}
