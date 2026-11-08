'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Shared hook that returns true if the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
