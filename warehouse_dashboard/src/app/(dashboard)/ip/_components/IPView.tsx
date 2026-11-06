'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts, IPPerspective } from './IPCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaCertificate, FaShieldAlt, FaUserTie, FaLeaf, FaHourglassHalf, FaCoins, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { MissionKpiCard } from '@/components/data-display/MissionKpiCard';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';

const VALID_IP_TABS: IPPerspective[] = ['types_dept', 'protection_status', 'faculty', 'sdg', 'table'];

export function IPView() {
  const [activePerspective, setActivePerspective] = usePerspectiveTab<IPPerspective>(
    'ip',
    VALID_IP_TABS,
    'types_dept'
  );
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('ip');

  const { setIsTimeModalOpen } = useTimeFilter('ip');

  const {
    validIpData,
    undatedCount,
    filteredIpData,
    patentCount,
    pettyPatentCount,
    copyrightCount,
    protectedCount,
    pendingCount,
    inPrepCount,
    totalSupportAmount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
    typeFilter,
    setTypeFilter,
    pipelineFilter,
    setPipelineFilter,
    fiscalYearFilter,
    setFiscalYearFilter,
    strategicFilter,
    setStrategicFilter,
  } = useIPData(timeFilter);

  // Synchronize tabFilter to useIPData internal states
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  useEffect(() => {
    setFiscalYearFilter(tabFilter.fiscalYear || 'all');
  }, [tabFilter.fiscalYear, setFiscalYearFilter]);

  useEffect(() => {
    setPipelineFilter(tabFilter.customFilters?.pipelineFilter || 'all');
  }, [tabFilter.customFilters?.pipelineFilter, setPipelineFilter]);

  useEffect(() => {
    setTypeFilter(tabFilter.customFilters?.typeFilter || 'all');
  }, [tabFilter.customFilters?.typeFilter, setTypeFilter]);

  useEffect(() => {
    setStrategicFilter(tabFilter.customFilters?.strategicFilter || 'all');
  }, [tabFilter.customFilters?.strategicFilter, setStrategicFilter]);

  useEffect(() => {
    if (tabFilter.search !== undefined) {
      setSearchTerm(tabFilter.search);
    }
  }, [tabFilter.search, setSearchTerm]);

  const protectedPct = validIpData.length > 0 ? ((protectedCount / validIpData.length) * 100).toFixed(1) : '0';
  const inPrepPct = validIpData.length > 0 ? ((inPrepCount / validIpData.length) * 100).toFixed(1) : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>งานทรัพย์สินทางปัญญา</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมสิทธิบัตร อนุสิทธิบัตร และสถานะการคุ้มครองทรัพย์สินทางปัญญา
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="purple"
          tabs={[
            { key: 'types_dept', label: 'ประเภททรัพย์สินทางปัญญาและสังกัด', icon: <FaCertificate style={{ fontSize: '13px' }} /> },
            { key: 'protection_status', label: 'สถานะการยื่นและคุ้มครอง', icon: <FaShieldAlt style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'อาจารย์และนักประดิษฐ์สูงสุด', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'รายการงานทรัพย์สินทางปัญญา', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="ip"
        totalCount={validIpData.length}
        filteredCount={filteredIpData.length}
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
            items={filteredIpData}
            categoryKey="ip"
            missionTitle="งานทรัพย์สินทางปัญญา"
            unitLabel="รายการ"
            showBudget={true}
          />
        </div>
      ) : activePerspective === 'table' ? (
        <div style={{ marginTop: '8px' }}>
          <MissionDataTable
            categoryKey="ip"
            items={validIpData}
            title="งานทรัพย์สินทางปัญญา"
          />
        </div>
      ) : (
        <>
          {activePerspective === 'types_dept' && (
            <>
              {/* ZONE 2: Executive Bento KPI Cards in Lavender Violet Palette */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <MissionKpiCard
                  mission="ip"
                  variant="pastel"
                  label="ทรัพย์สินทางปัญญาทั้งหมด"
                  value={validIpData.length}
                  unit="รายการ"
                  subtext={`อนุสิทธิบัตร ${pettyPatentCount} (95.2%) • สิทธิบัตรการประดิษฐ์ ${patentCount} (4.8%)`}
                  icon={<FaCertificate style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="ip"
                  variant="pastel"
                  label="ได้รับความคุ้มครองแล้ว"
                  value={protectedCount}
                  unit="รายการ"
                  subtext={`คิดเป็น ${protectedPct}% ของผลงานทั้งหมด • รอพิจารณาคำขอ ${pendingCount} รายการ`}
                  icon={<FaShieldAlt style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="ip"
                  variant="pastel"
                  label="อยู่ระหว่างเตรียมยื่นจด"
                  value={inPrepCount}
                  unit="รายการ"
                  subtext={`คิดเป็น ${inPrepPct}% (คอขวดเร่งด่วน) • รอยื่นเอกสารรับเลขคำขอ`}
                  icon={<FaHourglassHalf style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="ip"
                  variant="pastel"
                  label="งบสนับสนุนที่คณะจ่ายจริง"
                  value={totalSupportAmount.toLocaleString('th-TH')}
                  unit="บาท"
                  subtext="สนับสนุนแล้ว 12 รายการ (@20,000 บ.) • รอพิจารณา 9 รายการ"
                  icon={<FaCoins style={{ fontSize: '16px' }} />}
                />
              </div>

              {/* ZONE 2.5: Year-over-Year (YoY) Comparison */}
              <MissionYoYControls
                missionKey="ip"
                missionTitle="งานทรัพย์สินทางปัญญา"
                allItemsRaw={validIpData}
                activeDepartment={deptFilter}
                primaryMetricLabel="จำนวนคำขอ/จดทะเบียน (รายการ)"
                secondaryMetricLabel="งบสนับสนุน (ล้านบาท)"
                hasBudgetMetric={true}
                defaultBaseYear="2567"
                defaultTargetYear="2568"
              />
            </>
          )}

          {/* ZONE 3: 4 Dimension Tabs Charts */}
          <IPCharts
            validIpData={filteredIpData}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectDept={(dept) => {
              const nextDept = dept === deptFilter ? 'all' : dept;
              setDeptFilter(nextDept);
            }}
            onSelectType={(type) => {
              const nextType = type === typeFilter ? 'all' : type;
              setTypeFilter(nextType);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  typeFilter: nextType,
                },
              });
            }}
          />
        </>
      )}
    </div>
  );
}
