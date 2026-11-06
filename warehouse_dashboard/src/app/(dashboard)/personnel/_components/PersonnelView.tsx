'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';
import { KpiGrid } from '@/components/data-display';
import { usePersonnelData } from '../_hooks/usePersonnelData';
import { PersonnelCharts, PersonnelPerspective } from './PersonnelCharts';
import { PersonnelRankingTable } from './PersonnelRankingTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaSyncAlt, FaUserTie, FaBuilding, FaTable } from 'react-icons/fa';

const VALID_PERSONNEL_TABS: PersonnelPerspective[] = ['overview', 'department', 'table'];

export function PersonnelView() {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = usePerspectiveTab<PersonnelPerspective>(
    'personnel',
    VALID_PERSONNEL_TABS,
    'overview'
  );

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
            บุคลากรและอาจารย์
          </h1>
          <p style={dashboardPageSubtitleStyle}>
            ภาพรวมผลิตภาพทางวิชาการและการจัดอันดับผลงานสะสม 5 พันธกิจหลักรายบุคคล
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={isRefreshing}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <FaSyncAlt style={{ fontSize: '13px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'กำลังปรับปรุง...' : 'รีเฟรชข้อมูล'}</span>
        </button>
      </div>

      {/* 2. Top Segmented Tabs */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="teal"
          tabs={[
            { key: 'overview', label: 'ภาพรวมและ 10 อันดับอาจารย์', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'department', label: 'การกระจายผลงานรายสังกัดและ 5 พันธกิจ', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'ทำเนียบและตารางจัดอันดับบุคลากร', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* 3. Unified Tab Filter Bar */}
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
        detailedTimeLabel="เลือกช่วงเวลา"
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{
          position: 'static',
          backdropFilter: 'none',
          backgroundColor: dashboardTheme.colors.surface,
          borderRadius: `${dashboardTheme.radius.card}px`,
          boxShadow: 'none',
        }}
      />

      {/* 4. Core Strategic KPI Cards (shown on overview & department) */}
      {(activePerspective === 'overview' || activePerspective === 'department') && (
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
      )}

      {/* 5. Main Content Area */}
      {activePerspective === 'table' ? (
        <PersonnelRankingTable metrics={displayMetrics} />
      ) : (
        <PersonnelCharts
          metrics={displayMetrics}
          departmentStats={departmentStats}
          activePerspective={activePerspective}
          onSelectPerson={(id) => router.push(`/personnel/${id}`)}
        />
      )}
    </div>
  );
}
