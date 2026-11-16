"use client";
import { useEffect } from "react";
export function OwnerAuthRedirect(){
  useEffect(()=>{
    if(window.location.pathname.startsWith("/owner/agents"))return;
    if(/^#(?:invite_token|recovery_token|confirmation_token|access_token|email_change_token)=/.test(window.location.hash)){
      window.location.replace(`/owner/agents/${window.location.hash}`);
    }
  },[]);
  return null;
}
