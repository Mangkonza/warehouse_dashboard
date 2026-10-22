'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useIPData } from '../_hooks/useIPData';
import { IPKpiGrid } from './IPKpiGrid';
import { IPCharts } from './IPCharts';
import { IPTable } from './IPTable';
import { IPDecisionBox } from './IPDecisionBox';

export function IPView() {
  const { timeFilter } = useTimeFilter();
  const {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
  } = useIPData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <IPKpiGrid
          totalCount={validIpData.length}
          patentCount={patentCount}
          deptCount={uniqueDeptCount}
        />

        <IPCharts totalIpCount={validIpData.length} />

        <IPTable
          filteredIpData={filteredIpData}
          availableDepts={availableDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          deptFilter={deptFilter}
          onDeptChange={setDeptFilter}
        />

        <IPDecisionBox
          totalIpCount={validIpData.length}
          patentCount={patentCount}
          uniqueDeptCount={uniqueDeptCount}
        />
      </div>
    </div>
  );
}
