'use client';

import React from 'react';
import { FaBookOpen, FaTrophy, FaGlobeAmericas, FaAward, FaCoins } from 'react-icons/fa';
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
              icon: <FaBookOpen />,
              value: `${validData.length} เรื่อง`,
              label: 'ผลงานตีพิมพ์ทางวิชาการ',
              subtext: `นานาชาติ ${internationalCount} • ชาติ ${nationalCount}`,
              accentColor: '#2e7d32',
              onClick: () => setLevelFilter('all'),
            },
            {
              icon: <FaTrophy />,
              value: `${q1Count} เรื่อง`,
              label: 'ระดับ Scopus Q1',
              subtext: `${validData.length > 0 ? Math.round((q1Count / validData.length) * 100) : 0}% ของทั้งหมด`,
              accentColor: '#059669',
              onClick: () => setLevelFilter(levelFilter === 'Q1' ? 'all' : 'Q1'),
            },
            {
              icon: <FaGlobeAmericas />,
              value: `${q2Count} เรื่อง`,
              label: 'ระดับ Scopus Q2 - Q4',
              subtext: `${validData.length > 0 ? Math.round((q2Count / validData.length) * 100) : 0}% ของทั้งหมด`,
              accentColor: '#2563eb',
              onClick: () => setLevelFilter(levelFilter === 'Q2' ? 'all' : 'Q2'),
            },
            {
              icon: <FaAward />,
              value: `${tciCount} เรื่อง`,
              label: 'ระดับ TCI (ชาติ)',
              subtext: `เตรียมอนุสิทธิบัตร/อื่นๆ ${otherCount} รายการ`,
              accentColor: '#7c3aed',
              onClick: () => setLevelFilter(levelFilter === 'TCI' ? 'all' : 'TCI'),
            },
            {
              icon: <FaCoins />,
              value: `${totalSupportBudget.toLocaleString('th-TH')} บาท`,
              label: 'เงินสนับสนุนการตีพิมพ์รวม',
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
