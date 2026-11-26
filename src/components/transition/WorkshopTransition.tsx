"use client";
import { useLayoutEffect, useRef, type RefObject } from 'react';
import { monitorCamera } from './geometry';
import styles from './WorkshopTransition.module.css';

export default function WorkshopTransition({ direction, label, room, scroll, onComplete }: {
  direction: 'enter' | 'exit'; label: string; room: RefObject<HTMLDivElement | null>;
  scroll: { x: number; y: number }; onComplete: () => void;
}) {
  const veil = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const message = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const finish = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    let live = true, settled = false;
    const animations: Animation[] = [];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const viewport = room.current?.querySelector<HTMLElement>('[data-workshop-viewport]');
    const screen = room.current?.querySelector<HTMLElement>('[data-monitor-screen]');
    const roomNode = room.current;
    const oldRoomStyle = roomNode?.style.cssText;
    const os = document.querySelector<HTMLElement>('[data-os-host]');
    const oldStyle = viewport?.style.cssText;
    const oldOsStyle = os?.style.cssText;
    const done = () => { if (live && !settled) { settled = true; onComplete(); } };
    finish.current = done;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); done(); } };
    window.addEventListener('keydown', key);
    window.addEventListener('resize', done);
    window.visualViewport?.addEventListener('resize', done);
    media.addEventListener('change', done);
    skip.current?.focus({ preventScroll: true });
    if (direction === 'exit') window.scrollTo(scroll.x, scroll.y);

    const play = async (element: HTMLElement | null | undefined, frames: Keyframe[], duration: number, easing = 'ease') => {
      if (!element || !live || settled) return;
      const animation = element.animate(frames, { duration, easing, fill: 'both' });
      animations.push(animation);
      await animation.finished.catch(() => {});
    };
    const run = async () => {
      if (!viewport || !screen || !viewport.animate) { done(); return; }
      if (media.matches) {
        if (direction === 'exit') { if (os) os.style.zIndex = '60'; if (veil.current) veil.current.style.opacity = '0'; }
        await play(direction === 'exit' ? os : veil.current, [{ opacity: direction === 'exit' ? 1 : 0 }, { opacity: direction === 'exit' ? 0 : 1 }], 120);
        done(); return;
      }
      const image = viewport.querySelector('img');
      if (image && !image.complete && image.decode) await image.decode().catch(() => {});
      if (!live || settled) return;
      if (image?.complete && !image.naturalWidth) { done(); return; }
      const rect = viewport.getBoundingClientRect();
      const camera = monitorCamera(rect, screen.getBoundingClientRect(), window.innerWidth, window.innerHeight);
      if (!camera) { done(); return; }
      // Contain the actual scene in a viewport-sized camera; never clone the art.
      if (roomNode) Object.assign(roomNode.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', overflow: 'hidden', contain: 'paint', zIndex: '40' });
      Object.assign(viewport.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: '0', zIndex: '40', transformOrigin: '0 0', willChange: 'transform' });
      if (direction === 'enter') {
        await play(viewport, [{ transform: 'translate3d(0,0,0) scale(1)' }, { transform: camera.transform }], 920, 'cubic-bezier(.55,.08,.22,1)');
        if (!live || settled) return;
        if (overlay.current) overlay.current.dataset.cameraPhase = 'crt-on';
        await play(veil.current, [{ opacity: 0 }, { opacity: 1 }], 85);
        if (!live || settled) return;
        await Promise.all([
          play(line.current, [{ opacity: 0, transform: 'scale(.01,.01)' }, { opacity: .35, transform: 'scale(1,.012)', offset: .35 }, { opacity: .12, transform: 'scale(1,1)', offset: .85 }, { opacity: 0, transform: 'scale(1,1)' }], 300),
          play(message.current, [{ opacity: 0 }, { opacity: 1 }], 240),
        ]);
      } else {
        viewport.style.transform = camera.transform;
        if (os) os.style.zIndex = '60';
        await play(os, [{ opacity: 1 }, { opacity: 0 }], 140);
        if (!live || settled) return;
        if (overlay.current) overlay.current.dataset.cameraPhase = 'zoom-out';
        await Promise.all([
          play(veil.current, [{ opacity: 1 }, { opacity: 0 }], 180),
          play(viewport, [{ transform: camera.transform }, { transform: 'translate3d(0,0,0) scale(1)' }], 850, 'cubic-bezier(.35,0,.2,1)'),
        ]);
      }
      done();
    };
    void run().catch(done);
    return () => {
      live = false;
      animations.forEach(animation => animation.cancel());
      if (viewport && oldStyle !== undefined) viewport.style.cssText = oldStyle;
      if (roomNode && oldRoomStyle !== undefined) roomNode.style.cssText = oldRoomStyle;
      if (os && oldOsStyle !== undefined) os.style.cssText = oldOsStyle;
      window.scrollTo(scroll.x, scroll.y);
      window.removeEventListener('keydown', key); window.removeEventListener('resize', done);
      window.visualViewport?.removeEventListener('resize', done); media.removeEventListener('change', done);
    };
  }, [direction, label, room, scroll, onComplete]);

  return <>
    <div ref={overlay} className={styles.overlay} data-transition-direction={direction} data-camera-phase={direction === 'enter' ? 'zoom-in' : 'crt-off'} data-origin-scroll-y={scroll.y} aria-label={direction === 'enter' ? 'Opening workstation' : 'Returning to workshop'}>
      <div ref={veil} className={styles.veil} style={{ opacity: direction === 'exit' ? 1 : 0 }}/>
      <div ref={line} className={styles.powerLine} aria-hidden="true"/>
      <div ref={message} className={styles.message}><strong>AMMAR / WORKSTATION</strong><p role="status">{direction === 'enter' ? `Opening ${label}…` : 'Returning to workshop…'}</p></div>
    </div>
    <button ref={skip} className={styles.skip} onClick={() => finish.current()}>{direction === 'enter' ? 'Skip animation' : 'Skip return animation'}</button>
  </>;
}
