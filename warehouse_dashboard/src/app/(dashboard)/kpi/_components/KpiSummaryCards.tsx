'use client';

import React from 'react';

interface OverallStats {
  total: number;
  achieved: number;
  inProgress?: number;
  onTrack?: number;
  atRisk?: number;
  behind: number;
  avgScore: number;
}

interface KpiSummaryCardsProps {
  stats: OverallStats;
  selectedStatus?: string;
  onSelectStatus?: (status: string) => void;
}

export function KpiSummaryCards({
  stats,
  selectedStatus = 'all',
  onSelectStatus,
}: KpiSummaryCardsProps) {
  const getCardStyle = (statusKey: string, activeColor: string) => {
    const isActive = selectedStatus === statusKey;
    return {
      backgroundColor: isActive ? `${activeColor}0a` : '#ffffff',
      borderRadius: '12px',
      padding: '16px 18px',
      border: isActive ? `2px solid ${activeColor}` : `1.5px solid ${activeColor}33`,
      boxShadow: isActive ? `0 4px 12px ${activeColor}20` : '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      minHeight: '110px',
      cursor: onSelectStatus ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
    };
  };

  const handleToggle = (key: string) => {
    if (!onSelectStatus) return;
    onSelectStatus(selectedStatus === key ? 'all' : key);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
      }}
    >
      {/* Card 1: ความสำเร็จรวม */}
      <div
        onClick={() => handleToggle('all')}
        style={getCardStyle('all', '#00A651')}
      >
        <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
          คะแนนความสำเร็จเฉลี่ย
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>
          {stats.avgScore}%
        </div>
        <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
          รวม {stats.total} ตัวชี้วัด
        </div>
      </div>

      {/* Card 2: บรรลุเป้าหมาย */}
      <div
        onClick={() => handleToggle('achieved')}
        style={getCardStyle('achieved', '#059669')}
      >
        <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
          บรรลุเป้าหมาย (≥ 100%)
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>
          {stats.achieved} ข้อ
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {stats.total ? Math.round((stats.achieved / stats.total) * 100) : 0}% ของทั้งหมด
        </div>
      </div>

      {/* Card 3: กำลังดำเนินการ */}
      <div
        onClick={() => handleToggle('in_progress')}
        style={getCardStyle('in_progress', '#ca8a04')}
      >
        <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
          กำลังดำเนินการ (50–99%)
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#ca8a04', fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>
          {stats.inProgress ?? stats.onTrack ?? 0} ข้อ
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          {stats.total ? Math.round(((stats.inProgress ?? stats.onTrack ?? 0) / stats.total) * 100) : 0}% ของทั้งหมด
        </div>
      </div>

      {/* Card 4: ต้องเร่งรัด */}
      <div
        onClick={() => handleToggle('behind')}
        style={getCardStyle('behind', '#dc2626')}
      >
        <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
          ต้องเร่งรัด (≤ 49%)
        </div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', fontVariantNumeric: 'tabular-nums', margin: '4px 0' }}>
          {stats.behind} ข้อ
        </div>
        <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
          {stats.total ? Math.round((stats.behind / stats.total) * 100) : 0}% ของทั้งหมด
        </div>
      </div>
    </div>
  );
}
