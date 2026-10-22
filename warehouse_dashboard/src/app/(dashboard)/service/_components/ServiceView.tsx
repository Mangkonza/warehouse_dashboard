'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceKpiGrid } from './ServiceKpiGrid';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';
import { ServiceDecisionBox } from './ServiceDecisionBox';

export function ServiceView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
  } = useServiceData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <ServiceKpiGrid
          totalCount={validData.length}
          personCount={uniquePersons.size}
          targetCount={uniqueTargets.size}
          deptCount={uniqueDepts.size}
        />

        <ServiceTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ServiceCharts validData={validData} />

        <ServiceDecisionBox />
      </div>
    </div>
  );
}
