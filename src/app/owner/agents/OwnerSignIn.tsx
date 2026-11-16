"use client";
import { useEffect,useState } from "react";
const field="w-full rounded-xl border border-[#c8d5cd] bg-white px-3 py-3 text-base text-[#15372e]";
const button="rounded-full bg-[#173e38] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40";
export function OwnerSignIn({onReady}:{onReady:()=>void}){
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");
  const [invite,setInvite]=useState("");const [reset,setReset]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
  useEffect(()=>{
    let live=true;
    void import("@netlify/identity").then(async auth=>{
      const result=await auth.handleAuthCallback();if(!live)return;
      if(result?.type==="invite" && result.token){setInvite(result.token);return;}
      if(result?.type==="recovery"){setReset(true);return;}
      if(await auth.getUser())onReady();
    }).catch(()=>{});
    return()=>{live=false;};
  },[onReady]);
  async function submit(event:React.FormEvent){
    event.preventDefault();setBusy(true);setMessage("");
    try{
      const auth=await import("@netlify/identity");
      if(invite||reset){
        if(password!==confirm)throw new Error("Passwords must match.");
        if(invite)await auth.acceptInvite(invite,password);else await auth.updateUser({password});
        setInvite("");setReset(false);
      }else await auth.login(email,password);
      setPassword("");setConfirm("");onReady();
    }catch(e){setMessage((e as Error).message||"Sign-in failed. Use the invited owner email.");}
    finally{setBusy(false);}
  }
  async function recover(){
    if(!email){setMessage("Enter your invited email first.");return;}
    setBusy(true);
    try{const auth=await import("@netlify/identity");await auth.requestPasswordRecovery(email);setMessage("Check your email for the password recovery link.");}
    catch(e){setMessage((e as Error).message||"Recovery request failed.");}finally{setBusy(false);}
  }
  return <form onSubmit={e=>void submit(e)} className="grid gap-4">
    <h2 className="font-serif text-2xl">{invite?"Accept your owner invitation":reset?"Set a new password":"Owner sign-in"}</h2>
    <p className="text-sm text-[#60786a]">Invite-only access to APN’s private agent workspace. Sign in with the email invited by the owner.</p>
    {!invite&&!reset&&<label className="grid gap-2 text-sm font-semibold">Email<input type="email" autoComplete="username" required className={field} value={email} onChange={e=>setEmail(e.target.value)}/></label>}
    <label className="grid gap-2 text-sm font-semibold">{invite||reset?"Create a password":"Password"}<input type="password" required minLength={invite||reset?12:1} autoComplete={invite||reset?"new-password":"current-password"} className={field} value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {(invite||reset)&&<label className="grid gap-2 text-sm font-semibold">Confirm password<input type="password" required autoComplete="new-password" className={field} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>}
    <button className={button} disabled={busy}>{busy?"Please wait…":invite?"Accept invitation":reset?"Save password":"Sign in"}</button>
    {!invite&&!reset&&<button type="button" className="text-sm font-semibold underline" disabled={busy} onClick={()=>void recover()}>Forgot password?</button>}
    {message&&<p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
  </form>;
}
export function OwnerSignOut(){
  return <button className="rounded-full border border-[#c8d5cd] px-4 py-2 text-sm font-semibold" onClick={()=>void import("@netlify/identity").then(auth=>auth.logout()).finally(()=>window.location.reload())}>Sign out</button>;
}
