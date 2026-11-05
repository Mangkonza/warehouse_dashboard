'use client';

import React from 'react';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import { useKpiData } from '../_hooks/useKpiData';
import { KpiHeaderToolbar } from './KpiHeaderToolbar';
import { KpiSummaryCards } from './KpiSummaryCards';
import { KpiFilterBar } from './KpiFilterBar';
import { KpiGridCards } from './KpiGridCards';
import { KpiStrategicTableView } from './KpiStrategicTableView';

export function KPIView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    filteredKPIs,
    reportingRounds,
    overallStats,
    selectedStrategy,
    setSelectedStrategy,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    selectedRound,
    setSelectedRound,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    expandedId,
    setExpandedId,
    isRefreshing,
    loadLiveData,
  } = useKpiData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <KpiHeaderToolbar
        timeFilter={timeFilter}
        isRefreshing={isRefreshing}
        onRefresh={loadLiveData}
        selectedRound={selectedRound}
        onSelectRound={setSelectedRound}
        reportingRounds={reportingRounds}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
      />

      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={filteredKPIs.length}
      />

      <KpiSummaryCards
        stats={overallStats}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      <KpiFilterBar
        selectedStrategy={selectedStrategy}
        onSelectStrategy={setSelectedStrategy}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {viewMode === 'table' ? (
        <KpiStrategicTableView
          filteredKPIs={filteredKPIs}
          selectedRound={selectedRound}
          reportingRounds={reportingRounds}
        />
      ) : (
        <KpiGridCards
          filteredKPIs={filteredKPIs}
          reportingRounds={reportingRounds}
          expandedId={expandedId}
          onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        />
      )}
    </div>
  );
}
