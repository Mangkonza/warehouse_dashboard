'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import { ServiceItem } from '../_hooks/useServiceData';

interface ServiceChartsProps {
  validData: ServiceItem[];
}

export function ServiceCharts({ validData }: ServiceChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_SRV = '#ef6c00';
    const UI_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
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

    createChart('c_sv_monthly', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'จำนวนกิจกรรม',
            data: [47, 48, 54, 34, 36],
            borderColor: C_SRV,
            backgroundColor: 'rgba(239, 108, 0, .1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_SRV,
            pointRadius: 6,
            pointHoverRadius: 9,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวน' } } },
      },
    });

    createChart('c_sv_type_m', {
      type: 'bar',
      data: {
        labels: M,
        datasets: [
          { label: 'ผู้ทรงคุณวุฒิ', data: [18, 20, 25, 18, 19], backgroundColor: UI_PALETTE[0], borderRadius: 3 },
          { label: 'วิชาการ', data: [10, 10, 12, 6, 12], backgroundColor: UI_PALETTE[1], borderRadius: 3 },
          { label: 'วิทยากร', data: [8, 8, 10, 5, 9], backgroundColor: UI_PALETTE[2], borderRadius: 3 },
          { label: 'อื่นๆ', data: [11, 10, 7, 5, 6], backgroundColor: UI_PALETTE[3], borderRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { datalabels: stackedDatalabels as any, legend: { position: 'bottom', labels: { padding: 8 } } },
        scales: {
          y: { beginAtZero: true, grace: '20%', stacked: true, title: { display: true, text: 'จำนวน' } },
          x: { stacked: true },
        },
      },
    });

    createChart('c_sv_type', {
      type: 'bar',
      data: {
        labels: ['ผู้ทรงคุณวุฒิ', 'วิชาการ', 'วิทยากร', 'วิทยานิพนธ์ภายนอก', 'วิชาชีพ', 'ศึกษาดูงาน'],
        datasets: [{ label: 'จำนวน', data: [100, 50, 40, 25, 10, 4], backgroundColor: C_SRV, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวน' } } },
      },
    });

    createChart('c_sv_top', {
      type: 'bar',
      data: {
        labels: [
          'รศ.ดร.เบญญา กสานติกุล',
          'รศ.ดร.ชัยศรี สุขสาโรจน์',
          'ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์',
          'ผศ.ดร.เพ็ญพิชชา สนิทอินทร์',
          'รศ.ดร.บัญชา ขวัญยืน',
        ],
        datasets: [{ label: 'จำนวนครั้ง', data: [22, 18, 16, 14, 12], backgroundColor: C_SRV, borderRadius: 8 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, grace: '20%', title: { display: true, text: 'จำนวนครั้ง' } } },
      },
    });

    createChart('c_sv_dept', {
      type: 'pie',
      data: {
        labels: ['ชลประทาน', 'เครื่องกล', 'โยธา', 'เกษตร', 'การอาหาร', 'อื่นๆ'],
        datasets: [{ data: [70, 45, 35, 30, 25, 24], backgroundColor: UI_PALETTE.slice(0, 6) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { datalabels: pieDatalabels as any, legend: { position: 'bottom', labels: { padding: 8 } } },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [validData]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>
          <FaChartLine style={{ color: '#00914d' }} /> จำนวนกิจกรรมรายเดือน
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_sv_monthly" />
        </div>
      </div>
      <div className="chart-card">
        <h3>
          <FaChartBar style={{ color: '#00914d' }} /> ประเภทกิจกรรมรายเดือน
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_sv_type_m" />
        </div>
      </div>
      <div className="chart-card">
        <h3>
          <FaChartBar style={{ color: '#00914d' }} /> จำนวนกิจกรรมตามประเภท
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_sv_type" />
        </div>
      </div>
      <div className="chart-card">
        <h3>
          <FaChartBar style={{ color: '#00914d' }} /> Top 5 อาจารย์
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_sv_top" />
        </div>
      </div>
      <div className="chart-card">
        <h3>
          <FaChartPie style={{ color: '#00914d' }} /> สัดส่วนตามภาควิชา
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_sv_dept" />
        </div>
      </div>
    </div>
  );
}
