'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsKpiGrid } from './PublicationsKpiGrid';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';
import { PublicationsDecisionBox } from './PublicationsDecisionBox';

export function PublicationsView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
  } = usePublicationsData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <PublicationsKpiGrid
          totalCount={validData.length}
          q1Count={q1Count}
          q2Count={q2Count}
          tciCount={tciCount}
          otherCount={otherCount}
        />

        <PublicationsCharts validData={validData} />

        <PublicationsTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
        />

        <PublicationsDecisionBox />
      </div>
    </div>
  );
}
