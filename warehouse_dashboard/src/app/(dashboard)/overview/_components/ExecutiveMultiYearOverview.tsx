'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { parseNumber } from '@/lib/kpiEngine';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/data-display';
import { CategoryKey } from '@/config/dataManagementConfig';
import {
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaChartLine,
  FaCoins,
  FaExchangeAlt,
  FaLayerGroup,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
} from 'react-icons/fa';

interface ExecutiveMultiYearOverviewProps {
  researchList: any[];
  academicList: any[];
  pubList: any[];
  serviceList: any[];
  ipList: any[];
  allResearchRaw?: any[];
  allAcademicRaw?: any[];
  allPubRaw?: any[];
  allServiceRaw?: any[];
  allIpRaw?: any[];
}

export interface MissionCategoryConfig {
  key: CategoryKey;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

export const MISSION_CATEGORIES: MissionCategoryConfig[] = [
  {
    key: 'research',
    label: 'โครงการวิจัย',
    shortLabel: 'วิจัย',
    color: '#00A651',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    icon: FaFlask,
  },
  {
    key: 'academic',
    label: 'โครงการพัฒนาวิชาการ',
    shortLabel: 'พัฒนาวิชาการ',
    color: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    icon: FaGraduationCap,
  },
  {
    key: 'publications',
    label: 'ผลงานตีพิมพ์ทางวิชาการ',
    shortLabel: 'ตีพิมพ์',
    color: '#e11d48',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    icon: FaBook,
  },
  {
    key: 'service',
    label: 'งานบริการวิชาการ',
    shortLabel: 'บริการวิชาการ',
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    icon: FaHandsHelping,
  },
  {
    key: 'ip',
    label: 'งานทรัพย์สินทางปัญญา',
    shortLabel: 'ทรัพย์สินฯ',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    icon: FaCertificate,
  },
];

// ฟังก์ชันสกัดปีงบประมาณอัจฉริยะ รองรับทั้ง fiscal_year_be, id, fund_source, start_date และ 196x
export const extractFiscalYear = (item: any): string => {
  if (!item) return '2568';

  // 0. ตรวจจากฟิลด์ปีงบประมาณตรง ๆ (เช่น fiscal_year_be, fiscal_year)
  for (const key of ['fiscal_year_be', 'fiscal_year']) {
    const val = String(item[key] || '');
    const m = val.match(/25(6[6-9]|70)/);
    if (m) return `25${m[1]}`;
  }

  // 1. ตรวจจาก id เช่น "วศ.กพส. 1/2569", "YF(KU) 37.68", "PRP 6805031920"
  const idStr = String(item.id || item._id || '').replace(/\n/g, ' ');
  const idMatch = idStr.match(/(?:25|20)(\d{2})/);
  if (idMatch) {
    const yr = idMatch[1];
    if (Number(yr) >= 66 && Number(yr) <= 70) {
      return `25${yr}`;
    }
  }
  const shortIdMatch = idStr.match(/(?:\/|\.)(6[6-9]|70)\b/);
  if (shortIdMatch) {
    return `25${shortIdMatch[1]}`;
  }

  // 2. ตรวจจากแหล่งทุน fund_source
  const fundStr = String(item.fund_source || '');
  const fundMatch = fundStr.match(/25(6[6-9]|70)/);
  if (fundMatch) {
    return `25${fundMatch[1]}`;
  }

  // 3. ตรวจจากวันที่ (filing_date, start_date, date, academic_year, year, month_year)
  const dateStr = String(
    item.filing_date ||
      item.start_date ||
      item.date ||
      item.academic_year ||
      item.year ||
      item.month_year ||
      ''
  );
  // กรณีพิมพ์ปีเพี้ยน 1968 -> 2568
  const legacyMatch = dateStr.match(/19(6[6-9]|70)/);
  if (legacyMatch) {
    return `25${legacyMatch[1]}`;
  }
  const thMatch = dateStr.match(/25(6[6-9]|70)/);
  if (thMatch) {
    return `25${thMatch[1]}`;
  }
  const enMatch = dateStr.match(/20(2[3-7])/);
  if (enMatch) {
    const y = parseInt(enMatch[1], 10) + 43;
    return `25${y}`;
  }

  return '2568';
};

export const YEARS = ['2566', '2567', '2568', '2569', '2570'];

export const ExecutiveMultiYearOverview: React.FC<ExecutiveMultiYearOverviewProps> = ({
  researchList,
  academicList,
  pubList,
  serviceList,
  ipList,
  allResearchRaw,
  allAcademicRaw,
  allPubRaw,
  allServiceRaw,
  allIpRaw,
}) => {
  // สวิตช์โหมดหลัก: ปริมาณผลงาน (5 พันธกิจ) | ยอดงบประมาณ (5 พันธกิจ) | เปรียบเทียบระหว่างปี (YoY)
  const [activeMetricMode, setActiveMetricMode] = useState<'volume' | 'budget' | 'compare'>('volume');

  // สวิตช์รูปแบบกราฟสำหรับโหมด volume และ budget
  const [volumeChartType, setVolumeChartType] = useState<'grouped' | 'stacked' | 'line'>('grouped');
  const [budgetChartType, setBudgetChartType] = useState<'grouped' | 'stacked'>('grouped');

  // ค่าเลือกเปรียบเทียบในโหมด YoY
  const [compareBaseYear, setCompareBaseYear] = useState<string>('2567');
  const [compareTargetYear, setCompareTargetYear] = useState<string>('2568');
  const [compareMetric, setCompareMetric] = useState<'count' | 'budget'>('count');

  // Drill-down Drawer state
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    accentColor?: string;
    categoryKey?: CategoryKey;
    items: any[];
  }>({
    isOpen: false,
    title: '',
    items: [],
  });

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // ใช้ข้อมูลดิบทั้งหมดสำหรับกราฟแนวโน้มข้ามปี เพื่อไม่ให้ถูกฟิลเตอร์จำกัด
  const sourceResearch = allResearchRaw && allResearchRaw.length > 0 ? allResearchRaw : researchList;
  const sourceAcademic = allAcademicRaw && allAcademicRaw.length > 0 ? allAcademicRaw : academicList;
  const sourcePub = allPubRaw && allPubRaw.length > 0 ? allPubRaw : pubList;
  const sourceService = allServiceRaw && allServiceRaw.length > 0 ? allServiceRaw : serviceList;
  const sourceIP = allIpRaw && allIpRaw.length > 0 ? allIpRaw : ipList;

  // คำนวณสถิติจริงรายปี (2566-2570) ครบ 5 หมวด
  const yearlyStats = useMemo(() => {
    const data: Record<
      string,
      {
        researchCount: number;
        researchExternal: number;
        researchInternal: number;
        researchTotalBudget: number;
        researchItems: any[];

        academicCount: number;
        academicBudget: number;
        academicItems: any[];

        pubCount: number;
        pubBudget: number;
        pubItems: any[];

        serviceCount: number;
        serviceRevenue: number;
        serviceItems: any[];

        ipCount: number;
        ipBudget: number;
        ipItems: any[];
      }
    > = {};

    YEARS.forEach((y) => {
      data[y] = {
        researchCount: 0,
        researchExternal: 0,
        researchInternal: 0,
        researchTotalBudget: 0,
        researchItems: [],

        academicCount: 0,
        academicBudget: 0,
        academicItems: [],

        pubCount: 0,
        pubBudget: 0,
        pubItems: [],

        serviceCount: 0,
        serviceRevenue: 0,
        serviceItems: [],

        ipCount: 0,
        ipBudget: 0,
        ipItems: [],
      };
    });

    sourceResearch.forEach((r) => {
      const y = extractFiscalYear(r);
      if (data[y]) {
        data[y].researchCount += 1;
        const ext = parseNumber(r.budget_external);
        const int = parseNumber(r.budget_internal);
        data[y].researchExternal += ext;
        data[y].researchInternal += int;
        data[y].researchTotalBudget += ext + int;
        data[y].researchItems.push(r);
      }
    });

    sourceAcademic.forEach((a) => {
      const y = extractFiscalYear(a);
      if (data[y]) {
        data[y].academicCount += 1;
        data[y].academicBudget += parseNumber(a.budget);
        data[y].academicItems.push(a);
      }
    });

    sourcePub.forEach((p) => {
      const y = extractFiscalYear(p);
      if (data[y]) {
        data[y].pubCount += 1;
        data[y].pubBudget += parseNumber(p.budget) || parseNumber(p.support_amount) || 0;
        data[y].pubItems.push(p);
      }
    });

    sourceService.forEach((s) => {
      const y = extractFiscalYear(s);
      if (data[y]) {
        data[y].serviceCount += 1;
        data[y].serviceRevenue += parseNumber(s.actual_revenue) || parseNumber(s.budget) || 0;
        data[y].serviceItems.push(s);
      }
    });

    sourceIP.forEach((ip) => {
      const y = extractFiscalYear(ip);
      if (data[y]) {
        data[y].ipCount += 1;
        data[y].ipBudget += parseNumber(ip.support_amount) || parseNumber(ip.budget) || 0;
        data[y].ipItems.push(ip);
      }
    });

    return data;
  }, [sourceResearch, sourceAcademic, sourcePub, sourceService, sourceIP]);

  // สรุปยอดรวมสำหรับ 5 การ์ดบน (ตามรายการที่เลือกในหน้าปัจจุบัน)
  const currentTotals = useMemo(() => {
    const researchExt = researchList.reduce((acc, r) => acc + parseNumber(r.budget_external), 0);
    const researchInt = researchList.reduce((acc, r) => acc + parseNumber(r.budget_internal), 0);
    const researchBudget = researchExt + researchInt;

    const academicBudget = academicList.reduce((acc, a) => acc + parseNumber(a.budget), 0);
    const pubBudget = pubList.reduce((acc, p) => acc + (parseNumber(p.budget) || parseNumber(p.support_amount) || 0), 0);
    const serviceRevenue = serviceList.reduce(
      (acc, s) => acc + (parseNumber(s.actual_revenue) || parseNumber(s.budget) || 0),
      0
    );
    const ipBudget = ipList.reduce(
      (acc, ip) => acc + (parseNumber(ip.support_amount) || parseNumber(ip.budget) || 0),
      0
    );

    return {
      researchBudget,
      researchExt,
      researchInt,
      academicBudget,
      pubBudget,
      serviceRevenue,
      ipBudget,
    };
  }, [researchList, academicList, pubList, serviceList, ipList]);

  // เปิด Drill-down modal จากการ์ดหรือกราฟ
  const openDrillDown = (catKey: CategoryKey, year?: string) => {
    const catConfig = MISSION_CATEGORIES.find((c) => c.key === catKey);
    if (!catConfig) return;

    let items: any[] = [];
    let title = '';
    let subtitle = '';

    if (year && yearlyStats[year]) {
      const stat = yearlyStats[year];
      if (catKey === 'research') items = stat.researchItems;
      else if (catKey === 'academic') items = stat.academicItems;
      else if (catKey === 'publications') items = stat.pubItems;
      else if (catKey === 'service') items = stat.serviceItems;
      else if (catKey === 'ip') items = stat.ipItems;

      title = `${catConfig.label} • ปีงบประมาณ ${year}`;
      subtitle = `พบข้อมูลรวม ${items.length} รายการ จากฐานข้อมูลระบบ`;
    } else {
      if (catKey === 'research') items = researchList;
      else if (catKey === 'academic') items = academicList;
      else if (catKey === 'publications') items = pubList;
      else if (catKey === 'service') items = serviceList;
      else if (catKey === 'ip') items = ipList;

      title = `${catConfig.label} (ข้อมูลปัจจุบัน)`;
      subtitle = `รวมรายการตามเงื่อนไขตัวกรอง ${items.length} รายการ`;
    }

    setDrillDownState({
      isOpen: true,
      title,
      subtitle,
      accentColor: catConfig.color,
      categoryKey: catKey,
      items,
    });
  };

  // เรนเดอร์กราฟ Chart.js
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    if (!chartCanvasRef.current) return;
    Chart.register(ChartDataLabels);

    let chartData: any;
    let chartOptions: any;

    if (activeMetricMode === 'volume') {
      const isLine = volumeChartType === 'line';
      const isStacked = volumeChartType === 'stacked';

      chartData = {
        labels: YEARS,
        datasets: [
          {
            type: isLine ? 'line' : 'bar',
            label: 'โครงการวิจัย',
            data: YEARS.map((y) => yearlyStats[y].researchCount),
            backgroundColor: '#00A651',
            borderColor: '#00A651',
            borderRadius: isLine ? 0 : 5,
            borderWidth: isLine ? 3 : 0,
            tension: 0.3,
            pointRadius: isLine ? 5 : 0,
            stack: isStacked ? 'total' : undefined,
          },
          {
            type: isLine ? 'line' : 'bar',
            label: 'โครงการพัฒนาวิชาการ',
            data: YEARS.map((y) => yearlyStats[y].academicCount),
            backgroundColor: '#0284c7',
            borderColor: '#0284c7',
            borderRadius: isLine ? 0 : 5,
            borderWidth: isLine ? 3 : 0,
            tension: 0.3,
            pointRadius: isLine ? 5 : 0,
            stack: isStacked ? 'total' : undefined,
          },
          {
            type: isLine ? 'line' : 'bar',
            label: 'ผลงานตีพิมพ์ทางวิชาการ',
            data: YEARS.map((y) => yearlyStats[y].pubCount),
            backgroundColor: '#e11d48',
            borderColor: '#e11d48',
            borderRadius: isLine ? 0 : 5,
            borderWidth: isLine ? 3 : 0,
            tension: 0.3,
            pointRadius: isLine ? 5 : 0,
            stack: isStacked ? 'total' : undefined,
          },
          {
            type: isLine ? 'line' : 'bar',
            label: 'งานบริการวิชาการ',
            data: YEARS.map((y) => yearlyStats[y].serviceCount),
            backgroundColor: '#d97706',
            borderColor: '#d97706',
            borderRadius: isLine ? 0 : 5,
            borderWidth: isLine ? 3 : 0,
            tension: 0.3,
            pointRadius: isLine ? 5 : 0,
            stack: isStacked ? 'total' : undefined,
          },
          {
            type: isLine ? 'line' : 'bar',
            label: 'งานทรัพย์สินทางปัญญา',
            data: YEARS.map((y) => yearlyStats[y].ipCount),
            backgroundColor: '#7c3aed',
            borderColor: '#7c3aed',
            borderRadius: isLine ? 0 : 5,
            borderWidth: isLine ? 3 : 0,
            tension: 0.3,
            pointRadius: isLine ? 5 : 0,
            stack: isStacked ? 'total' : undefined,
          },
        ],
      };

      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any, chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const catOrder: CategoryKey[] = ['research', 'academic', 'publications', 'service', 'ip'];
            const targetCat = catOrder[hit.datasetIndex] || 'research';
            const targetYear = YEARS[hit.index] || '2568';
            openDrillDown(targetCat, targetYear);
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { size: 12, weight: 600 },
              usePointStyle: isLine,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => ` ${context.dataset.label}: ${context.raw} รายการ`,
            },
          },
          datalabels: {
            anchor: isStacked ? 'center' : 'end',
            align: isStacked ? 'center' : 'top',
            font: { size: 10, weight: 'bold' },
            formatter: (v: number) => (v > 0 ? `${v}` : ''),
            display: (context: any) => {
              const val = context.dataset.data[context.dataIndex];
              return typeof val === 'number' && val > 0;
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            stacked: isStacked,
          },
          y: {
            beginAtZero: true,
            stacked: isStacked,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              precision: 0,
              callback: (val: any) => `${val} รายการ`,
            },
          },
        },
      };
    } else if (activeMetricMode === 'budget') {
      const isStacked = budgetChartType === 'stacked';

      chartData = {
        labels: YEARS,
        datasets: [
          {
            type: 'bar',
            label: 'โครงการวิจัย (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].researchTotalBudget / 1000000).toFixed(2))),
            backgroundColor: '#00A651',
            borderRadius: 5,
            stack: isStacked ? 'budget_total' : undefined,
          },
          {
            type: 'bar',
            label: 'โครงการพัฒนาวิชาการ (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].academicBudget / 1000000).toFixed(2))),
            backgroundColor: '#0284c7',
            borderRadius: 5,
            stack: isStacked ? 'budget_total' : undefined,
          },
          {
            type: 'bar',
            label: 'ผลงานตีพิมพ์ทางวิชาการ (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].pubBudget / 1000000).toFixed(2))),
            backgroundColor: '#e11d48',
            borderRadius: 5,
            stack: isStacked ? 'budget_total' : undefined,
          },
          {
            type: 'bar',
            label: 'งานบริการวิชาการ (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].serviceRevenue / 1000000).toFixed(2))),
            backgroundColor: '#d97706',
            borderRadius: 5,
            stack: isStacked ? 'budget_total' : undefined,
          },
          {
            type: 'bar',
            label: 'งานทรัพย์สินทางปัญญา (ล้านบาท)',
            data: YEARS.map((y) => Number((yearlyStats[y].ipBudget / 1000000).toFixed(2))),
            backgroundColor: '#7c3aed',
            borderRadius: 5,
            stack: isStacked ? 'budget_total' : undefined,
          },
        ],
      };

      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any, chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const catOrder: CategoryKey[] = ['research', 'academic', 'publications', 'service', 'ip'];
            const targetCat = catOrder[hit.datasetIndex] || 'research';
            const targetYear = YEARS[hit.index] || '2568';
            openDrillDown(targetCat, targetYear);
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 12, font: { size: 12, weight: 600 } },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => ` ${context.dataset.label}: ${context.raw} ล้านบาท`,
            },
          },
          datalabels: {
            anchor: isStacked ? 'center' : 'end',
            align: isStacked ? 'center' : 'top',
            font: { size: 10, weight: 'bold' },
            formatter: (v: number) => (v > 0 ? `${v}M` : ''),
            display: (context: any) => {
              const val = context.dataset.data[context.dataIndex];
              return typeof val === 'number' && val > 0;
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            stacked: isStacked,
          },
          y: {
            beginAtZero: true,
            stacked: isStacked,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              callback: (val: any) => `${val}M `,
            },
          },
        },
      };
    } else {
      // โหมดเปรียบเทียบระหว่างปี (YoY Comparison)
      const baseStat = yearlyStats[compareBaseYear] || yearlyStats['2567'];
      const targetStat = yearlyStats[compareTargetYear] || yearlyStats['2568'];

      const categoriesLabels = [
        '1. โครงการวิจัย',
        '2. โครงการพัฒนาวิชาการ',
        '3. ผลงานตีพิมพ์',
        '4. งานบริการวิชาการ',
        '5. งานทรัพย์สินฯ',
      ];

      const baseData =
        compareMetric === 'count'
          ? [
              baseStat.researchCount,
              baseStat.academicCount,
              baseStat.pubCount,
              baseStat.serviceCount,
              baseStat.ipCount,
            ]
          : [
              Number((baseStat.researchTotalBudget / 1000000).toFixed(2)),
              Number((baseStat.academicBudget / 1000000).toFixed(2)),
              Number((baseStat.pubBudget / 1000000).toFixed(2)),
              Number((baseStat.serviceRevenue / 1000000).toFixed(2)),
              Number((baseStat.ipBudget / 1000000).toFixed(2)),
            ];

      const targetData =
        compareMetric === 'count'
          ? [
              targetStat.researchCount,
              targetStat.academicCount,
              targetStat.pubCount,
              targetStat.serviceCount,
              targetStat.ipCount,
            ]
          : [
              Number((targetStat.researchTotalBudget / 1000000).toFixed(2)),
              Number((targetStat.academicBudget / 1000000).toFixed(2)),
              Number((targetStat.pubBudget / 1000000).toFixed(2)),
              Number((targetStat.serviceRevenue / 1000000).toFixed(2)),
              Number((targetStat.ipBudget / 1000000).toFixed(2)),
            ];

      chartData = {
        labels: categoriesLabels,
        datasets: [
          {
            type: 'bar',
            label: `ปีฐาน (${compareBaseYear})`,
            data: baseData,
            backgroundColor: '#94a3b8',
            borderRadius: 6,
          },
          {
            type: 'bar',
            label: `ปีเปรียบเทียบ (${compareTargetYear})`,
            data: targetData,
            backgroundColor: '#00A651',
            borderRadius: 6,
          },
        ],
      };

      chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any, chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const catOrder: CategoryKey[] = ['research', 'academic', 'publications', 'service', 'ip'];
            const targetCat = catOrder[hit.index] || 'research';
            const chosenYear = hit.datasetIndex === 0 ? compareBaseYear : compareTargetYear;
            openDrillDown(targetCat, chosenYear);
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { boxWidth: 14, font: { size: 12, weight: 600 } },
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const unit = compareMetric === 'count' ? 'รายการ' : 'ล้านบาท';
                return ` ${context.dataset.label}: ${context.raw} ${unit}`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            font: { size: 11, weight: 'bold' },
            formatter: (v: number) => {
              if (v === 0) return '';
              return compareMetric === 'budget' ? `${v}M` : `${v}`;
            },
            display: (context: any) => {
              const val = context.dataset.data[context.dataIndex];
              return typeof val === 'number' && val > 0;
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              callback: (val: any) => (compareMetric === 'budget' ? `${val}M ` : val),
            },
          },
        },
      };
    }

    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [
    yearlyStats,
    activeMetricMode,
    volumeChartType,
    budgetChartType,
    compareBaseYear,
    compareTargetYear,
    compareMetric,
  ]);

  // คำนวณสรุปตารางเปรียบเทียบเชิงบริหาร (YoY Breakdown Table)
  const yoyComparisonRows = useMemo(() => {
    const baseStat = yearlyStats[compareBaseYear] || yearlyStats['2567'];
    const targetStat = yearlyStats[compareTargetYear] || yearlyStats['2568'];

    const missionDefinitions: {
      key: CategoryKey;
      name: string;
      icon: any;
      color: string;
      bgColor: string;
      getBase: () => number;
      getTarget: () => number;
    }[] = [
      {
        key: 'research',
        name: 'โครงการวิจัย',
        icon: FaFlask,
        color: '#00A651',
        bgColor: '#ecfdf5',
        getBase: () => (compareMetric === 'count' ? baseStat.researchCount : baseStat.researchTotalBudget / 1000000),
        getTarget: () => (compareMetric === 'count' ? targetStat.researchCount : targetStat.researchTotalBudget / 1000000),
      },
      {
        key: 'academic',
        name: 'โครงการพัฒนาวิชาการ',
        icon: FaGraduationCap,
        color: '#0284c7',
        bgColor: '#f0f9ff',
        getBase: () => (compareMetric === 'count' ? baseStat.academicCount : baseStat.academicBudget / 1000000),
        getTarget: () => (compareMetric === 'count' ? targetStat.academicCount : targetStat.academicBudget / 1000000),
      },
      {
        key: 'publications',
        name: 'ผลงานตีพิมพ์ทางวิชาการ',
        icon: FaBook,
        color: '#e11d48',
        bgColor: '#fff1f2',
        getBase: () => (compareMetric === 'count' ? baseStat.pubCount : baseStat.pubBudget / 1000000),
        getTarget: () => (compareMetric === 'count' ? targetStat.pubCount : targetStat.pubBudget / 1000000),
      },
      {
        key: 'service',
        name: 'งานบริการวิชาการ',
        icon: FaHandsHelping,
        color: '#d97706',
        bgColor: '#fffbeb',
        getBase: () => (compareMetric === 'count' ? baseStat.serviceCount : baseStat.serviceRevenue / 1000000),
        getTarget: () => (compareMetric === 'count' ? targetStat.serviceCount : targetStat.serviceRevenue / 1000000),
      },
      {
        key: 'ip',
        name: 'งานทรัพย์สินทางปัญญา (IP)',
        icon: FaCertificate,
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        getBase: () => (compareMetric === 'count' ? baseStat.ipCount : baseStat.ipBudget / 1000000),
        getTarget: () => (compareMetric === 'count' ? targetStat.ipCount : targetStat.ipBudget / 1000000),
      },
    ];

    let totalBase = 0;
    let totalTarget = 0;

    const rows = missionDefinitions.map((m) => {
      const baseVal = m.getBase();
      const targetVal = m.getTarget();
      const diff = targetVal - baseVal;

      totalBase += baseVal;
      totalTarget += targetVal;

      let growthPct = 0;
      let growthLabel = '0.0%';
      let growthType: 'up' | 'down' | 'neutral' = 'neutral';

      if (baseVal === 0) {
        if (targetVal > 0) {
          growthLabel = '+100% (ใหม่)';
          growthType = 'up';
        } else {
          growthLabel = '0.0%';
          growthType = 'neutral';
        }
      } else {
        growthPct = ((targetVal - baseVal) / baseVal) * 100;
        growthLabel = `${growthPct > 0 ? '+' : ''}${growthPct.toFixed(1)}%`;
        if (growthPct > 0.01) growthType = 'up';
        else if (growthPct < -0.01) growthType = 'down';
        else growthType = 'neutral';
      }

      return {
        key: m.key,
        name: m.name,
        icon: m.icon,
        color: m.color,
        bgColor: m.bgColor,
        baseVal,
        targetVal,
        diff,
        growthPct,
        growthLabel,
        growthType,
      };
    });

    const totalDiff = totalTarget - totalBase;
    let totalGrowthLabel = '0.0%';
    let totalGrowthType: 'up' | 'down' | 'neutral' = 'neutral';
    if (totalBase === 0) {
      if (totalTarget > 0) {
        totalGrowthLabel = '+100%';
        totalGrowthType = 'up';
      }
    } else {
      const gPct = ((totalTarget - totalBase) / totalBase) * 100;
      totalGrowthLabel = `${gPct > 0 ? '+' : ''}${gPct.toFixed(1)}%`;
      if (gPct > 0.01) totalGrowthType = 'up';
      else if (gPct < -0.01) totalGrowthType = 'down';
      else totalGrowthType = 'neutral';
    }

    return {
      rows,
      totals: {
        totalBase,
        totalTarget,
        totalDiff,
        totalGrowthLabel,
        totalGrowthType,
      },
    };
  }, [yearlyStats, compareBaseYear, compareTargetYear, compareMetric]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Executive Summary Cards (ยกระดับครบ 5 พันธกิจหลักตามสีมาตรฐาน) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
        }}
      >
        {/* การ์ดที่ 1: โครงการวิจัย */}
        <div
          onClick={() => openDrillDown('research')}
          title="คลิกเพื่อดูรายการโครงการวิจัยทั้งหมด"
          style={{
            backgroundColor: '#ffffff',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,166,81,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>โครงการวิจัย</span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a7f3d0',
              }}
            >
              <FaFlask style={{ color: '#00A651', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {(currentTotals.researchBudget / 1000000).toFixed(2)}{' '}
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#059669', marginTop: '4px', fontWeight: 500 }}>
            รวม {researchList.length} โครงการ (ภายนอก {(currentTotals.researchExt / 1000000).toFixed(1)}M • ภายใน{' '}
            {(currentTotals.researchInt / 1000000).toFixed(1)}M)
          </div>
        </div>

        {/* การ์ดที่ 2: โครงการพัฒนาวิชาการ */}
        <div
          onClick={() => openDrillDown('academic')}
          title="คลิกเพื่อดูรายการโครงการพัฒนาวิชาการทั้งหมด"
          style={{
            backgroundColor: '#ffffff',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(2,132,199,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>โครงการพัฒนาวิชาการ</span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bae6fd',
              }}
            >
              <FaGraduationCap style={{ color: '#0284c7', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {(currentTotals.academicBudget / 1000000).toFixed(2)}{' '}
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#0284c7', marginTop: '4px', fontWeight: 500 }}>
            {academicList.length} โครงการพัฒนา (ยกระดับหลักสูตรและศักยภาพ)
          </div>
        </div>

        {/* การ์ดที่ 3: ผลงานตีพิมพ์ทางวิชาการ */}
        <div
          onClick={() => openDrillDown('publications')}
          title="คลิกเพื่อดูรายการบทความตีพิมพ์ทั้งหมด"
          style={{
            backgroundColor: '#ffffff',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(225,29,72,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>ผลงานตีพิมพ์ทางวิชาการ</span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#fff1f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fecdd3',
              }}
            >
              <FaBook style={{ color: '#e11d48', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {pubList.length} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>เรื่อง</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#e11d48', marginTop: '4px', fontWeight: 500 }}>
            {currentTotals.pubBudget > 0
              ? `งบสนับสนุน ${(currentTotals.pubBudget / 1000).toFixed(0)}k บาท (Scopus/WoS/TCI)`
              : 'ฐานข้อมูล Scopus, WoS และ TCI'}
          </div>
        </div>

        {/* การ์ดที่ 4: งานบริการวิชาการ */}
        <div
          onClick={() => openDrillDown('service')}
          title="คลิกเพื่อดูรายการงานบริการวิชาการทั้งหมด"
          style={{
            backgroundColor: '#ffffff',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(217,119,6,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>งานบริการวิชาการ</span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #fde68a',
              }}
            >
              <FaHandsHelping style={{ color: '#d97706', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {(currentTotals.serviceRevenue / 1000000).toFixed(2)}{' '}
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#d97706', marginTop: '4px', fontWeight: 500 }}>
            {serviceList.length} งานบริการ (รายรับ & กิจกรรมบริการวิชาการ)
          </div>
        </div>

        {/* การ์ดที่ 5: งานทรัพย์สินทางปัญญา */}
        <div
          onClick={() => openDrillDown('ip')}
          title="คลิกเพื่อดูรายการทรัพย์สินทางปัญญาทั้งหมด"
          style={{
            backgroundColor: '#ffffff',
            padding: '16px 18px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>งานทรัพย์สินทางปัญญา (IP)</span>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: '#f5f3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ddd6fe',
              }}
            >
              <FaCertificate style={{ color: '#7c3aed', fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '8px' }}>
            {ipList.length} <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>รายการ</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#7c3aed', marginTop: '4px', fontWeight: 500 }}>
            {currentTotals.ipBudget > 0
              ? `งบสนับสนุน ${(currentTotals.ipBudget / 1000).toFixed(0)}k บาท (สิทธิบัตร/อนุสิทธิบัตร)`
              : 'สิทธิบัตรการประดิษฐ์ และอนุสิทธิบัตร'}
          </div>
        </div>
      </div>

      {/* 2. Multi-Year Trend Analysis & YoY Comparison (กราฟแนวโน้มและเปรียบเทียบรายปี 5 พันธกิจ) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Header และสวิตช์โหมดการวิเคราะห์ */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '14px',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaChartLine style={{ color: '#00A651' }} />
              <span>การเติบโตและแนวโน้มเปรียบเทียบรายปีงบ</span>
            </h3>
          </div>

          {/* สวิตช์สลับโหมดหลัก (3 โหมด) */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '8px',
              gap: '2px',
            }}
          >
            <button
              onClick={() => setActiveMetricMode('volume')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 13px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'volume' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'volume' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'volume' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'volume' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <FaLayerGroup style={{ color: activeMetricMode === 'volume' ? '#00A651' : '#94a3b8' }} />
              จำนวนผลงาน (5 พันธกิจ)
            </button>
            <button
              onClick={() => setActiveMetricMode('budget')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 13px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'budget' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'budget' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'budget' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'budget' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <FaCoins style={{ color: activeMetricMode === 'budget' ? '#0284c7' : '#94a3b8' }} />
              ยอดงบประมาณ (5 พันธกิจ)
            </button>
            <button
              onClick={() => setActiveMetricMode('compare')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 13px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeMetricMode === 'compare' ? '#ffffff' : 'transparent',
                color: activeMetricMode === 'compare' ? '#0f172a' : '#64748b',
                fontWeight: activeMetricMode === 'compare' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: activeMetricMode === 'compare' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <FaExchangeAlt style={{ color: activeMetricMode === 'compare' ? '#e11d48' : '#94a3b8' }} />
              เปรียบเทียบระหว่างปี (YoY)
            </button>
          </div>
        </div>

        {/* แถบควบคุมย่อยตามโหมดที่เลือก */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            marginBottom: '16px',
            border: '1px solid #e2e8f0',
          }}
        >
          {activeMetricMode === 'volume' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>รูปแบบกราฟ:</span>
                <div style={{ display: 'inline-flex', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '2px' }}>
                  <button
                    onClick={() => setVolumeChartType('grouped')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: volumeChartType === 'grouped' ? '#00A651' : 'transparent',
                      color: volumeChartType === 'grouped' ? '#ffffff' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    แท่งแยก (Grouped)
                  </button>
                  <button
                    onClick={() => setVolumeChartType('stacked')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: volumeChartType === 'stacked' ? '#00A651' : 'transparent',
                      color: volumeChartType === 'stacked' ? '#ffffff' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    แท่งสะสม (Stacked)
                  </button>
                  <button
                    onClick={() => setVolumeChartType('line')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: volumeChartType === 'line' ? '#00A651' : 'transparent',
                      color: volumeChartType === 'line' ? '#ffffff' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    เส้นแนวโน้ม (Line)
                  </button>
                </div>
              </div>
              
            </>
          )}

          {activeMetricMode === 'budget' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>รูปแบบกราฟงบประมาณ:</span>
                <div style={{ display: 'inline-flex', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '2px' }}>
                  <button
                    onClick={() => setBudgetChartType('grouped')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: budgetChartType === 'grouped' ? '#0284c7' : 'transparent',
                      color: budgetChartType === 'grouped' ? '#ffffff' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    แท่งแยกรายหมวด (Grouped)
                  </button>
                  <button
                    onClick={() => setBudgetChartType('stacked')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: budgetChartType === 'stacked' ? '#0284c7' : 'transparent',
                      color: budgetChartType === 'stacked' ? '#ffffff' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    แท่งงบรวมสะสม (Stacked)
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                * หน่วย: ล้านบาท (คำนวณจากงบโครงการวิจัย, งบพัฒนาวิชาการ, เงินสนับสนุนตีพิมพ์, รายรับบริการวิชาการ และเงินสนับสนุน IP)
              </div>
            </>
          )}

          {activeMetricMode === 'compare' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>ปีฐาน:</span>
                  <select
                    value={compareBaseYear}
                    onChange={(e) => setCompareBaseYear(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {YEARS.map((y) => (
                      <option key={`base-${y}`} value={y}>
                        ปีงบฯ {y}
                      </option>
                    ))}
                  </select>
                </div>

                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>เทียบกับ</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>ปีเปรียบเทียบ:</span>
                  <select
                    value={compareTargetYear}
                    onChange={(e) => setCompareTargetYear(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#00A651',
                      cursor: 'pointer',
                    }}
                  >
                    {YEARS.map((y) => (
                      <option key={`target-${y}`} value={y}>
                        ปีงบฯ {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ height: '18px', width: '1px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>มิติที่เปรียบเทียบ:</span>
                  <div style={{ display: 'inline-flex', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '2px' }}>
                    <button
                      onClick={() => setCompareMetric('count')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: compareMetric === 'count' ? '#00A651' : 'transparent',
                        color: compareMetric === 'count' ? '#ffffff' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      จำนวนรายการ (เรื่อง)
                    </button>
                    <button
                      onClick={() => setCompareMetric('budget')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: compareMetric === 'budget' ? '#00A651' : 'transparent',
                        color: compareMetric === 'budget' ? '#ffffff' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      งบประมาณ / รายรับ (ล้านบาท)
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
                เปรียบเทียบการเติบโต YoY ระหว่างปี {compareBaseYear} และ {compareTargetYear}
              </div>
            </>
          )}
        </div>

        {/* กราฟหลัก */}
        <div style={{ height: '340px', width: '100%', position: 'relative' }}>
          <canvas ref={chartCanvasRef} />
        </div>

        {/* ตารางวิเคราะห์เปรียบเทียบเชิงลึกรายปี (YoY Comparison Table) - แสดงเฉพาะในโหมด compare */}
        {activeMetricMode === 'compare' && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  ตารางวิเคราะห์ผลต่างและอัตราการเติบโตรายพันธกิจ (YoY Executive Breakdown)
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  ({compareMetric === 'count' ? 'มิติจำนวนรายการ/ผลงาน' : 'มิติยอดงบประมาณ/รายรับ'})
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                คลิกปุ่ม &quot;ดูรายการ&quot; เพื่อเปิดเจาะลึกข้อมูลโครงการจริงในแต่ละปี
              </span>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 600 }}>พันธกิจหลัก (5 หมวด)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>
                      ปีฐาน ({compareBaseYear})
                    </th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>
                      ปีเปรียบเทียบ ({compareTargetYear})
                    </th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>ผลต่าง (Δ)</th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>
                      อัตราการเติบโต (% Growth)
                    </th>
                    <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'center' }}>เจาะลึกข้อมูล</th>
                  </tr>
                </thead>
                <tbody>
                  {yoyComparisonRows.rows.map((row) => {
                    const IconComp = row.icon;
                    return (
                      <tr
                        key={row.key}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '6px',
                                backgroundColor: row.bgColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconComp style={{ color: row.color, fontSize: '13px' }} />
                            </div>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{row.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
                          {compareMetric === 'count'
                            ? `${row.baseVal} รายการ`
                            : `${row.baseVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ล้านบาท`}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                          {compareMetric === 'count'
                            ? `${row.targetVal} รายการ`
                            : `${row.targetVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ล้านบาท`}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>
                          <span
                            style={{
                              color: row.diff > 0 ? '#059669' : row.diff < 0 ? '#dc2626' : '#64748b',
                            }}
                          >
                            {row.diff > 0 ? `+${compareMetric === 'count' ? row.diff : row.diff.toFixed(2)}` : compareMetric === 'count' ? row.diff : row.diff.toFixed(2)}
                            {compareMetric === 'count' ? ' รายการ' : ' ล้านบาท'}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor:
                                row.growthType === 'up'
                                  ? '#ecfdf5'
                                  : row.growthType === 'down'
                                  ? '#fef2f2'
                                  : '#f1f5f9',
                              color:
                                row.growthType === 'up'
                                  ? '#059669'
                                  : row.growthType === 'down'
                                  ? '#dc2626'
                                  : '#64748b',
                              border:
                                row.growthType === 'up'
                                  ? '1px solid #a7f3d0'
                                  : row.growthType === 'down'
                                  ? '1px solid #fecaca'
                                  : '1px solid #e2e8f0',
                            }}
                          >
                            {row.growthType === 'up' && <FaArrowUp style={{ marginRight: '4px', fontSize: '9px' }} />}
                            {row.growthType === 'down' && <FaArrowDown style={{ marginRight: '4px', fontSize: '9px' }} />}
                            {row.growthType === 'neutral' && <FaMinus style={{ marginRight: '4px', fontSize: '9px' }} />}
                            {row.growthLabel}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openDrillDown(row.key, compareTargetYear)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#0f172a',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              title={`ดูรายการปี ${compareTargetYear}`}
                            >
                              ปี {compareTargetYear}
                            </button>
                            <button
                              onClick={() => openDrillDown(row.key, compareBaseYear)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '5px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#f8fafc',
                                color: '#64748b',
                                fontSize: '11px',
                                fontWeight: 500,
                                cursor: 'pointer',
                              }}
                              title={`ดูรายการปี ${compareBaseYear}`}
                            >
                              ปี {compareBaseYear}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* แถวสรุปรวมทั้งคณะ */}
                  <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0', fontWeight: 700 }}>
                    <td style={{ padding: '12px 14px', color: '#0f172a' }}>
                      รวมทั้งคณะ (ทั้ง 5 พันธกิจ)
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>
                      {compareMetric === 'count'
                        ? `${yoyComparisonRows.totals.totalBase} รายการ`
                        : `${yoyComparisonRows.totals.totalBase.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ล้านบาท`}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', color: '#0f172a' }}>
                      {compareMetric === 'count'
                        ? `${yoyComparisonRows.totals.totalTarget} รายการ`
                        : `${yoyComparisonRows.totals.totalTarget.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ล้านบาท`}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <span
                        style={{
                          color:
                            yoyComparisonRows.totals.totalDiff > 0
                              ? '#059669'
                              : yoyComparisonRows.totals.totalDiff < 0
                              ? '#dc2626'
                              : '#64748b',
                        }}
                      >
                        {yoyComparisonRows.totals.totalDiff > 0
                          ? `+${compareMetric === 'count' ? yoyComparisonRows.totals.totalDiff : yoyComparisonRows.totals.totalDiff.toFixed(2)}`
                          : compareMetric === 'count'
                          ? yoyComparisonRows.totals.totalDiff
                          : yoyComparisonRows.totals.totalDiff.toFixed(2)}
                        {compareMetric === 'count' ? ' รายการ' : ' ล้านบาท'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          backgroundColor:
                            yoyComparisonRows.totals.totalGrowthType === 'up'
                              ? '#ecfdf5'
                              : yoyComparisonRows.totals.totalGrowthType === 'down'
                              ? '#fef2f2'
                              : '#f1f5f9',
                          color:
                            yoyComparisonRows.totals.totalGrowthType === 'up'
                              ? '#059669'
                              : yoyComparisonRows.totals.totalGrowthType === 'down'
                              ? '#dc2626'
                              : '#64748b',
                          border:
                            yoyComparisonRows.totals.totalGrowthType === 'up'
                              ? '1px solid #a7f3d0'
                              : yoyComparisonRows.totals.totalGrowthType === 'down'
                              ? '1px solid #fecaca'
                              : '1px solid #e2e8f0',
                        }}
                      >
                        {yoyComparisonRows.totals.totalGrowthType === 'up' && (
                          <FaArrowUp style={{ marginRight: '4px', fontSize: '10px' }} />
                        )}
                        {yoyComparisonRows.totals.totalGrowthType === 'down' && (
                          <FaArrowDown style={{ marginRight: '4px', fontSize: '10px' }} />
                        )}
                        {yoyComparisonRows.totals.totalGrowthType === 'neutral' && (
                          <FaMinus style={{ marginRight: '4px', fontSize: '10px' }} />
                        )}
                        {yoyComparisonRows.totals.totalGrowthLabel}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: '#64748b', fontSize: '11.5px' }}>
                      สรุปภาพรวมคณะ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Drill-down Drawer */}
      <DrillDownProjectDrawer
        isOpen={drillDownState.isOpen}
        onClose={() => setDrillDownState((prev) => ({ ...prev, isOpen: false }))}
        title={drillDownState.title}
        subtitle={drillDownState.subtitle}
        accentColor={drillDownState.accentColor}
        categoryKey={drillDownState.categoryKey}
        items={drillDownState.items}
      />
    </div>
  );
};
