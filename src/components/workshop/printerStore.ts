import { advancePrintTime, printerFrame, printerSettings, type PrintControls } from './printerSimulation';

export function createPrinterStore() {
  let elapsed = 0;
  let controls: PrintControls = { paused: false, suspended: false, reducedMotion: false };
  let hidden = false, connected = false;
  let animation: number | null = null, previous: number | null = null, accumulated = 0;
  const listeners = new Set<() => void>();
  const snapshot = () => ({ elapsed, ...controls, hidden, frame: printerFrame(elapsed, controls.reducedMotion) });
  let current = snapshot();
  const running = () => connected && !controls.paused && !controls.suspended && !controls.reducedMotion && !hidden;
  function emit() { current = snapshot(); listeners.forEach(listener => listener()); }
  function stop() { if (animation !== null) cancelAnimationFrame(animation); animation = null; previous = null; accumulated = 0; }
  function schedule() { if (running() && animation === null) animation = requestAnimationFrame(tick); else if (!running()) stop(); }
  function tick(time: number) {
    animation = null;
    if (!running()) return;
    if (previous !== null) accumulated += time - previous;
    previous = time;
    if (accumulated >= 1000 / printerSettings.fps) {
      elapsed = advancePrintTime(elapsed, accumulated, controls); accumulated = 0; emit();
    }
    schedule();
  }
  function update(next: Partial<PrintControls>) { controls = { ...controls, ...next }; emit(); schedule(); }
  return {
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    getSnapshot: () => current,
    pause: () => update({ paused: true }),
    resume: () => update({ paused: false }),
    suspend: (value: boolean) => update({ suspended: value }),
    step: () => { elapsed += printerSettings.printMs / 10; emit(); },
    connect() {
      connected = true;
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const motion = () => update({ reducedMotion: media.matches });
      const visibility = () => { hidden = document.hidden; emit(); schedule(); };
      motion(); visibility();
      media.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility);
      return () => { connected = false; stop(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
    },
  };
}
export type PrinterStore = ReturnType<typeof createPrinterStore>;
