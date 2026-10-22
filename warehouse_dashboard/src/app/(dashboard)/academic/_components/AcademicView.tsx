'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicKpiGrid } from './AcademicKpiGrid';
import { AcademicCharts } from './AcademicCharts';
import { AcademicTable } from './AcademicTable';
import { AcademicDecisionBox } from './AcademicDecisionBox';

export function AcademicView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    displayData,
    totalBudgetAll,
    uniqueHeads,
    uniqueClients,
    searchTerm,
    setSearchTerm,
  } = useAcademicData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active" style={{ position: 'relative' }}>
        <AcademicKpiGrid
          totalCount={validData.length}
          totalBudgetAll={totalBudgetAll}
          clientCount={uniqueClients.size}
          headCount={uniqueHeads.size}
        />

        <AcademicCharts validData={validData} />

        <AcademicTable
          displayData={displayData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <AcademicDecisionBox />
      </div>
    </div>
  );
}
