"use client";
import { useEffect, useRef, useState } from "react";
import { sceneSettings } from "./settings";

export function useRainAudio(inactive: boolean) {
  const audio = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; const context = audio.current; audio.current = null; void context?.close().catch(() => {}); };
  }, []);

  useEffect(() => {
    const context = audio.current;
    if (!context || context.state === "closed") return;
    const operation = enabled && !inactive ? context.resume() : context.suspend();
    void operation.catch(() => { if (mounted.current) { setEnabled(false); setError("Rain audio is unavailable in this browser."); } });
  }, [enabled, inactive]);

  async function toggle() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      if (enabled) { await audio.current?.suspend(); if (mounted.current) setEnabled(false); return; }
      // Created only inside this explicit user action; nothing autoplays on mount.
      if (!audio.current) {
        const context = new AudioContext();
        audio.current = context;
        const buffer = context.createBuffer(1, context.sampleRate * sceneSettings.audioBufferSeconds, context.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
        const source = context.createBufferSource(); source.buffer = buffer; source.loop = true;
        const lowpass = context.createBiquadFilter(); lowpass.type = "lowpass"; lowpass.frequency.value = 1400;
        const highpass = context.createBiquadFilter(); highpass.type = "highpass"; highpass.frequency.value = 160;
        const gain = context.createGain(); gain.gain.value = sceneSettings.audioGain;
        source.connect(lowpass).connect(highpass).connect(gain).connect(context.destination);
        source.start();
      }
      await audio.current.resume();
      if (mounted.current) setEnabled(true);
    } catch {
      const context = audio.current; audio.current = null; void context?.close().catch(() => {});
      if (mounted.current) { setEnabled(false); setError("Rain audio is unavailable in this browser."); }
    } finally { if (mounted.current) setBusy(false); }
  }
  return { enabled, busy, error, toggle };
}
