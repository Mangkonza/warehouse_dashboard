'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartBar, FaChartLine, FaChartPie, FaGlobe } from 'react-icons/fa';
import { PublicationItem } from '../_hooks/usePublicationsData';

interface PublicationsChartsProps {
  validData: PublicationItem[];
}

export function PublicationsCharts({ validData }: PublicationsChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_PUB = '#8e24aa';
    const UI_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'];

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

    const stackedDatalabels = {
      color: '#fff',
      anchor: 'center' as const,
      align: 'center' as const,
      textStrokeColor: 'rgba(0,0,0,0.5)',
      textStrokeWidth: 2,
      formatter: (value: any) => (value === 0 ? '' : value),
    };

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    // 1. Monthly stacked bar
    createChart('c_pub_monthly', {
      type: 'bar',
      data: {
        labels: M,
        datasets: [
          { label: 'Q1', data: [3, 0, 4, 5, 4], backgroundColor: UI_PALETTE[0], borderRadius: 4 },
          { label: 'Q2', data: [3, 0, 2, 4, 1], backgroundColor: UI_PALETTE[1], borderRadius: 4 },
          { label: 'TCI', data: [2, 0, 1, 2, 0], backgroundColor: UI_PALETTE[2], borderRadius: 4 },
          { label: 'เตรียมตีพิมพ์', data: [8, 0, 3, 2, 6], backgroundColor: UI_PALETTE[3], borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { datalabels: stackedDatalabels as any, legend: { position: 'bottom', labels: { padding: 10 } } },
        scales: {
          y: { beginAtZero: true, grace: '20%', stacked: true, title: { display: true, text: 'จำนวน' } },
          x: { stacked: true },
        },
      },
    });

    // 2. Monthly grant line
    createChart('c_pub_bud', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'เงินสนับสนุน (บาท)',
            data: [54133, 0, 87666, 150714, 44047],
            borderColor: C_PUB,
            backgroundColor: 'rgba(142, 36, 170, 0.1)',
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
          tooltip: { callbacks: { label: (c: any) => '฿' + c.raw.toLocaleString() } },
          datalabels: {
            align: 'top',
            anchor: 'end',
            color: C_PUB,
            font: { weight: 'bold' },
            formatter: (v: any) => (v > 0 ? v.toLocaleString() : ''),
          },
        },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'บาท' } } },
      },
    });

    // 3. Level pie
    createChart('c_pub_level', {
      type: 'pie',
      data: { labels: ['Q1', 'Q2', 'TCI1', 'เตรียมตีพิมพ์'], datasets: [{ data: [22, 14, 10, 15], backgroundColor: UI_PALETTE.slice(0, 4) }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { datalabels: pieDatalabels as any, legend: { position: 'bottom', labels: { padding: 8 } } },
      },
    });

    // 4. Dept bar
    createChart('c_pub_dept', {
      type: 'bar',
      data: {
        labels: ['ชลประทาน', 'โยธา', 'เกษตร', 'อุตสาหการ', 'เครื่องกล', 'การอาหาร', 'คอมพิวเตอร์'],
        datasets: [{ label: 'จำนวนผลงาน', data: [16, 12, 10, 8, 6, 5, 4], backgroundColor: C_PUB, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวน' } } },
      },
    });

    // 5. Diverging SDG
    const sdgLabels = ['SDG 9', 'SDG 2', 'SDG 6', 'SDG 11', 'SDG 13', 'SDG 12', 'SDG 15'];
    const sdgColors = ['#fd6925', '#dda63a', '#26bde2', '#fd9d24', '#3f7e44', '#bf8b2e', '#56c02b'];
    const rawQ1 = [10, 5, 4, 4, 3, 0, 1];
    const rawTotal = [22, 12, 10, 8, 5, 3, 1];

    const maxTotal = Math.max(...rawTotal);
    const maxQ1 = Math.max(...rawQ1);
    const scaleRatio = maxTotal / (maxQ1 === 0 ? 1 : maxQ1);
    const scaledQ1Data = rawQ1.map((v) => -(v * scaleRatio));

    createChart('c_pub_sdg_q1', {
      type: 'bar',
      data: {
        labels: sdgLabels,
        datasets: [
          {
            label: 'จำนวน Q1',
            data: scaledQ1Data,
            backgroundColor: sdgColors,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'จำนวนผลงานทั้งหมด',
            data: rawTotal,
            backgroundColor: sdgColors,
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
                if (c.datasetIndex === 0) return 'จำนวน Q1: ' + rawQ1[c.dataIndex] + ' ผลงาน';
                return 'จำนวนทั้งหมด: ' + rawTotal[c.dataIndex] + ' ผลงาน';
              },
            },
          },
          datalabels: {
            color: '#424242',
            font: { weight: 'bold', size: 11 },
            anchor: (c: any) => (c.datasetIndex === 0 ? 'start' : 'end'),
            align: (c: any) => (c.datasetIndex === 0 ? 'left' : 'right'),
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 0) return rawQ1[c.dataIndex] > 0 ? rawQ1[c.dataIndex] : '';
              return rawTotal[c.dataIndex] > 0 ? rawTotal[c.dataIndex] : '';
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { display: false },
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: '← จำนวน Q1 | จำนวนผลงานทั้งหมด →', font: { weight: 'bold' }, padding: 10 },
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
            <FaChartBar style={{ color: '#00914d' }} /> จำนวนผลงานตีพิมพ์ทางวิชาการรายเดือน (แยกระดับ)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_monthly" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#00914d' }} /> เงินสนับสนุนรายเดือน (บาท)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_bud" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartPie style={{ color: '#00914d' }} /> สัดส่วนผลงานตามระดับ
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_level" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#00914d' }} /> จำนวนผลงานตามภาควิชา
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_dept" />
          </div>
        </div>
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3>
            <FaGlobe style={{ color: '#00914d' }} /> เปรียบเทียบจำนวนผลงานทั้งหมดและ Q1 ตาม SDGs
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_pub_sdg_q1" />
          </div>
        </div>
      </div>
    </>
  );
}
