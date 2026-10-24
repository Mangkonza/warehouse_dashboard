'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartBar } from 'react-icons/fa';

interface IPChartsProps {
  totalIpCount: number;
}

export function IPCharts({ totalIpCount }: IPChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_RES = '#006838';
    const C_PUB = '#8e24aa';
    const C_IP = '#d81b60';
    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.'];

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config);
        chartInstances.current.push(newChart);
      }
    };

    createChart('c_ip_monthly', {
      type: 'bar',
      data: {
        labels: M,
        datasets: [
          {
            label: 'จำนวน IP',
            data: [1, 0, 1, 0, 0],
            backgroundColor: C_IP,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grace: '20%',
            ticks: { stepSize: 1 },
            title: { display: true, text: 'จำนวน' },
          },
        },
      },
    });

    createChart('c_ip_compare', {
      type: 'bar',
      data: {
        labels: ['โครงการวิจัย', 'ผลงานตีพิมพ์ทางวิชาการ', 'งานทรัพย์สินทางปัญญา'],
        datasets: [
          {
            label: 'จำนวน',
            data: [10, 61, totalIpCount || 2],
            backgroundColor: [C_RES, C_PUB, C_IP],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grace: '20%',
            title: { display: true, text: 'จำนวน' },
          },
        },
      },
    });

    return () => {
      chartInstances.current.forEach((c) => c.destroy());
    };
  }, [totalIpCount]);

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <h3>
          <FaChartBar style={{ marginRight: 8, color: '#d81b60' }} /> จำนวน IP รายเดือน
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_ip_monthly" />
        </div>
      </div>
      <div className="chart-card">
        <h3>
          <FaChartBar style={{ marginRight: 8, color: '#006838' }} /> เปรียบเทียบ IP vs วิจัย vs ตีพิมพ์
        </h3>
        <div className="chart-wrapper">
          <canvas id="c_ip_compare" />
        </div>
      </div>
    </div>
  );
}
