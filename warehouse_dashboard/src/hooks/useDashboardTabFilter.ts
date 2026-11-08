'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { TimeFilterState, DEFAULT_TIME_FILTER, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface TabFilterState {
  fiscalYear: string;
  department: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  customFilters: Record<string, any>;
}

export const DEFAULT_TAB_FILTER: TabFilterState = {
  fiscalYear: 'all',
  department: 'all',
  customFilters: {},
};

export class TabFilterManager {
  private stateStore = new Map<string, TabFilterState>();
  private listeners = new Map<string, Set<() => void>>();
  private allListeners = new Set<() => void>();

  getFilter(tabKey?: string | null): TabFilterState {
    if (!tabKey) return { ...DEFAULT_TAB_FILTER };
    if (this.stateStore.has(tabKey)) {
      return this.stateStore.get(tabKey)!;
    }

    const storageKey = `ku_tab_filter_${tabKey}`;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            const state: TabFilterState = {
              ...DEFAULT_TAB_FILTER,
              ...parsed,
              customFilters: {
                ...(DEFAULT_TAB_FILTER.customFilters || {}),
                ...(parsed?.customFilters || {}),
              },
            };
            this.stateStore.set(tabKey, state);
            return state;
          } catch {
            // Malformed JSON fallback
            const fallback = { ...DEFAULT_TAB_FILTER };
            this.stateStore.set(tabKey, fallback);
            return fallback;
          }
        }
      }
    } catch {
      // Storage access error fallback
    }

    const fallback = { ...DEFAULT_TAB_FILTER };
    this.stateStore.set(tabKey, fallback);
    return fallback;
  }

  setFilter(tabKey?: string | null, next: Partial<TabFilterState> = {}): void {
    if (!tabKey) return;
    const current = this.getFilter(tabKey);
    const updated: TabFilterState = {
      ...current,
      ...next,
      customFilters: {
        ...(current.customFilters || {}),
        ...(next?.customFilters || {}),
      },
    };

    this.stateStore.set(tabKey, updated);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`ku_tab_filter_${tabKey}`, JSON.stringify(updated));
      }
    } catch {
      // Ignore quota or private browsing storage errors
    }

    this.notify(tabKey);
  }

  resetFilter(tabKey?: string | null): void {
    if (!tabKey) return;
    const resetState: TabFilterState = { ...DEFAULT_TAB_FILTER };
    this.stateStore.set(tabKey, resetState);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(`ku_tab_filter_${tabKey}`);
      }
    } catch {
      // Ignore storage errors
    }

    this.notify(tabKey);
  }

  subscribe(tabKey: string, listener: () => void): () => void {
    if (!this.listeners.has(tabKey)) {
      this.listeners.set(tabKey, new Set());
    }
    this.listeners.get(tabKey)!.add(listener);
    return () => {
      this.listeners.get(tabKey)?.delete(listener);
    };
  }

  subscribeAll(listener: () => void): () => void {
    this.allListeners.add(listener);
    return () => {
      this.allListeners.delete(listener);
    };
  }

  private notify(tabKey: string): void {
    this.listeners.get(tabKey)?.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
    this.allListeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export const tabFilterManager = new TabFilterManager();

export function getTabKeyFromPathname(pathname?: string | null): string {
  if (!pathname) return 'overview';
  const clean = pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || 'overview';
  return clean;
}

export function useSafePathname(): string {
  try {
    return usePathname() || '/overview';
  } catch {
    return '/overview';
  }
}

export interface DashboardTabFilterResult {
  tabKey: string;
  tabFilter: TabFilterState;
  setTabFilter: (next: Partial<TabFilterState> | ((prev: TabFilterState) => Partial<TabFilterState>)) => void;
  resetTabFilter: () => void;
  activeFilterCount: number;
  timeFilter: TimeFilterState;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>>;
  resetTimeFilter: () => void;
  filterProjectsByTime: <T = any>(items: T[], dateField?: string) => T[];
}

export function useDashboardTabFilter(explicitTabKey?: string): DashboardTabFilterResult {
  const pathname = useSafePathname();
  const tabKey = explicitTabKey || getTabKeyFromPathname(pathname);

  const subscribe = useCallback((notify: () => void) => tabFilterManager.subscribe(tabKey, notify), [tabKey]);
  const getSnapshot = useCallback(() => tabFilterManager.getFilter(tabKey), [tabKey]);
  const getServerSnapshot = useCallback(() => DEFAULT_TAB_FILTER, []);

  const tabFilter = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTabFilter = useCallback(
    (next: Partial<TabFilterState> | ((prev: TabFilterState) => Partial<TabFilterState>)) => {
      const nextVal = typeof next === 'function' ? next(tabFilterManager.getFilter(tabKey)) : next;
      tabFilterManager.setFilter(tabKey, nextVal);
    },
    [tabKey]
  );

  const resetTabFilter = useCallback(() => {
    tabFilterManager.resetFilter(tabKey);
  }, [tabKey]);

  // Backward-compatible TimeFilter adapter
  const timeFilter: TimeFilterState = useMemo(() => {
    if (tabFilter.customFilters?.timeFilter) {
      return tabFilter.customFilters.timeFilter;
    }
    if (tabFilter.fiscalYear && tabFilter.fiscalYear !== 'all') {
      return {
        ...DEFAULT_TIME_FILTER,
        mode: 'fiscal',
        fiscalYear: tabFilter.fiscalYear,
        fiscalQuarter: 'all',
      };
    }
    if (tabFilter.dateFrom && tabFilter.dateTo) {
      return {
        ...DEFAULT_TIME_FILTER,
        mode: 'manual',
        manualType: 'range',
        manualStartDate: tabFilter.dateFrom,
        manualEndDate: tabFilter.dateTo,
      };
    }
    return DEFAULT_TIME_FILTER;
  }, [tabFilter]);

  const setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>> = useCallback(
    (val) => {
      const nextTime = typeof val === 'function' ? val(timeFilter) : val;
      const updates: Partial<TabFilterState> = {
        customFilters: {
          ...(tabFilter.customFilters || {}),
          timeFilter: nextTime,
        },
      };
      if (nextTime.mode === 'fiscal') {
        updates.fiscalYear = nextTime.fiscalYear;
        updates.dateFrom = undefined;
        updates.dateTo = undefined;
      } else if (nextTime.mode === 'all') {
        updates.fiscalYear = 'all';
        updates.dateFrom = undefined;
        updates.dateTo = undefined;
      } else if (nextTime.mode === 'manual' && nextTime.manualType === 'range') {
        updates.fiscalYear = 'all';
        updates.dateFrom = nextTime.manualStartDate;
        updates.dateTo = nextTime.manualEndDate;
      } else {
        updates.fiscalYear = 'all';
        updates.dateFrom = undefined;
        updates.dateTo = undefined;
      }
      tabFilterManager.setFilter(tabKey, updates);
    },
    [tabKey, timeFilter, tabFilter.customFilters]
  );

  const resetTimeFilter = useCallback(() => {
    setTimeFilter(DEFAULT_TIME_FILTER);
  }, [setTimeFilter]);

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (tabFilter.fiscalYear && tabFilter.fiscalYear !== 'all') count++;
    if (tabFilter.department && tabFilter.department !== 'all') count++;
    if (tabFilter.search && tabFilter.search.trim() !== '') count++;
    if (tabFilter.dateFrom || tabFilter.dateTo) count++;
    if (tabFilter.customFilters) {
      Object.entries(tabFilter.customFilters).forEach(([key, val]) => {
        if (key === 'timeFilter' || key === 'popoverFilters') return;
        if (
          val !== undefined &&
          val !== null &&
          val !== 'all' &&
          val !== '' &&
          val !== false &&
          !(Array.isArray(val) && val.length === 0)
        ) {
          count++;
        }
      });
      if (tabFilter.customFilters.popoverFilters) {
        const pf = tabFilter.customFilters.popoverFilters;
        if (pf.sdgs && pf.sdgs.length > 0) count++;
        if (pf.framework && pf.framework !== 'all') count++;
        if (pf.role) count++;
        if (pf.completeness && pf.completeness !== 'all') count++;
        if (pf.numericRanges) {
          Object.values(pf.numericRanges).forEach(([min, max]: any) => {
            if (min != null || max != null) count++;
          });
        }
      }
    }
    return count;
  }, [tabFilter]);

  const filterProjectsByTime = useCallback(
    <T = any,>(items: T[], category?: string): T[] => {
      if (!Array.isArray(items)) return [];
      if (timeFilter.mode === 'all') return items;
      return items.filter((item) => itemMatchesTimeFilter(item, timeFilter, category));
    },
    [timeFilter]
  );

  return {
    tabKey,
    tabFilter,
    setTabFilter,
    resetTabFilter,
    activeFilterCount,
    timeFilter,
    setTimeFilter,
    resetTimeFilter,
    filterProjectsByTime,
  };
}
