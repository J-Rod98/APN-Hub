"use client";
import { useEffect,useRef,useState } from "react";
import { AuthAttemptGuard,authFailure,invitationFailure,completeOwnerInvitation,type AuthAction } from "@/lib/owner-auth";
const field="w-full rounded-xl border border-[#c8d5cd] bg-white px-3 py-3 text-base text-[#15372e]";
const button="rounded-full bg-[#173e38] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";
export function OwnerSignIn({onReady}:{onReady:()=>void|Promise<void>}){
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");
  const [invite,setInvite]=useState("");const [reset,setReset]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
  const guard=useRef<AuthAttemptGuard>();
  if(!guard.current){let storage:Storage|undefined;try{if(typeof window!=="undefined")storage=window.sessionStorage;}catch{}guard.current=new AuthAttemptGuard(storage);}
  const callback=useRef<Promise<Awaited<ReturnType<typeof import("@netlify/identity")["handleAuthCallback"]>>>>();
  const [initializing,setInitializing]=useState(true);const [,tick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>tick(n=>n+1),1000);return()=>clearInterval(id);},[]);
  useEffect(()=>{
    let live=true;
    callback.current??=import("@netlify/identity").then(auth=>guard.current!.run("password",()=>auth.handleAuthCallback()));
    void callback.current.then(async result=>{
      if(!live)return;
      const auth=await import("@netlify/identity");
      if(result?.type==="invite" && result.token){setInvite(result.token);return;}
      if(result?.type==="recovery"){setReset(true);return;}
      if(await auth.getUser())await onReady();
    }).catch(e=>{if(live)setMessage(authFailure(e,"password"));}).finally(()=>{if(live)setInitializing(false);});
    return()=>{live=false;};
  },[onReady]);
  const operation:AuthAction=invite||reset?"password":"signin";
  const wait=guard.current.remaining(operation);const recoveryWait=guard.current.remaining("recovery");
  async function submit(event:React.FormEvent){
    event.preventDefault();if(busy||initializing||wait)return;setBusy(true);setMessage("");
    try{
      const auth=await import("@netlify/identity");
      await guard.current!.run(operation,async()=>{
      if(invite||reset){
        if(password!==confirm)throw new Error("Passwords must match.");
        if(invite)await completeOwnerInvitation(auth,invite,password,acceptedEmail=>{setEmail(acceptedEmail);setInvite("");callback.current=Promise.resolve(null);});else await auth.updateUser({password});
        setInvite("");setReset(false);callback.current=Promise.resolve(null);
      }else await auth.login(email.trim().toLowerCase(),password);
      });
      setPassword("");setConfirm("");await onReady();
    }catch(e){setMessage(invite?invitationFailure(e):authFailure(e,operation));}
    finally{setBusy(false);}
  }
  async function recover(){
    if(busy||initializing||recoveryWait)return;
    if(!email.trim()){setMessage("Enter your invited email first.");return;}
    setBusy(true);
    try{const auth=await import("@netlify/identity");await guard.current!.run("recovery",()=>auth.requestPasswordRecovery(email.trim().toLowerCase()));setMessage("Reset email requested. Check Inbox, Updates and Spam for an email from no-reply@netlify.com titled Reset your password for this website. Open the newest link in this browser.");}
    catch(e){setMessage(authFailure(e,"recovery"));}finally{setBusy(false);}
  }
  function backToSignIn(){callback.current=Promise.resolve(null);setInvite("");setReset(false);setPassword("");setConfirm("");setMessage("Sign in with the APN password you created. If you need a new one, enter your invited email and choose Forgot password.");window.history.replaceState(null,"",window.location.pathname+window.location.search);}
  return <form onSubmit={e=>void submit(e)} className="grid gap-4">
    <h2 className="font-serif text-2xl">{invite?"Accept your owner invitation":reset?"Set a new password":"Owner sign-in"}</h2>
    <p className="text-sm text-[#60786a]">{invite?"This form is for a new invitation only. If you already created your account, return to sign-in. A password-reset email opens a different form titled Set a new password.":reset?"Choose a new APN password and confirm it below. Saving it will open your owner workspace.":"Use your invited email and your APN password. This is separate from your Netlify or Google password."}</p>
    {!invite&&!reset&&<label className="grid gap-2 text-sm font-semibold">Email<input type="email" autoComplete="username" required className={field} value={email} onChange={e=>setEmail(e.target.value)}/></label>}
    <label className="grid gap-2 text-sm font-semibold">{invite||reset?"Create a password":"Password"}<input type="password" required minLength={invite||reset?12:1} autoComplete={invite||reset?"new-password":"current-password"} className={field} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {(invite||reset)&&<label className="grid gap-2 text-sm font-semibold">Confirm password<input type="password" required autoComplete="new-password" className={field} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>}
    <button className={button} disabled={busy||initializing||wait>0}>{initializing?"Checking sign-in…":busy?"Please wait…":wait?`Pause ${wait}s`:invite?"Accept invitation":reset?"Save password":"Sign in"}</button>
    {!invite&&!reset&&<button type="button" className="text-sm font-semibold underline" disabled={busy||initializing||recoveryWait>0} onClick={()=>void recover()}>{recoveryWait?`Reset email requested · wait ${Math.ceil(recoveryWait/60)} min before another request`:"Forgot password?"}</button>}
    {(invite||reset)&&<button type="button" className="text-sm font-semibold underline" disabled={busy||initializing} onClick={backToSignIn}>Already have an account? Return to sign-in</button>}
    {message&&<p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
  </form>;
}
export function OwnerSignOut(){
  return <button className="rounded-full border border-[#c8d5cd] px-4 py-2 text-sm font-semibold" onClick={()=>void import("@netlify/identity").then(auth=>auth.logout()).finally(()=>window.location.reload())}>Sign out</button>;
}
