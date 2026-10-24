'use client';

import { useState, useEffect, useMemo } from 'react';
import { KPIItem, KPIComputedResult, KPICategory } from '@/types/kpi';
import { getStoredKPIs, evaluateAllKPIs } from '@/lib/kpiEngine';
import { getCachedCategoryData } from '@/lib/dataService';
import { apiFetch } from '@/lib/api';
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
      const [resRes, acaRes, pubRes, srvRes, ipRes] = await Promise.allSettled([
        apiFetch<any[]>('/dashboard/research'),
        apiFetch<any[]>('/dashboard/academic'),
        apiFetch<any[]>('/dashboard/publications'),
        apiFetch<any[]>('/dashboard/services'),
        apiFetch<any[]>('/dashboard/ip'),
      ]);

      const newDatasets = {
        research: getCachedCategoryData('research') || rawResearch,
        academic: getCachedCategoryData('academic') || rawAcademic,
        publications: getCachedCategoryData('publications') || rawPublications,
        service: getCachedCategoryData('service') || rawServices,
        ip: getCachedCategoryData('ip') || rawIP,
        personnel: getCachedCategoryData('personnel') || rawPersonnel,
      };
      if (resRes.status === 'fulfilled' && resRes.value.data) newDatasets.research = resRes.value.data;
      if (acaRes.status === 'fulfilled' && acaRes.value.data) newDatasets.academic = acaRes.value.data;
      if (pubRes.status === 'fulfilled' && pubRes.value.data) newDatasets.publications = pubRes.value.data;
      if (srvRes.status === 'fulfilled' && srvRes.value.data) newDatasets.service = srvRes.value.data;
      if (ipRes.status === 'fulfilled' && ipRes.value.data) newDatasets.ip = ipRes.value.data;

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
