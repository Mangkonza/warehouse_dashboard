'use client';

import React from 'react';
import { OverviewKpiScore } from '../_hooks/useOverviewData';
import { FaListUl } from 'react-icons/fa';

interface KpiScorecardGridProps {
  scorecards: OverviewKpiScore[];
  selectedBurnupId: string;
  onSelectKpi: (id: string) => void;
  onDrillDownKpi?: (kpi: OverviewKpiScore) => void;
}

export const KpiScorecardGrid: React.FC<KpiScorecardGridProps> = ({
  scorecards,
  selectedBurnupId,
  onSelectKpi,
  onDrillDownKpi,
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))', gap: '14px' }}>
      {scorecards.map((kpi) => {
        const isSelected = selectedBurnupId === kpi.id;
        return (
          <div
            key={kpi.id}
            onClick={() => onSelectKpi(kpi.id)}
            className="glass-card"
            style={{
              padding: '16px 18px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: isSelected ? '2px solid #00A651' : '1px solid #e2e8f0',
              background: isSelected ? '#f0fbf5' : '#ffffff',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                  {kpi.code}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    color: kpi.status.color,
                    backgroundColor: kpi.status.bg,
                  }}
                >
                  {kpi.status.label}
                </span>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px', lineHeight: 1.3 }}>
                {kpi.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                  {kpi.actualFormatted}
                </span>
                {onDrillDownKpi && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDrillDownKpi(kpi);
                    }}
                    title="คลิกเพื่อดูรายชื่อโครงการ/ผลงาน"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#00A651',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <FaListUl size={10} />
                    <span>ดูรายการ ({kpi.items.length})</span>
                  </button>
                )}
              </div>

              <div style={{ fontSize: '11px', color: '#64748b' }}>
                เป้าหมาย: {kpi.targetFormatted} ({kpi.percent}%)
              </div>
            </div>

            {/* Pro-rata Progress Bar with Vertical Time Target Marker */}
            <div style={{ marginTop: '12px' }}>
              <div
                style={{
                  height: '8px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(kpi.percent, 100)}%`,
                    backgroundColor: kpi.status.color,
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
                {/* Pro-rata Target Vertical Indicator */}
                <div
                  title={`เป้าหมายตามเวลา (Pro-rata): ${kpi.proRataTarget}%`}
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    bottom: '-3px',
                    left: `${Math.min(kpi.proRataTarget, 100)}%`,
                    width: '2px',
                    backgroundColor: '#0f172a',
                    borderRadius: '1px',
                    zIndex: 2,
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10.5px', color: '#64748b' }}>
                <span>ความก้าวหน้า {kpi.percent}%</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>▏เป้าเวลา {kpi.proRataTarget}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
