'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimeFilterState, DEFAULT_TIME_FILTER } from '@/types/timeFilter';

interface TimeFilterContextType {
  timeFilter: TimeFilterState;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>>;
  resetTimeFilter: () => void;
  isTimeModalOpen: boolean;
  setIsTimeModalOpen: (open: boolean) => void;
}

const TimeFilterContext = createContext<TimeFilterContextType | undefined>(undefined);

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>(DEFAULT_TIME_FILTER);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ku_time_filter');
      if (saved) {
        setTimeFilter(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleSetTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>> = (value) => {
    setTimeFilter((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem('ku_time_filter', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const resetTimeFilter = () => {
    handleSetTimeFilter(DEFAULT_TIME_FILTER);
  };

  return (
    <TimeFilterContext.Provider
      value={{
        timeFilter,
        setTimeFilter: handleSetTimeFilter,
        resetTimeFilter,
        isTimeModalOpen,
        setIsTimeModalOpen,
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
