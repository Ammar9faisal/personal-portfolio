"use client";
import { useEffect,useRef,useState } from "react";
import { ArrowRight, Power } from "lucide-react";
import Workstation from "@/components/workstation/Workstation";
import type { AppId } from "@/components/workstation/apps";
import WorkshopScene, { type SceneObjectId } from "@/components/workshop/WorkshopScene";
import { createPrinterStore } from "@/components/workshop/printerStore";
type View = "room"|"boot"|"os";
export default function Page(){
 const [printerStore]=useState(createPrinterStore);
 const [view,setView]=useState<View>("room"),[app,setApp]=useState<AppId>("home"),[selected,setSelected]=useState("skillforge"),[reduceMotion,setReduceMotion]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);return()=>{if(timer.current)clearTimeout(timer.current)}},[]);
 function openOs(destination:AppId="home"){setApp(destination);if(view==="os")return;setView("boot");if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setView("os"),reduceMotion?80:1250)}
 function objectClick(id:SceneObjectId){if(id==="computer"){openOs();return}if(id==="chess"){setSelected("pawnvision");openOs("projects");return}if(id==="tools"){openOs("skills");return}}
 return <main className="site">
 {view!=="os"&&<div className="site-top"><div className="brand">AF<span className="brand-dot">.</span><span className="brand-sub">THE INVENTOR'S WORKSHOP</span></div><div className="site-links"><button onClick={()=>openOs("projects")}>Projects</button><button onClick={()=>openOs("experience")}>Experience</button><button onClick={()=>openOs("resume")}>Resume</button></div></div>}
 {view==="room"&&<section className="room-wrap workshop-room"><div className="intro"><p className="eyebrow">A PERSONAL ENGINEERING SPACE</p><h1>Hi, I'm Ammar.</h1><p>I build software, experiment with hardware, and enjoy making things work.</p><button className="primary" onClick={()=>openOs()}>Enter workstation <ArrowRight size={17}/></button></div><WorkshopScene printerStore={printerStore} onObjectClick={objectClick} onOpenExperience={()=>openOs("experience")}/><div className="room-footer"><span>Made with curiosity. Built to keep evolving.</span></div></section>}
 {view==="boot"&&<section className="boot" aria-live="polite"><div className="boot-symbol"><Power size={38}/></div><h2>AMMAR / WORKSTATION</h2><p>Initializing engineering archive...</p><div className="boot-track"><div className="boot-fill"/></div><button onClick={()=>{if(timer.current)clearTimeout(timer.current);setView("os")}}>Skip animation</button></section>}
 {view==="os"&&<Workstation initialApp={app} initialProject={selected} onExit={()=>setView("room")}/>}
 </main>
}
