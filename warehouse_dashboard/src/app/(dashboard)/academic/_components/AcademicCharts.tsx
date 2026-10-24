'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartLine, FaChartPie, FaChartBar } from 'react-icons/fa';
import { AcademicItem } from '../_hooks/useAcademicData';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
import { DrillDownProjectDrawer } from '@/components/ui';

interface AcademicChartsProps {
  validData: AcademicItem[];
  totalAllocFaculty: number;
  totalAllocDept: number;
  totalAllocKu: number;
  totalAllocRemaining: number;
  onSelectClient?: (clientName: string) => void;
}

export function AcademicCharts({
  validData,
  totalAllocFaculty,
  totalAllocDept,
  totalAllocKu,
  totalAllocRemaining,
  onSelectClient,
}: AcademicChartsProps) {
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

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_ACA = '#1565c0';
    const ALLOC_COLORS = ['#0284c7', '#00A651', '#059669', '#6a1b9a'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.'];
    const monthlyCount = Array(M.length).fill(0);
    const monthlyBudget = Array(M.length).fill(0);
    const monthlyItems: AcademicItem[][] = Array.from({ length: M.length }, () => []);
    const clientGroups: Record<string, { name: string; budget: number; count: number; items: AcademicItem[] }> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : Number(item.budget) || 0;

      // Group by month
      const mStr = String(item.month || '').trim();
      const monthMap: Record<string, number> = {
        'ม.ค.': 0,
        'ก.พ.': 1,
        'มี.ค.': 2,
        'เม.ย.': 3,
        'พ.ค.': 4,
        'มิ.ย.': 5,
        'ก.ค.': 6,
        'ก.ย.': 7,
        'ต.ค.': 8,
        'พ.ย.': 9,
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
      };

      if (monthMap[mStr] !== undefined) {
        const idx = monthMap[mStr];
        monthlyCount[idx]++;
        monthlyBudget[idx] += budget / 1000000;
        monthlyItems[idx].push(item);
      }

      // Group by client
      let client = String(item.client || '').replace('\n', ' ').trim();
      if (!client || client === '-' || client === 'nan') client = 'หน่วยงานภายใน/อื่นๆ';
      if (!clientGroups[client]) {
        clientGroups[client] = { name: client, budget: 0, count: 0, items: [] };
      }
      clientGroups[client].budget += budget;
      clientGroups[client].count += 1;
      clientGroups[client].items.push(item);
    });

    const sortedClients = Object.values(clientGroups).sort((a, b) => b.budget - a.budget).slice(0, 6);
    const clientLabels = sortedClients.map((c) => (c.name.length > 34 ? c.name.slice(0, 34) + '…' : c.name));
    const clientData = sortedClients.map((c) => Number((c.budget / 1000000).toFixed(2)));

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Monthly count + budget combined or side-by-side with Rich Tooltips
    createChart('c_ac_cnt', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'จำนวนโครงการ',
            data: monthlyCount,
            borderColor: C_ACA,
            backgroundColor: 'rgba(21, 101, 192, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_ACA,
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
            const idx = hit.index;
            const list = monthlyItems[idx] || [];
            if (list.length > 0) {
              setDrillDown({
                isOpen: true,
                title: `โครงการพัฒนาวิชาการประจำเดือน ${M[idx]}`,
                subtitle: `รวม ${list.length} โครงการ • งบประมาณ ${monthlyBudget[idx].toFixed(2)} ล้านบาท`,
                accentColor: C_ACA,
                items: list,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: { align: 'top', anchor: 'end', color: C_ACA, font: { weight: 'bold' } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                return idx !== undefined ? formatTopItemsForTooltip(monthlyItems[idx], { maxItems: 3, showBudget: true }) : [];
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', ticks: { stepSize: 1 }, title: { display: true, text: 'จำนวนโครงการ' } },
        },
      },
    });

    // 2. Monthly budget
    createChart('c_ac_bud', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'ล้านบาท',
            data: monthlyBudget,
            borderColor: '#00A651',
            backgroundColor: 'rgba(0, 166, 81, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00A651',
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
            const idx = hit.index;
            const list = monthlyItems[idx] || [];
            if (list.length > 0) {
              setDrillDown({
                isOpen: true,
                title: `โครงการพัฒนาวิชาการประจำเดือน ${M[idx]}`,
                subtitle: `รวม ${list.length} โครงการ • งบประมาณ ${monthlyBudget[idx].toFixed(2)} ล้านบาท`,
                accentColor: C_ACA,
                items: list,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) => ` งบประมาณ: ${c.raw.toFixed(2)} ล้านบาท`,
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                return idx !== undefined ? formatTopItemsForTooltip(monthlyItems[idx], { maxItems: 3, showBudget: true }) : [];
              },
            },
          },
          datalabels: {
            align: 'top',
            anchor: 'end',
            color: '#00A651',
            font: { weight: 'bold' },
            formatter: (v: any) => (v > 0 ? v.toFixed(1) : ''),
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'ล้านบาท' } },
        },
      },
    });

    // 3. Real Allocation Doughnut from actual budget records
    const allocValues = [
      Number((totalAllocRemaining / 1000000).toFixed(2)),
      Number((totalAllocFaculty / 1000000).toFixed(2)),
      Number((totalAllocDept / 1000000).toFixed(2)),
      Number((totalAllocKu / 1000000).toFixed(2)),
    ];
    createChart('c_ac_alloc', {
      type: 'doughnut',
      data: {
        labels: ['งบดำเนินงานคงเหลือ (85%)', 'จัดสรรคณะ (5%)', 'จัดสรรภาควิชา (5%)', 'จัดสรรมก. (5%)'],
        datasets: [
          {
            data: allocValues.some((v) => v > 0) ? allocValues : [85, 5, 5, 5],
            backgroundColor: ALLOC_COLORS,
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
            const labels = ['งบดำเนินงานคงเหลือ (85%)', 'จัดสรรคณะ (5%)', 'จัดสรรภาควิชา (5%)', 'จัดสรรมก. (5%)'];
            setDrillDown({
              isOpen: true,
              title: `สัดส่วนการจัดสรรงบประมาณ: ${labels[hit.index] || ''}`,
              subtitle: `คำนวณจากโครงการพัฒนาวิชาการทั้งหมด ${validData.length} โครงการ`,
              accentColor: ALLOC_COLORS[hit.index] || C_ACA,
              items: validData,
            });
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number) => (v > 0 ? `${v}M` : ''),
          },
          legend: { position: 'bottom', labels: { padding: 8, font: { size: 11.5 } } },
          tooltip: {
            callbacks: {
              label: (c: any) => ` ${c.label}: ${c.raw.toFixed(2)} ล้านบาท`,
            },
          },
        },
      },
    });

    // 4. Client bar with Rich Tooltips + Click-to-Filter
    createChart('c_ac_client', {
      type: 'bar',
      data: {
        labels: clientLabels,
        datasets: [{ label: 'ล้านบาท', data: clientData, backgroundColor: C_ACA, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'y');
          if (hit) {
            const cl = sortedClients[hit.index];
            if (cl) {
              if (onSelectClient) onSelectClient(cl.name);
              setDrillDown({
                isOpen: true,
                title: `โครงการพัฒนาวิชาการ: ${cl.name}`,
                subtitle: `รวม ${cl.count} โครงการ • งบประมาณรวม ${cl.budget.toLocaleString('th-TH')} บาท`,
                accentColor: C_ACA,
                items: cl.items,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                return sortedClients[idx]?.name || items[0]?.label;
              },
              label: (c: any) => {
                const cl = sortedClients[c.dataIndex];
                return ` งบประมาณรวม: ${c.raw.toFixed(2)} ล้านบาท (${cl?.count || 0} โครงการ)`;
              },
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const cl = sortedClients[idx];
                return cl ? formatTopItemsForTooltip(cl.items, { maxItems: 3, showBudget: true }) : [];
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: '#1e293b',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number) => `${v.toFixed(2)}M`,
          },
        },
        scales: { x: { beginAtZero: true, grace: '25%', title: { display: true, text: 'ล้านบาท' } } },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, totalAllocFaculty, totalAllocDept, totalAllocKu, totalAllocRemaining, onSelectClient]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#1565c0' }} /> จำนวนโครงการพัฒนาวิชาการรายเดือน
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ac_cnt" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#00A651' }} /> งบประมาณโครงการพัฒนาวิชาการรายเดือน (ล้านบาท)
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ac_bud" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartPie style={{ color: '#1565c0' }} /> สัดส่วนการจัดสรรงบประมาณจริง (85% : 5% : 5% : 5%)
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ac_alloc" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#1565c0' }} /> หน่วยงานผู้ขอรับบริการหลัก (Top Clients)
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ac_client" />
          </div>
        </div>
      </div>

      <HybridSdgCard
        items={validData}
        categoryKey="academic"
        title="เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)"
      />

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
