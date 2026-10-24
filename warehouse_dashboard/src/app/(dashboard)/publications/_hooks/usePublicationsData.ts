'use client';

import { useState, useEffect, useMemo } from 'react';
import pubData from '@/data/publications.json';
import { getCachedCategoryData, saveCategoryRecord, deleteCategoryRecord } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

export interface PublicationItem {
  id?: string;
  _id?: string;
  name?: string;
  owner?: string;
  department?: string;
  type?: string;
  level?: string;
  budget?: number;
  month?: string;
  month_year?: string;
  fiscal_year_be?: number;
  date?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  page_start?: string;
  page_end?: string;
  remarks?: string;
  co_authors_foreign?: string[];
  co_authors_domestic?: string[];
  [key: string]: any;
}

export function usePublicationsData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [fiscalYearFilter, setFiscalYearFilter] = useState('all');
  const [dataList, setDataList] = useState<PublicationItem[]>(() => {
    return (getCachedCategoryData('publications') as PublicationItem[]) || (pubData as PublicationItem[]);
  });

  // Fetch real data from server API
  const refreshData = async () => {
    try {
      const res = await fetch('/api/data/publications');
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.data)) {
        setDataList(json.data);
      }
    } catch (e) {
      console.error('[usePublicationsData] Fetch error:', e);
    }
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => {
      refreshData();
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
      // 1. Level filter
      if (levelFilter !== 'all') {
        const lvl = String(item.level || '').toUpperCase();
        if (!lvl.includes(levelFilter.toUpperCase())) return false;
      }
      // 2. Fiscal year filter
      if (fiscalYearFilter !== 'all') {
        const fy = item.fiscal_year_be ? String(item.fiscal_year_be) : '';
        if (fy !== fiscalYearFilter) return false;
      }
      // 3. Search term (title / name)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const o = String(item.owner || '').toLowerCase();
        const d = String(item.department || '').toLowerCase();
        if (!n.includes(q) && !o.includes(q) && !d.includes(q)) return false;
      }
      return true;
    });
  }, [validData, levelFilter, fiscalYearFilter, searchTerm]);

  // Available fiscal years
  const availableFiscalYears = useMemo(() => {
    const set = new Set<string>();
    dataList.forEach((d) => {
      if (d.fiscal_year_be) set.add(String(d.fiscal_year_be));
    });
    return Array.from(set).sort().reverse();
  }, [dataList]);

  // CRUD handlers
  const savePublication = async (record: Record<string, any>, isNew: boolean) => {
    const res = await saveCategoryRecord('publications', record, isNew);
    if (res.success) {
      await refreshData();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ku_data_updated'));
      }
    }
    return res;
  };

  const deletePublication = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const ok = await deleteCategoryRecord('publications', id);
    if (ok) {
      await refreshData();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('ku_data_updated'));
      }
      return { success: true };
    }
    return { success: false, error: 'เกิดข้อผิดพลาดในการลบรายการ' };
  };

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
    fiscalYearFilter,
    setFiscalYearFilter,
    availableFiscalYears,
    savePublication,
    deletePublication,
    refreshData,
  };
}
