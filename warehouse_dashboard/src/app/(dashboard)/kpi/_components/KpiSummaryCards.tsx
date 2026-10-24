'use client';

import React from 'react';

interface OverallStats {
  total: number;
  achieved: number;
  onTrack: number;
  atRisk: number;
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
      backgroundColor: isActive ? '#f0fbf5' : '#ffffff',
      borderRadius: '12px',
      padding: '16px 18px',
      border: isActive ? `2px solid ${activeColor}` : `1.5px solid ${activeColor}`,
      boxShadow: isActive ? `0 4px 12px ${activeColor}25` : '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      gap: '8px',
      cursor: onSelectStatus ? 'pointer' : 'default',
      transition: 'all 0.18s ease',
      minHeight: '110px',
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
            คะแนนความสำเร็จ KPI เฉลี่ย
          </div>
          {selectedStatus === 'all' && (
            <span style={{ fontSize: '11px', color: '#00A651', fontWeight: 700, backgroundColor: '#f0fbf5', padding: '1px 7px', borderRadius: '999px', border: '1px solid #00A65130' }}>
              เลือกอยู่
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: '25px', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
            {stats.avgScore}%
          </div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            รวม {stats.total} ตัวชี้วัด
          </div>
        </div>
      </div>

      {/* Card 2: บรรลุเป้าหมาย */}
      <div
        onClick={() => handleToggle('achieved')}
        style={getCardStyle('achieved', '#059669')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
            บรรลุเป้าหมาย (≥ 100%)
          </div>
          {selectedStatus === 'achieved' && (
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '1px 7px', borderRadius: '999px', border: '1px solid #05966930' }}>
              เลือกอยู่
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: '25px', fontWeight: 800, color: '#059669', lineHeight: 1.15 }}>
            {stats.achieved} ข้อ
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {stats.total ? Math.round((stats.achieved / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>

      {/* Card 3: เป็นไปตามเป้า */}
      <div
        onClick={() => handleToggle('on_track')}
        style={getCardStyle('on_track', '#0284c7')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
            เป็นไปตามเป้า (70–99%)
          </div>
          {selectedStatus === 'on_track' && (
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, backgroundColor: '#f0f9ff', padding: '1px 7px', borderRadius: '999px', border: '1px solid #0284c730' }}>
              เลือกอยู่
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: '25px', fontWeight: 800, color: '#0284c7', lineHeight: 1.15 }}>
            {stats.onTrack} ข้อ
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {stats.total ? Math.round((stats.onTrack / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>

      {/* Card 4: ต้องเร่งรัด / เฝ้าระวัง */}
      <div
        onClick={() => handleToggle('risk_or_behind')}
        style={getCardStyle('risk_or_behind', '#dc2626')}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
            เฝ้าระวัง & ต้องเร่งรัด (&lt; 70%)
          </div>
          {selectedStatus === 'risk_or_behind' && (
            <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, backgroundColor: '#fef2f2', padding: '1px 7px', borderRadius: '999px', border: '1px solid #dc262630' }}>
              เลือกอยู่
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: '25px', fontWeight: 800, color: '#dc2626', lineHeight: 1.15 }}>
            {stats.atRisk + stats.behind} ข้อ
          </div>
          <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 600, marginTop: '4px' }}>
            {stats.total ? Math.round(((stats.atRisk + stats.behind) / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>
    </div>
  );
}
