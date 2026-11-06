'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaCoins,
  FaBuilding,
  FaUserTie,
  FaLeaf,
  FaChevronRight,
  FaHandshake,
  FaLayerGroup,
} from 'react-icons/fa';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { AcademicItem } from '../_hooks/useAcademicData';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';

interface AcademicChartsProps {
  validData: AcademicItem[];
  totalAllocFaculty: number;
  totalAllocDept: number;
  totalAllocKu: number;
  totalAllocRemaining: number;
  hideMissingClient?: boolean;
  onSelectClient?: (clientName: string) => void;
  activePerspective?: AcademicPerspective;
  onChangePerspective?: (persp: AcademicPerspective) => void;
  hideSelector?: boolean;
}

export type AcademicPerspective = 'timeline_alloc' | 'client_segment' | 'faculty' | 'sdg' | 'table';

export function AcademicCharts({
  validData,
  totalAllocFaculty,
  totalAllocDept,
  totalAllocKu,
  totalAllocRemaining,
  hideMissingClient = false,
  onSelectClient,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: AcademicChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<AcademicPerspective>('timeline_alloc');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [clientValueMetric, setClientValueMetric] = useState<'total' | 'average'>('total');
  const chartInstances = useRef<Chart[]>([]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: AcademicItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#1565c0',
    items: [],
  });

  // Month-only records cannot establish chronological order across years.
  const hasMultipleYears = useMemo(() => {
    const years = new Set<string>();
    validData.forEach((item) => {
      [item.start_date, item.end_date, item.fiscal_year, item.year, item.month_year].forEach((value) => {
        const match = String(value || '').match(/(\d{4})/);
        if (match) years.add(match[1]);
      });
    });
    return years.size > 1;
  }, [validData]);

  // Calculate top academic project leads
  const facultyLeadsRanking = useMemo(() => {
    const map: Record<string, { head: string; head_id?: number | string; count: number; totalBudget: number; clients: Set<string>; items: AcademicItem[] }> = {};
    validData.forEach((item) => {
      const headName = String(item.head || '').replace('\n', ' ').trim();
      if (!headName || headName === '-' || headName === 'nan') return;

      const key = item.head_id ? `id_${item.head_id}` : headName;
      if (!map[key]) {
        map[key] = {
          head: headName,
          head_id: item.head_id,
          count: 0,
          totalBudget: 0,
          clients: new Set(),
          items: [],
        };
      }
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      map[key].count++;
      map[key].totalBudget += b;
      if (item.client) map[key].clients.add(item.client);
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Calculate contract size tiers
  const contractSizeData = useMemo(() => {
    const tiers = [
      { key: 't1', label: '< 1 ล้านบาท', min: 0, max: 1000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't2', label: '1 - 5 ล้านบาท', min: 1000000, max: 5000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't3', label: '5 - 10 ล้านบาท', min: 5000000, max: 10000000, count: 0, total: 0, items: [] as AcademicItem[] },
      { key: 't4', label: '≥ 10 ล้านบาท', min: 10000000, max: Infinity, count: 0, total: 0, items: [] as AcademicItem[] },
    ];

    validData.forEach((item) => {
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
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

  // Calculate client segments
  const clientSegments = useMemo(() => {
    const segments: Record<string, { key: string; label: string; count: number; budget: number; items: AcademicItem[] }> = {
      gov: { key: 'gov', label: 'หน่วยงานภาครัฐ / กรม / กระทรวง', count: 0, budget: 0, items: [] },
      state_enterprise: { key: 'state_enterprise', label: 'รัฐวิสาหกิจ', count: 0, budget: 0, items: [] },
      private: { key: 'private', label: 'ภาคเอกชน / บริษัทมหาชน', count: 0, budget: 0, items: [] },
      independent: { key: 'independent', label: 'องค์กรอิสระ / อื่นๆ', count: 0, budget: 0, items: [] },
      unspecified: { key: 'unspecified', label: 'รอระบุข้อมูลผู้ว่าจ้าง', count: 0, budget: 0, items: [] },
    };

    validData.forEach((item) => {
      const raw = String(item.client || '').trim();
      const c = raw.toLowerCase();
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;

      if (!raw || raw === '-' || raw === 'nan' || raw === 'ไม่ระบุ') {
        segments.unspecified.count++;
        segments.unspecified.budget += b;
        segments.unspecified.items.push(item);
      } else if (c.includes('กรม') || c.includes('กระทรวง') || c.includes('สำนักงาน') || c.includes('เทศบาล') || c.includes('อบต') || c.includes('อบจ') || c.includes('ภาครัฐ')) {
        segments.gov.count++;
        segments.gov.budget += b;
        segments.gov.items.push(item);
      } else if (c.includes('การไฟฟ้า') || c.includes('การประปา') || c.includes('การทาง') || c.includes('ปตท') || c.includes('รัฐวิสาหกิจ')) {
        segments.state_enterprise.count++;
        segments.state_enterprise.budget += b;
        segments.state_enterprise.items.push(item);
      } else if (c.includes('บริษัท') || c.includes('จำกัด') || c.includes('บมจ') || c.includes('corp') || c.includes('ltd') || c.includes('ผู้ประกอบการ')) {
        segments.private.count++;
        segments.private.budget += b;
        segments.private.items.push(item);
      } else if (c.includes('มูลนิธิ') || c.includes('สมาคม')) {
        segments.independent.count++;
        segments.independent.budget += b;
        segments.independent.items.push(item);
      } else {
        segments.unspecified.count++;
        segments.unspecified.budget += b;
        segments.unspecified.items.push(item);
      }
    });

    return Object.values(segments);
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

  const deptMetrics = useMemo(() => {
    const map: Record<string, { code: string; name: string; budget: number; count: number; items: AcademicItem[] }> = {};
    validData.forEach((item) => {
      const dInfo = getDepartment(item.department);
      const code = dInfo.code !== '-' ? dInfo.code : 'OTH';
      if (!map[code]) {
        map[code] = { code, name: dInfo.name, budget: 0, count: 0, items: [] };
      }
      const b = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      map[code].budget += b;
      map[code].count++;
      map[code].items.push(item);
    });
    return Object.values(map).sort((a, b) => b.budget - a.budget);
  }, [validData]);

  const deptPastelColorMap = useMemo(() => {
    const map = new Map<string, { fill: string; border: string }>();
    deptMetrics.forEach((d, i) => {
      map.set(d.code, DEPT_PASTEL_PALETTE[i % DEPT_PASTEL_PALETTE.length]);
    });
    return map;
  }, [deptMetrics, DEPT_PASTEL_PALETTE]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_ACA = '#0EA5E9';
    const ALLOC_COLORS = ['#0EA5E9', '#10B981', '#059669', '#8B5CF6'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyCount = Array(M.length).fill(0);
    const monthlyBudget = Array(M.length).fill(0);
    const monthlyItems: AcademicItem[][] = Array.from({ length: M.length }, () => []);
    const clientGroups: Record<string, { name: string; budget: number; count: number; items: AcademicItem[] }> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;
      const mStr = item.normalizedMonth || String(item.month || '').trim();
      const monthMap: Record<string, number> = {
        'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
        'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11,
      };

      if (monthMap[mStr] !== undefined) {
        const mIdx = monthMap[mStr];
        monthlyCount[mIdx] += 1;
        monthlyBudget[mIdx] += budget;
        monthlyItems[mIdx].push(item);
      }

      let client = String(item.client || '').trim();
      if (!client || client === 'nan' || client === '-') client = 'ไม่ระบุหน่วยงาน';
      if (!clientGroups[client]) {
        clientGroups[client] = { name: client, budget: 0, count: 0, items: [] };
      }
      clientGroups[client].budget += budget;
      clientGroups[client].count += 1;
      clientGroups[client].items.push(item);
    });

    const sortedClients = Object.values(clientGroups)
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 7);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'timeline_alloc') {
      const monthlyBudgetM = monthlyBudget.map((b) => Number((b / 1000000).toFixed(2)));

      const openMonth = (index: number) => {
        const m = M[index];
        const items = monthlyItems[index] || [];
        if (items.length === 0) return;
        const budgetSum = items.reduce((s, it) => s + (Number(it.budget) || 0), 0);
        const average = items.length > 0 ? budgetSum / items.length : null;
        setDrillDown({
          isOpen: true,
          title: `โครงการพัฒนาวิชาการ: เดือน ${m}`,
          subtitle: `รวม ${items.length} โครงการ • งบประมาณรวม ${budgetSum.toLocaleString('th-TH')} บาท • เฉลี่ย ${average === null ? '—' : `${average.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`}`,
          accentColor: '#0ea5e9',
          items,
        });
      };

      // Combined view: project count as bars, contract budget as a line on the secondary axis.
      createChart('c_ac_monthly_combo', {
        type: 'bar',
        data: {
          labels: M,
          datasets: [
            {
              type: 'bar' as const,
              label: 'จำนวนโครงการ',
              data: monthlyCount,
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1.5,
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line' as const,
              label: 'งบประมาณ (ล้านบาท)',
              data: monthlyBudgetM,
              borderColor: '#F43F5E',
              backgroundColor: 'rgba(251, 113, 133, 0.12)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointHoverRadius: 6.5,
              pointBackgroundColor: '#F43F5E',
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
            if (hit) openMonth(hit.index);
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 11.5 },
                padding: 10,
                sort: (a: any, b: any) => {
                  const aIsLine = a.text.includes('งบประมาณ');
                  const bIsLine = b.text.includes('งบประมาณ');
                  return aIsLine === bIsLine ? 0 : aIsLine ? 1 : -1;
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const items = monthlyItems[context.dataIndex] || [];
                  if (context.dataset.yAxisID === 'y1') {
                    return `งบประมาณรวม: ${monthlyBudget[context.dataIndex].toLocaleString('th-TH')} บาท`;
                  }
                  return `จำนวนโครงการ: ${items.length} โครงการ`;
                },
                afterBody: (items: any[]) => {
                  const index = items[0]?.dataIndex ?? -1;
                  const count = monthlyItems[index]?.length || 0;
                  if (count === 0) return [];
                  return [
                    `เฉลี่ย: ${(monthlyBudget[index] / count).toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/โครงการ`,
                  ];
                },
              },
            },
            datalabels: {
              display: (ctx: any) => Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 7 : 1),
              color: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#9F1239' : CHART_PASTEL_PALETTE.datalabels.dark,
              backgroundColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#FFFFFF' : 'transparent',
              borderColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#FECDD3' : 'transparent',
              borderWidth: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 1 : 0),
              borderRadius: 4,
              padding: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? { top: 2, bottom: 2, left: 5, right: 5 } : 0),
              clamp: true,
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? `${v.toFixed(2)}` : `${v}`,
            },
          },
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนโครงการ' },
              ticks: { stepSize: 2 },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '20%',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'ล้านบาท' },
            },
            x: { grid: { display: false } },
          },
        },
      });

      // 2. Contract Size Tiers Chart
      const TIER_COLORS = CHART_PASTEL_PALETTE.series.slice(0, 4);
      const TIER_BORDERS = CHART_PASTEL_PALETTE.seriesBorders.slice(0, 4);
      createChart('c_ac_contract_tiers', {
        type: 'bar',
        data: {
          labels: contractSizeData.map((t) => t.label),
          datasets: [
            {
              label: 'จำนวนโครงการ (โครงการ)',
              data: contractSizeData.map((t) => t.count),
              backgroundColor: TIER_COLORS,
              borderColor: TIER_BORDERS,
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const tier = contractSizeData[hit.index];
              if (tier) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((tier.total / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `สัญญาพัฒนาวิชาการ: ขนาดมูลค่า ${tier.label}`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${tier.count} โครงการ • งบประมาณรวม ${tier.total.toLocaleString('th-TH')} บาท`,
                  accentColor: TIER_COLORS[hit.index % TIER_COLORS.length],
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
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const tier = contractSizeData[ctx.dataIndex];
                if (v <= 0) return '';
                return `${v} โครงการ (${(tier.total / 1000000).toFixed(2)} ลบ.)`;
              },
            },
          },
          scales: {
            y: { beginAtZero: true, grace: '25%', grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'จำนวนโครงการ' } },
            x: { grid: { display: false } },
          },
        },
      });

      // 3. Academic Projects by Department
      createChart('c_ac_dept', {
        type: 'bar',
        data: {
          labels: deptMetrics.map((d) => d.code),
          datasets: [
            {
              label: 'งบประมาณพัฒนาวิชาการ (ล้านบาท)',
              data: deptMetrics.map((d) => Number((d.budget / 1000000).toFixed(2))),
              backgroundColor: deptMetrics.map(
                (d) => (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).fill
              ),
              borderColor: deptMetrics.map(
                (d) => (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border
              ),
              borderWidth: 1.5,
              borderRadius: 6,
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
              const d = deptMetrics[hit.index];
              if (d) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((d.budget / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: สังกัด ${d.name} (${d.code})`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${d.count} โครงการ • งบประมาณรวม ${d.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: (deptPastelColorMap.get(d.code) || DEPT_PASTEL_PALETTE[0]).border,
                  items: d.items,
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
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const d = deptMetrics[ctx.dataIndex];
                return `${v} ลบ. (${d?.count || 0} เรื่อง)`;
              },
            },
          },
          scales: {
            x: { beginAtZero: true, grace: '25%', grid: { color: CHART_PASTEL_PALETTE.gridLines }, title: { display: true, text: 'ล้านบาท' } },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'client_segment') {
      const displaySegments = hideMissingClient
        ? clientSegments.filter((s) => s.key !== 'unspecified')
        : clientSegments;

      // 1. Client Segments Horizontal Bar Chart
      createChart('c_ac_segment_bar', {
        type: 'bar',
        data: {
          labels: displaySegments.map((s) => s.label),
          datasets: [
            {
              label: 'งบประมาณรวม (ล้านบาท)',
              data: displaySegments.map((s) => Number((s.budget / 1000000).toFixed(2))),
              backgroundColor: CHART_PASTEL_PALETTE.series.slice(0, displaySegments.length),
              borderColor: CHART_PASTEL_PALETTE.seriesBorders.slice(0, displaySegments.length),
              borderWidth: 1.5,
              borderRadius: 6,
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
              const seg = displaySegments[hit.index];
              if (seg) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((seg.budget / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: กลุ่ม${seg.label}`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${seg.count} โครงการ • งบประมาณ ${seg.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: CHART_PASTEL_PALETTE.seriesBorders[hit.index % CHART_PASTEL_PALETTE.seriesBorders.length],
                  items: seg.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const seg = displaySegments[context.dataIndex];
                  if (!seg) return '';
                  return [
                    `งบประมาณรวม: ${seg.budget.toLocaleString('th-TH')} บาท (${(seg.budget / 1000000).toFixed(2)} ล้านบาท)`,
                    `จำนวนโครงการ: ${seg.count} โครงการ`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const seg = displaySegments[ctx.dataIndex];
                if (v <= 0) return '';
                return `${v} ลบ. (${seg?.count || 0} โครงการ)`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'ล้านบาท' },
            },
            y: { grid: { display: false } },
          },
        },
      });

      // 2. Top Clients Bar Chart (Moved from timeline_alloc to client_segment)
      const isClientAverageMode = clientValueMetric === 'average';
      const clientList = Object.values(clientGroups)
        .filter((c) => !hideMissingClient || (c.name !== 'ไม่ระบุหน่วยงาน' && c.name !== '-'))
        .sort((a, b) => {
          const aValue = isClientAverageMode ? (a.count > 0 ? a.budget / a.count : 0) : a.budget;
          const bValue = isClientAverageMode ? (b.count > 0 ? b.budget / b.count : 0) : b.budget;
          return bValue - aValue;
        })
        .slice(0, 7);

      createChart('c_ac_client', {
        type: 'bar',
        data: {
          labels: clientList.map((c) => {
            const clean = c.name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 22 ? clean.substring(0, 20) + '...' : clean;
          }),
          datasets: [
            {
              label: isClientAverageMode ? 'มูลค่าเฉลี่ยต่อสัญญา (ล้านบาท)' : 'งบประมาณสัญญารวม (ล้านบาท)',
              data: clientList.map((c) =>
                Number(((isClientAverageMode && c.count > 0 ? c.budget / c.count : c.budget) / 1000000).toFixed(2))
              ),
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1.5,
              borderRadius: 6,
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
              const cl = clientList[hit.index];
              if (cl) {
                if (onSelectClient) onSelectClient(cl.name);
                const average = cl.count > 0 ? cl.budget / cl.count : null;
                setDrillDown({
                  isOpen: true,
                  title: `โครงการพัฒนาวิชาการ: ${cl.name.replace(/\r?\n/g, ' ')}`,
                  subtitle: `รวม ${cl.count} โครงการ • งบประมาณรวม ${cl.budget.toLocaleString('th-TH')} บาท • เฉลี่ย ${average === null ? '—' : `${average.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/สัญญา`}`,
                  accentColor: '#3B82F6',
                  items: cl.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const cl = clientList[context.dataIndex];
                  if (!cl) return '';
                  const average = cl.count > 0 ? cl.budget / cl.count : null;
                  return [
                    `จำนวนโครงการ: ${cl.count} โครงการ`,
                    `งบประมาณรวม: ${cl.budget.toLocaleString('th-TH')} บาท`,
                    `เฉลี่ย: ${average === null ? '—' : `${average.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/สัญญา`}`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const cl = clientList[ctx.dataIndex];
                if (v <= 0) return '';
                return isClientAverageMode
                  ? `${v} ลบ./สัญญา (${cl?.count || 0} สัญญา)`
                  : `${v} ลบ. (${cl?.count || 0} สัญญา)`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: isClientAverageMode ? 'ล้านบาท / สัญญา' : 'ล้านบาท' },
            },
            y: { grid: { display: false } },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      const top10Faculty = facultyLeadsRanking.slice(0, 10);

      createChart('c_ac_faculty_top10', {
        type: 'bar',
        data: {
          labels: top10Faculty.map((f) => {
            const name = f.head.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return name.length > 22 ? name.substring(0, 20) + '...' : name;
          }),
          datasets: [
            {
              label: 'มูลค่าสัญญารวม (ล้านบาท)',
              data: top10Faculty.map((f) => Number((f.totalBudget / 1000000).toFixed(2))),
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1.5,
              borderRadius: 6,
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
              const f = top10Faculty[hit.index];
              if (f) {
                const totalAcB = validData.reduce((s, it) => s + (Number(it.budget) || 0), 0);
                const pct = totalAcB > 0 ? ((f.totalBudget / totalAcB) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `อาจารย์หัวหน้าโครงการ: ${f.head}`,
                  subtitle: `สัดส่วน ${pct}% ของมูลค่าทั้งหมด • รวม ${f.count} โครงการ • สัญญารวม ${f.totalBudget.toLocaleString('th-TH')} บาท • ผู้ว่าจ้าง ${f.clients.size} หน่วยงาน`,
                  accentColor: '#3B82F6',
                  items: f.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const f = top10Faculty[idx];
                  return f ? `หัวหน้าโครงการ: ${f.head}` : '';
                },
                label: (context: any) => {
                  const f = top10Faculty[context.dataIndex];
                  if (!f) return '';
                  return [
                    `มูลค่าสัญญารวม: ${f.totalBudget.toLocaleString('th-TH')} บาท (${(f.totalBudget / 1000000).toFixed(2)} ล้านบาท)`,
                    `จำนวนโครงการ: ${f.count} โครงการ`,
                    `ผู้ว่าจ้าง: ${f.clients.size} หน่วยงาน`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 10.5 },
              formatter: (v: number, ctx: any) => {
                const f = top10Faculty[ctx.dataIndex];
                if (v <= 0) return '';
                return `${v} ลบ. (${f?.count || 0} โครงการ)`;
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '25%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'มูลค่าสัญญารวม (ล้านบาท)' },
            },
            y: { grid: { display: false } },
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
    clientValueMetric,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    clientSegments,
    hideMissingClient,
    deptMetrics,
    deptPastelColorMap,
    facultyLeadsRanking,
    onSelectClient,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Timeline & Allocation */}
      {activePerspective === 'timeline_alloc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-grid">
            <div className="chart-card chart-full">
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaChartLine style={{ color: '#0284c7' }} /> จำนวนโครงการและงบประมาณสัญญารายเดือน
              </h3>
              <p style={{ margin: '-2px 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                แท่ง = จำนวนโครงการ (สีฟ้าพาสเทล) • เส้น = งบประมาณ (ล้านบาท) • คลิกที่แท่งกราฟเพื่อดูรายการ
                {hasMultipleYears
                  ? ' — โปรไฟล์รายเดือน (ม.ค.–ธ.ค.) รวมปีที่กรอง ไม่ได้เรียงตามลำดับเวลาต่อเนื่อง'
                  : ''}
              </p>
              <div className="chart-wrapper" style={{ height: '320px', cursor: 'pointer' }}>
                <canvas id="c_ac_monthly_combo" />
              </div>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaLayerGroup style={{ color: '#059669' }} /> การกระจายตัวตามขนาดมูลค่าสัญญา
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                จำแนกตามช่วงขนาดมูลค่าสัญญา 4 ระดับ • คลิกที่แท่งกราฟเพื่อดูรายการ
              </p>
              <div className="chart-wrapper" style={{ height: '280px', cursor: 'pointer' }}>
                <canvas id="c_ac_contract_tiers" />
              </div>
            </div>
            <div className="chart-card">
              <h3 style={{ margin: '0 0 4px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBuilding style={{ color: '#00A651' }} /> งบประมาณโครงการพัฒนาวิชาการตามสังกัด
              </h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>
                เรียงตามมูลค่างบประมาณสัญญารวมจากมากไปน้อย • คลิกที่แท่งกราฟเพื่อดูรายการ
              </p>
              <div className="chart-wrapper" style={{ height: '280px', cursor: 'pointer' }}>
                <canvas id="c_ac_dept" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Client & Industry Segmentation */}
      {activePerspective === 'client_segment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-grid">
            <div className="chart-card">
              <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBuilding style={{ color: '#0284c7' }} /> มูลค่าโครงการจำแนกตามกลุ่มประเภทหน่วยงานผู้ว่าจ้าง
              </h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                เปรียบเทียบสัดส่วนระหว่างหน่วยงานภาครัฐ รัฐวิสาหกิจ และภาคเอกชน • คลิกที่แท่งเพื่อดูรายการ
              </p>
              <div className="chart-wrapper" style={{ height: '320px', cursor: 'pointer' }}>
                <canvas id="c_ac_segment_bar" />
              </div>
            </div>

            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaHandshake style={{ color: '#0284c7' }} /> อันดับหน่วยงานผู้ว่าจ้างสูงสุด (Top 7)
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
                    onClick={() => setClientValueMetric('total')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: clientValueMetric === 'total' ? '#ffffff' : 'transparent',
                      color: clientValueMetric === 'total' ? '#0284c7' : '#64748b',
                      fontWeight: clientValueMetric === 'total' ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: clientValueMetric === 'total' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    มูลค่ารวม
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientValueMetric('average')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: clientValueMetric === 'average' ? '#ffffff' : 'transparent',
                      color: clientValueMetric === 'average' ? '#0284c7' : '#64748b',
                      fontWeight: clientValueMetric === 'average' ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: clientValueMetric === 'average' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    เฉลี่ย/สัญญา
                  </button>
                </div>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
                {clientValueMetric === 'average'
                  ? 'เรียงจากมูลค่าเฉลี่ยต่อสัญญา • คลิกที่แท่งกราฟเพื่อดูรายการ'
                  : 'เรียงจากมูลค่าสัญญารวม • คลิกที่แท่งกราฟเพื่อดูรายการ'}
              </p>
              <div className="chart-wrapper" style={{ height: '320px', cursor: 'pointer' }}>
                <canvas id="c_ac_client" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Academic Project Leads */}
      {activePerspective === 'faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top 10 Faculty Leads Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaUserTie style={{ color: '#0284c7' }} /> Top 10 อาจารย์หัวหน้าโครงการพัฒนาวิชาการที่มีมูลค่าสัญญารวมสูงสุด
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                เรียงตามมูลค่างบประมาณสัญญารวมจากมากไปน้อย • คลิกที่แท่งกราฟเพื่อดูรายการโครงการ
              </p>
            </div>
            <div style={{ height: '340px', cursor: 'pointer' }}>
              <canvas id="c_ac_faculty_top10" />
            </div>
          </div>

          {/* Ranking Table */}
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
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                ตารางจัดอันดับอาจารย์หัวหน้าโครงการพัฒนาวิชาการ
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                อาจารย์ผู้บริหารจัดการสัญญาโครงการพัฒนาวิชาการทั้งหมด • คลิกแถวหรือปุ่มเพื่อดูแฟ้มผลงาน
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table table-sky" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderBottom: '2px solid #bae6fd' }}>
                    <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณสัญญารวม</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>หน่วยงานผู้ว่าจ้าง</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyLeadsRanking.map((f, idx) => (
                    <tr
                      key={`faculty-lead-${f.head_id || f.head || idx}-${idx}`}
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
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                          {f.count}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                        {(f.totalBudget / 1000000).toFixed(2)} ลบ.
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>
                        {f.clients.size} หน่วยงาน
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
                            color: '#0284c7',
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
        </div>
      )}

      {/* DIMENSION 4: UN SDGs */}
      {activePerspective === 'sdg' && (
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="academic"
          missionTitle="โครงการพัฒนาวิชาการ"
          unitLabel="โครงการ"
          showBudget={true}
        />
      )}

      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey="academic"
      />
    </div>
  );
}
