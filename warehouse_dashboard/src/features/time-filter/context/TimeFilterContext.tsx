'use client';

import React, { createContext, useContext, useState } from 'react';
import { TimeFilterState } from '@/types/timeFilter';
import {
  useDashboardTabFilter,
  tabFilterManager,
  DEFAULT_TAB_FILTER,
  TabFilterManager,
  TabFilterState,
  getTabKeyFromPathname,
  useSafePathname,
} from '@/hooks/useDashboardTabFilter';

export interface TimeFilterContextType {
  timeFilter: TimeFilterState;
  setTimeFilter: React.Dispatch<React.SetStateAction<TimeFilterState>>;
  resetTimeFilter: () => void;
  isTimeModalOpen: boolean;
  setIsTimeModalOpen: (open: boolean) => void;
  filterProjectsByTime: <T = any>(items: T[], category?: string) => T[];
  tabKey?: string;
  tabFilter?: TabFilterState;
  setTabFilter?: (next: Partial<TabFilterState> | ((prev: TabFilterState) => Partial<TabFilterState>)) => void;
  resetTabFilter?: () => void;
  activeFilterCount?: number;
}

interface ModalContextType {
  isTimeModalOpen: boolean;
  setIsTimeModalOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType>({
  isTimeModalOpen: false,
  setIsTimeModalOpen: () => {},
});

export const TimeFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isTimeModalOpen, setIsTimeModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useTimeFilter = (explicitTabKey?: string): TimeFilterContextType => {
  const modalContext = useContext(ModalContext);
  const tabFilterHook = useDashboardTabFilter(explicitTabKey);

  return {
    timeFilter: tabFilterHook.timeFilter,
    setTimeFilter: tabFilterHook.setTimeFilter,
    resetTimeFilter: tabFilterHook.resetTimeFilter,
    isTimeModalOpen: modalContext?.isTimeModalOpen ?? false,
    setIsTimeModalOpen: modalContext?.setIsTimeModalOpen ?? (() => {}),
    filterProjectsByTime: tabFilterHook.filterProjectsByTime,
    tabKey: tabFilterHook.tabKey,
    tabFilter: tabFilterHook.tabFilter,
    setTabFilter: tabFilterHook.setTabFilter,
    resetTabFilter: tabFilterHook.resetTabFilter,
    activeFilterCount: tabFilterHook.activeFilterCount,
  };
};

export {
  useDashboardTabFilter,
  tabFilterManager,
  DEFAULT_TAB_FILTER,
  TabFilterManager,
  getTabKeyFromPathname,
  useSafePathname,
};
export type { TabFilterState };