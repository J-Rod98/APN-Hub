import { createSign } from "node:crypto";
import { z } from "zod";
const credential=z.object({type:z.literal("service_account"),client_email:z.string().regex(/^[^@]+@[^@]+\.iam\.gserviceaccount\.com$/),private_key:z.string().min(100)});
export function googleSearchConfigured() {return !!process.env.GSC_SERVICE_ACCOUNT_JSON||["GSC_CLIENT_ID","GSC_CLIENT_SECRET","GSC_REFRESH_TOKEN"].every(k=>!!process.env[k]);}
export async function googleSearchToken(requestFetch:typeof fetch=fetch) {
 let body:URLSearchParams;
 if(process.env.GSC_SERVICE_ACCOUNT_JSON){
  const c=credential.parse(JSON.parse(process.env.GSC_SERVICE_ACCOUNT_JSON));const at=Math.floor(Date.now()/1000);
  const encode=(o:unknown)=>Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned=encode({alg:"RS256",typ:"JWT"})+"."+encode({iss:c.client_email,scope:"https://www.googleapis.com/auth/webmasters.readonly",aud:"https://oauth2.googleapis.com/token",iat:at,exp:at+3600});
  const sign=createSign("RSA-SHA256");sign.update(unsigned);sign.end();const assertion=unsigned+"."+sign.sign(c.private_key,"base64url");
  body=new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion});
 }else body=new URLSearchParams({client_id:process.env.GSC_CLIENT_ID!,client_secret:process.env.GSC_CLIENT_SECRET!,refresh_token:process.env.GSC_REFRESH_TOKEN!,grant_type:"refresh_token"});
 const r=await requestFetch("https://oauth2.googleapis.com/token",{method:"POST",redirect:"error",signal:AbortSignal.timeout(15000),body});
 if(!r.ok)throw Error("Google authorization HTTP "+r.status);
 return z.object({access_token:z.string().min(1)}).parse(await r.json()).access_token;
}
