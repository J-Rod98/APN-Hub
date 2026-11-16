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
