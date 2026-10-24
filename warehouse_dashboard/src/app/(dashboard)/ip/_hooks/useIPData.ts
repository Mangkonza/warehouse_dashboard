'use client';

import { useState, useEffect, useMemo } from 'react';
import ipData from '@/data/ip.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';

export interface IPItem {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  creator?: string;
  department?: string;
  type?: string;
  req_no?: string;
  application_number?: string;
  registration_number?: string;
  support_amount?: number;
  status?: string;
  date?: string;
  [key: string]: any;
}

export function useIPData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
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
      .filter((item) => (item.name || item.title) && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [dataList, timeFilter]);

  const availableDepts = useMemo(() => {
    const depts = new Set<string>();
    validIpData.forEach((item) => {
      const rawParts = String(item.department || item.creator || '').split(',');
      rawParts.forEach((p) => {
        const d = getDepartment(p.trim());
        if (d.code !== '-') depts.add(d.code);
      });
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
      const itemDeptCodes = String(item.department || item.creator || '')
        .split(',')
        .map((s) => getDepartment(s.trim()).code);
      const matchDept =
        deptFilter === 'all' ||
        (targetCode !== '-' && itemDeptCodes.includes(targetCode)) ||
        String(item.department || '').includes(deptFilter);

      const matchType =
        typeFilter === 'all' ||
        String(item.type || '').includes(typeFilter) ||
        String(item.status || '').includes(typeFilter);

      return matchSearch && matchDept && matchType;
    });
  }, [validIpData, searchTerm, deptFilter, typeFilter]);

  const { patentCount, pettyPatentCount, protectedCount, pendingCount, totalSupportAmount } = useMemo(() => {
    let pat = 0;
    let petty = 0;
    let prot = 0;
    let pend = 0;
    let sup = 0;

    validIpData.forEach((item) => {
      const t = String(item.type || '');
      if (t.includes('อนุสิทธิบัตร')) petty++;
      else pat++;

      const st = String(item.status || '');
      if (st.includes('คุ้มครอง') || Boolean(item.registration_number && String(item.registration_number).trim())) {
        prot++;
      } else {
        pend++;
      }

      sup += Number(item.support_amount) || 0;
    });

    return {
      patentCount: pat,
      pettyPatentCount: petty,
      protectedCount: prot,
      pendingCount: pend,
      totalSupportAmount: sup,
    };
  }, [validIpData]);

  const uniqueDeptCount = availableDepts.length > 0 ? availableDepts.length : 1;

  return {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    pettyPatentCount,
    protectedCount,
    pendingCount,
    totalSupportAmount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
    typeFilter,
    setTypeFilter,
  };
}
