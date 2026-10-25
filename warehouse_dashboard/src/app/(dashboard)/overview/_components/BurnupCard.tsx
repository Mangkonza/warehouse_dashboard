'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { calculateBurnupTrajectory } from '../_services/burnupCalculations';
import { OverviewKpiScore } from '../_hooks/useOverviewData';
import { FaChartLine } from 'react-icons/fa';

interface BurnupCardProps {
  selectedKpi: OverviewKpiScore;
  onDrillDown?: (kpi: OverviewKpiScore) => void;
}

export const BurnupCard: React.FC<BurnupCardProps> = ({ selectedKpi, onDrillDown }) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !selectedKpi) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const burnup = calculateBurnupTrajectory(selectedKpi.actual, selectedKpi.target);

    Chart.register(ChartDataLabels);
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: burnup.months,
        datasets: [
          {
            label: 'ผลงานสะสมจริง (Actual)',
            data: burnup.actualCumulative,
            borderColor: '#00A651',
            backgroundColor: 'rgba(0, 166, 81, 0.1)',
            fill: true,
            borderWidth: 3,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: '#00A651',
          },
          {
            label: 'เส้นเป้าหมายตามเวลา (Target)',
            data: burnup.targetLine,
            borderColor: '#94a3b8',
            borderDash: [5, 5],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'คาดการณ์แนวโน้มสิ้นปี (Forecast)',
            data: burnup.forecastLine,
            borderColor: '#0284c7',
            borderDash: [3, 3],
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#0284c7',
            fill: false,
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
        onClick: () => {
          if (onDrillDown && selectedKpi) {
            onDrillDown(selectedKpi);
          }
        },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, padding: 12 } },
          datalabels: { display: false },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
            ticks: {
              callback: (v: any) => {
                if (selectedKpi.unit === 'บาท' && v >= 1000000) {
                  return `${(v / 1000000).toFixed(0)}M ฿`;
                }
                return v.toLocaleString();
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selectedKpi, onDrillDown]);

  return (
    <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaChartLine style={{ color: '#00A651' }} /> ผลงานสะสมเทียบเป้าหมาย (Burn-Up): {selectedKpi.title} ({selectedKpi.code})
        </h3>
        {onDrillDown && (
          <button
            type="button"
            onClick={() => onDrillDown(selectedKpi)}
            style={{
              padding: '4px 10px',
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
            <span>ดูรายการจริง ({selectedKpi.items?.length || 0})</span>
          </button>
        )}
      </div>

      <div style={{ height: '320px', width: '100%', position: 'relative', cursor: 'pointer' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
