'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FACT_DOMAINS_CONFIG } from '@/config/analyticsMetadata';
import { AnalyticsQuery, ChartType, FactDomainId, AggregationType } from '@/types/analyticsBuilder';
import { executeAnalyticsQuery, extractDimensionValue } from '@/lib/analyticsEngine';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/ui';
import { CategoryKey } from '@/config/dataManagementConfig';
import { isTestRecord } from '@/lib/sdgEngine';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { CANONICAL_DEPARTMENTS, matchDepartmentCode } from '@/config/departments';
import { parseNumber } from '@/lib/kpiEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
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
  FaMagic,
  FaDownload,
  FaLayerGroup,
  FaCalculator,
  FaThList,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaClock,
  FaStar,
  FaSlidersH,
  FaWaveSquare,
  FaChartArea,
  FaProjectDiagram,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import { getCachedCategoryData, fetchCategoryData } from '@/lib/dataService';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import { DepartmentSelect } from '@/components/ui';

const getDomainIcon = (id: FactDomainId) => {
  switch (id) {
    case 'research': return <FaFlask />;
    case 'academic': return <FaGraduationCap />;
    case 'publications': return <FaBook />;
    case 'service': return <FaHandsHelping />;
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
    groupName: 'แผนภูมิแท่ง (Bar & Columns)',
    items: [
      { type: 'bar', label: 'คอลัมน์แนวตั้ง', icon: <FaChartBar />, desc: 'เปรียบเทียบค่าระหว่างหมวดหมู่ชัดเจน' },
      { type: 'horizontal_bar', label: 'แถบแนวนอน', icon: <FaSlidersH />, desc: 'เหมาะกับชื่อหมวดยาวหรือข้อมูลหลายกลุ่ม' },
      { type: 'stacked_bar', label: 'แท่งซ้อนรวม', icon: <FaLayerGroup />, desc: 'แสดงผลรวมพร้อมสัดส่วนองค์ประกอบ' },
      { type: 'grouped_bar', label: 'กลุ่มเคียงข้าง', icon: <FaChartBar />, desc: 'เปรียบเทียบ 2 มิติเคียงข้างกัน' },
    ],
  },
  {
    groupName: 'แผนภูมิเส้นและพื้นที่ (Line & Area)',
    items: [
      { type: 'smooth_line', label: 'เส้นโค้งสมูท', icon: <FaWaveSquare />, desc: 'วิเคราะห์แนวโน้มตามลำดับเวลาอย่างนุ่มนวล' },
      { type: 'line', label: 'เส้นตรงมาตรฐาน', icon: <FaChartLine />, desc: 'ดูอัตราการเติบโตและการเปลี่ยนแปลง' },
      { type: 'area', label: 'พื้นที่ไล่เฉด', icon: <FaChartArea />, desc: 'เน้นปริมาณสะสมตามช่วงเวลา' },
      { type: 'stacked_area', label: 'พื้นที่ซ้อนชั้น', icon: <FaLayerGroup />, desc: 'แนวโน้มรวมและสัดส่วนย่อยตามเวลา' },
    ],
  },
  {
    groupName: 'แผนภูมิสัดส่วนและรัศมี (Radial & Composition)',
    items: [
      { type: 'donut', label: 'โดนัทโมเดิร์น', icon: <FaChartPie />, desc: 'เปรียบเทียบสัดส่วนเปอร์เซ็นต์สะดุดตา' },
      { type: 'pie', label: 'วงกลมคลาสสิก', icon: <FaChartPie />, desc: 'แสดงส่วนแบ่งตลาดหรือสัดส่วนรวม' },
      { type: 'polar', label: 'พื้นที่เชิงขั้ว', icon: <FaWaveSquare />, desc: 'ดูความแตกต่างของสัดส่วนในเชิงรัศมี' },
      { type: 'radar', label: 'ใยแมงมุม Spider', icon: <FaLayerGroup />, desc: 'เปรียบเทียบสมรรถนะรอบด้านหลายมิติ' },
    ],
  },
  {
    groupName: 'สถิติและตารางสรุป (Matrix & Pivot)',
    items: [
      { type: 'pivot', label: 'ตารางสรุป Pivot', icon: <FaTable />, desc: 'ตารางวิเคราะห์สถิติจริงพร้อมยอดรวม' },
    ],
  },
];

const QUICK_CHART_TYPES: { type: ChartType; label: string; icon: any }[] = [
  { type: 'bar', label: 'คอลัมน์แนวตั้ง', icon: <FaChartBar /> },
  { type: 'horizontal_bar', label: 'แถบแนวนอน', icon: <FaSlidersH /> },
  { type: 'stacked_bar', label: 'แท่งซ้อนรวม', icon: <FaLayerGroup /> },
  { type: 'smooth_line', label: 'เส้นโค้งแนวโน้ม', icon: <FaWaveSquare /> },
  { type: 'donut', label: 'โดนัทสัดส่วน', icon: <FaChartPie /> },
  { type: 'pivot', label: 'ตารางสรุป Pivot', icon: <FaTable /> },
];

export default function SelfServiceStudio() {
  const { filterProjectsByTime } = useTimeFilter();
  const [studioMode, setStudioMode] = useState<'standard' | 'crossDomain'>('standard');
  const [showAllCharts, setShowAllCharts] = useState(false);

  // Cross-Domain Configuration State
  const [crossAxisX, setCrossAxisX] = useState<'research_budget' | 'research_count' | 'academic_budget' | 'service_revenue'>('research_budget');
  const [crossAxisY, setCrossAxisY] = useState<'pub_total' | 'pub_scopus_q1_q2' | 'ip_count' | 'academic_count'>('pub_total');
  const [crossAxisZ, setCrossAxisZ] = useState<'bubble_projects' | 'bubble_none'>('bubble_projects');

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

  // Datasets
  const currentDataset = useMemo(() => {
    switch (query.factDomain) {
      case 'research':
      case 'monitoring':
        return filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'start_date');
      case 'academic':
        return filterProjectsByTime(getCachedCategoryData('academic') || rawAcademic, 'start_date');
      case 'publications':
        return filterProjectsByTime(getCachedCategoryData('publications') || rawPublications, 'pub_date');
      case 'service':
        return filterProjectsByTime(getCachedCategoryData('service') || rawServices, 'date');
      case 'ip':
        return filterProjectsByTime(getCachedCategoryData('ip') || rawIP, 'date_filed');
      default:
        return filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'start_date');
    }
  }, [query.factDomain, filterProjectsByTime, dataVersion]);

  // Datasets for Cross Domain Analysis (7 Departments Unified Fact)
  const crossDomainDeptData = useMemo(() => {
    const rawRes = filterProjectsByTime(getCachedCategoryData('research') || rawResearch, 'start_date');
    const rawAca = filterProjectsByTime(getCachedCategoryData('academic') || rawAcademic, 'start_date');
    const rawPub = filterProjectsByTime(getCachedCategoryData('publications') || rawPublications, 'pub_date');
    const rawSrv = filterProjectsByTime(getCachedCategoryData('service') || rawServices, 'date');
    const rawIp = filterProjectsByTime(getCachedCategoryData('ip') || rawIP, 'date_filed');

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

    rawSrv.forEach((s: any) => {
      const c = matchDepartmentCode(s.department);
      if (c && matrix[c]) {
        matrix[c].serviceRevenue += parseNumber(s.actual_revenue) || parseNumber(s.budget) || 0;
      }
    });

    rawPub.forEach((p: any) => {
      const c = matchDepartmentCode(p.department);
      if (c && matrix[c]) {
        matrix[c].pubTotal += 1;
        matrix[c].rawPubItems.push(p);
        const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
        if (tier === 'Q1' || tier === 'Q2') {
          matrix[c].pubHighTier += 1;
        }
      }
    });

    rawIp.forEach((ip: any) => {
      const c = matchDepartmentCode(ip.department);
      if (c && matrix[c]) {
        matrix[c].ipCount += 1;
        matrix[c].rawIpItems.push(ip);
      }
    });

    return Object.values(matrix);
  }, [filterProjectsByTime, dataVersion]);

  const currentDomainDef = FACT_DOMAINS_CONFIG[query.factDomain];

  const openCategoryDrillDown = (primaryLabel: string, secondaryLabel?: string) => {
    const primaryDimDef =
      currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId) ||
      currentDomainDef.dimensions[0];
    const secondaryDimDef = query.secondaryDimensionId
      ? currentDomainDef.dimensions.find((d) => d.id === query.secondaryDimensionId)
      : undefined;

    const matching = currentDataset.filter((r: any) => {
      if (isTestRecord(r) || !r.name || r.name === 'nan' || r.name === 'NaT' || r.name === 'เรื่อง') {
        return false;
      }
      if (query.selectedDept && query.selectedDept !== 'all') {
        const targetCode = getDepartment(query.selectedDept).code;
        const rowCode = getDepartment(r.department).code;
        if (targetCode !== '-' && rowCode !== targetCode && !extractDimensionValue(r, 'department').includes(query.selectedDept)) {
          return false;
        }
      }
      if (extractDimensionValue(r, primaryDimDef.field) !== primaryLabel) return false;
      if (secondaryDimDef && secondaryLabel && extractDimensionValue(r, secondaryDimDef.field) !== secondaryLabel) {
        return false;
      }
      return true;
    });

    setDrillDown({
      isOpen: true,
      title: `${currentDomainDef.nameTh}: ${primaryLabel}${secondaryLabel ? ` (${secondaryLabel})` : ''}`,
      subtitle: `รวม ${matching.length.toLocaleString('th-TH')} รายการ`,
      items: matching,
      categoryKey: (query.factDomain === 'monitoring' ? 'research' : query.factDomain) as CategoryKey,
    });
  };

  const aggregatedData = useMemo(() => {
    return executeAnalyticsQuery(query, currentDataset);
  }, [query, currentDataset]);

  const activeChartType: ChartType = query.chartType || aggregatedData.recommendedChartType;

  // Render Standard Chart.js Instance
  useEffect(() => {
    if (studioMode !== 'standard' || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    if (activeChartType === 'pivot') return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    Chart.register(ChartDataLabels);

    let chartJsType: any = 'bar';
    let options: any = {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event: any, elements: any[], chart: any) => {
        const mode = activeChartType === 'horizontal_bar' ? 'y' : 'nearest';
        const hit = getClickedChartElement(event, elements, chart, mode);
        if (hit) {
          const primaryLabel = aggregatedData.labels[hit.index];
          const secondaryLabel =
            query.secondaryDimensionId && aggregatedData.datasets[hit.datasetIndex]
              ? aggregatedData.datasets[hit.datasetIndex].label
              : undefined;
          if (primaryLabel) {
            openCategoryDrillDown(primaryLabel, secondaryLabel);
          }
        }
      },
      plugins: {
        legend: {
          display:
            aggregatedData.datasets.length > 1 ||
            activeChartType === 'donut' ||
            activeChartType === 'pie' ||
            activeChartType === 'polar' ||
            activeChartType === 'radar',
          position: 'bottom',
          maxHeight: 180,
          labels: {
            font: { family: "'Kanit', sans-serif", size: 11 },
            padding: 10,
            usePointStyle: true,
            boxWidth: 8,
          },
        },
        datalabels: {
          display: (context: any) => {
            // ไม่แสดงในกราฟเส้นและพื้นที่
            if (
              activeChartType === 'line' ||
              activeChartType === 'smooth_line' ||
              activeChartType === 'area' ||
              activeChartType === 'radar'
            ) {
              return false;
            }

            // สำหรับกราฟ Donut / Pie: แสดงเฉพาะชิ้นที่มีสัดส่วนตั้งแต่ 8% ขึ้นไป เพื่อไม่ให้เบียดกันจนอ่านไม่ออก
            if (activeChartType === 'donut' || activeChartType === 'pie' || activeChartType === 'polar') {
              const val = Number(context.dataset.data[context.dataIndex]) || 0;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + Number(b), 0);
              const percent = total > 0 ? (val / total) * 100 : 0;
              return percent >= 8;
            }

            return true;
          },
          anchor: activeChartType === 'donut' || activeChartType === 'pie' ? 'center' : 'end',
          align:
            activeChartType === 'donut' || activeChartType === 'pie'
              ? 'center'
              : activeChartType === 'horizontal_bar'
              ? 'right'
              : 'top',
          offset: activeChartType === 'donut' || activeChartType === 'pie' ? 0 : 4,
          clip: false,
          color:
            activeChartType === 'donut' || activeChartType === 'pie' || activeChartType === 'polar'
              ? '#ffffff'
              : '#0f172a',
          font: { family: "'Kanit', sans-serif", weight: 'bold', size: 10.5 },
          formatter: (value: any) => {
            if (!value || value === 0) return '';
            if (aggregatedData.format === 'currency') {
              return value >= 1000000 ? (value / 1000000).toFixed(1) + 'M' : value.toLocaleString();
            }
            return value.toLocaleString();
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          titleFont: { family: "'Kanit', sans-serif", size: 13, weight: 'bold' },
          bodyFont: { family: "'Kanit', sans-serif", size: 12 },
          padding: 12,
          cornerRadius: 12,
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const val = context.raw || 0;
              const formatted =
                aggregatedData.format === 'currency'
                  ? `${Number(val).toLocaleString()} บาท`
                  : Number(val).toLocaleString();
              return ` ${label}: ${formatted}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Kanit', sans-serif", size: 11.5 }, color: '#334155' },
        },
        y: {
          grid: { color: 'rgba(226, 232, 240, 0.7)' },
          ticks: {
            font: { family: "'Kanit', sans-serif", size: 11.5 },
            color: '#334155',
            callback: (v: any) => {
              if (aggregatedData.format === 'currency' && v >= 1000000) {
                return (v / 1000000).toFixed(1) + 'M ';
              }
              return v.toLocaleString();
            },
          },
        },
      },
    };

    if (activeChartType === 'horizontal_bar') {
      chartJsType = 'bar';
      options.indexAxis = 'y';
      options.scales.x = {
        grace: '10%',
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        ticks: {
          font: { family: "'Kanit', sans-serif", size: 11.5 },
          color: '#334155',
          callback: (v: any) => {
            if (aggregatedData.format === 'currency' && v >= 1000000) {
              return (v / 1000000).toFixed(1) + 'M ';
            }
            return Number(v).toLocaleString();
          },
        },
      };
      options.scales.y = {
        grid: { display: false },
        ticks: { font: { family: "'Kanit', sans-serif", size: 11.5 }, color: '#334155' },
      };
    } else if (activeChartType === 'stacked_bar') {
      chartJsType = 'bar';
      options.scales.x.stacked = true;
      options.scales.y.stacked = true;
    } else if (activeChartType === 'grouped_bar') {
      chartJsType = 'bar';
      options.scales.x.stacked = false;
      options.scales.y.stacked = false;
    } else if (activeChartType === 'smooth_line') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.45, borderWidth: 3.5 },
        point: { radius: 5, hoverRadius: 8 },
      };
    } else if (activeChartType === 'line') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.1, borderWidth: 3 },
        point: { radius: 5, hoverRadius: 7 },
      };
    } else if (activeChartType === 'area') {
      chartJsType = 'line';
      options.elements = {
        line: { tension: 0.4, borderWidth: 3, fill: true },
        point: { radius: 4 },
      };
    } else if (activeChartType === 'stacked_area') {
      chartJsType = 'line';
      options.scales.y.stacked = true;
      options.elements = {
        line: { tension: 0.35, borderWidth: 2.5, fill: true },
      };
    } else if (activeChartType === 'donut') {
      chartJsType = 'doughnut';
      delete options.scales;
      options.cutout = '62%';
    } else if (activeChartType === 'pie') {
      chartJsType = 'pie';
      delete options.scales;
    } else if (activeChartType === 'polar') {
      chartJsType = 'polarArea';
      delete options.scales;
    } else if (activeChartType === 'radar') {
      chartJsType = 'radar';
      delete options.scales;
    }

    const formattedDatasets = aggregatedData.datasets.map((d) => ({
      ...d,
      fill: activeChartType === 'area' || activeChartType === 'stacked_area',
    }));

    chartInstance.current = new Chart(ctx, {
      type: chartJsType,
      data: {
        labels: aggregatedData.labels,
        datasets: formattedDatasets,
      },
      options,
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [aggregatedData, activeChartType, studioMode]);

  // Render Cross-Domain Scatter/Bubble Chart
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
      if (crossAxisZ === 'bubble_none') return 9;
      return Math.max(9, Math.min(26, d.researchCount * 2.2));
    };

    const points = crossDomainDeptData.map((dept) => ({
      x: getXValue(dept),
      y: getYValue(dept),
      r: getRValue(dept),
      dept,
    }));

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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { bottom: 20, top: 12, left: 12, right: 24 },
        },
        onClick: (event: any, elements: any[]) => {
          if (elements && elements.length > 0) {
            const dsIdx = elements[0].datasetIndex;
            const targetDept = crossDomainDeptData[dsIdx];
            if (targetDept) {
              setDrillDown({
                isOpen: true,
                title: `ข้อมูลบูรณาการข้ามพันธกิจ: ภาควิชา${targetDept.name} (${targetDept.code})`,
                subtitle: `วิจัย ${targetDept.researchCount} เรื่อง • ตีพิมพ์ ${targetDept.pubTotal} เรื่อง • IP ${targetDept.ipCount} เรื่อง`,
                items: [...targetDept.rawResearchItems, ...targetDept.rawPubItems, ...targetDept.rawIpItems],
                categoryKey: 'research',
              });
            }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, font: { family: "'Kanit', sans-serif", size: 12 } } },
          datalabels: {
            align: 'center',
            color: '#ffffff',
            font: { family: "'Kanit', sans-serif", weight: 'bold', size: 10 },
            formatter: (_v, ctx) => crossDomainDeptData[ctx.datasetIndex]?.code || '',
          },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const ds = items[0]?.datasetIndex;
                const d = crossDomainDeptData[ds];
                return d ? `ภาควิชา${d.name} (${d.code})` : '';
              },
              label: (context: any) => {
                const raw: any = context.raw;
                return [
                  ` แกน X: ${raw.x} (หน่วยตามแกนที่เลือก)`,
                  ` แกน Y: ${raw.y} (หน่วยตามแกนที่เลือก)`,
                  ` ขนาดฟองสบู่ (Z): ${Math.round(raw.r)}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text:
                crossAxisX === 'research_budget'
                  ? 'งบประมาณวิจัยรวม (ล้านบาท)'
                  : crossAxisX === 'research_count'
                  ? 'จำนวนโครงการวิจัย (เรื่อง)'
                  : crossAxisX === 'academic_budget'
                  ? 'งบโครงการพัฒนาวิชาการ (ล้านบาท)'
                  : 'รายได้บริการวิชาการ (ล้านบาท)',
              font: { family: "'Kanit', sans-serif", size: 12, weight: 'bold' },
            },
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text:
                crossAxisY === 'pub_total'
                  ? 'ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)'
                  : crossAxisY === 'pub_scopus_q1_q2'
                  ? 'ผลงานตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)'
                  : crossAxisY === 'ip_count'
                  ? 'ทรัพย์สินทางปัญญา / สิทธิบัตร (เรื่อง)'
                  : 'จำนวนโครงการพัฒนาวิชาการ (เรื่อง)',
              font: { family: "'Kanit', sans-serif", size: 12, weight: 'bold' },
            },
            grid: { color: 'rgba(226, 232, 240, 0.7)' },
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
    const headers = ['กลุ่มข้อมูล (Category)'];
    if (query.secondaryDimensionId) headers.push('มิติย่อย (Sub-Category)');
    headers.push('ค่าที่วัดได้ (Value)', 'สัดส่วน (% Share)');

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
    link.setAttribute('download', `BI_Studio_${query.factDomain}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCrossAxisXLabel = (val: string) => {
    switch (val) {
      case 'research_budget': return 'งบประมาณวิจัยรวม (ล้านบาท)';
      case 'research_count': return 'จำนวนโครงการวิจัย (เรื่อง)';
      case 'academic_budget': return 'งบพัฒนาวิชาการ (ล้านบาท)';
      case 'service_revenue': return 'รายได้บริการวิชาการ (ล้านบาท)';
      default: return 'เลือกแกน X';
    }
  };

  const getCrossAxisYLabel = (val: string) => {
    switch (val) {
      case 'pub_total': return 'ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)';
      case 'pub_scopus_q1_q2': return 'ตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)';
      case 'ip_count': return 'ยื่นจดทรัพย์สินทางปัญญา / สิทธิบัตร (เรื่อง)';
      case 'academic_count': return 'จำนวนโครงการพัฒนาวิชาการ (เรื่อง)';
      default: return 'เลือกแกน Y';
    }
  };

  return (
    <div className="liquid-glass-bg" style={{ padding: '16px 24px 48px' }}>
      {/* 0. Studio Mode Switcher Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setStudioMode('standard')}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: studioMode === 'standard' ? '#00A651' : 'transparent',
              color: studioMode === 'standard' ? '#ffffff' : '#475569',
              fontWeight: studioMode === 'standard' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: studioMode === 'standard' ? '0 2px 6px rgba(0, 166, 81, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FaSlidersH /> วิเคราะห์มิติรายพันธกิจ
          </button>
          <button
            type="button"
            onClick={() => setStudioMode('crossDomain')}
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: studioMode === 'crossDomain' ? '#0284c7' : 'transparent',
              color: studioMode === 'crossDomain' ? '#ffffff' : '#475569',
              fontWeight: studioMode === 'crossDomain' ? 700 : 500,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: studioMode === 'crossDomain' ? '0 2px 6px rgba(2, 132, 199, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FaProjectDiagram /> วิเคราะห์ความสัมพันธ์หลายมิติ
          </button>
        </div>

        
      </div>

      {/* Global Time Filter Bar */}
      <div style={{ marginBottom: '16px' }}>
        <TimeFilterBar totalCount={aggregatedData.count} />
      </div>

      {/* ======================= MODE 1: STANDARD SINGLE-DOMAIN STUDIO ======================= */}
      {studioMode === 'standard' && (
        <>
          {/* Quick Domain Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div className="liquid-glass-dock" style={{ display: 'flex', padding: '6px', gap: '6px', flexWrap: 'wrap' }}>
              {(Object.keys(FACT_DOMAINS_CONFIG) as FactDomainId[]).map((dId) => {
                const def = FACT_DOMAINS_CONFIG[dId];
                const isActive = query.factDomain === dId;
                return (
                  <button
                    key={dId}
                    onClick={() => handleDomainChange(dId)}
                    type="button"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      border: 'none',
                      cursor: 'pointer',
                      background: isActive ? '#00a859' : 'transparent',
                      color: isActive ? '#ffffff' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      boxShadow: isActive ? '0 4px 12px rgba(0, 168, 89, 0.35)' : 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span>{getDomainIcon(dId)}</span>
                    <span>{def.nameTh}</span>
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
              {currentDomainDef.nameTh}: <strong style={{ color: '#00A651' }}>{aggregatedData.count}</strong> รายการ
            </span>
          </div>

          {/* Visual Query Builder Panel */}
          <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
              {/* A. X-Axis */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                 1. แกน X (มิติหลัก / จัดกลุ่ม)
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

              {/* B. Y-Axis */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  2. แกน Y (ตัววัดเชิงปริมาณ)
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

              {/* C. Aggregation */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  3. ฟังก์ชันรวมค่า (Aggregation)
                </label>
                <Select
                  value={query.aggregationFn || currentDomainDef.measures.find((m) => m.id === query.measureId)?.aggregation || 'SUM'}
                  onValueChange={(val) => {
                    if (val) setQuery((prev) => ({ ...prev, aggregationFn: val as AggregationType }));
                  }}
                >
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9">
                    <SelectValue>
                      {query.aggregationFn === 'SUM' && 'ผลรวมทั้งหมด (SUM)'}
                      {query.aggregationFn === 'COUNT' && 'จำนวนรายการ (COUNT)'}
                      {query.aggregationFn === 'AVG' && 'ค่าเฉลี่ย (AVERAGE)'}
                      {query.aggregationFn === 'MAX' && 'ค่าสูงสุด (MAX)'}
                      {query.aggregationFn === 'MIN' && 'ค่าต่ำสุด (MIN)'}
                      {!query.aggregationFn && 'ผลรวมทั้งหมด (SUM)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUM">ผลรวมทั้งหมด (SUM)</SelectItem>
                    <SelectItem value="COUNT">จำนวนรายการ (COUNT)</SelectItem>
                    <SelectItem value="AVG">ค่าเฉลี่ย (AVERAGE)</SelectItem>
                    <SelectItem value="MAX">ค่าสูงสุด (MAX)</SelectItem>
                    <SelectItem value="MIN">ค่าต่ำสุด (MIN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* D. Z-Axis */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  4. มิติย่อยซ้อน (Series / Z-Axis)
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
                        : '(ไม่มี - ดูมิติเดียว)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">(ไม่มี - ดูมิติเดียว)</SelectItem>
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

              {/* E. Filter Dept */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                   5. กรองภาควิชา (Department)
                </label>
                <DepartmentSelect
                  value={query.selectedDept || 'all'}
                  onChange={(val) => setQuery((prev) => ({ ...prev, selectedDept: val }))}
                  allowAll
                  allLabel="ทุกภาควิชา / ศูนย์"
                  allValue="all"
                  size="sm"
                  className="w-full h-9"
                />
              </div>
            </div>

            {/* Quick Chart Buttons */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a', marginRight: '4px' }}>รูปแบบกราฟ:</span>
                  {QUICK_CHART_TYPES.map((btn) => {
                    const isSelected = activeChartType === btn.type;
                    const isRecommended = aggregatedData.recommendedChartType === btn.type;
                    return (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setQuery((prev) => ({ ...prev, chartType: btn.type }))}
                        style={{
                          padding: '6px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          borderRadius: '9999px',
                          border: isSelected ? '2px solid #00A651' : isRecommended ? '1px dashed #00A651' : '1px solid #cbd5e1',
                          background: isSelected ? '#f0fbf5' : '#ffffff',
                          color: isSelected ? '#00A651' : '#334155',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '12px', color: isSelected ? '#00A651' : '#64748b' }}>{btn.icon}</span>
                        <span>{btn.label}</span>
                        {isRecommended && <FaStar style={{ fontSize: '10px', color: '#eab308' }} />}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAllCharts((prev) => !prev)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '9999px',
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
                    <span>{showAllCharts ? 'ย่อคลังกราฟ' : 'คลังกราฟทั้ง 16 รูปแบบ'}</span>
                    {showAllCharts ? <FaChevronUp style={{ fontSize: '10px' }} /> : <FaChevronDown style={{ fontSize: '10px' }} />}
                  </button>
                </div>
              </div>

              {showAllCharts && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '12px' }}>
                  {CHART_TYPES_CATALOG.map((group) => (
                    <div key={group.groupName} style={{ background: 'rgba(248, 250, 252, 0.7)', borderRadius: '14px', padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
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
                              border: activeChartType === btn.type ? '2px solid #00a859' : '1px solid #e2e8f0',
                              background: activeChartType === btn.type ? '#f0fbf5' : '#ffffff',
                              color: activeChartType === btn.type ? '#006838' : '#334155',
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

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            <div className="glass-card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ยอดรวมทั้งหมด</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#006838', marginTop: '2px' }}>
                {aggregatedData.totalValue.toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600 }}>บาท</span> : ''}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ค่าเฉลี่ยต่อกลุ่ม</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                {Math.round(aggregatedData.averageValue).toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600 }}>บาท</span> : ''}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>ค่าสูงสุดในกลุ่ม</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
                {aggregatedData.maxValue.toLocaleString()}{' '}
                {aggregatedData.format === 'currency' ? <span style={{ fontSize: '13px', fontWeight: 600 }}>บาท</span> : ''}
              </div>
            </div>
            <div className="glass-card" style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>จำนวนกลุ่มข้อมูล</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
                {aggregatedData.labels.length} <span style={{ fontSize: '13px', fontWeight: 600 }}>กลุ่ม</span>
              </div>
            </div>
          </div>

          {/* Standard Chart & Pivot Table */}
          <div style={{ display: 'grid', gridTemplateColumns: activeChartType === 'pivot' ? '1fr' : '1.7fr 1fr', gap: '20px' }}>
            {activeChartType !== 'pivot' && (
              <div className="glass-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {currentDomainDef.measures.find((m) => m.id === query.measureId)?.label} จำแนกตาม{' '}
                    {currentDomainDef.dimensions.find((d) => d.id === query.primaryDimensionId)?.label}
                  </h3>
                </div>
                {/* กล่องบรรจุกราฟที่ยืดหยุ่นและรองรับการเลื่อนดู Legend */}
                <div 
                  style={{ 
                    position: 'relative', 
                    minHeight: '390px', 
                    maxHeight: '520px', 
                    width: '100%', 
                    flex: 1, 
                    cursor: 'pointer',
                    overflowY: 'auto',
                    paddingRight: '6px'
                  }}
                >
                  <div style={{ height: activeChartType === 'donut' || activeChartType === 'pie' ? '460px' : '390px', width: '100%', position: 'relative' }}>
                    <canvas ref={chartRef} />
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card" style={{ padding: '20px 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTable style={{ color: '#00a859', fontSize: '15px' }} />
                  <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                    ตารางสรุปสถิติ (Detailed Pivot Table)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: '#006838',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <FaDownload /> ส่งออก CSV
                </button>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: activeChartType === 'pivot' ? '540px' : '390px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 12px', textAlign: 'left' }}>กลุ่มข้อมูล (แกน X)</th>
                      {query.secondaryDimensionId && (
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>มิติย่อย (Series)</th>
                      )}
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>ค่าที่วัดได้ (แกน Y)</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.tableRows.map((row, idx) => (
                      <tr
                        key={idx}
                        onClick={() => openCategoryDrillDown(row.category, row.subCategory)}
                        style={{
                          borderBottom: '1px solid rgba(226, 232, 240, 0.7)',
                          background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0f172a' }}>{row.category}</td>
                        {query.secondaryDimensionId && (
                          <td style={{ padding: '9px 12px', color: '#475569' }}>{row.subCategory || '-'}</td>
                        )}
                        <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#006838' }}>
                          {row.formattedValue}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', color: '#64748b' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              background: 'rgba(0, 168, 89, 0.1)',
                              color: '#006838',
                              fontWeight: 600,
                              fontSize: '11px',
                            }}
                          >
                            {row.sharePercent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================= MODE 2: CROSS-DOMAIN ANALYTICS ======================= */}
      {studioMode === 'crossDomain' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cross Domain Control Selector Bar */}
          <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaProjectDiagram style={{ color: '#0284c7' }} />
              <span>กำหนดสมการความสัมพันธ์ข้ามพันธกิจ (Cross-Domain Dimensions)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* แกน X */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  แกน X: พันธกิจต้นทาง (Input / Funding)
                </label>
                <Select value={crossAxisX} onValueChange={(val: any) => setCrossAxisX(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {getCrossAxisXLabel(crossAxisX)}
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
                  แกน Y: ผลผลิตที่ได้รับ (Output / Impact)
                </label>
                <Select value={crossAxisY} onValueChange={(val: any) => setCrossAxisY(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {getCrossAxisYLabel(crossAxisY)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pub_total">ผลงานตีพิมพ์ทางวิชาการรวม (เรื่อง)</SelectItem>
                    <SelectItem value="pub_scopus_q1_q2">ตีพิมพ์คุณภาพสูง Q1-Q2 (เรื่อง)</SelectItem>
                    <SelectItem value="ip_count">ยื่นจดทรัพย์สินทางปัญญา / สิทธิบัตร (เรื่อง)</SelectItem>
                    <SelectItem value="academic_count">จำนวนโครงการพัฒนาวิชาการ (เรื่อง)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* แกน Z */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  แกน Z: ขนาดฟองสบู่ (Bubble Size / Scale)
                </label>
                <Select value={crossAxisZ} onValueChange={(val: any) => setCrossAxisZ(val)}>
                  <SelectTrigger className="w-full bg-white text-slate-800 text-xs h-9 font-semibold">
                    <SelectValue>
                      {crossAxisZ === 'bubble_projects' ? 'ขนาดตามจำนวนโครงการวิจัยรวม' : 'ขนาดเท่ากันคงที่ (จุด Scatter ปกติ)'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble_projects">ขนาดตามจำนวนโครงการวิจัยรวม</SelectItem>
                    <SelectItem value="bubble_none">ขนาดเท่ากันคงที่ (จุด Scatter ปกติ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ระดับการวิเคราะห์ */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  ระดับการวิเคราะห์ (Entity Level)
                </label>
                <div style={{ height: '36px', display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                  7 ภาควิชาหลักของคณะฯ
                </div>
              </div>
            </div>
          </div>

          {/* Scatter Chart + Cross Matrix Table */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '20px' }}>
            {/* Bubble Chart */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                  แผนภาพกระจายความสัมพันธ์ (Cross-Domain Scatter / Bubble Matrix)
                </h4>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>💡 คลิกที่ฟองสบู่เพื่อเจาะลึกโครงการ</span>
              </div>
              <div style={{ height: '420px', width: '100%' }}>
                <canvas ref={crossChartRef} />
              </div>
            </div>

            {/* Cross Matrix Table */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                ตารางวิเคราะห์ความคุ้มค่าและผลตอบแทน
              </h4>
              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#0284c7', color: '#ffffff' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>ภาควิชา</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>งบวิจัย (ลบ.)</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>ตีพิมพ์ (เรื่อง)</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Q1-Q2</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>IP (เรื่อง)</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>งบ/1 บทความ</th>
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
                              title: `บูรณาการข้อมูล: ภาควิชา${d.name} (${d.code})`,
                              subtitle: `วิจัย ${d.researchCount} เรื่อง • ตีพิมพ์ ${d.pubTotal} เรื่อง • สิทธิบัตร ${d.ipCount} เรื่อง`,
                              items: [...d.rawResearchItems, ...d.rawPubItems, ...d.rawIpItems],
                              categoryKey: 'research',
                            })
                          }
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                            cursor: 'pointer',
                          }}
                        >
                          <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f172a' }}>{d.code}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>
                            {(d.researchBudget / 1000000).toFixed(2)}
                          </td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 600 }}>{d.pubTotal}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', color: '#2563eb', fontWeight: 600 }}>{d.pubHighTier}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', color: '#e11d48', fontWeight: 600 }}>{d.ipCount}</td>
                          <td style={{ padding: '9px 10px', textAlign: 'right', color: '#64748b', fontFamily: 'monospace' }}>
                            {costPerPub !== '-' ? `${costPerPub}M` : '-'}
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
        accentColor="#00A651"
        items={drillDown.items}
        categoryKey={drillDown.categoryKey || 'research'}
      />
    </div>
  );
}