'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { usePersonnelData } from '../_hooks/usePersonnelData';
import { PersonnelCharts } from './PersonnelCharts';
import { PersonnelRankingTable } from './PersonnelRankingTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { CANONICAL_DEPARTMENTS } from '@/config/dataManagementConfig';
import { FaSyncAlt } from 'react-icons/fa';

export function PersonnelView() {
  const router = useRouter();
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('personnel');

  const { setIsTimeModalOpen } = useTimeFilter('personnel');

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


  const displayMetrics = useMemo(() => {
    if (!tabFilter.department || tabFilter.department === 'all') {
      return personnelMetrics;
    }
    return personnelMetrics.filter((m) =>
      String(m.department || '').includes(tabFilter.department)
    );
  }, [personnelMetrics, tabFilter.department]);

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
          <h1 style={dashboardPageTitleStyle}>
            วิเคราะห์ด้านบุคลากรและอาจารย์
          </h1>
          <p style={dashboardPageSubtitleStyle}>
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

      {/* 2. Unified Tab Filter Bar */}
      <DashboardTabFilterBar
        tabKey="personnel"
        totalCount={totalCombinedWorks}
        filteredCount={displayMetrics.length}
        filterState={tabFilter}
        onFilterChange={setTabFilter}
        onReset={resetTabFilter}
        showFiscalYear={true}
        showDepartment={true}
        showStrategic={false}
        showDetailedTime={true}
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{ position: 'static', backdropFilter: 'none', backgroundColor: dashboardTheme.colors.surface, borderRadius: `${dashboardTheme.radius.card}px`, boxShadow: 'none' }}
      />

      {/* 3. Core Strategic KPI Cards */}
      <KpiGrid
        items={[
          {
            label: 'บุคลากรทั้งหมดในระบบ',
            value: `${totalFacultyCount} คน`,
            subtext: `ครอบคลุม ${departmentStats.length} สังกัด`,
            accentColor: '#0f766e',
          },
          {
            label: 'อาจารย์ที่มีผลงานในรอบเวลา',
            value: `${activeFacultyCount} คน`,
            subtext: `คิดเป็น ${activePercentage}% ของบุคลากรทั้งหมด`,
            accentColor: '#00A651',
          },
          {
            label: 'ผลงานสะสมรวม 5 ด้าน',
            value: `${totalCombinedWorks} รายการ`,
            subtext: 'วิจัย • ตีพิมพ์ • สิทธิบัตร • พัฒนาวิชาการ • บริการ',
            accentColor: '#0284c7',
          },
          {
            label: 'งบประมาณโครงการรวมที่สร้าง',
            value: `${budgetMillions} ล้านบาท`,
            subtext: `${totalCombinedBudget.toLocaleString('th-TH')} บาท`,
            accentColor: '#d97706',
          },
        ]}
      />

      {/* 4. Strategic Performance Charts */}
      <PersonnelCharts
        metrics={displayMetrics}
        departmentStats={departmentStats}
        onSelectPerson={(id) => router.push(`/personnel/${id}`)}
      />

      {/* 5. Comprehensive Ranking Table */}
      <PersonnelRankingTable
        metrics={displayMetrics}
      />
    </div>
  );
}
