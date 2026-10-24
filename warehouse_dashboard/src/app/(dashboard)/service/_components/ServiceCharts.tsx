'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
import { DrillDownProjectDrawer } from '@/components/ui';

interface ServiceChartsProps {
  validData: ServiceItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
  onSelectPerson?: (personName: string) => void;
}

export function ServiceCharts({
  validData,
  onSelectDept,
  onSelectType,
  onSelectPerson,
}: ServiceChartsProps) {
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
    accentColor: '#e65100',
    items: [],
  });

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_SRV = '#e65100';
    const TYPE_COLOR_MAP: Record<string, string> = {
      'ผู้ทรงคุณวุฒิ': '#d97706',
      'วิชาการ': '#059669',
      'วิทยากร/อาจารย์พิเศษ': '#2563eb',
      'วิทยานิพนธ์ภายนอก': '#0d9488',
      'วิชาชีพ': '#7c3aed',
      'ศึกษาดูงาน วศ.กพส.': '#e11d48',
    };

    const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthBuckets: Record<
      number,
      { total: number; byType: Record<string, number>; items: ServiceItem[] }
    > = {};
    for (let i = 0; i < 12; i++) {
      monthBuckets[i] = { total: 0, byType: {}, items: [] };
    }

    const typeGroups: Record<string, { name: string; count: number; items: ServiceItem[] }> = {};
    const personGroups: Record<string, { name: string; count: number; items: ServiceItem[] }> = {};
    const deptGroups: Record<string, { code: string; name: string; count: number; items: ServiceItem[] }> = {};

    validData.forEach((item) => {
      const t = item._resolvedType || item.service_type || 'วิชาการ';
      if (!typeGroups[t]) typeGroups[t] = { name: t, count: 0, items: [] };
      typeGroups[t].count += 1;
      typeGroups[t].items.push(item);

      const p = String(item.person || '').replace(/\s+/g, ' ').trim();
      if (p && p !== 'nan' && p !== '-') {
        if (!personGroups[p]) personGroups[p] = { name: p, count: 0, items: [] };
        personGroups[p].count += 1;
        personGroups[p].items.push(item);
      }

      const deptInfo = getDepartment(item.department);
      const deptCode = deptInfo.code !== '-' ? deptInfo.code : 'OTH';
      if (!deptGroups[deptCode]) {
        deptGroups[deptCode] = { code: deptCode, name: deptInfo.name, count: 0, items: [] };
      }
      deptGroups[deptCode].count += 1;
      deptGroups[deptCode].items.push(item);

      // Parse month from item.date
      const dStr = String(item.date || '').trim();
      const isoMatch = dStr.match(/^\d{4}-(\d{1,2})/);
      if (isoMatch) {
        const mIdx = parseInt(isoMatch[1], 10) - 1;
        if (mIdx >= 0 && mIdx < 12) {
          monthBuckets[mIdx].total += 1;
          monthBuckets[mIdx].byType[t] = (monthBuckets[mIdx].byType[t] || 0) + 1;
          monthBuckets[mIdx].items.push(item);
        }
      }
    });

    const activeMonthIndices = Object.keys(monthBuckets)
      .map(Number)
      .filter((idx) => monthBuckets[idx].total > 0);
    const M_INDICES = activeMonthIndices.length > 0 ? activeMonthIndices : [0, 1, 2, 3, 4];
    const M_LABELS = M_INDICES.map((idx) => THAI_MONTHS[idx]);

    const sortedTypes = Object.values(typeGroups).sort((a, b) => b.count - a.count);
    const sortedPersons = Object.values(personGroups).sort((a, b) => b.count - a.count).slice(0, 6);
    const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Monthly activity line (100% live)
    createChart('c_sv_monthly', {
      type: 'line',
      data: {
        labels: M_LABELS,
        datasets: [
          {
            label: 'จำนวนกิจกรรม',
            data: M_INDICES.map((idx) => monthBuckets[idx].total),
            borderColor: C_SRV,
            backgroundColor: 'rgba(230, 81, 0, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_SRV,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'x');
          if (hit) {
            const mIdx = M_INDICES[hit.index];
            const bucket = mIdx !== undefined ? monthBuckets[mIdx] : undefined;
            if (bucket && bucket.items.length > 0) {
              setDrillDown({
                isOpen: true,
                title: `งานบริการวิชาการประจำเดือน ${M_LABELS[hit.index]}`,
                subtitle: `รวม ${bucket.items.length} กิจกรรม`,
                accentColor: C_SRV,
                items: bucket.items,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { align: 'top', anchor: 'end', color: C_SRV, font: { weight: 'bold' } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const i = items[0]?.dataIndex;
                const mIdx = M_INDICES[i];
                return mIdx !== undefined
                  ? formatTopItemsForTooltip(monthBuckets[mIdx].items, { maxItems: 3, showBudget: false })
                  : [];
              },
            },
          },
        },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวนครั้ง' } } },
      },
    });

    // 2. Service Type Breakdown Bar (100% live + Click to filter)
    createChart('c_sv_type', {
      type: 'bar',
      data: {
        labels: sortedTypes.map((t) => t.name),
        datasets: [
          {
            label: 'จำนวนกิจกรรม',
            data: sortedTypes.map((t) => t.count),
            backgroundColor: sortedTypes.map((t) => TYPE_COLOR_MAP[t.name] || C_SRV),
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'x');
          if (hit) {
            const t = sortedTypes[hit.index];
            if (t) {
              if (onSelectType) onSelectType(t.name);
              setDrillDown({
                isOpen: true,
                title: `งานบริการวิชาการประเภท: ${t.name}`,
                subtitle: `รวม ${t.count} กิจกรรม`,
                accentColor: TYPE_COLOR_MAP[t.name] || C_SRV,
                items: t.items,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { anchor: 'end', align: 'top', color: '#1e293b', font: { weight: 'bold' } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const t = sortedTypes[idx];
                return t ? formatTopItemsForTooltip(t.items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวนครั้ง' } },
          x: { grid: { display: false } },
        },
      },
    });

    // 3. Top Faculty Contributors (100% live + Click to filter)
    createChart('c_sv_top', {
      type: 'bar',
      data: {
        labels: sortedPersons.map((p) => p.name),
        datasets: [
          {
            label: 'จำนวนครั้ง',
            data: sortedPersons.map((p) => p.count),
            backgroundColor: '#00A651',
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
            const p = sortedPersons[hit.index];
            if (p) {
              if (onSelectPerson) onSelectPerson(p.name);
              setDrillDown({
                isOpen: true,
                title: `งานบริการวิชาการของ: ${p.name}`,
                subtitle: `รวม ${p.count} กิจกรรม`,
                accentColor: '#00A651',
                items: p.items,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { anchor: 'end', align: 'right', color: '#1e293b', font: { weight: 'bold' } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const p = sortedPersons[idx];
                return p ? formatTopItemsForTooltip(p.items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
        scales: {
          x: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวนครั้ง' } },
          y: { grid: { display: false } },
        },
      },
    });

    // 4. Department Share (100% live + Click to filter)
    createChart('c_sv_dept', {
      type: 'doughnut',
      data: {
        labels: sortedDepts.map((d) => d.code),
        datasets: [
          {
            data: sortedDepts.map((d) => d.count),
            backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const d = sortedDepts[hit.index];
            if (d) {
              if (onSelectDept) onSelectDept(d.code);
              setDrillDown({
                isOpen: true,
                title: `งานบริการวิชาการ: ภาควิชา${d.name} (${d.code})`,
                subtitle: `รวม ${d.count} กิจกรรม`,
                accentColor: getDepartmentColor(d.code),
                items: d.items,
              });
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number, ctx: any) => {
              if (!v) return '';
              const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const pct = (v * 100) / (sum || 1);
              return pct >= 6 ? `${v} (${pct.toFixed(0)}%)` : '';
            },
          },
          legend: { position: 'right', labels: { padding: 8, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? `${d.name} (${d.code})` : items[0]?.label;
              },
              label: (c: any) => ` จำนวนกิจกรรม: ${c.raw} ครั้ง`,
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? formatTopItemsForTooltip(d.items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, onSelectDept, onSelectType, onSelectPerson]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#e65100' }} /> จำนวนงานบริการวิชาการรายเดือน
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_sv_monthly" />
          </div>
        </div>

        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#e65100' }} /> จำแนกตามประเภทงานบริการวิชาการ
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_sv_type" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#00A651' }} /> บุคลากรที่ให้บริการวิชาการสูงสุด (Top Contributors)
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_sv_top" />
          </div>
        </div>

        <div className="chart-card">
          <h3>
            <FaChartPie style={{ color: '#e65100' }} /> สัดส่วนงานบริการวิชาการตามภาควิชา/ศูนย์ฯ
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_sv_dept" />
          </div>
        </div>
      </div>

      <HybridSdgCard
        items={validData}
        categoryKey="service"
        title="เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)"
      />

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
