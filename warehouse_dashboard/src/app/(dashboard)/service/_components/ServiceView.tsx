'use client';

import React, { useEffect, useMemo } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useServiceData, extractAcademicPersonsFromService } from '../_hooks/useServiceData';
import { ServiceCharts, ServicePerspective } from './ServiceCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaChartLine, FaBuilding, FaUserTie, FaLeaf, FaHandshake, FaUsers, FaGlobeAsia, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { ExecutiveKpiDeck } from '@/components/data-display/ExecutiveKpiDeck';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';

const VALID_SERVICE_TABS: ServicePerspective[] = [
  'timeline_type',
  'department',
  'faculty',
  'sdg',
  'table',
];

export function ServiceView() {
  const [activePerspective, setActivePerspective] = usePerspectiveTab<ServicePerspective>(
    'service',
    VALID_SERVICE_TABS,
    'timeline_type'
  );
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('service');

  const { setIsTimeModalOpen } = useTimeFilter('service');

  const {
    validData,
    allItems,
    undatedCount,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    fiscalYear,
    setFiscalYear,
    selectedRole,
    setSelectedRole,
    strategicFilter,
    setStrategicFilter,
  } = useServiceData(timeFilter);

  // Synchronize tabFilter to useServiceData internal states
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  useEffect(() => {
    setFiscalYear(tabFilter.fiscalYear || 'all');
  }, [tabFilter.fiscalYear, setFiscalYear]);

  useEffect(() => {
    setSelectedRole(tabFilter.customFilters?.selectedRole || 'all');
  }, [tabFilter.customFilters?.selectedRole, setSelectedRole]);

  useEffect(() => {
    setStrategicFilter(tabFilter.customFilters?.strategicFilter || 'all');
  }, [tabFilter.customFilters?.strategicFilter, setStrategicFilter]);

  useEffect(() => {
    if (tabFilter.search !== undefined) {
      setSearchTerm(tabFilter.search);
    }
  }, [tabFilter.search, setSearchTerm]);

  const avgPerMonth = (validData.length / 12).toFixed(1);
  const avgPerStaff = uniquePersons.size > 0 ? (validData.length / uniquePersons.size).toFixed(1) : '0';

  const expertCount = validData.filter((d: any) => {
    const t = String(d._resolvedType || d.service_type || '');
    return t.includes('ผู้ทรงคุณวุฒิ') || t.includes('ประเมิน') || t.includes('กรรมการ');
  }).length;
  const directServiceCount = Math.max(0, validData.length - expertCount);
  const expertPct = validData.length > 0 ? ((expertCount / validData.length) * 100).toFixed(1) : '0';
  const directPct = validData.length > 0 ? ((directServiceCount / validData.length) * 100).toFixed(1) : '0';
  const serviceSplitRatio = validData.length > 0 ? expertCount / validData.length : 0.5;

  const serviceSegments = useMemo(() => {
    return [
      {
        label: 'วิชาการ/วิชาชีพ',
        value: directServiceCount,
        displayValue: `${directServiceCount} ครั้ง`,
        unit: 'ครั้ง',
        percent: parseFloat(directPct) || 0,
        color: '#fde68a',
      },
      {
        label: 'ผู้ทรงคุณวุฒิ/ประเมิน',
        value: expertCount,
        displayValue: `${expertCount} ครั้ง`,
        unit: 'ครั้ง',
        percent: parseFloat(expertPct) || 0,
        color: '#f59e0b',
      },
    ].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0));
  }, [directServiceCount, expertCount, directPct, expertPct]);

  const totalServiceHours = validData.reduce((sum: number, d: any) => {
    const h = parseFloat(d.hours_spent ?? d.hoursSpent ?? d.hours ?? 0);
    return sum + (!isNaN(h) && h > 0 ? h : 0);
  }, 0);

  const FACULTY_STAFF_BASELINE = 82; // บุคลากรสายวิชาการประจำ 7 ภาควิชา
  const participationPct = Math.min(100, Math.round((uniquePersons.size / FACULTY_STAFF_BASELINE) * 100));

  const personFreq: Record<string, number> = {};
  validData.forEach((d: any) => {
    const names = extractAcademicPersonsFromService(d.person || '');
    names.forEach((p) => {
      personFreq[p] = (personFreq[p] || 0) + 1;
    });
  });
  const maxWorkload = Math.max(10, ...Object.values(personFreq));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>งานบริการวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมผลผลิตบริการวิชาการ ผู้ให้บริการ และผลกระทบต่อสังคม
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ position: 'relative', width: '100%', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="amber"
          tabs={[
            { key: 'timeline_type', label: 'แนวโน้มและประเภทงานบริการ', icon: <FaChartLine style={{ fontSize: '13px' }} /> },
            { key: 'department', label: 'การให้บริการรายสังกัด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'บุคลากรผู้ให้ผู้บริการสูงสุด', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'รายการงานบริการวิชาการ', icon: <FaTable style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="service"
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
            items={validData}
            categoryKey="service"
            missionTitle="งานบริการวิชาการ"
            unitLabel="โครงการ"
            showBudget={true}
          />
        </div>
      ) : activePerspective === 'table' ? (
        <div style={{ marginTop: '8px' }}>
          <MissionDataTable
            categoryKey="service"
            items={validData}
            title="งานบริการวิชาการ"
          />
        </div>
      ) : (
        <>
          {activePerspective === 'timeline_type' && (
            <>
              {/* ZONE 2: Executive Blueprint KPI Deck */}
              <ExecutiveKpiDeck
                mission="service"
                blueprintCard={{
                  label: 'งานบริการวิชาการทั้งหมด',
                  value: validData.length,
                  unit: 'ครั้ง',
                  segments: serviceSegments,
                }}
                gearCard={{
                  label: 'จำนวนชั่วโมงที่ให้บริการทั้งหมด',
                  value: totalServiceHours.toLocaleString(),
                  unit: 'ชั่วโมง',
                  gearValue: uniqueDepts.size,
                  gearLabel: 'สังกัด',
                }}
                items={validData}
                tallyCard={{
                  label: 'บุคลากรผู้ให้บริการวิชาการ',
                  chip: `${participationPct}% มีส่วนร่วม`,
                  value: uniquePersons.size,
                  unit: `จาก ${FACULTY_STAFF_BASELINE} ท่าน`,
                  percent: participationPct,
                  totalCount: FACULTY_STAFF_BASELINE,
                  activeCount: uniquePersons.size,
                }}
                rulerCard={{
                  label: 'ภาระงานเฉลี่ยต่อบุคลากร',
                  value: avgPerStaff,
                  unit: 'ครั้ง/ท่าน',
                  current: parseFloat(avgPerStaff) || 0,
                  max: maxWorkload,
                  marks: [
                    { label: '0', positionPercent: 2 },
                    { label: Math.round(maxWorkload / 3).toString(), positionPercent: 33 },
                    { label: Math.round((maxWorkload * 2) / 3).toString(), positionPercent: 66 },
                    { label: `สูงสุด ${maxWorkload}`, positionPercent: 96 },
                  ],
                }}
              />
            </>
          )}

          {/* ZONE 3: 4 Dimension Tabs Charts */}
          <ServiceCharts
            validData={validData}
            allItems={allItems || validData}
            currentFiscalYear={tabFilter.fiscalYear || 'all'}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectDept={(dept) => {
              const nextDept = dept === selectedDept ? 'all' : dept;
              setSelectedDept(nextDept);
            }}
            onSelectType={(type) => {
              const nextRole = type === selectedRole ? 'all' : type;
              setSelectedRole(nextRole);
              setTabFilter({
                customFilters: {
                  ...(tabFilter.customFilters || {}),
                  selectedRole: nextRole,
                },
              });
            }}
            onSelectPerson={(person) => {
              const nextPerson = searchTerm === person ? '' : person;
              setSearchTerm(nextPerson);
              setTabFilter({ search: nextPerson });
            }}
          />
        </>
      )}
    </div>
  );
}
