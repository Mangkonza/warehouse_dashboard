'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Pure helper to resolve the active tab from URL search and storage value.
 */
export function resolvePerspectiveTab<T extends string>(
  urlSearch: string | undefined,
  storageValue: string | null | undefined,
  validTabs: readonly T[] | T[],
  defaultTab: T,
  paramKey: string = 'tab'
): T {
  if (urlSearch) {
    try {
      const params = new URLSearchParams(urlSearch);
      const fromUrl = (params.get(paramKey) || params.get('tab') || params.get('perspective')) as T | null;
      if (fromUrl && validTabs.includes(fromUrl)) {
        return fromUrl;
      }
    } catch {
      // Fallback
    }
  }
  if (storageValue && validTabs.includes(storageValue as T)) {
    return storageValue as T;
  }
  return defaultTab;
}

/**
 * Pure helper to construct an updated URL with the active tab query param.
 */
export function createTabUrl(currentHref: string, paramKey: string, nextTab: string): string {
  try {
    const url = new URL(currentHref, 'http://localhost');
    url.searchParams.set(paramKey, nextTab);
    return url.pathname + url.search;
  } catch {
    return `?${paramKey}=${encodeURIComponent(nextTab)}`;
  }
}

/**
 * Hook to manage perspective/sub-tab state with URL query param and sessionStorage persistence.
 * Ensures that when users navigate away (e.g. to personnel portfolio) and come back,
 * the exact tab they were viewing is preserved and restored.
 */
export function usePerspectiveTab<T extends string>(
  pageKey: string,
  validTabs: readonly T[] | T[],
  defaultTab: T,
  paramKey: string = 'tab'
): [T, (tab: T) => void] {
  const storageKey = `ku_active_tab_${pageKey}`;

  const resolve = useCallback((): T => {
    if (typeof window === 'undefined') return defaultTab;
    const storageVal = (() => {
      try {
        return sessionStorage.getItem(storageKey);
      } catch {
        return null;
      }
    })();
    return resolvePerspectiveTab(window.location.search, storageVal, validTabs, defaultTab, paramKey);
  }, [defaultTab, paramKey, storageKey, validTabs]);

  const [activeTab, setActiveTabState] = useState<T>(defaultTab);

  // Synchronize on mount from URL / storage
  useEffect(() => {
    const initial = resolve();
    if (initial !== activeTab) {
      setActiveTabState(initial);
    }
    try {
      const currentUrl = new URL(window.location.href);
      if (currentUrl.searchParams.get(paramKey) !== initial) {
        currentUrl.searchParams.set(paramKey, initial);
        window.history.replaceState(window.history.state, '', currentUrl.pathname + currentUrl.search);
      }
      sessionStorage.setItem(storageKey, initial);
    } catch {
      // Ignore storage/URL errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = useCallback(
    (nextTab: T) => {
      setActiveTabState(nextTab);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(storageKey, nextTab);
          const nextPath = createTabUrl(window.location.href, paramKey, nextTab);
          window.history.replaceState(window.history.state, '', nextPath);
        } catch (e) {
          console.warn(`[usePerspectiveTab] Error updating tab for ${pageKey}:`, e);
        }
      }
    },
    [pageKey, paramKey, storageKey]
  );

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const current = resolve();
      setActiveTabState(current);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolve]);

  return [activeTab, setTab];
}
