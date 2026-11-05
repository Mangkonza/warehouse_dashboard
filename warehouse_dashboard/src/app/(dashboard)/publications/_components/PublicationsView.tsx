'use client';

import React, { useEffect } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { MissionKpiCard } from '@/components/data-display/MissionKpiCard';
import { MissionYoYControls } from '@/components/data-display/MissionYoYControls';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaBook, FaGlobeAmericas, FaAward, FaCoins } from 'react-icons/fa';

export function PublicationsView() {
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
    setSelectedDept(tabFilter.department || 'all');
  }, [tabFilter.department, setSelectedDept]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={dashboardPageTitleStyle}>ผลงานตีพิมพ์ทางวิชาการ</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมคุณภาพวารสาร เงินสนับสนุน และผลผลิตตีพิมพ์ของคณะวิศวกรรมศาสตร์
        </p>
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
        {/* Database Tier Dropdown */}
        <select
          value={levelFilter}
          onChange={(e) => {
            const val = e.target.value;
            setLevelFilter(val);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                levelFilter: val,
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
          aria-label="ระดับคุณภาพวารสาร"
        >
          <option value="all">ทุกระดับคุณภาพวารสาร</option>
          <option value="Q1">นานาชาติ Q1</option>
          <option value="Q2">นานาชาติ Q2</option>
          <option value="Q3">นานาชาติ Q3</option>
          <option value="Q4">นานาชาติ Q4</option>
          <option value="TCI 1">ระดับชาติ TCI กลุ่ม 1</option>
          <option value="TCI 2">ระดับชาติ TCI กลุ่ม 2</option>
          {confCount > 0 && <option value="conf">บทความประชุมวิชาการ</option>}
          {otherCount > 0 && <option value="other">อื่นๆ</option>}
        </select>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => {
            const val = e.target.value;
            setStatusFilter(val);
            setTabFilter({
              customFilters: {
                ...(tabFilter.customFilters || {}),
                statusFilter: val,
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
          aria-label="สถานะการตีพิมพ์"
        >
          <option value="all">ทุกสถานะการตีพิมพ์</option>
          <option value="published">ตีพิมพ์แล้ว</option>
          <option value="prep">อยู่ระหว่างเตรียมความพร้อม</option>
        </select>
      </DashboardTabFilterBar>

      {undatedCount > 0 && <UndatedNotice count={undatedCount} />}

      {/* ZONE 2: Executive Bento KPI Grid (Publications Rose Glow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        <MissionKpiCard
          mission="publications"
          variant="pastel"
          label="ผลงานตีพิมพ์ทางวิชาการรวม"
          value={validData.length}
          unit="เรื่อง"
          subtext={`ตีพิมพ์สำเร็จ ${publishedCount} • เตรียมความพร้อม ${inPrepCount}`}
          icon={<FaBook style={{ fontSize: '16px' }} />}
        />

        <MissionKpiCard
          mission="publications"
          variant="pastel"
          label="ผลงานระดับนานาชาติ (Q1 - Q4)"
          value={`${intlPct}%`}
          unit={`(${intlAllCount} เรื่อง)`}
          subtext={`Q1: ${q1Count} • Q2: ${q2Count} • Q3: ${q3Count} • Q4: ${q4Count}`}
          icon={<FaGlobeAmericas style={{ fontSize: '16px' }} />}
        />

        <MissionKpiCard
          mission="publications"
          variant="pastel"
          label="ผลงานระดับชาติ (TCI)"
          value={`${tciPct}%`}
          unit={`(${tciCount} เรื่อง)`}
          subtext={`TCI 1: ${tci1Count} • TCI 2: ${tci2Count}${confCount > 0 ? ` • ประชุม: ${confCount}` : ''}`}
          icon={<FaAward style={{ fontSize: '16px' }} />}
        />

        <MissionKpiCard
          mission="publications"
          variant="pastel"
          label="งบสนับสนุนการตีพิมพ์"
          value={totalSupportBudget.toLocaleString('th-TH')}
          unit="บาท"
          subtext={`เฉลี่ย ${avgSupport} ฿/เรื่อง • เงินรางวัลและค่าตีพิมพ์`}
          icon={<FaCoins style={{ fontSize: '16px' }} />}
        />
      </div>

      {/* ZONE 2.5: Year-over-Year (YoY) Comparison */}
      <MissionYoYControls
        missionKey="publications"
        missionTitle="ผลงานตีพิมพ์ทางวิชาการ"
        allItemsRaw={validData}
        activeDepartment={selectedDept}
        primaryMetricLabel="จำนวนบทความ (เรื่อง)"
        secondaryMetricLabel="งบสนับสนุน (ล้านบาท)"
        hasBudgetMetric={true}
        defaultBaseYear="2567"
        defaultTargetYear="2568"
      />

      {/* ZONE 3: Publications Charts */}
      <PublicationsCharts
        validData={filteredData}
        onSelectDept={(dept) => {
          const nextDept = dept === selectedDept ? 'all' : dept;
          setSelectedDept(nextDept);
          setTabFilter({ department: nextDept });
        }}
        onSelectLevel={(lvl) => {
          const nextLevel = lvl === levelFilter ? 'all' : lvl;
          setLevelFilter(nextLevel);
          setTabFilter({
            customFilters: {
              ...(tabFilter.customFilters || {}),
              levelFilter: nextLevel,
            },
          });
        }}
      />

      {/* ZONE 4: Publications Table with Strategy Badges & BibTeX/CSV Export */}
      <PublicationsTable
        filteredData={filteredData}
        searchTerm={searchTerm}
        onSearchChange={(s) => {
          setSearchTerm(s);
          setTabFilter({ search: s });
        }}
        levelFilter={levelFilter}
        onLevelChange={(lvl) => {
          setLevelFilter(lvl);
          setTabFilter({
            customFilters: {
              ...(tabFilter.customFilters || {}),
              levelFilter: lvl,
            },
          });
        }}
      />
    </div>
  );
}
