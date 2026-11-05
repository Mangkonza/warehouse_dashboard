'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts, AcademicPerspective } from './AcademicCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaCoins, FaHandshake, FaLeaf, FaChartLine, FaBuilding, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { MissionKpiCard } from '@/components/data-display/MissionKpiCard';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaGraduationCap, FaHandHoldingUsd, FaTrophy, FaUserTie } from 'react-icons/fa';

export function AcademicView() {
  const [activePerspective, setActivePerspective] = React.useState<AcademicPerspective>('timeline_alloc');
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('academic');

  const { setIsTimeModalOpen } = useTimeFilter('academic');

  const {
    validData,
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
    setSelectedDept(tabFilter.department || 'all');
  }, [tabFilter.department, setSelectedDept]);

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

  const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>โครงการพัฒนาวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมงบประมาณ ผู้ว่าจ้าง และผลผลิตโครงการพัฒนาวิชาการของคณะวิศวกรรมศาสตร์
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
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE IAM)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'ตารางข้อมูลโครงการพัฒนาวิชาการ', icon: <FaTable style={{ fontSize: '13px' }} /> },
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
        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedMonth(val);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                selectedMonth: val,
              },
            });
          }}
          style={{
            padding: '5px 10px',
            borderRadius: '9px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            cursor: 'pointer',
            outline: 'none',
            height: '32px',
            boxSizing: 'border-box',
          }}
          aria-label="เลือกเดือนดำเนินงาน"
        >
          <option value="all">ทุกเดือน (ม.ค. - ธ.ค.)</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              เดือน {m}
            </option>
          ))}
          <option value="ไม่ระบุ">ไม่ระบุเดือน</option>
        </select>

        {/* Checkbox: Hide missing client */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            userSelect: 'none',
            padding: '4px 8px',
            borderRadius: '8px',
            backgroundColor: hideMissingClient ? '#f0f9ff' : 'transparent',
            border: hideMissingClient ? '1px solid #bae6fd' : '1px solid transparent',
            height: '32px',
            boxSizing: 'border-box',
          }}
        >
          <input
            type="checkbox"
            checked={hideMissingClient}
            onChange={(e) => {
              const checked = e.target.checked;
              setHideMissingClient(checked);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  hideMissingClient: checked,
                },
              });
            }}
            style={{ cursor: 'pointer', accentColor: '#0ea5e9' }}
          />
          <span>ซ่อนไม่ระบุลูกค้า</span>
        </label>
      </DashboardTabFilterBar>

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
              {/* ZONE 2: Executive Bento KPI Grid in Emerald Palette */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <MissionKpiCard
                  mission="academic"
                  variant="pastel"
                  label="งบประมาณโครงการรวม"
                  value={budgetMillions}
                  unit="ล้านบาท"
                  subtext={`ทั้งหมด ${validData.length} โครงการ • ดำเนินการสูงสุด ${topDeptBudgetM} ลบ.`}
                  icon={<FaCoins style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="academic"
                  variant="pastel"
                  label="รายได้จัดสรรสุทธิ (15%)"
                  value={allocMillions}
                  unit="ล้านบาท"
                  subtext={`คณะ ${facMillions} ลบ. • สังกัด ${depMillions} ลบ. • มหาวิทยาลัย ${kuMillions} ลบ.`}
                  icon={<FaHandHoldingUsd style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="academic"
                  variant="pastel"
                  label="มูลค่าเฉลี่ยต่อโครงการ"
                  value={avgMillions}
                  unit="ล้านบาท"
                  subtext={`สูงสุด ${maxMillions} ลบ. • ระบุผู้ว่าจ้างแล้ว ${specifiedClientsCount} หน่วยงาน`}
                  icon={<FaTrophy style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="academic"
                  variant="pastel"
                  label="หัวหน้าโครงการ"
                  value={uniqueHeads.size}
                  unit="ท่าน"
                  subtext={`งบดำเนินงาน 85% • ${remMillions} ล้านบาท`}
                  icon={<FaUserTie style={{ fontSize: '16px' }} />}
                />
              </div>

              <MissionYoYControls
                missionKey="academic"
                missionTitle="โครงการพัฒนาวิชาการ"
                allItemsRaw={validData}
                activeDepartment={selectedDept}
                primaryMetricLabel="จำนวนโครงการ (โครงการ)"
                secondaryMetricLabel="งบประมาณโครงการ (ล้านบาท)"
                hasBudgetMetric={true}
                defaultBaseYear="2567"
                defaultTargetYear="2568"
              />
            </>
          )}

          <AcademicCharts
            validData={displayData}
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
