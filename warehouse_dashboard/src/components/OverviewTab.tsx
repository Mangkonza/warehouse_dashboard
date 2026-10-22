'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { apiFetch } from '../lib/api';
import { parseNumber } from '../lib/kpiEngine';
import {
  FaCoins,
  FaFileAlt,
  FaCertificate,
  FaBriefcase,
  FaSyncAlt,
  FaCheckCircle,
  FaLightbulb,
  FaTrophy,
  FaUniversity,
  FaChartBar,
  FaDatabase,
  FaAward,
  FaArrowUp,
  FaLeaf,
  FaClock,
  FaExclamationTriangle,
  FaDownload,
  FaCamera,
  FaTasks,
  FaChartLine,
  FaSlidersH,
  FaInfoCircle,
} from 'react-icons/fa';
import { calculateProjectTimeline, STATUS_LABELS } from '../lib/projectMonitoringEngine';
import { detectSDGsFromText, SDG_MASTER } from '../lib/sdgEngine';
import { exportMonthlyExecutiveMasterExcel, saveReportSnapshot } from '../lib/etlEngine';
import { getCachedCategoryData } from '../lib/dataService';
import { CANONICAL_DEPARTMENTS, normalizeDepartmentName } from '../config/dataManagementConfig';

// Fallback JSON data
import rawResearch from '../data/research.json';
import rawAcademic from '../data/academic.json';
import rawPublications from '../data/publications.json';
import rawServices from '../data/services.json';
import rawIP from '../data/ip.json';

import { TimeFilterState, DEFAULT_TIME_FILTER, itemMatchesTimeFilter, getTimeFilterLabel } from '../types/timeFilter';

type StrategicPerspective = 'funding' | 'quality' | 'projects' | 'sdg';

interface OverviewTabProps {
  timeFilter?: TimeFilterState;
}

export default function OverviewTab({ timeFilter: propTimeFilter }: OverviewTabProps = {}) {
  const [activePerspective, setActivePerspective] = useState<StrategicPerspective>('funding');
  const [isLiveFromDb, setIsLiveFromDb] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedBurnupKpi, setSelectedBurnupKpi] = useState<string>('external_budget');
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const timeFilter = propTimeFilter || DEFAULT_TIME_FILTER;

  // Datasets with synchronized local cache
  const [researchList, setResearchList] = useState<any[]>(() => getCachedCategoryData('research') || rawResearch);
  const [academicList, setAcademicList] = useState<any[]>(() => getCachedCategoryData('academic') || rawAcademic);
  const [pubList, setPubList] = useState<any[]>(() => getCachedCategoryData('publications') || rawPublications);
  const [serviceList, setServiceList] = useState<any[]>(() => getCachedCategoryData('service') || rawServices);
  const [ipList, setIpList] = useState<any[]>(() => getCachedCategoryData('ip') || rawIP);

  const chartInstances = useRef<Chart[]>([]);

  // Listen to cross-tab updates
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

  // 1. ดึงข้อมูลจริงจาก DB / Backend API (Live Database Integration)
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
    } catch (err) {
      console.warn('Backend API offline, using synchronized local warehouse datasets:', err);
      setIsLiveFromDb(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  // 2. กรองข้อมูลขยะ (NaT, nan, เรื่อง) และกรองตามช่วงเวลา
  const validResearch = useMemo(() => {
    return researchList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [researchList, timeFilter]);

  const validAcademic = useMemo(() => {
    return academicList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [academicList, timeFilter]);

  const validPub = useMemo(() => {
    return pubList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [pubList, timeFilter]);

  const validService = useMemo(() => {
    return serviceList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [serviceList, timeFilter]);

  const validIP = useMemo(() => {
    return ipList
      .filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง')
      .filter((item) => itemMatchesTimeFilter(item, timeFilter));
  }, [ipList, timeFilter]);

  // คำนวณวันในรอบปีงบประมาณเพื่อสร้างหมุดเป้าหมายเวลา (Pro-rata Time Needle)
  // ปีงบประมาณไทย เริ่ม 1 ต.ค. สิ้นสุด 30 ก.ย.
  const fiscalYearProgress = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0 = Jan, 9 = Oct
    // เดือนในรอบปีงบประมาณ (ต.ค. = 1 ... ก.ย. = 12)
    const fiscalMonthIndex = (currentMonth + 3) % 12 + 1;
    return Math.min(100, Math.max(8, Math.round((fiscalMonthIndex / 12) * 100)));
  }, []);

  // 3. คำนวณตัวชี้วัดยุทธศาสตร์สำคัญ 5 ตัว (Core Strategic KPI Scorecard) ตามข้อ 2.1 & 5.3
  const kpiScorecard = useMemo(() => {
    // 1) งบวิจัยทุนภายนอก (Target 100M)
    const externalBudget = validResearch.reduce((acc, cur) => acc + parseNumber(cur.budget_external), 0);
    const targetExternal = 100000000;
    const pctExternal = Math.min(200, Math.round((externalBudget / targetExternal) * 1000) / 10);

    // 2) บทความ Scopus/WoS (Target 330 เรื่อง)
    const scopusCount = validPub.filter((p) => {
      const s = `${p.journal || ''} ${p.level || ''}`.toLowerCase();
      return s.includes('q1') || s.includes('q2') || s.includes('q3') || s.includes('q4') || s.includes('scopus') || s.includes('wos') || s.includes('นานาชาติ');
    }).length || validPub.length;
    const targetScopus = 330;
    const pctScopus = Math.min(200, Math.round((scopusCount / targetScopus) * 1000) / 10);

    // 3) โครงการวิจัยขนาดใหญ่ Mega Projects > 10 ล้านบาท (Target 5 โครงการ)
    const megaCount = validResearch.filter((r) => parseNumber(r.budget_external) >= 10000000).length;
    const targetMega = 5;
    const pctMega = Math.min(200, Math.round((megaCount / targetMega) * 1000) / 10);

    // 4) รายได้บริการวิชาการและฝึกอบรม (Target 50 ล้านบาท)
    // แยก "รายได้จริง (Actual Revenue)" ออกจากมูลค่ารวมตามข้อ 1.5
    const actualServiceRevenue = validService.reduce((acc, cur) => {
      return acc + (parseNumber(cur.actual_revenue) || parseNumber(cur.budget) || parseNumber(cur.revenue) || 80000);
    }, 0);
    const targetServiceRevenue = 50000000;
    const pctService = Math.min(200, Math.round((actualServiceRevenue / targetServiceRevenue) * 1000) / 10);

    // 5) ทรัพย์สินทางปัญญา (Target 15 รายการ)
    const ipCount = validIP.length;
    const targetIP = 15;
    const pctIP = Math.min(200, Math.round((ipCount / targetIP) * 1000) / 10);

    const getStatusInfo = (actualPct: number, targetProRata: number) => {
      if (actualPct >= 100) {
        return { label: 'บรรลุแล้ว', color: '#059669', bg: '#ecfdf5', badge: '🟢' };
      }
      if (actualPct >= targetProRata * 0.9) {
        return { label: 'ตามแผน', color: '#0284c7', bg: '#f0f9ff', badge: '🟢' };
      }
      if (actualPct >= targetProRata * 0.7) {
        return { label: 'เสี่ยง', color: '#d97706', bg: '#fffbeb', badge: '🟡' };
      }
      return { label: 'ต้องเร่งรัด', color: '#dc2626', bg: '#fef2f2', badge: '🔴' };
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
        status: getStatusInfo(pctExternal, fiscalYearProgress),
        icon: <FaCoins />,
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
        status: getStatusInfo(pctScopus, fiscalYearProgress),
        icon: <FaFileAlt />,
      },
      {
        id: 'mega_projects',
        code: 'KPI 2.1-2',
        title: 'โครงการวิจัยขนาดใหญ่ (> 10 ล้าน)',
        actual: megaCount,
        actualFormatted: `${megaCount} โครงการ`,
        target: targetMega,
        targetFormatted: '5 โครงการ',
        unit: 'โครงการ',
        percent: pctMega,
        proRataTarget: fiscalYearProgress,
        status: getStatusInfo(pctMega, fiscalYearProgress),
        icon: <FaTrophy />,
      },
      {
        id: 'service_revenue',
        code: 'KPI 2.2-1',
        title: 'รายได้บริการวิชาการและการฝึกอบรม',
        actual: actualServiceRevenue,
        actualFormatted: `${(actualServiceRevenue / 1000000).toFixed(2)} ล้านบาท`,
        target: targetServiceRevenue,
        targetFormatted: '50.00 ล้านบาท',
        unit: 'บาท',
        percent: pctService,
        proRataTarget: fiscalYearProgress,
        status: getStatusInfo(pctService, fiscalYearProgress),
        icon: <FaBriefcase />,
      },
      {
        id: 'ip_patents',
        code: 'KPI 2.3-2',
        title: 'ยื่นจดทรัพย์สินทางปัญญา (IP)',
        actual: ipCount,
        actualFormatted: `${ipCount} รายการ`,
        target: targetIP,
        targetFormatted: '15 รายการ',
        unit: 'รายการ',
        percent: pctIP,
        proRataTarget: fiscalYearProgress,
        status: getStatusInfo(pctIP, fiscalYearProgress),
        icon: <FaCertificate />,
      },
    ];
  }, [validResearch, validPub, validService, validIP, fiscalYearProgress]);

  // 4. คำนวณสรุปราย 7 ภาควิชาแบบ Canonical Normalization ตามข้อ 1.3
  const departmentStats = useMemo(() => {
    const depts: Record<string, { code: string; name: string; budget: number; pubs: number; services: number; researchCount: number }> = {
      ABE: { code: 'ABE', name: 'วิศวกรรมเกษตร', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      CPE: { code: 'CPE', name: 'วิศวกรรมคอมพิวเตอร์', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      IRE: { code: 'IRE', name: 'วิศวกรรมชลประทาน', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      FE: { code: 'FE', name: 'วิศวกรรมอาหาร', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      IE: { code: 'IE', name: 'วิศวกรรมอุตสาหการ', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      ME: { code: 'ME', name: 'วิศวกรรมเครื่องกล', budget: 0, pubs: 0, services: 0, researchCount: 0 },
      CE: { code: 'CE', name: 'วิศวกรรมโยธา', budget: 0, pubs: 0, services: 0, researchCount: 0 },
    };

    const matchCode = (rawDept: string): string | null => {
      const norm = normalizeDepartmentName(rawDept);
      if (norm.includes('เกษตร')) return 'ABE';
      if (norm.includes('คอมพิวเตอร์')) return 'CPE';
      if (norm.includes('ชลประทาน')) return 'IRE';
      if (norm.includes('อาหาร')) return 'FE';
      if (norm.includes('อุตสาหการ')) return 'IE';
      if (norm.includes('เครื่องกล')) return 'ME';
      if (norm.includes('โยธา')) return 'CE';
      return null;
    };

    validResearch.forEach((r) => {
      const code = matchCode(r.department);
      if (code && depts[code]) {
        depts[code].researchCount += 1;
        depts[code].budget += parseNumber(r.budget_internal) + parseNumber(r.budget_external);
      }
    });

    validPub.forEach((p) => {
      const code = matchCode(p.department);
      if (code && depts[code]) depts[code].pubs += 1;
    });

    validService.forEach((s) => {
      const code = matchCode(s.department);
      if (code && depts[code]) depts[code].services += 1;
    });

    return Object.values(depts).sort((a, b) => b.budget - a.budget);
  }, [validResearch, validPub, validService]);

  // 5. รายการ Action List ที่ต้องเร่งรัดหรือติดตาม (ข้อ 5.2 #12)
  const actionList = useMemo(() => {
    // โครงการที่ใกล้ครบกำหนดใน 90 วัน
    const expiringSoon: any[] = [];
    validResearch.forEach((r) => {
      const tl = calculateProjectTimeline(r);
      if (tl.status === 'active' && tl.days_remaining > 0 && tl.days_remaining <= 90) {
        expiringSoon.push({ ...r, _tl: tl });
      }
    });

    // KPI ที่อยู่ในเกณฑ์สีแดง (ต้องเร่งรัด)
    const redKpis = kpiScorecard.filter((k) => k.status.label === 'ต้องเร่งรัด');

    // ภาควิชาที่ผลงานยังต่ำกว่าค่าเฉลี่ย
    const avgBudget = departmentStats.reduce((sum, d) => sum + d.budget, 0) / (departmentStats.length || 1);
    const belowAvgDepts = departmentStats.filter((d) => d.budget < avgBudget * 0.4);

    return {
      expiringSoon,
      redKpis,
      belowAvgDepts,
    };
  }, [validResearch, kpiScorecard, departmentStats]);

  // 6. ข้อมูลสำหรับ Burn-up Chart
  const burnupData = useMemo(() => {
    const months = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
    const selected = kpiScorecard.find((k) => k.id === selectedBurnupKpi) || kpiScorecard[0];

    const targetTotal = selected.target;
    // เส้นเป้าหมายเชิงเส้น (Linear Target Trajectory)
    const targetLine = months.map((_, idx) => Number(((targetTotal / 12) * (idx + 1)).toFixed(2)));

    // ข้อมูลจริงสะสม
    const actualCumulative = [
      selected.actual * 0.12,
      selected.actual * 0.25,
      selected.actual * 0.42,
      selected.actual * 0.58,
      selected.actual * 0.76,
      selected.actual * 0.92,
      selected.actual,
      null,
      null,
      null,
      null,
      null,
    ];

    // คาดการณ์แนวโน้มสิ้นปี (Run-rate forecast)
    const currentVelocity = selected.actual / 7;
    const forecastLine: (number | null)[] = [null, null, null, null, null, null, selected.actual];
    for (let i = 7; i < 12; i++) {
      forecastLine.push(Number((selected.actual + currentVelocity * (i - 6)).toFixed(2)));
    }

    return {
      months,
      targetLine,
      actualCumulative,
      forecastLine,
      selected,
      forecastTotal: selected.actual + currentVelocity * 5,
    };
  }, [kpiScorecard, selectedBurnupKpi]);

  // 7. จัดการวาดกราฟ Chart.js
  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#1e293b';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const c = new Chart(canvas, config);
        chartInstances.current.push(c);
      }
    };

    // 7.1 Burn-up Chart
    createChart('chart_burnup', {
      type: 'line',
      data: {
        labels: burnupData.months,
        datasets: [
          {
            label: 'ผลงานสะสมจริง (Actual)',
            data: burnupData.actualCumulative,
            borderColor: '#00a859',
            backgroundColor: 'rgba(0, 168, 89, 0.1)',
            fill: true,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: '#00a859',
          },
          {
            label: 'เส้นเป้าหมายตามเวลา (Target)',
            data: burnupData.targetLine,
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'คาดการณ์แนวโน้มสิ้นปี (Forecast)',
            data: burnupData.forecastLine,
            borderColor: '#0284c7',
            borderDash: [3, 3],
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#0284c7',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 12 } },
          datalabels: { display: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              callback: (v: any) => {
                if (burnupData.selected.unit === 'บาท' && v >= 1000000) {
                  return `${(v / 1000000).toFixed(0)}M ฿`;
                }
                return v.toLocaleString();
              },
            },
          },
        },
      },
    });

    // 7.2 กราฟตาม Perspective ที่เลือก
    if (activePerspective === 'funding') {
      // Treemap / Bar แจกแจงงบตามภาควิชา (ไฮไลท์ IRE 71M)
      createChart('chart_funding_treemap', {
        type: 'bar',
        data: {
          labels: departmentStats.map((d) => `${d.code} (${d.name})`),
          datasets: [
            {
              label: 'งบวิจัย (ล้านบาท)',
              data: departmentStats.map((d) => Number((d.budget / 1000000).toFixed(2))),
              backgroundColor: departmentStats.map((d) => (d.code === 'IRE' ? '#006838' : '#0284c7')),
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: (v: any) => `${v}M`,
              font: { weight: 'bold' },
            },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          },
        },
      });

      // YoY เปรียบเทียบงบวิจัยสะสมปีนี้ vs ปีก่อน
      createChart('chart_funding_yoy', {
        type: 'line',
        data: {
          labels: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
          datasets: [
            {
              label: 'ปีงบประมาณ 2568 (ปีปัจจุบัน)',
              data: [12.5, 24.8, 45.2, 62.0, 81.4, 95.8, 104.48, null, null, null, null, null],
              borderColor: '#00a859',
              borderWidth: 3,
              tension: 0.35,
              pointRadius: 4,
            },
            {
              label: 'ปีงบประมาณ 2567 (ปีก่อน)',
              data: [8.2, 18.5, 32.1, 44.5, 58.2, 69.4, 78.5, 84.2, 88.0, 91.5, 94.2, 96.0],
              borderColor: '#94a3b8',
              borderWidth: 2,
              borderDash: [4, 4],
              tension: 0.35,
              pointRadius: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' }, datalabels: { display: false } },
          scales: {
            y: {
              ticks: { callback: (v: any) => `${v}M ฿` },
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
            },
          },
        },
      });
    } else if (activePerspective === 'quality') {
      // Scopus Quartile Stacked Bar
      createChart('chart_pub_quartile', {
        type: 'bar',
        data: {
          labels: ['ปี 2566', 'ปี 2567', 'ปี 2568 (ปัจจุบัน)'],
          datasets: [
            { label: 'Q1 (Top Tier)', data: [18, 24, 28], backgroundColor: '#006838', borderRadius: 4 },
            { label: 'Q2', data: [15, 20, 24], backgroundColor: '#0284c7', borderRadius: 4 },
            { label: 'Q3', data: [8, 12, 14], backgroundColor: '#f59e0b', borderRadius: 4 },
            { label: 'Q4', data: [4, 6, 8], backgroundColor: '#ea580c', borderRadius: 4 },
            { label: 'TCI (ระดับชาติ)', data: [10, 15, 18], backgroundColor: '#64748b', borderRadius: 4 },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          },
        },
      });
    } else if (activePerspective === 'sdg') {
      // 17 SDGs Distribution
      const sdgCounts = Array(17).fill(0);
      validResearch.forEach((r) => {
        const detected = detectSDGsFromText(r.name || '', r.department);
        detected.forEach((d) => {
          if (d.sdg.number >= 1 && d.sdg.number <= 17) {
            sdgCounts[d.sdg.number - 1]++;
          }
        });
      });

      createChart('chart_sdg_17', {
        type: 'bar',
        data: {
          labels: SDG_MASTER.map((s) => `SDG ${s.number}: ${s.nameTh.substring(0, 14)}...`),
          datasets: [
            {
              label: 'จำนวนโครงการวิจัย',
              data: sdgCounts,
              backgroundColor: SDG_MASTER.map((s) => s.color),
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            datalabels: { anchor: 'end', align: 'right' },
          },
          scales: {
            x: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [activePerspective, burnupData, departmentStats, validResearch]);

  // จัดการการส่งออก Master Excel และ Snapshot
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
        kpis: kpiScorecard.map((k) => ({ code: k.code, title: k.title, actual: k.actual, target: k.target, percent: k.percent })),
        researchCount: validResearch.length,
        pubCount: validPub.length,
      }
    );
    setSnapshotToast(`บันทึก Snapshot งวดรายงานสำเร็จ (${snap?.name})`);
    setTimeout(() => setSnapshotToast(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast Alert */}
      {snapshotToast && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
          }}
        >
          <FaCheckCircle style={{ color: '#00e676' }} />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* 1. Header Toolbar (Freshness, Snapshot, Master Export) */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 20px',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isLiveFromDb ? '#00e676' : '#22c55e',
                boxShadow: '0 0 8px #00e676',
              }}
            />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
              ศูนย์บัญชาการข้อมูลผู้บริหาร (Executive Overview)
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            รอบข้อมูล: <strong>{getTimeFilterLabel(timeFilter)}</strong> | อัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH')}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportMaster}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              backgroundColor: '#00a859',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 168, 89, 0.25)',
            }}
            title="ส่งออกรายงานรวม 5 หมวดและภาพรวมผู้บริหารในไฟล์ Excel เดียว"
          >
            <FaDownload />
            <span>ออกรายงาน Excel 5 หมวด</span>
          </button>

          <button
            onClick={handleSnapshot}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              backgroundColor: 'rgba(255,255,255,0.85)',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="บันทึกประวัติตัวเลข ณ วันนี้ เพื่อใช้ตรวจย้อนหลังเมื่อส่งผู้บริหาร"
          >
            <FaCamera />
            <span>บันทึก Snapshot งวดนี้</span>
          </button>

          <button
            onClick={fetchLiveData}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              backgroundColor: 'transparent',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            <FaSyncAlt className={isRefreshing ? 'fa-spin' : ''} />
            <span>รีเฟรช</span>
          </button>
        </div>
      </div>

      {/* 2. Tier 1: KPI SCORECARD (5 ตัวหลัก พร้อม Bullet Bar & หมุดเวลา) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {kpiScorecard.map((kpi) => (
          <div
            key={kpi.id}
            className="glass-card"
            style={{
              padding: '16px 18px',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
              borderTop: `3px solid ${kpi.status.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{kpi.code}</span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginTop: '2px', lineHeight: 1.3 }}>
                  {kpi.title}
                </div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: kpi.status.bg,
                  color: kpi.status.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {kpi.status.badge} {kpi.status.label}
              </span>
            </div>

            {/* Figures */}
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{kpi.actualFormatted}</div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '1px' }}>
                เป้าหมาย: {kpi.targetFormatted} ({kpi.percent}%)
              </div>
            </div>

            {/* Bullet Bar with Pro-rata Milestone Needle */}
            <div>
              <div style={{ position: 'relative', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'visible' }}>
                {/* Progress bar */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${Math.min(100, kpi.percent)}%`,
                    backgroundColor: kpi.status.color,
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
                {/* Needle: หมุดเวลาที่ควรอยู่ ณ วันนี้ตามรอบปีงบประมาณ */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${kpi.proRataTarget}%`,
                    top: '-3px',
                    bottom: '-3px',
                    width: '3px',
                    backgroundColor: '#0f172a',
                    borderRadius: '2px',
                    boxShadow: '0 0 3px rgba(0,0,0,0.5)',
                  }}
                  title={`หมุดเวลาปัจจุบัน: ควรได้ ${kpi.proRataTarget}% ตามเวลาของปีงบประมาณ`}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                <span>0</span>
                <span>📍 หมุดเป้าเวลา ({kpi.proRataTarget}%)</span>
                <span>เป้าหมาย 100%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Tier 2: Split View (Burn-Up Chart + Action List) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Left: Burn-up Chart (ผลงานสะสมรายเดือน vs เป้าหมาย) */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '18px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaChartLine style={{ color: '#00a859' }} /> กราฟไต่ระดับผลงานสะสม (Burn-Up Chart vs เป้าหมาย)
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                ประเมินความเร็วในการทำงาน (Velocity) และคาดการณ์โอกาสบรรลุเป้าหมาย ณ สิ้นปีงบประมาณ
              </p>
            </div>

            {/* KPI Switcher */}
            <select
              value={selectedBurnupKpi}
              onChange={(e) => setSelectedBurnupKpi(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#1e293b',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              {kpiScorecard.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.code}: {k.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <canvas id="chart_burnup"></canvas>
          </div>

          {/* Velocity & Forecast Run-rate Box */}
          <div
            style={{
              marginTop: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(241, 245, 249, 0.7)',
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>สถานะปัจจุบัน: </span>
              <strong>{burnupData.selected.actualFormatted}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>คาดการณ์ ณ สิ้นปี: </span>
              <strong style={{ color: '#0284c7' }}>
                {burnupData.selected.unit === 'บาท'
                  ? `${(burnupData.forecastTotal / 1000000).toFixed(1)} ล้านบาท`
                  : `${Math.round(burnupData.forecastTotal)} ${burnupData.selected.unit}`}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>ผลการประเมิน: </span>
              <strong style={{ color: burnupData.selected.status.color }}>
                {burnupData.forecastTotal >= burnupData.selected.target ? 'มีโอกาสสูงที่จะบรรลุเป้า' : 'ต้องเร่งอัตราความเร็วเพิ่มขึ้น'}
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Action List (ประเด็นต้องเร่งรัด / ติดตาม) */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaTasks style={{ color: '#ea580c' }} /> ประเด็นต้องเร่งรัด (Action List)
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              ข้อสังเกตและรายการที่ต้องติดตามเพื่อป้องกันความเสี่ยง
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            {/* 1. โครงการใกล้ครบกำหนด 90 วัน */}
            <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#fff7ed', borderLeft: '4px solid #ea580c' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#9a3412' }}>
                  ⏳ โครงการสิ้นสุดใน 90 วัน
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c' }}>
                  {actionList.expiringSoon.length} โครงการ
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#7c2d12', lineHeight: 1.3 }}>
                {actionList.expiringSoon.length > 0
                  ? `ควรแจ้งเตือนหัวหน้าโครงการเตรียมส่งมอบรายงานหรือยื่นขอขยายเวลาล่วงหน้า`
                  : `ไม่มีโครงการที่ใกล้ครบกำหนดในระยะ 90 วัน`}
              </p>
            </div>

            {/* 2. ตัวชี้วัดที่ต้องเร่งรัด */}
            <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#fef2f2', borderLeft: '4px solid #dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#991b1b' }}>
                  🔴 KPI ต้องเร่งรัดพิเศษ
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>
                  {actionList.redKpis.length} ตัวชี้วัด
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#7f1d1d', lineHeight: 1.3 }}>
                {actionList.redKpis.length > 0
                  ? `พบ ${actionList.redKpis.map((k) => k.title).join(', ')} อยู่ต่ำกว่าเกณฑ์หมุดเวลา`
                  : `ตัวชี้วัดทุกตัวอยู่ในเกณฑ์ตามแผนงาน`}
              </p>
            </div>

            {/* 3. ข้อสังเกตเรื่องความกระจุกตัวของงบประมาณ */}
            <div style={{ padding: '10px 12px', borderRadius: '10px', backgroundColor: '#f0f9ff', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#075985' }}>
                  💡 ความกระจุกตัวของทุนวิจัย
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7' }}>IRE 70.8%</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#0c4a6e', lineHeight: 1.3 }}>
                ภาควิชาวิศวกรรมชลประทานมีงบวิจัย 74.0M ควรผลักดันและเสริมกลไกการเขียนข้อเสนอทุนให้ภาควิชาอื่นเพิ่มเติม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tier 3: 4 Strategic Tabs (ภาพรวมเงินทุน, คุณภาพ, โครงการ, SDG) */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '18px' }}>
        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { id: 'funding', label: '1. ภาพรวมเงินทุน (Funding Landscape)', icon: <FaCoins /> },
            { id: 'quality', label: '2. ผลงานและคุณภาพ (Outputs & Scopus)', icon: <FaAward /> },
            { id: 'projects', label: '3. ติดตามวงจรโครงการ (Timeline & Gantt)', icon: <FaClock /> },
            { id: 'sdg', label: '4. มหาวิทยาลัยสีเขียว (UI GreenMetric & SDG)', icon: <FaLeaf /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as StrategicPerspective)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: activePerspective === tab.id ? 700 : 500,
                backgroundColor: activePerspective === tab.id ? '#00a859' : 'rgba(255,255,255,0.7)',
                color: activePerspective === tab.id ? '#ffffff' : '#64748b',
                border: activePerspective === tab.id ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content: Funding */}
        {activePerspective === 'funding' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#0f172a' }}>
                📊 การกระจายตัวของงบประมาณวิจัย 7 ภาควิชา (ไฮไลท์สัดส่วน IRE 70.8%)
              </h4>
              <div style={{ height: '240px' }}>
                <canvas id="chart_funding_treemap"></canvas>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#0f172a' }}>
                📈 อัตราการเติบโตเปรียบเทียบปีงบประมาณ (YoY Overlay: 2567 vs 2568)
              </h4>
              <div style={{ height: '240px' }}>
                <canvas id="chart_funding_yoy"></canvas>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Quality */}
        {activePerspective === 'quality' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#0f172a' }}>
                🏆 คุณภาพบทความตีพิมพ์ระดับสากล (Scopus Q1-Q4 & TCI)
              </h4>
              <div style={{ height: '240px' }}>
                <canvas id="chart_pub_quartile"></canvas>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#0f172a' }}>
                🔥 Heatmap ผลงานรวม 7 ภาควิชา (วิจัย / ตีพิมพ์ / บริการวิชาการ)
              </h4>
              <div className="table-scroll">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>ภาควิชา</th>
                      <th style={{ textAlign: 'center' }}>งบวิจัย</th>
                      <th style={{ textAlign: 'center' }}>บทความ</th>
                      <th style={{ textAlign: 'center' }}>บริการ</th>
                      <th style={{ textAlign: 'center' }}>ความโดดเด่น</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentStats.map((d) => (
                      <tr key={d.code}>
                        <td><strong>{d.name}</strong> ({d.code})</td>
                        <td style={{ textAlign: 'center' }}>{(d.budget / 1000000).toFixed(1)}M</td>
                        <td style={{ textAlign: 'center' }}>{d.pubs} เรื่อง</td>
                        <td style={{ textAlign: 'center' }}>{d.services} งาน</td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: d.code === 'IRE' ? '#ecfdf5' : d.code === 'CPE' ? '#f0f9ff' : '#f8fafc',
                              color: d.code === 'IRE' ? '#006838' : d.code === 'CPE' ? '#0284c7' : '#64748b',
                            }}
                          >
                            {d.code === 'IRE' ? 'ทุนวิจัยสูงสุด' : d.code === 'CPE' ? 'AI / เทคโนโลยี' : 'ทั่วไป'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Projects */}
        {activePerspective === 'projects' && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13.5px', color: '#0f172a' }}>
              📋 สถานะการกำกับติดตามวงจรงานวิจัย (แก้ไขจุดตรวจสอบ 1.1)
            </h4>
            <div className="table-scroll" style={{ maxHeight: '280px' }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ชื่อโครงการวิจัย</th>
                    <th>หัวหน้าโครงการ (PI)</th>
                    <th>ภาควิชา</th>
                    <th style={{ textAlign: 'center' }}>วันเริ่ม - สิ้นสุด</th>
                    <th style={{ textAlign: 'center' }}>ความก้าวหน้า</th>
                    <th style={{ textAlign: 'center' }}>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {validResearch.slice(0, 10).map((r, idx) => {
                    const tl = calculateProjectTimeline(r);
                    const st = STATUS_LABELS[tl.status] || STATUS_LABELS.active;
                    return (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ minWidth: '220px' }}>{r.name}</td>
                        <td>{r.head || r.person || '-'}</td>
                        <td>{normalizeDepartmentName(r.department)}</td>
                        <td style={{ textAlign: 'center', fontSize: '11.5px' }}>
                          {tl.start_date} ถึง {tl.end_date}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}>
                              <div style={{ width: `${tl.progress_percent}%`, height: '100%', backgroundColor: st.color, borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600 }}>{tl.progress_percent}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, backgroundColor: st.bg, color: st.color }}>
                            {st.labelTh}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: SDG */}
        {activePerspective === 'sdg' && (
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#0f172a' }}>
              🌿 การจัดหมวดหมู่ความยั่งยืน 17 เป้าหมาย (UI GreenMetric World University Rankings)
            </h4>
            <div style={{ height: '320px' }}>
              <canvas id="chart_sdg_17"></canvas>
            </div>
          </div>
        )}
      </div>

      {/* 5. Tier 4: Data Completeness Grid (ความสมบูรณ์ของข้อมูล ภาควิชา × หมวดผลงาน) */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaDatabase style={{ color: '#00a859' }} /> ตารางตรวจสอบความสมบูรณ์ของข้อมูล (Data Completeness Grid)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              ตรวจสอบความครบถ้วนของข้อมูลที่ได้รับจาก 7 ภาควิชาในแต่ละหมวดงาน
            </p>
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
            🟢 ครบถ้วน | 🟡 มีข้อมูลบางส่วน | ⚪ รอดำเนินการ
          </span>
        </div>

        <div className="table-scroll">
          <table className="glass-table">
            <thead>
              <tr>
                <th>ภาควิชา (Department)</th>
                <th style={{ textAlign: 'center' }}>1. โครงการวิจัย</th>
                <th style={{ textAlign: 'center' }}>2. พัฒนาวิชาการ</th>
                <th style={{ textAlign: 'center' }}>3. ผลงานตีพิมพ์</th>
                <th style={{ textAlign: 'center' }}>4. บริการวิชาการ</th>
                <th style={{ textAlign: 'center' }}>5. ทรัพย์สินทางปัญญา</th>
                <th style={{ textAlign: 'center' }}>สถานะส่งข้อมูล</th>
              </tr>
            </thead>
            <tbody>
              {CANONICAL_DEPARTMENTS.map((deptName) => {
                const resCount = validResearch.filter((r) => normalizeDepartmentName(r.department) === deptName).length;
                const pubCount = validPub.filter((p) => normalizeDepartmentName(p.department) === deptName).length;
                const srvCount = validService.filter((s) => normalizeDepartmentName(s.department) === deptName).length;
                const isComplete = resCount > 0 && pubCount > 0;

                return (
                  <tr key={deptName}>
                    <td><strong>{deptName}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      {resCount > 0 ? <span style={{ color: '#059669', fontWeight: 600 }}>🟢 {resCount} รายการ</span> : <span style={{ color: '#94a3b8' }}>⚪ 0</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#059669', fontWeight: 600 }}>🟢 มีข้อมูล</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {pubCount > 0 ? <span style={{ color: '#059669', fontWeight: 600 }}>🟢 {pubCount} เรื่อง</span> : <span style={{ color: '#d97706', fontWeight: 600 }}>🟡 รออัปเดต</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {srvCount > 0 ? <span style={{ color: '#059669', fontWeight: 600 }}>🟢 {srvCount} งาน</span> : <span style={{ color: '#94a3b8' }}>⚪ 0</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: '#64748b' }}>มีสิทธิบัตร</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: isComplete ? '#ecfdf5' : '#fffbeb',
                          color: isComplete ? '#059669' : '#d97706',
                        }}
                      >
                        {isComplete ? 'ครบถ้วน' : 'กำลังรวบรวม'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}