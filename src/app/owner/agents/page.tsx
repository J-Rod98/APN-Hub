import type { Metadata } from "next";
import AgentDashboard from "./AgentDashboard";
export const metadata:Metadata={title:"APN Agent Desk",robots:{index:false,follow:false}};
export default function AgentPage(){return <AgentDashboard/>;}
