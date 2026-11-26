// A decorative print simulation, independent of pawnVision and physical hardware.
export const printerSettings = { printMs: 18000, completeMs: 3500, resetMs: 1500, fps: 30, knightHeight: 64 } as const;
export type PrintControls = { paused: boolean; suspended: boolean; reducedMotion: boolean };
export function advancePrintTime(elapsed: number, delta: number, controls: PrintControls) {
  return controls.paused || controls.suspended || controls.reducedMotion ? elapsed : elapsed + Math.max(0, delta);
}
export function printerFrame(elapsed: number, reducedMotion = false) {
  const cycleMs = printerSettings.printMs + printerSettings.completeMs + printerSettings.resetMs;
  const time = Math.max(0, elapsed) % cycleMs;
  const phase = time < printerSettings.printMs ? 'printing' : time < printerSettings.printMs + printerSettings.completeMs ? 'complete' : 'resetting';
  const fraction = Math.min(1, time / printerSettings.printMs);
  const ease = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
  const mix = (from: number, to: number, value: number) => from + (to - from) * value;
  const park = ease((time - printerSettings.printMs) / 750);
  const reset = ease((time - printerSettings.printMs - printerSettings.completeMs) / printerSettings.resetMs);
  const endBedY = 426 + Math.sin(printerSettings.printMs / 900) * 1.2;
  const bedY = reducedMotion ? 426 : phase === 'printing' ? 426 + Math.sin(time / 900) * 1.2 : phase === 'complete' ? mix(endBedY, 426, park) : 426;
  const height = Math.floor(printerSettings.knightHeight * fraction);
  const sweep = fraction < .16 ? 20 : fraction < .65 ? 12 : 10;
  return {
    phase, progress: fraction * 100, height, bedY,
    headX: reducedMotion ? 1434 : phase === 'printing' ? 1501 + Math.sin(time / 285) * sweep : phase === 'complete' ? mix(1501 + Math.sin(printerSettings.printMs / 285) * 10, 1434, park) : mix(1434, 1501, reset),
    headY: reducedMotion ? 324 : phase === 'printing' ? bedY - height - 19 : phase === 'complete' ? mix(endBedY - printerSettings.knightHeight - 19, 324, park) : mix(324, 407, reset),
    pieceOpacity: phase === 'resetting' ? 1 - (time - printerSettings.printMs - printerSettings.completeMs) / printerSettings.resetMs : 1,
    cycle: Math.floor(elapsed / cycleMs) + 1,
  };
}
