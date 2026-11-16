export type AuthAction = "signin" | "recovery" | "password";
type PauseStorage = Pick<Storage,"getItem"|"setItem">;
export class AuthPause extends Error {
  constructor(public seconds:number){super(`Please pause for ${seconds} seconds before trying again.`);}
}
export function isAuthRateLimit(error:unknown){const e=error as {status?:number;message?:string};return e?.status===429||/rate.?limit|too many requests/i.test(e?.message||"");}
// Store deadlines only. Credentials and recovery links never enter storage.
// One in-flight operation also prevents a second tap before React updates.
export class AuthAttemptGuard {
  private active=false;
  private deadlines:Partial<Record<AuthAction,number>>={};
  constructor(private storage?:PauseStorage,private clock=Date.now){}
  remaining(action:AuthAction){
    let saved=0;try{saved=Number(this.storage?.getItem(`apn-auth-pause-v1-${action}`)||0);}catch{}
    const until=Math.max(this.deadlines[action]||0,Number.isFinite(saved)?saved:0);
    return Math.max(0,Math.ceil((until-this.clock())/1000));
  }
  private pause(action:AuthAction,seconds:number){const until=this.clock()+seconds*1000;this.deadlines[action]=until;try{this.storage?.setItem(`apn-auth-pause-v1-${action}`,String(until));}catch{}}
  async run<T>(action:AuthAction,work:()=>Promise<T>):Promise<T>{
    if(this.active)throw new Error("A sign-in request is already running.");
    const wait=this.remaining(action);if(wait)throw new AuthPause(wait);
    this.active=true;
    try{const result=await work();if(action==="recovery")this.pause(action,15*60);return result;}
    catch(e){if(isAuthRateLimit(e))this.pause(action,action==="recovery"?15*60:60);throw e;}
    finally{this.active=false;}
  }
}
export function authFailure(error:unknown,action:AuthAction){
  if(error instanceof AuthPause)return action==="recovery"?"A reset email was requested recently. Open the newest Netlify reset email already in your inbox; requesting it again will not help yet.":error.message;
  if(isAuthRateLimit(error))return action==="recovery"?"Netlify is limiting reset emails. Use the newest reset email already sent to your inbox. This message does not mean your password is wrong.":"Netlify is temporarily limiting sign-in attempts. Pause before trying again; the timer below is a retry pause, not a guaranteed server reset time.";
  const message=error instanceof Error?error.message:"Sign-in could not complete.";
  if(action==="signin"&&/invalid|no user found|password/i.test(message))return "Email or APN password was not accepted. Use your invited email and the separate password created through APN’s invitation or recovery email.";
  return message;
}

export function invitationFailure(error:unknown){
  const message=error instanceof Error?error.message:"";
  return /user not found|token.*(?:invalid|expired)|confirmation.*expired/i.test(message)
    ? "This invitation link was already used or has expired. Your account may already exist. Return to sign-in, or request a password-reset email instead of accepting this invitation again."
    : authFailure(error,"password");
}
// Identity 2.0.1's acceptInvite creates the user but omits the nf_jwt cookie.
// Complete the explicit sign-in once using the email returned by Identity.
// Switch out of invite mode before login: an accepted token cannot be replayed
// even when the following login request fails. No credentials are persisted.
export async function completeOwnerInvitation<T extends {email?:string}>(auth:{acceptInvite:(token:string,password:string)=>Promise<T>;login:(email:string,password:string)=>Promise<T>},token:string,password:string,onAccepted:(email:string)=>void){
  const user=await auth.acceptInvite(token,password);
  onAccepted(user.email||"");
  if(!user.email)throw new Error("Invitation accepted. Return to sign-in using your invited email.");
  return auth.login(user.email,password);
}
