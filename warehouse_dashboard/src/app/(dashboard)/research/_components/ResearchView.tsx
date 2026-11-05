'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts, ResearchPerspective } from './ResearchCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { ResearchTable } from './ResearchTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { MissionKpiCard } from '@/components/data-display/MissionKpiCard';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import {
  dashboardPageSubtitleStyle,
  dashboardPageTitleStyle,
  dashboardTheme,
} from '@/lib/dashboardTheme';
import { FaCoins, FaFlask, FaAward, FaChartLine, FaBuilding, FaUserTie, FaLeaf } from 'react-icons/fa';

export function ResearchView() {
  const [activePerspective, setActivePerspective] = React.useState<ResearchPerspective>('overview');
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('research');

  const { setIsTimeModalOpen } = useTimeFilter('research');

  const {
    validData,
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
    setSelectedDept(tabFilter.department || 'all');
  }, [tabFilter.department, setSelectedDept]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page header — matches the data-management tab */}
      <div>
        <h1 style={dashboardPageTitleStyle}>โครงการวิจัย</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมงบประมาณ แหล่งทุน และผลผลิตงานวิจัยของคณะวิศวกรรมศาสตร์
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="emerald"
          tabs={[
            { key: 'overview', label: 'ภาพรวมงบประมาณและแหล่งทุน', icon: <FaCoins style={{ fontSize: '13px' }} /> },
            { key: 'productivity', label: 'เปรียบเทียบผลผลิตรายสังกัด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'อาจารย์และหัวหน้าโครงการวิจัย', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE / IAM)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
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
        showDepartment={true}
        showStrategic={true}
        showDetailedTime={true}
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{
          position: 'static',
          backdropFilter: 'none',
          backgroundColor: dashboardTheme.colors.surface,
          borderRadius: `${dashboardTheme.radius.card}px`,
          boxShadow: 'none',
        }}
      >
        {/* Funding Type Dropdown */}
        <select
          value={fundingType}
          onChange={(e) => {
            const val = e.target.value;
            setFundingType(val as any);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                fundingType: val,
              },
            });
          }}
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            height: '32px',
            boxSizing: 'border-box',
          }}
          aria-label="ประเภทแหล่งทุน"
        >
          <option value="all">ทุกประเภทแหล่งทุน</option>
          <option value="external">ทุนภายนอก</option>
          <option value="internal">ทุนภายใน</option>
        </select>

        {/* Grant Size Tier Dropdown */}
        <select
          value={grantTier}
          onChange={(e) => {
            const val = e.target.value;
            setGrantTier(val);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                grantTier: val,
              },
            });
          }}
          style={{
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            fontWeight: 500,
            cursor: 'pointer',
            outline: 'none',
            height: '32px',
            boxSizing: 'border-box',
          }}
          aria-label="ขนาดงบประมาณ"
        >
          <option value="all">ทุกขนาดงบประมาณ</option>
          <option value="tier1">&lt; 5 แสนบาท</option>
          <option value="tier2">5 แสน - 2 ล้านบาท</option>
          <option value="tier3">2 - 10 ล้านบาท</option>
          <option value="tier4">&ge; 10 ล้านบาท (ขนาดใหญ่)</option>
        </select>
      </DashboardTabFilterBar>

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
      ) : (
        <>
          {activePerspective === 'overview' && (
            <>
              {/* ZONE 2: Executive KPI Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <MissionKpiCard
                  mission="research"
                  variant="pastel"
                  label="งบประมาณวิจัยรวม"
                  value={budgetMillions}
                  unit="ล้านบาท"
                  subtext={`ทุนภายนอก ${extMillions} ลบ. • ทุนภายใน ${intMillions} ลบ.`}
                  icon={<FaCoins style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="research"
                  variant="pastel"
                  label="โครงการวิจัยทั้งหมด"
                  value={validData.length}
                  unit="โครงการ"
                  subtext={`ครอบคลุม ${uniqueDepts.size} สังกัด • หัวหน้าโครงการ ${activePisCount} ท่าน`}
                  icon={<FaFlask style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="research"
                  variant="pastel"
                  label="สัดส่วนพึ่งพาทุนภายนอก"
                  value={`${extPct}%`}
                  subtext={`16 โครงการทุนนอก • ${extMillions} จาก ${budgetMillions} ล้านบาท`}
                  icon={<FaAward style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="research"
                  variant="pastel"
                  label="งบเฉลี่ยต่อโครงการ"
                  value={avgGrantMillions}
                  unit="ล้านบาท"
                  subtext={`สูงสุด ${maxProjectBudgetMillions} ลบ. • ${maxProj?.head || 'ศ.ดร.เชาว์'}`}
                  icon={<FaChartLine style={{ fontSize: '16px' }} />}
                />
              </div>

              {/* ZONE 2.5: Year-over-Year (YoY) Comparison */}
              <MissionYoYControls
                missionKey="research"
                missionTitle="โครงการวิจัย"
                allItemsRaw={validData}
                activeDepartment={selectedDept}
                primaryMetricLabel="จำนวนโครงการ (โครงการ)"
                secondaryMetricLabel="งบประมาณวิจัย (ล้านบาท)"
                hasBudgetMetric={true}
                defaultBaseYear="2567"
                defaultTargetYear="2568"
              />
            </>
          )}

          {/* ZONE 3: Research Charts */}
          <ResearchCharts
            validData={filteredData}
            selectedDept={selectedDept}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectDept={(dept) => {
              const nextDept = dept === selectedDept ? 'all' : dept;
              setSelectedDept(nextDept);
              setTabFilter({ department: nextDept });
            }}
            selectedFund={selectedFund}
            onSelectFund={(fund) => {
              const nextFund = fund === selectedFund ? 'all' : fund;
              setSelectedFund(nextFund);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  selectedFund: nextFund,
                },
              });
            }}
          />

          {/* ZONE 4: Research Table */}
          <ResearchTable
            filteredData={filteredData}
            uniqueDepts={uniqueDepts}
            searchTerm={searchTerm}
            onSearchChange={(s) => {
              setSearchTerm(s);
              setTabFilter({ search: s });
            }}
            selectedDept={selectedDept}
            onDeptChange={(dept) => {
              setSelectedDept(dept);
              setTabFilter({ department: dept });
            }}
            selectedFund={selectedFund}
            onFundChange={(fund) => {
              setSelectedFund(fund);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  selectedFund: fund,
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}