'use client';

import { useState, useEffect, useMemo } from 'react';
import academicData from '@/data/academic.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';

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
  const [selectedClient, setSelectedClient] = useState('all');
  const [dataList, setDataList] = useState<AcademicItem[]>(() => {
    return (getCachedCategoryData('academic') as AcademicItem[]) || (academicData as AcademicItem[]);
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('academic').then((fresh) => {
      if (isMounted && Array.isArray(fresh) && fresh.length > 0) {
        setDataList(fresh as AcademicItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('academic') as AcademicItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  const {
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
  } = useMemo(() => {
    let budgetSum = 0;
    let facSum = 0;
    let depSum = 0;
    let kuSum = 0;
    let remSum = 0;

    validData.forEach((item) => {
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      budgetSum += b;
      const facP = item.percent_faculty !== undefined && item.percent_faculty !== null ? Number(item.percent_faculty) : 5;
      const depP = item.percent_dept !== undefined && item.percent_dept !== null ? Number(item.percent_dept) : 5;
      const kuP = item.percent_ku !== undefined && item.percent_ku !== null ? Number(item.percent_ku) : 5;

      const fac =
        item.alloc_faculty !== undefined && item.alloc_faculty !== null && item.alloc_faculty !== ''
          ? Number(item.alloc_faculty)
          : (b * facP) / 100;
      const dep =
        item.alloc_dept !== undefined && item.alloc_dept !== null && item.alloc_dept !== ''
          ? Number(item.alloc_dept)
          : (b * depP) / 100;
      const ku =
        item.alloc_ku !== undefined && item.alloc_ku !== null && item.alloc_ku !== ''
          ? Number(item.alloc_ku)
          : (b * kuP) / 100;
      const rem =
        item.alloc_remaining !== undefined && item.alloc_remaining !== null && item.alloc_remaining !== ''
          ? Number(item.alloc_remaining)
          : Math.max(0, b - (fac + dep + ku));

      facSum += fac;
      depSum += dep;
      kuSum += ku;
      remSum += rem;
    });

    return {
      totalBudgetAll: budgetSum,
      totalAllocFaculty: facSum,
      totalAllocDept: depSum,
      totalAllocKu: kuSum,
      totalAllocRemaining: remSum,
      totalAllocated15: facSum + depSum + kuSum,
    };
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

  // Show ALL matching items (fixing previous slice(-5) bug)
  const displayData = useMemo(() => {
    return validData.filter((item) => {
      if (selectedClient !== 'all') {
        const c = String(item.client || '').replace('\n', ' ').trim() || 'หน่วยงานภายใน/อื่นๆ';
        if (c !== selectedClient && !c.includes(selectedClient)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const c = String(item.client || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !c.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedClient, searchTerm]);

  return {
    validData,
    displayData,
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    uniqueHeads,
    uniqueClients,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
  };
}
