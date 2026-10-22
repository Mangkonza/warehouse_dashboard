'use client';

import { useState, useEffect, useMemo } from 'react';
import academicData from '@/data/academic.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface AcademicItem {
  id?: string;
  name?: string;
  head?: string;
  client?: string;
  budget?: number;
  month?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: any;
}

export function useAcademicData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState<AcademicItem[]>(() => {
    return (getCachedCategoryData('academic') as AcademicItem[]) || (academicData as AcademicItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('academic') as AcademicItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT')
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  const recentData = useMemo(() => validData.slice(-5).reverse(), [validData]);

  const totalBudgetAll = useMemo(() => {
    return validData.reduce((sum, item) => sum + (typeof item.budget === 'number' ? item.budget : 0), 0);
  }, [validData]);

  const uniqueHeads = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.head)
        .filter((h): h is string => Boolean(h && h !== 'nan' && h !== '-'))
    );
  }, [validData]);

  const uniqueClients = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.client)
        .filter((c): c is string => Boolean(c && c !== 'nan' && c !== '-'))
    );
  }, [validData]);

  const displayData = useMemo(() => {
    if (!searchTerm.trim()) return recentData;
    const q = searchTerm.toLowerCase();
    return validData.filter((item) => {
      const n = String(item.name || '').toLowerCase();
      const h = String(item.head || '').toLowerCase();
      const c = String(item.client || '').toLowerCase();
      return n.includes(q) || h.includes(q) || c.includes(q);
    });
  }, [recentData, validData, searchTerm]);

  return {
    validData,
    displayData,
    totalBudgetAll,
    uniqueHeads,
    uniqueClients,
    searchTerm,
    setSearchTerm,
  };
}
