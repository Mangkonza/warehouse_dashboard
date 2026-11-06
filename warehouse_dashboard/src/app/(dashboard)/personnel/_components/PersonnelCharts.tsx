'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import { PersonnelWorkMetric, DepartmentPersonnelStat } from '../_hooks/usePersonnelData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/ui';
import { CHART_PASTEL_PALETTE } from '@/lib/pastelTheme';
import { FaChartBar, FaChartPie } from 'react-icons/fa';

export type PersonnelPerspective = 'overview' | 'department' | 'table';

interface PersonnelChartsProps {
  metrics: PersonnelWorkMetric[];
  departmentStats: DepartmentPersonnelStat[];
  onSelectPerson?: (id: number) => void;
  activePerspective?: PersonnelPerspective;
}

export function PersonnelCharts({
  metrics,
  departmentStats,
  onSelectPerson,
  activePerspective = 'overview',
}: PersonnelChartsProps) {
  const router = useRouter();
  const [rankMetric, setRankMetric] = useState<'total' | 'research' | 'academic' | 'publications' | 'service' | 'ip'>('total');
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
    Chart.defaults.font.size = 13.5;
    Chart.defaults.color = '#0f172a';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    if (activePerspective === 'overview') {
      // 1. Top 10 Faculty by Selected Metric
      const sortedByWorks = [...metrics]
        .filter((m) => {
          if (rankMetric === 'total') return m.counts.total > 0;
          return m.counts[rankMetric] > 0;
        })
        .sort((a, b) => {
          if (rankMetric === 'total') return b.counts.total - a.counts.total;
          return b.counts[rankMetric] - a.counts[rankMetric] || b.counts.total - a.counts.total;
        })
        .slice(0, 10);

      const topNames = sortedByWorks.map((m) => m.cleanName || m.name);
      const topResearch = sortedByWorks.map((m) => m.counts.research);
      const topAcademic = sortedByWorks.map((m) => m.counts.academic);
      const topPub = sortedByWorks.map((m) => m.counts.publications);
      const topService = sortedByWorks.map((m) => m.counts.service);
      const topIP = sortedByWorks.map((m) => m.counts.ip);

      createChart('c_top_faculty', {
        type: 'bar',
        data: {
          labels: topNames,
          datasets: [
            {
              label: 'วิจัย',
              data: topResearch,
              backgroundColor: CHART_PASTEL_PALETTE.missions.research.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.research.border,
              borderWidth: 1,
            },
            {
              label: 'พัฒนาวิชาการ',
              data: topAcademic,
              backgroundColor: CHART_PASTEL_PALETTE.missions.academic.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.academic.border,
              borderWidth: 1,
            },
            {
              label: 'ตีพิมพ์',
              data: topPub,
              backgroundColor: CHART_PASTEL_PALETTE.missions.publications.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.publications.border,
              borderWidth: 1,
            },
            {
              label: 'ทรัพย์สินฯ',
              data: topIP,
              backgroundColor: CHART_PASTEL_PALETTE.missions.ip.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.ip.border,
              borderWidth: 1,
            },
            {
              label: 'บริการวิชาการ',
              data: topService,
              backgroundColor: CHART_PASTEL_PALETTE.missions.service.fill,
              borderColor: CHART_PASTEL_PALETTE.missions.service.border,
              borderWidth: 1,
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
                  subtitle: `สังกัด ${target.department} • รวม ${uniqueWorks.length} รายการ • งบโครงการ ${(target.budgets.total / 1000000).toFixed(2)} ล้านบาท`,
                  accentColor: CHART_PASTEL_PALETTE.missions.research.border,
                  items: uniqueWorks,
                });
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'จำนวนผลงานรวม (รายการ)', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 12.5 } },
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { size: 13, weight: 600 } },
            },
          },
          plugins: {
            legend: { position: 'top', labels: { boxWidth: 14, boxHeight: 14, font: { size: 13, weight: 600 }, padding: 12 } },
            datalabels: {
              display: (ctx: any) => {
                const val = ctx.dataset.data[ctx.dataIndex];
                return val >= 4;
              },
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 12 },
              formatter: (v: number) => v,
            },
          },
        },
      });
    }

    if (activePerspective === 'overview' || activePerspective === 'department') {
      // 2. Works Distribution by Department
      const sortedDepts = [...departmentStats]
        .filter((d) => d.totalWorks > 0)
        .slice(0, 8);

      const deptLabels = sortedDepts.map((d) => getDepartment(d.name).code);
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
                  title: `ผลงานสะสม: ${targetDept.name} (${getDepartment(targetDept.name).code})`,
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
              grid: { color: CHART_PASTEL_PALETTE.gridLines },
              title: { display: true, text: 'รายการผลงาน', font: { size: 13.5, weight: 700 } },
              ticks: { font: { size: 12.5 } },
            },
            x: {
              grid: { display: false },
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                font: { weight: 600, size: 13 },
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: (items: any) => {
                  const idx = items[0]?.dataIndex;
                  const d = sortedDepts[idx];
                  return d ? `${d.name} (${getDepartment(d.name).code})` : '';
                },
                label: (context: any) => {
                  const val = context.raw || 0;
                  const idx = context.dataIndex;
                  const d = sortedDepts[idx];
                  return ` ผลงานสะสม: ${val} รายการ (อาจารย์ ${d?.activeCount || 0} ท่าน)`;
                },
              },
            },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
            },
          },
        },
      });

      // 3. Doughnut of Works across the 5 Missions
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
        { label: 'โครงการวิจัย', cat: 'research', count: researchItemsAll.length, color: CHART_PASTEL_PALETTE.missions.research.fill, items: researchItemsAll },
        { label: 'โครงการพัฒนาวิชาการ', cat: 'academic', count: academicItemsAll.length, color: CHART_PASTEL_PALETTE.missions.academic.fill, items: academicItemsAll },
        { label: 'ผลงานตีพิมพ์ทางวิชาการ', cat: 'publications', count: pubItemsAll.length, color: CHART_PASTEL_PALETTE.missions.publications.fill, items: pubItemsAll },
        { label: 'งานทรัพย์สินทางปัญญา', cat: 'ip', count: ipItemsAll.length, color: CHART_PASTEL_PALETTE.missions.ip.fill, items: ipItemsAll },
        { label: 'งานบริการวิชาการ', cat: 'service', count: serviceItemsAll.length, color: CHART_PASTEL_PALETTE.missions.service.fill, items: serviceItemsAll },
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
            legend: { position: 'right', labels: { boxWidth: 14, font: { size: 13, weight: 600 }, padding: 12 } },
            datalabels: {
              color: CHART_PASTEL_PALETTE.datalabels.dark,
              font: { weight: 'bold', size: 13 },
              formatter: (v: number) => (v > 0 ? v : ''),
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];
    };
  }, [metrics, departmentStats, onSelectPerson, rankMetric, activePerspective]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {activePerspective === 'overview' && (
        <>
          {/* 1. Top Faculty Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaChartBar style={{ color: '#00A651', fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  10 อันดับอาจารย์ที่มีผลงานสูงสุด
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>จัดอันดับตาม:</span>
                <select
                  value={rankMetric}
                  onChange={(e) => setRankMetric(e.target.value as any)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    color: '#1e293b',
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="total">ผลงานรวม 5 ด้าน</option>
                  <option value="research">โครงการวิจัย</option>
                  <option value="academic">โครงการพัฒนาวิชาการ</option>
                  <option value="publications">ผลงานตีพิมพ์</option>
                  <option value="service">บริการวิชาการ</option>
                  <option value="ip">ทรัพย์สินทางปัญญา</option>
                </select>
              </div>
            </div>
            <div style={{ height: '420px', position: 'relative', cursor: 'pointer' }}>
              <canvas id="c_top_faculty" />
            </div>
          </div>

          {/* Row 2: Department and Missions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaChartBar style={{ color: '#0284c7', fontSize: '16px' }} />
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                    จำนวนผลงานรวมจำแนกตามสังกัด
                  </h4>
                </div>
              </div>
              <div style={{ height: '380px', position: 'relative', cursor: 'pointer' }}>
                <canvas id="c_dept_faculty_works" />
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '20px',
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
              <div style={{ height: '380px', position: 'relative', cursor: 'pointer' }}>
                <canvas id="c_mission_doughnut" />
              </div>
            </div>
          </div>
        </>
      )}

      {activePerspective === 'department' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaChartBar style={{ color: '#0284c7', fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  จำนวนผลงานรวมจำแนกตามสังกัด
                </h4>
              </div>
            </div>
            <div style={{ height: '420px', position: 'relative', cursor: 'pointer' }}>
              <canvas id="c_dept_faculty_works" />
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '20px',
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
            <div style={{ height: '420px', position: 'relative', cursor: 'pointer' }}>
              <canvas id="c_mission_doughnut" />
            </div>
          </div>
        </div>
      )}

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
