'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { PastelIllustratedKpiCard } from '@/components/ui';
import { usePersonnelData } from '../_hooks/usePersonnelData';
import { PersonnelCharts } from './PersonnelCharts';
import { PersonnelRankingTable } from './PersonnelRankingTable';
import { CANONICAL_DEPARTMENTS } from '@/config/dataManagementConfig';
import { FaSyncAlt } from 'react-icons/fa';

export function PersonnelView() {
  const router = useRouter();
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    personnelMetrics,
    departmentStats,
    totalFacultyCount,
    activeFacultyCount,
    totalCombinedWorks,
    totalCombinedBudget,
    isRefreshing,
    refreshData,
  } = usePersonnelData(timeFilter);

  const budgetMillions = (totalCombinedBudget / 1000000).toFixed(2);
  const activePercentage =
    totalFacultyCount > 0 ? Math.round((activeFacultyCount / totalFacultyCount) * 100) : 0;

  const departmentList = departmentStats.map((d) => d.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            วิเคราะห์ด้านบุคลากรและอาจารย์
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            การประเมินผลิตภาพทางวิชาการและการจัดอันดับผลงานสะสม 5 พันธกิจหลักรายบุคคล
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={isRefreshing}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <FaSyncAlt style={{ fontSize: '12px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'กำลังปรับปรุง...' : 'รีเฟรชข้อมูล'}</span>
        </button>
      </div>

      {/* 2. Time Filter Bar */}
      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={totalCombinedWorks}
      />

      {/* 3. Core Strategic KPI Cards (Pastel Illustrated) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '14px',
        }}
      >
        <PastelIllustratedKpiCard
          label="บุคลากรทั้งหมดในระบบ"
          value={`${totalFacultyCount} คน`}
          subtitle={`ครอบคลุม ${departmentStats.length} ภาควิชาและหน่วยงาน`}
          variant="peach-people"
          badgeText="บุคลากรรวม"
        />
        <PastelIllustratedKpiCard
          label="อาจารย์ที่มีผลงานในรอบเวลา"
          value={`${activeFacultyCount} คน`}
          subtitle={`คิดเป็น ${activePercentage}% ของบุคลากรทั้งหมด`}
          variant="emerald-award"
          badgeText={`${activePercentage}% ของคณะ`}
          progressPercent={activePercentage}
        />
        <PastelIllustratedKpiCard
          label="ผลงานสะสมรวม 5 ด้าน"
          value={`${totalCombinedWorks} รายการ`}
          subtitle="วิจัย • ตีพิมพ์ • สิทธิบัตร • พัฒนาวิชาการ • บริการ"
          variant="sky-blueprint"
          badgeText="5 พันธกิจหลัก"
        />
        <PastelIllustratedKpiCard
          label="งบประมาณโครงการรวมที่สร้าง"
          value={`${budgetMillions} ล้านบาท`}
          subtitle={`${totalCombinedBudget.toLocaleString('th-TH')} บาท`}
          variant="mint-coins"
          badgeText="งบสะสมรวม"
        />
      </div>

      {/* 4. Strategic Performance Charts */}
      <PersonnelCharts
        metrics={personnelMetrics}
        departmentStats={departmentStats}
        onSelectPerson={(id) => router.push(`/personnel/${id}`)}
      />

      {/* 5. Comprehensive Ranking Table */}
      <PersonnelRankingTable
        metrics={personnelMetrics}
        departments={departmentList}
      />
    </div>
  );
}
