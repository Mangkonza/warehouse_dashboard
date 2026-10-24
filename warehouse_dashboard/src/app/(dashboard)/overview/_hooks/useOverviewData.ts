'use client';

import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '@/lib/api';
import { parseNumber } from '@/lib/kpiEngine';
import { calculateProjectTimeline } from '@/lib/projectMonitoringEngine';
import { getCachedCategoryData } from '@/lib/dataService';
import { matchDepartmentCode } from '@/config/departments';
import { exportMonthlyExecutiveMasterExcel, saveReportSnapshot } from '@/lib/etlEngine';
import { TimeFilterState, itemMatchesTimeFilter, getTimeFilterLabel } from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { CategoryKey } from '@/config/dataManagementConfig';

import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';

export interface OverviewKpiScore {
  id: string;
  code: string;
  title: string;
  actual: number;
  actualFormatted: string;
  target: number;
  targetFormatted: string;
  unit: string;
  percent: number;
  proRataTarget: number;
  categoryKey: CategoryKey;
  items: any[];
  status: {
    label: string;
    color: string;
    bg: string;
  };
}

export interface DepartmentOverviewStat {
  code: string;
  name: string;
  budget: number;
  researchCount: number;
  academicCount: number;
  academicBudget: number;
  pubs: number;
  services: number;
  ips: number;
  researchItems: any[];
  allItems: any[];
}

export function useOverviewData(timeFilter: TimeFilterState) {
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const [researchList, setResearchList] = useState<any[]>(() => getCachedCategoryData('research') || rawResearch);
  const [academicList, setAcademicList] = useState<any[]>(() => getCachedCategoryData('academic') || rawAcademic);
  const [pubList, setPubList] = useState<any[]>(() => getCachedCategoryData('publications') || rawPublications);
  const [serviceList, setServiceList] = useState<any[]>(() => getCachedCategoryData('service') || rawServices);
  const [ipList, setIpList] = useState<any[]>(() => getCachedCategoryData('ip') || rawIP);

  useEffect(() => {
    const handleUpdate = () => {
      setResearchList(getCachedCategoryData('research') || rawResearch);
      setAcademicList(getCachedCategoryData('academic') || rawAcademic);
      setPubList(getCachedCategoryData('publications') || rawPublications);
      setServiceList(getCachedCategoryData('service') || rawServices);
      setIpList(getCachedCategoryData('ip') || rawIP);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const fetchLiveData = async () => {
    setIsRefreshing(true);
    try {
      const [resRes, acaRes, pubRes, srvRes, ipRes] = await Promise.allSettled([
        apiFetch<any[]>('/dashboard/research'),
        apiFetch<any[]>('/dashboard/academic'),
        apiFetch<any[]>('/dashboard/publications'),
        apiFetch<any[]>('/dashboard/services'),
        apiFetch<any[]>('/dashboard/ip'),
      ]);

      let liveCount = 0;
      if (resRes.status === 'fulfilled' && resRes.value.data) {
        setResearchList(resRes.value.data);
        liveCount++;
      }
      if (acaRes.status === 'fulfilled' && acaRes.value.data) {
        setAcademicList(acaRes.value.data);
        liveCount++;
      }
      if (pubRes.status === 'fulfilled' && pubRes.value.data) {
        setPubList(pubRes.value.data);
        liveCount++;
      }
      if (srvRes.status === 'fulfilled' && srvRes.value.data) {
        setServiceList(srvRes.value.data);
        liveCount++;
      }
      if (ipRes.status === 'fulfilled' && ipRes.value.data) {
        setIpList(ipRes.value.data);
        liveCount++;
      }

      setIsLiveFromDb(liveCount > 0);
    } catch {
      setIsLiveFromDb(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const validResearch = useMemo(() => {
    return researchList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({ ...item, _categoryKey: 'research' as CategoryKey }));
  }, [researchList, timeFilter]);

  const validAcademic = useMemo(() => {
    return academicList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({ ...item, _categoryKey: 'academic' as CategoryKey }));
  }, [academicList, timeFilter]);

  const validPub = useMemo(() => {
    return pubList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({ ...item, _categoryKey: 'publications' as CategoryKey }));
  }, [pubList, timeFilter]);

  const validService = useMemo(() => {
    return serviceList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({ ...item, _categoryKey: 'service' as CategoryKey }));
  }, [serviceList, timeFilter]);

  const validIP = useMemo(() => {
    return ipList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง' && !isTestRecord(item))
      .filter((item) => itemMatchesTimeFilter(item, timeFilter))
      .map((item) => ({ ...item, _categoryKey: 'ip' as CategoryKey }));
  }, [ipList, timeFilter]);

  const fiscalYearProgress = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const fiscalMonthIndex = ((currentMonth + 3) % 12) + 1;
    return Math.min(100, Math.max(8, Math.round((fiscalMonthIndex / 12) * 100)));
  }, []);

  const kpiScorecard: OverviewKpiScore[] = useMemo(() => {
    const externalResearchItems = validResearch.filter((cur) => parseNumber(cur.budget_external) > 0);
    const externalBudget = validResearch.reduce((acc, cur) => acc + parseNumber(cur.budget_external), 0);
    const targetExternal = 100000000;
    const pctExternal = Math.min(200, Math.round((externalBudget / targetExternal) * 1000) / 10);

    const scopusItems = validPub.filter((p) => {
      const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
      const s = `${p.journal || ''} ${p.level || ''}`.toLowerCase();
      return (
        tier.startsWith('Scopus') ||
        s.includes('scopus') ||
        s.includes('wos') ||
        s.includes('นานาชาติ')
      );
    });
    const scopusCount = scopusItems.length || validPub.length;
    const targetScopus = 330;
    const pctScopus = Math.min(200, Math.round((scopusCount / targetScopus) * 1000) / 10);

    const megaItems = validResearch.filter(
      (r) => parseNumber(r.budget_external) + parseNumber(r.budget_internal) >= 10000000
    );
    const megaCount = megaItems.length;
    const targetMega = 5;
    const pctMega = Math.min(200, Math.round((megaCount / targetMega) * 1000) / 10);

    const academicRevenue = validAcademic.reduce((acc, cur) => acc + parseNumber(cur.budget), 0);
    const serviceExplicitRevenue = validService.reduce(
      (acc, cur) => acc + (parseNumber(cur.actual_revenue) || parseNumber(cur.budget) || parseNumber(cur.revenue) || 0),
      0
    );
    const actualServiceRevenue = academicRevenue + serviceExplicitRevenue;
    const targetServiceRevenue = 50000000;
    const pctService = Math.min(200, Math.round((actualServiceRevenue / targetServiceRevenue) * 1000) / 10);

    const ipCount = validIP.length;
    const targetIP = 15;
    const pctIP = Math.min(200, Math.round((ipCount / targetIP) * 1000) / 10);

    const getStatusInfo = (actualPct: number, targetProRata: number) => {
      if (actualPct >= 100) return { label: 'บรรลุแล้ว', color: '#059669', bg: '#ecfdf5' };
      if (actualPct >= targetProRata * 0.9) return { label: 'ตามแผน', color: '#0284c7', bg: '#f0f9ff' };
      if (actualPct >= targetProRata * 0.7) return { label: 'เสี่ยง', color: '#d97706', bg: '#fffbeb' };
      return { label: 'ต้องเร่งรัด', color: '#dc2626', bg: '#fef2f2' };
    };

    return [
      {
        id: 'external_budget',
        code: 'KPI 2.1-6',
        title: 'งบวิจัยจากแหล่งทุนภายนอก',
        actual: externalBudget,
        actualFormatted: `${(externalBudget / 1000000).toFixed(2)} ล้านบาท`,
        target: targetExternal,
        targetFormatted: '100.00 ล้านบาท',
        unit: 'บาท',
        percent: pctExternal,
        proRataTarget: fiscalYearProgress,
        categoryKey: 'research',
        items: externalResearchItems.length > 0 ? externalResearchItems : validResearch,
        status: getStatusInfo(pctExternal, fiscalYearProgress),
      },
      {
        id: 'scopus_pub',
        code: 'KPI 2.1-1',
        title: 'ตีพิมพ์ระดับนานาชาติ (Scopus/WoS)',
        actual: scopusCount,
        actualFormatted: `${scopusCount} เรื่อง`,
        target: targetScopus,
        targetFormatted: '330 เรื่อง',
        unit: 'เรื่อง',
        percent: pctScopus,
        proRataTarget: fiscalYearProgress,
        categoryKey: 'publications',
        items: scopusItems.length > 0 ? scopusItems : validPub,
        status: getStatusInfo(pctScopus, fiscalYearProgress),
      },
      {
        id: 'mega_projects',
        code: 'KPI 2.1-2',
        title: 'โครงการวิจัยขนาดใหญ่ (≥ 10 ล้าน)',
        actual: megaCount,
        actualFormatted: `${megaCount} โครงการ`,
        target: targetMega,
        targetFormatted: '5 โครงการ',
        unit: 'โครงการ',
        percent: pctMega,
        proRataTarget: fiscalYearProgress,
        categoryKey: 'research',
        items: megaItems,
        status: getStatusInfo(pctMega, fiscalYearProgress),
      },
      {
        id: 'service_revenue',
        code: 'KPI 2.2-1',
        title: 'งบโครงการพัฒนาวิชาการและบริการวิชาการ',
        actual: actualServiceRevenue,
        actualFormatted: `${(actualServiceRevenue / 1000000).toFixed(2)} ล้านบาท`,
        target: targetServiceRevenue,
        targetFormatted: '50.00 ล้านบาท',
        unit: 'บาท',
        percent: pctService,
        proRataTarget: fiscalYearProgress,
        categoryKey: 'academic',
        items: validAcademic,
        status: getStatusInfo(pctService, fiscalYearProgress),
      },
      {
        id: 'ip_patents',
        code: 'KPI 2.3-2',
        title: 'ยื่นจดงานทรัพย์สินทางปัญญา (IP)',
        actual: ipCount,
        actualFormatted: `${ipCount} รายการ`,
        target: targetIP,
        targetFormatted: '15 รายการ',
        unit: 'รายการ',
        percent: pctIP,
        proRataTarget: fiscalYearProgress,
        categoryKey: 'ip',
        items: validIP,
        status: getStatusInfo(pctIP, fiscalYearProgress),
      },
    ];
  }, [validResearch, validAcademic, validPub, validService, validIP, fiscalYearProgress]);

  const departmentStats: DepartmentOverviewStat[] = useMemo(() => {
    const depts: Record<string, DepartmentOverviewStat> = {
      AE: { code: 'AE', name: 'วิศวกรรมเกษตร', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      CPE: { code: 'CPE', name: 'วิศวกรรมคอมพิวเตอร์', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      IRE: { code: 'IRE', name: 'วิศวกรรมชลประทาน', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      FE: { code: 'FE', name: 'วิศวกรรมอาหาร', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      IE: { code: 'IE', name: 'วิศวกรรมอุตสาหการ', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      ME: { code: 'ME', name: 'วิศวกรรมเครื่องกล', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      CE: { code: 'CE', name: 'วิศวกรรมโยธา', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
    };

    validResearch.forEach((r) => {
      const code = matchDepartmentCode(r.department);
      if (code && depts[code]) {
        depts[code].researchCount += 1;
        depts[code].budget += parseNumber(r.budget_internal) + parseNumber(r.budget_external);
        depts[code].researchItems.push(r);
        depts[code].allItems.push(r);
      }
    });

    validAcademic.forEach((a) => {
      const code = matchDepartmentCode(a.department);
      if (code && depts[code]) {
        depts[code].academicCount += 1;
        depts[code].academicBudget += parseNumber(a.budget);
        depts[code].allItems.push(a);
      }
    });

    validPub.forEach((p) => {
      const code = matchDepartmentCode(p.department);
      if (code && depts[code]) {
        depts[code].pubs += 1;
        depts[code].allItems.push(p);
      }
    });

    validService.forEach((s) => {
      const code = matchDepartmentCode(s.department);
      if (code && depts[code]) {
        depts[code].services += 1;
        depts[code].allItems.push(s);
      }
    });

    validIP.forEach((ip) => {
      const code = matchDepartmentCode(ip.department);
      if (code && depts[code]) {
        depts[code].ips += 1;
        depts[code].allItems.push(ip);
      }
    });

    return Object.values(depts).sort((a, b) => b.budget - a.budget);
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  const actionList = useMemo(() => {
    const expiringSoon: any[] = [];
    validResearch.forEach((r) => {
      const tl = calculateProjectTimeline(r);
      if (tl.status === 'active' && tl.days_remaining > 0 && tl.days_remaining <= 90) {
        expiringSoon.push({ ...r, _tl: tl });
      }
    });

    const redKpis = kpiScorecard.filter((k) => k.status.label === 'ต้องเร่งรัด');
    const avgBudget = departmentStats.reduce((sum, d) => sum + d.budget, 0) / (departmentStats.length || 1);
    const belowAvgDepts = departmentStats.filter((d) => d.budget < avgBudget * 0.4);

    return { expiringSoon, redKpis, belowAvgDepts };
  }, [validResearch, kpiScorecard, departmentStats]);

  const handleExportMaster = () => {
    exportMonthlyExecutiveMasterExcel(
      {
        research: validResearch,
        academic: validAcademic,
        publications: validPub,
        service: validService,
        ip: validIP,
      },
      getTimeFilterLabel(timeFilter),
      kpiScorecard
    );
  };

  const handleSnapshot = () => {
    const snap = saveReportSnapshot(
      `รายงานผู้บริหาร ณ วันที่ ${new Date().toLocaleDateString('th-TH')}`,
      getTimeFilterLabel(timeFilter),
      {
        kpis: kpiScorecard.map((k) => ({
          code: k.code,
          title: k.title,
          actual: k.actual,
          target: k.target,
          percent: k.percent,
        })),
        researchCount: validResearch.length,
        pubCount: validPub.length,
      }
    );
    setSnapshotToast(`บันทึก Snapshot งวดรายงานสำเร็จ (${snap?.name})`);
    setTimeout(() => setSnapshotToast(null), 4000);
  };

  return {
    isLiveFromDb,
    isRefreshing,
    snapshotToast,
    kpiScorecard,
    departmentStats,
    actionList,
    validResearch,
    validAcademic,
    validPub,
    validService,
    validIP,
    fetchLiveData,
    handleExportMaster,
    handleSnapshot,
  };
}
