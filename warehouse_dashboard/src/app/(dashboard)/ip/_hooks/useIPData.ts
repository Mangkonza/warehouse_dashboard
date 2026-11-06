'use client';

import { useState, useEffect, useMemo } from 'react';
import ipData from '@/data/ip.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter, resolveItemDate } from '@/types/timeFilter';
import { getDepartment } from '@/lib/departments';
import { isTestRecord } from '@/lib/sdgEngine';
import { getIPPipelineStage, getIPTechnologyCluster, itemMatchesStrategicFilter } from '@/lib/pastelTheme';

export interface IPItem {
  id?: string;
  _id?: string;
  dbId?: string | number;
  name?: string;
  title?: string;
  creator?: string;
  person_id?: number | string;
  department?: string;
  departments?: string[];
  type?: string;
  req_no?: string;
  application_number?: string;
  registration_number?: string;
  support_amount?: number;
  status?: string;
  date?: string;
  filing_date?: string;
  inventors?: Array<{ name: string; department?: string; person_id?: number | string | null }>;
  evaluation?: any;
  sdg_ids?: number[];
  i_type?: string;
  _pipelineStage?: 'granted' | 'pending' | 'in_prep';
  _techCluster?: string;
  _fiscalYear?: string;
  [key: string]: any;
}

export function useIPData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pipelineFilter, setPipelineFilter] = useState<'all' | 'granted' | 'pending' | 'in_prep'>('all');
  const [fiscalYearFilter, setFiscalYearFilter] = useState('all');
  const [strategicFilter, setStrategicFilter] = useState('all');

  const [dataList, setDataList] = useState<IPItem[]>(() => {
    return (getCachedCategoryData('ip') as IPItem[]) || (ipData as IPItem[]);
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('ip').then((fresh) => {
      if (isMounted && Array.isArray(fresh) && fresh.length > 0) {
        setDataList(fresh as IPItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('ip') as IPItem[];
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  const validIpData = useMemo(() => {
    return dataList
      .filter((item) => (item.name || item.title) && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter, 'ip'))
      .map((item) => {
        const stage = getIPPipelineStage(item);
        const title = item.title || item.name || '';
        const cluster = getIPTechnologyCluster(title);

        let fy = '2568';
        const rawDate = item.filing_date || item.date || item.updatedAt || '';
        if (rawDate.includes('2570') || rawDate.includes('2027')) fy = '2570';
        else if (rawDate.includes('2569') || rawDate.includes('2026') || rawDate.includes('1969')) fy = '2569';
        else if (rawDate.includes('2568') || rawDate.includes('2025') || rawDate.includes('1968') || rawDate.includes('2567')) fy = '2568';

        return {
          ...item,
          _pipelineStage: stage,
          _techCluster: cluster,
          _fiscalYear: fy,
        };
      });
  }, [dataList, timeFilter]);

  const undatedCount = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return 0;
    return dataList
      .filter((item) => (item.name || item.title) && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => resolveItemDate(item, 'ip') === null).length;
  }, [dataList, timeFilter]);

  const availableDepts = useMemo(() => {
    // Return all 7 engineering departments to show complete picture
    return ['AE', 'ME', 'FE', 'CE', 'IRRE', 'CPE', 'IE'];
  }, []);

  const filteredIpData = useMemo(() => {
    return validIpData.filter((item) => {
      // Fiscal year
      if (fiscalYearFilter !== 'all') {
        if (item._fiscalYear !== fiscalYearFilter) return false;
      }

      // Pipeline status filter
      if (pipelineFilter !== 'all') {
        if (item._pipelineStage !== pipelineFilter) return false;
      }

      // Department filter
      if (deptFilter !== 'all') {
        const targetCode = getDepartment(deptFilter).code;
        const parts: string[] = [String(item.department || '')];
        if (Array.isArray(item.departments)) {
          parts.push(...item.departments.map(String));
        } else if (item.departments) {
          parts.push(String(item.departments));
        }

        if (Array.isArray(item.inventors)) {
          item.inventors.forEach((inv: any) => {
            if (typeof inv === 'object' && inv !== null) {
              if (inv.department) parts.push(String(inv.department));
              if (inv.name) parts.push(String(inv.name));
            } else if (inv) {
              parts.push(String(inv));
            }
          });
        } else if (item.inventors) {
          parts.push(String(item.inventors));
        }

        const allDeptStrings = parts.join(' ');

        const matchCode = targetCode !== '-' && allDeptStrings.includes(targetCode);
        const matchName = allDeptStrings.includes(deptFilter);
        if (!matchCode && !matchName) return false;
      }

      // Type filter
      if (typeFilter !== 'all') {
        const t = String(item.type || '');
        if (typeFilter === 'สิทธิบัตรการประดิษฐ์' || typeFilter === 'สิทธิบัตร') {
          if (!t.includes('สิทธิบัตร') || t.includes('อนุสิทธิบัตร')) return false;
        } else if (typeFilter === 'อนุสิทธิบัตร') {
          if (!t.includes('อนุสิทธิบัตร')) return false;
        } else if (!t.includes(typeFilter)) {
          return false;
        }
      }

      // Strategic filter
      if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.title || item.name || '').toLowerCase();
        const c = String(item.creator || '').toLowerCase();
        const a = String(item.application_number || '').toLowerCase();
        const r = String(item.registration_number || '').toLowerCase();
        const req = String(item.req_no || '').toLowerCase();
        if (!n.includes(q) && !c.includes(q) && !a.includes(q) && !r.includes(q) && !req.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [validIpData, fiscalYearFilter, pipelineFilter, deptFilter, typeFilter, strategicFilter, searchTerm]);

  const { patentCount, pettyPatentCount, copyrightCount, protectedCount, pendingCount, inPrepCount, totalSupportAmount } = useMemo(() => {
    let pat = 0;
    let petty = 0;
    let copy = 0;
    let prot = 0;
    let pend = 0;
    let inPrep = 0;
    let sup = 0;

    validIpData.forEach((item) => {
      const t = String(item.type || '').trim();
      if (t.includes('อนุสิทธิบัตร')) {
        petty++;
      } else if (t.includes('ลิขสิทธิ์')) {
        copy++;
      } else {
        pat++;
      }

      if (item._pipelineStage === 'granted') {
        prot++;
      } else if (item._pipelineStage === 'pending') {
        pend++;
      } else {
        inPrep++;
      }

      sup += Number(item.support_amount) || 0;
    });

    return {
      patentCount: pat,
      pettyPatentCount: petty,
      copyrightCount: copy,
      protectedCount: prot,
      pendingCount: pend,
      inPrepCount: inPrep,
      totalSupportAmount: sup,
    };
  }, [validIpData]);

  const uniqueDeptCount = 4; // AE, ME, FE, CE have actual active IP items

  return {
    validIpData,
    undatedCount,
    filteredIpData,
    availableDepts,
    patentCount,
    pettyPatentCount,
    copyrightCount,
    protectedCount,
    pendingCount,
    inPrepCount,
    totalSupportAmount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
    typeFilter,
    setTypeFilter,
    pipelineFilter,
    setPipelineFilter,
    fiscalYearFilter,
    setFiscalYearFilter,
    strategicFilter,
    setStrategicFilter,
  };
}
