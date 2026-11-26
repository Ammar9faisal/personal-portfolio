"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Workstation from "@/components/workstation/Workstation";
import { applications, type AppId } from "@/components/workstation/apps";
import WorkshopScene, { type SceneObjectId } from "@/components/workshop/WorkshopScene";
import { sceneSettings } from "@/components/workshop/settings";
import { createPrinterStore } from "@/components/workshop/printerStore";
import WorkshopTransition from "@/components/transition/WorkshopTransition";

type View = "room" | "enter" | "os" | "exit";
export default function Page() {
  const [printerStore] = useState(createPrinterStore);
  const [computerGlance, setComputerGlance] = useState(false);
  const glanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (glanceTimer.current) clearTimeout(glanceTimer.current); }, []);
  const [view, setView] = useState<View>("room");
  const [app, setApp] = useState<AppId>("home");
  const [selected, setSelected] = useState("skillforge");
  const room = useRef<HTMLDivElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const busy = useRef(false);
  const returning = useRef(false);
  const moving = view === "enter" || view === "exit";

  function openOs(destination: AppId = "home", anticipate = false) {
    if (view !== "room" || busy.current) return;
    busy.current = true;
    origin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setScroll({ x: window.scrollX, y: window.scrollY });
    setApp(destination);
    if (anticipate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setComputerGlance(true);
      glanceTimer.current = setTimeout(() => {
        setComputerGlance(false); setView("enter");
      }, sceneSettings.computerGlanceMs);
    } else setView("enter");
  }
  const complete = useCallback(() => {
    busy.current = false;
    setView(current => {
      if (current === "exit") { returning.current = true; return "room"; }
      return current === "enter" ? "os" : current;
    });
  }, []);
  useEffect(() => {
    if (view === "room" && returning.current) {
      returning.current = false;
      const target = origin.current;
      const focus = target?.getClientRects().length ? target : room.current?.querySelector<HTMLButtonElement>(".primary");
      focus?.focus({ preventScroll: true });
      const rect = focus?.getBoundingClientRect();
      if (rect && (rect.top < 0 || rect.bottom > window.innerHeight)) focus?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [view]);
  function objectClick(id: SceneObjectId, anticipate = false) {
    if (id === "computer") openOs("home", anticipate);
    if (id === "chess") { setSelected("pawnvision"); openOs("projects"); }
    if (id === "tools") openOs("skills");
  }
  return <main className="site">
    <div ref={room} className={`room-layer ${moving ? "camera-moving" : ""}`} hidden={view === "os"} inert={view !== "room" || computerGlance}>
      <div className="site-top"><div className="brand">AF<span className="brand-dot">.</span><span className="brand-sub">THE INVENTOR'S WORKSHOP</span></div><div className="site-links"><button onClick={() => openOs("projects")}>Projects</button><button onClick={() => openOs("experience")}>Experience</button><button onClick={() => openOs("resume")}>Resume</button></div></div>
      <section className="room-wrap workshop-room"><div className="intro"><p className="eyebrow">A PERSONAL ENGINEERING SPACE</p><h1>Hi, I'm Ammar.</h1><p>I build software, experiment with hardware, and enjoy making things work.</p><button className="primary" onClick={() => openOs()}>Enter workstation <ArrowRight size={17}/></button></div><WorkshopScene computerGlance={computerGlance} active={view === "room"} printerStore={printerStore} onObjectClick={objectClick} onOpenExperience={() => openOs("experience")}/><div className="room-footer"><span>Made with curiosity. Built to keep evolving.</span></div></section>
    </div>
    {(view === "os" || view === "exit") && <div data-os-host className={`os-host ${view === "os" ? "os-arriving" : ""}`} inert={view !== "os"}><Workstation initialApp={app} initialProject={selected} onExit={() => { if (!busy.current) { busy.current = true; setView("exit"); } }}/></div>}
    {moving && <WorkshopTransition direction={view} label={applications.find(item => item.id === app)!.label} room={room} scroll={scroll} onComplete={complete}/>}
  </main>;
}
