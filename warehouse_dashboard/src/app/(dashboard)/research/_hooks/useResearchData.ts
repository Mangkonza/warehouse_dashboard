'use client';

import { useState, useEffect, useMemo } from 'react';
import researchData from '@/data/research.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';

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
  const [selectedFund, setSelectedFund] = useState('all');
  const [dataList, setDataList] = useState<ResearchItem[]>(() => {
    return (getCachedCategoryData('research') as ResearchItem[]) || (researchData as ResearchItem[]);
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('research').then((fresh) => {
      if (isMounted && Array.isArray(fresh) && fresh.length > 0) {
        setDataList(fresh as ResearchItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('research') as ResearchItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  // Filter valid data & apply time filter (excluding test records in-memory)
  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  // Aggregate totals
  const { totalInternalBudget, totalExternalBudget, totalBudgetAll, megaProjectsCount } = useMemo(() => {
    let internalSum = 0;
    let externalSum = 0;
    let megaCount = 0;
    validData.forEach((item) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
      internalSum += internal;
      externalSum += external;
      if (internal + external >= 10000000) megaCount++;
    });
    return {
      totalInternalBudget: internalSum,
      totalExternalBudget: externalSum,
      totalBudgetAll: internalSum + externalSum,
      megaProjectsCount: megaCount,
    };
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
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }
      if (selectedFund !== 'all') {
        const f = String(item.fund_source || '').replace('\n', ' ').trim() || 'ไม่ระบุแหล่งทุน';
        if (f !== selectedFund && !f.includes(selectedFund)) {
          return false;
        }
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const id = String(item.id || '').toLowerCase();
        const f = String(item.fund_source || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !id.includes(q) && !f.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, selectedFund, searchTerm]);

  return {
    validData,
    filteredData,
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFund,
    setSelectedFund,
  };
}
