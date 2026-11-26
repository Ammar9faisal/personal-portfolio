"use client";
import { useId } from 'react';
import { sceneSettings } from './settings';
import type { PrinterStore } from './printerStore';
import { usePrintSnapshot } from './usePrinter';
import styles from './WorkshopScene.module.css';

export default function PrinterLayer({ store }: { store: PrinterStore }) {
  const { frame, elapsed } = usePrintSnapshot(store);
  const id = useId().replace(/:/g, '');
  const { bedY, height, headX, headY } = frame;
  return <svg className={styles.printerLayer} viewBox={`0 0 ${sceneSettings.width} ${sceneSettings.height}`} aria-hidden="true" focusable="false" data-print-elapsed={elapsed.toFixed(1)} data-print-phase={frame.phase}>
    <defs>
      {/* Only the chamber is replaced. Original enclosure, feet and surround stay untouched. */}
      <clipPath id={`${id}-chamber`}><path d="M1402 291H1565V439L1402 435Z"/></clipPath>
      <clipPath id={`${id}-layers`}><rect x="1474" y={bedY - height} width="60" height={height}/></clipPath>
      <linearGradient id={`${id}-interior`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#131615"/><stop offset=".6" stopColor="#29201a"/><stop offset="1" stopColor="#38271b"/></linearGradient>
      <linearGradient id={`${id}-warmth`}><stop stopColor="#664425" stopOpacity=".1"/><stop offset="1" stopColor="#b17835" stopOpacity=".18"/></linearGradient>
    </defs>
    <g clipPath={`url(#${id}-chamber)`} shapeRendering="crispEdges">
      <path d="M1402 291H1565V441H1402Z" fill={`url(#${id}-interior)`}/>
      <path d="M1419 294H1565V428H1419Z" fill={`url(#${id}-warmth)`}/>
      <path d="M1403 292H1412V435H1403Z M1556 292H1565V439H1556Z" fill="#151713"/>
      <path d="M1411 293H1415V428H1411Z M1550 293H1554V433H1550Z" fill="#65513a"/>
      <path d="M1413 294H1415V427H1413Z M1552 294H1554V432H1552Z" fill="#b08c50" opacity=".5"/>
      <path d="M1404 303H1564V308H1404Z" fill="#251d16"/><path d="M1408 306H1559V309H1408Z" fill="#dda54a"/>
      <path d="M1419 314H1548" stroke="#805e32" strokeWidth="2" opacity=".45"/>
      {/* Bed and revealed part use the same bed position, so they never slide apart. */}
      <path d={`M1405 ${bedY-5}L1558 ${bedY-3}L1564 ${bedY+2}L1410 ${bedY+4}Z`} fill="#555044"/>
      <path d={`M1410 ${bedY+4}L1564 ${bedY+2}V${bedY+8}L1410 ${bedY+10}Z`} fill="#242522"/>
      <path d={`M1411 ${bedY+4}L1559 ${bedY+2}`} stroke="#c69450" strokeWidth="2"/>
      <g clipPath={`url(#${id}-layers)`} opacity={frame.pieceOpacity}>
        <g transform={`translate(1479 ${bedY-64})`}>
          <path d="M2 64V58H6V53H13V47H17V37L11 34L7 37L2 33L5 26L12 20L17 10L23 7V1L28 4L31 0L34 12L40 18L43 29L39 36L34 40V48H39V53H43V58H47V64Z" fill="#6b441e"/>
          <path d="M5 61V58H9V54H17V47H21V35L14 29L9 33L6 31L10 26L17 21L21 12L26 10V6L29 9L31 5L32 15L37 20L40 29L36 35L31 39V48H36V54H40V58H44V61Z" fill="#d7a34c"/>
          <path d="M8 58H40V61H8Z M12 53H36V56H12Z M22 34H26V48H22Z M22 15L27 11L31 16L25 22H20Z" fill="#f1cb75"/>
          <path d="M28 20H31V23H28Z M33 29H38V32H33Z M18 24L25 28L21 32L15 28Z" fill="#7e5224"/>
          <path d="M10 59H41 M15 55H36 M22 44H31 M23 41H31 M23 38H31 M30 33H36" stroke="#ae7730" strokeWidth="1" opacity=".6"/>
        </g>
      </g>
      {/* Reconstructed carriage follows each layer; no baked-in head remains behind it. */}
      <g transform={`translate(0 ${headY})`}>
        <path d="M1410 0H1555V4H1410Z" fill="#1a1c18"/><path d="M1414 1H1552V3H1414Z" fill="#8f6e3c"/>
      </g>
      <g transform={`translate(${headX-13} ${headY-1})`}>
        <path d="M0 0H26V18H0Z" fill="#111714"/><path d="M3 2H22V14H3Z" fill="#3b3c30"/>
        <path d="M5 4H15V11H5Z" fill="#242921"/><path d="M19 4H22V12H19Z" fill="#77633e"/>
        <path d="M10 18H17L15 21H12Z" fill="#d2a454"/><path d="M4 14H8V17H4Z" fill="#bd8436"/>
      </g>
    </g>
  </svg>;
}
export function PrinterBadge({ store }: { store: PrinterStore }) {
  const snapshot = usePrintSnapshot(store);
  const label = snapshot.reducedMotion ? 'Manual layers' : snapshot.paused || snapshot.suspended || snapshot.hidden ? 'Paused' : snapshot.frame.phase === 'complete' ? 'Complete' : snapshot.frame.phase === 'resetting' ? 'Resetting' : 'Printing';
  return <span className={styles.printerBadge} aria-hidden="true">{label} · {Math.floor(snapshot.frame.progress)}%</span>;
}
