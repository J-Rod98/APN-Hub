import { test } from "node:test";
import assert from "node:assert/strict";
import { completeOwnerInvitation,invitationFailure } from "../src/lib/owner-auth";
import { identityOwner } from "../server/agents/owner-identity";

test("actual Identity SDK invitation reaches browser cookies and verified server owner access",async()=>{
 const g=globalThis as unknown as Record<string,unknown>;
 const names=["window","document","localStorage","fetch","Netlify"];
 const original=new Map(names.map(n=>[n,Object.getOwnPropertyDescriptor(globalThis,n)]));
 const cookies=new Map<string,string>();const storage=new Map<string,string>();const calls:string[]=[];
 const email="fixture@example.com";const origin="https://identity-fixture.invalid";
 const payload=Buffer.from(JSON.stringify({sub:"fixture-owner",email,exp:Math.floor(Date.now()/1000)+3600})).toString("base64url");
 const jwt=`fixture.${payload}.fixture`;
 const token={access_token:jwt,refresh_token:"fixture-refresh-only",token_type:"bearer",expires_in:3600};
 const user={id:"fixture-owner",email,confirmed_at:"2026-01-01T00:00:00Z",created_at:"2026-01-01T00:00:00Z",updated_at:"2026-01-01T00:00:00Z",app_metadata:{provider:"email"},user_metadata:{}};
 let auth:typeof import("@netlify/identity")|undefined;
 try{
  g.window={location:{origin},addEventListener:()=>{}};
  g.document={get cookie(){return [...cookies].map(([k,v])=>`${k}=${v}`).join("; ");},set cookie(value:string){const [pair]=value.split(";");const at=pair.indexOf("=");const key=pair.slice(0,at),val=pair.slice(at+1);if(val)cookies.set(key,val);else cookies.delete(key);}};
  g.localStorage={getItem:(k:string)=>storage.get(k)||null,setItem:(k:string,v:string)=>storage.set(k,v),removeItem:(k:string)=>storage.delete(k)};
  g.fetch=async(input:RequestInfo|URL,init?:RequestInit)=>{
   const url=new URL(typeof input==="string"?input:input instanceof URL?input.href:input.url);
   assert.equal(url.origin,origin,"Fixture must never reach a real Identity service");calls.push(url.pathname);
   if(url.pathname.endsWith("/verify")){assert.equal(JSON.parse(String(init?.body)).type,"signup");return Response.json(token);}
   if(url.pathname.endsWith("/token")){assert.equal(new URLSearchParams(String(init?.body)).get("username"),email);return Response.json(token);}
   if(url.pathname.endsWith("/user"))return Response.json(user);
   if(url.pathname.endsWith("/logout"))return Response.json({});
   throw new Error("Unexpected fixture request");
  };
  auth=await import("@netlify/identity");
  let accepted=false;
  await completeOwnerInvitation(auth,"fixture-invite-only","fixture-password-only",e=>{assert.equal(e,email);accepted=true;assert.equal(calls.filter(p=>p.endsWith("/token")).length,0);});
  assert.equal(accepted,true);assert.ok(cookies.has("nf_jwt"));assert.ok(cookies.has("nf_refresh"));
  assert.equal((await auth.getUser())?.email,email);
  delete g.window;
  g.Netlify={context:{url:new URL(origin),cookies:{get:(key:string)=>decodeURIComponent(cookies.get(key)||"")}}};
  const verified=await auth.getUser();assert.equal(identityOwner(verified,email),true);
  assert.equal(calls.filter(p=>p.endsWith("/verify")).length,1);assert.equal(calls.filter(p=>p.endsWith("/token")).length,1);
 }finally{
  // Restore browser mode so logout stops the SDK's refresh timer.
  g.window={location:{origin},addEventListener:()=>{}};
  if(auth)await auth.logout().catch(()=>{});
  for(const n of names){const d=original.get(n);if(d)Object.defineProperty(globalThis,n,d);else delete g[n];}
 }
});
test("consumed invitations offer sign-in instead of reporting a missing account",async()=>{
 let logins=0,accepted=0;
 await assert.rejects(()=>completeOwnerInvitation({acceptInvite:async()=>{throw new Error("User not found");},login:async()=>{logins++;return {email:"fixture@example.com"};}},"used","unused",()=>{accepted++;}));
 assert.equal(logins,0);assert.equal(accepted,0);assert.match(invitationFailure(new Error("User not found")),/already used or has expired/);
});
test("a failed login after acceptance does not leave the invitation available for replay",async()=>{
 let mode="invite";
 await assert.rejects(()=>completeOwnerInvitation({acceptInvite:async()=>({email:"fixture@example.com"}),login:async()=>{assert.equal(mode,"signin");throw new Error("network unavailable");}},"fixture","unused",()=>{mode="signin";}),/network unavailable/);
 assert.equal(mode,"signin");
});

test("owner API validates request cookies without SDK runtime globals",async()=>{
 const {verifyOwnerRequest}=await import("../server/agents/owner-identity");let calls=0;
 const verified=await verifyOwnerRequest(new Request("https://www.apostolicpowernetwork.com/api/apn-agents",{headers:{cookie:"other=value; nf_jwt=fixture.payload.signature"}}),"owner@example.com",(async(url,options)=>{
  calls++;assert.equal(String(url),"https://www.apostolicpowernetwork.com/.netlify/identity/user");assert.equal(options?.redirect,"error");assert.equal(options?.cache,"no-store");assert.equal(new Headers(options?.headers).get("authorization"),"Bearer fixture.payload.signature");
  return Response.json({id:"owner",email:"owner@example.com",confirmed_at:"2026-01-01T00:00:00Z"});
 }) as typeof fetch);
 assert.equal(calls,1);assert.deepEqual(verified,{status:"verified",owner:true});
});
test("owner request verification rejects forged, unconfirmed and other accounts",async()=>{
 const {verifyOwnerRequest}=await import("../server/agents/owner-identity");let calls=0;
 const request=(cookie?:string)=>new Request("https://www.apostolicpowernetwork.com/api/apn-agents",{headers:{...(cookie?{cookie}:{}),"x-nf-client-connection-user":JSON.stringify({id:"forged",email:"owner@example.com"})}});
 const fail=(async()=>{calls++;return new Response(null,{status:401});}) as typeof fetch;
 for(const cookie of [undefined,"nf_jwt=forged","nf_jwt=%broken","nf_jwt=a.b.c; nf_jwt=x.y.z"])assert.equal((await verifyOwnerRequest(request(cookie),"owner@example.com",fail)).owner,false);
 assert.equal(calls,0);assert.equal((await verifyOwnerRequest(request("nf_jwt=a.b.c"),"owner@example.com",fail)).status,"denied");
 for(const user of [{id:"owner",email:"owner@example.com",confirmed_at:null},{id:"other",email:"other@example.com",confirmed_at:"2026-01-01T00:00:00Z"}]){
  assert.equal((await verifyOwnerRequest(request("nf_jwt=a.b.c"),"owner@example.com",(async()=>Response.json(user)) as typeof fetch)).owner,false);
 }
});
test("Identity outages fail closed without reporting a rejected password or discarding the session",async()=>{
 const {verifyOwnerRequest}=await import("../server/agents/owner-identity");const request=new Request("https://www.apostolicpowernetwork.com/api/apn-agents",{headers:{cookie:"nf_jwt=a.b.c"}});
 const limited=await verifyOwnerRequest(request,"owner@example.com",(async()=>new Response(null,{status:429,headers:{"retry-after":"120"}})) as typeof fetch);
 assert.deepEqual(limited,{status:"unavailable",owner:false,retryAfter:"120",reason:"identity_unavailable"});
 const failed=await verifyOwnerRequest(request,"owner@example.com",(async()=>{throw new Error("network unavailable");}) as typeof fetch);
 assert.deepEqual(failed,{status:"unavailable",owner:false,retryAfter:"60",reason:"identity_unavailable"});
});


test("platform cookie context is verified when the request header omits the cookie",async()=>{
 const {verifyOwnerRequest}=await import("../server/agents/owner-identity");let calls=0;
 const result=await verifyOwnerRequest(new Request("https://www.apostolicpowernetwork.com/api/apn-agents"),"owner@example.com",(async(_url,options)=>{calls++;assert.equal(new Headers(options?.headers).get("authorization"),"Bearer runtime.payload.signature");return Response.json({id:"owner",email:"owner@example.com",confirmed_at:"2026-01-01T00:00:00Z"});}) as typeof fetch,"runtime.payload.signature");
 assert.equal(calls,1);assert.equal(result.owner,true);
});
