"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { sceneSettings } from "./settings";

export function useRainAudio(inactive: boolean) {
  const element = useRef<HTMLAudioElement>(null);
  const desired = useRef(false);
  const active = useRef(!inactive);
  const generation = useRef(0);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sync = useCallback(() => {
    const audio = element.current;
    const request = ++generation.current;
    if (!audio) return;
    if (!desired.current || !active.current) {
      audio.pause(); setBusy(false); return;
    }
    audio.volume = sceneSettings.audioVolume;
    setBusy(true);
    // First playback is called directly by the explicit Enable action.
    // A suspended recording resumes at its previous playback position.
    void audio.play().then(() => {
      if (generation.current === request) setBusy(false);
    }).catch(() => {
      if (generation.current !== request) return; // Intentional pause/unmount.
      desired.current = false;
      audio.pause();
      setEnabled(false); setBusy(false);
      setError("Rain audio could not play. Try enabling it again.");
    });
  }, []);

  useEffect(() => {
    const audio = element.current;
    if (audio) audio.src = sceneSettings.audioSrc;
    return () => {
      generation.current++;
      if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    };
  }, []);
  useEffect(() => { active.current = !inactive; sync(); }, [inactive, sync]);

  function toggle() {
    if (busy) return;
    desired.current = !desired.current;
    setEnabled(desired.current); setError("");
    sync();
  }
  return { element, enabled, busy, error, toggle };
}
