'use client';

import React from 'react';
import { useTimeFilter } from '@/features/time-filter';
import { TimeFilterBar } from '@/features/time-filter';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchKpiGrid } from './ResearchKpiGrid';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';
import { ResearchDecisionBox } from './ResearchDecisionBox';

export function ResearchView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    totalBudgetAll,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
  } = useResearchData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <ResearchKpiGrid
          totalCount={validData.length}
          totalBudgetAll={totalBudgetAll}
          deptCount={uniqueDepts.size}
          fundCount={uniqueFunds.size}
        />

        <ResearchCharts validData={validData} />

        <ResearchTable
          filteredData={filteredData}
          uniqueDepts={uniqueDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
        />

        <ResearchDecisionBox />
      </div>
    </div>
  );
}
