'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { KPIComputedResult } from '@/types/kpi';
import { CATEGORY_NAMES } from '../_hooks/useKpiData';
import { getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer } from '@/components/data-display';
import { CategoryKey } from '@/config/dataManagementConfig';
import { FaChartBar, FaBullseye } from 'react-icons/fa';

interface KpiChartsProps {
  computedKPIs: KPIComputedResult[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

type BarFilterMode = 'all' | 'need_attention' | 'achieved';

export function KpiCharts({
  computedKPIs,
  selectedCategory,
  onSelectCategory,
}: KpiChartsProps) {
  const chartInstances = useRef<Chart[]>([]);
  const [barFilterMode, setBarFilterMode] = useState<BarFilterMode>('all');
  const [drillDownItem, setDrillDownItem] = useState<KPIComputedResult | null>(null);

  const categoryStats = useMemo(() => {
    const order = ['research', 'academic', 'publications', 'service', 'ip', 'personnel', 'strategy'];
    const shortLabels: Record<string, string | string[]> = {
      research: 'โครงการวิจัย',
      academic: 'พัฒนาวิชาการ',
      publications: 'ผลงานตีพิมพ์',
      service: 'บริการวิชาการ',
      ip: 'ทรัพย์สินฯ',
      personnel: 'บุคลากร',
      strategy: ['ยุทธศาสตร์', 'คณะฯ'],
    };

    return order
      .map((catKey) => {
        const items = computedKPIs.filter((k) => k.kpi.category === catKey);
        const achieved = items.filter((k) => k.status === 'achieved').length;
        const onTrack = items.filter((k) => k.status === 'on_track').length;
        const needAttention = items.filter((k) => k.status === 'at_risk' || k.status === 'behind').length;
        const avgPct =
          items.length > 0
            ? Math.round(items.reduce((s, k) => s + Math.min(k.percentage, 100), 0) / items.length)
            : 0;

        return {
          key: catKey,
          label: shortLabels[catKey] || CATEGORY_NAMES[catKey as keyof typeof CATEGORY_NAMES] || catKey,
          fullName: CATEGORY_NAMES[catKey as keyof typeof CATEGORY_NAMES] || catKey,
          total: items.length,
          achieved,
          onTrack,
          needAttention,
          avgPct,
        };
      })
      .filter((c) => c.total > 0);
  }, [computedKPIs]);

  const displayedKpiBars = useMemo(() => {
    let list = [...computedKPIs];
    if (selectedCategory !== 'all') {
      list = list.filter((k) => k.kpi.category === selectedCategory);
    }
    if (barFilterMode === 'need_attention') {
      const att = list.filter((k) => k.status !== 'achieved');
      if (att.length > 0) list = att;
    } else if (barFilterMode === 'achieved') {
      const ach = list.filter((k) => k.status === 'achieved');
      if (ach.length > 0) list = ach;
    }

    // เรียงจากร้อยละน้อยไปมากในโหมดเฝ้าระวัง หรือมากไปน้อยในโหมดทั่วไป
    if (barFilterMode === 'need_attention') {
      list.sort((a, b) => a.percentage - b.percentage);
    } else {
      list.sort((a, b) => b.percentage - a.percentage);
    }
    return list.slice(0, 10);
  }, [computedKPIs, selectedCategory, barFilterMode]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const inst = new Chart(canvas, config);
        chartInstances.current.push(inst);
      }
    };

    // Chart 1: Category Stacked Bar + Average Achievement % Line (Dual-Axis Pastel)
    createChart('c_kpi_category_combo', {
      type: 'bar',
      data: {
        labels: categoryStats.map((c) => c.label),
        datasets: [
          {
            type: 'bar',
            label: 'บรรลุเป้าหมาย (ข้อ)',
            data: categoryStats.map((c) => c.achieved),
            backgroundColor: '#86EFAC',
            borderColor: '#34D399',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'kpi_cat',
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'bar',
            label: 'เป็นไปตามเป้า (ข้อ)',
            data: categoryStats.map((c) => c.onTrack),
            backgroundColor: '#93C5FD',
            borderColor: '#60A5FA',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'kpi_cat',
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'bar',
            label: 'เฝ้าระวัง/เร่งรัด (ข้อ)',
            data: categoryStats.map((c) => c.needAttention),
            backgroundColor: '#FDA4AF',
            borderColor: '#FB7185',
            borderWidth: 1,
            borderRadius: 4,
            stack: 'kpi_cat',
            yAxisID: 'y',
            order: 2,
          },
          {
            type: 'line',
            label: 'ความสำเร็จเฉลี่ย (%)',
            data: categoryStats.map((c) => c.avgPct),
            borderColor: '#A78BFA',
            backgroundColor: 'rgba(167, 139, 250, 0.16)',
            borderWidth: 2.5,
            pointBackgroundColor: '#7C3AED',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4.5,
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
        onHover: (event: any, chartElement: any[]) => {
          if (event.native?.target) {
            event.native.target.style.cursor = chartElement.length > 0 ? 'pointer' : 'default';
          }
        },
        onClick: (event: any, elements: any[], chart: any) => {
          const hit = getClickedChartElement(event, elements, chart, 'nearest');
          if (hit) {
            const targetCat = categoryStats[hit.index];
            if (targetCat) {
              onSelectCategory(selectedCategory === targetCat.key ? 'all' : targetCat.key);
            }
          }
        },
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            grace: '25%',
            position: 'left',
            title: { display: true, text: 'จำนวนตัวชี้วัด (ข้อ)' },
            ticks: { precision: 0 },
          },
          y1: {
            beginAtZero: true,
            max: 115,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'ความสำเร็จเฉลี่ย (%)', color: '#6D28D9' },
            ticks: {
              color: '#6D28D9',
              callback: (v: any) => (Number(v) <= 100 ? `${v}%` : ''),
            },
          },
          x: {
            stacked: true,
            grid: { display: false },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              font: { weight: 'bold', size: 11 },
            },
          },
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
          datalabels: {
            display: (ctx: any) => {
              const val = Number(ctx.dataset.data[ctx.dataIndex] || 0);
              return val > 0;
            },
            anchor: (ctx: any) => (ctx.datasetIndex === 3 ? 'end' : 'center'),
            align: (ctx: any) => (ctx.datasetIndex === 3 ? 'top' : 'center'),
            offset: (ctx: any) => (ctx.datasetIndex === 3 ? 4 : 0),
            color: (ctx: any) => (ctx.datasetIndex === 3 ? '#5B21B6' : '#1e293b'),
            backgroundColor: (ctx: any) =>
              ctx.datasetIndex === 3 ? 'rgba(245, 243, 255, 0.92)' : null,
            borderRadius: 4,
            padding: (ctx: any) =>
              ctx.datasetIndex === 3 ? { top: 1, bottom: 1, left: 4, right: 4 } : 0,
            font: { weight: 'bold', size: 10.5 },
            formatter: (v: number, ctx: any) => (ctx.datasetIndex === 3 ? `${v}%` : `${v}`),
          },
        },
      },
    });

    // Chart 2: Individual KPI Progress Bars (Capped at 100% visual, showing actual %)
    const barColors = displayedKpiBars.map((item) => {
      if (item.status === 'achieved') return '#86EFAC';
      if (item.status === 'on_track') return '#93C5FD';
      if (item.status === 'at_risk') return '#FDE68A';
      return '#FDA4AF';
    });
    const barBorders = displayedKpiBars.map((item) => {
      if (item.status === 'achieved') return '#34D399';
      if (item.status === 'on_track') return '#60A5FA';
      if (item.status === 'at_risk') return '#FBBF24';
      return '#FB7185';
    });

    createChart('c_kpi_achievement_bars', {
      type: 'bar',
      data: {
        labels: displayedKpiBars.map((item) => {
          const shortTitle =
            item.kpi.title.length > 26 ? `${item.kpi.title.slice(0, 26)}...` : item.kpi.title;
          return `${item.kpi.code}: ${shortTitle}`;
        }),
        datasets: [
          {
            label: 'ระดับความสำเร็จเทียบเป้าหมาย (%)',
            data: displayedKpiBars.map((item) => Math.min(item.percentage, 100)),
            backgroundColor: barColors,
            borderColor: barBorders,
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 22,
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
            const targetKpi = displayedKpiBars[hit.index];
            if (targetKpi && targetKpi.matchedProjects && targetKpi.matchedProjects.length > 0) {
              setDrillDownItem(targetKpi);
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 115,
            title: { display: true, text: 'ร้อยละความสำเร็จเทียบเกณฑ์เป้าหมาย (%)' },
            ticks: {
              callback: (v: any) => (Number(v) <= 100 ? `${v}%` : ''),
            },
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, weight: 600 },
              color: '#1e293b',
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items: any) => {
                const idx = items[0]?.dataIndex;
                const k = displayedKpiBars[idx];
                return k ? `${k.kpi.code}: ${k.kpi.title}` : '';
              },
              label: (ctx: any) => {
                const idx = ctx.dataIndex;
                const k = displayedKpiBars[idx];
                if (!k) return '';
                return ` ผลงานจริง: ${k.currentValue.toLocaleString('th-TH')} / เป้าหมาย ${k.targetValue.toLocaleString('th-TH')} ${k.kpi.unit} (${k.percentage}%)`;
              },
            },
          },
          datalabels: {
            anchor: 'end',
            align: 'right',
            offset: 4,
            color: '#0f172a',
            font: { weight: 'bold', size: 10.5 },
            formatter: (_v: number, ctx: any) => {
              const item = displayedKpiBars[ctx.dataIndex];
              return item ? `${item.percentage}%` : '';
            },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
      chartInstances.current = [];
    };
  }, [categoryStats, displayedKpiBars, selectedCategory]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
        gap: '16px',
        alignItems: 'stretch',
      }}
    >
      {/* Left Chart: Category Stacked Bar + Avg Score Line (6 cols) */}
      <div
        style={{
          gridColumn: 'span 6',
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
              <FaChartBar style={{ color: '#10b981', fontSize: '16px' }} />
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                ผลสัมฤทธิ์ตัวชี้วัดเทียบความสำเร็จเฉลี่ยรายหมวดยุทธศาสตร์
              </h4>
            </div>
            <p style={{ margin: '3px 0 0 24px', fontSize: '12px', color: '#64748b' }}>
              คลิกที่แท่งหมวดหมู่เพื่อกรองตัวชี้วัดด้านล่างเฉพาะหมวดนั้น
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
            แท่งซ้อนคู่กับเส้น
          </span>
        </div>
        <div style={{ height: '300px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_kpi_category_combo" />
        </div>
      </div>

      {/* Right Chart: Individual KPI Achievement Bars (6 cols) */}
      <div
        style={{
          gridColumn: 'span 6',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBullseye style={{ color: '#38bdf8', fontSize: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                  ระดับความสำเร็จเทียบเป้าหมายรายตัวชี้วัด (10 อันดับ)
                </h4>
              </div>
              <p style={{ margin: '3px 0 0 24px', fontSize: '12px', color: '#64748b' }}>
                เปรียบเทียบร้อยละความสำเร็จเทียบเกณฑ์ 100% (คลิกที่แท่งเพื่อดูรายการผลงานจริง)
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {[
                { id: 'all' as BarFilterMode, label: 'ทั้งหมด', bg: '#E0F2FE', border: '#93C5FD', text: '#075985' },
                { id: 'need_attention' as BarFilterMode, label: 'ต่ำกว่า 100%', bg: '#FFE4E6', border: '#FDA4AF', text: '#9F1239' },
                { id: 'achieved' as BarFilterMode, label: 'บรรลุเป้าแล้ว', bg: '#DCFCE7', border: '#86EFAC', text: '#166534' },
              ].map((tab) => {
                const isSel = barFilterMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBarFilterMode(tab.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: isSel ? `1.5px solid ${tab.border}` : '1.5px solid #e2e8f0',
                      backgroundColor: isSel ? tab.bg : '#f8fafc',
                      color: isSel ? tab.text : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ height: '300px', position: 'relative', cursor: 'pointer' }}>
          <canvas id="c_kpi_achievement_bars" />
        </div>
      </div>

      <DrillDownProjectDrawer
        isOpen={Boolean(drillDownItem)}
        onClose={() => setDrillDownItem(null)}
        title={drillDownItem ? `${drillDownItem.kpi.code}: ${drillDownItem.kpi.title}` : ''}
        subtitle={
          drillDownItem
            ? `ผลงานปัจจุบัน ${drillDownItem.currentValue.toLocaleString('th-TH')} / เป้าหมาย ${drillDownItem.targetValue.toLocaleString('th-TH')} ${drillDownItem.kpi.unit} (${drillDownItem.percentage}%)`
            : ''
        }
        accentColor={drillDownItem?.statusColor || '#34D399'}
        categoryKey={(drillDownItem?.kpi.datasetKey as CategoryKey) || 'research'}
        items={drillDownItem?.matchedProjects || drillDownItem?.details?.sampleMatches || []}
      />
    </div>
  );
}
