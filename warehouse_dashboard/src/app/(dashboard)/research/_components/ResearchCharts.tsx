'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useRouter } from 'next/navigation';
import {
  FaChartBar,
  FaChartPie,
  FaCoins,
  FaUserTie,
  FaBuilding,
  FaLeaf,
  FaChevronRight,
  FaLayerGroup,
} from 'react-icons/fa';
import { ResearchItem, normalizeFundSource } from '../_hooks/useResearchData';
import { getDepartment, getDepartmentColor, formatChartDeptLabel } from '@/lib/departments';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { StrategicAlignmentMatrix } from '@/components/data-display';
import { DrillDownProjectDrawer, DepartmentBadge } from '@/components/ui';

interface ResearchChartsProps {
  validData: ResearchItem[];
  selectedDept?: string;
  onSelectDept?: (deptCode: string) => void;
  selectedFund?: string;
  onSelectFund?: (fundName: string) => void;
}

export type ResearchPerspective = 'overview' | 'productivity' | 'faculty' | 'sdg';

export function ResearchCharts({
  validData,
  onSelectDept,
  onSelectFund,
}: ResearchChartsProps) {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = useState<ResearchPerspective>('overview');
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

  // Calculate faculty PI aggregation
  const facultyPiRanking = useMemo(() => {
    const map: Record<string, { head: string; head_id?: number | string; dept: string; count: number; totalBudget: number; extBudget: number; items: ResearchItem[] }> = {};
    validData.forEach((item) => {
      const headName = String(item.head || '').trim();
      if (!headName || headName === '-' || headName === 'nan') return;

      const key = item.head_id ? `id_${item.head_id}` : headName;
      if (!map[key]) {
        map[key] = {
          head: headName,
          head_id: item.head_id,
          dept: item.department || '-',
          count: 0,
          totalBudget: 0,
          extBudget: 0,
          items: [],
        };
      }
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

      map[key].count++;
      map[key].totalBudget += b;
      map[key].extBudget += external;
      map[key].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Calculate department comparative metrics
  const deptComparativeMetrics = useMemo(() => {
    const map: Record<string, { code: string; name: string; count: number; totalBudget: number; extBudget: number; intBudget: number; megaCount: number; items: ResearchItem[] }> = {};
    validData.forEach((item) => {
      const dInfo = getDepartment(item.department);
      const code = dInfo.code !== '-' ? dInfo.code : 'OTH';

      if (!map[code]) {
        map[code] = {
          code,
          name: dInfo.name,
          count: 0,
          totalBudget: 0,
          extBudget: 0,
          intBudget: 0,
          megaCount: 0,
          items: [],
        };
      }
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

      map[code].count++;
      map[code].totalBudget += b;
      map[code].extBudget += external;
      map[code].intBudget += internal;
      if (b >= 10000000) {
        map[code].megaCount++;
      }
      map[code].items.push(item);
    });

    return Object.values(map).sort((a, b) => b.totalBudget - a.totalBudget);
  }, [validData]);

  // Calculate project scale tiers
  const budgetScaleData = useMemo(() => {
    const tiers = [
      { key: 't1', label: '< 5 แสนบาท', min: 0, max: 500000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't2', label: '5 แสน - 1 ล้าน', min: 500000, max: 1000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't3', label: '1 - 5 ล้าน', min: 1000000, max: 5000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't4', label: '5 - 10 ล้าน', min: 5000000, max: 10000000, count: 0, total: 0, items: [] as ResearchItem[] },
      { key: 't5', label: '≥ 10 ล้านบาท', min: 10000000, max: Infinity, count: 0, total: 0, items: [] as ResearchItem[] },
    ];

    validData.forEach((item) => {
      const internal = Number(item.budget_internal) || 0;
      const external = Number(item.budget_external) || 0;
      const b = internal + external || Number(item.budget) || 0;

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

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const UI_PALETTE = ['#6EE7B7', '#7DD3FC', '#C4B5FD', '#FCD34D', '#FDA4AF', '#5EEAD4', '#CBD5E1'];

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    const grandTotalResearchBudget = validData.reduce(
      (s, i) => s + (Number(i.budget_internal) || 0) + (Number(i.budget_external) || 0) || Number(i.budget) || 0,
      0
    );

    if (activePerspective === 'overview') {
      // 1. Dept budget (External + Internal Stacked Bar) & Project Count (Line)
      const deptLabels = deptComparativeMetrics.map((d) => formatChartDeptLabel(d.code || d.name));
      const deptExtBudgetM = deptComparativeMetrics.map((d) => Number((d.extBudget / 1000000).toFixed(2)));
      const deptIntBudgetM = deptComparativeMetrics.map((d) => Number((d.intBudget / 1000000).toFixed(2)));
      const deptProjectCounts = deptComparativeMetrics.map((d) => d.count);

      createChart('c_re_dept', {
        type: 'bar',
        data: {
          labels: deptLabels,
          datasets: [
            {
              type: 'bar',
              label: 'งบทุนภายนอก (ล้านบาท)',
              data: deptExtBudgetM,
              backgroundColor: '#6EE7B7',
              borderRadius: 6,
              stack: 'res_budget',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'bar',
              label: 'งบทุนภายใน (ล้านบาท)',
              data: deptIntBudgetM,
              backgroundColor: '#93C5FD',
              borderRadius: 6,
              stack: 'res_budget',
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'จำนวนโครงการ (โครงการ)',
              data: deptProjectCounts,
              borderColor: '#C4B5FD',
              backgroundColor: 'rgba(196, 181, 253, 0.25)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointHoverRadius: 6,
              pointBackgroundColor: '#A78BFA',
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
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const d = deptComparativeMetrics[hit.index];
              if (d) {
                if (onSelectDept) onSelectDept(d.code);
                const pct = grandTotalResearchBudget > 0 ? ((d.totalBudget / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัย: ${d.name}`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${d.count} โครงการ • งบประมาณรวม ${d.totalBudget.toLocaleString('th-TH')} บาท`,
                  accentColor: getDepartmentColor(d.code),
                  items: d.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              anchor: (ctx: any) => (ctx.dataset.type === 'line' ? 'end' : 'center'),
              align: (ctx: any) => (ctx.dataset.type === 'line' ? 'top' : 'center'),
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#6d28d9' : '#1e293b'),
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${v} โครงการ`;
                return v >= 1 ? `${v.toFixed(1)}` : '';
              },
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              type: 'linear',
              position: 'left',
              stacked: true,
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'งบประมาณ (ล้านบาท)' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'จำนวนโครงการ' },
              grid: { drawOnChartArea: false },
            },
          },
        },
      });

      // 2. Fund source breakdown
      const fundMap: Record<string, { name: string; budget: number; count: number; items: ResearchItem[] }> = {};
      validData.forEach((item) => {
        let fName = normalizeFundSource(item.fund_source);
        if (!fundMap[fName]) fundMap[fName] = { name: fName, budget: 0, count: 0, items: [] };
        const b = (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0) || Number(item.budget) || 0;
        fundMap[fName].budget += b;
        fundMap[fName].count++;
        fundMap[fName].items.push(item);
      });
      const sortedFunds = Object.values(fundMap).sort((a, b) => b.budget - a.budget).slice(0, 7);

      createChart('c_re_fund', {
        type: 'doughnut',
        data: {
          labels: sortedFunds.map((f) => f.name),
          datasets: [
            {
              data: sortedFunds.map((f) => f.budget),
              backgroundColor: UI_PALETTE.slice(0, Math.max(sortedFunds.length, 1)),
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
              const f = sortedFunds[hit.index];
              if (f) {
                const pct = grandTotalResearchBudget > 0 ? ((f.budget / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัยจากแหล่งทุน: ${f.name}`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${f.count} โครงการ • งบประมาณรวม ${f.budget.toLocaleString('th-TH')} บาท`,
                  accentColor: UI_PALETTE[hit.index % UI_PALETTE.length],
                  items: f.items,
                });
              }
            }
          },
          plugins: {
            datalabels: {
              color: '#1e293b',
              font: { weight: 'bold', size: 11 },
              formatter: (value: number, context: any) => {
                const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const pct = (value * 100) / (sum || 1);
                return pct >= 6 ? `${pct.toFixed(0)}%` : '';
              },
            },
            legend: { position: 'right', labels: { padding: 10, boxWidth: 12, font: { size: 11.5 } } },
          },
        },
      });

      // 3. Project Budget Scale Tiers Combo Chart (Count Bar + Total Budget Line)
      createChart('c_re_scale', {
        type: 'bar',
        data: {
          labels: budgetScaleData.map((t) => t.label),
          datasets: [
            {
              type: 'bar',
              label: 'จำนวนโครงการ (โครงการ)',
              data: budgetScaleData.map((t) => t.count),
              backgroundColor: ['#93C5FD', '#6EE7B7', '#FDE68A', '#FDBA74', '#FDA4AF'],
              borderRadius: 8,
              yAxisID: 'y',
              order: 2,
            },
            {
              type: 'line',
              label: 'งบประมาณรวมในแต่ละช่วง (ล้านบาท)',
              data: budgetScaleData.map((t) => Number((t.total / 1000000).toFixed(2))),
              borderColor: '#C4B5FD',
              backgroundColor: 'rgba(196, 181, 253, 0.22)',
              borderWidth: 2.5,
              tension: 0.35,
              pointRadius: 4.5,
              pointBackgroundColor: '#A78BFA',
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
            if (event.native?.target) {
              event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
            }
          },
          onClick: (event: any, elements: any[], chart: any) => {
            const hit = getClickedChartElement(event, elements, chart, 'nearest');
            if (hit) {
              const tier = budgetScaleData[hit.index];
              if (tier) {
                const pct = grandTotalResearchBudget > 0 ? ((tier.total / grandTotalResearchBudget) * 100).toFixed(1) : '0';
                setDrillDown({
                  isOpen: true,
                  title: `โครงการวิจัย: ขนาดงบประมาณ ${tier.label}`,
                  subtitle: `สัดส่วน ${pct}% ของงบวิจัยทั้งหมด • รวม ${tier.count} โครงการ • งบประมาณรวม ${tier.total.toLocaleString('th-TH')} บาท`,
                  accentColor: '#7DD3FC',
                  items: tier.items,
                });
              }
            }
          },
          plugins: {
            legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
            datalabels: {
              anchor: 'end',
              align: 'top',
              color: (ctx: any) => (ctx.dataset.type === 'line' ? '#6d28d9' : '#0f172a'),
              font: { weight: 'bold', size: 10 },
              formatter: (v: number, ctx: any) => {
                if (v <= 0) return '';
                if (ctx.dataset.type === 'line') return `${v.toFixed(1)} ลบ.`;
                return `${v} โครงการ`;
              },
            },
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              grace: '20%',
              title: { display: true, text: 'จำนวนโครงการ' },
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              grace: '25%',
              title: { display: true, text: 'งบประมาณรวม (ล้านบาท)' },
              grid: { drawOnChartArea: false },
            },
            x: { grid: { display: false } },
          },
        },
      });

      // 4. External vs Internal Ratio
      const totalExt = validData.reduce((s, i) => s + (Number(i.budget_external) || 0), 0);
      const totalInt = validData.reduce((s, i) => s + (Number(i.budget_internal) || 0), 0);

      createChart('c_re_ext_int', {
        type: 'pie',
        data: {
          labels: ['งบทุนภายนอก', 'งบทุนภายใน'],
          datasets: [
            {
              data: [totalExt, totalInt],
              backgroundColor: ['#7DD3FC', '#6EE7B7'],
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
              const isExt = hit.index === 0;
              const items = validData.filter((i) =>
                isExt ? (Number(i.budget_external) || 0) > 0 : (Number(i.budget_internal) || 0) > 0
              );
              const totalExtInt = totalExt + totalInt || 1;
              const selBudget = isExt ? totalExt : totalInt;
              const pct = ((selBudget / totalExtInt) * 100).toFixed(1);
              setDrillDown({
                isOpen: true,
                title: isExt ? 'โครงการวิจัยที่ได้รับงบทุนภายนอก' : 'โครงการวิจัยที่ได้รับงบทุนภายใน',
                subtitle: `สัดส่วน ${pct}% ของงบประมาณรวม • รวม ${items.length} โครงการ • งบประมาณ ${selBudget.toLocaleString('th-TH')} บาท`,
                accentColor: isExt ? '#7DD3FC' : '#6EE7B7',
                items,
              });
            }
          },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11.5 } } },
            datalabels: {
              color: '#1e293b',
              font: { weight: 'bold', size: 12 },
              formatter: (v: number) => {
                const sum = totalExt + totalInt || 1;
                return `${((v / sum) * 100).toFixed(0)}%`;
              },
            },
          },
        },
      });
    }

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, activePerspective, deptComparativeMetrics, budgetScaleData, onSelectDept, onSelectFund]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      {/* Perspective Dimension Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', marginRight: '6px' }}>
          มิติการวิเคราะห์:
        </span>
        {[
          { id: 'overview', label: 'ภาพรวมงบประมาณและแหล่งทุน', icon: <FaCoins /> },
          { id: 'productivity', label: 'เปรียบเทียบผลผลิตรายภาควิชา', icon: <FaBuilding /> },
          { id: 'faculty', label: 'อาจารย์และหัวหน้าโครงการวิจัย', icon: <FaUserTie /> },
          { id: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์และเป้าหมายความยั่งยืน', icon: <FaLeaf /> },
        ].map((tab) => {
          const isSel = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePerspective(tab.id as ResearchPerspective)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1px solid #6ee7b7' : '1px solid #e2e8f0',
                backgroundColor: isSel ? '#d1fae5' : '#ffffff',
                color: isSel ? '#065f46' : '#475569',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '11.5px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DIMENSION 1: Overview & Funding & Scale */}
      {activePerspective === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-grid">
            <div className="chart-card">
              <h3>
                <FaChartBar style={{ color: '#34d399' }} /> งบประมาณและจำนวนโครงการวิจัยตามภาควิชา
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_dept" />
              </div>
            </div>

            <div className="chart-card">
              <h3>
                <FaChartPie style={{ color: '#34d399' }} /> สัดส่วนงบประมาณตามแหล่งทุนวิจัย
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_fund" />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            <div className="chart-card">
              <h3>
                <FaLayerGroup style={{ color: '#38bdf8' }} /> การกระจายโครงการตามช่วงขนาดงบประมาณ
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_scale" />
              </div>
            </div>

            <div className="chart-card">
              <h3>
                <FaCoins style={{ color: '#fbbf24' }} /> สัดส่วนงบทุนภายนอกเทียบกับทุนภายใน
              </h3>
              <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
                <canvas id="c_re_ext_int" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIMENSION 2: Department Comparative Output */}
      {activePerspective === 'productivity' && (
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              ตารางเปรียบเทียบผลผลิตและงบประมาณวิจัยรายภาควิชา
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              วิเคราะห์ผลิตภาพเฉลี่ยต่อโครงการ สัดส่วนทุนภายนอก และโครงการขนาดใหญ่ (≥ 10 ล้านบาท)
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table-emerald" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderBottom: '2px solid #a7f3d0' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ภาควิชา / หน่วยงาน</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณรวม</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบเฉลี่ย / โครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>ทุนภายนอก (สัดส่วน)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>โครงการขนาดใหญ่ (≥10 ลบ.)</th>
                </tr>
              </thead>
              <tbody>
                {deptComparativeMetrics.map((d) => {
                  const avgM = d.count > 0 ? (d.totalBudget / d.count / 1000000).toFixed(2) : '0.00';
                  const extPct = d.totalBudget > 0 ? Math.round((d.extBudget / d.totalBudget) * 100) : 0;
                  return (
                    <tr
                      key={d.code}
                      onClick={() => {
                        if (onSelectDept) onSelectDept(d.code);
                        setDrillDown({
                          isOpen: true,
                          title: `โครงการวิจัย: ${d.name} (${d.code})`,
                          subtitle: `รวม ${d.count} โครงการ • งบประมาณ ${d.totalBudget.toLocaleString('th-TH')} บาท`,
                          accentColor: getDepartmentColor(d.code),
                          items: d.items,
                        });
                      }}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: getDepartmentColor(d.code) }} />
                          <span>{d.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{d.count}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                        {(d.totalBudget / 1000000).toFixed(2)} ลบ.
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#475569' }}>
                        {avgM} ลบ.
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                        {(d.extBudget / 1000000).toFixed(2)} ลบ. ({extPct}%)
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {d.megaCount > 0 ? (
                          <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 700 }}>
                            {d.megaCount} โครงการ
                          </span>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIMENSION 3: Top Research Faculty & PIs */}
      {activePerspective === 'faculty' && (
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
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              จัดอันดับอาจารย์และหัวหน้าโครงการวิจัยยอดเยี่ยม
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
              รายละเอียดโครงการและแฟ้มผลงานอาจารย์รายบุคคล
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table-emerald" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderBottom: '2px solid #a7f3d0' }}>
                  <th style={{ padding: '10px 10px', textAlign: 'center', width: '50px' }}>อันดับ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>หัวหน้าโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left' }}>ภาควิชา</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>จำนวนโครงการ</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบประมาณวิจัยรวม</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>งบจากทุนภายนอก</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '120px' }}>แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {facultyPiRanking.map((f, idx) => (
                  <tr
                    key={idx}
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
                    <td style={{ padding: '10px 12px' }}>
                      <DepartmentBadge value={f.dept} />
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>
                      <span style={{ padding: '2px 8px', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#00A651' }}>
                        {f.count}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                      {(f.totalBudget / 1000000).toFixed(2)} ลบ.
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                      {(f.extBudget / 1000000).toFixed(2)} ลบ.
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
                          color: '#00A651',
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
      )}

      {/* DIMENSION 4: UN SDGs */}
      {activePerspective === 'sdg' && (
        <StrategicAlignmentMatrix
          items={validData}
          categoryKey="research"
          missionTitle="โครงการวิจัย"
          unitLabel="โครงการ"
          showBudget={true}
        />
      )}

      {/* Drill-down Drawer */}
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
