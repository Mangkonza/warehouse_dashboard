'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { TimeFilterState, DEFAULT_TIME_FILTER, itemMatchesTimeFilter } from '@/types/timeFilter';

interface TimeFilterContextType {
  timeFilter: TimeFilterState;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>>;
  resetTimeFilter: () => void;
  isTimeModalOpen: boolean;
  setIsTimeModalOpen: (open: boolean) => void;
  filterProjectsByTime: <T = any>(items: T[], dateField?: string) => T[];
}

const STORAGE_KEY = 'ku_time_filter_by_tab_v2';

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '/overview';
  const tabKey = pathname.split('?')[0] || '/overview';

  const [filtersByTab, setFiltersByTab] = useState<Record<string, TimeFilterState>>({});
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // โหลดสถานะตัวกรองแยกตามแต่ละแท็บจาก localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedMap = JSON.parse(saved) as Record<string, Partial<TimeFilterState>>;
        if (parsedMap && typeof parsedMap === 'object') {
          const restored: Record<string, TimeFilterState> = {};
          for (const [k, v] of Object.entries(parsedMap)) {
            if (v && typeof v === 'object') {
              restored[k] = { ...DEFAULT_TIME_FILTER, ...v };
            }
          }
          setFiltersByTab(restored);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const timeFilter: TimeFilterState = filtersByTab[tabKey] ?? DEFAULT_TIME_FILTER;

  const setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>> = useCallback(
    (value) => {
      setFiltersByTab((prev) => {
        const currentTabFilter = prev[tabKey] ?? DEFAULT_TIME_FILTER;
        const nextTabFilter = typeof value === 'function' ? value(currentTabFilter) : value;
        const nextMap = {
          ...prev,
          [tabKey]: nextTabFilter,
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
        } catch {
          // ignore storage errors
        }
        return nextMap;
      });
    },
    [tabKey]
  );

  const resetTimeFilter = useCallback(() => {
    setTimeFilter(DEFAULT_TIME_FILTER);
  }, [setTimeFilter]);

  const filterProjectsByTime = useCallback(
    <T = any,>(items: T[], _dateField?: string): T[] => {
      if (!Array.isArray(items)) return [];
      if (timeFilter.mode === 'all') return items;
      return items.filter((item) => itemMatchesTimeFilter(item, timeFilter));
    },
    [timeFilter]
  );

  return (
    <TimeFilterContext.Provider
      value={{
        timeFilter,
        setTimeFilter,
        resetTimeFilter,
        isTimeModalOpen,
        setIsTimeModalOpen,
        filterProjectsByTime,
      }}
    >
      {children}
    </TimeFilterContext.Provider>
  );
};

export const useTimeFilter = (): TimeFilterContextType => {
  const context = useContext(TimeFilterContext);
  if (!context) {
    throw new Error('useTimeFilter must be used within a TimeFilterProvider');
  }
  return context;
};