import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFile,stat } from "node:fs/promises";
import { resolve,extname,sep } from "node:path";
import { loadEnvConfig } from "@next/env";
import { FileStore } from "../server/agents/store";
import { api } from "../server/agents/api";
import { tick } from "../server/agents/workflow";
loadEnvConfig(process.env.APN_ENV_DIR || process.cwd());
process.env.APN_OWNER_TOKEN ||= randomBytes(32).toString("hex");
const cookie=randomBytes(32).toString("hex");
const port=Number(process.env.PORT||8787);const origin=`http://127.0.0.1:${port}`;
const store=new FileStore(process.env.APN_LOCAL_STATE || ".agent-data/state.json");const base=resolve("out");
const mimes:Record<string,string>={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".json":"application/json",".woff2":"font/woff2",".png":"image/png",".ico":"image/x-icon",".txt":"text/plain"};
createServer(async(req,res)=>{
  try{
    const host=req.headers.host;if(host!==`127.0.0.1:${port}` && host!==`localhost:${port}`){res.writeHead(403).end();return;}
    if(req.headers.origin && req.headers.origin!==origin && req.headers.origin!==`http://localhost:${port}`){res.writeHead(403).end();return;}
    const url=new URL(req.url||"/",origin);
    if(url.pathname==="/health"){res.writeHead(200,{"content-type":"application/json"}).end('{"status":"ok"}');return;}
    if(url.pathname==="/api/apn-agents"){
      const parts:Buffer[]=[];let bytes=0;
      for await(const part of req){bytes+=part.length;if(bytes>100000){res.writeHead(413).end();return;}parts.push(part);}
      const headers=new Headers();if(req.headers.authorization)headers.set("authorization",req.headers.authorization);
      if((req.headers.cookie||"").split("; ").includes(`apn-local=${cookie}`))headers.set("authorization",`Bearer ${process.env.APN_OWNER_TOKEN}`);
      const request=new Request(url,{method:req.method,headers,body:req.method==="GET"?undefined:Buffer.concat(parts)});
      const response=await api(request,store,async mode=>{void tick(store,mode as "all").catch(()=>console.error("Agent run failed. Review the private action ledger."));});
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
    }
    let path=resolve(base,"."+decodeURIComponent(url.pathname));if(path!==base&&!path.startsWith(base+sep)){res.writeHead(403).end();return;}
    try{if((await stat(path)).isDirectory())path=resolve(path,"index.html");}catch{path=resolve(base,"404.html");}
    const headers:Record<string,string>={"content-type":mimes[extname(path)]||"application/octet-stream","x-content-type-options":"nosniff"};
    if(url.pathname.startsWith("/owner/agents")){headers["set-cookie"]=`apn-local=${cookie}; HttpOnly; SameSite=Strict; Path=/`;headers["cache-control"]="no-store";}
    res.writeHead(200,headers);res.end(await readFile(path));
  }catch{res.writeHead(500).end("Local workspace request failed.");}
}).listen(port,"127.0.0.1",()=>console.log(`APN Agent Desk: ${origin}/owner/agents/`));
