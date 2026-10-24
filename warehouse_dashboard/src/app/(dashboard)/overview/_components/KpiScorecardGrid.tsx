'use client';

import React from 'react';
import { OverviewKpiScore } from '../_hooks/useOverviewData';
import { FaCoins, FaFileAlt, FaTrophy, FaBriefcase, FaCertificate } from 'react-icons/fa';

interface KpiScorecardGridProps {
  scorecards: OverviewKpiScore[];
  selectedBurnupId: string;
  onSelectKpi: (id: string) => void;
}

export const KpiScorecardGrid: React.FC<KpiScorecardGridProps> = ({
  scorecards,
  selectedBurnupId,
  onSelectKpi,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'external_budget':
        return <FaCoins />;
      case 'scopus_pub':
        return <FaFileAlt />;
      case 'mega_projects':
        return <FaTrophy />;
      case 'service_revenue':
        return <FaBriefcase />;
      case 'ip_patents':
      default:
        return <FaCertificate />;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
      {scorecards.map((kpi) => {
        const isSelected = selectedBurnupId === kpi.id;
        return (
          <div
            key={kpi.id}
            onClick={() => onSelectKpi(kpi.id)}
            className="glass-card"
            style={{
              padding: '16px 18px',
              borderRadius: '14px',
              cursor: 'pointer',
              border: isSelected ? '2px solid #00A651' : '1px solid #e2e8f0',
              background: isSelected ? '#f0fdf4' : '#ffffff',
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

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  {kpi.actualFormatted}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#64748b' }}>
                เป้าหมาย: {kpi.targetFormatted} ({kpi.percent}%)
              </div>
            </div>

            {/* Pro-rata Progress Bar */}
            <div style={{ marginTop: '12px' }}>
              <div
                style={{
                  height: '7px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '4px',
                  overflow: 'hidden',
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
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '10px', color: '#94a3b8' }}>
                <span>ความก้าวหน้า {kpi.percent}%</span>
                <span>เป้าหมายเวลา {kpi.proRataTarget}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
