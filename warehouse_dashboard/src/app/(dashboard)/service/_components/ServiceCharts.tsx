'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartLine,
  FaChartBar,
  FaBuilding,
  FaUserTie,
  FaUsers,
  FaLeaf,
  FaChevronRight,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';

interface ServiceChartsProps {
  validData: ServiceItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  onSelectPerson?: (personName: string) => void;
  activePerspective?: ServicePerspective;
  onChangePerspective?: (persp: ServicePerspective) => void;
  hideSelector?: boolean;
}

export type ServicePerspective = 'timeline_type' | 'department' | 'faculty' | 'sdg' | 'table';

export function ServiceCharts({
  validData,
  onSelectDept,
  onSelectType,
  onSelectPerson,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: ServiceChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<ServicePerspective>('timeline_type');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [strategyMetric, setStrategyMetric] = useState<'activities' | 'targets' | 'staff'>('activities');
  const [deptChartMode, setDeptChartMode] = useState<'grouped' | 'combo'>('grouped');
  const chartInstances = useRef<Chart[]>([]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: ServiceItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#f59e0b',
    items: [],
  });

  // Calculate top contributors
  const topServiceFaculty = useMemo(() => {
    const map: Record<string, { name: string; person_id?: number | string; dept: string; count: number; hours: number; targets: Set<string>; items: ServiceItem[] }> = {};
    validData.forEach((item) => {
      const pName = String(item.person || '').trim();
      if (!pName || pName === '-' || pName === 'nan') return;

      const pId = item.person_id;
      const key = pId ? `id_${pId}` : pName;
      if (!map[key]) {
        map[key] = {
          name: pName,
          person_id: pId,
          dept: item.department || '-',
          count: 0,
          hours: 0,
          targets: new Set<string>(),
          items: [],
        };
      }
      map[key].count++;
      map[key].hours += Number(item.hours_spent) || 0;
      if (item.target_group && item.target_group !== '-' && item.target_group !== 'nan') {
        map[key].targets.add(item.target_group);
      }
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.hours - a.hours);
  }, [validData]);

  // Workload tiers
  const workloadTiers = useMemo(() => {
    let t1 = 0; // 1-2
    let t2 = 0; // 3-5
    let t3 = 0; // 6-10
    let t4 = 0; // >10
    topServiceFaculty.forEach((f) => {
      if (f.count <= 2) t1++;
      else if (f.count <= 5) t2++;
      else if (f.count <= 10) t3++;
      else t4++;
    });
    return [
      { tier: '1–2 ครั้ง/ปี (ส่วนใหญ่)', count: t1, pct: topServiceFaculty.length > 0 ? ((t1 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '3–5 ครั้ง/ปี', count: t2, pct: topServiceFaculty.length > 0 ? ((t2 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '6–10 ครั้ง/ปี', count: t3, pct: topServiceFaculty.length > 0 ? ((t3 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
      { tier: '> 10 ครั้ง/ปี ', count: t4, pct: topServiceFaculty.length > 0 ? ((t4 / topServiceFaculty.length) * 100).toFixed(1) : '0' },
    ];
  }, [topServiceFaculty]);

  // Department Metrics
  const deptMetrics = useMemo(() => {
    const map: Record<string, { code: string; name: string; count: number; staffSet: Set<string>; items: ServiceItem[] }> = {};
    validData.forEach((item) => {
      const dept = getDepartment(item.department);
      const code = dept.code !== '-' ? dept.code : 'OTH';
      if (!map[code]) {
        map[code] = { code, name: dept.name, count: 0, staffSet: new Set<string>(), items: [] };
      }
      map[code].count++;
      if (item.person && item.person !== '-' && item.person !== 'nan') {
        map[code].staffSet.add(item.person);
      }
      map[code].items.push(item);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [validData]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_AMBER = '#f59e0b';
    const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthlyCount = Array(12).fill(0);
    const monthlyStaffSets: Set<string>[] = Array.from({ length: 12 }, () => new Set<string>());
    const monthlyItems: ServiceItem[][] = Array.from({ length: 12 }, () => []);

    const roleGroups: Record<string, { label: string; count: number; items: ServiceItem[] }> = {};

    validData.forEach((item) => {
      // Date handling
      if (item.date) {
        const str = String(item.date).trim();
        let mIdx = -1;
        const dObj = new Date(str.replace('1968', '2025').replace('1969', '2026').replace('2568', '2025').replace('2569', '2026'));
        if (!isNaN(dObj.getTime())) {
          mIdx = dObj.getMonth();
        } else {
          THAI_MONTHS.forEach((tm, idx) => {
            if (str.includes(tm) || str.includes(tm.replace('.', ''))) {
              mIdx = idx;
            }
          });
        }
        if (mIdx >= 0 && mIdx < 12) {
          monthlyCount[mIdx]++;
          if (item.person && item.person !== '-' && item.person !== 'nan') {
            monthlyStaffSets[mIdx].add(item.person);
          }
          monthlyItems[mIdx].push(item);
        }
      }

      // Smart role group
      const r = item._smartRole || item.service_type || 'งานบริการวิชาการอื่นๆ';
      if (!roleGroups[r]) roleGroups[r] = { label: r, count: 0, items: [] };
      roleGroups[r].count++;
      roleGroups[r].items.push(item);
    });

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

    if (activePerspective === 'timeline_type') {
      // Combined view: activity volume as bars, unique staff as a line on the secondary axis.
      const monthlyStaffCount = monthlyStaffSets.map((s) => s.size);

      createChart('c_sv_timeline', {
        type: 'bar',
        data: {
          labels: THAI_MONTHS,
          datasets: [
            {
              type: 'bar' as const,
              label: 'จำนวนครั้งที่ให้บริการ',
              data: monthlyCount,
              backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.service.border,
              borderWidth: 1.5,
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line' as const,
              label: 'บุคลากรที่มีส่วนร่วม (ท่าน)',
              data: monthlyStaffCount,
              borderColor: '#E11D48',
              backgroundColor: 'rgba(225, 29, 72, 0.08)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#E11D48',
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
            if (hit) {
              const m = THAI_MONTHS[hit.index];
              const items = monthlyItems[hit.index] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `งานบริการวิชาการ: เดือน ${m}`,
                  subtitle: `รวม ${items.length} กิจกรรม • บุคลากร ${monthlyStaffSets[hit.index].size} ท่าน`,
                  accentColor: CHART_PASTEL_PALETTE.missions.service.border,
                  items,
                });
              }
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
                sort: (a: any, b: any) => {
                  const aIsLine = a.text.includes('บุคลากร');
                  const bIsLine = b.text.includes('บุคลากร');
                  return aIsLine === bIsLine ? 0 : aIsLine ? 1 : -1;
                },
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  if (context.dataset.yAxisID === 'y1') {
                    return `บุคลากร: ${monthlyStaffCount[context.dataIndex]} ท่าน`;
                  }
                  return `จำนวนครั้ง: ${monthlyCount[context.dataIndex]} ครั้ง`;
                },
                afterBody: (items: any[]) => {
                  const index = items[0]?.dataIndex ?? -1;
                  const staff = monthlyStaffCount[index] || 0;
                  if (staff === 0) return [];
                  return [`เฉลี่ย: ${(monthlyCount[index] / staff).toFixed(1)} ครั้ง/ท่าน`];
                },
              },
            },
            datalabels: {
              display: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? false : Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 7 : 2),
              color: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? '#0F766E' : CHART_PASTEL_PALETTE.datalabels.dark,
              backgroundColor: (ctx: any) =>
                ctx.dataset.yAxisID === 'y1' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: 3,
              padding: (ctx: any) => (ctx.dataset.yAxisID === 'y1' ? 3 : 0),
              clamp: true,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v}`,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grace: '20%',
              ticks: { stepSize: 1, font: { size: 13, weight: 600 } },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนครั้งที่ให้บริการ (ครั้ง)', font: { size: 13.5, weight: 700 } },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '20%',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'บุคลากร (ท่าน)', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            x: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });

      // 2. Service Activity Breakdown Horizontal Bar
      // Distinct qualitative palette specifically avoiding amber/yellow (#FDE68A) to prevent visual collision with the top monthly chart
      const SERVICE_ROLE_PALETTE = [
        { fill: '#93C5FD', border: '#3B82F6' }, // 1. Soft Sky Blue
        { fill: '#86EFAC', border: '#22C55E' }, // 2. Soft Emerald Mint
        { fill: '#DDD6FE', border: '#8B5CF6' }, // 3. Soft Lavender Violet
        { fill: '#FDA4AF', border: '#F43F5E' }, // 4. Soft Rose Coral
        { fill: '#99F6E4', border: '#0D9488' }, // 5. Soft Teal
        { fill: '#C7D2FE', border: '#6366F1' }, // 6. Soft Indigo Slate
        { fill: '#F5D0FE', border: '#C026D3' }, // 7. Soft Fuchsia Pink
        { fill: '#BAE6FD', border: '#0284C7' }, // 8. Light Ocean Blue
      ];

      const sortedRoles = Object.values(roleGroups).sort((a, b) => b.count - a.count);

      createChart('c_sv_roles', {
        type: 'bar',
        data: {
          labels: sortedRoles.map((r) => r.label),
          datasets: [
            {
              label: 'จำนวนงาน',
              data: sortedRoles.map((r) => r.count),
              backgroundColor: sortedRoles.map((_, i) => SERVICE_ROLE_PALETTE[i % SERVICE_ROLE_PALETTE.length].fill),
              borderColor: sortedRoles.map((_, i) => SERVICE_ROLE_PALETTE[i % SERVICE_ROLE_PALETTE.length].border),
              borderWidth: 1.5,
              borderRadius: 6,
              maxBarThickness: 32,
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
              const r = sortedRoles[hit.index];
              if (r) {
                if (onSelectType) onSelectType(r.label);
                setDrillDown({
                  isOpen: true,
                  title: `บทบาทงาน: ${r.label}`,
                  subtitle: `รวมทั้งสิ้น ${r.count} งาน`,
                  accentColor: SERVICE_ROLE_PALETTE[hit.index % SERVICE_ROLE_PALETTE.length].border,
                  items: r.items,
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
              formatter: (v: number) => `${v} งาน`,
            },
            tooltip: {
              callbacks: {
                label: (context: any) => `จำนวนงาน: ${context.raw} งาน`,
                afterBody: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const r = sortedRoles[idx];
                  if (!r) return [];
                  const uniqueStaff = new Set(
                    r.items.map((it) => it.person).filter((p) => p && p !== '-' && p !== 'nan')
                  );
                  return [
                    `บุคลากรที่เกี่ยวข้อง: ${uniqueStaff.size} ท่าน`,
                    `คลิกที่แท่งกราฟเพื่อดูรายชื่อโครงการ`,
                  ];
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '14%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนงาน (งาน)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 }, color: '#334155' },
            },
          },
        },
      });
    }

    if (activePerspective === 'department') {
      const openDept = (index: number) => {
        const d = deptMetrics[index];
        if (!d) return;
        const providerCount = d.staffSet.size;
        const average = providerCount > 0 ? d.count / providerCount : null;
        if (onSelectDept) onSelectDept(d.code);
        setDrillDown({
          isOpen: true,
          title: `งานบริการวิชาการ: สังกัด ${d.name} (${d.code})`,
          subtitle: `รวม ${d.count} กิจกรรม • บุคลากรที่พบในบันทึก ${providerCount} ท่าน • เฉลี่ย ${average === null ? '—' : `${average.toFixed(1)} งาน/ท่าน`}`,
          accentColor: getDepartmentColor(d.code),
          items: d.items,
        });
      };

      const isCombo = deptChartMode === 'combo';

      // Unified Combined Chart: Comparing Service Activities & Identified Providers
      createChart('c_sv_dept_combined', {
        type: 'bar',
        data: {
          labels: deptMetrics.map((d) => d.code),
          datasets: [
            {
              type: 'bar' as const,
              label: 'จำนวนงานบริการ (กิจกรรม)',
              data: deptMetrics.map((d) => d.count),
              backgroundColor: '#FDE68A', // Soft Amber (Service Mission Theme)
              borderColor: '#F59E0B',
              borderWidth: 1.5,
              borderRadius: 6,
              yAxisID: 'y',
              order: 2,
            },
            isCombo
              ? {
                  type: 'line' as const,
                  label: 'บุคลากรที่พบในบันทึก (ท่าน)',
                  data: deptMetrics.map((d) => d.staffSet.size),
                  borderColor: '#E11D48', // Rose Red
                  backgroundColor: 'rgba(225, 29, 72, 0.08)',
                  borderWidth: 2.5,
                  tension: 0.35,
                  pointRadius: 4.5,
                  pointHoverRadius: 6.5,
                  pointBackgroundColor: '#E11D48',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 1.5,
                  yAxisID: 'y1',
                  order: 1,
                }
              : {
                  type: 'bar' as const,
                  label: 'บุคลากรที่พบในบันทึก (ท่าน)',
                  data: deptMetrics.map((d) => d.staffSet.size),
                  backgroundColor: '#FDA4AF', // Soft Rose Coral
                  borderColor: '#E11D48',
                  borderWidth: 1.5,
                  borderRadius: 6,
                  yAxisID: 'y',
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
            if (hit) openDept(hit.index);
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
                  const d = deptMetrics[idx];
                  return d ? `สังกัด: ${d.name} (${d.code})` : '';
                },
                label: (context: any) => {
                  const isStaff = context.datasetIndex === 1;
                  const d = deptMetrics[context.dataIndex];
                  if (!d) return '';
                  if (isStaff) {
                    return `บุคลากรที่พบในบันทึก: ${d.staffSet.size} ท่าน`;
                  }
                  return `จำนวนงานบริการ: ${d.count} กิจกรรม`;
                },
                afterBody: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const d = deptMetrics[idx];
                  if (!d) return [];
                  const avg = d.staffSet.size > 0 ? (d.count / d.staffSet.size).toFixed(1) : '—';
                  return [
                    `─────────────────────────────`,
                    `ภาระงานเฉลี่ย: ${avg} งาน/ท่าน`,
                  ];
                },
              },
            },
            datalabels: {
              display: (ctx: any) => Number(ctx.dataset.data[ctx.dataIndex]) > 0,
              anchor: 'end',
              align: 'top',
              offset: (ctx: any) => (isCombo && ctx.dataset.yAxisID === 'y1' ? 6 : 1),
              color: (ctx: any) =>
                isCombo && ctx.dataset.yAxisID === 'y1' ? '#E11D48' : CHART_PASTEL_PALETTE.datalabels.dark,
              backgroundColor: (ctx: any) =>
                isCombo && ctx.dataset.yAxisID === 'y1' ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              borderRadius: 3,
              font: { weight: 'bold', size: 12.5 },
              formatter: (v: number) => `${v}`,
            },
          },
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              grace: '15%',
              ticks: { stepSize: 10, font: { size: 13, weight: 600 } },
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: {
                display: true,
                text: isCombo ? 'จำนวนงานบริการ (กิจกรรม)' : 'จำนวน (กิจกรรม / ท่าน)',
                font: { size: 13.5, weight: 700 },
              },
            },
            y1: isCombo
              ? {
                  type: 'linear',
                  position: 'right',
                  beginAtZero: true,
                  grace: '15%',
                  ticks: { stepSize: 5, font: { size: 13, weight: 600 } },
                  grid: { drawOnChartArea: false },
                  title: { display: true, text: 'บุคลากร (ท่าน)', font: { size: 13.5, weight: 700 } },
                }
              : { display: false },
            x: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });

      // Workload per identified provider (null when no provider is known)
      const avgPerStaffData = deptMetrics.map((d) => {
        if (d.staffSet.size === 0) return null;
        return Number((d.count / d.staffSet.size).toFixed(1));
      });

      createChart('c_sv_dept_avg', {
        type: 'bar',
        data: {
          labels: deptMetrics.map((d) => d.code),
          datasets: [
            {
              label: 'ภาระงานเฉลี่ย (งาน/ท่าน)',
              data: avgPerStaffData,
              backgroundColor: deptMetrics.map((d) => getDepartmentColor(d.code)),
              borderColor: deptMetrics.map((d) => getDepartmentColor(d.code)),
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
            if (hit) openDept(hit.index);
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const d = deptMetrics[context.dataIndex];
                  if (!d) return '';
                  return [
                    `สังกัด: ${d.name} (${d.code})`,
                    `กิจกรรม: ${d.count} งาน`,
                    `บุคลากรที่พบในบันทึก: ${d.staffSet.size} ท่าน`,
                    `เฉลี่ย: ${d.staffSet.size > 0 ? `${(d.count / d.staffSet.size).toFixed(1)} งาน/ท่าน` : '—'}`,
                  ];
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number | null) => (v === null ? '—' : `${v} งาน/ท่าน`),
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'เฉลี่ยงานต่อบุคลากรที่พบในบันทึก (งาน/ท่าน)', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 13, weight: 600 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      const top10Faculty = topServiceFaculty.slice(0, 10);

      createChart('c_sv_faculty_top10', {
        type: 'bar',
        data: {
          labels: top10Faculty.map((f) => {
            const clean = f.name.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 22 ? clean.substring(0, 20) + '...' : clean;
          }),
          datasets: [
            {
              label: 'จำนวนงานบริการ (งาน)',
              data: top10Faculty.map((f) => f.count),
              backgroundColor: top10Faculty.map((f) => getDepartmentColor(f.dept)),
              borderColor: top10Faculty.map((f) => getDepartmentColor(f.dept)),
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
                if (onSelectPerson) onSelectPerson(f.name);
                setDrillDown({
                  isOpen: true,
                  title: `ผู้ให้บริการวิชาการ: ${f.name}`,
                  subtitle: `สังกัด ${f.dept} • รวม ${f.count} งาน • เครือข่ายภายนอก ${f.targets.size} แห่ง${f.hours > 0 ? ` • ชั่วโมงสะสม ${f.hours.toLocaleString('th-TH')} ชม.` : ''}`,
                  accentColor: getDepartmentColor(f.dept),
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
                  return f ? `ผู้ให้บริการ: ${f.name} (${f.dept})` : '';
                },
                label: (context: any) => {
                  const f = top10Faculty[context.dataIndex];
                  if (!f) return '';
                  return [
                    `จำนวนงานบริการ: ${f.count} งาน`,
                    `เครือข่ายภายนอก: ${f.targets.size} แห่ง`,
                    f.hours > 0 ? `ชั่วโมงสะสม: ${f.hours.toLocaleString('th-TH')} ชม.` : '',
                    `คลิกที่แท่งกราฟเพื่อดูโครงการทั้งหมด`,
                  ].filter(Boolean);
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v} งาน`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '18%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนงาน (งาน)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 }, color: '#334155' },
            },
          },
        },
      });
      // Workload distribution donut
      createChart('c_sv_workload_tier', {
        type: 'doughnut',
        data: {
          labels: workloadTiers.map((t) => t.tier),
          datasets: [
            {
              data: workloadTiers.map((t) => t.count),
              backgroundColor: ['#CBD5E1', '#93C5FD', '#86EFAC', '#FDE68A'],
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 16,
                boxHeight: 16,
                borderRadius: 4,
                useBorderRadius: true,
                font: { size: 13.5, weight: 600 },
                padding: 12,
              },
            },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number, ctx: any) => {
                const pct = workloadTiers[ctx.dataIndex].pct;
                return v > 2 ? `${pct}%` : '';
              },
            },
          },
        },
      });
    }

    if (activePerspective === 'sdg') {
      // ISEE / IAM Chart dynamically calculated from validData
      let sCount = 0;
      let e1Count = 0;
      let e2Count = 0;
      let iCount = 0;
      validData.forEach((d) => {
        const text = `${d.name || ''} ${d.topic_title || ''} ${d.target_group || ''}`.toLowerCase();
        if (text.includes('ต่างประเทศ') || text.includes('สากล') || text.includes('inter') || text.includes('cau') || text.includes('japan')) iCount++;
        else if (text.includes('ดิจิทัล') || text.includes('ธุรกิจ') || text.includes('ผู้ประกอบการ') || text.includes('ระบบ')) e2Count++;
        else if (text.includes('ประเมิน') || text.includes('วิทยานิพนธ์') || text.includes('ผู้ทรงคุณวุฒิ') || text.includes('บรรยาย')) e1Count++;
        else sCount++;
      });

      createChart('c_sv_isee_iam', {
        type: 'bar',
        data: {
          labels: ['S (สังคมและความยั่งยืน)', 'E1 (ความเป็นเลิศวิชาการ)', 'E2 (ดิจิทัล/ผู้ประกอบการ)', 'I (นานาชาติ)'],
          datasets: [
            {
              label: 'ยุทธศาสตร์ ISEE',
              data: [sCount, e1Count, e2Count, iCount],
              backgroundColor: ['#FDE68A', '#86EFAC', '#93C5FD', '#FDA4AF'],
              borderColor: ['#F59E0B', '#22C55E', '#3B82F6', '#F43F5E'],
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 11 },
              formatter: (v: number) => `${v} กิจกรรม`,
            },
          },
          scales: {
            x: { beginAtZero: true, grid: { color: CHART_PASTEL_PALETTE.gridLines } },
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
    strategyMetric,
    workloadTiers,
    deptChartMode,
    deptMetrics,
    topServiceFaculty,
    onSelectDept,
    onSelectPerson,
    onSelectType,
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            

      {/* DIMENSION 1: Timeline & Types */}
      {activePerspective === 'timeline_type' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {validData.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              ไม่พบข้อมูลแนวโน้มและประเภทงานบริการในช่วงเวลาที่เลือก
            </div>
          ) : (
            <>
              <div className="chart-grid">
                <div className="chart-card chart-full">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaChartLine style={{ color: '#f59e0b', marginRight: '6px' }} /> จำนวนครั้งและบุคลากรที่ให้บริการรายเดือน
                  </h3>
                  <div className="chart-wrapper" style={{ height: '390px', cursor: 'pointer' }}>
                    <canvas id="c_sv_timeline" />
                  </div>
                </div>
              </div>

              <div className="chart-grid">
                <div className="chart-card chart-full">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaChartBar style={{ color: '#0284c7', marginRight: '6px' }} /> จำนวนงานบริการวิชาการจำแนกตามลักษณะบทบาทหน้าที่
                  </h3>
                  <div className="chart-wrapper" style={{ height: '420px', cursor: 'pointer' }}>
                    <canvas id="c_sv_roles" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* DIMENSION 2: Department */}
      {activePerspective === 'department' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {deptMetrics.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13.5px',
              }}
            >
              ไม่พบข้อมูลบริการวิชาการรายสังกัดในช่วงเวลาที่เลือก
            </div>
          ) : (
            <>
              <div className="chart-grid">
                <div className="chart-card chart-full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaBuilding style={{ color: '#f59e0b' }} /> เปรียบเทียบจำนวนงานบริการและบุคลากรรายสังกัด
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
                        onClick={() => setDeptChartMode('grouped')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: deptChartMode === 'grouped' ? '#ffffff' : 'transparent',
                          color: deptChartMode === 'grouped' ? '#f59e0b' : '#64748b',
                          fontWeight: deptChartMode === 'grouped' ? 700 : 600,
                          cursor: 'pointer',
                          boxShadow: deptChartMode === 'grouped' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                          fontSize: '13px',
                        }}
                      >
                        แยกแท่งคู่
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeptChartMode('combo')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: deptChartMode === 'combo' ? '#ffffff' : 'transparent',
                          color: deptChartMode === 'combo' ? '#f59e0b' : '#64748b',
                          fontWeight: deptChartMode === 'combo' ? 700 : 600,
                          cursor: 'pointer',
                          boxShadow: deptChartMode === 'combo' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                          fontSize: '13px',
                        }}
                      >
                        แท่ง + เส้นแนวโน้ม
                      </button>
                    </div>
                  </div>
                  <div className="chart-wrapper" style={{ height: '400px', cursor: 'pointer' }}>
                    <canvas id="c_sv_dept_combined" />
                  </div>
                </div>
              </div>

              <div className="chart-grid">
                <div className="chart-card chart-full">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaBuilding style={{ color: '#f59e0b', marginRight: '6px' }} /> ภาระงานเฉลี่ยต่อบุคลากรที่พบในบันทึก (งาน/ท่าน)
                  </h3>
                  <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                    <canvas id="c_sv_dept_avg" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* DIMENSION 3: Top Service Faculty */}
      {activePerspective === 'faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topServiceFaculty.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13.5px',
              }}
            >
              ไม่พบข้อมูลผู้ให้บริการวิชาการในช่วงเวลาที่เลือก
            </div>
          ) : (
            <>
              {/* Row 1: Top 10 Faculty Bar Chart & Workload Tier Donut */}
              <div className="chart-grid" style={{ marginBottom: 0 }}>
                {/* 1. Bar Chart: Top 10 Service Faculty */}
                <div className="chart-card">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaUserTie style={{ color: '#f59e0b', marginRight: '6px' }} /> 10 อันดับผู้ให้บริการสูงสุด
                  </h3>
                  <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                    <canvas id="c_sv_faculty_top10" />
                  </div>
                </div>

                {/* 2. Donut Chart: Workload Tier Distribution */}
                <div className="chart-card">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaUsers style={{ color: '#0284c7', marginRight: '6px' }} /> การกระจายภาระงานบุคลากร
                  </h3>
                  <div className="chart-wrapper" style={{ height: '380px' }}>
                    <canvas id="c_sv_workload_tier" />
                  </div>
                </div>
              </div>

              {/* Row 2: Detailed Table */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    รายละเอียด 10 อันดับผู้ให้บริการสูงสุด
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    สรุปจำนวนกิจกรรม เครือข่ายภายนอก และลิงก์เชื่อมโยงไปยังแฟ้มประวัติบุคลากร
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>บุคลากร</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>สังกัด</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>กิจกรรม</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>เครือข่าย</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '80px' }}>แฟ้ม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topServiceFaculty.slice(0, 10).map((s, idx) => (
                        <tr
                          key={`top-fac-${s.person_id || s.name || idx}`}
                          style={{ borderBottom: '1px solid #f1f5f9' }}
                        >
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#b45309' : '#64748b' }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                            {s.name}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <DepartmentBadge value={s.dept} />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#d97706' }}>
                              {s.count} งาน
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', color: '#475569' }}>
                            {s.targets.size} แห่ง
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (s.person_id) router.push(`/personnel/${s.person_id}`);
                                else router.push(`/personnel?q=${encodeURIComponent(s.name)}`);
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#b45309',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span>ดู</span>
                              <FaChevronRight style={{ fontSize: '8px' }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* DIMENSION 4: UN SDGs & ISEE */}
      {activePerspective === 'sdg' && (
        <div className="chart-grid">
          <div>
            <StrategicAlignmentMatrix
          items={validData}
          categoryKey="service"
          missionTitle="งานบริการวิชาการ"
          unitLabel="กิจกรรม"
          showBudget={true}
        />
          </div>

          <div className="chart-card">
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
              <FaLeaf style={{ color: '#f59e0b', marginRight: '6px' }} /> การขับเคลื่อนยุทธศาสตร์ ISEE (มก.)
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              บทบาทงานบริการวิชาการมุ่งเน้นยุทธศาสตร์ S (Social Responsibility) สร้าง Impact สู่ 232 เครือข่ายภายนอก
            </p>
            <div className="chart-wrapper">
              <canvas id="c_sv_isee_iam" />
            </div>
          </div>
        </div>
      )}

      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey="service"
      />
    </div>
  );
}
