'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCoins,
  FaUserTie,
  FaBuilding,
  FaLeaf,
  FaChevronRight,
  FaLayerGroup,
} from 'react-icons/fa';
import './research-redesign.css';
import { ResearchItem, normalizeFundSource } from '../_hooks/useResearchData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import { resolveItemFiscalYear } from '@/types/timeFilter';
import { YearSelectDropdown } from '@/components/ui/YearSelectDropdown';
import { STANDARD_YEAR_OPTIONS, getDefaultCompareYear } from '@/lib/fiscalYears';
import { isTestRecord } from '@/lib/sdgEngine';
import { resolvePersonAvatar, matchPerson, normalizePersonName } from '@/lib/personnelService';

const UCOL: Record<string, string> = {
  AE: '#65B98A',
  CPE: '#5B9BD5',
  IRRE: '#4FA9A0',
  FE: '#E88762',
  IE: '#9B78D0',
  ME: '#777ED0',
  CE: '#D96B8A',
  EEEC: '#91B95B',
  TDWCB: '#D5A04F',
  NAMC: '#BB68BC',
  OFS: '#E9A88F',
  OTH: '#64748b',
};

function resolveResearchDeptCode(rawDept: unknown, rawCode?: unknown): string {
  const cStr = String(rawCode || '').trim().toUpperCase();
  if (cStr === 'IRE' || cStr === 'IRRE') return 'IRRE';
  if (cStr === 'DWT' || cStr === 'TDW' || cStr === 'TDWCB') return 'TDWCB';
  if (UCOL[cStr] && cStr !== 'OTH') return cStr;
  const d = getDepartment(String(rawDept || ''));
  if (d && d.code !== '-' && UCOL[d.code]) return d.code;
  return 'OTH';
}

function resolveResearchYear(item: ResearchItem): string {
  const fy = resolveItemFiscalYear(item, 'research');
  if (fy && /^25(6[6-9]|7\d)$/.test(fy)) return fy;
  const rawFy = Number(item.fiscal_year || item.fiscal_year_be);
  if (rawFy >= 1966 && rawFy <= 1972) return String(rawFy + 600);
  if (rawFy >= 2020 && rawFy <= 2035) return String(rawFy + 543);
  if (rawFy >= 2560 && rawFy <= 2580) return String(rawFy);
  return '2568';
}

interface ResearchChartsProps {
  validData: ResearchItem[];
  allItems?: ResearchItem[];
  currentFiscalYear?: string;
  selectedDept?: string;
  onSelectDept?: (deptCode: string) => void;
  selectedFund?: string;
  onSelectFund?: (fundName: string) => void;
  activePerspective?: ResearchPerspective;
  onChangePerspective?: (persp: ResearchPerspective) => void;
  hideSelector?: boolean;
}

const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function resolveMonthIndex(rawDate: unknown): number {
  if (!rawDate) return -1;
  const str = String(rawDate).trim();
  // Source data mixes Buddhist-era and Gregorian years.
  const dObj = new Date(
    str.replace('1968', '2025').replace('1969', '2026').replace('2568', '2025').replace('2569', '2026')
  );
  if (!isNaN(dObj.getTime())) return dObj.getMonth();
  for (let i = 0; i < THAI_MONTHS.length; i++) {
    if (str.includes(THAI_MONTHS[i]) || str.includes(THAI_MONTHS[i].replace('.', ''))) return i;
  }
  return -1;
}

export function isExternalResearchItem(item: ResearchItem): boolean {
  const ext = Number(item.budget_external) || 0;
  const int = Number(item.budget_internal) || 0;
  if (ext > 0 && int === 0) return true;
  if (int > 0 && ext === 0) return false;
  if (ext > int) return true;
  if (int > ext) return false;
  if (item.fund_type === 'ภายนอก') return true;
  if (item.fund_type === 'ภายใน') return false;
  const src = String(item.fund_source || '');
  if (src.includes('ภายใน') || src.includes('คณะวิศวกรรมศาสตร์') || src.includes('วิทยาเขต')) return false;
  return true;
}

export type ResearchPerspective = 'overview' | 'productivity' | 'faculty' | 'sdg' | 'table';

export function ResearchCharts({
  validData,
  allItems,
  currentFiscalYear,
  selectedDept,
  onSelectDept,
  selectedFund,
  onSelectFund,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: ResearchChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<ResearchPerspective>('overview');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [researchBudgetMetric, setResearchBudgetMetric] = useState<'total' | 'average'>('total');
  const [monthlyBarMode, setMonthlyBarMode] = useState<'grouped' | 'stacked'>('grouped');
  const [monthlyMetric, setMonthlyMetric] = useState<'count' | 'budget'>('count');
  const [prodBudgetView, setProdBudgetView] = useState<'total' | 'stacked'>('total');
  const chartInstances = useRef<Chart[]>([]);

  // Faculty Interactive SVG Controls & State
  const baseAllResearch = useMemo(() => {
    const raw = allItems && allItems.length > 0 ? allItems : validData;
    return raw.filter((item) => item.name && item.name !== 'nan' && item.name !== 'NaT' && !isTestRecord(item));
  }, [allItems, validData]);

  const availableYears = useMemo(() => {
    return Array.from(STANDARD_YEAR_OPTIONS);
  }, []);

  const [facYear, setFacYear] = useState<string>(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      return currentFiscalYear;
    }
    return availableYears[0] || '2569';
  });

  const [facCmpYear, setFacCmpYear] = useState<string>(() => {
    return getDefaultCompareYear(facYear, availableYears);
  });

  useEffect(() => {
    if (currentFiscalYear && (currentFiscalYear === 'all' || availableYears.includes(currentFiscalYear))) {
      setFacYear(currentFiscalYear);
    }
  }, [currentFiscalYear, availableYears]);

  const [facIsCompare, setFacIsCompare] = useState<boolean>(false);
  const [facBarMode, setFacBarMode] = useState<'group' | 'stack'>('stack');
  const [facMetric, setFacMetric] = useState<'b' | 'n'>('b');
  const [activeFacIdx, setActiveFacIdx] = useState<number | null>(null);
  const [activeFacSeg, setActiveFacSeg] = useState<string | null>(null);
  const [tip, setTip] = useState<{ show: boolean; x: number; y: number; content: React.ReactNode }>({
    show: false,
    x: 0,
    y: 0,
    content: null,
  });

  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: ResearchItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#00A651',
    items: [],
  });

  // Calculate faculty PI aggregation
  const facultyPiRanking = useMemo(() => {
    const map: Record<string, { head: string; head_id?: number | string; dept: string; count: number; totalBudget: number; extBudget: number; items: ResearchItem[] }> = {};
    validData.forEach((item) => {
      const rawHead = String(item.head || '').trim();
      if (!rawHead || rawHead === '-' || rawHead === 'nan') return;
      const headName = normalizePersonName(rawHead);
      const resolvedHeadId = item.head_id || matchPerson(headName)?.id || (matchPerson(headName) as any)?._id;
      const key = resolvedHeadId ? `id_${resolvedHeadId}` : headName;
      if (!map[key]) {
        map[key] = {
          head: headName,
          head_id: resolvedHeadId || item.head_id,
          dept: item.department || '-',
          count: 0,
          totalBudget: 0,
          extBudget: 0,
          items: [],
        };
      }
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

      map[key].count++;
      map[key].totalBudget += b;
      map[key].extBudget += external;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Calculate department comparative metrics
  const deptComparativeMetrics = useMemo(() => {
    const map: Record<string, { code: string; name: string; count: number; totalBudget: number; extBudget: number; intBudget: number; megaCount: number; items: ResearchItem[] }> = {};
    validData.forEach((item) => {
      const dInfo = getDepartment(item.department);
      const code = dInfo.code !== '-' ? dInfo.code : 'OTH';

      if (!map[code]) {
        map[code] = {
          code,
          name: dInfo.name,
          count: 0,
          totalBudget: 0,
          extBudget: 0,
          intBudget: 0,
          megaCount: 0,
          items: [],
        };
      }
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

      map[code].count++;
      map[code].totalBudget += b;
      map[code].extBudget += external;
      map[code].intBudget += internal;
      if (b >= 10000000) {
        map[code].megaCount++;
      }
      map[code].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Qualitative Department Pastel Palette (Soft, high-contrast, WCAG AAA compliant)
  const DEPT_PASTEL_PALETTE = useMemo(
    () => [
      { fill: '#93C5FD', border: '#3B82F6' }, // 1. Soft Sky Blue
      { fill: '#86EFAC', border: '#22C55E' }, // 2. Soft Mint Emerald
      { fill: '#FDE68A', border: '#F59E0B' }, // 3. Soft Amber Peach
      { fill: '#DDD6FE', border: '#8B5CF6' }, // 4. Soft Lavender Violet
      { fill: '#FDA4AF', border: '#F43F5E' }, // 5. Soft Rose Coral
      { fill: '#99F6E4', border: '#0D9488' }, // 6. Soft Aqua Teal
      { fill: '#FED7AA', border: '#F97316' }, // 7. Soft Apricot Orange
      { fill: '#C7D2FE', border: '#6366F1' }, // 8. Soft Periwinkle Indigo
      { fill: '#F5D0FE', border: '#C026D3' }, // 9. Soft Orchid Pink
      { fill: '#E2E8F0', border: '#94A3B8' }, // 10. Soft Slate Gray
    ],
    []
  );

  const deptPastelColorMap = useMemo(() => {
    const map = new Map<string, { fill: string; border: string }>();
    deptComparativeMetrics.forEach((d, i) => {
      map.set(d.code, DEPT_PASTEL_PALETTE[i % DEPT_PASTEL_PALETTE.length]);
    });
    return map;
  }, [deptComparativeMetrics, DEPT_PASTEL_PALETTE]);

  // Calculate project scale tiers
  const budgetScaleData = useMemo(() => {
    const tiers = [
      { key: 't1', label: '< 5 แสนบาท', min: 0, max: 500000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't2', label: '5 แสน - 1 ล้าน', min: 500000, max: 1000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't3', label: '1 - 5 ล้าน', min: 1000000, max: 5000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't4', label: '5 - 10 ล้าน', min: 5000000, max: 10000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't5', label: '≥ 10 ล้านบาท', min: 10000000, max: Infinity, count: 0, total: 0, items: [] as ResearchItem[] },
    ];

    validData.forEach((item) => {
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

      for (const tier of tiers) {
        if (b >= tier.min && (tier.max === Infinity || b < tier.max)) {
          tier.count++;
          tier.total += b;
          tier.items.push(item);
          break;
        }
      }
    });

    return tiers;
  }, [validData]);

  // Month-only records cannot establish chronological order across years.
  const hasMultipleYears = useMemo(() => {
    const years = new Set<string>();
    validData.forEach((item) => {
      [item.start_date, item.end_date, item.fiscal_year, item.fiscal_year_be].forEach((value) => {
        const match = String(value || '').match(/(\d{4})/);
        if (match) years.add(match[1]);
      });
    });
    return years.size > 1;
  }, [validData]);

  // Records without a usable start month stay outside the monthly chart.
  const undatedResearch = useMemo(() => {
    let count = 0;
    let budget = 0;
    const items: ResearchItem[] = [];
    validData.forEach((item) => {
      if (resolveMonthIndex(item.start_date || item.date) >= 0) return;
      count++;
      budget +=
        (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0) || Number(item.budget) || 0;
      items.push(item);
    });
    return { count, budget, items };
  }, [validData]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 13.5;
    Chart.defaults.color = '#0f172a';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    const grandTotalResearchBudget = validData.reduce(
      (s, i) => s + (Number(i.budget_internal) || 0) + (Number(i.budget_external) || 0) || Number(i.budget) || 0,
      0
    );

    if (activePerspective === 'overview') {
      // 0. Monthly project count (external vs internal vertical bar chart)
      const monthlyExtItems: ResearchItem[][] = Array.from({ length: 12 }, () => []);
      const monthlyIntItems: ResearchItem[][] = Array.from({ length: 12 }, () => []);
      const monthlyExtBudget = Array(12).fill(0);
      const monthlyIntBudget = Array(12).fill(0);

      validData.forEach((item) => {
        const monthIdx = resolveMonthIndex(item.start_date || item.date);
        if (monthIdx < 0 || monthIdx >= 12) return;
        const extB = Number(item.budget_external) || 0;
        const intB = Number(item.budget_internal) || 0;
        const totalB = extB + intB || Number(item.budget) || 0;

        if (isExternalResearchItem(item)) {
          monthlyExtItems[monthIdx].push(item);
          monthlyExtBudget[monthIdx] += extB || totalB;
        } else {
          monthlyIntItems[monthIdx].push(item);
          monthlyIntBudget[monthIdx] += intB || totalB;
        }
      });

      const monthlyExtCount = monthlyExtItems.map((list) => list.length);
      const monthlyIntCount = monthlyIntItems.map((list) => list.length);
      const monthlyExtBudgetM = monthlyExtBudget.map((v) => Number((v / 1_000_000).toFixed(2)));
      const monthlyIntBudgetM = monthlyIntBudget.map((v) => Number((v / 1_000_000).toFixed(2)));

      const openMonthlyDrillDown = (monthIndex: number, datasetIndex?: number) => {
        const mName = THAI_MONTHS[monthIndex];
        if (!mName) return;

        const extItems = monthlyExtItems[monthIndex] || [];
        const intItems = monthlyIntItems[monthIndex] || [];
        const extB = monthlyExtBudget[monthIndex] || 0;
        const intB = monthlyIntBudget[monthIndex] || 0;

        if (datasetIndex === 0) {
          if (extItems.length === 0) return;
          setDrillDown({
            isOpen: true,
            title: `โครงการวิจัยทุนภายนอก: เดือน ${mName}`,
            subtitle: `รวม ${extItems.length} โครงการ • งบประมาณรวม ${extB.toLocaleString('th-TH')} บาท`,
            accentColor: '#0284c7',
            items: extItems,
          });
        } else if (datasetIndex === 1) {
          if (intItems.length === 0) return;
          setDrillDown({
            isOpen: true,
            title: `โครงการวิจัยทุนภายใน: เดือน ${mName}`,
            subtitle: `รวม ${intItems.length} โครงการ • งบประมาณรวม ${intB.toLocaleString('th-TH')} บาท`,
            accentColor: '#00A651',
            items: intItems,
          });
        } else {
          const allMonthItems = [...extItems, ...intItems];
          if (allMonthItems.length === 0) return;
          const totalB = extB + intB;
          setDrillDown({
            isOpen: true,
            title: `โครงการวิจัย: เดือน ${mName}`,
            subtitle: `รวม ${allMonthItems.length} โครงการ (ทุนภายนอก ${extItems.length} • ทุนภายใน ${intItems.length}) • งบประมาณรวม ${totalB.toLocaleString('th-TH')} บาท`,
            accentColor: '#00A651',
            items: allMonthItems,
          });
        }
      };

      const isStacked = monthlyBarMode === 'stacked';
      const isCount = monthlyMetric === 'count';

      createChart('c_re_monthly_ext_int', {
        type: 'bar',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            {
              label: 'ทุนภายนอก',
              data: isCount ? monthlyExtCount : monthlyExtBudgetM,
              backgroundColor: '#38BDF8', // Sky Blue
              borderColor: '#0284C7',
              borderWidth: 1.5,
              borderRadius: isStacked ? 0 : 6,
              stack: isStacked ? 'monthlyStack' : undefined,
            },
            {
              label: 'ทุนภายใน',
              data: isCount ? monthlyIntCount : monthlyIntBudgetM,
              backgroundColor: '#4ADE80', // Mint Emerald
              borderColor: '#16A34A',
              borderWidth: 1.5,
              borderRadius: isStacked ? 6 : 6,
              stack: isStacked ? 'monthlyStack' : undefined,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              openMonthlyDrillDown(hit.index, hit.datasetIndex);
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 16,
                boxHeight: 16,
                borderRadius: 4,
                useBorderRadius: true,
                font: { size: 13.5, weight: 600 },
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  return idx >= 0 ? `เดือน ${THAI_MONTHS[idx]}` : '';
                },
                label: (context: any) => {
                  const isExt = context.datasetIndex === 0;
                  const count = isExt ? monthlyExtCount[context.dataIndex] : monthlyIntCount[context.dataIndex];
                  const budget = isExt ? monthlyExtBudget[context.dataIndex] : monthlyIntBudget[context.dataIndex];
                  const label = context.dataset.label || '';
                  if (!isCount) {
                    return `${label}: ${(budget / 1_000_000).toFixed(2)} ล้านบาท (${count} โครงการ)`;
                  }
                  return `${label}: ${count} โครงการ (${(budget / 1_000_000).toFixed(2)} ล้านบาท)`;
                },
                afterBody: (items: any[]) => {
                  const index = items[0]?.dataIndex ?? -1;
                  if (index < 0) return [];
                  const totalCount = monthlyExtCount[index] + monthlyIntCount[index];
                  const totalBudget = monthlyExtBudget[index] + monthlyIntBudget[index];
                  if (totalCount === 0) return [];
                  return [
                    `─────────────────────────────`,
                    `รวมทั้งสิ้น: ${totalCount} โครงการ • ${(totalBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                  ];
                },
              },
            },
            datalabels: {
              display: (ctx: any) => Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: isStacked ? 'center' : 'end',
              align: isStacked ? 'center' : 'top',
              offset: isStacked ? 0 : 3,
              color: isStacked ? '#0f172a' : CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => {
                if (v <= 0) return '';
                return isCount ? `${v}` : `${v.toFixed(2)}`;
              },
            },
          },
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              stacked: isStacked,
              grace: isStacked ? '12%' : '18%',
              title: {
                display: true,
                text: isCount ? 'จำนวนโครงการ (โครงการ)' : 'งบประมาณ (ล้านบาท)',
                font: { weight: 700, size: 13.5 },
              },
              ticks: {
                stepSize: isCount ? 1 : undefined,
                precision: isCount ? 0 : 2,
                font: { size: 13, weight: 600 },
              },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
            },
            x: {
              stacked: isStacked,
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 } },
            },
          },
        },
      });

      // 1. Dept budget & project count
      const isAverageMode = researchBudgetMetric === 'average';
      const sortedDeptMetrics = [...deptComparativeMetrics].sort((a, b) => {
        const aValue = isAverageMode ? (a.count > 0 ? a.totalBudget / a.count : 0) : a.totalBudget;
        const bValue = isAverageMode ? (b.count > 0 ? b.totalBudget / b.count : 0) : b.totalBudget;
        return bValue - aValue;
      });
      const deptLabels = sortedDeptMetrics.map((d) => d.code);
      const deptBudgetM = sortedDeptMetrics.map((d) =>
        Number(((isAverageMode && d.count > 0 ? d.totalBudget / d.count : d.totalBudget) / 1000000).toFixed(2))
      );
      const deptColors = deptLabels.map(
        (code) => (deptPastelColorMap.get(code) || DEPT_PASTEL_PALETTE[0]).fill
      );
      const deptBorders = deptLabels.map(
        (code) => (deptPastelColorMap.get(code) || DEPT_PASTEL_PALETTE[0]).border
      );

      createChart('c_re_dept', {
        type: 'bar',
        data: {
          labels: deptLabels,
          datasets: [
            {
              label: isAverageMode ? 'งบประมาณเฉลี่ยต่อโครงการ (ล้านบาท)' : 'งบประมาณวิจัยรวม (ล้านบาท)',
              data: deptBudgetM,
              backgroundColor: deptColors,
              borderColor: deptBorders,
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const d = sortedDeptMetrics[hit.index];
              if (d) {
                if (onSelectDept) onSelectDept(d.code);
                const pct = grandTotalResearchBudget > 0 ? ((d.totalBudget / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                const averageBudget = d.count > 0 ? d.totalBudget / d.count : null;
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัย: สังกัด ${d.name} (${d.code})`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${d.count} โครงการ • งบประมาณรวม ${d.totalBudget.toLocaleString('th-TH')} บาท • เฉลี่ย ${averageBudget === null ? '—' : `${averageBudget.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`}`,
                  accentColor: (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border,
                  items: d.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const d = sortedDeptMetrics[context.dataIndex];
                  if (!d) return '';
                  const averageBudget = d.count > 0 ? d.totalBudget / d.count : null;
                  return [
                    `งบประมาณรวม: ${d.totalBudget.toLocaleString('th-TH')} บาท`,
                    `จำนวนโครงการ: ${d.count} โครงการ`,
                    `งบเฉลี่ย: ${averageBudget === null ? '—' : `${averageBudget.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`}`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) =>
                isAverageMode ? `${v.toFixed(2)} ลบ./โครงการ` : `${v.toFixed(2)} ลบ.`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '28%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: isAverageMode ? 'ล้านบาท / โครงการ' : 'ล้านบาท', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });

      // 2. Fund source breakdown
      const fundMap: Record<string, { name: string; budget: number; count: number; items: ResearchItem[] }> = {};
      validData.forEach((item) => {
        let fName = normalizeFundSource(item.fund_source);
        if (!fundMap[fName]) fundMap[fName] = { name: fName, budget: 0, count: 0, items: [] };
        const b = (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0) || Number(item.budget) || 0;
        fundMap[fName].budget += b;
        fundMap[fName].count++;
        fundMap[fName].items.push(item);
      });
      const sortedFunds = Object.values(fundMap).sort((a, b) => b.budget - a.budget).slice(0, 7);

      createChart('c_re_fund', {
        type: 'doughnut',
        data: {
          labels: sortedFunds.map((f) => f.name),
          datasets: [
            {
              data: sortedFunds.map((f) => f.budget),
              backgroundColor: CHART_PASTEL_PALETTE.series.slice(0, Math.max(sortedFunds.length, 1)),
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) {
              event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
            }
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const f = sortedFunds[hit.index];
              if (f) {
                const pct = grandTotalResearchBudget > 0 ? ((f.budget / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัยจากแหล่งทุน: ${f.name}`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${f.count} โครงการ • งบประมาณรวม ${f.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: CHART_PASTEL_PALETTE.series[hit.index % CHART_PASTEL_PALETTE.series.length],
                  items: f.items,
                });
              }
            }
          },
          plugins: {
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (value: number, context: any) => {
                const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const pct = (value * 100) / (sum || 1);
                return pct >= 6 ? `${pct.toFixed(0)}%` : '';
              },
            },
            legend: { position: 'right', labels: { padding: 14, boxWidth: 16, boxHeight: 16, font: { size: 13.5, weight: 600 } } },
          },
        },
      });

      // 3. Project Budget Scale Tiers Chart (Sequential scale progression avoiding collision with external/internal colors)
      const SCALE_COLORS = ['#BAE6FD', '#C7D2FE', '#DDD6FE', '#FDE68A', '#FDA4AF'];
      const SCALE_BORDERS = ['#0EA5E9', '#6366F1', '#8B5CF6', '#F59E0B', '#F43F5E'];
      createChart('c_re_scale', {
        type: 'bar',
        data: {
          labels: budgetScaleData.map((t) => t.label),
          datasets: [
            {
              label: 'จำนวนโครงการ (โครงการ)',
              data: budgetScaleData.map((t) => t.count),
              backgroundColor: SCALE_COLORS,
              borderColor: SCALE_BORDERS,
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) {
              event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
            }
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const tier = budgetScaleData[hit.index];
              if (tier) {
                const pct = grandTotalResearchBudget > 0 ? ((tier.total / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัย: ขนาดงบประมาณ ${tier.label}`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${tier.count} โครงการ • งบประมาณรวม ${tier.total.toLocaleString('th-TH')} บาท`,
                  accentColor: SCALE_BORDERS[hit.index] || '#6366F1',
                  items: tier.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => (v > 0 ? `${v} โครงการ` : ''),
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: '20%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนโครงการ (โครงการ)', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            x: { grid: { display: false }, ticks: { font: { size: 13, weight: 600 } } },
          },
        },
      });
    }

    if (activePerspective === 'productivity') {
      const openDeptDrillDown = (index: number) => {
        const d = deptComparativeMetrics[index];
        if (!d) return;
        if (onSelectDept) onSelectDept(d.code);
        const pct = grandTotalResearchBudget > 0 ? ((d.totalBudget / grandTotalResearchBudget) * 100).toFixed(1) : '0';
        const avgBudget = d.count > 0 ? d.totalBudget / d.count : null;
        setDrillDown({
          isOpen: true,
          title: `โครงการวิจัย: สังกัด ${d.name} (${d.code})`,
          subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${d.count} โครงการ • งบประมาณรวม ${d.totalBudget.toLocaleString('th-TH')} บาท • เฉลี่ย ${avgBudget === null ? '—' : `${avgBudget.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`}`,
          accentColor: (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border,
          items: d.items,
        });
      };

      // 1. Main Department Comparative Output (Full Width Combo / Stacked)
      const deptLabels = deptComparativeMetrics.map((d) => d.code);
      const deptCounts = deptComparativeMetrics.map((d) => d.count);
      const deptTotalBudgetM = deptComparativeMetrics.map((d) => Number((d.totalBudget / 1_000_000).toFixed(2)));
      const deptExtBudgetM = deptComparativeMetrics.map((d) => Number((d.extBudget / 1_000_000).toFixed(2)));
      const deptIntBudgetM = deptComparativeMetrics.map((d) => Number((d.intBudget / 1_000_000).toFixed(2)));
      const isStackedBudget = prodBudgetView === 'stacked';

      createChart('c_re_prod_dept_combo', {
        type: 'bar',
        data: {
          labels: deptLabels,
          datasets: isStackedBudget
            ? [
                {
                  type: 'bar' as const,
                  label: 'ทุนภายนอก (ล้านบาท)',
                  data: deptExtBudgetM,
                  backgroundColor: '#93C5FD', // Soft Pastel Sky Blue
                  borderColor: '#3B82F6',
                  borderWidth: 1.5,
                  borderRadius: 0,
                  stack: 'deptBudget',
                  yAxisID: 'y',
                  order: 2,
                },
                {
                  type: 'bar' as const,
                  label: 'ทุนภายใน (ล้านบาท)',
                  data: deptIntBudgetM,
                  backgroundColor: '#86EFAC', // Soft Pastel Mint Emerald
                  borderColor: '#22C55E',
                  borderWidth: 1.5,
                  borderRadius: 6,
                  stack: 'deptBudget',
                  yAxisID: 'y',
                  order: 2,
                },
                {
                  type: 'line' as const,
                  label: 'จำนวนโครงการ (โครงการ)',
                  data: deptCounts,
                  borderColor: '#FB7185', // Soft Pastel Rose
                  backgroundColor: 'rgba(251, 113, 133, 0.12)',
                  borderWidth: 2.5,
                  tension: 0.35,
                  pointRadius: 4.5,
                  pointHoverRadius: 6.5,
                  pointBackgroundColor: '#FB7185',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 1.5,
                  yAxisID: 'y1',
                  order: 1,
                },
              ]
            : [
                {
                  type: 'bar' as const,
                  label: 'งบประมาณวิจัยรวม (ล้านบาท)',
                  data: deptTotalBudgetM,
                  backgroundColor: '#86EFAC', // Soft Pastel Mint Emerald (KU Research Theme)
                  borderColor: '#22C55E',
                  borderWidth: 1.5,
                  borderRadius: 6,
                  yAxisID: 'y',
                  order: 2,
                },
                {
                  type: 'line' as const,
                  label: 'จำนวนโครงการ (โครงการ)',
                  data: deptCounts,
                  borderColor: '#FB7185', // Soft Pastel Rose
                  backgroundColor: 'rgba(251, 113, 133, 0.12)',
                  borderWidth: 2.5,
                  tension: 0.35,
                  pointRadius: 4.5,
                  pointHoverRadius: 6.5,
                  pointBackgroundColor: '#FB7185',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 1.5,
                  yAxisID: 'y1',
                  order: 1,
                },
              ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) openDeptDrillDown(hit.index);
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 16,
                boxHeight: 16,
                borderRadius: 4,
                useBorderRadius: true,
                font: { size: 13.5, weight: 600 },
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const d = deptComparativeMetrics[idx];
                  return d ? `สังกัด: ${d.name} (${d.code})` : '';
                },
                label: (context: any) => {
                  const d = deptComparativeMetrics[context.dataIndex];
                  if (!d) return '';
                  if (context.dataset.yAxisID === 'y1') {
                    return `จำนวนโครงการ: ${d.count} โครงการ`;
                  }
                  if (isStackedBudget) {
                    const isExt = context.datasetIndex === 0;
                    const val = isExt ? d.extBudget : d.intBudget;
                    return `${context.dataset.label}: ${(val / 1_000_000).toFixed(2)} ล้านบาท`;
                  }
                  return `งบประมาณรวม: ${(d.totalBudget / 1_000_000).toFixed(2)} ล้านบาท`;
                },
                afterBody: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const d = deptComparativeMetrics[idx];
                  if (!d) return [];
                  const avgM = d.count > 0 ? (d.totalBudget / d.count / 1_000_000).toFixed(2) : '0.00';
                  const extPct = d.totalBudget > 0 ? ((d.extBudget / d.totalBudget) * 100).toFixed(1) : '0';
                  return [
                    `─────────────────────────────`,
                    `งบเฉลี่ยต่อโครงการ: ${avgM} ล้านบาท/โครงการ`,
                    `สัดส่วนทุนภายนอก: ${extPct}% (${(d.extBudget / 1_000_000).toFixed(2)} ลบ.)`,
                    d.megaCount > 0 ? `โครงการขนาดใหญ่ (≥10 ลบ.): ${d.megaCount} โครงการ` : '',
                  ].filter(Boolean);
                },
              },
            },
            datalabels: {
              display: (ctx: any) => Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 8 : 2),
              color: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#BE123C' : CHART_PASTEL_PALETTE.datalabels.dark,
              backgroundColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#FFFFFF' : 'transparent',
              borderColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#FECDD3' : 'transparent',
              borderWidth: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 1 : 0),
              borderRadius: 4,
              padding: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? { top: 2, bottom: 2, left: 4, right: 4 } : 0),
              font: { weight: 'bold', size: 12.5 },
              formatter: (v: number, ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? `${v} โครงการ` : `${v.toFixed(2)} ลบ.`,
            },
          },
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              grace: '12%',
              stacked: isStackedBudget,
              title: { display: true, text: 'งบประมาณ (ล้านบาท)', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              suggestedMax: Math.max(...deptCounts, 1) + 3,
              ticks: { stepSize: 1, precision: 0, font: { size: 13, weight: 600 } },
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'จำนวนโครงการ (โครงการ)', font: { size: 13.5, weight: 700 } },
            },
            x: {
              stacked: isStackedBudget,
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 } },
            },
          },
        },
      });

      // 2. Department External Funding Dependency Ratio (Non-redundant Competitive Output)
      const sortedByExtPct = [...deptComparativeMetrics]
        .map((d) => ({
          ...d,
          extPct: d.totalBudget > 0 ? Math.round((d.extBudget / d.totalBudget) * 100) : 0,
        }))
        .sort((a, b) => b.extPct - a.extPct || b.totalBudget - a.totalBudget);

      createChart('c_re_prod_dept_ext_pct', {
        type: 'bar',
        data: {
          labels: sortedByExtPct.map((d) => d.code),
          datasets: [
            {
              label: 'สัดส่วนทุนภายนอก (%)',
              data: sortedByExtPct.map((d) => d.extPct),
              backgroundColor: '#93C5FD', // Soft Pastel Sky Blue (External Funding Theme)
              borderColor: '#3B82F6',
              borderWidth: 1.5,
              borderRadius: 6,
              maxBarThickness: 28,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const d = sortedByExtPct[hit.index];
              if (d) {
                const originalIndex = deptComparativeMetrics.findIndex((item) => item.code === d.code);
                if (originalIndex >= 0) openDeptDrillDown(originalIndex);
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v}%`,
            },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const d = sortedByExtPct[idx];
                  return d ? `สังกัด: ${d.name} (${d.code})` : '';
                },
                label: (context: any) => {
                  const d = sortedByExtPct[context.dataIndex];
                  if (!d) return '';
                  return [
                    `สัดส่วนทุนภายนอก: ${d.extPct}%`,
                    `ทุนภายนอก: ${(d.extBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                    `ทุนภายใน: ${(d.intBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                    `งบประมาณรวม: ${(d.totalBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 108,
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              ticks: {
                callback: (v: any) => `${v}%`,
                stepSize: 20,
                font: { size: 13, weight: 600 },
              },
              title: { display: true, text: 'ร้อยละ (%)', font: { size: 13.5, weight: 700 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });

      // 3. Average Budget per Project by Department (Horizontal Bar Chart)
      const sortedByAvg = [...deptComparativeMetrics]
        .map((d) => ({
          ...d,
          avgBudget: d.count > 0 ? d.totalBudget / d.count : 0,
        }))
        .sort((a, b) => b.avgBudget - a.avgBudget);

      createChart('c_re_prod_dept_avg', {
        type: 'bar',
        data: {
          labels: sortedByAvg.map((d) => d.code),
          datasets: [
            {
              label: 'งบประมาณเฉลี่ยต่อโครงการ (ล้านบาท)',
              data: sortedByAvg.map((d) => Number((d.avgBudget / 1_000_000).toFixed(2))),
              backgroundColor: '#DDD6FE', // Soft Pastel Lavender Violet (Distinct analytical metric, avoiding confusion with Internal Funding)
              borderColor: '#8B5CF6',
              borderWidth: 1.5,
              borderRadius: 6,
              maxBarThickness: 28,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const d = sortedByAvg[hit.index];
              if (d) {
                const originalIndex = deptComparativeMetrics.findIndex((item) => item.code === d.code);
                if (originalIndex >= 0) openDeptDrillDown(originalIndex);
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v.toFixed(2)} ลบ./โครงการ`,
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const d = sortedByAvg[context.dataIndex];
                  if (!d) return '';
                  return [
                    `งบเฉลี่ย: ${(d.avgBudget / 1_000_000).toFixed(2)} ล้านบาท/โครงการ`,
                    `งบรวม: ${(d.totalBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                    `จำนวนโครงการ: ${d.count} โครงการ`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'ล้านบาท / โครงการ', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      const top10Pis = facultyPiRanking.slice(0, 10);
      const piLabels = top10Pis.map((f) => f.head);
      const piBudgetsM = top10Pis.map((f) => Number((f.totalBudget / 1_000_000).toFixed(2)));

      createChart('c_re_faculty_top10', {
        type: 'bar',
        data: {
          labels: piLabels,
          datasets: [
            {
              label: 'งบประมาณวิจัยรวม (ล้านบาท)',
              data: piBudgetsM,
              backgroundColor: '#86EFAC', // Soft Pastel Mint Emerald (KU Research Theme)
              borderColor: '#22C55E',
              borderWidth: 1.5,
              borderRadius: 6,
              maxBarThickness: 28,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'y');
            if (hit) {
              const f = top10Pis[hit.index];
              if (f) {
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัย: ${f.head} (${f.dept})`,
                  subtitle: `รวม ${f.count} โครงการ • งบประมาณรวม ${f.totalBudget.toLocaleString('th-TH')} บาท • ทุนภายนอก ${f.extBudget.toLocaleString('th-TH')} บาท`,
                  accentColor: '#22C55E',
                  items: f.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v.toFixed(2)} ลบ.`,
            },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const f = top10Pis[idx];
                  return f ? `หัวหน้าโครงการ: ${f.head} (${f.dept})` : '';
                },
                label: (context: any) => {
                  const f = top10Pis[context.dataIndex];
                  if (!f) return '';
                  return [
                    `งบประมาณรวม: ${(f.totalBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                    `งบทุนภายนอก: ${(f.extBudget / 1_000_000).toFixed(2)} ล้านบาท`,
                    `จำนวนโครงการ: ${f.count} โครงการ`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'ล้านบาท', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 }, color: '#334155' },
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [
    validData,
    activePerspective,
    researchBudgetMetric,
    deptComparativeMetrics,
    budgetScaleData,
    facultyPiRanking,
    onSelectDept,
    onSelectFund,
    monthlyBarMode,
    monthlyMetric,
    prodBudgetView,
    deptPastelColorMap,
    DEPT_PASTEL_PALETTE,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Overview & Funding & Scale */}
      {activePerspective === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-grid">
            <div className="chart-card chart-full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaChartBar style={{ color: '#00A651' }} /> เปรียบเทียบโครงการวิจัยรายเดือน (ทุนภายนอก vs ทุนภายใน)
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Mode toggle: Grouped vs Stacked */}
                  <div
                    style={{
                      display: 'inline-flex',
                      backgroundColor: '#f1f5f9',
                      padding: '3px 4px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMonthlyBarMode('grouped')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: monthlyBarMode === 'grouped' ? '#ffffff' : 'transparent',
                        color: monthlyBarMode === 'grouped' ? '#00A651' : '#64748b',
                        fontWeight: monthlyBarMode === 'grouped' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: monthlyBarMode === 'grouped' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      แยกแท่ง
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyBarMode('stacked')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: monthlyBarMode === 'stacked' ? '#ffffff' : 'transparent',
                        color: monthlyBarMode === 'stacked' ? '#00A651' : '#64748b',
                        fontWeight: monthlyBarMode === 'stacked' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: monthlyBarMode === 'stacked' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      แท่งซ้อน
                    </button>
                  </div>

                  {/* Metric toggle: Count vs Budget */}
                  <div
                    style={{
                      display: 'inline-flex',
                      backgroundColor: '#f1f5f9',
                      padding: '3px 4px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMonthlyMetric('count')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: monthlyMetric === 'count' ? '#ffffff' : 'transparent',
                        color: monthlyMetric === 'count' ? '#00A651' : '#64748b',
                        fontWeight: monthlyMetric === 'count' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: monthlyMetric === 'count' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      จำนวนโครงการ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyMetric('budget')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: monthlyMetric === 'budget' ? '#ffffff' : 'transparent',
                        color: monthlyMetric === 'budget' ? '#00A651' : '#64748b',
                        fontWeight: monthlyMetric === 'budget' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: monthlyMetric === 'budget' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      งบประมาณ
                    </button>
                  </div>
                </div>
              </div>
              <div className="chart-wrapper" style={{ height: '390px', cursor: 'pointer' }}>
                <canvas id="c_re_monthly_ext_int" />
              </div>
              {undatedResearch.count > 0 && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                  หมายเหตุ: อีก {undatedResearch.count} โครงการไม่ระบุเดือนที่เริ่มต้น
                  (งบประมาณ {(undatedResearch.budget / 1_000_000).toFixed(2)} ล้านบาท) จึงไม่ปรากฏในกราฟรายเดือน{' '}
                  <button
                    type="button"
                    onClick={() =>
                      setDrillDown({
                        isOpen: true,
                        title: 'โครงการวิจัยที่ไม่ระบุเดือนที่เริ่มต้น',
                        subtitle: `รวม ${undatedResearch.count} โครงการ • งบประมาณ ${undatedResearch.budget.toLocaleString('th-TH')} บาท`,
                        accentColor: '#64748b',
                        items: undatedResearch.items,
                      })
                    }
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      color: '#047857',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    ดูรายการ
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px' }}>
                  <FaChartBar style={{ color: '#00A651' }} /> งบประมาณวิจัยตามสังกัด
                </h3>
                <div
                  style={{
                    display: 'inline-flex',
                    backgroundColor: '#f1f5f9',
                    padding: '3px 4px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setResearchBudgetMetric('total')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: researchBudgetMetric === 'total' ? '#ffffff' : 'transparent',
                      color: researchBudgetMetric === 'total' ? '#00A651' : '#64748b',
                      fontWeight: researchBudgetMetric === 'total' ? 700 : 600,
                      cursor: 'pointer',
                      boxShadow: researchBudgetMetric === 'total' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      fontSize: '13px',
                    }}
                  >
                    งบรวม
                  </button>
                  <button
                    type="button"
                    onClick={() => setResearchBudgetMetric('average')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: researchBudgetMetric === 'average' ? '#ffffff' : 'transparent',
                      color: researchBudgetMetric === 'average' ? '#00A651' : '#64748b',
                      fontWeight: researchBudgetMetric === 'average' ? 700 : 600,
                      cursor: 'pointer',
                      boxShadow: researchBudgetMetric === 'average' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      fontSize: '13px',
                    }}
                  >
                    เฉลี่ย/โครงการ
                  </button>
                </div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b' }}>
                {researchBudgetMetric === 'average'
                  ? 'เรียงตามงบประมาณเฉลี่ยต่อโครงการ'
                  : 'เรียงตามงบประมาณรวมจากมากไปน้อย'}
              </p>
              <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                <canvas id="c_re_dept" />
              </div>
            </div>

            <div className="chart-card">
              <h3 style={{ fontSize: '15px' }}>
                <FaChartPie style={{ color: '#00A651' }} /> สัดส่วนงบประมาณตามแหล่งทุนวิจัย
              </h3>
              <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                <canvas id="c_re_fund" />
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card chart-full">
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLayerGroup style={{ color: '#0284c7' }} /> การกระจายโครงการตามช่วงขนาดงบประมาณ
              </h3>
              <div className="chart-wrapper" style={{ height: '360px', cursor: 'pointer' }}>
                <canvas id="c_re_scale" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Department Comparative Output */}
      {activePerspective === 'productivity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. Main Full-Width Comparative Chart: Dual-axis Budget & Project Count */}
          <div className="chart-grid">
            <div className="chart-card chart-full">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  <FaChartLine style={{ color: '#00A651' }} /> เปรียบเทียบงบประมาณวิจัยและจำนวนโครงการรายสังกัด
                </h3>
                <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '3px 4px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
                  <button
                    type="button"
                    onClick={() => setProdBudgetView('total')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: prodBudgetView === 'total' ? '#ffffff' : 'transparent',
                      color: prodBudgetView === 'total' ? '#00A651' : '#64748b',
                      fontWeight: prodBudgetView === 'total' ? 700 : 600,
                      cursor: 'pointer',
                      boxShadow: prodBudgetView === 'total' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      fontSize: '13px',
                    }}
                  >
                    งบรวม + โครงการ
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdBudgetView('stacked')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: prodBudgetView === 'stacked' ? '#ffffff' : 'transparent',
                      color: prodBudgetView === 'stacked' ? '#00A651' : '#64748b',
                      fontWeight: prodBudgetView === 'stacked' ? 700 : 600,
                      cursor: 'pointer',
                      boxShadow: prodBudgetView === 'stacked' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      fontSize: '13px',
                    }}
                  >
                    แยกทุนภายนอก/ภายใน
                  </button>
                </div>
              </div>
              <div className="chart-wrapper" style={{ height: '400px', cursor: 'pointer' }}>
                <canvas id="c_re_prod_dept_combo" />
              </div>
            </div>
          </div>

          {/* 2. Grid: External Funding Ratio & Average Budget per Project (Non-redundant Essential Insights) */}
          <div className="chart-grid">
            <div className="chart-card">
              <h3 style={{ fontSize: '15px' }}>
                <FaCoins style={{ color: '#0284c7' }} /> สัดส่วนทุนวิจัยภายนอกรายสังกัด (%)
              </h3>
              <div className="chart-wrapper" style={{ height: '360px', cursor: 'pointer' }}>
                <canvas id="c_re_prod_dept_ext_pct" />
              </div>
            </div>

            <div className="chart-card">
              <h3 style={{ fontSize: '15px' }}>
                <FaChartBar style={{ color: '#00A651' }} /> งบประมาณเฉลี่ยต่อโครงการรายสังกัด
              </h3>
              <div className="chart-wrapper" style={{ height: '360px', cursor: 'pointer' }}>
                <canvas id="c_re_prod_dept_avg" />
              </div>
            </div>
          </div>

          {/* 3. Existing Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                ตารางเปรียบเทียบผลงานและงบประมาณวิจัยรายสังกัด
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                วิเคราะห์ผลิตภาพเฉลี่ยต่อโครงการ สัดส่วนทุนภายนอก และโครงการขนาดใหญ่ (≥ 10 ล้านบาท)
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table-manage" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>สังกัด</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณรวม</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบเฉลี่ย / โครงการ</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>ทุนภายนอก (สัดส่วน)</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>โครงการขนาดใหญ่ (≥10 ลบ.)</th>
                  </tr>
                </thead>
                <tbody>
                  {deptComparativeMetrics.map((d) => {
                    const avgM = d.count > 0 ? (d.totalBudget / d.count / 1000000).toFixed(2) : '0.00';
                    const extPct = d.totalBudget > 0 ? Math.round((d.extBudget / d.totalBudget) * 100) : 0;
                    return (
                      <tr
                        key={d.code}
                        onClick={() => {
                          if (onSelectDept) onSelectDept(d.code);
                          const deptPastel = deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0];
                          setDrillDown({
                            isOpen: true,
                            title: `โครงการวิจัย: ${d.name} (${d.code})`,
                            subtitle: `รวม ${d.count} โครงการ • งบประมาณ ${d.totalBudget.toLocaleString('th-TH')} บาท`,
                            accentColor: deptPastel.border,
                            items: d.items,
                          });
                        }}
                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).fill,
                                border: `1.5px solid ${(deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border}`,
                                flexShrink: 0,
                              }}
                            />
                            <span>{d.name} ({d.code})</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{d.count}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                          {(d.totalBudget / 1000000).toFixed(2)} ลบ.
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#475569' }}>
                          {avgM} ลบ.
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                          {(d.extBudget / 1000000).toFixed(2)} ลบ. ({extPct}%)
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          {d.megaCount > 0 ? (
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                              {d.megaCount} โครงการ
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Research Faculty & PIs */}
      {activePerspective === 'faculty' && (() => {
        const computePisByYear = (yr: string) => {
          const map: Record<
            string,
            {
              key: string;
              head: string;
              head_id?: number | string;
              dept: string;
              deptCode: string;
              count: number;
              extN: number;
              intN: number;
              totalBudget: number;
              totalBudgetM: number;
              extBudget: number;
              extBudgetM: number;
              intBudget: number;
              intBudgetM: number;
              items: ResearchItem[];
              extItems: ResearchItem[];
              intItems: ResearchItem[];
            }
          > = {};
          baseAllResearch.forEach((item) => {
            if (yr !== 'all' && resolveResearchYear(item) !== yr) return;
            const headName = String(item.head || '').trim();
            if (!headName || headName === '-' || headName === 'nan') return;
            const key = item.head_id ? `id_${item.head_id}` : headName;
            if (!map[key]) {
              map[key] = {
                key,
                head: headName,
                head_id: item.head_id,
                dept: item.department || '-',
                deptCode: resolveResearchDeptCode(item.department, (item as any).departmentCode),
                count: 0,
                extN: 0,
                intN: 0,
                totalBudget: 0,
                totalBudgetM: 0,
                extBudget: 0,
                extBudgetM: 0,
                intBudget: 0,
                intBudgetM: 0,
                items: [],
                extItems: [],
                intItems: [],
              };
            }
            const internal = Number(item.budget_internal) || 0;
            const external = Number(item.budget_external) || 0;
            const b = internal + external || Number(item.budget) || 0;
            const isExt = isExternalResearchItem(item);

            map[key].count++;
            map[key].totalBudget += b;
            map[key].extBudget += external || (isExt ? b : 0);
            map[key].intBudget += internal || (!isExt ? b : 0);
            map[key].items.push(item);
            if (isExt) {
              map[key].extN++;
              map[key].extItems.push(item);
            } else {
              map[key].intN++;
              map[key].intItems.push(item);
            }
          });
          Object.values(map).forEach((f) => {
            f.totalBudgetM = Number((f.totalBudget / 1_000_000).toFixed(2));
            f.extBudgetM = Number((f.extBudget / 1_000_000).toFixed(2));
            f.intBudgetM = Number((f.intBudget / 1_000_000).toFixed(2));
          });
          return map;
        };

        const curPiMap = computePisByYear(facYear);
        const cmpPiMap = computePisByYear(facCmpYear);
        const hasCmp = Object.values(cmpPiMap).some((f) => f.count > 0);
        const isCmp = facIsCompare && hasCmp;

        const top10List = Object.values(curPiMap)
          .sort((a, b) => (facMetric === 'n' ? b.count - a.count || b.totalBudget - a.totalBudget : b.totalBudget - a.totalBudget))
          .slice(0, 10);

        const renderChip = (c: number, p: number, isB = false) => {
          const base: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: '9999px',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          };
          if (p === 0 && c === 0) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>–</span>;
          if (p === 0 && c > 0) return <span style={{ ...base, backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>ใหม่</span>;
          const diff = c - p;
          const isSame = isB ? Math.abs(diff) < 0.05 : Math.round(diff) === 0;
          if (isSame) return <span style={{ ...base, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>เท่าเดิม</span>;
          const isUp = diff > 0;
          const txt = isB && p > 0 ? `${isUp ? '+' : ''}${Math.abs((diff / p) * 100).toFixed(0)}%` : `${isUp ? '+' : ''}${Math.abs(Math.round(diff))}`;
          return (
            <span
              style={{
                ...base,
                gap: '3px',
                padding: '2px 8px',
                backgroundColor: isUp ? '#dcfce7' : '#fee2e2',
                color: isUp ? '#15803d' : '#b91c1c',
                border: isUp ? '1px solid #bbf7d0' : '1px solid #fecaca',
              }}
            >
              <span style={{ fontSize: '9.5px' }}>{isUp ? '▲' : '▼'}</span>
              <span>{txt}</span>
            </span>
          );
        };

        const N = Math.max(top10List.length, 1);
        let maxV = 0;
        top10List.forEach((f) => {
          const cExt = facMetric === 'n' ? f.extN : f.extBudgetM;
          const cInt = facMetric === 'n' ? f.intN : f.intBudgetM;
          const cTot = cExt + cInt;
          const pLead = cmpPiMap[f.key];
          const pTot = pLead ? (facMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
          if (isCmp) maxV = Math.max(maxV, cTot, pTot);
          else if (facBarMode === 'group') maxV = Math.max(maxV, cExt, cInt);
          else maxV = Math.max(maxV, cTot);
        });
        const step = facMetric === 'n' ? Math.max(1, Math.ceil(maxV / 4)) : Math.max(0.5, Math.ceil((maxV / 4) * 2) / 2);
        const top = Math.max(facMetric === 'n' ? 4 : 2, step * 4);
        const svgW = Math.max(1020, N * 98);
        const svgH = 340;
        const L = 56;
        const R = 28;
        const Tp = 34;
        const B = 54;
        const pw = svgW - L - R;
        const ph = svgH - Tp - B;
        const slot = pw / N;
        const yPos = (v: number) => Tp + ph - (ph * v) / (top || 1);

        return (
          <div className="rr-container">
            <div className="rr-wrap">
              {/* Top 10 PIs Interactive SVG Chart */}
              <section className="rr-card rr-full" aria-labelledby="re-fac-h">
                <div className="rr-head">
                  <h2 className="rr-title-h2" id="re-fac-h">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M5 20V10M12 20V4M19 20v-7" />
                    </svg>
                    <span>10 อันดับหัวหน้าโครงการวิจัยที่มีงบประมาณวิจัยสูงสุด</span>
                  </h2>
                  <div className="rr-ctrls">
                    <YearSelectDropdown
                      label="ปี"
                      value={facYear}
                      onChange={(newY) => {
                        setFacYear(newY);
                        if (facCmpYear === newY) {
                          setFacCmpYear(getDefaultCompareYear(newY, availableYears));
                        }
                      }}
                      includeAll={true}
                      allPosition="top"
                    />
                    <div className="rr-seg-ctl" role="group" aria-label="โหมดการแสดงผล">
                      <button type="button" aria-pressed={!facIsCompare} onClick={() => setFacIsCompare(false)}>
                        ภาพรวม
                      </button>
                      <button type="button" aria-pressed={facIsCompare} onClick={() => setFacIsCompare(true)}>
                        เปรียบเทียบข้ามปี
                      </button>
                    </div>
                    {facIsCompare && (
                      <YearSelectDropdown
                        label="เทียบกับปี"
                        value={facCmpYear}
                        onChange={(newCmp) => setFacCmpYear(newCmp)}
                        excludeYear={facYear}
                        includeAll={false}
                      />
                    )}
                  </div>
                </div>

                <div className="rr-ctrls rr-row2">
                  {!isCmp && (
                    <div className="rr-seg-ctl" role="group" aria-label="รูปแบบแท่ง">
                      <button type="button" aria-pressed={facBarMode === 'group'} onClick={() => setFacBarMode('group')}>
                        แยกแท่ง
                      </button>
                      <button type="button" aria-pressed={facBarMode === 'stack'} onClick={() => setFacBarMode('stack')}>
                        แท่งซ้อน
                      </button>
                    </div>
                  )}
                  <div className="rr-seg-ctl" role="group" aria-label="ตัวชี้วัด">
                    <button type="button" aria-pressed={facMetric === 'b'} onClick={() => setFacMetric('b')}>
                      งบประมาณวิจัยรวม (ลบ.)
                    </button>
                    <button type="button" aria-pressed={facMetric === 'n'} onClick={() => setFacMetric('n')}>
                      จำนวนโครงการ
                    </button>
                  </div>
                </div>

                <div className="rr-legend">
                  {isCmp ? (
                    <>
                      <span className="rr-pill st" style={{ '--c': 'var(--cur)' } as React.CSSProperties}>
                        <i />
                        ปี {facYear}
                      </span>
                      <span className="rr-pill st" style={{ '--c': 'var(--ghost)' } as React.CSSProperties}>
                        <i />
                        ปี {facCmpYear}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="rr-pill st" style={{ '--c': '#0ea5e9' } as React.CSSProperties}>
                        <i />
                        ทุนภายนอก
                      </span>
                      <span className="rr-pill st" style={{ '--c': '#22c55e' } as React.CSSProperties}>
                        <i />
                        ทุนภายใน
                      </span>
                    </>
                  )}
                </div>

                <div className="rr-scroller">
                  <div
                    className="rr-plot"
                    style={{ minWidth: '820px', width: `${svgW}px` }}
                    onPointerLeave={() => {
                      setActiveFacIdx(null);
                      setActiveFacSeg(null);
                      setTip((t) => ({ ...t, show: false }));
                    }}
                  >
                    <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block', overflow: 'visible', userSelect: 'none' }}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const v = Math.round(i * step * 10) / 10;
                        const y = yPos(v);
                        return (
                          <g key={i}>
                            <line x1={L} x2={svgW - R} y1={y} y2={y} stroke="#e8edf3" strokeWidth={1} strokeDasharray={i === 0 ? 'none' : '3 5'} />
                            <text x={L - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="500" fill="var(--muted)">
                              {v}
                            </text>
                          </g>
                        );
                      })}

                      <text transform={`translate(16, ${Tp + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--muted)">
                        {facMetric === 'n' ? 'จำนวนโครงการ (โครงการ)' : 'งบประมาณวิจัยรวม (ล้านบาท)'}
                      </text>

                      {top10List.map((f, i) => {
                        const x0 = L + slot * i;
                        const cx = x0 + slot / 2;
                        const cExt = facMetric === 'n' ? f.extN : f.extBudgetM;
                        const cInt = facMetric === 'n' ? f.intN : f.intBudgetM;
                        const curTot = Number((cExt + cInt).toFixed(2));
                        const pLead = cmpPiMap[f.key];
                        const cmpTot = pLead ? (facMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
                        const deptCol = UCOL[f.deptCode] || UCOL.OTH;
                        const shortName = f.head.length > 15 ? f.head.slice(0, 14) + '…' : f.head;

                        let barsSvg: React.ReactNode = null;
                        if (isCmp) {
                          const bw = Math.min(34, slot * 0.28);
                          const gap = 5;
                          const hC = (ph * curTot) / (top || 1);
                          const hP = (ph * cmpTot) / (top || 1);
                          barsSvg = (
                            <>
                              {cmpTot > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hP} width={bw} height={hP} rx={Math.min(7, hP / 2)} fill="var(--ghost)" />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hP - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#64748b">
                                    {facMetric === 'n' ? cmpTot : cmpTot.toFixed(1)}
                                  </text>
                                </g>
                              )}
                              {curTot > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hC} width={bw} height={hC} rx={Math.min(7, hC / 2)} fill="var(--cur)" />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hC - 7} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">
                                    {facMetric === 'n' ? curTot : curTot.toFixed(1)}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else if (facBarMode === 'group') {
                          const bw = Math.min(34, slot * 0.28);
                          const gap = 5;
                          const hExt = (ph * cExt) / (top || 1);
                          const hInt = (ph * cInt) / (top || 1);
                          barsSvg = (
                            <>
                              {cExt > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx - bw - gap / 2} y={Tp + ph - hExt} width={bw} height={hExt} rx={Math.min(7, hExt / 2)} fill="#0ea5e9" />
                                  <text x={cx - bw / 2 - gap / 2} y={Tp + ph - hExt - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                    {facMetric === 'n' ? cExt : cExt.toFixed(1)}
                                  </text>
                                </g>
                              )}
                              {cInt > 0 && (
                                <g>
                                  <rect className="rr-rise" x={cx + gap / 2} y={Tp + ph - hInt} width={bw} height={hInt} rx={Math.min(7, hInt / 2)} fill="#22c55e" />
                                  <text x={cx + bw / 2 + gap / 2} y={Tp + ph - hInt - 7} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#0f172a">
                                    {facMetric === 'n' ? cInt : cInt.toFixed(1)}
                                  </text>
                                </g>
                              )}
                            </>
                          );
                        } else {
                          const w2 = Math.min(54, slot * 0.44);
                          const gap = 3;
                          const segs = [
                            cExt > 0 ? { k: 'ext', n: 'ทุนภายนอก', c: '#0ea5e9', v: cExt, items: f.extItems } : null,
                            cInt > 0 ? { k: 'int', n: 'ทุนภายใน', c: '#22c55e', v: cInt, items: f.intItems } : null,
                          ].filter(Boolean) as Array<{ k: string; n: string; c: string; v: number; items: ResearchItem[] }>;
                          let cum = 0;
                          barsSvg = (
                            <>
                              {segs.map((seg) => {
                                const y1 = yPos(cum + seg.v);
                                const y0 = yPos(cum);
                                const h = Math.max(y0 - y1 - gap, 4);
                                const segY = y1 + gap / 2;
                                const isHovered = activeFacIdx === i && activeFacSeg === seg.k;
                                cum += seg.v;
                                return (
                                  <g key={seg.k}>
                                    <rect
                                      className="rr-rise"
                                      x={cx - w2 / 2}
                                      y={segY}
                                      width={w2}
                                      height={h}
                                      rx={Math.min(8, h / 2)}
                                      fill={seg.c}
                                      style={{
                                        cursor: 'pointer',
                                        filter: isHovered ? 'drop-shadow(0 4px 10px rgba(15,23,42,0.3)) brightness(0.96)' : 'none',
                                        opacity: activeFacSeg && !isHovered ? 0.6 : 1,
                                        transition: 'all 0.15s ease',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTip((t) => ({ ...t, show: false }));
                                        setDrillDown({
                                          isOpen: true,
                                          title: `โครงการวิจัย (${seg.n}): ${f.head} · ปี ${facYear}`,
                                          subtitle: `รวม ${seg.items.length} โครงการ`,
                                          accentColor: seg.c,
                                          items: seg.items,
                                        });
                                      }}
                                      onPointerMove={(e) => {
                                        e.stopPropagation();
                                        setActiveFacIdx(i);
                                        setActiveFacSeg(seg.k);
                                        setTip({
                                          show: true,
                                          x: e.clientX,
                                          y: e.clientY - 12,
                                          content: (
                                            <div>
                                              <div className="rr-tt-h">
                                                <i style={{ backgroundColor: seg.c }} />
                                                <span>{seg.n} · {f.head}</span>
                                              </div>
                                              <div className="rr-tt-v">
                                                <b>{facMetric === 'n' ? seg.v : seg.v.toFixed(2)}</b>
                                                <span>{facMetric === 'n' ? 'โครงการ' : 'ล้านบาท'}</span>
                                              </div>
                                              <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการวิจัย</div>
                                            </div>
                                          ),
                                        });
                                      }}
                                    />
                                    {h >= 15 && (
                                      <text x={cx} y={segY + h / 2 + 5} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#ffffff" pointerEvents="none">
                                        {facMetric === 'n' ? seg.v : seg.v.toFixed(1)}
                                      </text>
                                    )}
                                  </g>
                                );
                              })}
                              {curTot > 0 && (
                                <text x={cx} y={yPos(curTot) - 8} textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#0f172a" pointerEvents="none">
                                  {facMetric === 'n' ? curTot : curTot.toFixed(2)}
                                </text>
                              )}
                            </>
                          );
                        }

                        return (
                          <g
                            key={f.key}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setTip((t) => ({ ...t, show: false }));
                              setDrillDown({
                                isOpen: true,
                                title: `โครงการวิจัย: ${f.head} (${f.deptCode}) · ปี ${facYear}`,
                                subtitle: `รวม ${f.count} โครงการ • งบประมาณรวม ${f.totalBudget.toLocaleString('th-TH')} บาท • ทุนภายนอก ${f.extBudget.toLocaleString('th-TH')} บาท`,
                                accentColor: deptCol,
                                items: f.items,
                              });
                            }}
                            onPointerMove={(e) => {
                              setActiveFacIdx(i);
                              setTip({
                                show: true,
                                x: e.clientX,
                                y: e.clientY - 12,
                                content: (
                                  <div>
                                    <div className="rr-tt-h">
                                      <i style={{ backgroundColor: deptCol }} />
                                      <span>#{i + 1} {f.head}</span>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>สังกัด</span>
                                      <b>{f.deptCode}</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>งบประมาณวิจัยรวม</span>
                                      <b>{f.totalBudgetM.toFixed(2)} ล้านบาท</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>ทุนภายนอก / ทุนภายใน</span>
                                      <b>{f.extBudgetM.toFixed(2)} / {f.intBudgetM.toFixed(2)} ลบ.</b>
                                    </div>
                                    <div className="rr-tt-r">
                                      <span>จำนวนโครงการ</span>
                                      <b>{f.count} โครงการ</b>
                                    </div>
                                    <div className="rr-tt-s">คลิกเพื่อดูรายการโครงการวิจัย</div>
                                  </div>
                                ),
                              });
                            }}
                          >
                            <rect x={x0 + 4} y={Tp - 6} width={slot - 8} height={ph + 6} rx="12" fill="rgba(15, 23, 42, 0.05)" opacity={activeFacIdx === i ? 1 : 0} />
                            <rect x={x0} y={Tp - 6} width={slot} height={ph + 6} fill="transparent" />
                            {barsSvg}
                            <text x={cx} y={svgH - 26} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a">
                              {shortName}
                            </text>
                            <rect x={cx - 22} y={svgH - 20} width={44} height={18} rx="5" fill={deptCol} />
                            <text x={cx} y={svgH - 7} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#ffffff">
                              {f.deptCode}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {isCmp && (
                      <div style={{ marginTop: '6px', marginLeft: `${L}px`, marginRight: `${R}px`, display: 'grid', gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
                        {top10List.map((f) => {
                          const cVal = facMetric === 'n' ? f.count : f.totalBudgetM;
                          const pLead = cmpPiMap[f.key];
                          const pVal = pLead ? (facMetric === 'n' ? pLead.count : pLead.totalBudgetM) : 0;
                          return (
                            <div key={f.key} style={{ display: 'flex', justifyContent: 'center' }}>
                              {renderChip(cVal, pVal, facMetric === 'b')}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Full Table with Circular Avatar */}
              <section className="rr-card rr-full">
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    ตารางจัดอันดับอาจารย์และหัวหน้าโครงการวิจัย
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                    รายละเอียดโครงการและแฟ้มผลงานอาจารย์รายบุคคล
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="table-manage" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#00A651', color: '#ffffff', borderBottom: '2px solid #00A651' }}>
                        <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center', width: '64px' }}>รูปภาพ</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                        <th style={{ padding: '10px 12px', textAlign: 'left' }}>สังกัด</th>
                        <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณวิจัยรวม</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบจากทุนภายนอก</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyPiRanking.map((f, idx) => {
                        const avatarSrc = resolvePersonAvatar(f.head_id, f.head);
                        return (
                          <tr
                            key={idx}
                            onClick={() => {
                              const targetId = f.head_id || matchPerson(f.head)?.id || matchPerson(f.head)?._id;
                              if (targetId) router.push(`/personnel/${targetId}`);
                              else router.push(`/personnel?q=${encodeURIComponent(f.head)}`);
                            }}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0fdf4';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <td style={{ padding: '10px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
                              {idx + 1}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  overflow: 'hidden',
                                  margin: '0 auto',
                                  backgroundColor: '#99b8db',
                                  border: '1.5px solid #e2e8f0',
                                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
                                }}
                              >
                                <img
                                  src={avatarSrc}
                                  alt={f.head}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                                  onError={(e) => {
                                    const img = e.currentTarget;
                                    if (!img.src.endsWith('/default-avatar.png')) {
                                      img.src = '/default-avatar.png';
                                    }
                                  }}
                                />
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                              {f.head}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <DepartmentBadge value={f.dept} />
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                              <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#00A651' }}>
                                {f.count}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                              {(f.totalBudget / 1000000).toFixed(2)} ลบ.
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                              {(f.extBudget / 1000000).toFixed(2)} ลบ.
                            </td>
                            <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const targetId = f.head_id || matchPerson(f.head)?.id || matchPerson(f.head)?._id;
                                  if (targetId) router.push(`/personnel/${targetId}`);
                                  else router.push(`/personnel?q=${encodeURIComponent(f.head)}`);
                                }}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#00A651',
                                  fontSize: '11.5px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <span>ดูผลงาน</span>
                                <FaChevronRight style={{ fontSize: '9px' }} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {tip.show && (
              <div
                className="rr-tip show"
                style={{
                  left: `${tip.x + 16}px`,
                  top: `${tip.y - 40}px`,
                }}
              >
                {tip.content}
              </div>
            )}
          </div>
        );
      })()}

      {/* DIMENSION 4: UN SDGs */}
      {activePerspective === 'sdg' && (
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="research"
          missionTitle="โครงการวิจัย"
          unitLabel="โครงการ"
          showBudget={true}
        />
      )}

      {/* Drill-down Drawer */}
      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey="research"
      />
    </div>
  );
}
