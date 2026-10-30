'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TimeFilterState, DEFAULT_TIME_FILTER, itemMatchesTimeFilter } from '@/types/timeFilter';

interface TimeFilterContextType {
  timeFilter: TimeFilterState;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>>;
  resetTimeFilter: () => void;
  isTimeModalOpen: boolean;
  setIsTimeModalOpen: (open: boolean) => void;
  filterProjectsByTime: <T = any>(items: T[], dateField?: string) => T[];
}

const STORAGE_KEY = 'ku_time_filter';

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFilter, setTimeFilterState] = useState<TimeFilterState>(DEFAULT_TIME_FILTER);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // โหลดจาก localStorage แล้ว merge กับ default
  // (ค่าที่บันทึกไว้จากเวอร์ชันเก่าจะไม่มี field ใหม่ เช่น manualType)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTimeFilterState({ ...DEFAULT_TIME_FILTER, ...JSON.parse(saved) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>> = useCallback((value) => {
    setTimeFilterState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

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