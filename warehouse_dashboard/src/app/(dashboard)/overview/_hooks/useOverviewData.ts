'use client';

import { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '@/lib/api';
import { parseNumber } from '@/lib/kpiEngine';
import { calculateProjectTimeline } from '@/lib/projectMonitoringEngine';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { matchDepartmentCode } from '@/config/departments';
import { exportMonthlyExecutiveMasterExcel, saveReportSnapshot } from '@/lib/etlEngine';
import {
  TimeFilterState,
  itemMatchesTimeFilter,
  getTimeFilterLabel,
  resolveItemDate,
  resolveItemFiscalYear,
} from '@/types/timeFilter';
import { isTestRecord } from '@/lib/sdgEngine';
import { CategoryKey } from '@/config/dataManagementConfig';
import { buildKpiScorecard } from '../_services/kpiScorecard';

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
  /** BE fiscal year this KPI is compared against (null when undated). */
  fiscalYear: string | null;
  /** True when the actual includes records that have no fiscal year. */
  includesUndated?: boolean;
  /** Publication tier counts (Q1–Q4, TCI 1–2) for the counted year. */
  tierBreakdown?: Record<string, number>;
  /** Remaining gap from target (0 when target achieved). */
  gap?: number;
  /** Human-readable gap text (e.g. "ขาดอีก 3 โครงการ", "ขาดอีก 75.50 ล้านบาท"). */
  gapFormatted?: string;
  items: any[];
  status: {
    label: string;
    color: string;
    bg: string;
  };
}

export interface UndatedCounts {
  research: number;
  academic: number;
  publications: number;
  service: number;
  ip: number;
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

const ACADEMIC_HEAD_DEPT_MAP: Record<string, string> = {
  'จักกริชพฤษการ': 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
  'พฤษพลตั้งสัจจะธรรม': 'ภาควิชาวิศวกรรมคอมพิวเตอร์',
  'ทรงศักดิ์ภัทราวุฒิชัย': 'ภาควิชาวิศวกรรมชลประทาน',
  'ไชยาพงษ์เทพประสิทธิ์': 'ภาควิชาวิศวกรรมชลประทาน',
  'ชัยศรีสุขสาโรจน์': 'ภาควิชาวิศวกรรมชลประทาน',
  'วิษุวัฒก์แต้สมบัติ': 'ภาควิชาวิศวกรรมชลประทาน',
  'นิธิรัชต์สงวนเดือน': 'ภาควิชาวิศวกรรมชลประทาน',
  'เกศวราสิทธิโชค': 'ภาควิชาวิศวกรรมชลประทาน',
  'เพ็ญพิชชาสนิทอินทร์': 'ภาควิชาวิศวกรรมโยธา',
  'นันทวัฒน์ขมหวาน': 'ภาควิชาวิศวกรรมโยธา',
  'กฤษณะจันทรโชติ': 'ภาควิชาวิศวกรรมโยธา',
  'ธนาชีพสมทรง': 'ภาควิชาวิศวกรรมเครื่องกล',
  'เบญญากสานติกุล': 'ภาควิชาวิศวกรรมเครื่องกล',
  'หทัยเทพวงศ์สุวรรณ': 'ภาควิชาวิศวกรรมเครื่องกล',
  'จิรเกียรติทรายทอง': 'ภาควิชาวิศวกรรมอุตสาหการ',
  'ธิติพงศ์โพธิสุทธิ์': 'ภาควิชาวิศวกรรมอาหาร',
  'วัชมาโพธิ์ทอง': 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
  'ศิริศักดิ์เชิดเกียรติพล': 'ศูนย์ทดสอบประตู หน้าต่าง และระบบผนังกระจกสำหรับงานอาคาร',
  'นิติรงค์พงษ์พานิช': 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  'ทิตินัยเทียนแย้ม': 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  'พิสิษฐ์อินทรวิรัตน์': 'ศูนย์เครื่องจักรกลการเกษตรแห่งชาติ',
  'นงลักษณ์เล็กรุ่งเรืองกิจ': 'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม',
  'อรรถวุทธิ์รื่นเริงใจ': 'ศูนย์ปฏิบัติการวิศวกรรมพลังงานและสิ่งแวดล้อม',
  'ศศิธรชลรัตน์อมฤต': 'สำนักงานเลขานุการ',
};

function resolveAcademicDept(head?: string, currentDept?: string): string {
  if (currentDept && currentDept !== '-' && currentDept !== 'nan' && currentDept !== 'undefined') return currentDept;
  if (!head) return '';
  const clean = head.replace(/[\s\n\r\t]/g, '').replace(/^(ศ\.|รศ\.|ผศ\.|อ\.|ดร\.|นาย|นาง|นางสาว|อาจารย์|ว่าที่ร\.ต\.)+/g, '');
  return ACADEMIC_HEAD_DEPT_MAP[clean] || '';
}

function isUsableItem(item: any): boolean {
  const name = item?.name;
  if (!name || name === 'nan' || name === 'NaT' || name === 'เรื่อง') return false;
  return !isTestRecord(item);
}

export function useOverviewData(timeFilter: TimeFilterState) {
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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
      const [resData, acaData, pubData, srvData, ipData] = await Promise.all([
        fetchCategoryData('research'),
        fetchCategoryData('academic'),
        fetchCategoryData('publications'),
        fetchCategoryData('service'),
        fetchCategoryData('ip'),
      ]);

      let liveCount = 0;
      if (resData && Array.isArray(resData) && resData.length > 0) {
        setResearchList(resData);
        liveCount++;
      }
      if (acaData && Array.isArray(acaData) && acaData.length > 0) {
        setAcademicList(acaData);
        liveCount++;
      }
      if (pubData && Array.isArray(pubData) && pubData.length > 0) {
        setPubList(pubData);
        liveCount++;
      }
      if (srvData && Array.isArray(srvData) && srvData.length > 0) {
        setServiceList(srvData);
        liveCount++;
      }
      if (ipData && Array.isArray(ipData) && ipData.length > 0) {
        setIpList(ipData);
        liveCount++;
      }

      setIsLiveFromDb(liveCount > 0);
      if (liveCount > 0) setLastUpdated(new Date());
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
      .filter(isUsableItem)
      .filter((item) => itemMatchesTimeFilter(item, timeFilter, 'research'))
      .map((item) => ({
        ...item,
        _categoryKey: 'research' as CategoryKey,
        _fiscalYear: resolveItemFiscalYear(item, 'research'),
      }));
  }, [researchList, timeFilter]);

  const validAcademic = useMemo(() => {
    return academicList
      .filter(isUsableItem)
      // Academic records carry only a Thai month name (no year), so they cannot
      // participate in a fiscal-year filter. Keep them visible instead of
      // silently emptying the mission.
      .filter((item) => itemMatchesTimeFilter(item, timeFilter, 'academic', { keepUndated: true }))
      .map((item) => {
        const resolvedDept = resolveAcademicDept(item.head, item.department);
        const fiscalYear = resolveItemFiscalYear(item, 'academic');
        return {
          ...item,
          department: resolvedDept || item.department,
          _categoryKey: 'academic' as CategoryKey,
          _fiscalYear: fiscalYear,
          _undatedFiscalYear: fiscalYear === null,
        };
      });
  }, [academicList, timeFilter]);

  const validPub = useMemo(() => {
    return pubList
      .filter(isUsableItem)
      .filter((item) => itemMatchesTimeFilter(item, timeFilter, 'publications'))
      .map((item) => ({
        ...item,
        _categoryKey: 'publications' as CategoryKey,
        _fiscalYear: resolveItemFiscalYear(item, 'publications'),
      }));
  }, [pubList, timeFilter]);

  const validService = useMemo(() => {
    return serviceList
      .filter(isUsableItem)
      .filter((item) => itemMatchesTimeFilter(item, timeFilter, 'service'))
      .map((item) => ({
        ...item,
        _categoryKey: 'service' as CategoryKey,
        _fiscalYear: resolveItemFiscalYear(item, 'service'),
      }));
  }, [serviceList, timeFilter]);

  const validIP = useMemo(() => {
    return ipList
      .filter(isUsableItem)
      .filter((item) => itemMatchesTimeFilter(item, timeFilter, 'ip'))
      .map((item) => ({
        ...item,
        _categoryKey: 'ip' as CategoryKey,
        _fiscalYear: resolveItemFiscalYear(item, 'ip'),
      }));
  }, [ipList, timeFilter]);

  /** How many usable records have no resolvable date, per category. */
  const undatedCounts: UndatedCounts = useMemo(() => {
    const count = (list: any[], category: string) =>
      list.filter(isUsableItem).filter((item) => resolveItemDate(item, category) === null).length;
    return {
      research: count(researchList, 'research'),
      academic: count(academicList, 'academic'),
      publications: count(pubList, 'publications'),
      service: count(serviceList, 'service'),
      ip: count(ipList, 'ip'),
    };
  }, [researchList, academicList, pubList, serviceList, ipList]);

  const kpiScorecard: OverviewKpiScore[] = useMemo(
    () =>
      buildKpiScorecard(
        { research: validResearch, academic: validAcademic, publications: validPub, service: validService, ip: validIP },
        { fiscalYear: timeFilter.mode === 'fiscal' ? timeFilter.fiscalYear : 'all' }
      ),
    [validResearch, validAcademic, validPub, validService, validIP, timeFilter]
  );

  const departmentStats: DepartmentOverviewStat[] = useMemo(() => {
    const depts: Record<string, DepartmentOverviewStat> = {
      AE: { code: 'AE', name: 'วิศวกรรมเกษตร', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      CPE: { code: 'CPE', name: 'วิศวกรรมคอมพิวเตอร์', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
      IRRE: { code: 'IRRE', name: 'วิศวกรรมชลประทาน', budget: 0, researchCount: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0, researchItems: [], allItems: [] },
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
    lastUpdated,
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
    undatedCounts,
    fetchLiveData,
    handleExportMaster,
    handleSnapshot,
  };
}
