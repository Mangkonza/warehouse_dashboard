'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import { PersonnelWorkMetric, DepartmentPersonnelStat } from '../_hooks/usePersonnelData';
import { getDepartment, getDepartmentColor, formatChartDeptLabel } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/ui';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

interface PersonnelChartsProps {
  metrics: PersonnelWorkMetric[];
  departmentStats: DepartmentPersonnelStat[];
  onSelectPerson?: (id: number) => void;
}

export type TopFacultyRankMode =
  | 'all'
  | 'research'
  | 'academic'
  | 'publications'
  | 'ip'
  | 'service'
  | 'budget';

const TOP_RANK_OPTIONS: {
  id: TopFacultyRankMode;
  label: string;
  title: string;
  badge: string;
  bg: string;
  border: string;
  text: string;
  barColor: string;
  barBorder: string;
  unit: string;
}[] = [
  {
    id: 'all',
    label: 'รวม 5 ด้าน',
    title: '10 อันดับอาจารย์ที่มีผลงานสะสมสูงสุด (รวม 5 ด้าน)',
    badge: 'แท่งซ้อน 5 พันธกิจ',
    bg: '#D1FAE5',
    border: '#6EE7B7',
    text: '#065F46',
    barColor: '#86EFAC',
    barBorder: '#34D399',
    unit: 'รายการ',
  },
  {
    id: 'research',
    label: 'โครงการวิจัย',
    title: '10 อันดับอาจารย์ที่มีโครงการวิจัยสูงสุด',
    badge: 'เฉพาะงานวิจัย',
    bg: '#DCFCE7',
    border: '#86EFAC',
    text: '#166534',
    barColor: '#86EFAC',
    barBorder: '#34D399',
    unit: 'โครงการ',
  },
  {
    id: 'academic',
    label: 'พัฒนาวิชาการ',
    title: '10 อันดับอาจารย์ที่มีโครงการพัฒนาวิชาการสูงสุด',
    badge: 'เฉพาะพัฒนาวิชาการ',
    bg: '#E0F2FE',
    border: '#93C5FD',
    text: '#075985',
    barColor: '#93C5FD',
    barBorder: '#60A5FA',
    unit: 'โครงการ',
  },
  {
    id: 'publications',
    label: 'ผลงานตีพิมพ์',
    title: '10 อันดับอาจารย์ที่มีผลงานตีพิมพ์ทางวิชาการสูงสุด',
    badge: 'เฉพาะงานตีพิมพ์',
    bg: '#FFE4E6',
    border: '#FDA4AF',
    text: '#9F1239',
    barColor: '#FDA4AF',
    barBorder: '#FB7185',
    unit: 'เรื่อง',
  },
  {
    id: 'ip',
    label: 'ทรัพย์สินฯ',
    title: '10 อันดับอาจารย์ที่มีงานทรัพย์สินทางปัญญาสูงสุด',
    badge: 'เฉพาะทรัพย์สินฯ',
    bg: '#EDE9FE',
    border: '#C4B5FD',
    text: '#5B21B6',
    barColor: '#C4B5FD',
    barBorder: '#A78BFA',
    unit: 'รายการ',
  },
  {
    id: 'service',
    label: 'บริการวิชาการ',
    title: '10 อันดับอาจารย์ที่มีงานบริการวิชาการสูงสุด',
    badge: 'เฉพาะบริการวิชาการ',
    bg: '#FEF3C7',
    border: '#FDE68A',
    text: '#92400E',
    barColor: '#FDE68A',
    barBorder: '#FBBF24',
    unit: 'กิจกรรม',
  },
  {
    id: 'budget',
    label: 'งบประมาณรวม',
    title: '10 อันดับอาจารย์ที่สร้างงบประมาณโครงการรวมสูงสุด',
    badge: 'งบวิจัย + พัฒนาวิชาการ',
    bg: '#CCFBF1',
    border: '#5EEAD4',
    text: '#115E59',
    barColor: '#6EE7B7',
    barBorder: '#10B981',
    unit: 'ล้านบาท',
  },
];

export function PersonnelCharts({ metrics, departmentStats, onSelectPerson }: PersonnelChartsProps) {
  const router = useRouter();
  const chartInstances = useRef<Chart[]>([]);
  const [topRankMode, setTopRankMode] = useState<TopFacultyRankMode>('all');
  const [drillDown, setDrillDown] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    accentColor: string;
    categoryKey?: any;
    items: any[];
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    accentColor: '#00A651',
    items: [],
  });

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    // 1. Top 10 Faculty by Selected Mode
    const activeRankConfig = TOP_RANK_OPTIONS.find((o) => o.id === topRankMode) || TOP_RANK_OPTIONS[0];

    const getPersonValueByMode = (m: PersonnelWorkMetric) => {
      switch (topRankMode) {
        case 'research':
          return m.counts.research;
        case 'academic':
          return m.counts.academic;
        case 'publications':
          return m.counts.publications;
        case 'ip':
          return m.counts.ip;
        case 'service':
          return m.counts.service;
        case 'budget':
          return Number((m.budgets.total / 1000000).toFixed(2));
        default:
          return m.counts.total;
      }
    };

    const sortedByWorks = [...metrics]
      .filter((m) => getPersonValueByMode(m) > 0)
      .sort((a, b) => {
        const diff = getPersonValueByMode(b) - getPersonValueByMode(a);
        if (diff !== 0) return diff;
        return b.budgets.total - a.budgets.total || b.counts.total - a.counts.total;
      })
      .slice(0, 10);

    const topNames = sortedByWorks.map((m) => {
      const val = getPersonValueByMode(m);
      const valText = topRankMode === 'budget' ? `${val.toFixed(2)} ลบ.` : `${val}`;
      return `${m.cleanName || m.name} (${valText})`;
    });

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    const topDatasets =
      topRankMode === 'all'
        ? [
            {
              label: 'วิจัย',
              data: sortedByWorks.map((m) => m.counts.research),
              backgroundColor: '#86EFAC',
              borderColor: '#34D399',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'พัฒนาวิชาการ',
              data: sortedByWorks.map((m) => m.counts.academic),
              backgroundColor: '#93C5FD',
              borderColor: '#60A5FA',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'ตีพิมพ์',
              data: sortedByWorks.map((m) => m.counts.publications),
              backgroundColor: '#FDA4AF',
              borderColor: '#FB7185',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'ทรัพย์สินฯ',
              data: sortedByWorks.map((m) => m.counts.ip),
              backgroundColor: '#C4B5FD',
              borderColor: '#A78BFA',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'บริการวิชาการ',
              data: sortedByWorks.map((m) => m.counts.service),
              backgroundColor: '#FDE68A',
              borderColor: '#FBBF24',
              borderWidth: 1,
              borderRadius: 4,
            },
          ]
        : topRankMode === 'budget'
        ? [
            {
              label: 'งบโครงการวิจัย (ล้านบาท)',
              data: sortedByWorks.map((m) => Number((m.budgets.research / 1000000).toFixed(2))),
              backgroundColor: '#86EFAC',
              borderColor: '#34D399',
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: 'งบพัฒนาวิชาการ (ล้านบาท)',
              data: sortedByWorks.map((m) => Number((m.budgets.academic / 1000000).toFixed(2))),
              backgroundColor: '#93C5FD',
              borderColor: '#60A5FA',
              borderWidth: 1,
              borderRadius: 4,
            },
          ]
        : [
            {
              label: `${activeRankConfig.label} (${activeRankConfig.unit})`,
              data: sortedByWorks.map((m) => getPersonValueByMode(m)),
              backgroundColor: activeRankConfig.barColor,
              borderColor: activeRankConfig.barBorder,
              borderWidth: 1.5,
              borderRadius: 6,
            },
          ];

    // Chart 1: Top 10 Faculty Bar (Dynamic by Selected Mode)
    createChart('c_top_faculty', {
      type: 'bar',
      data: {
        labels: topNames,
        datasets: topDatasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        onHover: (event: any, chartElement: any[]) => {
          if (event.native?.target) {
            event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          }
        },
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'y');
          if (hit) {
            const target = sortedByWorks[hit.index];
            if (target) {
              const rawItems =
                topRankMode === 'research'
                  ? target.researchItems.map((it) => ({ ...it, _category: 'research' }))
                  : topRankMode === 'academic'
                  ? target.academicItems.map((it) => ({ ...it, _category: 'academic' }))
                  : topRankMode === 'publications'
                  ? target.pubItems.map((it) => ({ ...it, _category: 'publications' }))
                  : topRankMode === 'ip'
                  ? target.ipItems.map((it) => ({ ...it, _category: 'ip' }))
                  : topRankMode === 'service'
                  ? target.serviceItems.map((it) => ({ ...it, _category: 'service' }))
                  : topRankMode === 'budget'
                  ? [
                      ...target.researchItems.map((it) => ({ ...it, _category: 'research' })),
                      ...target.academicItems.map((it) => ({ ...it, _category: 'academic' })),
                    ]
                  : [
                      ...target.researchItems.map((it) => ({ ...it, _category: 'research' })),
                      ...target.academicItems.map((it) => ({ ...it, _category: 'academic' })),
                      ...target.pubItems.map((it) => ({ ...it, _category: 'publications' })),
                      ...target.ipItems.map((it) => ({ ...it, _category: 'ip' })),
                      ...target.serviceItems.map((it) => ({ ...it, _category: 'service' })),
                    ];
              const seen = new Set<string>();
              const uniqueWorks = rawItems.filter((it) => {
                const k = `${it._category}_${it._id || it.id || it.name || it.title || ''}`;
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
              });
              setDrillDown({
                isOpen: true,
                title: `ผลงาน (${activeRankConfig.label}): ${target.name}`,
                subtitle: `ภาควิชา ${target.department} • รวม ${uniqueWorks.length} รายการ • งบโครงการรวม ${(target.budgets.total / 1000000).toFixed(2)} ล้านบาท`,
                accentColor: activeRankConfig.barBorder,
                categoryKey:
                  topRankMode !== 'all' && topRankMode !== 'budget' ? topRankMode : undefined,
                items: uniqueWorks,
              });
            }
          }
        },
        scales: {
          x: {
            stacked: topRankMode === 'all' || topRankMode === 'budget',
            beginAtZero: true,
            grace: '10%',
            title: {
              display: true,
              text:
                topRankMode === 'budget'
                  ? 'งบประมาณโครงการรวม (ล้านบาท)'
                  : `จำนวนผลงาน (${activeRankConfig.unit})`,
            },
          },
          y: {
            stacked: topRankMode === 'all' || topRankMode === 'budget',
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            display: topRankMode === 'all' || topRankMode === 'budget',
            position: 'top',
            labels: { boxWidth: 12, font: { size: 11 } },
          },
          datalabels: {
            display: (ctx: any) => {
              const val = Number(ctx.dataset.data[ctx.dataIndex] || 0);
              if (topRankMode === 'all') return val >= 2;
              if (topRankMode === 'budget') return val >= 0.5;
              return val > 0;
            },
            color: '#1e293b',
            font: { weight: 'bold', size: 10.5 },
            formatter: (v: number) =>
              topRankMode === 'budget' ? `${Number(v).toFixed(2)}` : v,
          },
        },
      },
    });

    // Chart 2: Works Distribution & Active Faculty by Department (Dual-Axis Pastel Combo)
    const sortedDepts = [...departmentStats].filter((d) => d.totalWorks > 0);

    const deptLabels = sortedDepts.map((d) => formatChartDeptLabel(d.name));
    const deptWorks = sortedDepts.map((d) => d.totalWorks);
    const deptActiveFaculty = sortedDepts.map((d) => d.activeCount);
    const deptColors = sortedDepts.map((d) => getDepartmentColor(d.name));

    createChart('c_dept_faculty_works', {
      type: 'bar',
      data: {
        labels: deptLabels,
        datasets: [
          {
            type: 'bar',
            label: 'ผลงานสะสมรวม (รายการ)',
            data: deptWorks,
            backgroundColor: deptColors,
            borderRadius: 8,
            maxBarThickness: 48,
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'line',
            label: 'อาจารย์ที่มีผลงาน (ท่าน)',
            data: deptActiveFaculty,
            borderColor: '#FB7185',
            backgroundColor: 'rgba(251, 113, 133, 0.15)',
            borderWidth: 2.5,
            pointBackgroundColor: '#F43F5E',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 6,
            tension: 0.35,
            yAxisID: 'y1',
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        layout: {
          padding: { top: 16, right: 8, left: 8, bottom: 4 },
        },
        onHover: (event: any, chartElement: any[]) => {
          if (event.native?.target) {
            event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          }
        },
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const targetDept = sortedDepts[hit.index];
            if (targetDept) {
              const deptFaculty = metrics.filter((m) => m.department === targetDept.name);
              const deptWorksList = deptFaculty.flatMap((m) => [
                ...m.researchItems.map((it) => ({ ...it, _category: 'research' })),
                ...m.academicItems.map((it) => ({ ...it, _category: 'academic' })),
                ...m.pubItems.map((it) => ({ ...it, _category: 'publications' })),
                ...m.ipItems.map((it) => ({ ...it, _category: 'ip' })),
                ...m.serviceItems.map((it) => ({ ...it, _category: 'service' })),
              ]);
              const seenWorks = new Set<string>();
              const uniqueDeptWorks = deptWorksList.filter((it) => {
                const k = `${it._category}_${it._id || it.id || it.name || it.title || ''}`;
                if (seenWorks.has(k)) return false;
                seenWorks.add(k);
                return true;
              });
              setDrillDown({
                isOpen: true,
                title: `ผลงานสะสม: ${targetDept.name}`,
                subtitle: `อาจารย์ที่มีผลงาน ${targetDept.activeCount} ท่าน • รวม ${uniqueDeptWorks.length} รายการ • งบ ${(targetDept.totalBudget / 1000000).toFixed(2)} ล้านบาท`,
                accentColor: getDepartmentColor(targetDept.name),
                items: uniqueDeptWorks,
              });
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            position: 'left',
            grace: '22%',
            title: { display: true, text: 'ผลงานสะสมรวม (รายการ)', font: { weight: 'bold', size: 11.5 } },
            grid: { color: '#f1f5f9' },
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grace: '25%',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'จำนวนอาจารย์ที่มีผลงาน (ท่าน)', color: '#E11D48', font: { weight: 'bold', size: 11.5 } },
            ticks: { color: '#E11D48', precision: 0 },
          },
          x: {
            grid: { display: false },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              font: { weight: 'bold', size: 12 },
              color: '#1e293b',
            },
          },
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 14, padding: 16, font: { size: 12 } } },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? d.name : '';
              },
              label: (context: any) => {
                const val = context.raw || 0;
                if (context.datasetIndex === 1) {
                  return ` อาจารย์ที่มีผลงาน: ${val} ท่าน`;
                }
                const idx = context.dataIndex;
                const d = sortedDepts[idx];
                const avg = d && d.activeCount > 0 ? (val / d.activeCount).toFixed(1) : '0';
                return ` ผลงานสะสมรวม: ${val} รายการ (เฉลี่ย ${avg} รายการ/ท่าน)`;
              },
            },
          },
          datalabels: {
            anchor: (ctx: any) => {
              if (ctx.datasetIndex === 1) return 'end';
              const val = Number(ctx.dataset.data[ctx.dataIndex] || 0);
              return val >= 50 ? 'center' : 'end';
            },
            align: (ctx: any) => {
              if (ctx.datasetIndex === 1) return 'top';
              const val = Number(ctx.dataset.data[ctx.dataIndex] || 0);
              return val >= 50 ? 'center' : 'top';
            },
            offset: (ctx: any) => {
              if (ctx.datasetIndex === 1) return 6;
              const val = Number(ctx.dataset.data[ctx.dataIndex] || 0);
              return val >= 50 ? 0 : 2;
            },
            color: (ctx: any) => (ctx.datasetIndex === 1 ? '#be123c' : '#0f172a'),
            backgroundColor: (ctx: any) =>
              ctx.datasetIndex === 1 ? 'rgba(255, 241, 242, 0.92)' : 'rgba(255, 255, 255, 0.85)',
            borderRadius: 4,
            padding: { top: 1, bottom: 1, left: 5, right: 5 },
            font: { weight: 'bold', size: 11 },
            formatter: (v: number, ctx: any) => {
              if (!v || v <= 0) return '';
              return ctx.datasetIndex === 1 ? `${v} ท่าน` : `${v}`;
            },
          },
        },
      },
    });

    // Chart 3: Doughnut of Works across the 5 Missions (Soft Pastel Tones)
    const dedupe = (items: any[], cat: string) => {
      const seen = new Set<string>();
      return items
        .filter((it) => {
          const k = it._id || it.id || it.name || it.title || '';
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        })
        .map((it) => ({ ...it, _category: cat }));
    };

    const researchItemsAll = dedupe(metrics.flatMap((m) => m.researchItems), 'research');
    const academicItemsAll = dedupe(metrics.flatMap((m) => m.academicItems), 'academic');
    const pubItemsAll = dedupe(metrics.flatMap((m) => m.pubItems), 'publications');
    const serviceItemsAll = dedupe(metrics.flatMap((m) => m.serviceItems), 'service');
    const ipItemsAll = dedupe(metrics.flatMap((m) => m.ipItems), 'ip');

    const missionBuckets = [
      { label: 'โครงการวิจัย', cat: 'research', count: researchItemsAll.length, color: '#86EFAC', items: researchItemsAll },
      { label: 'โครงการพัฒนาวิชาการ', cat: 'academic', count: academicItemsAll.length, color: '#93C5FD', items: academicItemsAll },
      { label: 'ผลงานตีพิมพ์ทางวิชาการ', cat: 'publications', count: pubItemsAll.length, color: '#FDA4AF', items: pubItemsAll },
      { label: 'งานทรัพย์สินทางปัญญา', cat: 'ip', count: ipItemsAll.length, color: '#C4B5FD', items: ipItemsAll },
      { label: 'งานบริการวิชาการ', cat: 'service', count: serviceItemsAll.length, color: '#FDE68A', items: serviceItemsAll },
    ];

    createChart('c_mission_doughnut', {
      type: 'doughnut',
      data: {
        labels: missionBuckets.map((b) => b.label),
        datasets: [
          {
            data: missionBuckets.map((b) => b.count),
            backgroundColor: missionBuckets.map((b) => b.color),
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
            const b = missionBuckets[hit.index];
            if (b) {
              setDrillDown({
                isOpen: true,
                title: `รายการ${b.label}`,
                subtitle: `รวมทั้งหมด ${b.count} รายการ`,
                accentColor: b.color,
                categoryKey: b.cat,
                items: b.items,
              });
            }
          }
        },
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11.5 } } },
          datalabels: {
            color: '#1e293b',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number) => (v > 0 ? v : ''),
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];
    };
  }, [metrics, departmentStats, onSelectPerson, topRankMode]);

  const currentRankOption = TOP_RANK_OPTIONS.find((o) => o.id === topRankMode) || TOP_RANK_OPTIONS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* แถวที่ 1: 10 อันดับอาจารย์ที่มีผลงานสูงสุด (ซ้าย 60%) คู่กับ สัดส่วนผลงานตาม 5 พันธกิจหลัก (ขวา 40%) ความสูงเท่ากัน */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          gap: '16px',
          alignItems: 'stretch',
        }}
      >
        {/* 1. Top Faculty Chart (7 cols) */}
        <div
          style={{
            gridColumn: 'span 7',
            backgroundColor: '#ffffff',
            padding: '20px 22px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaChartBar style={{ color: '#10b981', fontSize: '16px' }} />
                  <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                    {currentRankOption.title}
                  </h4>
                </div>
                <p style={{ margin: '3px 0 0 24px', fontSize: '12px', color: '#64748b' }}>
                  เลือกดูการจัดอันดับตามประเภทผลงานหรืองบประมาณ (คลิกที่แท่งเพื่อดูรายการผลงาน)
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  backgroundColor: currentRankOption.bg,
                  color: currentRankOption.text,
                  fontWeight: 600,
                  border: `1px solid ${currentRankOption.border}`,
                  whiteSpace: 'nowrap',
                }}
              >
                {currentRankOption.badge}
              </span>
            </div>

            {/* ตัวเลือกประเภทการจัดอันดับ 10 อันดับสูงสุด (Pastel Filter Pills) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
                paddingLeft: '24px',
              }}
            >
              {TOP_RANK_OPTIONS.map((opt) => {
                const isSelected = topRankMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTopRankMode(opt.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: isSelected ? `1.5px solid ${opt.border}` : '1.5px solid #e2e8f0',
                      backgroundColor: isSelected ? opt.bg : '#f8fafc',
                      color: isSelected ? opt.text : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, border-color 0.15s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ height: '320px', position: 'relative', cursor: 'pointer' }}>
            <canvas id="c_top_faculty" />
          </div>
        </div>

        {/* 2. 5 Missions Ratio (5 cols) */}
        <div
          style={{
            gridColumn: 'span 5',
            backgroundColor: '#ffffff',
            padding: '20px 22px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaChartPie style={{ color: '#a78bfa', fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                  สัดส่วนผลงานตาม 5 พันธกิจหลัก
                </h4>
              </div>
              <p style={{ margin: '3px 0 0 24px', fontSize: '12px', color: '#64748b' }}>
                ภาพรวมการกระจายตัวของผลงานบุคลากรทั้งคณะในแต่ละพันธกิจ
              </p>
            </div>
            <span
              style={{
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '999px',
                backgroundColor: '#f5f3ff',
                color: '#6d28d9',
                fontWeight: 600,
                border: '1px solid #ddd6fe',
                whiteSpace: 'nowrap',
              }}
            >
              สัดส่วน 5 ด้าน
            </span>
          </div>
          <div style={{ height: '320px', position: 'relative', cursor: 'pointer' }}>
            <canvas id="c_mission_doughnut" />
          </div>
        </div>
      </div>

      {/* แถวที่ 2: ผลงานสะสมรวมเทียบจำนวนอาจารย์ตามภาควิชา (เต็มความกว้าง ทำให้อ่านชื่อภาควิชาและเปรียบเทียบแท่งคู่กับเส้นได้ชัดเจน) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '20px 24px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartBar style={{ color: '#38bdf8', fontSize: '16px' }} />
              <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a' }}>
                ผลงานสะสมรวมเทียบจำนวนอาจารย์ที่มีผลงานตามภาควิชาและหน่วยงาน
              </h4>
            </div>
            <p style={{ margin: '3px 0 0 24px', fontSize: '12px', color: '#64748b' }}>
              เปรียบเทียบปริมาณผลงานรวม (แท่งสีพาสเทล) กับจำนวนอาจารย์ผู้สร้างผลงาน (เส้นสีโรส) รายภาควิชา
            </p>
          </div>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '999px',
              backgroundColor: '#f0f9ff',
              color: '#0369a1',
              fontWeight: 600,
              border: '1px solid #bae6fd',
              whiteSpace: 'nowrap',
            }}
          >
            แท่งคู่กับเส้น
          </span>
        </div>
        <div style={{ height: '300px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_dept_faculty_works" />
        </div>
      </div>

      {/* DrillDown Drawer */}
      <DrillDownProjectDrawer
        isOpen={drillDown.isOpen}
        onClose={() => setDrillDown((prev) => ({ ...prev, isOpen: false }))}
        title={drillDown.title}
        subtitle={drillDown.subtitle}
        accentColor={drillDown.accentColor}
        items={drillDown.items}
        categoryKey={drillDown.categoryKey}
      />
    </div>
  );
}
