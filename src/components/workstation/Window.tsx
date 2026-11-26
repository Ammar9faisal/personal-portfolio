"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import { Maximize2, Minus, Minimize2, X } from "lucide-react";
import { applications, type AppId } from "./apps";
import styles from "./Workstation.module.css";

export type WindowEntry = { id: AppId; minimized: boolean };
export type Area = { width: number; height: number };
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, Math.max(0, max)));

export default function Window({ entry, area, index, active, focusRequest, onFocus, onClose, onMinimize, children }: {
  entry: WindowEntry; area: Area; index: number; active: boolean; focusRequest: number;
  onFocus: () => void; onClose: () => void; onMinimize: () => void; children: ReactNode;
}) {
  const app = applications.find(app => app.id === entry.id)!;
  const Icon = app.icon;
  const [position, setPosition] = useState({ x: 270 + index * 20, y: 26 + index * 20 });
  const [maximized, setMaximized] = useState(false);
  const title = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const mobile = area.width <= 700;
  const width = mobile || maximized ? area.width : Math.min(940, Math.max(560, area.width - 290), area.width - 24);
  const height = mobile || maximized ? area.height : Math.min(690, area.height - 36);
  const x = mobile || maximized ? 0 : clamp(position.x, area.width - width);
  const y = mobile || maximized ? 0 : clamp(position.y, area.height - height);

  useEffect(() => {
    if (focusRequest && !entry.minimized) title.current?.focus({ preventScroll: true });
  }, [focusRequest, entry.minimized]);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || mobile || maximized) return;
    drag.current = { x: event.clientX, y: event.clientY, left: x, top: y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return <section className={`${styles.window} ${active ? styles.activeWindow : ""}`} hidden={entry.minimized}
    aria-label={`${app.label} application`} inert={mobile && !active} onPointerDownCapture={onFocus} onFocusCapture={onFocus}
    style={{ left: x, top: y, width: Math.max(0, width), height: Math.max(0, height), zIndex: index + 1 }}>
    <header className={styles.windowHeader}>
      <button className={styles.windowTitle} ref={title} onPointerDown={startDrag}
        onPointerMove={event => {
          if (drag.current) setPosition({ x: clamp(drag.current.left + event.clientX - drag.current.x, area.width - width), y: clamp(drag.current.top + event.clientY - drag.current.y, area.height - height) });
        }} onPointerUp={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={event => {
          const moves: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] };
          if (moves[event.key] && !mobile && !maximized) {
            event.preventDefault(); const [dx, dy] = moves[event.key];
            setPosition({ x: clamp(x + dx, area.width - width), y: clamp(y + dy, area.height - height) });
          }
        }} aria-label={`${app.label} window. Drag or use arrow keys to move`}>
        <Icon size={17}/><span>{app.label}</span><small>AMMAROS</small>
      </button>
      <div className={styles.windowControls}>
        <button onClick={onMinimize} aria-label={`Minimize ${app.label}`}><Minus size={16}/></button>
        <button className={styles.maximize} onClick={() => setMaximized(value => !value)} aria-label={`${maximized ? "Restore" : "Maximize"} ${app.label}`}>
          {maximized ? <Minimize2 size={14}/> : <Maximize2 size={14}/>}
        </button>
        <button onClick={onClose} aria-label={`Close ${app.label}`}><X size={17}/></button>
      </div>
    </header>
    <div className={styles.windowBody}>{children}</div>
  </section>;
}
