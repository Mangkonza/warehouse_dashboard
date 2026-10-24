'use client';

import { useState, useEffect, useMemo } from 'react';
import serviceData from '@/data/services.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface ServiceItem {
  id?: string;
  name?: string;
  person?: string;
  target_group?: string;
  department?: string;
  date?: string;
  [key: string]: any;
}

export function useServiceData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState<ServiceItem[]>(() => {
    return (getCachedCategoryData('service') as ServiceItem[]) || (serviceData as ServiceItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('service') as ServiceItem[];
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

  const uniquePersons = useMemo(() => {
    return new Set(
      validData.map((d) => d.person).filter((p): p is string => Boolean(p && p !== 'nan'))
    );
  }, [validData]);

  const uniqueTargets = useMemo(() => {
    return new Set(
      validData.map((d) => d.target_group).filter((t): t is string => Boolean(t && t !== 'nan'))
    );
  }, [validData]);

  const uniqueDepts = useMemo(() => {
    return new Set(
      validData.map((d) => d.department).filter((d): d is string => Boolean(d && d !== 'nan'))
    );
  }, [validData]);

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const p = String(item.person || '').toLowerCase();
        const t = String(item.target_group || '').toLowerCase();
        if (!n.includes(q) && !p.includes(q) && !t.includes(q)) return false;
      }
      return true;
    });
  }, [validData, searchTerm]);

  return {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
  };
}
