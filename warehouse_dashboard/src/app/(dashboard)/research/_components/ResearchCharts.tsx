'use client';

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartBar, FaChartPie } from 'react-icons/fa';
import { ResearchItem } from '../_hooks/useResearchData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';
import { DrillDownProjectDrawer } from '@/components/ui';

interface ResearchChartsProps {
  validData: ResearchItem[];
  selectedDept?: string;
  onSelectDept?: (deptCode: string) => void;
  selectedFund?: string;
  onSelectFund?: (fundName: string) => void;
}

export function ResearchCharts({
  validData,
  onSelectDept,
  onSelectFund,
}: ResearchChartsProps) {
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

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const UI_PALETTE = ['#00A651', '#0284c7', '#6a1b9a', '#e65100', '#00838f', '#d97706', '#64748b'];

    const deptGroups: Record<string, { code: string; name: string; budget: number; count: number; items: ResearchItem[] }> = {};
    const fundGroups: Record<string, { name: string; budget: number; count: number; items: ResearchItem[] }> = {};

    validData.forEach((item) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
      const totalBudget = internal + external;

      // Group by dept code
      const deptInfo = getDepartment(item.department);
      const deptCode = deptInfo.code !== '-' ? deptInfo.code : 'OTH';
      if (!deptGroups[deptCode]) {
        deptGroups[deptCode] = { code: deptCode, name: deptInfo.name, budget: 0, count: 0, items: [] };
      }
      deptGroups[deptCode].budget += totalBudget;
      deptGroups[deptCode].count += 1;
      deptGroups[deptCode].items.push(item);

      // Group by fund
      let fund = String(item.fund_source || '').replace('\n', ' ').trim();
      if (fund === 'nan' || !fund || fund === '-') fund = 'ไม่ระบุแหล่งทุน';
      if (!fundGroups[fund]) {
        fundGroups[fund] = { name: fund, budget: 0, count: 0, items: [] };
      }
      fundGroups[fund].budget += totalBudget;
      fundGroups[fund].count += 1;
      fundGroups[fund].items.push(item);
    });

    const sortedDepts = Object.values(deptGroups).sort((a, b) => b.budget - a.budget);
    const deptLabels = sortedDepts.map((d) => d.code);
    const deptBudgetM = sortedDepts.map((d) => Number((d.budget / 1000000).toFixed(2)));
    const deptColors = deptLabels.map((code) => getDepartmentColor(code));

    const sortedFunds = Object.values(fundGroups).sort((a, b) => b.budget - a.budget).slice(0, 7);
    const fundLabels = sortedFunds.map((f) => f.name);
    const fundData = sortedFunds.map((f) => f.budget);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Dept budget & project count with Rich Tooltip + Click to filter
    createChart('c_re_dept', {
      type: 'bar',
      data: {
        labels: deptLabels,
        datasets: [
          {
            label: 'งบประมาณวิจัย (ล้านบาท)',
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
            const d = sortedDepts[hit.index];
            if (d) {
              if (onSelectDept) onSelectDept(d.code);
              setDrillDown({
                isOpen: true,
                title: `โครงการวิจัย: ภาควิชา${d.name} (${d.code})`,
                subtitle: `รวม ${d.count} โครงการ • งบประมาณรวม ${d.budget.toLocaleString('th-TH')} บาท`,
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
            align: 'right',
            color: '#1e293b',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number, ctx: any) => {
              const d = sortedDepts[ctx.dataIndex];
              return `${v.toFixed(2)} ลบ. (${d?.count || 0} โครงการ)`;
            },
          },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? `${d.name} (${d.code})` : items[0]?.label;
              },
              label: (c: any) => {
                const d = sortedDepts[c.dataIndex];
                return ` งบประมาณรวม: ${(d?.budget || 0).toLocaleString('th-TH')} บาท (${d?.count || 0} โครงการ)`;
              },
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? formatTopItemsForTooltip(d.items, { maxItems: 3, showBudget: true }) : [];
              },
            },
          },
        },
        scales: {
          x: { beginAtZero: true, grace: '28%', title: { display: true, text: 'ล้านบาท' } },
          y: { grid: { display: false } },
        },
      },
    });

    // 2. Fund source breakdown with Rich Tooltip + Click to filter
    createChart('c_re_fund', {
      type: 'doughnut',
      data: {
        labels: fundLabels.length > 0 ? fundLabels : ['ไม่มีข้อมูล'],
        datasets: [
          {
            data: fundData.length > 0 ? fundData : [1],
            backgroundColor: UI_PALETTE.slice(0, Math.max(fundLabels.length, 1)),
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
            const f = sortedFunds[hit.index];
            if (f) {
              if (onSelectFund) onSelectFund(f.name);
              setDrillDown({
                isOpen: true,
                title: `โครงการวิจัยตามแหล่งทุน: ${f.name}`,
                subtitle: `รวม ${f.count} โครงการ • งบประมาณรวม ${f.budget.toLocaleString('th-TH')} บาท`,
                accentColor: UI_PALETTE[hit.index % UI_PALETTE.length] || '#00A651',
                items: f.items,
              });
            }
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (value: number, context: any) => {
              if (!value) return '';
              const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const pct = (value * 100) / (sum || 1);
              if (pct < 6) return '';
              return `${pct.toFixed(0)}%`;
            },
          },
          legend: { position: 'right', labels: { padding: 10, boxWidth: 12, font: { size: 11.5 } } },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                const f = sortedFunds[c.dataIndex];
                return ` ${c.label}: ${(c.raw || 0).toLocaleString('th-TH')} บาท (${f?.count || 0} โครงการ)`;
              },
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const f = sortedFunds[idx];
                return f ? formatTopItemsForTooltip(f.items, { maxItems: 3, showBudget: true }) : [];
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, onSelectDept, onSelectFund]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#00A651' }} /> งบประมาณและจำนวนโครงการวิจัยตามภาควิชา
          </h3>
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

      <HybridSdgCard
        items={validData}
        categoryKey="research"
        title="เป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs)"
      />

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
