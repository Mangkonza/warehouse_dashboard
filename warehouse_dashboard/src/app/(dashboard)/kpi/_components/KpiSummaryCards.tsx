'use client';

import React from 'react';
import { FaChartLine, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

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
      padding: '18px 20px',
      border: isActive ? `2px solid ${activeColor}` : '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
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
        gap: '16px',
      }}
    >
      {/* Card 1: ความสำเร็จรวม */}
      <div
        onClick={() => handleToggle('all')}
        style={getCardStyle('all', '#00A651')}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          <FaChartLine />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            คะแนนความสำเร็จเฉลี่ย
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{stats.avgScore}%</div>
          <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>
            รวม {stats.total} ตัวชี้วัด
          </div>
        </div>
      </div>

      {/* Card 2: บรรลุเป้าหมาย */}
      <div
        onClick={() => handleToggle('achieved')}
        style={getCardStyle('achieved', '#059669')}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          <FaCheckCircle />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            บรรลุเป้าหมาย (≥ 100%)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>{stats.achieved} ข้อ</div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            {stats.total ? Math.round((stats.achieved / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>

      {/* Card 3: เป็นไปตามเป้า */}
      <div
        onClick={() => handleToggle('on_track')}
        style={getCardStyle('on_track', '#0284c7')}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f0f9ff',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          <FaClock />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            เป็นไปตามเป้า (70 - 99%)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284c7' }}>{stats.onTrack} ข้อ</div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            {stats.total ? Math.round((stats.onTrack / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>

      {/* Card 4: ต้องเร่งรัด / เฝ้าระวัง */}
      <div
        onClick={() => handleToggle('risk_or_behind')}
        style={getCardStyle('risk_or_behind', '#dc2626')}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          <FaExclamationCircle />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            เฝ้าระวัง & ต้องเร่งรัด (&lt; 70%)
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626' }}>
            {stats.atRisk + stats.behind} ข้อ
          </div>
          <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 600 }}>
            {stats.total ? Math.round(((stats.atRisk + stats.behind) / stats.total) * 100) : 0}% ของทั้งหมด
          </div>
        </div>
      </div>
    </div>
  );
}
