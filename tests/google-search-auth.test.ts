import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,verify} from "node:crypto";
import {googleSearchToken} from "../server/agents/google-search-auth";
import {MemoryStore} from "../server/agents/store";
import {runInsights,weekId} from "../server/agents/workflow";
import type {generate} from "../server/agents/model";
test("connecting Google preserves the access-gap report and permits only one fresh weekly review",async()=>{
 const old=process.env.GSC_CLIENT_ID;const oldSecret=process.env.GSC_CLIENT_SECRET;const oldRefresh=process.env.GSC_REFRESH_TOKEN;
 try{process.env.GSC_CLIENT_ID="fixture";process.env.GSC_CLIENT_SECRET="fixture";process.env.GSC_REFRESH_TOKEN="fixture";const store=new MemoryStore();const base=weekId();const prior={id:base,at:new Date().toISOString(),start:"2026-11-01",end:"2026-11-07",summary:"Search access unavailable",uncertainties:["Missing access"],taskIds:[],evidence:[{id:"gsc",type:"search-console",observedAt:new Date().toISOString(),url:"https://search.google.com/search-console",data:{status:"unavailable"}}]};store.state.reports.push(structuredClone(prior));let calls=0;
 const deps={audit:async()=>({pages:[],evidence:[]}),search:async()=>({status:"available",property:"sc-domain:apostolicpowernetwork.com",window:{start:"2026-11-08",end:"2026-11-14",previousStart:"2026-11-01",previousEnd:"2026-11-07"},totals:{clicks:4,impressions:232,ctr:4/232,position:10},previousTotals:null,queries:[],pages:[],inspection:null,limitations:"Fixture"}),model:(async()=>{calls++;return {summary:"Actual search fixture",uncertainties:[],tasks:[]};}) as typeof generate};
 await runInsights(store,deps);await runInsights(store,deps);assert.equal(calls,1);assert.deepEqual(store.state.reports[0],prior);assert.equal(store.state.reports[1].id,base+"-search-connected");
 }finally{for(const[k,v]of Object.entries({GSC_CLIENT_ID:old,GSC_CLIENT_SECRET:oldSecret,GSC_REFRESH_TOKEN:oldRefresh}))if(v===undefined)delete process.env[k];else process.env[k]=v;}
});
test("dedicated Google service identity signs only read-only Search Console scope",async()=>{
 const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});const old=process.env.GSC_SERVICE_ACCOUNT_JSON;
 try{process.env.GSC_SERVICE_ACCOUNT_JSON=JSON.stringify({type:"service_account",client_email:"apn-reader@apn-search-analytics.iam.gserviceaccount.com",private_key:privateKey.export({format:"pem",type:"pkcs8"}).toString()});
 const token=await googleSearchToken((async(url,init)=>{assert.equal(url,"https://oauth2.googleapis.com/token");assert.equal(init?.redirect,"error");const b=init?.body as URLSearchParams;const jwt=b.get("assertion")!.split(".");const payload=JSON.parse(Buffer.from(jwt[1],"base64url").toString());assert.equal(payload.scope,"https://www.googleapis.com/auth/webmasters.readonly");assert.equal(payload.sub,undefined);assert.equal(payload.exp-payload.iat,3600);assert.ok(verify("RSA-SHA256",Buffer.from(jwt[0]+"."+jwt[1]),publicKey,Buffer.from(jwt[2],"base64url")));return new Response('{"access_token":"fixture-token"}');}) as typeof fetch);assert.equal(token,"fixture-token");
 }finally{if(old===undefined)delete process.env.GSC_SERVICE_ACCOUNT_JSON;else process.env.GSC_SERVICE_ACCOUNT_JSON=old;}
});
