'use client';

import React from 'react';
import { OverviewKpiScore } from '../_hooks/useOverviewData';

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
            onClick={() => {
              onSelectKpi(kpi.id);
              if (onDrillDownKpi) onDrillDownKpi(kpi);
            }}
            style={{
              padding: '16px 18px',
              borderRadius: '12px',
              cursor: 'pointer',
              border: isSelected ? '2px solid #00A651' : `1.5px solid ${kpi.status.color}50`,
              backgroundColor: isSelected ? '#f0fbf5' : '#ffffff',
              boxShadow: isSelected ? '0 4px 14px rgba(0, 166, 81, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.18s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.boxShadow = `0 4px 12px ${kpi.status.color}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
              }
            }}
          >
            <div>
              {/* Header: Code + Status Badge */}
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
                    border: `1px solid ${kpi.status.color}33`,
                  }}
                >
                  {kpi.status.label}
                </span>
              </div>

              {/* Title (หัวเรื่องชัดเจน) */}
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '8px', lineHeight: 1.35 }}>
                {kpi.title}
              </div>

              {/* Primary Value */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                  {kpi.actualFormatted}
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                เป้าหมาย: {kpi.targetFormatted} ({kpi.percent}%)
              </div>
            </div>

            {/* Pro-rata Progress Bar with Vertical Time Target Marker */}
            <div style={{ marginTop: '12px' }}>
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '999px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(kpi.percent, 100)}%`,
                    backgroundColor: kpi.status.color,
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '10.5px', color: '#64748b' }}>
                <span>ก้าวหน้า {kpi.percent}%</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>เป้าเวลา {kpi.proRataTarget}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
