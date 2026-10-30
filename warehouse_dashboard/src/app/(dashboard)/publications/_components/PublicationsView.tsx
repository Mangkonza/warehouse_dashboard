'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';

export function PublicationsView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
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
    selectedDept,
    setSelectedDept,
    fiscalYearFilter,
    setFiscalYearFilter,
    availableFiscalYears,
  } = usePublicationsData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={validData.length}
      />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              label: 'ผลงานตีพิมพ์ทางวิชาการ',
              value: `${validData.length} เรื่อง`,
              subtext: `ตีพิมพ์สำเร็จ ${publishedCount} • เตรียมความพร้อม ${inPrepCount} เรื่อง`,
              accentColor: '#2e7d32',
              active: levelFilter === 'all',
              onClick: () => setLevelFilter('all'),
            },
            {
              label: 'ระดับ Q1',
              value: `${q1Count} เรื่อง`,
              subtext: `${validData.length > 0 ? Math.round((q1Count / validData.length) * 100) : 0}% ของทั้งหมด`,
              accentColor: '#059669',
              active: levelFilter === 'Q1',
              onClick: () => setLevelFilter(levelFilter === 'Q1' ? 'all' : 'Q1'),
            },
            {
              label: 'ระดับ Q2 - Q4',
              value: `${q2Count} เรื่อง`,
              subtext: `${validData.length > 0 ? Math.round((q2Count / validData.length) * 100) : 0}% ของทั้งหมด`,
              accentColor: '#2563eb',
              active: levelFilter === 'Q2',
              onClick: () => setLevelFilter(levelFilter === 'Q2' ? 'all' : 'Q2'),
            },
            {
              label: 'ระดับ TCI (ชาติ)',
              value: `${tciCount} เรื่อง`,
              subtext: `TCI กลุ่ม 1 และ 2 (${otherCount > 0 ? `อื่นๆ ${otherCount}` : 'ระดับชาติ'})`,
              accentColor: '#7c3aed',
              active: levelFilter === 'TCI',
              onClick: () => setLevelFilter(levelFilter === 'TCI' ? 'all' : 'TCI'),
            },
            {
              label: 'เงินสนับสนุนการตีพิมพ์รวม',
              value: `${totalSupportBudget.toLocaleString('th-TH')} บาท`,
              subtext: `เฉลี่ย ${validData.length > 0 ? Math.round(totalSupportBudget / validData.length).toLocaleString('th-TH') : 0} บาท/เรื่อง`,
              accentColor: '#00A651',
            },
          ]}
        />

        <PublicationsCharts
          validData={validData}
          onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
          onSelectLevel={(lvl) => setLevelFilter(lvl === levelFilter ? 'all' : lvl)}
        />

        <PublicationsTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          fiscalYearFilter={fiscalYearFilter}
          onFiscalYearChange={setFiscalYearFilter}
          availableFiscalYears={availableFiscalYears}
        />
      </div>
    </div>
  );
}
