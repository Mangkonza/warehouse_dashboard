'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaChartLine, FaChartBar, FaChartPie, FaGlobe } from 'react-icons/fa';
import { ResearchItem } from '../_hooks/useResearchData';

interface ResearchChartsProps {
  validData: ResearchItem[];
}

export function ResearchCharts({ validData }: ResearchChartsProps) {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((c) => c.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#0f172a';

    const C_RES = '#006838';
    const UI_PALETTE = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926'];

    const M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.'];
    const monthMatchers = [
      ['-01-', 'ม.ค.', 'มกราคม', '1/2568'],
      ['-02-', 'ก.พ.', 'กุมภาพันธ์', '2/2568'],
      ['-03-', 'มี.ค.', 'มีนาคม', '3/2568'],
      ['-04-', 'เม.ย.', 'เมษายน', '4/2568'],
      ['-05-', 'พ.ค.', 'พฤษภาคม', '5/2568'],
      ['-06-', 'มิ.ย.', 'มิถุนายน', '6/2568'],
      ['-07-', 'ก.ค.', 'กรกฎาคม', '7/2568'],
    ];

    const monthlyCount = [0, 0, 0, 0, 0, 0, 0];
    const monthlyBudget = [0, 0, 0, 0, 0, 0, 0];
    const deptBudget: Record<string, number> = {};
    const fundBudget: Record<string, number> = {};

    validData.forEach((item) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : Number(item.budget_internal) || 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : Number(item.budget_external) || 0;
      const totalBudget = internal + external;

      // Group by month
      const dateStr = String(item.start_date || item.id || '').toLowerCase();
      for (let i = 0; i < M.length; i++) {
        if (monthMatchers[i].some((m) => dateStr.includes(m))) {
          monthlyCount[i]++;
          monthlyBudget[i] += totalBudget / 1000000;
          break;
        }
      }

      // Group by dept
      let dept = String(item.department || '').replace('ภาควิชา\n', '').replace('ภาควิชา', '').trim();
      if (dept === 'nan' || !dept || dept === '-') dept = 'อื่นๆ';
      deptBudget[dept] = (deptBudget[dept] || 0) + totalBudget / 1000000;

      // Group by fund
      let fund = String(item.fund_source || '').replace('\n', ' ').trim();
      if (fund === 'nan' || !fund || fund === '-') fund = 'อื่นๆ';
      fundBudget[fund] = (fundBudget[fund] || 0) + totalBudget;
    });

    const deptLabels = Object.keys(deptBudget);
    const deptData = Object.values(deptBudget);

    const sortedFunds = Object.entries(fundBudget).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const fundLabels = sortedFunds.map((f) => f[0]);
    const fundData = sortedFunds.map((f) => f[1]);

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
    createChart('c_re_cnt', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'จำนวนโครงการ',
            data: monthlyCount,
            borderColor: C_RES,
            backgroundColor: 'rgba(0, 104, 56, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_RES,
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
          datalabels: { align: 'top', anchor: 'end', color: C_RES, font: { weight: 'bold' } },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', ticks: { stepSize: 1 }, title: { display: true, text: 'จำนวนโครงการ' } },
        },
      },
    });

    // 2. Monthly budget
    createChart('c_re_bud', {
      type: 'line',
      data: {
        labels: M,
        datasets: [
          {
            label: 'ล้านบาท',
            data: monthlyBudget,
            borderColor: C_RES,
            backgroundColor: 'rgba(0, 104, 56, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: C_RES,
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
            color: C_RES,
            font: { weight: 'bold' },
            formatter: (v: any) => (v > 0 ? v.toFixed(1) : ''),
          },
        },
        scales: {
          y: { beginAtZero: true, grace: '20%', title: { display: true, text: 'ล้านบาท' } },
        },
      },
    });

    // 3. Dept budget
    createChart('c_re_dept', {
      type: 'bar',
      data: { labels: deptLabels, datasets: [{ label: 'ล้านบาท', data: deptData, backgroundColor: C_RES, borderRadius: 8 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + ' ล้านบาท' } } },
        scales: { x: { beginAtZero: true, grace: '20%', title: { display: true, text: 'ล้านบาท' } } },
      },
    });

    // 4. Fund doughnut
    createChart('c_re_fund', {
      type: 'doughnut',
      data: {
        labels: fundLabels.length > 0 ? fundLabels : ['ไม่มีข้อมูล'],
        datasets: [{ data: fundData.length > 0 ? fundData : [1], backgroundColor: UI_PALETTE.slice(0, fundLabels.length) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: pieDatalabels as any,
          legend: { position: 'bottom', labels: { padding: 8 } },
          tooltip: { callbacks: { label: (c: any) => c.label + ': ฿' + c.raw.toLocaleString() } },
        },
      },
    });

    // 5. Diverging SDG
    const sdgLabels = ['SDG 6 น้ำสะอาด', 'SDG 9 นวัตกรรม', 'SDG 13 สภาพภูมิอากาศ', 'SDG 2 อาหาร', 'SDG 8 เศรษฐกิจ'];
    const sdgColors = ['#26bde2', '#fd6925', '#3f7e44', '#dda63a', '#a21942'];
    const rawSDGCount = [4, 5, 3, 2, 1];
    const rawSDGBudget = [50.39, 16.27, 43.53, 6.88, 1.63];

    const maxBudget = Math.max(...rawSDGBudget);
    const maxCount = Math.max(...rawSDGCount);
    const scaleRatio = maxBudget / maxCount;
    const scaledCountData = rawSDGCount.map((v) => -(v * scaleRatio));

    createChart('c_re_sdg_combined', {
      type: 'bar',
      data: {
        labels: sdgLabels,
        datasets: [
          {
            label: 'จำนวนโครงการ',
            data: scaledCountData,
            backgroundColor: sdgColors,
            borderRadius: 4,
            barPercentage: 0.7,
          },
          {
            label: 'งบประมาณ (ล้านบาท)',
            data: rawSDGBudget,
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
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                if (c.datasetIndex === 0) return 'จำนวนโครงการ: ' + rawSDGCount[c.dataIndex] + ' โครงการ';
                return 'งบประมาณ: ' + c.raw.toFixed(2) + ' ล้านบาท';
              },
            },
          },
          datalabels: {
            color: '#424242',
            font: { weight: 'bold', size: 11 },
            anchor: (c: any) => (c.datasetIndex === 0 ? 'start' : 'end'),
            align: (c: any) => (c.datasetIndex === 0 ? 'left' : 'right'),
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 0) return rawSDGCount[c.dataIndex] + ' โครงการ';
              return rawSDGBudget[c.dataIndex].toFixed(2) + ' ลบ.';
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { display: false },
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: '← จำนวนโครงการ | งบประมาณ (ล้านบาท) →', font: { weight: 'bold' }, padding: 10 },
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
            <FaChartLine style={{ color: '#00914d' }} /> จำนวนโครงการวิจัยรายเดือน (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_re_cnt" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartLine style={{ color: '#00914d' }} /> งบประมาณวิจัยรายเดือน (ล้านบาท) (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_re_bud" />
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ color: '#00914d' }} /> งบประมาณตามภาควิชา (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_re_dept" />
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartPie style={{ color: '#00914d' }} /> สัดส่วนแหล่งทุนวิจัย (ข้อมูลจริง)
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_re_fund" />
          </div>
        </div>

        <div className="chart-card chart-full">
          <h3>
            <FaGlobe style={{ color: '#00914d' }} /> การกระจายและงบประมาณตาม SDGs
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_re_sdg_combined" />
          </div>
        </div>
      </div>
    </>
  );
}
