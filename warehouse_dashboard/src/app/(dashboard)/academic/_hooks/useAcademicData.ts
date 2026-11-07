'use client';

import { useState, useEffect, useMemo } from 'react';
import academicData from '@/data/academic.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter, resolveItemDate } from '@/types/timeFilter';
import { isTestRecord, detectSDGsFromText } from '@/lib/sdgEngine';
import { normalizeAcademicMonth, itemMatchesStrategicFilter } from '@/lib/pastelTheme';
import { getDepartment } from '@/lib/departments';

export interface AcademicItem {
  id?: string;
  name?: string;
  head?: string;
  head_id?: number | string;
  client?: string;
  department?: string;
  budget?: number;
  month?: string;
  start_date?: string;
  end_date?: string;
  percent_faculty?: number;
  percent_dept?: number;
  percent_ku?: number;
  alloc_faculty?: number;
  alloc_dept?: number;
  alloc_ku?: number;
  alloc_remaining?: number;
  sdg_code?: number | string;
  [key: string]: any;
}

export function useAcademicData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [hideMissingClient, setHideMissingClient] = useState(false);
  const [strategicFilter, setStrategicFilter] = useState('all');

  const [dataList, setDataList] = useState<AcademicItem[]>(() => {
    return (getCachedCategoryData('academic') as AcademicItem[]) || [];
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('academic').then((fresh) => {
      if (isMounted && Array.isArray(fresh)) {
        setDataList(fresh as AcademicItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('academic') as AcademicItem[];
      if (Array.isArray(fresh)) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  // Filter valid data with normalized month
  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter, 'academic'))
      .map((item) => ({
        ...item,
        normalizedMonth: normalizeAcademicMonth(item.month),
      }));
  }, [dataList, timeFilter]);

  const undatedCount = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return 0;
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => resolveItemDate(item, 'academic') === null).length;
  }, [dataList, timeFilter]);

  const {
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    topDeptName,
    topDeptBudget,
    avgProjectBudget,
    maxProjectBudget,
    specifiedClientsCount,
  } = useMemo(() => {
    let budgetSum = 0;
    let facSum = 0;
    let depSum = 0;
    let kuSum = 0;
    let remSum = 0;
    const deptMap: Record<string, number> = {};

    validData.forEach((item) => {
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      budgetSum += b;

      const fac = item.alloc_faculty ? Number(item.alloc_faculty) : (b * 5) / 100;
      const dep = item.alloc_dept ? Number(item.alloc_dept) : (b * 5) / 100;
      const ku = item.alloc_ku ? Number(item.alloc_ku) : (b * 5) / 100;
      const rem = item.alloc_remaining ? Number(item.alloc_remaining) : Math.max(0, b - (fac + dep + ku));

      facSum += fac;
      depSum += dep;
      kuSum += ku;
      remSum += rem;

      const dName = item.department || 'ไม่ระบุ';
      deptMap[dName] = (deptMap[dName] || 0) + b;
    });

    let topName = 'วิศวกรรมชลประทาน';
    let topVal = 0;
    let maxB = 0;
    const specifiedClientSet = new Set<string>();

    validData.forEach((item) => {
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      if (b > maxB) maxB = b;
      const c = String(item.client || '').replace(/\r?\n/g, ' ').trim();
      if (c && c !== '-' && c !== 'nan' && c !== 'ไม่ระบุ') {
        specifiedClientSet.add(c);
      }
    });

    Object.entries(deptMap).forEach(([name, val]) => {
      if (val > topVal) {
        topVal = val;
        topName = name;
      }
    });

    const avgB = validData.length > 0 ? budgetSum / validData.length : 0;

    return {
      totalBudgetAll: budgetSum,
      totalAllocFaculty: facSum,
      totalAllocDept: depSum,
      totalAllocKu: kuSum,
      totalAllocRemaining: remSum,
      totalAllocated15: facSum + depSum + kuSum,
      topDeptName: topName,
      topDeptBudget: topVal,
      avgProjectBudget: avgB,
      maxProjectBudget: maxB,
      specifiedClientsCount: specifiedClientSet.size,
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

  const uniqueDepts = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.department)
        .filter((d): d is string => Boolean(d && d !== 'nan' && d !== '-'))
    );
  }, [validData]);

  // Filtered dataset for display
  const displayData = useMemo(() => {
    return validData.filter((item) => {
      // 1. Department
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }

      // 2. Client
      if (selectedClient !== 'all') {
        const c = String(item.client || '').replace('\n', ' ').trim() || 'หน่วยงานภายใน/อื่นๆ';
        if (c !== selectedClient && !c.includes(selectedClient)) return false;
      }

      // 3. Hide missing client
      if (hideMissingClient) {
        const c = String(item.client || '').trim();
        if (!c || c === 'nan' || c === '-' || c === 'ไม่ระบุ') return false;
      }

      // 4. Month
      if (selectedMonth !== 'all' && item.normalizedMonth !== selectedMonth) {
        return false;
      }

      // 5. Strategic filter
      if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) {
        return false;
      }

      // 6. Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const c = String(item.client || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !c.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, selectedClient, hideMissingClient, selectedMonth, strategicFilter, searchTerm]);

  return {
    validData,
    allItems: dataList,
    undatedCount,
    displayData,
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    topDeptName,
    topDeptBudget,
    avgProjectBudget,
    maxProjectBudget,
    specifiedClientsCount,
    uniqueHeads,
    uniqueClients,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    selectedDept,
    setSelectedDept,
    selectedMonth,
    setSelectedMonth,
    hideMissingClient,
    setHideMissingClient,
    strategicFilter,
    setStrategicFilter,
  };
}
