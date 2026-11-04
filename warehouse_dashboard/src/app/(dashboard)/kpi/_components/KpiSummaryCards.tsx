'use client';

import React from 'react';
import { PastelIllustratedKpiCard } from '@/components/ui';

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
  const handleToggle = (key: string) => {
    if (!onSelectStatus) return;
    onSelectStatus(selectedStatus === key ? 'all' : key);
  };

  const achievedPct = stats.total ? Math.round((stats.achieved / stats.total) * 100) : 0;
  const onTrackPct = stats.total ? Math.round((stats.onTrack / stats.total) * 100) : 0;
  const riskPct = stats.total ? Math.round(((stats.atRisk + stats.behind) / stats.total) * 100) : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px',
      }}
    >
      {/* Card 1: ความสำเร็จรวม */}
      <div
        onClick={() => handleToggle('all')}
        style={{
          cursor: onSelectStatus ? 'pointer' : 'default',
          borderRadius: '18px',
          outline: selectedStatus === 'all' ? '2px solid #34D399' : '2px solid transparent',
          transition: 'outline-color 0.15s ease',
        }}
        title="คลิกเพื่อแสดงตัวชี้วัดทั้งหมด"
      >
        <PastelIllustratedKpiCard
          label="คะแนนความสำเร็จเฉลี่ยรวม"
          value={`${stats.avgScore}%`}
          subtitle={`ครอบคลุมทั้งหมด ${stats.total} ตัวชี้วัดยุทธศาสตร์`}
          badgeText="ภาพรวมคณะ"
          progressPercent={stats.avgScore}
          variant="teal-globe"
        />
      </div>

      {/* Card 2: บรรลุเป้าหมาย */}
      <div
        onClick={() => handleToggle('achieved')}
        style={{
          cursor: onSelectStatus ? 'pointer' : 'default',
          borderRadius: '18px',
          outline: selectedStatus === 'achieved' ? '2px solid #10B981' : '2px solid transparent',
          transition: 'outline-color 0.15s ease',
        }}
        title="คลิกเพื่อกรองเฉพาะตัวชี้วัดที่บรรลุเป้าหมาย"
      >
        <PastelIllustratedKpiCard
          label="บรรลุเป้าหมาย (ตั้งแต่ 100%)"
          value={`${stats.achieved} ข้อ`}
          subtitle={`คิดเป็น ${achievedPct}% ของตัวชี้วัดทั้งหมด`}
          badgeText={`${achievedPct}% ของทั้งหมด`}
          progressPercent={achievedPct}
          variant="emerald-award"
        />
      </div>

      {/* Card 3: เป็นไปตามเป้า */}
      <div
        onClick={() => handleToggle('on_track')}
        style={{
          cursor: onSelectStatus ? 'pointer' : 'default',
          borderRadius: '18px',
          outline: selectedStatus === 'on_track' ? '2px solid #38BDF8' : '2px solid transparent',
          transition: 'outline-color 0.15s ease',
        }}
        title="คลิกเพื่อกรองเฉพาะตัวชี้วัดที่เป็นไปตามเป้า"
      >
        <PastelIllustratedKpiCard
          label="เป็นไปตามแผน (70 - 99%)"
          value={`${stats.onTrack} ข้อ`}
          subtitle={`คิดเป็น ${onTrackPct}% ของตัวชี้วัดทั้งหมด`}
          badgeText="กำลังดำเนินการ"
          progressPercent={onTrackPct}
          variant="sky-blueprint"
        />
      </div>

      {/* Card 4: ต้องเร่งรัด / เฝ้าระวัง */}
      <div
        onClick={() => handleToggle('risk_or_behind')}
        style={{
          cursor: onSelectStatus ? 'pointer' : 'default',
          borderRadius: '18px',
          outline: selectedStatus === 'risk_or_behind' ? '2px solid #FB7185' : '2px solid transparent',
          transition: 'outline-color 0.15s ease',
        }}
        title="คลิกเพื่อกรองเฉพาะตัวชี้วัดที่ต้องเฝ้าระวังหรือเร่งรัด"
      >
        <PastelIllustratedKpiCard
          label="เฝ้าระวังและต้องเร่งรัด (ต่ำกว่า 70%)"
          value={`${stats.atRisk + stats.behind} ข้อ`}
          subtitle={`เฝ้าระวัง ${stats.atRisk} ข้อ • ต้องเร่งรัด ${stats.behind} ข้อ`}
          badgeText={`${riskPct}% ต้องติดตาม`}
          progressPercent={riskPct}
          variant="rose-journal"
        />
      </div>
    </div>
  );
}
