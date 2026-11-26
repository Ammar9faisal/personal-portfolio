"use client";
import { useEffect, useRef } from "react";
import { experience } from "@/data/portfolio";
import { workshopDialogue } from "@/data/workshop";
import type { PanelId } from "./settings";
import ChessPreview from "./ChessPreview";
import PrinterControls from "./PrinterControls";
import type { PrinterStore } from "./printerStore";
import styles from "./WorkshopScene.module.css";

export default function WorkshopPanel({ panel, id, onClose, onExperience, onPawnVision, printer }: {
  panel: PanelId; id: string; onClose: () => void; onExperience: () => void; onPawnVision: () => void; printer: PrinterStore;
}) {
  const close = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const copy = workshopDialogue[panel];
  useEffect(() => {
    close.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 850px)").matches) root.current?.scrollIntoView({ block: "nearest" });
  }, [panel]);
  return <aside ref={root} data-camera-ui className={styles.panel} data-panel={panel} id={id} role="dialog" aria-modal="false" aria-labelledby={`${id}-title`}>
    <header><span className={styles.panelEyebrow}>WORKSHOP / {panel === "chess" ? "CHESSBOARD" : panel.toUpperCase()}</span><button ref={close} className={styles.close} onClick={onClose} aria-label="Close workshop panel">×</button><h2 id={`${id}-title`}>{copy.title}</h2></header>
    {panel === "robot" && <>
      <p className={styles.greeting}>{workshopDialogue.robot.greeting}</p><p>{copy.body}</p>
      <ul className={styles.robotExperience}>{experience.filter(item => item.organization.startsWith("FIRST") || item.organization.startsWith("K2i")).map(item => <li key={item.organization}><strong>{item.role}</strong><span>{item.organization}</span></li>)}</ul>
      <button className={styles.panelAction} onClick={onExperience}>{workshopDialogue.robot.action}</button>
    </>}
    {panel === "printer" && <>
      <p>{copy.body}</p><PrinterControls store={printer} onInspect={onPawnVision}/>

    </>}
    {panel === "chess" && <>
      <p>{copy.body}</p><ChessPreview/><p className={styles.panelNote}>{workshopDialogue.chess.note}</p>
      <button className={styles.panelAction} onClick={onPawnVision}>View pawnVision · In Development</button>
    </>}
    <small className={styles.escapeHint}>Esc to close</small>
  </aside>;
}
