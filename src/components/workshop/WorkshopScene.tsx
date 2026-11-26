"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Atmosphere from "./Atmosphere";
import Lighting from "./Lighting";
import { useRobotIdle } from "./useRobotIdle";
import WorkshopPanel from "./WorkshopPanel";
import PrinterLayer, { PrinterBadge } from "./PrinterLayer";
import { usePrinter } from "./usePrinter";
import type { PrinterStore } from "./printerStore";
import { sceneObjects, sceneSettings, type SceneObjectId, type PanelId } from "./settings";
import { useSceneActivity } from "./useSceneActivity";
import { useRainAudio } from "./useRainAudio";
import styles from "./WorkshopScene.module.css";
export type { SceneObjectId } from "./settings";

function bounds(object: { x: number; y: number; width: number; height: number }): CSSProperties {
  return { left: `${object.x / sceneSettings.width * 100}%`, top: `${object.y / sceneSettings.height * 100}%`, width: `${object.width / sceneSettings.width * 100}%`, height: `${object.height / sceneSettings.height * 100}%` };
}
const animationStyle = {
  "--lamp-duration": `${sceneSettings.lampSeconds}s`, "--scan-duration": `${sceneSettings.scanSeconds}s`,
  "--prompt-duration": `${sceneSettings.promptSeconds}s`,
  "--reaction-duration": `${sceneSettings.reactionMs}ms`,
} as CSSProperties;

export default function WorkshopScene({ onObjectClick, onOpenExperience, printerStore, active = true, computerGlance = false }: { onObjectClick: (id: SceneObjectId, anticipate?: boolean) => void; computerGlance?: boolean; onOpenExperience: () => void; printerStore: PrinterStore; active?: boolean }) {
  const [paused, setPaused] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [reaction, setReaction] = useState(0);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const inactive = useSceneActivity(viewport);
  const eyes = useRobotIdle(paused || inactive || !active, computerGlance);
  const audio = useRainAudio(inactive || !active);
  const printerInactive = useSceneActivity(root);
  const printer = usePrinter(paused || printerInactive || !active, printerStore);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const closePanel = useCallback(() => {
    setPanel(null);
    const origin = trigger.current;
    if (origin?.getClientRects().length) origin.focus();
    else Array.from(root.current?.querySelectorAll<HTMLButtonElement>("button") || []).find(button => button.getAttribute("aria-label") === origin?.getAttribute("aria-label") && button.getClientRects().length)?.focus();
  }, []);
  useEffect(() => {
    if (!panel || !active) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); closePanel(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [panel, closePanel, active]);

  function activate(id: SceneObjectId, button: HTMLButtonElement) {
    if (id === "robot" || id === "printer" || id === "chess") {
      trigger.current = button;
      setPanel(id);
      if (id === "robot") {
        setReaction(value => value + 1);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setReaction(0), sceneSettings.reactionMs);
      }
    } else { setPanel(null); onObjectClick(id, !paused); }
  }
  function isPanel(id: SceneObjectId): id is PanelId { return id === "robot" || id === "printer" || id === "chess"; }

  return <div ref={root} className={styles.workshop} data-paused={paused || inactive || !active} data-inactive={inactive} style={animationStyle}>
    <audio ref={audio.element} src={sceneSettings.audioSrc} preload="none" loop hidden aria-hidden="true"/>
    <div ref={viewport} data-workshop-viewport className={styles.viewport}>
      <div className={styles.stage}>
        <img className={styles.artwork} src="/workshop/scene.webp" width={sceneSettings.width} height={sceneSettings.height}
          alt="Cozy inventor's workshop with a computer, robot, chessboard, 3D printer and robotics equipment" draggable={false} fetchPriority="high"/>
        <span data-monitor-screen aria-hidden="true" className={styles.monitorTarget} style={bounds({x:797,y:330,width:123,height:100})}/><Atmosphere reaction={reaction} eyes={eyes}/><PrinterLayer store={printer}/><div className={styles.shade}/><Lighting/>
        {sceneObjects.map(object => <button key={object.id} data-camera-ui className={styles.hotspot} data-object={object.id} style={bounds(object)} aria-label={object.action}
          aria-expanded={isPanel(object.id) ? panel === object.id : undefined} aria-haspopup={isPanel(object.id) ? "dialog" : undefined}
          aria-controls={panel === object.id ? panelId : undefined} onClick={event => activate(object.id, event.currentTarget)}>
          <span className={styles.label}>{object.action}</span><span className={styles.marker} aria-hidden="true">+</span>
          {object.id === "printer" && <PrinterBadge store={printer}/>}
        </button>)}
      </div>
      <div data-camera-ui className={styles.caption}>
        <span>Click objects to explore.</span>
        <div className={styles.ambienceControls}>
          <button className={styles.motionToggle} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Resume motion" : "Pause motion"}</button>
          <span className={styles.stillLabel}>Reduced motion · still ambience</span>
          <button className={styles.audioToggle} aria-pressed={audio.enabled} disabled={audio.busy} onClick={audio.toggle} title="Optional rain recording; off by default">{audio.enabled ? "Mute rain audio" : "Enable rain audio"}</button>
        </div>
      </div>
    </div>
    {audio.error && <p className={styles.audioError} role="status">{audio.error}</p>}
    <nav data-camera-ui className={styles.objectNav} aria-label="Workshop objects">
      {sceneObjects.map(object => <button key={object.id} aria-label={object.action} onClick={event => activate(object.id, event.currentTarget)}
        aria-expanded={isPanel(object.id) ? panel === object.id : undefined} aria-haspopup={isPanel(object.id) ? "dialog" : undefined} aria-controls={panel === object.id ? panelId : undefined}>
        {object.name}<span aria-hidden="true">↗</span>
      </button>)}
    </nav>
    {panel && <WorkshopPanel key={panel} panel={panel} id={panelId} onClose={closePanel} onExperience={onOpenExperience} printer={printer} onPawnVision={() => onObjectClick("chess")}/>}
  </div>;
}
