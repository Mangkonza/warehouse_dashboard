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
import { ResearchItem, normalizeFundSource } from '../_hooks/useResearchData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';

interface ResearchChartsProps {
  validData: ResearchItem[];
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
  const chartInstances = useRef<Chart[]>([]);
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
      const headName = String(item.head || '').trim();
      if (!headName || headName === '-' || headName === 'nan') return;

      const key = item.head_id ? `id_${item.head_id}` : headName;
      if (!map[key]) {
        map[key] = {
          head: headName,
          head_id: item.head_id,
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
    Chart.defaults.font.size = 12;
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
                boxWidth: 14,
                boxHeight: 14,
                borderRadius: 3,
                useBorderRadius: true,
                font: { size: 12, weight: 600 },
                padding: 12,
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
              offset: isStacked ? 0 : 2,
              color: isStacked ? '#0f172a' : CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number) => {
                if (v <= 0) return '';
                return isCount ? `${v}` : `${v.toFixed(1)}`;
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
                font: { weight: 600, size: 11.5 },
              },
              ticks: {
                stepSize: isCount ? 1 : undefined,
                precision: isCount ? 0 : 1,
              },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
            },
            x: {
              stacked: isStacked,
              grid: { display: false },
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
      const deptColors = deptLabels.map((code) => getDepartmentColor(code));

      createChart('c_re_dept', {
        type: 'bar',
        data: {
          labels: deptLabels,
          datasets: [
            {
              label: isAverageMode ? 'งบประมาณเฉลี่ยต่อโครงการ (ล้านบาท)' : 'งบประมาณวิจัยรวม (ล้านบาท)',
              data: deptBudgetM,
              backgroundColor: deptColors,
              borderRadius: 8,
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
                  accentColor: getDepartmentColor(d.code),
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
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) =>
                isAverageMode ? `${v.toFixed(2)} ลบ./โครงการ` : `${v.toFixed(2)} ลบ.`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '28%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: isAverageMode ? 'ล้านบาท / โครงการ' : 'ล้านบาท' },
            },
            y: { grid: { display: false } },
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
              font: { weight: 'bold', size: 11 },
              formatter: (value: number, context: any) => {
                const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const pct = (value * 100) / (sum || 1);
                return pct >= 6 ? `${pct.toFixed(0)}%` : '';
              },
            },
            legend: { position: 'right', labels: { padding: 10, boxWidth: 12, font: { size: 11.5 } } },
          },
        },
      });

      // 3. Project Budget Scale Tiers Chart
      createChart('c_re_scale', {
        type: 'bar',
        data: {
          labels: budgetScaleData.map((t) => t.label),
          datasets: [
            {
              label: 'จำนวนโครงการ (โครงการ)',
              data: budgetScaleData.map((t) => t.count),
              backgroundColor: CHART_PASTEL_PALETTE.series.slice(0, 5),
              borderColor: CHART_PASTEL_PALETTE.seriesBorders.slice(0, 5),
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
                  accentColor: '#0284c7',
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
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => (v > 0 ? `${v} โครงการ` : ''),
            },
          },
          scales: {
            y: { beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'จำนวนโครงการ' } },
            x: { grid: { display: false } },
          },
        },
      });

      // 4. External และ Internal Ratio
      const totalExt = validData.reduce((s, i) => s + (Number(i.budget_external) || 0), 0);
      const totalInt = validData.reduce((s, i) => s + (Number(i.budget_internal) || 0), 0);

      createChart('c_re_ext_int', {
        type: 'pie',
        data: {
          labels: ['งบทุนภายนอก', 'งบทุนภายใน'],
          datasets: [
            {
              data: [totalExt, totalInt],
              backgroundColor: [
                CHART_PASTEL_PALETTE.missions.academic.fill,
                CHART_PASTEL_PALETTE.missions.research.fill,
              ],
              borderColor: [
                CHART_PASTEL_PALETTE.missions.academic.border,
                CHART_PASTEL_PALETTE.missions.research.border,
              ],
              borderWidth: 1.5,
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
              const isExt = hit.index === 0;
              const items = validData.filter((i) =>
                isExt ? (Number(i.budget_external) || 0) > 0 : (Number(i.budget_internal) || 0) > 0
              );
              const totalExtInt = totalExt + totalInt || 1;
              const selBudget = isExt ? totalExt : totalInt;
              const pct = ((selBudget / totalExtInt) * 100).toFixed(1);
              setDrillDown({
                isOpen: true,
                title: isExt ? 'โครงการวิจัยที่ได้รับงบทุนภายนอก' : 'โครงการวิจัยที่ได้รับงบทุนภายใน',
                subtitle: `สัดส่วน ${pct}% ของงบประมาณรวม • รวม ${items.length} โครงการ • งบประมาณ ${selBudget.toLocaleString('th-TH')} บาท`,
                accentColor: isExt ? '#0284c7' : '#00A651',
                items,
              });
            }
          },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11.5 } } },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 12 },
              formatter: (v: number, ctx: any) => {
                const sum = totalExt + totalInt || 1;
                return `${((v / sum) * 100).toFixed(0)}%`;
              },
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, activePerspective, researchBudgetMetric, deptComparativeMetrics, budgetScaleData, onSelectDept, onSelectFund, monthlyBarMode, monthlyMetric]);

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
                      padding: '2px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMonthlyBarMode('grouped')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: monthlyBarMode === 'grouped' ? '#ffffff' : 'transparent',
                        color: monthlyBarMode === 'grouped' ? '#00A651' : '#64748b',
                        fontWeight: monthlyBarMode === 'grouped' ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: monthlyBarMode === 'grouped' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      แยกแท่ง (Grouped)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyBarMode('stacked')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: monthlyBarMode === 'stacked' ? '#ffffff' : 'transparent',
                        color: monthlyBarMode === 'stacked' ? '#00A651' : '#64748b',
                        fontWeight: monthlyBarMode === 'stacked' ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: monthlyBarMode === 'stacked' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      แท่งซ้อน (Stacked)
                    </button>
                  </div>

                  {/* Metric toggle: Count vs Budget */}
                  <div
                    style={{
                      display: 'inline-flex',
                      backgroundColor: '#f1f5f9',
                      padding: '2px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMonthlyMetric('count')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: monthlyMetric === 'count' ? '#ffffff' : 'transparent',
                        color: monthlyMetric === 'count' ? '#00A651' : '#64748b',
                        fontWeight: monthlyMetric === 'count' ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: monthlyMetric === 'count' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      จำนวนโครงการ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonthlyMetric('budget')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: monthlyMetric === 'budget' ? '#ffffff' : 'transparent',
                        color: monthlyMetric === 'budget' ? '#00A651' : '#64748b',
                        fontWeight: monthlyMetric === 'budget' ? 700 : 500,
                        cursor: 'pointer',
                        boxShadow: monthlyMetric === 'budget' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                      }}
                    >
                      งบประมาณ
                    </button>
                  </div>
                </div>
              </div>
              <p style={{ margin: '-2px 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                {monthlyMetric === 'count'
                  ? 'กราฟแท่งแนวตั้งเปรียบเทียบจำนวนโครงการทุนภายนอก (สีฟ้า) และ ทุนภายใน (สีเขียว) รายเดือน • คลิกที่แท่งกราฟเพื่อดูรายละเอียดโครงการ'
                  : 'กราฟแท่งแนวตั้งเปรียบเทียบงบประมาณทุนภายนอก (สีฟ้า) และ ทุนภายใน (สีเขียว) รายเดือน • หน่วยล้านบาท • คลิกที่แท่งกราฟเพื่อดูรายละเอียดโครงการ'}
                {hasMultipleYears ? ' — ข้อมูลสรุปรวมตามปีที่เลือกกรอง' : ''}
              </p>
              <div className="chart-wrapper" style={{ height: '320px', cursor: 'pointer' }}>
                <canvas id="c_re_monthly_ext_int" />
              </div>
              {undatedResearch.count > 0 && (
                <p style={{ margin: '8px 0 0 0', fontSize: '11.5px', color: '#64748b' }}>
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
                      fontSize: '11.5px',
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
                <h3 style={{ margin: 0 }}>
                  <FaChartBar style={{ color: '#00A651' }} /> งบประมาณวิจัยตามสังกัด
                </h3>
                <div
                  style={{
                    display: 'inline-flex',
                    backgroundColor: '#f1f5f9',
                    padding: '2px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setResearchBudgetMetric('total')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: researchBudgetMetric === 'total' ? '#ffffff' : 'transparent',
                      color: researchBudgetMetric === 'total' ? '#00A651' : '#64748b',
                      fontWeight: researchBudgetMetric === 'total' ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    งบรวม
                  </button>
                  <button
                    type="button"
                    onClick={() => setResearchBudgetMetric('average')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: researchBudgetMetric === 'average' ? '#ffffff' : 'transparent',
                      color: researchBudgetMetric === 'average' ? '#00A651' : '#64748b',
                      fontWeight: researchBudgetMetric === 'average' ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    เฉลี่ย/โครงการ
                  </button>
                </div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                {researchBudgetMetric === 'average'
                  ? 'เรียงจากงบประมาณเฉลี่ยต่อโครงการ • จำนวนโครงการและงบรวมแสดงใน tooltip'
                  : 'เรียงจากงบประมาณรวม • จำนวนโครงการและงบเฉลี่ยแสดงใน tooltip'}
              </p>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_dept" />
              </div>
            </div>

            <div className="chart-card">
              <h3>
                <FaChartPie style={{ color: '#00A651' }} /> สัดส่วนงบประมาณตามแหล่งทุนวิจัย
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_fund" />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            <div className="chart-card">
              <h3>
                <FaLayerGroup style={{ color: '#0284c7' }} /> การกระจายโครงการตามช่วงขนาดงบประมาณ
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_scale" />
              </div>
            </div>

            <div className="chart-card">
              <h3>
                <FaCoins style={{ color: '#d97706' }} /> สัดส่วนงบทุนภายนอก และ ทุนภายใน
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_ext_int" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Department Comparative Output */}
      {activePerspective === 'productivity' && (
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
              ตารางเปรียบเทียบผลผลิตและงบประมาณวิจัยรายสังกัด
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
                        setDrillDown({
                          isOpen: true,
                          title: `โครงการวิจัย: ${d.name} (${d.code})`,
                          subtitle: `รวม ${d.count} โครงการ • งบประมาณ ${d.totalBudget.toLocaleString('th-TH')} บาท`,
                          accentColor: getDepartmentColor(d.code),
                          items: d.items,
                        });
                      }}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getDepartmentColor(d.code) }} />
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
      )}

      {/* DIMENSION 3: Top Research Faculty & PIs */}
      {activePerspective === 'faculty' && (
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
              จัดอันดับอาจารย์และหัวหน้าโครงการวิจัย
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
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>สังกัด</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณวิจัยรวม</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบจากทุนภายนอก</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {facultyPiRanking.map((f, idx) => (
                  <tr
                    key={idx}
                    onClick={() => {
                      if (f.head_id) router.push(`/personnel/${f.head_id}`);
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
                        onClick={() => {
                          if (f.head_id) router.push(`/personnel/${f.head_id}`);
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
