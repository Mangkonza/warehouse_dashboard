'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
  FaFilter,
  FaCertificate,
  FaBuilding,
  FaUserTie,
  FaLeaf,
  FaChevronRight,
  FaLightbulb,
  FaShieldAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import { IPItem } from '../_hooks/useIPData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';

interface IPChartsProps {
  validIpData: IPItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  activePerspective?: IPPerspective;
  onChangePerspective?: (persp: IPPerspective) => void;
  hideSelector?: boolean;
}

export type IPPerspective = 'types_dept' | 'protection_status' | 'faculty' | 'sdg' | 'table';

export function IPCharts({
  validIpData,
  onSelectDept,
  onSelectType,
  activePerspective: propPerspective,
  onChangePerspective,
  hideSelector = false,
}: IPChartsProps) {
  const router = useRouter();
  const [internalPerspective, setInternalPerspective] = useState<IPPerspective>('types_dept');
  const activePerspective = propPerspective ?? internalPerspective;
  const setActivePerspective = onChangePerspective ?? setInternalPerspective;
  const [strategyMetric, setStrategyMetric] = useState<'count' | 'budget'>('count');
  const [deptStackMode, setDeptStackMode] = useState<'type' | 'stage'>('type');
  const chartInstances = useRef<Chart[]>([]);
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    items: IPItem[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#8b5cf6',
    items: [],
  });

  // Calculate top inventors
  const topInventors = useMemo(() => {
    const map: Record<string, { creator: string; person_id?: number | string; dept: string; count: number; support: number; items: IPItem[] }> = {};
    validIpData.forEach((item) => {
      const cName = String(item.creator || '').trim();
      if (!cName || cName === '-' || cName === 'nan') return;

      const pId = item.person_id;
      const key = pId ? `id_${pId}` : cName;
      if (!map[key]) {
        map[key] = {
          creator: cName,
          person_id: pId,
          dept: item.department || '-',
          count: 0,
          support: 0,
          items: [],
        };
      }
      map[key].count++;
      map[key].support += Number(item.support_amount) || 0;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.count - a.count || b.support - a.support);
  }, [validIpData]);

  // Technology cluster groups
  const techClusters = useMemo(() => {
    const groups: Record<string, { cluster: string; count: number; items: IPItem[] }> = {};
    validIpData.forEach((item) => {
      const c = item._techCluster || 'นวัตกรรมวิศวกรรมอื่นๆ';
      if (!groups[c]) groups[c] = { cluster: c, count: 0, items: [] };
      groups[c].count++;
      groups[c].items.push(item);
    });
    return Object.values(groups).sort((a, b) => b.count - a.count);
  }, [validIpData]);

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

    if (activePerspective === 'types_dept') {
      // 1. 7-Department Stacked Bar Chart with Type or Stage Stack
      const ALL_DEPTS = ['AE', 'ME', 'FE', 'CE', 'IRRE', 'CPE', 'IE'];
      const deptStats: Record<string, {
        code: string;
        name: string;
        total: number;
        patents: number;
        pettyPatents: number;
        copyrights: number;
        granted: number;
        pending: number;
        inPrep: number;
        items: IPItem[];
      }> = {};

      ALL_DEPTS.forEach((code) => {
        deptStats[code] = {
          code,
          name: getDepartment(code).name,
          total: 0,
          patents: 0,
          pettyPatents: 0,
          copyrights: 0,
          granted: 0,
          pending: 0,
          inPrep: 0,
          items: [],
        };
      });

      validIpData.forEach((item) => {
        const parts: string[] = [String(item.department || '')];
        if (Array.isArray(item.departments)) {
          parts.push(...item.departments.map(String));
        } else if (item.departments) {
          parts.push(String(item.departments));
        }

        if (Array.isArray(item.inventors)) {
          item.inventors.forEach((inv: any) => {
            if (typeof inv === 'object' && inv !== null) {
              if (inv.department) parts.push(String(inv.department));
              if (inv.name) parts.push(String(inv.name));
            } else if (inv) {
              parts.push(String(inv));
            }
          });
        } else if (item.inventors) {
          parts.push(String(item.inventors));
        }

        const allDeptStrings = parts.join(' ');
        const t = String(item.type || '').trim();
        const isPetty = t.includes('อนุสิทธิบัตร');
        const isCopy = t.includes('ลิขสิทธิ์');
        const isPatent = !isPetty && !isCopy;

        ALL_DEPTS.forEach((code) => {
          if (
            allDeptStrings.includes(code) ||
            (code === 'AE' && allDeptStrings.includes('เกษตร')) ||
            (code === 'ME' && allDeptStrings.includes('เครื่องกล')) ||
            (code === 'FE' && allDeptStrings.includes('อาหาร')) ||
            (code === 'CE' && allDeptStrings.includes('โยธา')) ||
            ((code === 'IRRE' || code === 'IRE') && allDeptStrings.includes('ชลประทาน')) ||
            (code === 'CPE' && allDeptStrings.includes('คอมพิวเตอร์')) ||
            (code === 'IE' && allDeptStrings.includes('อุตสาหการ'))
          ) {
            const ds = deptStats[code];
            ds.total++;
            ds.items.push(item);
            if (isPatent) ds.patents++;
            else if (isPetty) ds.pettyPatents++;
            else ds.copyrights++;

            if (item._pipelineStage === 'granted') ds.granted++;
            else if (item._pipelineStage === 'pending') ds.pending++;
            else ds.inPrep++;
          }
        });
      });

      const isTypeMode = deptStackMode === 'type';

      createChart('c_ip_dept_stacked', {
        type: 'bar',
        data: {
          labels: ALL_DEPTS,
          datasets: isTypeMode
            ? [
                {
                  label: 'สิทธิบัตรการประดิษฐ์',
                  data: ALL_DEPTS.map((c) => deptStats[c].patents),
                  backgroundColor: '#DDD6FE', // Soft Lavender Violet
                  borderColor: '#8B5CF6',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
                },
                {
                  label: 'อนุสิทธิบัตร',
                  data: ALL_DEPTS.map((c) => deptStats[c].pettyPatents),
                  backgroundColor: '#93C5FD', // Soft Sky Blue
                  borderColor: '#3B82F6',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
                },
                {
                  label: 'ลิขสิทธิ์ / อื่นๆ',
                  data: ALL_DEPTS.map((c) => deptStats[c].copyrights),
                  backgroundColor: '#86EFAC', // Soft Mint Emerald
                  borderColor: '#22C55E',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
                },
              ]
            : [
                {
                  label: 'ได้รับความคุ้มครองแล้ว',
                  data: ALL_DEPTS.map((c) => deptStats[c].granted),
                  backgroundColor: '#86EFAC', // Soft Mint Emerald
                  borderColor: '#22C55E',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
                },
                {
                  label: 'ยื่นคำขอแล้ว',
                  data: ALL_DEPTS.map((c) => deptStats[c].pending),
                  backgroundColor: '#93C5FD', // Soft Sky Blue
                  borderColor: '#3B82F6',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
                },
                {
                  label: 'เตรียมความพร้อมยื่นจด',
                  data: ALL_DEPTS.map((c) => deptStats[c].inPrep),
                  backgroundColor: '#FDE68A', // Soft Amber Peach
                  borderColor: '#F59E0B',
                  borderWidth: 1.5,
                  borderRadius: 4,
                  stack: 'stack1',
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
              const code = ALL_DEPTS[hit.index];
              const ds = deptStats[code];
              if (ds && ds.items.length > 0) {
                if (onSelectDept) onSelectDept(code);
                setDrillDown({
                  isOpen: true,
                  title: `ทรัพย์สินทางปัญญา: สังกัด ${ds.name} (${code})`,
                  subtitle: `รวม ${ds.items.length} รายการ (สิทธิบัตร: ${ds.patents}, อนุสิทธิบัตร: ${ds.pettyPatents}, ลิขสิทธิ์: ${ds.copyrights}) • คลิกรายการเพื่อดูรายละเอียด`,
                  accentColor: getDepartmentColor(code),
                  items: ds.items,
                });
              }
            }
          },
          scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
            y: {
              stacked: true,
              beginAtZero: true,
              grace: '10%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนรายการ (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
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
                  const code = ALL_DEPTS[idx];
                  const ds = deptStats[code];
                  return ds ? `สังกัด: ${ds.name} (${code})` : '';
                },
                afterBody: (items: any[]) => {
                  const idx = items[0]?.dataIndex ?? -1;
                  const code = ALL_DEPTS[idx];
                  const ds = deptStats[code];
                  if (!ds) return [];
                  return [
                    `─────────────────────────────`,
                    `รวมทั้งสิ้น: ${ds.total} รายการ`,
                  ];
                },
              },
            },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => (v > 0 ? `${v}` : ''),
            },
          },
        },
      });

      // 2. IP Types Breakdown (Donut)
      let pettyCount = 0;
      let patentCount = 0;
      let copyrightCount = 0;
      const pettyItems: IPItem[] = [];
      const patentItems: IPItem[] = [];
      const copyrightItems: IPItem[] = [];

      validIpData.forEach((item) => {
        const t = String(item.type || '').trim();
        if (t.includes('อนุสิทธิบัตร')) {
          pettyCount++;
          pettyItems.push(item);
        } else if (t.includes('สิทธิบัตร')) {
          patentCount++;
          patentItems.push(item);
        } else {
          copyrightCount++;
          copyrightItems.push(item);
        }
      });

      // 2. IP Breakdown Donut (Matches the left chart mode: Types or Stages to prevent color confusion)
      const donutData = isTypeMode
        ? [
            { label: 'สิทธิบัตรการประดิษฐ์', count: patentCount, color: '#DDD6FE', border: '#8B5CF6', items: patentItems },
            { label: 'อนุสิทธิบัตร', count: pettyCount, color: '#93C5FD', border: '#3B82F6', items: pettyItems },
            { label: 'ลิขสิทธิ์ / อื่นๆ', count: copyrightCount, color: '#86EFAC', border: '#22C55E', items: copyrightItems },
          ].filter((t) => t.count > 0 || validIpData.length === 0)
        : [
            { label: 'ได้รับความคุ้มครองแล้ว', count: validIpData.filter((i) => i._pipelineStage === 'granted').length, color: '#86EFAC', border: '#22C55E', items: validIpData.filter((i) => i._pipelineStage === 'granted') },
            { label: 'ยื่นคำขอแล้ว', count: validIpData.filter((i) => i._pipelineStage === 'pending').length, color: '#93C5FD', border: '#3B82F6', items: validIpData.filter((i) => i._pipelineStage === 'pending') },
            { label: 'เตรียมความพร้อมยื่นจด', count: validIpData.filter((i) => i._pipelineStage !== 'granted' && i._pipelineStage !== 'pending').length, color: '#FDE68A', border: '#F59E0B', items: validIpData.filter((i) => i._pipelineStage !== 'granted' && i._pipelineStage !== 'pending') },
          ].filter((t) => t.count > 0 || validIpData.length === 0);

      createChart('c_ip_types_breakdown', {
        type: 'doughnut',
        data: {
          labels: donutData.map((t) => t.label),
          datasets: [
            {
              data: donutData.map((t) => t.count),
              backgroundColor: donutData.map((t) => t.color),
              borderColor: donutData.map((t) => t.border),
              borderWidth: 1.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          onHover: (event: any, chartElement: any[]) => {
            if (event.native?.target) event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const td = donutData[hit.index];
              if (td && td.items.length > 0) {
                if (isTypeMode && onSelectType) onSelectType(td.label);
                setDrillDown({
                  isOpen: true,
                  title: isTypeMode ? `ประเภททรัพย์สินทางปัญญา: ${td.label}` : `สถานะความคุ้มครอง: ${td.label}`,
                  subtitle: `รวม ${td.count} รายการ (${validIpData.length > 0 ? ((td.count / validIpData.length) * 100).toFixed(1) : 0}%) • คลิกรายการเพื่อดูรายละเอียด`,
                  accentColor: td.border,
                  items: td.items,
                });
              }
            }
          },
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
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const td = donutData[context.dataIndex];
                  if (!td) return '';
                  const pct = validIpData.length > 0 ? ((td.count / validIpData.length) * 100).toFixed(1) : '0';
                  return `${td.label}: ${td.count} รายการ (${pct}%)`;
                },
              },
            },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => {
                const total = validIpData.length;
                if (total === 0 || v === 0) return '';
                const pct = ((v / total) * 100).toFixed(1);
                return `${v} (${pct}%)`;
              },
            },
          },
        },
      });
    }

    if (activePerspective === 'protection_status') {
      // 1. Snapshot count by current stage
      const stageGroups = [
        {
          key: 'granted',
          label: 'ได้รับความคุ้มครองแล้ว',
          color: '#86EFAC',
          border: '#22C55E',
          items: validIpData.filter((i) => i._pipelineStage === 'granted'),
        },
        {
          key: 'pending',
          label: 'ยื่นคำขอแล้ว',
          color: '#93C5FD',
          border: '#3B82F6',
          items: validIpData.filter((i) => i._pipelineStage === 'pending'),
        },
        {
          key: 'prep',
          label: 'เตรียมความพร้อมยื่นจด',
          color: '#FDE68A',
          border: '#F59E0B',
          items: validIpData.filter((i) => i._pipelineStage !== 'granted' && i._pipelineStage !== 'pending'),
        },
      ];

      createChart('c_ip_stage_snapshot', {
        type: 'bar',
        data: {
          labels: stageGroups.map((stage) => stage.label),
          datasets: [
            {
              label: 'จำนวนรายการตามสถานะปัจจุบัน',
              data: stageGroups.map((stage) => stage.items.length),
              backgroundColor: stageGroups.map((stage) => stage.color),
              borderColor: stageGroups.map((stage) => stage.border),
              borderWidth: 1.5,
              borderRadius: 8,
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
              const stage = stageGroups[hit.index];
              if (stage && stage.items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `ทรัพย์สินทางปัญญา: ${stage.label}`,
                  subtitle: `สถานะปัจจุบัน ${stage.items.length} รายการ • คลิกรายการเพื่อดูรายละเอียด`,
                  accentColor: stage.border,
                  items: stage.items,
                });
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '18%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนรายการ (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v} รายการ`,
            },
          },
        },
      });

      // 2. Fiscal Year trend
      const fyCounts: Record<string, number> = { '2568': 0, '2569': 0, '2570': 0 };
      const fyItems: Record<string, IPItem[]> = { '2568': [], '2569': [], '2570': [] };
      validIpData.forEach((d) => {
        const y = d._fiscalYear || '2568';
        if (fyCounts[y] !== undefined) {
          fyCounts[y]++;
          fyItems[y].push(d);
        }
      });

      createChart('c_ip_fy_trend', {
        type: 'bar',
        data: {
          labels: ['ปีงบ 2568', 'ปีงบ 2569', 'ปีงบ 2570'],
          datasets: [
            {
              label: 'จำนวนทรัพย์สินทางปัญญา',
              data: [fyCounts['2568'], fyCounts['2569'], fyCounts['2570']],
              backgroundColor: ['#DDD6FE', '#C7D2FE', '#A5B4FC'],
              borderColor: '#8B5CF6',
              borderWidth: 1.5,
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
              const years = ['2568', '2569', '2570'];
              const y = years[hit.index];
              const items = fyItems[y] || [];
              if (items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `ทรัพย์สินทางปัญญา: ปีงบประมาณ ${y}`,
                  subtitle: `รวม ${items.length} รายการ • คลิกรายการเพื่อดูรายละเอียด`,
                  accentColor: '#8B5CF6',
                  items,
                });
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนรายการ (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            x: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v} รายการ`,
            },
          },
        },
      });
    }

    if (activePerspective === 'faculty') {
      const top10 = topInventors.slice(0, 10);

      // 1. Top 10 Inventors Horizontal Bar Chart
      createChart('c_ip_faculty_top10', {
        type: 'bar',
        data: {
          labels: top10.map((inv) => {
            const clean = inv.creator.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ');
            return clean.length > 22 ? clean.substring(0, 20) + '...' : clean;
          }),
          datasets: [
            {
              label: 'จำนวนผลงาน (รายการ)',
              data: top10.map((inv) => inv.count),
              backgroundColor: top10.map((inv) => getDepartmentColor(inv.dept)),
              borderColor: top10.map((inv) => getDepartmentColor(inv.dept)),
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
              const inv = top10[hit.index];
              if (inv && inv.items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `นักประดิษฐ์: ${inv.creator}`,
                  subtitle: `สังกัด ${inv.dept} • รวม ${inv.count} ผลงาน${inv.support > 0 ? ` • เงินสนับสนุน ${inv.support.toLocaleString('th-TH')} บาท` : ''}`,
                  accentColor: getDepartmentColor(inv.dept),
                  items: inv.items,
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
                  const inv = top10[idx];
                  return inv ? `นักประดิษฐ์: ${inv.creator} (${inv.dept})` : '';
                },
                label: (context: any) => {
                  const inv = top10[context.dataIndex];
                  if (!inv) return '';
                  return [
                    `จำนวนผลงาน: ${inv.count} รายการ`,
                    inv.support > 0 ? `เงินสนับสนุน: ${inv.support.toLocaleString('th-TH')} บาท` : '',
                    `คลิกที่แท่งกราฟเพื่อดูรายการผลงานทั้งหมด`,
                  ].filter(Boolean);
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'right',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => `${v} รายการ`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '18%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนผลงาน (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            y: {
              grid: { display: false },
              ticks: { font: { size: 13.5, weight: 600 }, color: '#334155' },
            },
          },
        },
      });

      // 2. Tech Clusters Horizontal Bar
      createChart('c_ip_clusters', {
        type: 'bar',
        data: {
          labels: techClusters.map((c) => c.cluster),
          datasets: [
            {
              label: 'จำนวนผลงาน',
              data: techClusters.map((c) => c.count),
              backgroundColor: CHART_PASTEL_PALETTE.series.slice(0, 5),
              borderColor: ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#F43F5E'],
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
              const c = techClusters[hit.index];
              if (c && c.items.length > 0) {
                setDrillDown({
                  isOpen: true,
                  title: `กลุ่มเทคโนโลยี: ${c.cluster}`,
                  subtitle: `รวม ${c.count} ผลงานทรัพย์สินทางปัญญา • คลิกรายการเพื่อดูรายละเอียด`,
                  accentColor: '#8B5CF6',
                  items: c.items,
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
              formatter: (v: number) => `${v} รายการ`,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grace: '15%',
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนผลงาน (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { precision: 0, font: { size: 13, weight: 600 } },
            },
            y: { grid: { display: false }, ticks: { font: { size: 13.5, weight: 600 } } },
          },
        },
      });
    }

    if (activePerspective === 'sdg') {
      // ISEE & IAM breakdown
      const totalSupport = validIpData.reduce((sum, d) => sum + (Number(d.support_amount) || 0), 0);
      const iseeInnovateCount = validIpData.length;
      const iseeExcellenceCount = validIpData.filter((d) => d._pipelineStage === 'granted').length;
      const iamAgilityCount = validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).length;
      const iamMasteryCount = validIpData.filter((d) => (Number(d.support_amount) || 0) > 0).length;

      const countData = [iseeInnovateCount, iamAgilityCount, iseeExcellenceCount, iamMasteryCount];
      const budgetData = [
        totalSupport,
        validIpData.filter((d) => String(d.type || '').includes('อนุสิทธิบัตร')).reduce((s, d) => s + (Number(d.support_amount) || 0), 0),
        validIpData.filter((d) => d._pipelineStage === 'granted').reduce((s, d) => s + (Number(d.support_amount) || 0), 0),
        totalSupport,
      ];

      createChart('c_ip_isee_iam', {
        type: 'bar',
        data: {
          labels: ['I - Innovate (การสร้างสรรค์นวัตกรรม)', 'A - Agility (ความคล่องตัว)', 'E1 - Excellence (ความเป็นเลิศ)', 'M - Mastery (ความเชี่ยวชาญ)'],
          datasets: [
            {
              label: strategyMetric === 'count' ? 'จำนวนผลงาน (รายการ)' : 'งบสนับสนุน (บาท)',
              data: strategyMetric === 'count' ? countData : budgetData,
              backgroundColor: ['#DDD6FE', '#93C5FD', '#86EFAC', '#FDE68A'],
              borderColor: ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B'],
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
              formatter: (v: number) => (strategyMetric === 'count' ? `${v} รายการ` : `${v.toLocaleString()} ฿`),
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
  }, [validIpData, activePerspective, strategyMetric, techClusters, deptStackMode, topInventors, onSelectDept, onSelectType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      {/* DIMENSION 1: Department Distribution & IP Types Breakdown */}
      {activePerspective === 'types_dept' && (
        <>
          {validIpData.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13.5px',
              }}
            >
              ไม่พบข้อมูลทรัพย์สินทางปัญญาตามตัวกรองที่เลือก
            </div>
          ) : (
            <div className="chart-grid">
              <div className="chart-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaBuilding style={{ color: '#8b5cf6', marginRight: '6px' }} /> การกระจายตัวตาม 7 สังกัด ({deptStackMode === 'type' ? 'แยกตามประเภท' : 'แยกตามสถานะ'})
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
                      onClick={() => setDeptStackMode('type')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: deptStackMode === 'type' ? '#ffffff' : 'transparent',
                        color: deptStackMode === 'type' ? '#6d28d9' : '#64748b',
                        fontWeight: deptStackMode === 'type' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: deptStackMode === 'type' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      แยกตามประเภท
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeptStackMode('stage')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: deptStackMode === 'stage' ? '#ffffff' : 'transparent',
                        color: deptStackMode === 'stage' ? '#6d28d9' : '#64748b',
                        fontWeight: deptStackMode === 'stage' ? 700 : 600,
                        cursor: 'pointer',
                        boxShadow: deptStackMode === 'stage' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                        fontSize: '13px',
                      }}
                    >
                      แยกตามสถานะ
                    </button>
                  </div>
                </div>
                <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                  <canvas id="c_ip_dept_stacked" />
                </div>
              </div>

              <div className="chart-card">
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                  <FaCertificate style={{ color: '#8b5cf6', marginRight: '6px' }} />{' '}
                  {deptStackMode === 'type' ? 'สัดส่วนประเภททรัพย์สินทางปัญญา' : 'สัดส่วนตามสถานะความคุ้มครอง'}
                </h3>
                <div className="chart-wrapper" style={{ height: '380px', cursor: 'pointer' }}>
                  <canvas id="c_ip_types_breakdown" />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* DIMENSION 2: Application Tracking & Timeline */}
      {activePerspective === 'protection_status' && (
        <>
          {validIpData.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13.5px',
              }}
            >
              ไม่พบข้อมูลทรัพย์สินทางปัญญาตามตัวกรองที่เลือก
            </div>
          ) : (
            <div className="chart-grid">
              <div className="chart-card">
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                  <FaShieldAlt style={{ color: '#8b5cf6', marginRight: '6px' }} /> สถานะการยื่นคำขอและการคุ้มครอง (3 ระดับ)
                </h3>
                <div className="chart-wrapper" style={{ height: '360px', cursor: 'pointer' }}>
                  <canvas id="c_ip_stage_snapshot" />
                </div>
              </div>

              <div className="chart-card">
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                  <FaCalendarAlt style={{ color: '#8b5cf6', marginRight: '6px' }} /> แนวโน้มการสร้างสรรค์ผลงานตามปีงบประมาณ
                </h3>
                <div className="chart-wrapper" style={{ height: '360px', cursor: 'pointer' }}>
                  <canvas id="c_ip_fy_trend" />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* DIMENSION 3: Faculty & Tech Clusters */}
      {activePerspective === 'faculty' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topInventors.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '32px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '13.5px',
              }}
            >
              ไม่พบข้อมูลนักประดิษฐ์ตามตัวกรองที่เลือก
            </div>
          ) : (
            <>
              {/* Row 1: Charts (Top 10 Inventors & Tech Clusters) */}
              <div className="chart-grid">
                <div className="chart-card">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaUserTie style={{ color: '#8b5cf6', marginRight: '6px' }} /> 10 อันดับอาจารย์และนักประดิษฐ์ที่มีผลงานสูงสุด
                  </h3>
                  <div className="chart-wrapper" style={{ height: '400px', cursor: 'pointer' }}>
                    <canvas id="c_ip_faculty_top10" />
                  </div>
                </div>

                <div className="chart-card">
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                    <FaLightbulb style={{ color: '#8b5cf6', marginRight: '6px' }} /> กลุ่มเทคโนโลยีและนวัตกรรม
                  </h3>
                  <div className="chart-wrapper" style={{ height: '400px', cursor: 'pointer' }}>
                    <canvas id="c_ip_clusters" />
                  </div>
                </div>
              </div>

              {/* Row 2: Detailed Top Inventors Table */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    ตารางทำเนียบ 10 อันดับนักประดิษฐ์
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    รายละเอียดรายชื่อ สังกัด จำนวนผลงาน และงบสนับสนุน พร้อมลิงก์ไปยังประวัติบุคลากร
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', color: '#475569', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>นักประดิษฐ์</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>สังกัด</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>ผลงาน</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>เงินสนับสนุน</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '70px' }}>แฟ้ม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topInventors.slice(0, 10).map((inv, idx) => (
                        <tr
                          key={`top-inv-${inv.person_id || inv.creator || idx}`}
                          style={{ borderBottom: '1px solid #f1f5f9' }}
                        >
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: idx < 3 ? '#7c3aed' : '#64748b' }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                            {inv.creator}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <DepartmentBadge value={inv.dept} />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>
                            <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#6d28d9' }}>
                              {inv.count} รายการ
                            </span>
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: inv.support > 0 ? '#047857' : '#94a3b8' }}>
                            {inv.support > 0 ? `${inv.support.toLocaleString('th-TH')} ฿` : '-'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                if (inv.person_id) router.push(`/personnel/${inv.person_id}`);
                                else router.push(`/personnel?q=${encodeURIComponent(inv.creator)}`);
                              }}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                backgroundColor: '#ffffff',
                                color: '#6d28d9',
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
          items={validIpData}
          categoryKey="ip"
          missionTitle="งานทรัพย์สินทางปัญญา"
          unitLabel="ผลงาน"
          showBudget={true}
        />
          </div>

          <div className="chart-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
                <FaLeaf style={{ color: '#8b5cf6', marginRight: '6px' }} /> ยุทธศาสตร์ ISEE และค่านิยม IAM
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
                  onClick={() => setStrategyMetric('count')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: strategyMetric === 'count' ? '#ffffff' : 'transparent',
                    color: strategyMetric === 'count' ? '#6d28d9' : '#64748b',
                    fontWeight: strategyMetric === 'count' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  จำนวนผลงาน
                </button>
                <button
                  type="button"
                  onClick={() => setStrategyMetric('budget')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: strategyMetric === 'budget' ? '#ffffff' : 'transparent',
                    color: strategyMetric === 'budget' ? '#6d28d9' : '#64748b',
                    fontWeight: strategyMetric === 'budget' ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  งบสนับสนุน
                </button>
              </div>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748b' }}>
              ทรัพย์สินทางปัญญาขับเคลื่อนยุทธศาสตร์ I (Innovate) 100% ควบคู่กับค่านิยม A (Agility) ในการแปลงผลงาน
            </p>
            <div className="chart-wrapper">
              <canvas id="c_ip_isee_iam" />
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
        categoryKey="ip"
      />
    </div>
  );
}
