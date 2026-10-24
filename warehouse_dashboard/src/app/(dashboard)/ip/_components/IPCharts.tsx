'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { IPItem } from '../_hooks/useIPData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
import { DrillDownProjectDrawer } from '@/components/ui';

interface IPChartsProps {
  validIpData: IPItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectType?: (typeName: string) => void;
}

export function IPCharts({
  validIpData,
  onSelectDept,
  onSelectType,
}: IPChartsProps) {
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
    accentColor: '#6a1b9a',
    items: [],
  });

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const deptGroups: Record<string, { code: string; name: string; count: number; items: IPItem[] }> = {};
    const typeGroups: Record<string, { label: string; count: number; items: IPItem[]; color: string }> = {
      'อนุสิทธิบัตร': { label: 'อนุสิทธิบัตร', count: 0, items: [], color: '#6a1b9a' },
      'สิทธิบัตร': { label: 'สิทธิบัตรการประดิษฐ์', count: 0, items: [], color: '#00A651' },
    };

    validIpData.forEach((item) => {
      // Group by unique departments on this IP
      const rawParts = String(item.department || item.creator || '').split(',');
      const seenCodes = new Set<string>();
      rawParts.forEach((part) => {
        const d = getDepartment(part.trim());
        const code = d.code !== '-' ? d.code : 'OTH';
        if (!seenCodes.has(code)) {
          seenCodes.add(code);
          if (!deptGroups[code]) {
            deptGroups[code] = { code, name: d.name, count: 0, items: [] };
          }
          deptGroups[code].count += 1;
          deptGroups[code].items.push(item);
        }
      });

      const t = String(item.type || '');
      if (t.includes('อนุสิทธิบัตร')) {
        typeGroups['อนุสิทธิบัตร'].count += 1;
        typeGroups['อนุสิทธิบัตร'].items.push(item);
      } else {
        typeGroups['สิทธิบัตร'].count += 1;
        typeGroups['สิทธิบัตร'].items.push(item);
      }
    });

    const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);
    const activeTypes = Object.entries(typeGroups).filter(([, g]) => g.count > 0);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. IP by Department (100% live + Click to filter)
    createChart('c_ip_dept', {
      type: 'bar',
      data: {
        labels: sortedDepts.map((d) => d.code),
        datasets: [
          {
            label: 'จำนวนรายการ IP',
            data: sortedDepts.map((d) => d.count),
            backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
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
            const d = sortedDepts[hit.index];
            if (d) {
              if (onSelectDept) onSelectDept(d.code);
              setDrillDown({
                isOpen: true,
                title: `งานทรัพย์สินทางปัญญา: ภาควิชา${d.name} (${d.code})`,
                subtitle: `รวม ${d.count} รายการ`,
                accentColor: getDepartmentColor(d.code),
                items: d.items,
              });
            }
          }
        },
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#1e293b',
            font: { weight: 'bold' },
          },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? `${d.name} (${d.code})` : items[0]?.label;
              },
              label: (c: any) => ` จำนวน: ${c.raw} รายการ`,
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? formatTopItemsForTooltip(d.items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: '25%',
            ticks: { stepSize: 1 },
            title: { display: true, text: 'จำนวนรายการ' },
          },
          x: { grid: { display: false } },
        },
      },
    });

    // 2. IP by Type (100% live + Click to filter)
    createChart('c_ip_type', {
      type: 'doughnut',
      data: {
        labels: activeTypes.map(([, g]) => g.label),
        datasets: [
          {
            data: activeTypes.map(([, g]) => g.count),
            backgroundColor: activeTypes.map(([, g]) => g.color),
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
            const entry = activeTypes[hit.index];
            if (entry) {
              if (onSelectType) onSelectType(entry[0]);
              setDrillDown({
                isOpen: true,
                title: `งานทรัพย์สินทางปัญญาประเภท: ${entry[1].label}`,
                subtitle: `รวม ${entry[1].count} รายการ`,
                accentColor: entry[1].color,
                items: entry[1].items,
              });
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 12 },
            formatter: (v: number) => `${v} รายการ`,
          },
          legend: { position: 'bottom', labels: { padding: 10 } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const entry = activeTypes[idx];
                return entry ? formatTopItemsForTooltip(entry[1].items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validIpData, onSelectDept, onSelectType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ marginRight: 8, color: '#6a1b9a' }} /> จำนวนงานทรัพย์สินทางปัญญาตามภาควิชา
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ip_dept" />
          </div>
        </div>

        <div className="chart-card">
          <h3>
            <FaChartPie style={{ marginRight: 8, color: '#6a1b9a' }} /> สัดส่วนตามประเภททรัพย์สินทางปัญญา
          </h3>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_ip_type" />
          </div>
        </div>
      </div>

      <HybridSdgCard
        items={validIpData}
        categoryKey="ip"
        title="เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)"
      />

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
