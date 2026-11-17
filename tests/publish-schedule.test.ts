import {test} from "node:test";
import assert from "node:assert/strict";
import scheduledPublish,{config} from "../netlify/functions/apn-publish-schedule";
test("publication schedule honors both gates and triggers only publishing, never paid research",async()=>{
 const before={agents:process.env.APN_AGENTS_ENABLED,publishing:process.env.APN_PUBLISH_ENABLED,url:process.env.URL,worker:process.env.APN_WORKER_TOKEN,fetch:globalThis.fetch};let calls=0;
 try{globalThis.fetch=(async(url,init)=>{calls++;assert.equal(String(url),"https://apn.example/.netlify/functions/apn-agent-worker");assert.equal(new Headers(init?.headers).get("authorization"),"Bearer fixture-worker-token");assert.deepEqual(JSON.parse(String(init?.body)),{mode:"publish"});return new Response(null,{status:202});}) as typeof fetch;
  process.env.APN_AGENTS_ENABLED="true";process.env.APN_PUBLISH_ENABLED="false";await scheduledPublish();assert.equal(calls,0);
  process.env.APN_PUBLISH_ENABLED="true";process.env.APN_AGENTS_ENABLED="false";await scheduledPublish();assert.equal(calls,0);
  process.env.APN_AGENTS_ENABLED="true";process.env.URL="https://apn.example";process.env.APN_WORKER_TOKEN="fixture-worker-token";await scheduledPublish();assert.equal(calls,1);assert.equal(config.schedule,"*/15 * * * *");
 }finally{globalThis.fetch=before.fetch;for(const [key,value] of [["APN_AGENTS_ENABLED",before.agents],["APN_PUBLISH_ENABLED",before.publishing],["URL",before.url],["APN_WORKER_TOKEN",before.worker]])if(value===undefined)delete process.env[key!];else process.env[key!]=value;}
});
