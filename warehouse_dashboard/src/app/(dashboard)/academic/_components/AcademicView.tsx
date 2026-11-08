'use client';

import React, { useEffect, useMemo } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts, AcademicPerspective } from './AcademicCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaCoins, FaHandshake, FaLeaf, FaChartLine, FaBuilding, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { ExecutiveKpiDeck } from '@/components/data-display/ExecutiveKpiDeck';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaGraduationCap, FaHandHoldingUsd, FaTrophy, FaUserTie } from 'react-icons/fa';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';

const VALID_ACADEMIC_TABS: AcademicPerspective[] = ['timeline_alloc', 'client_segment', 'faculty', 'sdg', 'table'];

export function AcademicView() {
  const [activePerspective, setActivePerspective] = usePerspectiveTab<AcademicPerspective>(
    'academic',
    VALID_ACADEMIC_TABS,
    'timeline_alloc'
  );
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('academic');

  const { setIsTimeModalOpen } = useTimeFilter('academic');

  const {
    validData,
    allItems,
    undatedCount,
    displayData,
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    topDeptName,
    topDeptBudget,
    avgProjectBudget,
    maxProjectBudget,
    specifiedClientsCount,
    uniqueHeads,
    uniqueClients,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    selectedDept,
    setSelectedDept,
    selectedMonth,
    setSelectedMonth,
    hideMissingClient,
    setHideMissingClient,
    strategicFilter,
    setStrategicFilter,
  } = useAcademicData(timeFilter);

  // Synchronize tabFilter to useAcademicData internal states
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  useEffect(() => {
    setSelectedMonth(tabFilter.customFilters?.selectedMonth || 'all');
  }, [tabFilter.customFilters?.selectedMonth, setSelectedMonth]);

  useEffect(() => {
    setHideMissingClient(Boolean(tabFilter.customFilters?.hideMissingClient));
  }, [tabFilter.customFilters?.hideMissingClient, setHideMissingClient]);

  useEffect(() => {
    setSelectedClient(tabFilter.customFilters?.selectedClient || 'all');
  }, [tabFilter.customFilters?.selectedClient, setSelectedClient]);

  useEffect(() => {
    setStrategicFilter(tabFilter.customFilters?.strategicFilter || 'all');
  }, [tabFilter.customFilters?.strategicFilter, setStrategicFilter]);

  useEffect(() => {
    if (tabFilter.search !== undefined) {
      setSearchTerm(tabFilter.search);
    }
  }, [tabFilter.search, setSearchTerm]);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const allocMillions = (totalAllocated15 / 1000000).toFixed(2);
  const facMillions = (totalAllocFaculty / 1000000).toFixed(2);
  const depMillions = (totalAllocDept / 1000000).toFixed(2);
  const kuMillions = (totalAllocKu / 1000000).toFixed(2);
  const remMillions = (totalAllocRemaining / 1000000).toFixed(2);
  const topDeptBudgetM = (topDeptBudget / 1000000).toFixed(2);
  const avgMillions = (avgProjectBudget / 1000000).toFixed(2);
  const maxMillions = (maxProjectBudget / 1000000).toFixed(2);
  const majorProjectsCount = validData.filter((d) => (Number(d.budget) || 0) >= 1000000).length;
  const majorProjectsPct = validData.length > 0 ? Math.round((majorProjectsCount / validData.length) * 100) : 0;

  const academicSegments = useMemo(() => {
    return [
      {
        label: 'รายได้จัดสรร (15%)',
        value: allocMillions,
        displayValue: `${allocMillions} ลบ.`,
        unit: 'ล้านบาท',
        percent: 15.0,
        color: '#38bdf8',
      },
      {
        label: 'งบดำเนินงาน (85%)',
        value: remMillions,
        displayValue: `${remMillions} ลบ.`,
        unit: 'ล้านบาท',
        percent: 85.0,
        color: '#bae6fd',
      },
    ];
  }, [allocMillions, remMillions]);

  const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>โครงการพัฒนาวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมงบประมาณ ผู้ว่าจ้าง และผลผลิตโครงการพัฒนาวิชาการ
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="blue"
          tabs={[
            { key: 'timeline_alloc', label: 'แนวโน้มรายเดือนและการจัดสรรรายรับ', icon: <FaChartLine style={{ fontSize: '13px' }} /> },
            { key: 'client_segment', label: 'กลุ่มประเภทผู้ว่าจ้างและตลาด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'หัวหน้าโครงการพัฒนาวิชาการ', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'รายการโครงการพัฒนาวิชาการ', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="academic"
        totalCount={validData.length}
        filteredCount={displayData.length}
        filterState={tabFilter}
        onFilterChange={setTabFilter}
        onReset={resetTabFilter}
        showFiscalYear={true}
        showDepartment={false}
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

      {undatedCount > 0 && <UndatedNotice count={undatedCount} />}

      {/* PERSPECTIVE VIEW: Dedicated page view for Strategic Alignment */}
      {activePerspective === 'sdg' ? (
        <div style={{ marginTop: '8px' }}>
          <StrategicAlignmentMatrix
            items={displayData}
            categoryKey="academic"
            missionTitle="โครงการพัฒนาวิชาการ"
            unitLabel="โครงการ"
            showBudget={true}
          />
        </div>
      ) : activePerspective === 'table' ? (
        <div style={{ marginTop: '8px' }}>
          <MissionDataTable
            categoryKey="academic"
            items={validData}
            title="โครงการพัฒนาวิชาการ"
          />
        </div>
      ) : (
        <>
          {activePerspective === 'timeline_alloc' && (
            <>
              {/* ZONE 2: Executive Blueprint KPI Deck */}
              <ExecutiveKpiDeck
                mission="academic"
                blueprintCard={{
                  label: 'งบประมาณโครงการรวม',
                  value: budgetMillions,
                  unit: 'ล้านบาท',
                  segments: academicSegments,
                }}
                gearCard={{
                  label: 'โครงการพัฒนาวิชาการทั้งหมด',
                  value: validData.length,
                  unit: 'โครงการ',
                  gearValue: uniqueDepts.size,
                  gearLabel: 'สังกัด',
                }}
                items={validData}
                tallyCard={{
                  label: 'โครงการขนาดใหญ่ (งบประมาณ > 1 ล้านบาท)',
                  chip: `${majorProjectsPct}%`,
                  value: majorProjectsCount,
                  unit: `จาก ${validData.length} โครงการ`,
                  percent: majorProjectsPct,
                  totalCount: validData.length,
                  activeCount: majorProjectsCount,
                }}
                rulerCard={{
                  label: 'มูลค่าเฉลี่ยต่อโครงการ',
                  value: avgMillions,
                  unit: 'ล้านบาท',
                  current: parseFloat(avgMillions) || 0,
                  max: parseFloat(maxMillions) || 10,
                  marks: [
                    { label: '0', positionPercent: 2 },
                    { label: ((parseFloat(maxMillions) || 10) / 3).toFixed(1), positionPercent: 33 },
                    { label: (((parseFloat(maxMillions) || 10) * 2) / 3).toFixed(1), positionPercent: 66 },
                    { label: `สูงสุด ${(parseFloat(maxMillions) || 10).toFixed(2)}`, positionPercent: 96 },
                  ],
                }}
              />
            </>
          )}

          <AcademicCharts
            validData={displayData}
            allItems={allItems || validData}
            currentFiscalYear={timeFilter?.mode === 'fiscal' && timeFilter.fiscalYear !== 'all' ? timeFilter.fiscalYear : undefined}
            totalAllocFaculty={totalAllocFaculty}
            totalAllocDept={totalAllocDept}
            totalAllocKu={totalAllocKu}
            totalAllocRemaining={totalAllocRemaining}
            hideMissingClient={hideMissingClient}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectClient={(client) => {
              const nextClient = client === selectedClient ? 'all' : client;
              setSelectedClient(nextClient);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  selectedClient: nextClient,
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}
