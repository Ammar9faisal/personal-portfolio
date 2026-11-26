"use client";
import { useRef } from 'react';
import type { PrinterStore } from './printerStore';
import { printStatus, usePrintSnapshot } from './usePrinter';
import styles from './WorkshopScene.module.css';

export default function PrinterControls({ store, onInspect }: { store: PrinterStore; onInspect: () => void }) {
  const snapshot = usePrintSnapshot(store);
  const progress = Math.floor(snapshot.frame.progress);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const resumeButton = useRef<HTMLButtonElement>(null);
  return <div className={styles.printControls} data-print-elapsed={snapshot.elapsed.toFixed(1)} data-print-progress={progress}>
    <p className={styles.printerStatus} role="status">{printStatus(snapshot)} · simulated cycle {snapshot.frame.cycle}</p>
    <div className={styles.printProgress}><progress max={100} value={progress} aria-label="Simulated print progress"/><output aria-label="Printing progress" aria-live="off">{progress}%</output></div>
    <div className={styles.printButtons}>
      <button ref={pauseButton} aria-label="Pause print" onClick={() => { store.pause(); requestAnimationFrame(() => resumeButton.current?.focus({ preventScroll: true })); }} disabled={snapshot.paused || snapshot.reducedMotion}>Pause</button>
      <button ref={resumeButton} aria-label="Resume print" onClick={() => { store.resume(); requestAnimationFrame(() => pauseButton.current?.focus({ preventScroll: true })); }} disabled={!snapshot.paused || snapshot.reducedMotion}>Resume</button>
    </div>
    {snapshot.reducedMotion && <><p className={styles.panelNote}>Motion is disabled by your preference. Step through static layers instead.</p><button className={styles.panelAction} onClick={store.step}>Advance one layer</button></>}
    {snapshot.suspended && <p className={styles.panelNote}>Scene motion is paused. Resume scene motion to continue the print.</p>}
    <button className={styles.panelAction} onClick={onInspect}>Inspect Print</button>
    <p className={styles.panelNote}>Opens pawnVision · In Development. This decorative print sequence is not a completed pawnVision feature.</p>
  </div>;
}
