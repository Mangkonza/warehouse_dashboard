'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartLine, FaChartPie, FaChartBar, FaGlobe } from 'react-icons/fa';
import { AcademicItem } from '../_hooks/useAcademicData';

interface AcademicChartsProps {
  validData: AcademicItem[];
}

export function AcademicCharts({ validData }: AcademicChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_ACA = '#1565c0';
    const UI_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.'];
    const monthlyCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const monthlyBudget = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const clientBudget: Record<string, number> = {};

    validData.forEach((item) => {
      const budget = typeof item.budget === 'number' ? item.budget : 0;

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
      }

      // Group by client
      let client = String(item.client || '').replace('\n', ' ').trim();
      if (!client || client === '-' || client === 'nan') client = 'หน่วยงานภายใน/อื่นๆ';
      clientBudget[client] = (clientBudget[client] || 0) + budget / 1000000;
    });

    // Top 5 clients
    const sortedClients = Object.entries(clientBudget).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const clientLabels = sortedClients.map((c) => c[0]);
    const clientData = sortedClients.map((c) => c[1]);

    const pieDatalabels = {
      color: '#fff',
      anchor: 'center' as const,
      align: 'center' as const,
      textStrokeColor: 'rgba(0,0,0,0.6)',
      textStrokeWidth: 2,
      font: { weight: 'bold' as const, size: 12 },
      formatter: (value: any, context: any) => {
        if (value === 0) return '';
        const sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
        const p = ((value * 100) / sum).toFixed(1) + '%';
        return value.toLocaleString('en-US') + '\n(' + p + ')';
      },
      textAlign: 'center' as const,
    };

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Monthly count
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
        plugins: {
          legend: { display: false },
          datalabels: { align: 'top', anchor: 'end', color: C_ACA, font: { weight: 'bold' } },
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
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + ' ล้านบาท' } },
          datalabels: {
            align: 'top',
            anchor: 'end',
            color: C_ACA,
            font: { weight: 'bold' },
            formatter: (v: any) => (v > 0 ? v.toFixed(1) : ''),
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'ล้านบาท' } },
        },
      },
    });

    // 3. Allocation doughnut
    createChart('c_ac_alloc', {
      type: 'doughnut',
      data: {
        labels: ['โครงการ (70%)', 'ค่าอำนวยการ (15%)', 'คณะ (5%)', 'ภาควิชา (5%)', 'มก. (5%)'],
        datasets: [{ data: [70, 15, 5, 5, 5], backgroundColor: UI_PALETTE.slice(0, 5) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: pieDatalabels as any,
          legend: { position: 'bottom', labels: { padding: 8 } },
        },
      },
    });

    // 4. Client bar
    createChart('c_ac_client', {
      type: 'bar',
      data: { labels: clientLabels, datasets: [{ label: 'ล้านบาท', data: clientData, backgroundColor: C_ACA, borderRadius: 8 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + ' ล้านบาท' } },
          datalabels: { display: false },
        },
        scales: { x: { beginAtZero: true, grace: '20%', title: { display: true, text: 'ล้านบาท' } } },
      },
    });

    // 5. Diverging SDG
    const sdgLabels = ['SDG 6', 'SDG 9', 'SDG 13', 'SDG 2', 'SDG 8'];
    const rawSDGCount = [4, 5, 3, 2, 1];
    const rawSDGBudget = [50.39, 16.27, 43.53, 6.88, 1.63];

    const maxBudget = Math.max(...rawSDGBudget);
    const maxCount = Math.max(...rawSDGCount);
    const scaleRatio = maxBudget / maxCount;
    const scaledCountData = rawSDGCount.map((v) => -(v * scaleRatio));

    createChart('c_ac_sdg_combined', {
      type: 'bar',
      data: {
        labels: sdgLabels,
        datasets: [
          {
            label: 'งบประมาณ (ล้านบาท)',
            data: rawSDGBudget.map((v) => -v),
            backgroundColor: '#f4511e',
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'จำนวนโครงการ',
            data: scaledCountData.map((v) => Math.abs(v)),
            backgroundColor: '#1565c0',
            borderRadius: 4,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                if (c.datasetIndex === 1) return 'จำนวนโครงการ: ' + rawSDGCount[c.dataIndex] + ' โครงการ';
                return 'งบประมาณ: ' + rawSDGBudget[c.dataIndex].toFixed(2) + ' ล้านบาท';
              },
            },
          },
          datalabels: {
            color: '#424242',
            font: { weight: 'bold', size: 11 },
            anchor: (c: any) => (c.datasetIndex === 0 ? 'start' : 'end'),
            align: (c: any) => (c.datasetIndex === 0 ? 'left' : 'right'),
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 1) return rawSDGCount[c.dataIndex] + ' โครงการ';
              return rawSDGBudget[c.dataIndex].toFixed(2) + ' ลบ.';
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { display: false },
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: '← งบประมาณ (ล้านบาท) | จำนวนโครงการ →', font: { weight: 'bold' }, padding: 10 },
          },
          y: {
            stacked: true,
            ticks: { font: { weight: 'bold' } },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData]);

  return (
    <>
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#1565c0' }} /> จำนวนโครงการรายเดือน (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ac_cnt" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#1565c0' }} /> งบประมาณรายเดือน (ล้านบาท) (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ac_bud" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartPie style={{ color: '#1565c0' }} /> สัดส่วนการจัดสรรงบ
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ac_alloc" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#1565c0' }} /> Top ผู้ขอรับบริการ
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ac_client" />
          </div>
        </div>
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3>
            <FaGlobe style={{ color: '#1565c0' }} /> จำนวนและงบประมาณตาม SDGs (Diverging Chart)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ac_sdg_combined" />
          </div>
        </div>
      </div>
    </>
  );
}
