'use client';

import { useState, useEffect, useMemo } from 'react';
import pubData from '@/data/publications.json';
import { getCachedCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { getDepartment } from '@/lib/departments';

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
  has_foreign_coauthor?: boolean;
  has_domestic_coauthor?: boolean;
  has_international_coauthor?: boolean;
  _detectedTier?: string;
  [key: string]: any;
}

export function usePublicationsData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
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
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({
        ...item,
        _detectedTier: item.journal_tier || autoDetectJournalRanking(item.journal || '', item.level || ''),
      }));
  }, [dataList, timeFilter]);

  const {
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
  } = useMemo(() => {
    let q1 = 0;
    let q2 = 0;
    let tci = 0;
    let other = 0;
    let intl = 0;
    let nat = 0;
    let budgetSum = 0;

    validData.forEach((d) => {
      const tier = d._detectedTier || '';
      const lvl = String(d.level || '');
      const typ = String(d.type || '');
      budgetSum += Number(d.budget) || 0;

      if (lvl.includes('นานาชาติ')) intl++;
      else if (lvl.includes('ชาติ')) nat++;

      if (typ.includes('อนุสิทธิบัตร')) {
        other++;
      } else if (tier === 'Scopus Q1') {
        q1++;
      } else if (tier === 'Scopus Q2' || tier === 'Scopus Q3' || tier === 'Scopus Q4') {
        q2++;
      } else if (tier.startsWith('TCI')) {
        tci++;
      } else {
        other++;
      }
    });

    return {
      q1Count: q1,
      q2Count: q2,
      tciCount: tci,
      otherCount: other,
      internationalCount: intl,
      nationalCount: nat,
      totalSupportBudget: budgetSum,
    };
  }, [validData]);

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      // 1. Level / Tier / Type filter
      if (levelFilter !== 'all') {
        const lvl = String(item.level || '');
        const tier = String(item._detectedTier || '');
        const typ = String(item.type || '');
        const target = levelFilter.toUpperCase();
        const matched =
          lvl === levelFilter ||
          tier.toUpperCase().includes(target) ||
          typ.includes(levelFilter);
        if (!matched) return false;
      }
      // 2. Department filter
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }
      // 3. Fiscal year filter
      if (fiscalYearFilter !== 'all') {
        const fy = item.fiscal_year_be ? String(item.fiscal_year_be) : '';
        if (fy !== fiscalYearFilter) return false;
      }
      // 4. Search term (title / owner / journal)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const o = String(item.owner || '').toLowerCase();
        const d = String(item.department || '').toLowerCase();
        const j = String(item.journal || '').toLowerCase();
        if (!n.includes(q) && !o.includes(q) && !d.includes(q) && !j.includes(q)) return false;
      }
      return true;
    });
  }, [validData, levelFilter, selectedDept, fiscalYearFilter, searchTerm]);

  // Available fiscal years
  const availableFiscalYears = useMemo(() => {
    const set = new Set<string>();
    dataList.forEach((d) => {
      if (d.fiscal_year_be) set.add(String(d.fiscal_year_be));
    });
    return Array.from(set).sort().reverse();
  }, [dataList]);

  return {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    selectedDept,
    setSelectedDept,
    fiscalYearFilter,
    setFiscalYearFilter,
    availableFiscalYears,
    refreshData,
  };
}
