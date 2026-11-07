'use client';

import React, { useEffect, useMemo } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts, IPPerspective } from './IPCharts';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { StrategicAlignmentMatrix } from '@/components/data-display/StrategicAlignmentMatrix';
import { MissionDataTable } from '@/components/data-display/MissionDataTable';
import { FaCertificate, FaShieldAlt, FaUserTie, FaLeaf, FaHourglassHalf, FaCoins, FaTable } from 'react-icons/fa';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { ExecutiveKpiDeck } from '@/components/data-display/ExecutiveKpiDeck';
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
    allItems,
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
  const uniqueDepts = new Set(validIpData.map((d: any) => d.department_clean || d.department).filter(Boolean));
  const maxSupportCeiling = Math.max(420000, validIpData.length * 20000);

  // Unique creators across all validIpData items
  const uniqueCreators = useMemo(() => {
    const set = new Set<string>();
    validIpData.forEach((item: any) => {
      if (Array.isArray(item.inventors)) {
        item.inventors.forEach((inv: any) => {
          const n = typeof inv === 'string' ? inv : inv?.name;
          let clean = String(n || '').replace(/\s+/g, ' ').trim();
          clean = clean.replace(/^(ศ\.|รศ\.|ผศ\.|อ\.|ดร\.)\s+/g, '$1');
          if (clean && clean !== '-' && clean !== 'nan' && clean !== 'NaT') {
            set.add(clean);
          }
        });
      }
      const raw = String(item.creator || '').trim();
      if (raw && raw !== '-' && raw !== 'nan' && raw !== 'NaT') {
        const parts = raw.split(/[,;\n]/);
        parts.forEach((p) => {
          let clean = p.replace(/\s+/g, ' ').trim();
          clean = clean.replace(/^(ศ\.|รศ\.|ผศ\.|อ\.|ดร\.)\s+/g, '$1');
          if (clean && clean !== '-' && clean !== 'nan' && clean !== 'NaT') {
            set.add(clean);
          }
        });
      }
    });
    return set;
  }, [validIpData]);

  // IP Types breakdown segments for Card 1
  const ipSegments = useMemo(() => {
    const counts: Record<string, number> = {};
    validIpData.forEach((item: any) => {
      const rawType = String(item.type || item.category || '').trim();
      let norm = 'อื่นๆ';
      if (rawType.includes('อนุสิทธิบัตร')) norm = 'อนุสิทธิบัตร';
      else if (rawType.includes('สิทธิบัตรการประดิษฐ์') || rawType === 'สิทธิบัตร') norm = 'สิทธิบัตรการประดิษฐ์';
      else if (rawType.includes('สิทธิบัตรการออกแบบ') || rawType.includes('ออกแบบ')) norm = 'สิทธิบัตรการออกแบบ';
      else if (rawType.includes('ลิขสิทธิ์')) norm = 'ลิขสิทธิ์';
      else if (rawType.includes('เครื่องหมายการค้า')) norm = 'เครื่องหมายการค้า';
      else if (rawType) norm = rawType;
      counts[norm] = (counts[norm] || 0) + 1;
    });

    const total = validIpData.length || 1;
    const colorMap: Record<string, string> = {
      'อนุสิทธิบัตร': '#a78bfa',
      'สิทธิบัตรการประดิษฐ์': '#c4b5fd',
      'สิทธิบัตรการออกแบบ': '#ddd6fe',
      'ลิขสิทธิ์': '#e9d5ff',
      'เครื่องหมายการค้า': '#f3e8ff',
      'อื่นๆ': '#cbd5e1',
    };

    return Object.entries(counts)
      .map(([name, count]) => ({
        label: name,
        value: count,
        displayValue: `${count} รายการ`,
        unit: 'รายการ',
        percent: Number(((count / total) * 100).toFixed(1)),
        color: colorMap[name] || '#a78bfa',
      }))
      .sort((a, b) => b.value - a.value);
  }, [validIpData]);

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
            { key: 'faculty', label: 'ผู้สร้างผลงานและนวัตกรรม', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
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
              {/* ZONE 2: Executive Blueprint KPI Deck */}
              <ExecutiveKpiDeck
                mission="ip"
                blueprintCard={{
                  label: 'ทรัพย์สินทางปัญญาทั้งหมด',
                  value: validIpData.length,
                  unit: 'รายการ',
                  segments: ipSegments,
                }}
                gearCard={{
                  label: 'จำนวนผู้สร้างผลงานทั้งหมด',
                  value: uniqueCreators.size,
                  unit: 'ท่าน',
                  gearValue: uniqueDepts.size,
                  gearLabel: 'สังกัด',
                }}
                items={validIpData}
                tallyCard={{
                  label: 'ได้รับความคุ้มครองแล้ว',
                  chip: `${protectedPct}%`,
                  value: protectedCount,
                  unit: `จาก ${validIpData.length} รายการ`,
                  percent: parseFloat(protectedPct) || 0,
                  totalCount: validIpData.length,
                  activeCount: protectedCount,
                }}
                rulerCard={{
                  label: 'งบสนับสนุนสะสมที่จัดสรรจริง',
                  value: totalSupportAmount.toLocaleString('th-TH'),
                  unit: 'บาท',
                  current: totalSupportAmount,
                  max: maxSupportCeiling,
                  marks: [
                    { label: '0', positionPercent: 2 },
                    { label: `${Math.round(maxSupportCeiling / 3000)}k`, positionPercent: 33 },
                    { label: `${Math.round((maxSupportCeiling * 2) / 3000)}k`, positionPercent: 66 },
                    { label: `เพดาน ${(maxSupportCeiling / 1000).toLocaleString('th-TH')} บ.`, positionPercent: 96 },
                  ],
                }}
              />
            </>
          )}

          {/* ZONE 3: 4 Dimension Tabs Charts */}
          <IPCharts
            validIpData={filteredIpData}
            allItems={allItems || validIpData}
            currentFiscalYear={tabFilter.fiscalYear || 'all'}
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
