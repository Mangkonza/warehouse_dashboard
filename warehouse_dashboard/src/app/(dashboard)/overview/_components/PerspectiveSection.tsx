'use client';

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MOCK_YOY_FUNDING, MOCK_PUB_QUARTILE_TRENDS } from '../_constants/mockHistoricalData';
import { detectSDGsFromText, SDG_MASTER } from '@/lib/sdgEngine';
import { FaCoins, FaAward, FaTasks, FaLeaf } from 'react-icons/fa';

export type StrategicPerspective = 'funding' | 'quality' | 'projects' | 'sdg';

interface PerspectiveSectionProps {
  departmentStats: { code: string; name: string; budget: number; pubs: number; services: number; researchCount: number }[];
  validResearch: any[];
}

export const PerspectiveSection: React.FC<PerspectiveSectionProps> = ({
  departmentStats,
  validResearch,
}) => {
  const [activePerspective, setActivePerspective] = useState<StrategicPerspective>('funding');

  const chartFundingTreemap = useRef<Chart | null>(null);
  const chartFundingYoy = useRef<Chart | null>(null);
  const chartPubQuartile = useRef<Chart | null>(null);
  const chartSdg17 = useRef<Chart | null>(null);

  const canvasFundingTreemap = useRef<HTMLCanvasElement | null>(null);
  const canvasFundingYoy = useRef<HTMLCanvasElement | null>(null);
  const canvasPubQuartile = useRef<HTMLCanvasElement | null>(null);
  const canvasSdg17 = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Cleanup any existing
    if (chartFundingTreemap.current) { chartFundingTreemap.current.destroy(); chartFundingTreemap.current = null; }
    if (chartFundingYoy.current) { chartFundingYoy.current.destroy(); chartFundingYoy.current = null; }
    if (chartPubQuartile.current) { chartPubQuartile.current.destroy(); chartPubQuartile.current = null; }
    if (chartSdg17.current) { chartSdg17.current.destroy(); chartSdg17.current = null; }

    Chart.register(ChartDataLabels);

    if (activePerspective === 'funding') {
      if (canvasFundingTreemap.current) {
        chartFundingTreemap.current = new Chart(canvasFundingTreemap.current, {
          type: 'bar',
          data: {
            labels: departmentStats.map((d) => `${d.code} (${d.name})`),
            datasets: [
              {
                label: 'งบวิจัย (ล้านบาท)',
                data: departmentStats.map((d) => Number((d.budget / 1000000).toFixed(2))),
                backgroundColor: departmentStats.map((d) => (d.code === 'IRE' ? '#006838' : '#0284c7')),
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: (v: any) => `${v}M`,
                font: { weight: 'bold' },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
            },
          },
        });
      }

      if (canvasFundingYoy.current) {
        chartFundingYoy.current = new Chart(canvasFundingYoy.current, {
          type: 'line',
          data: {
            labels: MOCK_YOY_FUNDING.months,
            datasets: [
              {
                label: 'ปีงบประมาณ 2568 (ปีปัจจุบัน)',
                data: MOCK_YOY_FUNDING.currentYear2568 as any,
                borderColor: '#00A651',
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 4,
              },
              {
                label: 'ปีงบประมาณ 2567 (ปีก่อน)',
                data: MOCK_YOY_FUNDING.prevYear2567 as any,
                borderColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [4, 4],
                tension: 0.35,
                pointRadius: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' }, datalabels: { display: false } },
            scales: {
              y: {
                ticks: { callback: (v: any) => `${v}M ฿` },
                grid: { color: 'rgba(226, 232, 240, 0.6)' },
              },
            },
          },
        });
      }
    } else if (activePerspective === 'quality') {
      if (canvasPubQuartile.current) {
        chartPubQuartile.current = new Chart(canvasPubQuartile.current, {
          type: 'bar',
          data: {
            labels: MOCK_PUB_QUARTILE_TRENDS.labels,
            datasets: [
              { label: 'Q1 (Top Tier)', data: MOCK_PUB_QUARTILE_TRENDS.q1, backgroundColor: '#006838', borderRadius: 4 },
              { label: 'Q2', data: MOCK_PUB_QUARTILE_TRENDS.q2, backgroundColor: '#0284c7', borderRadius: 4 },
              { label: 'Q3', data: MOCK_PUB_QUARTILE_TRENDS.q3, backgroundColor: '#f59e0b', borderRadius: 4 },
              { label: 'Q4', data: MOCK_PUB_QUARTILE_TRENDS.q4, backgroundColor: '#ea580c', borderRadius: 4 },
              { label: 'TCI (ระดับชาติ)', data: MOCK_PUB_QUARTILE_TRENDS.tci, backgroundColor: '#64748b', borderRadius: 4 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
            },
          },
        });
      }
    } else if (activePerspective === 'sdg') {
      if (canvasSdg17.current) {
        const sdgCounts = Array(17).fill(0);
        validResearch.forEach((r) => {
          const detected = detectSDGsFromText(r.name || '', r.department);
          detected.forEach((d) => {
            if (d.sdg.number >= 1 && d.sdg.number <= 17) {
              sdgCounts[d.sdg.number - 1]++;
            }
          });
        });

        chartSdg17.current = new Chart(canvasSdg17.current, {
          type: 'bar',
          data: {
            labels: SDG_MASTER.map((s) => `SDG ${s.number}: ${s.nameTh.substring(0, 14)}...`),
            datasets: [
              {
                label: 'จำนวนโครงการวิจัย',
                data: sdgCounts,
                backgroundColor: SDG_MASTER.map((s) => s.color),
                borderRadius: 6,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              datalabels: { anchor: 'end', align: 'right' },
            },
            scales: {
              x: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
              y: { grid: { display: false } },
            },
          },
        });
      }
    }

    return () => {
      if (chartFundingTreemap.current) chartFundingTreemap.current.destroy();
      if (chartFundingYoy.current) chartFundingYoy.current.destroy();
      if (chartPubQuartile.current) chartPubQuartile.current.destroy();
      if (chartSdg17.current) chartSdg17.current.destroy();
    };
  }, [activePerspective, departmentStats, validResearch]);

  return (
    <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
      {/* Perspective Tabs Header */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { id: 'funding', label: 'มิติด้านงบประมาณและแหล่งทุน', icon: <FaCoins /> },
          { id: 'quality', label: 'มิติด้านคุณภาพผลงาน (Quartile)', icon: <FaAward /> },
          { id: 'projects', label: 'มิติด้านโครงการและการกระจายตัว', icon: <FaTasks /> },
          { id: 'sdg', label: 'มิติด้านความยั่งยืน (SDGs 17 เป้าหมาย)', icon: <FaLeaf /> },
        ].map((tab) => {
          const isActive = activePerspective === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePerspective(tab.id as StrategicPerspective)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#00A651' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Perspective Contents */}
      {activePerspective === 'funding' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              แจกแจงงบวิจัยตาม 7 ภาควิชา (ล้านบาท)
            </h4>
            <div style={{ height: '280px' }}>
              <canvas ref={canvasFundingTreemap} />
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              อัตราการเติบโตเปรียบเทียบปีงบประมาณ (YoY: 2567 vs 2568)
            </h4>
            <div style={{ height: '280px' }}>
              <canvas ref={canvasFundingYoy} />
            </div>
          </div>
        </div>
      )}

      {activePerspective === 'quality' && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            สัดส่วนบทความตีพิมพ์ตามระดับควอร์ไทล์ (Scopus Q1-Q4 & TCI)
          </h4>
          <div style={{ height: '300px' }}>
            <canvas ref={canvasPubQuartile} />
          </div>
        </div>
      )}

      {activePerspective === 'projects' && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            ตารางสรุปผลงานและการกระจายตัวราย 7 ภาควิชา
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', whiteSpace: 'nowrap' }}>ภาควิชา</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>โครงการวิจัย</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>งบวิจัยรวม (บาท)</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>บทความตีพิมพ์</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>งานบริการวิชาการ</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((d, idx) => (
                <tr key={d.code} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{d.name} ({d.code})</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{d.researchCount}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#006838' }}>{d.budget.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{d.pubs}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{d.services}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activePerspective === 'sdg' && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            การกระจายตัวของโครงการวิจัยตามเป้าหมายความยั่งยืน 17 ด้าน (UN SDGs)
          </h4>
          <div style={{ height: '380px' }}>
            <canvas ref={canvasSdg17} />
          </div>
        </div>
      )}
    </div>
  );
};
