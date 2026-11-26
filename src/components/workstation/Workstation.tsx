"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Grid2X2, Wrench } from "lucide-react";
import { profile } from "@/data/portfolio";
import { applications, type AppId } from "./apps";
import Applications from "./Applications";
import DesktopIcon from "./DesktopIcon";
import Navigation from "./Navigation";
import Window, { type WindowEntry, type Area } from "./Window";
import styles from "./Workstation.module.css";

export default function Workstation({ initialApp, initialProject, onExit }: { initialApp: AppId; initialProject: string; onExit: () => void }) {
  const [windows, setWindows] = useState<WindowEntry[]>([{ id: initialApp, minimized: false }]);
  const [request, setRequest] = useState({ id: initialApp, serial: 1 });
  const [selected, setSelected] = useState(initialProject);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All projects");
  const [announcement, setAnnouncement] = useState("");
  const [area, setArea] = useState<Area>({ width: 0, height: 0 });
  const desktop = useRef<HTMLDivElement>(null);
  const homeButton = useRef<HTMLButtonElement>(null);
  const visible = windows.filter(window => !window.minimized);
  const active = visible.at(-1)?.id;

  useEffect(() => {
    if (!desktop.current) return;
    const observer = new ResizeObserver(([entry]) => setArea({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(desktop.current);
    return () => observer.disconnect();
  }, []);

  function focus(id: AppId) {
    setWindows(current => current.at(-1)?.id === id && !current.at(-1)?.minimized ? current : [...current.filter(window => window.id !== id), { id, minimized: false }]);
  }

  function open(id: AppId) {
    focus(id);
    setRequest(current => ({ id, serial: current.serial + 1 }));
  }

  function remove(id: AppId, minimize: boolean) {
    const remaining = windows.filter(window => window.id !== id && !window.minimized);
    setWindows(current => minimize ? current.map(window => window.id === id ? { ...window, minimized: true } : window) : current.filter(window => window.id !== id));
    setAnnouncement(`${applications.find(app => app.id === id)?.label} ${minimize ? "minimized" : "closed"}.`);
    const next = remaining.at(-1);
    if (next) setRequest(current => ({ id: next.id, serial: current.serial + 1 }));
    else requestAnimationFrame(() => (desktop.current?.querySelector<HTMLButtonElement>(`[aria-label="Open ${applications.find(app => app.id === id)?.label}"]`) || homeButton.current)?.focus());
  }

  return <section className={styles.os} aria-label="AmmarOS engineering workstation" onKeyDown={event => {
    if (event.altKey && event.key === "F4" && active) { event.preventDefault(); remove(active, false); }
  }}>
    <header className={styles.systemBar}><div className={styles.wordmark}><Wrench size={18}/><strong>AMMAR<span>OS</span></strong><span className={styles.systemLabel}>PERSONAL ENGINEERING WORKSTATION</span></div><button onClick={onExit}><ArrowLeft size={15}/><span>Back to Workshop</span></button></header>
    <div className={styles.desktop} ref={desktop}>
      <nav className={styles.desktopApps} aria-label="Desktop applications" inert={area.width <= 700 && Boolean(active)}>{applications.filter(app => app.id !== "home").map(app => <DesktopIcon key={app.id} app={app} onOpen={() => open(app.id)}/>)}</nav>
      <div className={styles.wallpaper} aria-hidden="true"><span className={styles.wallpaperMark}>AF<span>_</span></span><p>Ideas. Iterations. Inventions.</p><small>{profile.name} / Engineering archive</small></div>
      {!visible.length && <div className={styles.desktopHint}><p>Your workbench is clear.</p><span>Open an application to explore the archive.</span><button onClick={() => open("home")}>Open Home</button></div>}
      {area.width > 0 && windows.map((window, index) => <Window key={window.id} entry={window} area={area} index={index} active={window.id === active}
        focusRequest={request.id === window.id ? request.serial : 0} onFocus={() => focus(window.id)} onClose={() => remove(window.id, false)} onMinimize={() => remove(window.id, true)}>
        <Navigation current={window.id} onOpen={open}/>
        <Applications app={window.id} onOpen={open} selected={selected} onSelect={setSelected} query={query} onQuery={setQuery} status={status} onStatus={setStatus}/>
      </Window>)}
    </div>
    <footer className={styles.taskbar}>
      <button className={styles.launcher} ref={homeButton} onClick={() => open("home")} aria-label="Open Home"><Grid2X2 size={18}/><span>Home</span></button>
      <div className={styles.tasks} role="group" aria-label="Running applications">{windows.map(window => {
        const app = applications.find(app => app.id === window.id)!; const Icon = app.icon;
        return <button key={window.id} aria-label={`${window.minimized ? "Restore" : "Focus"} ${app.label}`} aria-pressed={window.id === active}
          data-minimized={window.minimized} onClick={() => open(window.id)}><Icon size={16}/><span>{app.label}</span><i aria-hidden="true"/></button>;
      })}</div>
      <div className={styles.pinned} aria-label="Quick access"><button onClick={() => open("projects")}>Projects</button><button onClick={() => open("resume")}>Resume</button></div>
    </footer>
    <span className={styles.srOnly} role="status">{announcement}</span>
  </section>;
}
