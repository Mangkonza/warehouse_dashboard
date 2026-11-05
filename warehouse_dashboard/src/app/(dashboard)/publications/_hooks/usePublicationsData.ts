'use client';

import { useState, useEffect, useMemo } from 'react';
import pubData from '@/data/publications.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter, resolveItemDate } from '@/types/timeFilter';
import { isTestRecord, detectSDGsFromText } from '@/lib/sdgEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { getDepartment } from '@/lib/departments';
import { itemMatchesStrategicFilter } from '@/lib/pastelTheme';

export interface PublicationItem {
  id?: string;
  _id?: string;
  name?: string;
  owner?: string;
  department?: string;
  type?: string;
  status?: string;
  prep_budget?: number;
  reward_budget?: number;
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
  sdg_code?: number | string;
  _detectedTier?: string;
  [key: string]: any;
}

export function usePublicationsData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [fiscalYearFilter, setFiscalYearFilter] = useState('all');
  const [strategicFilter, setStrategicFilter] = useState('all');

  const [dataList, setDataList] = useState<PublicationItem[]>(() => {
    return (getCachedCategoryData('publications') as PublicationItem[]) || (pubData as PublicationItem[]);
  });

  const refreshData = async () => {
    try {
      const fresh = await fetchCategoryData('publications');
      if (Array.isArray(fresh) && fresh.length > 0) {
        setDataList(fresh);
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
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter, 'publications'))
      .map((item) => ({
        ...item,
        _detectedTier: item.journal_tier || autoDetectJournalRanking(item.journal || '', item.level || ''),
      }));
  }, [dataList, timeFilter]);

  const undatedCount = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return 0;
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item))
      .filter((item) => resolveItemDate(item, 'publications') === null).length;
  }, [dataList, timeFilter]);

  const {
    q1Count,
    q2Count,
    q3Count,
    q4Count,
    tci1Count,
    tci2Count,
    tciCount,
    confCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
    publishedCount,
    inPrepCount,
  } = useMemo(() => {
    let q1 = 0;
    let q2 = 0;
    let q3 = 0;
    let q4 = 0;
    let tci1 = 0;
    let tci2 = 0;
    let conf = 0;
    let other = 0;
    let intl = 0;
    let nat = 0;
    let budgetSum = 0;
    let pubCount = 0;
    let prepCount = 0;

    validData.forEach((d) => {
      const tier = String(d._detectedTier || '');
      const lvl = String(d.level || '');
      const typ = String(d.type || '');
      const st = String(d.status || '');
      budgetSum += Number(d.budget) || 0;

      if (st.includes('ตีพิมพ์แล้ว') || typ === 'ตีพิมพ์') {
        pubCount++;
      } else {
        prepCount++;
      }

      if (lvl.includes('นานาชาติ') || tier.startsWith('Q')) intl++;
      else nat++;

      if (tier === 'Q1') {
        q1++;
      } else if (tier === 'Q2') {
        q2++;
      } else if (tier === 'Q3') {
        q3++;
      } else if (tier === 'Q4') {
        q4++;
      } else if (tier === 'TCI 1') {
        tci1++;
      } else if (tier === 'TCI 2') {
        tci2++;
      } else if (tier.includes('Conference') || tier.includes('ประชุม') || lvl.includes('ประชุม')) {
        conf++;
      } else {
        other++;
      }
    });

    return {
      q1Count: q1,
      q2Count: q2,
      q3Count: q3,
      q4Count: q4,
      tci1Count: tci1,
      tci2Count: tci2,
      tciCount: tci1 + tci2,
      confCount: conf,
      otherCount: other,
      internationalCount: intl,
      nationalCount: nat,
      totalSupportBudget: budgetSum,
      publishedCount: pubCount,
      inPrepCount: prepCount,
    };
  }, [validData]);

  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      // 1. Level / Tier filter (รองรับครบทุกระดับคุณภาพ)
      if (levelFilter !== 'all') {
        const tier = String(item._detectedTier || '');
        if (levelFilter === 'Q1' && tier !== 'Q1') return false;
        if (levelFilter === 'Q2' && tier !== 'Q2') return false;
        if (levelFilter === 'Q3' && tier !== 'Q3') return false;
        if (levelFilter === 'Q4' && tier !== 'Q4') return false;
        if (levelFilter === 'TCI 1' && tier !== 'TCI 1') return false;
        if (levelFilter === 'TCI 2' && tier !== 'TCI 2') return false;
        if (levelFilter === 'TCI' && !tier.startsWith('TCI')) return false;
        if (levelFilter === 'conf' && !tier.includes('Conference') && !tier.includes('ประชุม')) return false;
        if (levelFilter === 'other' && (tier.startsWith('Q') || tier.startsWith('TCI') || tier.includes('Conference'))) return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        const st = String(item.status || '');
        const typ = String(item.type || '');
        const isPub = st.includes('ตีพิมพ์แล้ว') || typ === 'ตีพิมพ์';
        if (statusFilter === 'published' && !isPub) return false;
        if (statusFilter === 'prep' && isPub) return false;
      }

      // 3. Department filter
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }

      // 4. Fiscal year filter
      if (fiscalYearFilter !== 'all') {
        const fy = item.fiscal_year_be ? String(item.fiscal_year_be) : '';
        if (fy !== fiscalYearFilter) return false;
      }

      // 5. Strategic filter
      if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) {
        return false;
      }

      // 6. Search term
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
  }, [validData, levelFilter, statusFilter, selectedDept, fiscalYearFilter, strategicFilter, searchTerm]);

  return {
    validData,
    undatedCount,
    filteredData,
    q1Count,
    q2Count,
    q3Count,
    q4Count,
    tci1Count,
    tci2Count,
    tciCount,
    confCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
    publishedCount,
    inPrepCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    statusFilter,
    setStatusFilter,
    selectedDept,
    setSelectedDept,
    fiscalYearFilter,
    setFiscalYearFilter,
    strategicFilter,
    setStrategicFilter,
    refreshData,
  };
}
