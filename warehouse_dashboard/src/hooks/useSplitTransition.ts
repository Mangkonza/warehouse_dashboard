'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type SplitPhase = 'list' | 'opening' | 'split' | 'closing';

export function readCssDurationMs(varName: string, fallbackMs: number): number {
  if (typeof window === 'undefined') return fallbackMs;
  const rootEl = document.querySelector('.imp-root') || document.documentElement;
  const raw = window.getComputedStyle(rootEl).getPropertyValue(varName).trim();
  if (!raw) return fallbackMs;
  if (raw.endsWith('ms')) {
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? fallbackMs : parsed;
  }
  if (raw.endsWith('s')) {
    const parsed = parseFloat(raw) * 1000;
    return isNaN(parsed) ? fallbackMs : parsed;
  }
  const num = parseFloat(raw);
  return isNaN(num) ? fallbackMs : num;
}

/**
 * Shared state machine hook for 2-pane split transition:
 * list -> opening -> split -> closing -> list
 * Supports immediate direction reversal on rapid open/close toggles and reduced-motion.
 */
export function useSplitTransition(isDetailOpen: boolean): SplitPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<SplitPhase>(isDetailOpen ? 'split' : 'list');
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.clearTimeout(timerRef.current);

    if (reduced) {
      setPhase(isDetailOpen ? 'split' : 'list');
      return;
    }

    const ms = readCssDurationMs('--imp-dur-expand', 320);

    if (isDetailOpen) {
      setPhase((prev) => (prev === 'split' ? 'split' : 'opening'));
      timerRef.current = window.setTimeout(() => {
        setPhase('split');
      }, ms + 40);
    } else {
      setPhase((prev) => (prev === 'list' ? 'list' : 'closing'));
      timerRef.current = window.setTimeout(() => {
        setPhase('list');
      }, ms + 40);
    }

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [isDetailOpen, reduced]);

  return phase;
}
