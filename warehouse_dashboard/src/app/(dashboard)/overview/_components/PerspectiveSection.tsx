'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MOCK_YOY_FUNDING, MOCK_PUB_QUARTILE_TRENDS } from '../_constants/mockHistoricalData';
import { FaCoins, FaAward, FaTasks, FaLeaf } from 'react-icons/fa';
import { getDepartmentColor } from '@/lib/departments';
import { DepartmentBadge } from '@/components/ui';
import { DepartmentOverviewStat } from '../_hooks/useOverviewData';
import { formatTopItemsForTooltip, getClickedChartElement } from '@/lib/chartTooltipHelper';
import { DrillDownProjectDrawer, HybridSdgCard } from '@/components/data-display';
import { autoDetectJournalRanking, JOURNAL_TIER_STYLES } from '@/config/journalRankingConfig';
import { CategoryKey } from '@/config/dataManagementConfig';

export type StrategicPerspective = 'funding' | 'quality' | 'projects' | 'sdg';

interface PerspectiveSectionProps {
  departmentStats: DepartmentOverviewStat[];
  validResearch: any[];
  validAcademic?: any[];
  validPub?: any[];
  validService?: any[];
  validIP?: any[];
}

export const PerspectiveSection: React.FC<PerspectiveSectionProps> = ({
  departmentStats,
  validResearch,
  validAcademic = [],
  validPub = [],
  validService = [],
  validIP = [],
}) => {
  const [activePerspective, setActivePerspective] = useState<StrategicPerspective>('funding');
  const [drillDownState, setDrillDownState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    accentColor?: string;
    categoryKey: CategoryKey;
    items: any[];
  }>({
    isOpen: false,
    title: '',
    categoryKey: 'research',
    items: [],
  });

  const chartFundingTreemap = useRef<Chart | null>(null);
  const chartFundingYoy = useRef<Chart | null>(null);
  const chartPubQuartile = useRef<Chart | null>(null);

  const canvasFundingTreemap = useRef<HTMLCanvasElement | null>(null);
  const canvasFundingYoy = useRef<HTMLCanvasElement | null>(null);
  const canvasPubQuartile = useRef<HTMLCanvasElement | null>(null);

  // Group publications by Quartile Tier for live drill-down
  const pubByTier = useMemo(() => {
    const groups: Record<string, any[]> = {
      Q1: [],
      Q2: [],
      Q3: [],
      Q4: [],
      TCI: [],
    };
    validPub.forEach((p) => {
      const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
      if (tier === 'Scopus Q1') groups.Q1.push(p);
      else if (tier === 'Scopus Q2') groups.Q2.push(p);
      else if (tier === 'Scopus Q3') groups.Q3.push(p);
      else if (tier === 'Scopus Q4') groups.Q4.push(p);
      else groups.TCI.push(p);
    });
    return groups;
  }, [validPub]);

  const allMissionItems = useMemo(() => {
    return [...validResearch, ...validAcademic, ...validPub, ...validService, ...validIP];
  }, [validResearch, validAcademic, validPub, validService, validIP]);

  const totals = useMemo(() => {
    return departmentStats.reduce(
      (acc, d) => ({
        researchCount: acc.researchCount + d.researchCount,
        budget: acc.budget + d.budget,
        academicCount: acc.academicCount + d.academicCount,
        academicBudget: acc.academicBudget + d.academicBudget,
        pubs: acc.pubs + d.pubs,
        services: acc.services + d.services,
        ips: acc.ips + d.ips,
      }),
      { researchCount: 0, budget: 0, academicCount: 0, academicBudget: 0, pubs: 0, services: 0, ips: 0 }
    );
  }, [departmentStats]);

  useEffect(() => {
    if (chartFundingTreemap.current) { chartFundingTreemap.current.destroy(); chartFundingTreemap.current = null; }
    if (chartFundingYoy.current) { chartFundingYoy.current.destroy(); chartFundingYoy.current = null; }
    if (chartPubQuartile.current) { chartPubQuartile.current.destroy(); chartPubQuartile.current = null; }

    Chart.register(ChartDataLabels);

    if (activePerspective === 'funding') {
      if (canvasFundingTreemap.current) {
        chartFundingTreemap.current = new Chart(canvasFundingTreemap.current, {
          type: 'bar',
          data: {
            labels: departmentStats.map((d) => d.code),
            datasets: [
              {
                label: 'งบประมาณวิจัยรวม (ล้านบาท)',
                data: departmentStats.map((d) => Number((d.budget / 1000000).toFixed(2))),
                backgroundColor: departmentStats.map((d) => getDepartmentColor(d.code)),
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements, chart) => {
              const hit = getClickedChartElement(event, elements, chart, 'x');
              if (hit) {
                const d = departmentStats[hit.index];
                if (d) {
                  const totalB = totals.budget || 1;
                  const pct = ((d.budget / totalB) * 100).toFixed(1);
                  setDrillDownState({
                    isOpen: true,
                    title: `โครงการวิจัย: ภาควิชา${d.name} (${d.code})`,
                    subtitle: `สัดส่วน ${pct}% ของงบวิจัยคณะ • รวม ${d.researchCount} โครงการ • งบประมาณรวม ${d.budget.toLocaleString('th-TH')} บาท`,
                    accentColor: getDepartmentColor(d.code),
                    categoryKey: 'research',
                    items: d.researchItems,
                  });
                }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  title: (items: any) => {
                    const idx = items[0]?.dataIndex;
                    const d = departmentStats[idx];
                    return d ? `ภาควิชา${d.name} (${d.code})` : items[0]?.label;
                  },
                  label: (c: any) => {
                    const d = departmentStats[c.dataIndex];
                    return ` งบประมาณวิจัยรวม: ${c.raw} ล้านบาท (${d?.researchCount || 0} โครงการ)`;
                  },
                  afterBody: (items: any) => {
                    const idx = items[0]?.dataIndex;
                    const d = departmentStats[idx];
                    return d ? formatTopItemsForTooltip(d.researchItems, { maxItems: 3, showBudget: true }) : [];
                  },
                },
              },
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
            onClick: (event, elements, chart) => {
              const hit = getClickedChartElement(event, elements, chart, 'x');
              if (hit) {
                const monthLabel = MOCK_YOY_FUNDING.months[hit.index] || '';
                setDrillDownState({
                  isOpen: true,
                  title: `โครงการวิจัยในปีงบประมาณปัจจุบัน (ข้อมูลเดือน ${monthLabel})`,
                  subtitle: `รวมโครงการวิจัยในระบบทั้งหมด ${validResearch.length} โครงการ`,
                  accentColor: '#00A651',
                  categoryKey: 'research',
                  items: validResearch,
                });
              }
            },
            plugins: { legend: { position: 'top' }, datalabels: { display: false } },
            scales: {
              y: {
                ticks: { callback: (v: any) => `${v}M ` },
                grid: { color: 'rgba(226, 232, 240, 0.6)' },
              },
            },
          },
        });
      }
    } else if (activePerspective === 'quality') {
      if (canvasPubQuartile.current) {
        const labels = [...MOCK_PUB_QUARTILE_TRENDS.labels.slice(0, -1), '2568 (ข้อมูลจริงระบบ)'];
        const q1Data = [...MOCK_PUB_QUARTILE_TRENDS.q1.slice(0, -1), pubByTier.Q1.length];
        const q2Data = [...MOCK_PUB_QUARTILE_TRENDS.q2.slice(0, -1), pubByTier.Q2.length];
        const q3Data = [...MOCK_PUB_QUARTILE_TRENDS.q3.slice(0, -1), pubByTier.Q3.length];
        const q4Data = [...MOCK_PUB_QUARTILE_TRENDS.q4.slice(0, -1), pubByTier.Q4.length];
        const tciData = [...MOCK_PUB_QUARTILE_TRENDS.tci.slice(0, -1), pubByTier.TCI.length];

        chartPubQuartile.current = new Chart(canvasPubQuartile.current, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Scopus Q1', data: q1Data, backgroundColor: JOURNAL_TIER_STYLES['Scopus Q1'].text, borderRadius: 4 },
              { label: 'Scopus Q2', data: q2Data, backgroundColor: JOURNAL_TIER_STYLES['Scopus Q2'].text, borderRadius: 4 },
              { label: 'Scopus Q3', data: q3Data, backgroundColor: JOURNAL_TIER_STYLES['Scopus Q3'].text, borderRadius: 4 },
              { label: 'Scopus Q4', data: q4Data, backgroundColor: JOURNAL_TIER_STYLES['Scopus Q4'].text, borderRadius: 4 },
              { label: 'TCI / ระดับชาติ', data: tciData, backgroundColor: JOURNAL_TIER_STYLES['TCI 1'].text, borderRadius: 4 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            onClick: (event, elements, chart) => {
              const hit = getClickedChartElement(event, elements, chart, 'nearest');
              if (hit) {
                const dsIdx = hit.datasetIndex;
                const tierKeys = ['Q1', 'Q2', 'Q3', 'Q4', 'TCI'];
                const tierLabels = ['Scopus Q1', 'Scopus Q2', 'Scopus Q3', 'Scopus Q4', 'TCI / ระดับชาติ'];
                const key = tierKeys[dsIdx] || 'Q1';
                const tierItems = pubByTier[key] || [];
                setDrillDownState({
                  isOpen: true,
                  title: `ผลงานตีพิมพ์ระดับ ${tierLabels[dsIdx]}`,
                  subtitle: `ข้อมูลผลงานตีพิมพ์ในระบบปัจจุบัน (${tierItems.length} เรื่อง)`,
                  accentColor: '#2e7d32',
                  categoryKey: 'publications',
                  items: tierItems,
                });
              }
            },
            plugins: {
              datalabels: { display: false },
              tooltip: {
                callbacks: {
                  afterBody: (items: any) => {
                    const dsIdx = items[0]?.datasetIndex;
                    const dataIdx = items[0]?.dataIndex;
                    if (dataIdx === labels.length - 1) {
                      const tierKeys = ['Q1', 'Q2', 'Q3', 'Q4', 'TCI'];
                      const key = tierKeys[dsIdx] || 'Q1';
                      return formatTopItemsForTooltip(pubByTier[key] || [], { maxItems: 3, showBudget: false });
                    }
                    return [];
                  },
                },
              },
            },
            scales: {
              x: { stacked: true, grid: { display: false } },
              y: { stacked: true, beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
            },
          },
        });
      }
    }

    return () => {
      if (chartFundingTreemap.current) chartFundingTreemap.current.destroy();
      if (chartFundingYoy.current) chartFundingYoy.current.destroy();
      if (chartPubQuartile.current) chartPubQuartile.current.destroy();
    };
  }, [activePerspective, departmentStats, pubByTier]);

  return (
    <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
      {/* Perspective Tabs Header */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { id: 'funding', label: 'งบประมาณและแหล่งทุน', icon: <FaCoins /> },
          { id: 'quality', label: 'คุณภาพผลงานตีพิมพ์ (Quartile)', icon: <FaAward /> },
          { id: 'projects', label: 'สรุป 5 พันธกิจรายภาควิชา', icon: <FaTasks /> },
          { id: 'sdg', label: 'ความยั่งยืน (UN SDGs)', icon: <FaLeaf /> },
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              งบประมาณวิจัยตาม 7 ภาควิชา (ล้านบาท)
            </h4>
            <div style={{ height: '280px', cursor: 'pointer' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              สัดส่วนผลงานตีพิมพ์ทางวิชาการตามระดับควอร์ไทล์ (Scopus Q1-Q4 & TCI)
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['Q1', 'Q2', 'Q3', 'Q4', 'TCI'] as const).map((tierKey) => {
                const styleKey = tierKey === 'TCI' ? 'TCI 1' : `Scopus ${tierKey}`;
                const st = JOURNAL_TIER_STYLES[styleKey];
                return (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() =>
                      setDrillDownState({
                        isOpen: true,
                        title: `ผลงานตีพิมพ์ระดับ ${tierKey === 'TCI' ? 'TCI / ระดับชาติ' : `Scopus ${tierKey}`}`,
                        subtitle: `รวม ${pubByTier[tierKey].length} เรื่อง`,
                        accentColor: st.text,
                        categoryKey: 'publications',
                        items: pubByTier[tierKey],
                      })
                    }
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: `1px solid ${st.border}`,
                      backgroundColor: st.bg,
                      color: st.text,
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {tierKey === 'TCI' ? 'TCI' : `Scopus ${tierKey}`}: {pubByTier[tierKey].length} เรื่อง
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ height: '300px', cursor: 'pointer' }}>
            <canvas ref={canvasPubQuartile} />
          </div>
        </div>
      )}

      {activePerspective === 'projects' && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
            สรุปผลงาน 5 พันธกิจราย 7 ภาควิชา
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '6px' }}>
              <thead>
                <tr style={{ backgroundColor: '#00A651', color: '#ffffff' }}>
                  <th style={{ width: '100px', padding: '10px 14px', textAlign: 'left', whiteSpace: 'nowrap' }}>ภาควิชา</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', whiteSpace: 'nowrap' }}>ชื่อภาควิชา</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>โครงการวิจัย</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>งบประมาณวิจัย (บาท)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>โครงการพัฒนาวิชาการ</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>ผลงานตีพิมพ์ทางวิชาการ</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>งานบริการวิชาการ</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>งานทรัพย์สินทางปัญญา</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((d, idx) => (
                  <tr
                    key={d.code}
                    onClick={() =>
                      setDrillDownState({
                        isOpen: true,
                        title: `ผลงานและโครงการทั้งหมด: ภาควิชา${d.name} (${d.code})`,
                        subtitle: `วิจัย ${d.researchCount} • พัฒนาวิชาการ ${d.academicCount} • ตีพิมพ์ ${d.pubs} • บริการวิชาการ ${d.services} • ทรัพย์สินทางปัญญา ${d.ips}`,
                        accentColor: getDepartmentColor(d.code),
                        categoryKey: 'research',
                        items: d.allItems,
                      })
                    }
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafcfb',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '10px 14px', textAlign: 'left' }}>
                      <DepartmentBadge value={d.code} />
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'left', color: '#0f172a', fontWeight: 400 }}>
                      ภาควิชา{d.name}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{d.researchCount}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: '#059669', fontFamily: 'monospace' }}>
                      {d.budget.toLocaleString('th-TH')} บาท
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#334155' }}>
                      {d.academicCount} {d.academicBudget > 0 ? `(${(d.academicBudget / 1000000).toFixed(2)}M)` : ''}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#334155' }}>{d.pubs}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#334155' }}>{d.services}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: '#334155' }}>{d.ips}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f0fbf5', borderTop: '2px solid #00A651', fontWeight: 700, color: '#0f172a' }}>
                  <td colSpan={2} style={{ padding: '10px 14px', textAlign: 'left' }}>
                    รวมทั้งสิ้น (7 ภาควิชาหลัก)
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{totals.researchCount}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#059669', fontFamily: 'monospace' }}>
                    {totals.budget.toLocaleString('th-TH')} บาท
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    {totals.academicCount} {totals.academicBudget > 0 ? `(${(totals.academicBudget / 1000000).toFixed(2)}M)` : ''}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{totals.pubs}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{totals.services}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>{totals.ips}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {activePerspective === 'sdg' && (
        <HybridSdgCard
          items={allMissionItems}
          categoryKey="research"
          title="การวิเคราะห์ความยั่งยืนภาพรวมคณะฯ ครบ 5 พันธกิจ (UN SDGs & UI GreenMetric)"
        />
      )}

      <DrillDownProjectDrawer
        isOpen={drillDownState.isOpen}
        onClose={() => setDrillDownState((prev) => ({ ...prev, isOpen: false }))}
        title={drillDownState.title}
        subtitle={drillDownState.subtitle}
        accentColor={drillDownState.accentColor}
        categoryKey={drillDownState.categoryKey}
        items={drillDownState.items}
      />
    </div>
  );
};
