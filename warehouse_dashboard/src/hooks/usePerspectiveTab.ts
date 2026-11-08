'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Pure helper to resolve the active tab from URL search and fallback to defaultTab.
 * When navigating without an explicit tab parameter in the URL, it always returns defaultTab (เมนูแรกก่อนเสมอ).
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
 * Hook to manage perspective/sub-tab state.
 * Always lands on the default tab (เมนูแรกก่อนเสมอ) when navigating from the menu or sidebar.
 * Only switches tabs when the user explicitly clicks a tab or provides an explicit ?tab= query parameter.
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
    return resolvePerspectiveTab(window.location.search, null, validTabs, defaultTab, paramKey);
  }, [defaultTab, paramKey, validTabs]);

  const [activeTab, setActiveTabState] = useState<T>(defaultTab);

  // Synchronize on mount from URL
  useEffect(() => {
    const initial = resolve();
    if (initial !== activeTab) {
      setActiveTabState(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = useCallback(
    (nextTab: T) => {
      setActiveTabState(nextTab);
      if (typeof window !== 'undefined') {
        try {
          const nextPath = createTabUrl(window.location.href, paramKey, nextTab);
          window.history.replaceState(window.history.state, '', nextPath);
        } catch (e) {
          console.warn(`[usePerspectiveTab] Error updating tab for ${pageKey}:`, e);
        }
      }
    },
    [pageKey, paramKey]
  );

  // Listen to menu navigation reset event (e.g. clicking sidebar menu items)
  useEffect(() => {
    const handleNavReset = (e: Event) => {
      const customEvent = e as CustomEvent<{ path?: string }>;
      const targetPath = customEvent.detail?.path;
      // If clicking this page's route (or while on this page), reset to defaultTab (เมนูแรก)
      if (
        !targetPath ||
        window.location.pathname === targetPath ||
        window.location.pathname.startsWith(`${targetPath}/`) ||
        targetPath.startsWith(window.location.pathname)
      ) {
        setActiveTabState(defaultTab);
        try {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete(paramKey);
          currentUrl.searchParams.delete('tab');
          currentUrl.searchParams.delete('perspective');
          window.history.replaceState(window.history.state, '', currentUrl.pathname);
          sessionStorage.removeItem(storageKey);
        } catch {}
      }
    };

    window.addEventListener('ku:perspective-tab-reset', handleNavReset);
    return () => window.removeEventListener('ku:perspective-tab-reset', handleNavReset);
  }, [defaultTab, paramKey, storageKey]);

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
