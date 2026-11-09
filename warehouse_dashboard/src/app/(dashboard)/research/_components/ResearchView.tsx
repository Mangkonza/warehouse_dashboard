'use client';

import React, { useEffect, useMemo } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts, ResearchPerspective } from './ResearchCharts';
import { ResearchBudgetFundingOverview } from './ResearchBudgetFundingOverview';
import { ResearchDepartmentComparison } from './ResearchDepartmentComparison';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { ExecutiveKpiDeck } from '@/components/data-display/ExecutiveKpiDeck';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaCoins, FaFlask, FaAward, FaChartLine, FaBuilding, FaUserTie, FaLeaf, FaTable } from 'react-icons/fa';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';

const VALID_RESEARCH_TABS: ResearchPerspective[] = ['overview', 'productivity', 'faculty', 'sdg', 'table'];

export function ResearchView() {
  const [activePerspective, setActivePerspective] = usePerspectiveTab<ResearchPerspective>(
    'research',
    VALID_RESEARCH_TABS,
    'overview'
  );
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('research');

  const { setIsTimeModalOpen } = useTimeFilter('research');

  const {
    validData,
    allItems,
    undatedCount,
    filteredData,
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    activePisCount,
    maxProject,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFund,
    setSelectedFund,
    fundingType,
    setFundingType,
    grantTier,
    setGrantTier,
    strategicFilter,
    setStrategicFilter,
  } = useResearchData(timeFilter);

  // Synchronize tabFilter to useResearchData internal states
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  useEffect(() => {
    setFundingType(tabFilter.customFilters?.fundingType || 'all');
  }, [tabFilter.customFilters?.fundingType, setFundingType]);

  useEffect(() => {
    setGrantTier(tabFilter.customFilters?.grantTier || 'all');
  }, [tabFilter.customFilters?.grantTier, setGrantTier]);

  useEffect(() => {
    setSelectedFund(tabFilter.customFilters?.selectedFund || 'all');
  }, [tabFilter.customFilters?.selectedFund, setSelectedFund]);

  useEffect(() => {
    setStrategicFilter(tabFilter.customFilters?.strategicFilter || 'all');
  }, [tabFilter.customFilters?.strategicFilter, setStrategicFilter]);

  useEffect(() => {
    if (tabFilter.search !== undefined) {
      setSearchTerm(tabFilter.search);
    }
  }, [tabFilter.search, setSearchTerm]);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const extMillions = (totalExternalBudget / 1000000).toFixed(2);
  const intMillions = (totalInternalBudget / 1000000).toFixed(2);
  const extPct = totalBudgetAll > 0 ? ((totalExternalBudget / totalBudgetAll) * 100).toFixed(1) : '0';
  const avgGrantMillions = validData.length > 0 ? (totalBudgetAll / validData.length / 1000000).toFixed(2) : '0.00';
  const maxProj = maxProject as any;
  const maxProjectBudgetMillions = maxProj
    ? (((Number(maxProj.budget_internal) || 0) + (Number(maxProj.budget_external) || 0) || Number(maxProj.budget) || 0) / 1000000).toFixed(2)
    : '18.00';
  const extProjectCount = validData.filter(
    (d: any) => (Number(d.budget_external) || 0) > 0 || String(d.funding_type || '').includes('ภายนอก')
  ).length;
  const extProjectPct = validData.length > 0 ? Math.round((extProjectCount / validData.length) * 100) : 0;

  const researchSegments = useMemo(() => {
    return [
      {
        label: 'ทุนภายนอก',
        value: extMillions,
        displayValue: `${extMillions} ลบ.`,
        unit: 'ล้านบาท',
        percent: parseFloat(extPct) || 0,
        color: '#38bdf8',
      },
      {
        label: 'ทุนภายใน',
        value: intMillions,
        displayValue: `${intMillions} ลบ.`,
        unit: 'ล้านบาท',
        percent: parseFloat((100 - parseFloat(extPct)).toFixed(1)) || 0,
        color: '#86efac',
      },
    ];
  }, [extMillions, intMillions, extPct]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page header — matches the data-management tab */}
      <div>
        <h1 style={dashboardPageTitleStyle}>โครงการวิจัย</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมงบประมาณ แหล่งทุน และผลผลิตงานวิจัย
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ position: 'relative', width: '100%', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="emerald"
          tabs={[
            { key: 'overview', label: 'ภาพรวมงบประมาณและแหล่งทุน', icon: <FaCoins style={{ fontSize: '13px' }} /> },
            { key: 'productivity', label: 'เปรียบเทียบผลงานรายสังกัด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'อาจารย์และหัวหน้าโครงการวิจัย', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'รายการโครงการวิจัย', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="research"
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
            categoryKey="research"
            missionTitle="โครงการวิจัย"
            unitLabel="โครงการ"
            showBudget={true}
          />
        </div>
      ) : activePerspective === 'table' ? (
        <div style={{ marginTop: '8px' }}>
          <MissionDataTable
            categoryKey="research"
            items={validData}
            title="โครงการวิจัย"
          />
        </div>
      ) : activePerspective === 'overview' ? (
        <>
          {/* ZONE 2: Executive Blueprint KPI Deck */}
          <ExecutiveKpiDeck
            mission="research"
            blueprintCard={{
              label: 'งบประมาณวิจัยรวม',
              value: budgetMillions,
              unit: 'ล้านบาท',
              segments: researchSegments,
            }}
            gearCard={{
              label: 'โครงการวิจัยทั้งหมด',
              value: validData.length,
              unit: 'โครงการ',
              gearValue: uniqueDepts.size,
              gearLabel: 'สังกัด',
            }}
            items={validData}
            tallyCard={{
              label: 'โครงการที่ได้ทุนภายนอก',
              chip: `${extProjectPct}%`,
              value: extProjectCount,
              unit: `จาก ${validData.length} โครงการ`,
              percent: extProjectPct,
              totalCount: validData.length,
              activeCount: extProjectCount,
            }}
            rulerCard={{
              label: 'งบเฉลี่ยต่อโครงการ',
              value: avgGrantMillions,
              unit: 'ล้านบาท',
              current: parseFloat(avgGrantMillions) || 0,
              max: parseFloat(maxProjectBudgetMillions) || 18,
              marks: [
                { label: '0', positionPercent: 2 },
                { label: ((parseFloat(maxProjectBudgetMillions) || 18) / 3).toFixed(0), positionPercent: 33 },
                { label: (((parseFloat(maxProjectBudgetMillions) || 18) * 2) / 3).toFixed(0), positionPercent: 66 },
                { label: `สูงสุด ${(parseFloat(maxProjectBudgetMillions) || 18).toFixed(2)}`, positionPercent: 96 },
              ],
            }}
          />

          {/* ZONE 3: Overview - Budget & Funding Sources (Redesign) */}
          <ResearchBudgetFundingOverview
            allItems={allItems || validData}
            filteredItems={validData}
            currentFiscalYear={timeFilter?.mode === 'fiscal' && timeFilter.fiscalYear !== 'all' ? timeFilter.fiscalYear : undefined}
          />
        </>
      ) : activePerspective === 'productivity' ? (
        <div style={{ marginTop: '8px' }}>
          {/* ZONE 3: Productivity - Department Comparison (Redesign) */}
          <ResearchDepartmentComparison
            allItems={allItems || validData}
            filteredItems={validData}
            currentFiscalYear={timeFilter?.mode === 'fiscal' && timeFilter.fiscalYear !== 'all' ? timeFilter.fiscalYear : undefined}
          />
        </div>
      ) : (
        /* ZONE 3: Other Perspectives (e.g. Faculty PI ranking) */
        <ResearchCharts
          validData={filteredData}
          allItems={allItems || validData}
          currentFiscalYear={timeFilter?.mode === 'fiscal' && timeFilter.fiscalYear !== 'all' ? timeFilter.fiscalYear : undefined}
          selectedDept={selectedDept}
          activePerspective={activePerspective}
          onChangePerspective={setActivePerspective}
          hideSelector={true}
        />
      )}
    </div>
  );
}
