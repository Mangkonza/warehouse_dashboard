'use client';

import { useState, useEffect, useMemo } from 'react';
import { KPIItem, KPIComputedResult, KPICategory } from '@/types/kpi';
import { getStoredKPIs, evaluateAllKPIs } from '@/lib/kpiEngine';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

// Fallback JSON data
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import rawPersonnel from '@/data/personnel.json';

export const CATEGORY_NAMES: Record<KPICategory | 'all', string> = {
  all: 'ทุกหมวดยุทธศาสตร์',
  research: 'โครงการวิจัย',
  academic: 'โครงการพัฒนาวิชาการ',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'งานทรัพย์สินทางปัญญา',
  personnel: 'บุคลากร/อาจารย์',
  strategy: 'ยุทธศาสตร์คณะฯ',
};

export function useKpiData(timeFilter?: TimeFilterState) {
  const [kpiList, setKpiList] = useState<KPIItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [datasets, setDatasets] = useState<Record<string, any[]>>(() => ({
    research: getCachedCategoryData('research') || rawResearch,
    academic: getCachedCategoryData('academic') || rawAcademic,
    publications: getCachedCategoryData('publications') || rawPublications,
    service: getCachedCategoryData('service') || rawServices,
    ip: getCachedCategoryData('ip') || rawIP,
    personnel: getCachedCategoryData('personnel') || rawPersonnel,
  }));

  const loadLiveData = async () => {
    setIsRefreshing(true);
    try {
      const [resData, acaData, pubData, srvData, ipData, perData] = await Promise.all([
        fetchCategoryData('research'),
        fetchCategoryData('academic'),
        fetchCategoryData('publications'),
        fetchCategoryData('service'),
        fetchCategoryData('ip'),
        fetchCategoryData('personnel'),
      ]);

      const newDatasets = {
        research: (resData && resData.length > 0) ? resData : (getCachedCategoryData('research') || rawResearch),
        academic: (acaData && acaData.length > 0) ? acaData : (getCachedCategoryData('academic') || rawAcademic),
        publications: (pubData && pubData.length > 0) ? pubData : (getCachedCategoryData('publications') || rawPublications),
        service: (srvData && srvData.length > 0) ? srvData : (getCachedCategoryData('service') || rawServices),
        ip: (ipData && ipData.length > 0) ? ipData : (getCachedCategoryData('ip') || rawIP),
        personnel: (perData && perData.length > 0) ? perData : (getCachedCategoryData('personnel') || rawPersonnel),
      };

      setDatasets(newDatasets);
    } catch (err) {
      console.warn('Backend API offline or failed, falling back to local datasets:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setKpiList(getStoredKPIs());
    loadLiveData();

    const handleKpiUpdate = () => {
      setKpiList(getStoredKPIs());
      setDatasets({
        research: getCachedCategoryData('research') || rawResearch,
        academic: getCachedCategoryData('academic') || rawAcademic,
        publications: getCachedCategoryData('publications') || rawPublications,
        service: getCachedCategoryData('service') || rawServices,
        ip: getCachedCategoryData('ip') || rawIP,
        personnel: getCachedCategoryData('personnel') || rawPersonnel,
      });
    };

    window.addEventListener('kpi_updated', handleKpiUpdate);
    window.addEventListener('ku_data_updated', handleKpiUpdate);
    window.addEventListener('storage', handleKpiUpdate);
    return () => {
      window.removeEventListener('kpi_updated', handleKpiUpdate);
      window.removeEventListener('ku_data_updated', handleKpiUpdate);
      window.removeEventListener('storage', handleKpiUpdate);
    };
  }, []);

  const filteredDatasets = useMemo(() => {
    if (!timeFilter || timeFilter.mode === 'all') return datasets;
    const res: Record<string, any[]> = {};
    for (const [key, list] of Object.entries(datasets)) {
      if (key === 'personnel') {
        res[key] = list;
      } else {
        res[key] = (list || []).filter((item) => itemMatchesTimeFilter(item, timeFilter));
      }
    }
    return res;
  }, [datasets, timeFilter]);

  const computedKPIs: KPIComputedResult[] = useMemo(() => {
    return evaluateAllKPIs(kpiList, filteredDatasets);
  }, [kpiList, filteredDatasets]);

  const overallStats = useMemo(() => {
    const total = computedKPIs.length;
    const achieved = computedKPIs.filter((k) => k.status === 'achieved').length;
    const onTrack = computedKPIs.filter((k) => k.status === 'on_track').length;
    const atRisk = computedKPIs.filter((k) => k.status === 'at_risk').length;
    const behind = computedKPIs.filter((k) => k.status === 'behind').length;
    const avgScore =
      total > 0
        ? Math.round(
            computedKPIs.reduce((sum, cur) => sum + Math.min(cur.percentage, 100), 0) / total
          )
        : 0;

    return { total, achieved, onTrack, atRisk, behind, avgScore };
  }, [computedKPIs]);

  const filteredKPIs = useMemo(() => {
    return computedKPIs.filter((item) => {
      if (selectedCategory !== 'all' && item.kpi.category !== selectedCategory) return false;
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'risk_or_behind') {
          if (item.status !== 'at_risk' && item.status !== 'behind') return false;
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }
      return true;
    });
  }, [computedKPIs, selectedCategory, selectedStatus]);

  return {
    filteredKPIs,
    overallStats,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    expandedId,
    setExpandedId,
    isLoading,
    isRefreshing,
    loadLiveData,
  };
}
