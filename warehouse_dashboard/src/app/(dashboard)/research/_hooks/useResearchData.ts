'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCachedCategoryData, fetchCategoryData, getCachedEvaluations, fetchEvaluations } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter, resolveItemDate } from '@/types/timeFilter';
import { getDepartment } from '@/lib/departments';
import { isTestRecord, detectSDGsFromText } from '@/lib/sdgEngine';
import { itemMatchesStrategicFilter } from '@/lib/pastelTheme';

export interface ResearchItem {
  id?: string;
  _id?: string;
  name?: string;
  head?: string;
  head_id?: number | string;
  department?: string;
  budget?: number;
  budget_internal?: number;
  budget_external?: number;
  fund_source?: string;
  start_date?: string;
  end_date?: string;
  fiscal_year_be?: string;
  fiscal_year?: string;
  sdg_code?: number | string;
  [key: string]: any;
}

export function normalizeFundSource(rawFund?: string): string {
  if (!rawFund) return 'ไม่ระบุแหล่งทุน';
  const clean = String(rawFund).replace(/\r?\n/g, ' ').trim();
  const noSpace = clean.replace(/\s+/g, '');
  if (noSpace.includes('วช') || noSpace.includes('สำนักงานการวิจัยแห่งชาติ')) return 'สำนักงานการวิจัยแห่งชาติ (วช.)';
  if (noSpace.includes('สวก') || noSpace.includes('สำนักงานพัฒนาการวิจัยการเกษตร')) return 'สำนักงานพัฒนาการวิจัยการเกษตร (สวก.)';
  if (noSpace.includes('บพข') || noSpace.includes('บพช') || noSpace.includes('เพิ่มความสามารถในการแข่งขัน')) return 'บพข. (ทุนแข่งขันประเทศ)';
  if (noSpace.includes('บพท') || noSpace.includes('พัฒนาพื้นที่')) return 'บพท. (ทุนพัฒนาพื้นที่)';
  if (clean.includes('มิตรผล')) return 'บจก. มิตรผลวิจัยฯ';
  if (clean.includes('คณะวิศวกรรมศาสตร์')) return 'ทุนภายใน คณะวิศวกรรมศาสตร์';
  if (clean.includes('วิทยาเขตกำแพงแสน')) return 'ทุนสนับสนุน วข.กำแพงแสน';
  if (clean.includes('มก.')) return 'ทุนอุดหนุน มก.';
  if (clean === 'test' || clean === '-' || clean === 'nan') return 'ไม่ระบุแหล่งทุน';
  return clean;
}

function lookupItemEvaluation(category: string, item: any, evalMap: Record<string, any>) {
  if (!item || !evalMap) return null;
  const catLower = category.toLowerCase();
  const candidates = [
    item.id ? `${catLower}_${String(item.id).trim()}` : null,
    item._id ? `${catLower}_${String(item._id).trim()}` : null,
    item.name ? `${catLower}_${String(item.name).trim()}` : null,
    item._id ? String(item._id).trim() : null,
    item.id ? String(item.id).trim() : null,
  ].filter(Boolean) as string[];

  for (const k of candidates) {
    if (evalMap[k]) return evalMap[k];
  }
  return null;
}

export function useResearchData(timeFilter?: TimeFilterState) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedFund, setSelectedFund] = useState('all');
  const [fundingType, setFundingType] = useState<'all' | 'external' | 'internal'>('all');
  const [grantTier, setGrantTier] = useState<string>('all');
  const [strategicFilter, setStrategicFilter] = useState<string>('all');

  const [evalMap, setEvalMap] = useState<Record<string, any>>(() => getCachedEvaluations());

  useEffect(() => {
    let isMounted = true;
    fetchEvaluations('research').then((fresh) => {
      if (isMounted && fresh) setEvalMap(fresh);
    });

    const handleEvalUpdate = () => {
      setEvalMap(getCachedEvaluations());
    };
    window.addEventListener('ku_evaluations_updated', handleEvalUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_evaluations_updated', handleEvalUpdate);
    };
  }, []);

  const [dataList, setDataList] = useState<ResearchItem[]>(() => {
    return (getCachedCategoryData('research') as ResearchItem[]) || [];
  });

  useEffect(() => {
    let isMounted = true;
    fetchCategoryData('research').then((fresh) => {
      if (isMounted && Array.isArray(fresh)) {
        setDataList(fresh as ResearchItem[]);
      }
    });

    const handleUpdate = () => {
      const fresh = getCachedCategoryData('research') as ResearchItem[];
      if (Array.isArray(fresh)) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, []);

  // Filter valid data & apply time filter
  const validData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .map((item) => {
        const ev = lookupItemEvaluation('research', item, evalMap);
        if (ev) {
          return {
            ...item,
            evaluation: ev,
            sdg_ids: (ev.sdg_ids && ev.sdg_ids.length > 0) ? ev.sdg_ids : (item.sdg_ids || []),
            i_type: ev.i_type || item.i_type || null,
          };
        }
        return item;
      })
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter, 'research'));
  }, [dataList, evalMap, timeFilter]);

  const undatedCount = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return 0;
    return dataList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => resolveItemDate(item, 'research') === null).length;
  }, [dataList, timeFilter]);

  // Aggregate totals
  const {
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    activePisCount,
    maxProject,
  } = useMemo(() => {
    let internalSum = 0;
    let externalSum = 0;
    let megaCount = 0;
    let maxBudget = 0;
    let maxItem: ResearchItem | null = null;
    const piSet = new Set<string>();

    validData.forEach((item) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
      const total = internal + external || Number(item.budget) || 0;

      internalSum += internal;
      externalSum += external;

      if (total >= 10000000) megaCount++;
      if (total > maxBudget) {
        maxBudget = total;
        maxItem = item;
      }

      const h = String(item.head || '').trim();
      if (h && h !== '-' && h !== 'nan') {
        piSet.add(h);
      }
    });

    return {
      totalInternalBudget: internalSum,
      totalExternalBudget: externalSum,
      totalBudgetAll: internalSum + externalSum,
      megaProjectsCount: megaCount,
      activePisCount: piSet.size || 27,
      maxProject: maxItem,
    };
  }, [validData]);

  const uniqueDepts = useMemo(() => {
    return new Set(
      validData
        .map((item) => item.department)
        .filter((d): d is string => Boolean(d && d !== 'nan' && d !== '-'))
    );
  }, [validData]);

  const uniqueFunds = useMemo(() => {
    return new Set(
      validData
        .map((item) => normalizeFundSource(item.fund_source))
        .filter((f): f is string => Boolean(f && f !== 'ไม่ระบุแหล่งทุน'))
    );
  }, [validData]);

  // Filtered for charts & table display
  const filteredData = useMemo(() => {
    return validData.filter((item) => {
      // 1. Department
      if (selectedDept !== 'all') {
        const itemDept = getDepartment(item.department);
        const filterDept = getDepartment(selectedDept);
        if (itemDept.code !== filterDept.code && !String(item.department || '').includes(selectedDept)) {
          return false;
        }
      }

      // 2. Fund source
      if (selectedFund !== 'all') {
        const f = normalizeFundSource(item.fund_source);
        if (f !== selectedFund) {
          return false;
        }
      }

      // 3. Funding Type (external vs internal)
      if (fundingType === 'external') {
        if ((Number(item.budget_external) || 0) <= 0) return false;
      } else if (fundingType === 'internal') {
        if ((Number(item.budget_internal) || 0) <= 0) return false;
      }

      // 4. Grant Tier
      const totalB = (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0) || Number(item.budget) || 0;
      if (grantTier === 'tier1' && totalB >= 500000) return false;
      if (grantTier === 'tier2' && (totalB < 500000 || totalB >= 2000000)) return false;
      if (grantTier === 'tier3' && (totalB < 2000000 || totalB >= 10000000)) return false;
      if (grantTier === 'tier4' && totalB < 10000000) return false;

      // 5. Strategic Filter (ISEE / IAM / SDGs)
      if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) {
        return false;
      }

      // 6. Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const id = String(item.id || '').toLowerCase();
        const f = String(item.fund_source || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !id.includes(q) && !f.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, selectedFund, fundingType, grantTier, strategicFilter, searchTerm]);

  return {
    validData,
    allItems: dataList,
    undatedCount,
    filteredData,
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    activePisCount,
    maxProject,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFund,
    setSelectedFund,
    fundingType,
    setFundingType,
    grantTier,
    setGrantTier,
    strategicFilter,
    setStrategicFilter,
  };
}
