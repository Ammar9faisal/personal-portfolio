"use client";
import { useEffect, useState } from "react";
import { sceneSettings } from "./settings";

// One low-frequency timer chain. No render loop; stop entirely outside the scene.
export function useRobotIdle(suspended: boolean, computerGlance: boolean) {
  const [eyes, setEyes] = useState({ gaze: 0, blink: false });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const later = (callback: () => void, ms: number) => { timer = setTimeout(() => { if (!cancelled) callback(); }, ms); };
    const between = (range: readonly [number, number]) => range[0] + Math.random() * (range[1] - range[0]);
    const rest = () => {
      setEyes({ gaze: 0, blink: false });
      later(() => {
        if (Math.random() < .6) {
          setEyes({ gaze: Math.random() < .5 ? -1 : 1, blink: false });
          later(rest, between(sceneSettings.robot.lookMs));
        } else {
          setEyes({ gaze: 0, blink: true });
          later(() => {
            setEyes({ gaze: 0, blink: false });
            if (Math.random() < .18) later(() => {
              setEyes({ gaze: 0, blink: true });
              later(rest, sceneSettings.robot.blinkMs);
            }, 180);
            else rest();
          }, sceneSettings.robot.blinkMs);
        }
      }, between(sceneSettings.robot.pauseMs));
    };
    const start = () => {
      clearTimeout(timer);
      setEyes({ gaze: 0, blink: false });
      if (!suspended && !computerGlance && !media.matches) rest();
    };
    start();
    media.addEventListener("change", start);
    return () => { cancelled = true; clearTimeout(timer); media.removeEventListener("change", start); };
  }, [suspended, computerGlance]);
  return suspended ? { gaze: 0, blink: false } : computerGlance ? { gaze: -1, blink: false } : eyes;
}
