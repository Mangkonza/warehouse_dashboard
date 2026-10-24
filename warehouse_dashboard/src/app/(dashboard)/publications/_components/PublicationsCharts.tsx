'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartBar, FaChartLine, FaChartPie } from 'react-icons/fa';
import { PublicationItem } from '../_hooks/usePublicationsData';
import { getDepartment, getDepartmentColor } from '@/lib/departments';
import { JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { formatTopItemsForTooltip } from '@/lib/chartTooltipHelper';
import { HybridSdgCard } from '@/components/data-display';

interface PublicationsChartsProps {
  validData: PublicationItem[];
  onSelectDept?: (deptCode: string) => void;
  onSelectLevel?: (levelKey: string) => void;
}

export function PublicationsCharts({
  validData,
  onSelectDept,
  onSelectLevel,
}: PublicationsChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_PUB = '#2e7d32';
    const TIER_COLORS = [
      JOURNAL_TIER_STYLES['Scopus Q1'].text,
      JOURNAL_TIER_STYLES['Scopus Q2'].text,
      JOURNAL_TIER_STYLES['TCI 1'].text,
      '#d97706',
    ];

    const ALL_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const monthBuckets: Record<
      string,
      { q1: number; q2: number; tci: number; other: number; budget: number; items: PublicationItem[] }
    > = {};
    ALL_MONTHS.forEach((m) => {
      monthBuckets[m] = { q1: 0, q2: 0, tci: 0, other: 0, budget: 0, items: [] };
    });

    const tierGroups: Record<string, PublicationItem[]> = {
      Q1: [],
      Q2: [],
      TCI: [],
      เตรียมอนุสิทธิบัตร: [],
    };

    const deptGroups: Record<string, { code: string; name: string; count: number; items: PublicationItem[] }> = {};

    validData.forEach((item) => {
      const tier = String(item._detectedTier || '');
      const typ = String(item.type || '');
      const budget = Number(item.budget) || 0;
      const m = String(item.month || '').trim();

      let catKey: 'Q1' | 'Q2' | 'TCI' | 'เตรียมอนุสิทธิบัตร' = 'เตรียมอนุสิทธิบัตร';
      if (typ.includes('อนุสิทธิบัตร')) {
        catKey = 'เตรียมอนุสิทธิบัตร';
      } else if (tier === 'Scopus Q1') {
        catKey = 'Q1';
      } else if (tier.startsWith('Scopus')) {
        catKey = 'Q2';
      } else if (tier.startsWith('TCI')) {
        catKey = 'TCI';
      }

      tierGroups[catKey].push(item);

      if (monthBuckets[m]) {
        if (catKey === 'Q1') monthBuckets[m].q1++;
        else if (catKey === 'Q2') monthBuckets[m].q2++;
        else if (catKey === 'TCI') monthBuckets[m].tci++;
        else monthBuckets[m].other++;
        monthBuckets[m].budget += budget;
        monthBuckets[m].items.push(item);
      }

      const deptInfo = getDepartment(item.department);
      const deptCode = deptInfo.code !== '-' ? deptInfo.code : 'OTH';
      if (!deptGroups[deptCode]) {
        deptGroups[deptCode] = { code: deptCode, name: deptInfo.name, count: 0, items: [] };
      }
      deptGroups[deptCode].count += 1;
      deptGroups[deptCode].items.push(item);
    });

    const activeMonths = ALL_MONTHS.filter((m) => monthBuckets[m].items.length > 0);
    const M = activeMonths.length > 0 ? activeMonths : ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'];

    const sortedDepts = Object.values(deptGroups).sort((a, b) => b.count - a.count);

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Monthly stacked bar (100% live from validData)
    createChart('c_pub_monthly', {
      type: 'bar',
      data: {
        labels: M,
        datasets: [
          { label: 'Scopus Q1', data: M.map((m) => monthBuckets[m]?.q1 || 0), backgroundColor: TIER_COLORS[0], borderRadius: 4 },
          { label: 'Scopus Q2-Q4', data: M.map((m) => monthBuckets[m]?.q2 || 0), backgroundColor: TIER_COLORS[1], borderRadius: 4 },
          { label: 'TCI (ชาติ)', data: M.map((m) => monthBuckets[m]?.tci || 0), backgroundColor: TIER_COLORS[2], borderRadius: 4 },
          { label: 'เตรียมอนุสิทธิบัตร/อื่นๆ', data: M.map((m) => monthBuckets[m]?.other || 0), backgroundColor: TIER_COLORS[3], borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number) => (v > 0 ? v : ''),
          },
          legend: { position: 'bottom', labels: { padding: 10, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const m = items[0]?.label;
                return m && monthBuckets[m]
                  ? formatTopItemsForTooltip(monthBuckets[m].items, { maxItems: 3, showBudget: false })
                  : [];
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', stacked: true, title: { display: true, text: 'จำนวนเรื่อง' } },
          x: { stacked: true, grid: { display: false } },
        },
      },
    });

    // 2. Monthly grant line (100% live from validData)
    createChart('c_pub_bud', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'เงินสนับสนุน (บาท)',
            data: M.map((m) => monthBuckets[m]?.budget || 0),
            borderColor: C_PUB,
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_PUB,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) => ` เงินสนับสนุนรวม: ${(c.raw || 0).toLocaleString('th-TH')} บาท`,
              afterBody: (items: any) => {
                const m = items[0]?.label;
                return m && monthBuckets[m]
                  ? formatTopItemsForTooltip(monthBuckets[m].items, { maxItems: 3, showBudget: true })
                  : [];
              },
            },
          },
          datalabels: {
            align: 'top',
            anchor: 'end',
            color: C_PUB,
            font: { weight: 'bold' },
            formatter: (v: any) => (v > 0 ? v.toLocaleString('th-TH') : ''),
          },
        },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'บาท' } } },
      },
    });

    // 3. Level doughnut (100% live from validData + Click to filter)
    const tierKeys: ('Q1' | 'Q2' | 'TCI' | 'เตรียมอนุสิทธิบัตร')[] = ['Q1', 'Q2', 'TCI', 'เตรียมอนุสิทธิบัตร'];
    const tierLabels = ['Scopus Q1', 'Scopus Q2-Q4', 'TCI (ระดับชาติ)', 'เตรียมอนุสิทธิบัตร/อื่นๆ'];
    const tierCounts = tierKeys.map((k) => tierGroups[k].length);

    createChart('c_pub_level', {
      type: 'doughnut',
      data: {
        labels: tierLabels,
        datasets: [
          {
            data: tierCounts,
            backgroundColor: TIER_COLORS,
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_e: any, elements: any[]) => {
          if (elements.length > 0 && onSelectLevel) {
            const idx = elements[0].index;
            const filterMap = ['Q1', 'Q2', 'TCI', 'อนุสิทธิบัตร'];
            onSelectLevel(filterMap[idx] || 'all');
          }
        },
        plugins: {
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            formatter: (v: number, ctx: any) => {
              if (!v) return '';
              const sum = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const pct = ((v * 100) / (sum || 1)).toFixed(0);
              return `${v} (${pct}%)`;
            },
          },
          legend: { position: 'bottom', labels: { padding: 8, boxWidth: 12 } },
          tooltip: {
            callbacks: {
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const key = tierKeys[idx];
                return key ? formatTopItemsForTooltip(tierGroups[key], { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
      },
    });

    // 4. Dept bar (100% live from validData + Click to filter)
    createChart('c_pub_dept', {
      type: 'bar',
      data: {
        labels: sortedDepts.map((d) => d.code),
        datasets: [
          {
            label: 'จำนวนผลงานตีพิมพ์',
            data: sortedDepts.map((d) => d.count),
            backgroundColor: sortedDepts.map((d) => getDepartmentColor(d.code)),
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_e: any, elements: any[]) => {
          if (elements.length > 0 && onSelectDept) {
            const idx = elements[0].index;
            const d = sortedDepts[idx];
            if (d) onSelectDept(d.code);
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
              label: (c: any) => ` จำนวนผลงาน: ${c.raw} เรื่อง`,
              afterBody: (items: any) => {
                const idx = items[0]?.dataIndex;
                const d = sortedDepts[idx];
                return d ? formatTopItemsForTooltip(d.items, { maxItems: 3, showBudget: false }) : [];
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวนเรื่อง' } },
          x: { grid: { display: false } },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData, onSelectDept, onSelectLevel]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#2e7d32' }} /> จำนวนผลงานตีพิมพ์ทางวิชาการรายเดือน (แยกระดับคุณภาพ)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_monthly" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#2e7d32' }} /> เงินสนับสนุนการตีพิมพ์รายเดือน (บาท)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_bud" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>
              <FaChartPie style={{ color: '#2e7d32' }} /> สัดส่วนผลงานตามระดับฐานข้อมูลวารสาร
            </h3>
            <span style={{ fontSize: '11.5px', color: '#00A651', fontWeight: 600 }}>
              💡 คลิกส่วนกราฟเพื่อกรองระดับ
            </span>
          </div>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_pub_level" />
          </div>
        </div>
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0 }}>
              <FaChartBar style={{ color: '#2e7d32' }} /> จำนวนผลงานตีพิมพ์ตามภาควิชา
            </h3>
            <span style={{ fontSize: '11.5px', color: '#00A651', fontWeight: 600 }}>
              💡 คลิกแท่งกราฟเพื่อกรองภาควิชา
            </span>
          </div>
          <div className="chart-wrapper" style={{ cursor: 'pointer' }}>
            <canvas id="c_pub_dept" />
          </div>
        </div>
      </div>

      <HybridSdgCard
        items={validData}
        categoryKey="publications"
        title="การวิเคราะห์ผลงานตีพิมพ์ทางวิชาการตามเป้าหมายการพัฒนาที่ยั่งยืน (UN SDGs & UI GreenMetric)"
      />
    </div>
  );
}
