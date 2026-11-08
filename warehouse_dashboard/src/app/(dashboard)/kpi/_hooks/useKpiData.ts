'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  KPIItem,
  KPIComputedResult,
  KPICategory,
  KPIReportingRound,
  KPIReportingRoundConfig,
} from '@/types/kpi';
import {
  getStoredKPIs,
  fetchKPIsFromBackend,
  fetchReportingRoundsFromBackend,
  evaluateAllKPIs,
  getStoredReportingRounds,
} from '@/lib/kpiEngine';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterState, itemMatchesTimeFilter } from '@/types/timeFilter';

// Fallback JSON data
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';

export const CATEGORY_NAMES: Record<KPICategory | 'all', string> = {
  all: 'ทุกประเภทงาน',
  research: 'โครงการวิจัย',
  academic: 'พัฒนาวิชาการ/หลักสูตร',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  service: 'งานบริการวิชาการ',
  ip: 'ทรัพย์สินทางปัญญา/เชิงพาณิชย์',
  personnel: 'บุคลากร/อาจารย์',
  strategy: 'ยุทธศาสตร์และความร่วมมือ',
};

export function useKpiData(timeFilter?: TimeFilterState) {
  const [kpiList, setKpiList] = useState<KPIItem[]>([]);
  const [reportingRounds, setReportingRounds] = useState<KPIReportingRoundConfig[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRound, setSelectedRound] = useState<KPIReportingRound>('round-9m');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [datasets, setDatasets] = useState<Record<string, any[]>>(() => ({
    research: getCachedCategoryData('research') || rawResearch,
    academic: getCachedCategoryData('academic') || rawAcademic,
    publications: getCachedCategoryData('publications') || rawPublications,
    service: getCachedCategoryData('service') || rawServices,
    ip: getCachedCategoryData('ip') || rawIP,
    personnel: getCachedCategoryData('personnel') || [],
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
        fetchKPIsFromBackend(),
        fetchReportingRoundsFromBackend(),
      ]);

      const liveKpis = await fetchKPIsFromBackend();
      if (liveKpis && liveKpis.length > 0) {
        setKpiList(liveKpis);
      }

      const newDatasets = {
        research:
          resData && resData.length > 0
            ? resData
            : getCachedCategoryData('research') || rawResearch,
        academic:
          acaData && acaData.length > 0
            ? acaData
            : getCachedCategoryData('academic') || rawAcademic,
        publications:
          pubData && pubData.length > 0
            ? pubData
            : getCachedCategoryData('publications') || rawPublications,
        service:
          srvData && srvData.length > 0
            ? srvData
            : getCachedCategoryData('service') || rawServices,
        ip: ipData && ipData.length > 0 ? ipData : getCachedCategoryData('ip') || rawIP,
        personnel:
          perData && perData.length > 0
            ? perData
            : getCachedCategoryData('personnel') || [],
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
    const syncLocal = () => {
      const rounds = getStoredReportingRounds().filter((r) => r.isActive !== false);
      setReportingRounds(rounds);
      setKpiList(getStoredKPIs());
      setSelectedRound((prev) => {
        if (rounds.some((r) => r.id === prev)) return prev;
        if (prev === '9M' && rounds.some((r) => r.id === 'round-9m')) return 'round-9m';
        if (prev === '6M' && rounds.some((r) => r.id === 'round-6m')) return 'round-6m';
        return rounds[rounds.length - 1]?.id || 'round-9m';
      });
    };

    syncLocal();
    loadLiveData();

    const handleKpiUpdate = () => {
      syncLocal();
      setDatasets({
        research: getCachedCategoryData('research') || rawResearch,
        academic: getCachedCategoryData('academic') || rawAcademic,
        publications: getCachedCategoryData('publications') || rawPublications,
        service: getCachedCategoryData('service') || rawServices,
        ip: getCachedCategoryData('ip') || rawIP,
        personnel: getCachedCategoryData('personnel') || [],
      });
    };

    window.addEventListener('kpi_updated', handleKpiUpdate);
    window.addEventListener('kpi_rounds_updated', handleKpiUpdate);
    window.addEventListener('ku_data_updated', handleKpiUpdate);
    window.addEventListener('storage', handleKpiUpdate);
    return () => {
      window.removeEventListener('kpi_updated', handleKpiUpdate);
      window.removeEventListener('kpi_rounds_updated', handleKpiUpdate);
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
        res[key] = (list || []).filter((item) => itemMatchesTimeFilter(item, timeFilter, key));
      }
    }
    return res;
  }, [datasets, timeFilter]);

  const computedKPIs: KPIComputedResult[] = useMemo(() => {
    return evaluateAllKPIs(kpiList, filteredDatasets, selectedRound);
  }, [kpiList, filteredDatasets, selectedRound]);

  const overallStats = useMemo(() => {
    const total = computedKPIs.length;
    const achieved = computedKPIs.filter((k) => k.status === 'achieved').length;
    const inProgress = computedKPIs.filter((k) => k.status === 'in_progress' || k.status === 'on_track' || k.status === 'at_risk').length;
    const behind = computedKPIs.filter((k) => k.status === 'behind').length;
    const avgScore =
      total > 0
        ? Math.round(
            computedKPIs.reduce((sum, cur) => sum + Math.min(cur.percentage, 100), 0) / total
          )
        : 0;

    return {
      total,
      achieved,
      inProgress,
      onTrack: inProgress,
      atRisk: 0,
      behind,
      avgScore,
    };
  }, [computedKPIs]);

  const filteredKPIs = useMemo(() => {
    return computedKPIs.filter((item) => {
      const k = item.kpi;
      if (selectedStrategy !== 'all') {
        if (k.strategyCode !== selectedStrategy && !k.code.startsWith(selectedStrategy)) {
          return false;
        }
      }
      if (selectedCategory !== 'all' && k.category !== selectedCategory) return false;
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'in_progress' || selectedStatus === 'on_track') {
          if (item.status !== 'in_progress' && item.status !== 'on_track' && item.status !== 'at_risk') return false;
        } else if (selectedStatus === 'risk_or_behind') {
          if (item.status !== 'at_risk' && item.status !== 'behind') return false;
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const subText = (k.subIndicators || [])
          .map((s) => `${s.title} ${s.evidence || ''} ${s.remarks || ''} ${s.reporter || ''}`)
          .join(' ');
        const haystack = [
          k.code,
          k.title,
          k.description || '',
          k.strategyCode || '',
          k.strategyName || '',
          k.planCode || '',
          k.planName || '',
          k.collectionPeriod || '',
          k.unit || '',
          k.evidence || '',
          k.remarks || '',
          k.reporter || '',
          k.responsibleUnit || '',
          subText,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [computedKPIs, selectedStrategy, selectedCategory, selectedStatus, searchQuery]);

  return {
    filteredKPIs, computedKPIs,
    reportingRounds,
    overallStats,
    selectedStrategy,
    setSelectedStrategy,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedRound,
    setSelectedRound,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    expandedId,
    setExpandedId,
    isLoading,
    isRefreshing,
    loadLiveData,
  };
}
