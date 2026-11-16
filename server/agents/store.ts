import { getStore } from "@netlify/blobs";
import { mkdir, readFile, writeFile, rename, open, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { emptyState, type State } from "./types";

export interface StateStore { read(): Promise<State>; update<T>(mutate: (state: State) => T): Promise<T> }
const clone = <T>(v:T):T => structuredClone(v);
export class MemoryStore implements StateStore {
  state: State = emptyState();
  async read() { return clone(this.state); }
  async update<T>(mutate: (state:State)=>T) { const s=clone(this.state);const result=mutate(s);this.state=s;return result; }
}
// Strong reads + conditional writes protect approvals, leases, queue and budget
// together. Mutators MUST be synchronous and contain no external side effects.
export class BlobStore implements StateStore {
  blob = getStore({name: process.env.APN_STORE_NAME || `apn-agent-workflow-v1-${process.env.CONTEXT === "production" ? "production" : "preview-"+(process.env.DEPLOY_ID || "local")}`, consistency:"strong"});
  async read() { return (await this.blob.get("state",{type:"json"}) as State|null) ?? emptyState(); }
  async update<T>(mutate:(state:State)=>T):Promise<T> {
    for(let i=0;i<8;i++) {
      const current=await this.blob.getWithMetadata("state",{type:"json"});
      if(current && !current.etag)throw new Error("State version is missing; refusing an unguarded update.");
      const s:State=current?.data ?? emptyState();
      const result=mutate(s);
      const written=await this.blob.setJSON("state",s,current ? {onlyIfMatch:current.etag}:{onlyIfNew:true});
      if(written.modified) return result;
    }
    throw new Error("Queue is busy; retry this request.");
  }
}
// Local-only durable adapter. Exclusive file lock fails closed after a crash;
// it never silently steals an in-flight approval or publication lock.
export class FileStore implements StateStore {
  path: string;
  constructor(path: string) { this.path=resolve(path); }
  async read() { try { return JSON.parse(await readFile(this.path,"utf8")) as State; } catch(e) {if((e as NodeJS.ErrnoException).code==="ENOENT")return emptyState();throw e;} }
  async update<T>(mutate:(state:State)=>T):Promise<T> {
    await mkdir(dirname(this.path),{recursive:true});
    const lock=await open(this.path+".lock","wx",0o600);
    try {
      const s=await this.read();const result=mutate(s);const temp=this.path+"."+randomUUID();
      await writeFile(temp,JSON.stringify(s,null,2),{mode:0o600});await rename(temp,this.path);return result;
    } finally { await lock.close();await unlink(this.path+".lock"); }
  }
}
let singleton:StateStore|undefined;
export function getStateStore() {
  if(!singleton) singleton=process.env.APN_LOCAL_STATE ? new FileStore(process.env.APN_LOCAL_STATE) : new BlobStore();
  return singleton;
}
