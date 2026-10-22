'use client';

import { useState, useEffect, useMemo } from 'react';
import researchData from '@/data/research.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface ResearchItem {
  id?: string;
  name?: string;
  head?: string;
  department?: string;
  budget_internal?: number;
  budget_external?: number;
  fund_source?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export function useResearchData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [dataList, setDataList] = useState<ResearchItem[]>(() => {
    return (getCachedCategoryData('research') as ResearchItem[]) || (researchData as ResearchItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('research') as ResearchItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  // Filter valid data & apply time filter
  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT')
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  // Aggregate totals
  const totalBudgetAll = useMemo(() => {
    return validData.reduce((sum, item) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
      return sum + internal + external;
    }, 0);
  }, [validData]);

  const uniqueDepts = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.department)
        .filter((d): d is string => Boolean(d && d !== 'nan' && d !== '-'))
    );
  }, [validData]);

  const uniqueFunds = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.fund_source)
        .filter((f): f is string => Boolean(f && f !== 'nan' && f !== '-'))
    );
  }, [validData]);

  // Filtered for table display
  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      if (selectedDept !== 'all') {
        const d = String(item.department || '');
        if (!d.includes(selectedDept)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const id = String(item.id || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !id.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, searchTerm]);

  return {
    validData,
    filteredData,
    totalBudgetAll,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
  };
}
