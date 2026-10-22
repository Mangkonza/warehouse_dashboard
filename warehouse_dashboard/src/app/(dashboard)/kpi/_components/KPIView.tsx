'use client';

import React from 'react';
import { useTimeFilter } from '@/features/time-filter';
import { useKpiData } from '../_hooks/useKpiData';
import { KpiHeaderToolbar } from './KpiHeaderToolbar';
import { KpiSummaryCards } from './KpiSummaryCards';
import { KpiFilterBar } from './KpiFilterBar';
import { KpiGridCards } from './KpiGridCards';

export function KPIView() {
  const { timeFilter } = useTimeFilter();
  const {
    filteredKPIs,
    overallStats,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    expandedId,
    setExpandedId,
    isRefreshing,
    loadLiveData,
  } = useKpiData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <KpiHeaderToolbar
        timeFilter={timeFilter}
        isRefreshing={isRefreshing}
        onRefresh={loadLiveData}
      />

      <KpiSummaryCards stats={overallStats} />

      <KpiFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      <KpiGridCards
        filteredKPIs={filteredKPIs}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
      />
    </div>
  );
}
