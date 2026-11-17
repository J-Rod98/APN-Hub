import {test} from "node:test";
import assert from "node:assert/strict";
import {generateKeyPairSync,verify} from "node:crypto";
import {googleSearchToken} from "../server/agents/google-search-auth";
test("dedicated Google service identity signs only read-only Search Console scope",async()=>{
 const {privateKey,publicKey}=generateKeyPairSync("rsa",{modulusLength:2048});const old=process.env.GSC_SERVICE_ACCOUNT_JSON;
 try{process.env.GSC_SERVICE_ACCOUNT_JSON=JSON.stringify({type:"service_account",client_email:"apn-reader@apn-search-analytics.iam.gserviceaccount.com",private_key:privateKey.export({format:"pem",type:"pkcs8"}).toString()});
 const token=await googleSearchToken((async(url,init)=>{assert.equal(url,"https://oauth2.googleapis.com/token");assert.equal(init?.redirect,"error");const b=init?.body as URLSearchParams;const jwt=b.get("assertion")!.split(".");const payload=JSON.parse(Buffer.from(jwt[1],"base64url").toString());assert.equal(payload.scope,"https://www.googleapis.com/auth/webmasters.readonly");assert.equal(payload.sub,undefined);assert.equal(payload.exp-payload.iat,3600);assert.ok(verify("RSA-SHA256",Buffer.from(jwt[0]+"."+jwt[1]),publicKey,Buffer.from(jwt[2],"base64url")));return new Response('{"access_token":"fixture-token"}');}) as typeof fetch);assert.equal(token,"fixture-token");
 }finally{if(old===undefined)delete process.env.GSC_SERVICE_ACCOUNT_JSON;else process.env.GSC_SERVICE_ACCOUNT_JSON=old;}
});
