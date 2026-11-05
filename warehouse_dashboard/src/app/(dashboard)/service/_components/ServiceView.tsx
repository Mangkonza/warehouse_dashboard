'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts, ServicePerspective } from './ServiceCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaChartLine, FaBuilding, FaUserTie, FaLeaf, FaHandshake, FaUsers, FaGlobeAsia, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { MissionKpiCard } from '@/components/data-display/MissionKpiCard';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';

export function ServiceView() {
  const [activePerspective, setActivePerspective] = React.useState<ServicePerspective>('timeline_type');
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('service');

  const { setIsTimeModalOpen } = useTimeFilter('service');

  const {
    validData,
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
    setSelectedDept(tabFilter.department || 'all');
  }, [tabFilter.department, setSelectedDept]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>งานบริการวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมผลผลิตบริการวิชาการ ผู้ให้บริการ และผลกระทบต่อสังคม
        </p>
      </div>

      {/* Top Segmented Tabs - Style identical to manage?tab=research */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="amber"
          tabs={[
            { key: 'timeline_type', label: 'แนวโน้มและประเภทงานบริการ', icon: <FaChartLine style={{ fontSize: '13px' }} /> },
            { key: 'department', label: 'การให้บริการรายสังกัด', icon: <FaBuilding style={{ fontSize: '13px' }} /> },
            { key: 'faculty', label: 'อาจารย์และผู้ให้บริการสูงสุด', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'sdg', label: 'ความสอดคล้องเชิงยุทธศาสตร์ (SDGs / ISEE IAM)', icon: <FaLeaf style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'ตารางข้อมูลงานบริการวิชาการ', icon: <FaTable style={{ fontSize: '13px' }} /> },
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
        showDepartment={true}
        showStrategic={true}
        showDetailedTime={true}
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{ position: 'static', backdropFilter: 'none', backgroundColor: dashboardTheme.colors.surface, borderRadius: `${dashboardTheme.radius.card}px`, boxShadow: 'none' }}
      >
        {/* Smart Activity Role Dropdown */}
        <select
          value={selectedRole}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedRole(val);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                selectedRole: val,
              },
            });
          }}
          style={{
            padding: '5px 10px',
            borderRadius: '9px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            cursor: 'pointer',
            fontWeight: 500,
            outline: 'none',
            height: '32px',
            boxSizing: 'border-box',
            maxWidth: '200px',
          }}
          aria-label="เลือกลักษณะบทบาท"
        >
          <option value="all">ทุกลักษณะบทบาท</option>
          <option value="คณะกรรมการ/อนุกรรมการ/คณะทำงาน">คณะกรรมการ/อนุกรรมการ</option>
          <option value="วิทยากร/บรรยายพิเศษ">วิทยากร/บรรยายพิเศษ</option>
          <option value="ผู้ทรงคุณวุฒิ/ประเมินผลงาน">ผู้ทรงคุณวุฒิ/ประเมิน</option>
          <option value="ศึกษาดูงาน/ต้อนรับ">ศึกษาดูงาน/ต้อนรับ</option>
          <option value="กรรมการสอบวิทยานิพนธ์ภายนอก">กรรมการสอบวิทยานิพนธ์</option>
          <option value="ที่ปรึกษา/บริการวิชาชีพ/ตรวจวัด">ที่ปรึกษา/บริการวิชาชีพ</option>
          <option value="งานบริการวิชาการอื่นๆ">งานอื่นๆ</option>
        </select>
      </DashboardTabFilterBar>

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
              {/* ZONE 2: Executive Bento KPI Cards in Amber Peach Palette */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                }}
              >
                <MissionKpiCard
                  mission="service"
                  variant="pastel"
                  label="งานบริการวิชาการทั้งหมด"
                  value={validData.length}
                  unit="ครั้ง"
                  subtext={`เฉลี่ย ~${avgPerMonth} ครั้ง/เดือน • ม.ค. พีคสูงสุด (43-47 ครั้ง)`}
                  icon={<FaHandshake style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="service"
                  variant="pastel"
                  label="บุคลากรผู้ให้บริการวิชาการ"
                  value={uniquePersons.size}
                  unit="ท่าน"
                  subtext={`เฉลี่ย ${avgPerStaff} ครั้ง/ท่าน • สูงสุด รศ.ดร.บัญชา (54 ครั้ง)`}
                  icon={<FaUsers style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="service"
                  variant="pastel"
                  label="เครือข่ายผู้รับบริการภายนอก"
                  value={uniqueTargets.size}
                  unit="หน่วยงาน"
                  subtext="ครอบคลุมหน่วยงานรัฐ ชุมชน เอกชน และสากล"
                  icon={<FaGlobeAsia style={{ fontSize: '16px' }} />}
                />

                <MissionKpiCard
                  mission="service"
                  variant="pastel"
                  label="หน่วยงานที่ร่วมดำเนินการ"
                  value={10}
                  unit="หน่วยงาน"
                  subtext="7 สังกัด • 3 ศูนย์วิจัย (บุคลากรมีส่วนร่วม 100%)"
                  icon={<FaBuilding style={{ fontSize: '16px' }} />}
                />
              </div>

              {/* ZONE 2.5: Year-over-Year (YoY) Comparison */}
              <MissionYoYControls
                missionKey="service"
                missionTitle="งานบริการวิชาการ"
                allItemsRaw={validData}
                activeDepartment={selectedDept}
                primaryMetricLabel="จำนวนโครงการบริการวิชาการ (งาน)"
                secondaryMetricLabel="ชั่วโมงให้บริการ (ชม.)"
                hasBudgetMetric={false}
                defaultBaseYear="2567"
                defaultTargetYear="2568"
              />
            </>
          )}

          {/* ZONE 3: 4 Dimension Tabs Charts */}
          <ServiceCharts
            validData={validData}
            activePerspective={activePerspective}
            onChangePerspective={setActivePerspective}
            hideSelector={true}
            onSelectDept={(dept) => {
              const nextDept = dept === selectedDept ? 'all' : dept;
              setSelectedDept(nextDept);
              setTabFilter({ department: nextDept });
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
