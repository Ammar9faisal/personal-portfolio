"use client";
import { useEffect, useSyncExternalStore } from 'react';
import type { PrinterStore } from './printerStore';

export function usePrinter(suspended: boolean, store: PrinterStore) {
  useEffect(() => store.connect(), [store]);
  useEffect(() => store.suspend(suspended), [store, suspended]);
  return store;
}
export function usePrintSnapshot(store: PrinterStore) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
export function printStatus(snapshot: ReturnType<PrinterStore['getSnapshot']>) {
  if (snapshot.reducedMotion) return 'Reduced motion · manual layers';
  if (snapshot.paused) return 'Paused';
  if (snapshot.suspended || snapshot.hidden) return 'Scene paused';
  return snapshot.frame.phase === 'complete' ? 'Print complete' : snapshot.frame.phase === 'resetting' ? 'Preparing next print' : 'Printing';
}
