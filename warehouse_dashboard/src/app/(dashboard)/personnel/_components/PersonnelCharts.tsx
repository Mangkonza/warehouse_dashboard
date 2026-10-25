'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import { PersonnelWorkMetric, DepartmentPersonnelStat } from '../_hooks/usePersonnelData';
import { getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/ui';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

interface PersonnelChartsProps {
  metrics: PersonnelWorkMetric[];
  departmentStats: DepartmentPersonnelStat[];
  onSelectPerson?: (id: number) => void;
}

export function PersonnelCharts({ metrics, departmentStats, onSelectPerson }: PersonnelChartsProps) {
  const router = useRouter();
  const chartInstances = useRef<Chart[]>([]);
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

    // 1. Top 10 Faculty by Combined Works
    const sortedByWorks = [...metrics]
      .filter((m) => m.counts.total > 0)
      .sort((a, b) => b.counts.total - a.counts.total)
      .slice(0, 10);

    const topNames = sortedByWorks.map((m) => m.cleanName || m.name);
    const topResearch = sortedByWorks.map((m) => m.counts.research);
    const topAcademic = sortedByWorks.map((m) => m.counts.academic);
    const topPub = sortedByWorks.map((m) => m.counts.publications);
    const topService = sortedByWorks.map((m) => m.counts.service);
    const topIP = sortedByWorks.map((m) => m.counts.ip);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // Chart 1: Top 10 Faculty Stacked Bar
    createChart('c_top_faculty', {
      type: 'bar',
      data: {
        labels: topNames,
        datasets: [
          {
            label: 'วิจัย',
            data: topResearch,
            backgroundColor: '#00A651',
          },
          {
            label: 'พัฒนาวิชาการ',
            data: topAcademic,
            backgroundColor: '#0284c7',
          },
          {
            label: 'ตีพิมพ์',
            data: topPub,
            backgroundColor: '#e11d48',
          },
          {
            label: 'ทรัพย์สินฯ',
            data: topIP,
            backgroundColor: '#7c3aed',
          },
          {
            label: 'บริการวิชาการ',
            data: topService,
            backgroundColor: '#d97706',
          },
        ],
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
              const allWorks = [
                ...target.researchItems.map((it) => ({ ...it, _category: 'research' })),
                ...target.academicItems.map((it) => ({ ...it, _category: 'academic' })),
                ...target.pubItems.map((it) => ({ ...it, _category: 'publications' })),
                ...target.ipItems.map((it) => ({ ...it, _category: 'ip' })),
                ...target.serviceItems.map((it) => ({ ...it, _category: 'service' })),
              ];
              const seen = new Set<string>();
              const uniqueWorks = allWorks.filter((it) => {
                const k = `${it._category}_${it._id || it.id || it.name || it.title || ''}`;
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
              });
              setDrillDown({
                isOpen: true,
                title: `ผลงานสะสม: ${target.name}`,
                subtitle: `ภาควิชา ${target.department} • รวม ${uniqueWorks.length} รายการ • งบโครงการ ${(target.budgets.total / 1000000).toFixed(2)} ล้านบาท`,
                accentColor: '#00A651',
                items: uniqueWorks,
              });
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            title: { display: true, text: 'จำนวนผลงานรวม (รายการ)' },
          },
          y: {
            stacked: true,
            grid: { display: false },
          },
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
          datalabels: {
            display: (ctx: any) => {
              const val = ctx.dataset.data[ctx.dataIndex];
              return val >= 4;
            },
            color: '#ffffff',
            font: { weight: 'bold', size: 10 },
            formatter: (v: number) => v,
          },
        },
      },
    });

    // Chart 2: Works Distribution by Department
    const sortedDepts = [...departmentStats]
      .filter((d) => d.totalWorks > 0)
      .slice(0, 8);

    const deptLabels = sortedDepts.map((d) => d.name.replace('ภาควิชาวิศวกรรม', 'วศ.'));
    const deptWorks = sortedDepts.map((d) => d.totalWorks);
    const deptColors = sortedDepts.map((d) => getDepartmentColor(d.name));

    createChart('c_dept_faculty_works', {
      type: 'bar',
      data: {
        labels: deptLabels,
        datasets: [
          {
            label: 'ผลงานสะสม (รายการ)',
            data: deptWorks,
            backgroundColor: deptColors,
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
            const targetDept = sortedDepts[hit.index];
            if (targetDept) {
              const deptFaculty = metrics.filter((m) => m.department === targetDept.name);
              const deptWorks = deptFaculty.flatMap((m) => [
                ...m.researchItems.map((it) => ({ ...it, _category: 'research' })),
                ...m.academicItems.map((it) => ({ ...it, _category: 'academic' })),
                ...m.pubItems.map((it) => ({ ...it, _category: 'publications' })),
                ...m.ipItems.map((it) => ({ ...it, _category: 'ip' })),
                ...m.serviceItems.map((it) => ({ ...it, _category: 'service' })),
              ]);
              const seenWorks = new Set<string>();
              const uniqueDeptWorks = deptWorks.filter((it) => {
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
          y: { beginAtZero: true, title: { display: true, text: 'รายการผลงาน' } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#1e293b',
            font: { weight: 'bold', size: 11 },
          },
        },
      },
    });

    // Chart 3: Doughnut of Works across the 5 Missions
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
      { label: 'โครงการวิจัย', cat: 'research', count: researchItemsAll.length, color: '#00A651', items: researchItemsAll },
      { label: 'โครงการพัฒนาวิชาการ', cat: 'academic', count: academicItemsAll.length, color: '#0284c7', items: academicItemsAll },
      { label: 'ผลงานตีพิมพ์ทางวิชาการ', cat: 'publications', count: pubItemsAll.length, color: '#e11d48', items: pubItemsAll },
      { label: 'งานทรัพย์สินทางปัญญา', cat: 'ip', count: ipItemsAll.length, color: '#7c3aed', items: ipItemsAll },
      { label: 'งานบริการวิชาการ', cat: 'service', count: serviceItemsAll.length, color: '#d97706', items: serviceItemsAll },
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
            color: '#ffffff',
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
  }, [metrics, departmentStats, onSelectPerson]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
      {/* 1. Top Faculty Chart */}
      <div
        style={{
          gridColumn: 'span 2',
          backgroundColor: '#ffffff',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChartBar style={{ color: '#00A651', fontSize: '16px' }} />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              10 อันดับอาจารย์ที่มีผลงานสะสมสูงสุด (จำแนกตาม 5 พันธกิจ)
            </h4>
          </div>
        </div>
        <div style={{ height: '320px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_top_faculty" />
        </div>
      </div>

      {/* 2. Department Works Distribution */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChartBar style={{ color: '#0284c7', fontSize: '16px' }} />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              จำนวนผลงานรวมจำแนกตามภาควิชา
            </h4>
          </div>
        </div>
        <div style={{ height: '260px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_dept_faculty_works" />
        </div>
      </div>

      {/* 3. 5 Missions Ratio */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaChartPie style={{ color: '#7c3aed', fontSize: '16px' }} />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              สัดส่วนผลงานตาม 5 พันธกิจหลัก
            </h4>
          </div>
        </div>
        <div style={{ height: '260px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_mission_doughnut" />
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
