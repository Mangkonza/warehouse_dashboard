'use client';

import { useState, useEffect, useMemo } from 'react';
import pubData from '@/data/publications.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface PublicationItem {
  id?: string;
  name?: string;
  owner?: string;
  department?: string;
  type?: string;
  level?: string;
  budget?: number;
  month?: string;
  date?: string;
  [key: string]: any;
}

export function usePublicationsData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [dataList, setDataList] = useState<PublicationItem[]>(() => {
    return (getCachedCategoryData('publications') as PublicationItem[]) || (pubData as PublicationItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('publications') as PublicationItem[];
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

  const q1Count = useMemo(() => {
    return validData.filter((d) => String(d.level || '').toUpperCase().includes('Q1')).length;
  }, [validData]);

  const q2Count = useMemo(() => {
    return validData.filter((d) => String(d.level || '').toUpperCase().includes('Q2')).length;
  }, [validData]);

  const tciCount = useMemo(() => {
    return validData.filter((d) => String(d.level || '').toUpperCase().includes('TCI')).length;
  }, [validData]);

  const otherCount = useMemo(() => {
    return Math.max(0, validData.length - q1Count - q2Count - tciCount);
  }, [validData, q1Count, q2Count, tciCount]);

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      if (levelFilter !== 'all') {
        const lvl = String(item.level || '').toUpperCase();
        if (!lvl.includes(levelFilter.toUpperCase())) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const o = String(item.owner || '').toLowerCase();
        const d = String(item.department || '').toLowerCase();
        if (!n.includes(q) && !o.includes(q) && !d.includes(q)) return false;
      }
      return true;
    });
  }, [validData, levelFilter, searchTerm]);

  return {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
  };
}
