'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts, PubPerspective } from './PublicationsCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { ExecutiveKpiDeck } from '@/components/data-display/ExecutiveKpiDeck';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaBook, FaGlobeAmericas, FaAward, FaCoins, FaChartLine, FaBuilding, FaUserTie, FaBookOpen, FaLeaf, FaTable } from 'react-icons/fa';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';

const VALID_PUB_TABS: PubPerspective[] = [
  'timeline',
  'quartile_tci',
  'department',
  'faculty',
  'journals',
  'sdg',
  'table',
];

export function PublicationsView() {
  const [activePerspective, setActivePerspective] = usePerspectiveTab<PubPerspective>(
    'publications',
    VALID_PUB_TABS,
    'timeline'
  );
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('publications');

  const { setIsTimeModalOpen } = useTimeFilter('publications');

  const {
    validData,
    undatedCount,
    filteredData,
    q1Count,
    q2Count,
    q3Count,
    q4Count,
    tci1Count,
    tci2Count,
    tciCount,
    confCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
    publishedCount,
    inPrepCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    statusFilter,
    setStatusFilter,
    selectedDept,
    setSelectedDept,
    setFiscalYearFilter,
    strategicFilter,
    setStrategicFilter,
  } = usePublicationsData(timeFilter);

  // Synchronize tabFilter to usePublicationsData internal states
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  useEffect(() => {
    setFiscalYearFilter(tabFilter.fiscalYear || 'all');
  }, [tabFilter.fiscalYear, setFiscalYearFilter]);

  useEffect(() => {
    setLevelFilter(tabFilter.customFilters?.levelFilter || 'all');
  }, [tabFilter.customFilters?.levelFilter, setLevelFilter]);

  useEffect(() => {
    setStatusFilter(tabFilter.customFilters?.statusFilter || 'all');
  }, [tabFilter.customFilters?.statusFilter, setStatusFilter]);

  useEffect(() => {
    setStrategicFilter(tabFilter.customFilters?.strategicFilter || 'all');
  }, [tabFilter.customFilters?.strategicFilter, setStrategicFilter]);

  useEffect(() => {
    if (tabFilter.search !== undefined) {
      setSearchTerm(tabFilter.search);
    }
  }, [tabFilter.search, setSearchTerm]);

  const intlAllCount = q1Count + q2Count + q3Count + q4Count;
  const intlPct = validData.length > 0 ? ((intlAllCount / validData.length) * 100).toFixed(1) : '0';
  const tciPct = validData.length > 0 ? ((tciCount / validData.length) * 100).toFixed(1) : '0';
  const avgSupport = validData.length > 0 ? Math.round(totalSupportBudget / validData.length).toLocaleString('th-TH') : '0';
  const uniqueDepts = new Set(validData.map((d: any) => d.department_clean || d.department).filter(Boolean));
  const topTierCount = q1Count + q2Count;
  const topTierPct = validData.length > 0 ? ((topTierCount / validData.length) * 100).toFixed(1) : '0';
  const hasTierData = topTierCount > 0;

  const pubBudgetValue = (totalSupportBudget / 1000000).toFixed(2);
  const pubBudgetUnit = 'ล้านบาท';
  const pubBudgetCurrent = totalSupportBudget / 1000000;
  const pubBudgetMax = Math.max(1.5, Math.ceil((totalSupportBudget / 1000000) * 1.5 * 10) / 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>ผลงานตีพิมพ์ทางวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมคุณภาพวารสาร เงินสนับสนุน และผลผลิตตีพิมพ์
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="rose"
          tabs={[
            { key: 'timeline', label: 'แนวโน้มการตีพิมพ์รายเดือนและงบสนับสนุน', icon: <FaChartLine style={{ fontSize: '13px' }} /> },
            { key: 'quartile_tci', label: 'ระดับ Q TCI', icon: <FaAward style={{ fontSize: '13px' }} /> },
            { key: 'department', label: 'การผลิตผลงานรายสังกัด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'อาจารย์และนักวิจัยตีพิมพ์สูงสุด', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'journals', label: 'วารสารและแหล่งตีพิมพ์ยอดนิยม', icon: <FaBookOpen style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'รายการผลงานตีพิมพ์ทางวิชาการ', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="publications"
        totalCount={validData.length}
        filteredCount={filteredData.length}
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
            items={filteredData}
            categoryKey="publications"
            missionTitle="ผลงานตีพิมพ์ทางวิชาการ"
            unitLabel="เรื่อง"
            showBudget={true}
          />
        </div>
      ) : activePerspective === 'table' ? (
        <div style={{ marginTop: '8px' }}>
          <MissionDataTable
            categoryKey="publications"
            items={validData}
            title="ผลงานตีพิมพ์ทางวิชาการ"
          />
        </div>
      ) : (
        <>
          {activePerspective === 'timeline' && (
            <>
              {/* ZONE 2: Executive Blueprint KPI Deck */}
              <ExecutiveKpiDeck
                mission="publications"
                blueprintCard={{
                  label: 'ผลงานตีพิมพ์ทางวิชาการรวม',
                  value: validData.length,
                  unit: 'เรื่อง',
                  splitRatio: validData.length > 0 ? intlAllCount / validData.length : 0.7,
                  primaryLegend: {
                    label: 'นานาชาติ (Q1-Q4)',
                    value: `${intlAllCount} เรื่อง`,
                    percent: `${intlPct}%`,
                    color: '#fb7185',
                  },
                  secondaryLegend: {
                    label: 'ระดับชาติ (TCI)',
                    value: `${tciCount} เรื่อง`,
                    percent: `${tciPct}%`,
                    color: '#fda4af',
                  },
                }}
                gearCard={{
                  label: 'ผลงานที่ตีพิมพ์สำเร็จแล้ว',
                  value: publishedCount,
                  unit: 'เรื่อง',
                  gearValue: uniqueDepts.size,
                  gearLabel: 'สังกัด',
                }}
                tallyCard={{
                  label: hasTierData ? 'ผลงานกลุ่มควอร์ไทล์สูง (Q1 - Q2)' : 'ผลงานตีพิมพ์สำเร็จ (Published)',
                  chip: `${hasTierData ? topTierPct : (validData.length > 0 ? Math.round((publishedCount / validData.length) * 100) : 0)}%`,
                  value: hasTierData ? topTierCount : publishedCount,
                  unit: `จาก ${validData.length} เรื่อง`,
                  percent: hasTierData ? (parseFloat(topTierPct) || 0) : (validData.length > 0 ? (publishedCount / validData.length) * 100 : 0),
                  totalCount: validData.length,
                  activeCount: hasTierData ? topTierCount : publishedCount,
                }}
                rulerCard={{
                  label: 'เงินสนับสนุนตีพิมพ์รวม',
                  value: pubBudgetValue,
                  unit: pubBudgetUnit,
                  current: pubBudgetCurrent,
                  max: pubBudgetMax,
                  marks: [
                    { label: '0', positionPercent: 2 },
                    { label: (pubBudgetMax / 3).toFixed(2), positionPercent: 33 },
                    { label: ((pubBudgetMax * 2) / 3).toFixed(2), positionPercent: 66 },
                    { label: `สูงสุด ${pubBudgetMax.toFixed(2)}`, positionPercent: 96 },
                  ],
                }}
              />

              {/* ZONE 2.5: Year-over-Year (YoY) Comparison */}
              <MissionYoYControls
                missionKey="publications"
                missionTitle="ผลงานตีพิมพ์ทางวิชาการ"
                allItemsRaw={validData}
                activeDepartment={selectedDept}
                primaryMetricLabel="จำนวนผลงานตีพิมพ์"
                secondaryMetricLabel="เงินสนับสนุนการตีพิมพ์"
                hasBudgetMetric={true}
                defaultBaseYear="2567"
                defaultTargetYear="2568"
              />
            </>
          )}

          {/* ZONE 3: 5 Dimension Tabs Charts */}
          <PublicationsCharts
            validData={filteredData}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectDept={(dept) => {
              const nextDept = dept === selectedDept ? 'all' : dept;
              setSelectedDept(nextDept);
            }}
            onSelectLevel={(lvl) => {
              const nextLvl = lvl === levelFilter ? 'all' : lvl;
              setLevelFilter(nextLvl);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  levelFilter: nextLvl,
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}
