'use client';

import { useState, useEffect, useMemo } from 'react';
import ipData from '@/data/ip.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { getDepartment } from '@/lib/departments';

export interface IPItem {
  id?: string;
  name?: string;
  creator?: string;
  department?: string;
  type?: string;
  req_no?: string;
  status?: string;
  date?: string;
  [key: string]: any;
}

export function useIPData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [dataList, setDataList] = useState<IPItem[]>(() => {
    return (getCachedCategoryData('ip') as IPItem[]) || (ipData as IPItem[]);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('ip') as IPItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const validIpData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  const availableDepts = useMemo(() => {
    const depts = new Set<string>();
    validIpData.forEach((item) => {
      const text = `${item.creator || ''} ${item.department || ''}`;
      const matches = text.match(/วิศวกรรม[^\s\n,]+/g);
      if (matches) {
        matches.forEach((m) => depts.add(m.trim()));
      }
    });
    return Array.from(depts);
  }, [validIpData]);

  const filteredIpData = useMemo(() => {
    return validIpData.filter((item) => {
      const matchSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.creator && item.creator.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.application_number && item.application_number.includes(searchTerm)) ||
        (item.registration_number && item.registration_number.includes(searchTerm)) ||
        (item.req_no && item.req_no.toLowerCase().includes(searchTerm.toLowerCase()));

      const targetCode = deptFilter !== 'all' ? getDepartment(deptFilter).code : '';
      const matchDept =
        deptFilter === 'all' ||
        (item.creator && (item.creator.includes(deptFilter) || (targetCode !== '-' && getDepartment(item.creator).code === targetCode))) ||
        (item.department && (item.department.includes(deptFilter) || (targetCode !== '-' && getDepartment(item.department).code === targetCode)));

      return matchSearch && matchDept;
    });
  }, [validIpData, searchTerm, deptFilter]);

  const patentCount = useMemo(() => {
    return validIpData.filter(
      (item) =>
        item.department === 'P' ||
        item.type === 'P' ||
        (item.name && item.name.includes('สิทธิบัตร')) ||
        (item.type && item.type.includes('สิทธิบัตร'))
    ).length;
  }, [validIpData]);

  const totalSupportAmount = useMemo(() => {
    return validIpData.reduce((sum, item) => sum + (Number(item.support_amount) || 0), 0);
  }, [validIpData]);

  const uniqueDeptCount = availableDepts.length > 0 ? availableDepts.length : 1;

  return {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    totalSupportAmount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
  };
}
