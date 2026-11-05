'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FACT_DOMAINS_CONFIG } from '@/config/analyticsMetadata';
import { AnalyticsQuery, ChartType, FactDomainId, AggregationType } from '@/types/analyticsBuilder';
import { executeAnalyticsQuery } from '@/lib/analyticsEngine';
import { DrillDownProjectDrawer, DepartmentSelect, DepartmentBadge } from '@/components/ui';
import { CategoryKey } from '@/config/dataManagementConfig';
import { getDepartmentColor } from '@/lib/departments';
import { CANONICAL_DEPARTMENTS, matchDepartmentCode } from '@/config/departments';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { parseNumber } from '@/lib/kpiEngine';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaTable,
  FaDownload,
  FaLayerGroup,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandshake,
  FaCertificate,
  FaClock,
  FaSlidersH,
  FaWaveSquare,
  FaChartArea,
  FaProjectDiagram,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
} from 'react-icons/fa';

import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { useTimeFilter } from '@/features/time-filter';

const DOMAIN_THEMES: Record<FactDomainId, { color: string; bgColor: string; borderColor: string; textColor: string; badgeText: string }> = {
  research: { color: '#10B981', bgColor: '#ecfdf5', borderColor: '#a7f3d0', textColor: '#047857', badgeText: 'วิจัย (31)' },
  academic: { color: '#0EA5E9', bgColor: '#f0f9ff', borderColor: '#bae6fd', textColor: '#0369a1', badgeText: 'พัฒนาวิชาการ (69)' },
  publications: { color: '#F43F5E', bgColor: '#fff1f2', borderColor: '#fecdd3', textColor: '#be123c', badgeText: 'ตีพิมพ์ (68)' },
  service: { color: '#F59E0B', bgColor: '#fffbeb', borderColor: '#fed7aa', textColor: '#b45309', badgeText: 'บริการวิชาการ (305)' },
  ip: { color: '#8B5CF6', bgColor: '#f5f3ff', borderColor: '#ddd6fe', textColor: '#6d28d9', badgeText: 'ทรัพย์สินฯ (21)' },
  monitoring: { color: '#6366F1', bgColor: '#eef2ff', borderColor: '#c7d2fe', textColor: '#4338ca', badgeText: 'ติดตามงวดงาน (31)' },
};

const getDomainIcon = (id: FactDomainId) => {
  switch (id) {
    case 'research': return <FaFlask />;
    case 'academic': return <FaGraduationCap />;
    case 'publications': return <FaBook />;
    case 'service': return <FaHandshake />;
    case 'ip': return <FaCertificate />;
    case 'monitoring': return <FaClock />;
  }
};

interface ChartCategoryGroup {
  groupName: string;
  items: { type: ChartType; label: string; icon: any; desc: string }[];
}

const CHART_TYPES_CATALOG: ChartCategoryGroup[] = [
  {
    groupName: 'แผนภูมิแท่ง',
    items: [
      { type: 'bar', label: 'คอลัมน์แนวตั้ง', icon: <FaChartBar />, desc: 'เปรียบเทียบค่าระหว่างหมวดหมู่ชัดเจน' },
      { type: 'horizontal_bar', label: 'แถบแนวนอน', icon: <FaSlidersH />, desc: 'เหมาะกับชื่อหมวดยาวหรือข้อมูลหลายกลุ่ม' },
      { type: 'stacked_bar', label: 'แท่งซ้อนรวม', icon: <FaLayerGroup />, desc: 'แสดงผลรวมพร้อมสัดส่วนองค์ประกอบ' },
      { type: 'grouped_bar', label: 'กลุ่มเคียงข้าง', icon: <FaChartBar />, desc: 'เปรียบเทียบ 2 มิติเคียงข้างกัน' },
    ],
  },
  {
    groupName: 'แผนภูมิเส้นและพื้นที่',
    items: [
      { type: 'smooth_line', label: 'เส้นโค้งแนวโน้ม', icon: <FaWaveSquare />, desc: 'วิเคราะห์แนวโน้มตามลำดับเวลาอย่างนุ่มนวล' },
      { type: 'line', label: 'เส้นตรงมาตรฐาน', icon: <FaChartLine />, desc: 'ดูอัตราการเติบโตและการเปลี่ยนแปลง' },
      { type: 'area', label: 'พื้นที่ไล่เฉด', icon: <FaChartArea />, desc: 'เน้นปริมาณสะสมตามช่วงเวลา' },
      { type: 'stacked_area', label: 'พื้นที่ซ้อนชั้น', icon: <FaLayerGroup />, desc: 'แนวโน้มรวมและสัดส่วนย่อยตามเวลา' },
    ],
  },
  {
    groupName: 'แผนภูมิสัดส่วนและรัศมี',
    items: [
      { type: 'donut', label: 'โดนัทสัดส่วน', icon: <FaChartPie />, desc: 'เปรียบเทียบสัดส่วนเปอร์เซ็นต์สะดุดตา' },
      { type: 'pie', label: 'วงกลมคลาสสิก', icon: <FaChartPie />, desc: 'แสดงส่วนแบ่งตลาดหรือสัดส่วนรวม' },
      { type: 'polar', label: 'พื้นที่เชิงขั้ว', icon: <FaWaveSquare />, desc: 'ดูความแตกต่างของสัดส่วนในเชิงรัศมี' },
      { type: 'radar', label: 'ใยแมงมุม', icon: <FaLayerGroup />, desc: 'เปรียบเทียบสมรรถนะรอบด้านหลายมิติ' },
    ],
  },
  {
    groupName: 'สถิติและตารางสรุป',
    items: [
      { type: 'pivot', label: 'ตารางสรุป', icon: <FaTable />, desc: 'ตารางวิเคราะห์สถิติจริงพร้อมยอดรวม' },
    ],
  },
];

const QUICK_CHART_TYPES: { type: ChartType; label: string; icon: any }[] = [
  { type: 'bar', label: 'แท่งแนวตั้ง', icon: <FaChartBar /> },
  { type: 'horizontal_bar', label: 'แท่งแนวนอน', icon: <FaSlidersH /> },
  { type: 'stacked_bar', label: 'แท่งซ้อน', icon: <FaLayerGroup /> },
  { type: 'smooth_line', label: 'เส้นแนวโน้ม', icon: <FaWaveSquare /> },
  { type: 'donut', label: 'โดนัท', icon: <FaChartPie /> },
  { type: 'pivot', label: 'ตารางสรุป', icon: <FaTable /> },
];

export default function SelfServiceStudio() {
  const { filterProjectsByTime, setIsTimeModalOpen } = useTimeFilter('studio');
  const [studioMode, setStudioMode] = useState<'standard' | 'crossDomain'>('standard');
  const [showAllCharts, setShowAllCharts] = useState(false);
  const [hideMissingClients, setHideMissingClients] = useState(false);
  const [showAllServiceCategories, setShowAllServiceCategories] = useState(false);

  // Cross-Domain Configuration State
  const [crossAxisX, setCrossAxisX] = useState<'research_budget' | 'research_count' | 'academic_budget' | 'service_revenue'>('research_budget');
  const [crossAxisY, setCrossAxisY] = useState<'pub_total' | 'pub_scopus_q1_q2' | 'ip_count' | 'academic_count'>('pub_total');
  const [crossAxisZ, setCrossAxisZ] = useState<'bubble_projects' | 'bubble_none'>('bubble_projects');
  const [entityLevel, setEntityLevel] = useState<'dept' | 'units' | 'individual'>('dept');

  const [query, setQuery] = useState<AnalyticsQuery>({
    factDomain: 'research',
    measureId: 'total_budget',
    primaryDimensionId: 'department',
    secondaryDimensionId: '',
    aggregationFn: undefined,
    chartType: undefined,
    selectedDept: 'all',
  });

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const crossChartRef = useRef<HTMLCanvasElement | null>(null);
  const crossChartInstance = useRef<Chart | null>(null);

  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    items: any[];
    categoryKey?: CategoryKey;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    items: [],
  });

  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const dom = query.factDomain === 'monitoring' ? 'research' : query.factDomain;
    fetchCategoryData(dom).then(() => {
      if (isMounted) setDataVersion((v) => v + 1);
    });

    const handleUpdate = () => {
      setDataVersion((v) => v + 1);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('ku_data_updated', handleUpdate);
    };
  }, [query.factDomain]);

  // Current domain config
  const currentDomainDef = FACT_DOMAINS_CONFIG[query.factDomain];
  const activeTheme = DOMAIN_THEMES[query.factDomain] || DOMAIN_THEMES.research;

  // Datasets
  const currentDataset = useMemo(() => {
    let raw: any[] = [];
    switch (query.factDomain) {
      case 'research':
      case 'monitoring':
        raw = filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'research');
        break;
      case 'academic':
        raw = filterProjectsByTime(getCachedCategoryData('academic') || rawAcademic, 'academic');
        if (hideMissingClients) {
          raw = raw.filter((item) => {
            const c = String(item.client || item.target_group || '').trim();
            return c && c !== '-' && c !== 'nan' && c !== 'ไม่ระบุ';
          });
        }
        break;
      case 'publications':
        raw = filterProjectsByTime(getCachedCategoryData('publications') || rawPublications, 'publications');
        break;
      case 'service':
        raw = filterProjectsByTime(getCachedCategoryData('service') || rawServices, 'service');
        break;
      case 'ip':
        raw = filterProjectsByTime(getCachedCategoryData('ip') || rawIP, 'ip');
        break;
      default:
        raw = filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'research');
    }
    return raw;
  }, [query.factDomain, hideMissingClients, filterProjectsByTime, dataVersion]);

  // Cross Domain Analysis Data
  const crossDomainDeptData = useMemo(() => {
    const rawRes = filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'research');
    const rawAca = filterProjectsByTime(getCachedCategoryData('academic') || rawAcademic, 'academic');
    const rawPub = filterProjectsByTime(getCachedCategoryData('publications') || rawPublications, 'publications');
    const rawSrv = filterProjectsByTime(getCachedCategoryData('service') || rawServices, 'service');
    const rawIp = filterProjectsByTime(getCachedCategoryData('ip') || rawIP, 'ip');

    const matrix: Record<string, {
      code: string;
      name: string;
      researchBudget: number;
      researchCount: number;
      academicBudget: number;
      academicCount: number;
      serviceRevenue: number;
      pubTotal: number;
      pubHighTier: number;
      ipCount: number;
      rawResearchItems: any[];
      rawPubItems: any[];
      rawIpItems: any[];
    }> = {};

    CANONICAL_DEPARTMENTS.forEach((d) => {
      matrix[d.code] = {
        code: d.code,
        name: d.name,
        researchBudget: 0,
        researchCount: 0,
        academicBudget: 0,
        academicCount: 0,
        serviceRevenue: 0,
        pubTotal: 0,
        pubHighTier: 0,
        ipCount: 0,
        rawResearchItems: [],
        rawPubItems: [],
        rawIpItems: [],
      };
    });

    rawRes.forEach((r: any) => {
      const c = matchDepartmentCode(r.department);
      if (c && matrix[c]) {
        matrix[c].researchCount += 1;
        matrix[c].researchBudget += parseNumber(r.budget_external) + parseNumber(r.budget_internal);
        matrix[c].rawResearchItems.push(r);
      }
    });

    rawAca.forEach((a: any) => {
      const c = matchDepartmentCode(a.department);
      if (c && matrix[c]) {
        matrix[c].academicCount += 1;
        matrix[c].academicBudget += parseNumber(a.budget);
      }
    });

    rawPub.forEach((p: any) => {
      const c = matchDepartmentCode(p.department);
      if (c && matrix[c]) {
        matrix[c].pubTotal += 1;
        const tier = String(p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '')).toUpperCase();
        if (tier.startsWith('Q1') || tier.startsWith('Q2')) {
          matrix[c].pubHighTier += 1;
        }
        matrix[c].rawPubItems.push(p);
      }
    });

    rawSrv.forEach((s: any) => {
      const c = matchDepartmentCode(s.department);
      if (c && matrix[c]) {
        matrix[c].serviceRevenue += parseNumber(s.hours_spent) * 500;
      }
    });

    rawIp.forEach((i: any) => {
      const c = matchDepartmentCode(i.department);
      if (c && matrix[c]) {
        matrix[c].ipCount += 1;
        matrix[c].rawIpItems.push(i);
      }
    });

    return Object.values(matrix);
  }, [filterProjectsByTime, dataVersion]);

  // Total items across all 5 missions for Cross-Domain mode
  const totalCrossDomainCount = useMemo(() => {
    const r = (filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'research') || []).length;
    const a = (filterProjectsByTime(getCachedCategoryData('academic') || rawAcademic, 'academic') || []).length;
    const p = (filterProjectsByTime(getCachedCategoryData('publications') || rawPublications, 'publications') || []).length;
    const s = (filterProjectsByTime(getCachedCategoryData('service') || rawServices, 'service') || []).length;
    const ip = (filterProjectsByTime(getCachedCategoryData('ip') || rawIP, 'ip') || []).length;
    return r + a + p + s + ip;
  }, [filterProjectsByTime, dataVersion]);

  // Aggregated data using BI engine
  const aggregatedData = useMemo(() => {
    return executeAnalyticsQuery(query, currentDataset);
  }, [query, currentDataset]);

  // Auto-slice top 15 for crowded dimensions (e.g. Services target group)
  const isCrowded = aggregatedData.labels.length > 15;
  const displayChartData = useMemo(() => {
    if (!isCrowded || showAllServiceCategories) {
      return aggregatedData;
    }
    // Take top 15 by value
    const topIndices = aggregatedData.datasets[0]?.data
      .map((val: any, idx: number) => ({ val: Number(val) || 0, idx }))
      .sort((a: any, b: any) => b.val - a.val)
      .slice(0, 15)
      .map((item: any) => item.idx) || [];

    const slicedLabels = topIndices.map((i: number) => aggregatedData.labels[i]);
    const slicedDatasets = aggregatedData.datasets.map((ds: any) => ({
      ...ds,
      data: topIndices.map((i: number) => ds.data[i]),
    }));

    return {
      ...aggregatedData,
      labels: slicedLabels,
      datasets: slicedDatasets,
    };
  }, [aggregatedData, isCrowded, showAllServiceCategories]);

  const activeChartType = query.chartType || aggregatedData.recommendedChartType;

  // Render ChartJS
  useEffect(() => {
    if (studioMode !== 'standard' || !chartRef.current) return;
    if (activeChartType === 'pivot') return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    Chart.register(ChartDataLabels);

    let chartJsType: any = 'bar';
    const options: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: Boolean(query.secondaryDimensionId || activeChartType === 'donut' || activeChartType === 'pie'),
          position: 'bottom',
        },
        datalabels: {
          display: activeChartType !== 'donut' && activeChartType !== 'pie',
          anchor: 'end',
          align: activeChartType === 'horizontal_bar' ? 'right' : 'top',
          color: '#334155',
          font: { weight: 'bold', size: 10 },
          formatter: (v: number) => (v > 0 ? (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v.toLocaleString()) : ''),
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    };

    if (activeChartType === 'horizontal_bar') {
      options.indexAxis = 'y';
      options.scales.x.grid = { display: true };
      options.scales.y.grid = { display: false };
    } else if (activeChartType === 'stacked_bar') {
      options.scales.x.stacked = true;
      options.scales.y.stacked = true;
    } else if (activeChartType === 'donut') {
      chartJsType = 'doughnut';
      delete options.scales;
    } else if (activeChartType === 'pie') {
      chartJsType = 'pie';
      delete options.scales;
    } else if (activeChartType === 'smooth_line' || activeChartType === 'line') {
      chartJsType = 'line';
    }

    chartInstance.current = new Chart(ctx, {
      type: chartJsType,
      data: {
        labels: displayChartData.labels,
        datasets: displayChartData.datasets,
      },
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [displayChartData, activeChartType, studioMode, query.secondaryDimensionId]);

  // Render Cross-Domain Bubble Chart
  useEffect(() => {
    if (studioMode !== 'crossDomain' || !crossChartRef.current) return;

    if (crossChartInstance.current) {
      crossChartInstance.current.destroy();
      crossChartInstance.current = null;
    }

    const ctx = crossChartRef.current.getContext('2d');
    if (!ctx) return;

    Chart.register(ChartDataLabels);

    const getXValue = (d: any) => {
      switch (crossAxisX) {
        case 'research_budget': return Number((d.researchBudget / 1000000).toFixed(2));
        case 'research_count': return d.researchCount;
        case 'academic_budget': return Number((d.academicBudget / 1000000).toFixed(2));
        case 'service_revenue': return Number((d.serviceRevenue / 1000000).toFixed(2));
      }
    };

    const getYValue = (d: any) => {
      switch (crossAxisY) {
        case 'pub_total': return d.pubTotal;
        case 'pub_scopus_q1_q2': return d.pubHighTier;
        case 'ip_count': return d.ipCount;
        case 'academic_count': return d.academicCount;
      }
    };

    const getRValue = (d: any) => {
      if (crossAxisZ === 'bubble_none') return 16;
      const allCounts = crossDomainDeptData.map((item) => item.researchCount);
      const minCount = Math.min(...allCounts, 0);
      const maxCount = Math.max(...allCounts, 1);
      if (maxCount === minCount) return 20;
      const ratio = (d.researchCount - minCount) / (maxCount - minCount);
      return Math.round(14 + ratio * (36 - 14)); // min 14px, max 36px
    };

    const points = crossDomainDeptData.map((dept) => ({
      x: getXValue(dept),
      y: getYValue(dept),
      r: getRValue(dept),
      dept,
    }));

    const quadrantPlugin = {
      id: 'quadrantPlugin',
      beforeDraw(chart: any) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.x || !scales.y) return;
        const { left, right, top, bottom } = chartArea;

        const avgX = points.reduce((sum, p) => sum + p.x, 0) / (points.length || 1);
        const avgY = points.reduce((sum, p) => sum + p.y, 0) / (points.length || 1);

        const xPixel = scales.x.getPixelForValue(avgX);
        const yPixel = scales.y.getPixelForValue(avgY);

        const splitX = Math.max(left, Math.min(right, xPixel));
        const splitY = Math.max(top, Math.min(bottom, yPixel));

        ctx.save();

        // 1. Shaded pastel quadrant background tint
        // Top-Left: โซนประสิทธิภาพสูง
        ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
        ctx.fillRect(left, top, splitX - left, splitY - top);

        // Top-Right: โซนหัวหอกหลัก
        ctx.fillStyle = 'rgba(14, 165, 233, 0.04)';
        ctx.fillRect(splitX, top, right - splitX, splitY - top);

        // 2. Dashed reference lines
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);

        // Vertical mean line
        ctx.beginPath();
        ctx.moveTo(splitX, top);
        ctx.lineTo(splitX, bottom);
        ctx.stroke();

        // Horizontal mean line
        ctx.beginPath();
        ctx.moveTo(left, splitY);
        ctx.lineTo(right, splitY);
        ctx.stroke();

        ctx.restore();
      },
      afterDraw(chart: any) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const { left, right, top } = chartArea;

        ctx.save();
        const drawBadge = (
          text: string,
          x: number,
          y: number,
          align: 'left' | 'right',
          bg: string,
          border: string,
          textCol: string
        ) => {
          ctx.font = '600 11px sans-serif';
          const textWidth = ctx.measureText(text).width;
          const padX = 10;
          const padY = 5;
          const boxW = textWidth + padX * 2;
          const boxH = 22;
          const boxX = align === 'right' ? x - boxW : x;
          const boxY = y;

          ctx.fillStyle = bg;
          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(boxX, boxY, boxW, boxH, 6);
          } else {
            ctx.rect(boxX, boxY, boxW, boxH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = textCol;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, boxX + padX, boxY + boxH / 2);
        };

        // Top-Left badge: โซนประสิทธิภาพสูง (ใช้งบน้อย • ผลงานตีพิมพ์มาก)
        drawBadge(
          'โซนประสิทธิภาพสูง (ใช้งบน้อย • ผลงานตีพิมพ์มาก)',
          left + 12,
          top + 10,
          'left',
          'rgba(236, 253, 245, 0.95)',
          '#a7f3d0',
          '#047857'
        );

        // Top-Right badge: โซนหัวหอกหลัก (งบประมาณสูง • ผลงานสูง)
        drawBadge(
          'โซนหัวหอกหลัก (งบประมาณสูง • ผลงานสูง)',
          right - 12,
          top + 10,
          'right',
          'rgba(240, 249, 255, 0.95)',
          '#bae6fd',
          '#0369a1'
        );

        ctx.restore();
      },
    };

    crossChartInstance.current = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: points.map((p) => ({
          label: `${p.dept.name} (${p.dept.code})`,
          data: [{ x: p.x, y: p.y, r: p.r }],
          backgroundColor: getDepartmentColor(p.dept.code),
          borderColor: '#ffffff',
          borderWidth: 2,
        })),
      },
      plugins: [quadrantPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 36,
            right: 32,
            bottom: 12,
            left: 20,
          },
        },
        plugins: {
          legend: { position: 'bottom' },
          datalabels: {
            align: 'center',
            color: '#ffffff',
            font: { weight: 'bold', size: 11 },
            formatter: (_v, ctx) => crossDomainDeptData[ctx.datasetIndex]?.code || '',
          },
        },
        scales: {
          x: {
            grace: '10%',
            suggestedMin: crossAxisX === 'research_budget' ? -4 : 0,
            title: {
              display: true,
              text:
                crossAxisX === 'research_budget'
                  ? 'งบประมาณวิจัยรวม (ล้านบาท)'
                  : crossAxisX === 'research_count'
                  ? 'จำนวนโครงการวิจัย (เรื่อง)'
                  : crossAxisX === 'academic_budget'
                  ? 'งบพัฒนาวิชาการ (ล้านบาท)'
                  : 'รายได้บริการวิชาการ (ล้านบาท)',
              font: { weight: 'bold', size: 12 },
              color: '#475569',
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
          },
          y: {
            grace: '10%',
            suggestedMin: 0,
            suggestedMax: crossAxisY === 'pub_total' ? 22 : undefined,
            title: {
              display: true,
              text:
                crossAxisY === 'pub_total'
                  ? 'ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)'
                  : crossAxisY === 'pub_scopus_q1_q2'
                  ? 'ผลงานตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)'
                  : crossAxisY === 'ip_count'
                  ? 'ทรัพย์สินทางปัญญา / อนุสิทธิบัตร (เรื่อง)'
                  : 'จำนวนโครงการพัฒนาวิชาการ (เรื่อง)',
              font: { weight: 'bold', size: 12 },
              color: '#475569',
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
          },
        },
      },
    });

    return () => {
      if (crossChartInstance.current) {
        crossChartInstance.current.destroy();
        crossChartInstance.current = null;
      }
    };
  }, [crossDomainDeptData, crossAxisX, crossAxisY, crossAxisZ, studioMode]);

  const handleDomainChange = (domainId: FactDomainId) => {
    const domain = FACT_DOMAINS_CONFIG[domainId];
    setQuery({
      factDomain: domainId,
      measureId: domain.measures[0].id,
      primaryDimensionId: domain.dimensions[0].id,
      secondaryDimensionId: '',
      aggregationFn: undefined,
      chartType: undefined,
      selectedDept: 'all',
    });
  };

  const handleExportCSV = () => {
    const primaryLabel = currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label || 'กลุ่มข้อมูล';
    const measureLabel = currentDomainDef.measures.find((m) => m.id === query.measureId)?.label || 'ค่าที่วัดได้';

    const headers = [primaryLabel];
    if (query.secondaryDimensionId) headers.push('มิติย่อย');
    headers.push(measureLabel, 'สัดส่วน (%)');

    const rows = aggregatedData.tableRows.map((r) => {
      const line = [`"${r.category}"`];
      if (query.secondaryDimensionId) line.push(`"${r.subCategory || '-'}"`);
      line.push(r.value.toString(), `"${r.sharePercent}"`);
      return line.join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KU_BI_Studio_${query.factDomain}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find max item label
  const maxItemLabel = useMemo(() => {
    if (!aggregatedData.tableRows.length) return '';
    let max = aggregatedData.tableRows[0];
    aggregatedData.tableRows.forEach((r) => {
      if (r.value > max.value) max = r;
    });
    return max.category;
  }, [aggregatedData]);

  const primaryDimLabel = currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label || 'กลุ่มข้อมูล';
  const measureLabel = currentDomainDef.measures.find((m) => m.id === query.measureId)?.label || 'ค่าที่วัดได้';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: '16px 24px 48px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>วิเคราะห์ข้อมูลเชิงลึก</h1>
        <p style={dashboardPageSubtitleStyle}>
          สร้างกราฟและตารางวิเคราะห์จากข้อมูลพันธกิจของคณะวิศวกรรมศาสตร์
        </p>
      </div>

      {/* 0. Studio Mode Switcher Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
          <button
            type="button"
            onClick={() => setStudioMode('standard')}
            style={{
              padding: '8px 20px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: studioMode === 'standard' ? activeTheme.color : 'transparent',
              color: studioMode === 'standard' ? '#ffffff' : '#475569',
              fontWeight: studioMode === 'standard' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: studioMode === 'standard' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FaSlidersH /> สร้างกราฟตามพันธกิจ
          </button>
          <button
            type="button"
            onClick={() => setStudioMode('crossDomain')}
            style={{
              padding: '8px 20px',
              borderRadius: '9px',
              backgroundColor: studioMode === 'crossDomain' ? '#e0f2fe' : 'transparent',
              color: studioMode === 'crossDomain' ? '#0369a1' : '#64748b',
              border: studioMode === 'crossDomain' ? '1px solid #bae6fd' : '1px solid transparent',
              fontWeight: studioMode === 'crossDomain' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: studioMode === 'crossDomain' ? '0 2px 6px rgba(14, 165, 233, 0.15)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FaProjectDiagram /> เปรียบเทียบความคุ้มค่าข้ามพันธกิจ
          </button>
        </div>
      </div>

      {/* Shared dashboard time filter */}
      <DashboardTabFilterBar
        tabKey="studio"
        totalCount={studioMode === 'crossDomain' ? totalCrossDomainCount : aggregatedData.count}
        filteredCount={studioMode === 'crossDomain' ? totalCrossDomainCount : aggregatedData.count}
        showFiscalYear={true}
        showDepartment={false}
        showStrategic={false}
        showDetailedTime={true}
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{
          position: 'static',
          backdropFilter: 'none',
          backgroundColor: dashboardTheme.colors.surface,
          borderRadius: `${dashboardTheme.radius.card}px`,
          boxShadow: 'none',
        }}
      />

      {/* ======================= MODE 1: STANDARD SINGLE-DOMAIN STUDIO ======================= */}
      {studioMode === 'standard' && (
        <>
          {/* Quick Domain Selector Pills with Counter Badges & Dynamic Colors */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', padding: '6px', gap: '8px', flexWrap: 'wrap', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              {(Object.keys(FACT_DOMAINS_CONFIG) as FactDomainId[]).map((dId) => {
                const theme = DOMAIN_THEMES[dId];
                const isActive = query.factDomain === dId;
                return (
                  <button
                    key={dId}
                    onClick={() => handleDomainChange(dId)}
                    type="button"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      border: isActive ? `1.5px solid ${theme.color}` : '1px solid transparent',
                      cursor: 'pointer',
                      background: isActive ? theme.bgColor : 'transparent',
                      color: isActive ? theme.textColor : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: isActive ? theme.color : '#64748b' }}>{getDomainIcon(dId)}</span>
                    <span>{theme.badgeText}</span>
                  </button>
                );
              })}
            </div>

            {query.factDomain === 'academic' && (
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={hideMissingClients}
                  onChange={(e) => setHideMissingClients(e.target.checked)}
                  style={{ accentColor: '#0ea5e9', cursor: 'pointer' }}
                />
                <span>ซ่อนรายการที่ไม่ระบุผู้ว่าจ้าง</span>
              </label>
            )}

            {query.factDomain === 'service' && isCrowded && (
              <button
                type="button"
                onClick={() => setShowAllServiceCategories(!showAllServiceCategories)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa',
                  backgroundColor: '#fffbeb',
                  color: '#b45309',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showAllServiceCategories ? 'แสดงเฉพาะ 15 อันดับแรก' : 'แสดงครบทั้งหมด (231 กลุ่ม)'}
              </button>
            )}
          </div>

          {/* Grouped Studio Dock (Numbered Circles 1 to 5) */}
          <div
            style={{
              padding: '22px 24px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: `1.5px solid ${activeTheme.borderColor}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {/* 1. X-Axis */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: activeTheme.bgColor, color: activeTheme.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    1
                  </span>
                  <span>จัดกลุ่มข้อมูลตาม (แกน X)</span>
                </label>
                <Select
                  value={query.primaryDimensionId}
                  onValueChange={(val) => {
                    if (val) setQuery((prev) => ({ ...prev, primaryDimensionId: val }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label || 'เลือกมิติหลัก'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currentDomainDef.dimensions.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Y-Axis */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: activeTheme.bgColor, color: activeTheme.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    2
                  </span>
                  <span>ข้อมูลที่ต้องการวัดผล (แกน Y)</span>
                </label>
                <Select
                  value={query.measureId}
                  onValueChange={(val) => {
                    if (val) setQuery((prev) => ({ ...prev, measureId: val }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {currentDomainDef.measures.find((m) => m.id === query.measureId)?.label || 'เลือกตัววัด'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currentDomainDef.measures.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Aggregation */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: activeTheme.bgColor, color: activeTheme.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    3
                  </span>
                  <span>วิธีคำนวณ</span>
                </label>
                <Select
                  value={query.aggregationFn || currentDomainDef.measures.find((m) => m.id === query.measureId)?.aggregation || 'SUM'}
                  onValueChange={(val) => {
                    if (val) setQuery((prev) => ({ ...prev, aggregationFn: val as AggregationType }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                    <SelectValue>
                      {query.aggregationFn === 'SUM' && 'ผลรวม'}
                      {query.aggregationFn === 'COUNT' && 'นับจำนวนรายการ'}
                      {query.aggregationFn === 'AVG' && 'ค่าเฉลี่ย'}
                      {query.aggregationFn === 'MAX' && 'ค่าสูงสุด'}
                      {query.aggregationFn === 'MIN' && 'ค่าต่ำสุด'}
                      {!query.aggregationFn && 'ผลรวม'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUM">ผลรวม</SelectItem>
                    <SelectItem value="COUNT">นับจำนวนรายการ</SelectItem>
                    <SelectItem value="AVG">ค่าเฉลี่ย</SelectItem>
                    <SelectItem value="MAX">ค่าสูงสุด</SelectItem>
                    <SelectItem value="MIN">ค่าต่ำสุด</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Secondary Dimension */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: activeTheme.bgColor, color: activeTheme.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    4
                  </span>
                  <span>แยกสีเปรียบเทียบย่อย</span>
                </label>
                <Select
                  value={query.secondaryDimensionId || '__none__'}
                  onValueChange={(val) => {
                    setQuery((prev) => ({
                      ...prev,
                      secondaryDimensionId: val === '__none__' ? undefined : (val ?? undefined),
                    }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                    <SelectValue>
                      {query.secondaryDimensionId
                        ? currentDomainDef.dimensions.find((d) => d.id === query.secondaryDimensionId)?.label
                        : 'ไม่แยกสี (แสดงค่าเดียว)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">ไม่แยกสี (แสดงค่าเดียว)</SelectItem>
                    {currentDomainDef.dimensions
                      .filter((d) => d.id !== query.primaryDimensionId)
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 5. Department Filter */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: activeTheme.bgColor, color: activeTheme.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>
                    5
                  </span>
                  <span>กรองสังกัด</span>
                </label>
                <DepartmentSelect
                  value={query.selectedDept || 'all'}
                  onChange={(val) => setQuery((prev) => ({ ...prev, selectedDept: val }))}
                  allowAll
                  allLabel="ทุกสังกัด"
                  allValue="all"
                  size="sm"
                  className="w-full h-9"
                />
              </div>
            </div>

            {/* Quick Chart Switcher */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', marginRight: '4px' }}>รูปแบบกราฟ:</span>
                  {QUICK_CHART_TYPES.map((btn) => {
                    const isSelected = activeChartType === btn.type;
                    return (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setQuery((prev) => ({ ...prev, chartType: btn.type }))}
                        style={{
                          padding: '6px 14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          borderRadius: '8px',
                          border: isSelected ? `1.5px solid ${activeTheme.color}` : '1px solid #cbd5e1',
                          background: isSelected ? activeTheme.bgColor : '#ffffff',
                          color: isSelected ? activeTheme.textColor : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: isSelected ? activeTheme.color : '#64748b' }}>{btn.icon}</span>
                        <span>{btn.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowAllCharts((prev) => !prev)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>{showAllCharts ? 'ย่อคลังกราฟ' : 'รูปแบบกราฟทั้งหมด (16 แบบ)'}</span>
                    {showAllCharts ? <FaChevronUp style={{ fontSize: '10px' }} /> : <FaChevronDown style={{ fontSize: '10px' }} />}
                  </button>
                </div>
              </div>

              {showAllCharts && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '12px' }}>
                  {CHART_TYPES_CATALOG.map((group) => (
                    <div key={group.groupName} style={{ background: '#f8fafc', borderRadius: '14px', padding: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                        {group.groupName}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {group.items.map((btn) => (
                          <button
                            key={btn.type}
                            type="button"
                            onClick={() => setQuery((prev) => ({ ...prev, chartType: btn.type }))}
                            style={{
                              padding: '7px 8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11.5px',
                              borderRadius: '8px',
                              border: activeChartType === btn.type ? `1.5px solid ${activeTheme.color}` : '1px solid #e2e8f0',
                              background: activeChartType === btn.type ? activeTheme.bgColor : '#ffffff',
                              color: activeChartType === btn.type ? activeTheme.textColor : '#334155',
                              cursor: 'pointer',
                            }}
                          >
                            <span>{btn.icon}</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4 Pastel Mini Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.05)' }}>
              <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600 }}>ยอดรวมทั้งหมด</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {aggregatedData.totalValue.toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600, color: '#047857' }}>บาท</span> : ''}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)', border: '1px solid #bae6fd', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(14, 165, 233, 0.05)' }}>
              <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>ค่าเฉลี่ยต่อกลุ่ม</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {Math.round(aggregatedData.averageValue).toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600, color: '#0369a1' }}>บาท</span> : ''}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)', border: '1px solid #ddd6fe', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6d28d9', fontWeight: 600 }}>ค่าสูงสุด</span>
                {maxItemLabel && (
                  <span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '6px', backgroundColor: '#ede9fe', color: '#6d28d9', fontWeight: 700 }}>
                    {maxItemLabel}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {aggregatedData.maxValue.toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9' }}>บาท</span> : ''}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)', border: '1px solid #fed7aa', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.05)' }}>
              <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>จำนวนกลุ่มข้อมูล</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {aggregatedData.labels.length} <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>กลุ่ม</span>
              </div>
            </div>
          </div>

          {/* Standard Chart & Pivot Table */}
          <div style={{ display: 'grid', gridTemplateColumns: activeChartType === 'pivot' ? '1fr' : '1.6fr 1fr', gap: '20px' }}>
            {activeChartType !== 'pivot' && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {measureLabel} จำแนกตาม {primaryDimLabel}
                  </h3>
                </div>
                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                  <canvas ref={chartRef} />
                </div>
              </div>
            )}

            {/* Dynamic Pivot Table with Inline Data Bars */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTable style={{ color: activeTheme.color, fontSize: '15px' }} />
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    ตารางสรุปข้อมูล
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: activeTheme.textColor,
                    border: `1px solid ${activeTheme.borderColor}`,
                    borderRadius: '8px',
                    background: activeTheme.bgColor,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <FaDownload /> ส่งออก CSV
                </button>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: activeChartType === 'pivot' ? '540px' : '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>{primaryDimLabel}</th>
                      {query.secondaryDimensionId && (
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>มิติย่อย</th>
                      )}
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>{measureLabel}</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', width: '130px' }}>สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.tableRows.map((row, idx) => {
                      const pctNum = parseFloat(row.sharePercent) || 0;
                      return (
                        <tr
                          key={idx}
                          style={{ borderBottom: '1px solid #f1f5f9' }}
                        >
                          <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0f172a' }}>{row.category}</td>
                          {query.secondaryDimensionId && (
                            <td style={{ padding: '9px 12px', color: '#475569' }}>{row.subCategory || '-'}</td>
                          )}
                          <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: activeTheme.textColor }}>
                            {row.formattedValue}
                          </td>
                          <td style={{ padding: '9px 12px', textAlign: 'right', position: 'relative' }}>
                            <div style={{ position: 'relative', zIndex: 1, fontWeight: 700, fontSize: '11.5px', color: '#334155' }}>
                              {row.sharePercent}
                            </div>
                            {/* Inline Data Bar */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '12px',
                                bottom: '8px',
                                width: `${Math.min(100, pctNum)}%`,
                                backgroundColor: activeTheme.bgColor,
                                border: `1px solid ${activeTheme.borderColor}`,
                                borderRadius: '4px',
                                zIndex: 0,
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================= MODE 2: CROSS-DOMAIN ROI ANALYTICS ======================= */}
      {studioMode === 'crossDomain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cross Domain Control Selector Bar */}
          <div
            style={{
              padding: '22px 24px',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid #bae6fd',
              boxShadow: '0 4px 16px rgba(14, 165, 233, 0.05)',
            }}
          >
            <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaProjectDiagram style={{ color: '#0ea5e9' }} />
              <span>ตั้งค่าตัวแปรเปรียบเทียบความคุ้มค่า</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* แกน X */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  1. ปัจจัยตั้งต้น (แกนแนวนอน X)
                </label>
                <Select value={crossAxisX} onValueChange={(val: any) => setCrossAxisX(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {crossAxisX === 'research_budget' ? 'งบประมาณวิจัยรวม (ล้านบาท)' :
                       crossAxisX === 'research_count' ? 'จำนวนโครงการวิจัย (เรื่อง)' :
                       crossAxisX === 'academic_budget' ? 'งบพัฒนาวิชาการ (ล้านบาท)' : 'รายได้บริการวิชาการ (ล้านบาท)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research_budget">งบประมาณวิจัยรวม (ล้านบาท)</SelectItem>
                    <SelectItem value="research_count">จำนวนโครงการวิจัย (เรื่อง)</SelectItem>
                    <SelectItem value="academic_budget">งบพัฒนาวิชาการ (ล้านบาท)</SelectItem>
                    <SelectItem value="service_revenue">รายได้บริการวิชาการ (ล้านบาท)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* แกน Y */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  2. ผลลัพธ์ที่ได้ (แกนแนวตั้ง Y)
                </label>
                <Select value={crossAxisY} onValueChange={(val: any) => setCrossAxisY(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {crossAxisY === 'pub_total' ? 'ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)' :
                       crossAxisY === 'pub_scopus_q1_q2' ? 'ตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)' :
                       crossAxisY === 'ip_count' ? 'ทรัพย์สินทางปัญญา / อนุสิทธิบัตร (เรื่อง)' : 'จำนวนโครงการพัฒนาวิชาการ (เรื่อง)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pub_total">ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)</SelectItem>
                    <SelectItem value="pub_scopus_q1_q2">ตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)</SelectItem>
                    <SelectItem value="ip_count">ทรัพย์สินทางปัญญา / อนุสิทธิบัตร (เรื่อง)</SelectItem>
                    <SelectItem value="academic_count">จำนวนโครงการพัฒนาวิชาการ (เรื่อง)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* แกน Z */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  3. ขนาดของวงกลม
                </label>
                <Select value={crossAxisZ} onValueChange={(val: any) => setCrossAxisZ(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {crossAxisZ === 'bubble_projects' ? 'ขนาดตามจำนวนโครงการวิจัยรวม' : 'ขนาดเท่ากันคงที่'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble_projects">ขนาดตามจำนวนโครงการวิจัยรวม</SelectItem>
                    <SelectItem value="bubble_none">ขนาดเท่ากันคงที่</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* รูปแบบการจัดกลุ่ม */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  4. รูปแบบการจัดกลุ่ม
                </label>
                <Select value={entityLevel} onValueChange={(val: any) => setEntityLevel(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {entityLevel === 'dept' ? '7 สังกัดหลักของคณะฯ' :
                       entityLevel === 'units' ? 'ศูนย์ / ห้องปฏิบัติการวิจัย' : 'รายบุคคล (อาจารย์ / นักวิจัย)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dept">7 สังกัดหลักของคณะฯ</SelectItem>
                    <SelectItem value="units">ศูนย์ / ห้องปฏิบัติการวิจัย</SelectItem>
                    <SelectItem value="individual">รายบุคคล (อาจารย์ / นักวิจัย)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scatter Chart + Cross Matrix Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
            {/* Bubble Chart */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                  กราฟเปรียบเทียบความคุ้มค่าและผลลัพธ์
                </h4>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>คลิกที่วงกลมแต่ละสังกัดเพื่อดูรายละเอียด</span>
              </div>
              <div style={{ height: '420px', width: '100%' }}>
                <canvas ref={crossChartRef} />
              </div>
            </div>

            {/* Cross Matrix Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                ตารางวิเคราะห์ความคุ้มค่าและผลตอบแทน
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f9ff', borderBottom: '2px solid #bae6fd', color: '#0369a1' }}>
                      <th style={{ padding: '10px 10px', textAlign: 'left', fontWeight: 700 }}>สังกัด</th>
                      <th style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>งบวิจัย (ลบ.)</th>
                      <th style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#be123c' }}>ตีพิมพ์ (เรื่อง)</th>
                      <th style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>Q1-Q2</th>
                      <th style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#6d28d9' }}>ทรัพย์สินฯ (เรื่อง)</th>
                      <th style={{ padding: '10px 10px', textAlign: 'right', fontWeight: 700, color: '#0369a1' }}>งบวิจัยเฉลี่ย / 1 บทความ (ลบ.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crossDomainDeptData.map((d, idx) => {
                      const costPerPub = d.pubTotal > 0 ? (d.researchBudget / d.pubTotal / 1000000).toFixed(2) : '-';
                      return (
                        <tr
                          key={d.code}
                          onClick={() =>
                            setDrillDown({
                              isOpen: true,
                              title: `บูรณาการข้อมูล: สังกัด ${d.name} (${d.code})`,
                              subtitle: `วิจัย ${d.researchCount} เรื่อง • ตีพิมพ์ ${d.pubTotal} เรื่อง • สิทธิบัตร ${d.ipCount} เรื่อง`,
                              items: [...d.rawResearchItems, ...d.rawPubItems, ...d.rawIpItems],
                              categoryKey: 'research',
                            })
                          }
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                            <DepartmentBadge value={d.code} />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>
                            {(d.researchBudget / 1000000).toFixed(2)}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{d.pubTotal}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#2563eb', fontWeight: 700 }}>{d.pubHighTier}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#8b5cf6', fontWeight: 600 }}>{d.ipCount}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', color: '#475569', fontWeight: 600 }}>
                            {costPerPub !== '-' ? costPerPub : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drill-down Drawer */}
      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={activeTheme.color}
        items={drillDown.items}
        categoryKey={drillDown.categoryKey || 'research'}
      />
    </div>
  );
}
