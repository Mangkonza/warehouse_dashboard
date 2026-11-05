'use client';

import React from 'react';
import { useTimeFilter } from '@/features/time-filter';
import { useKpiData } from '../_hooks/useKpiData';
import { KpiHeaderToolbar } from './KpiHeaderToolbar';
import { KpiSummaryCards } from './KpiSummaryCards';
import { KpiFilterBar } from './KpiFilterBar';
import { KpiGridCards } from './KpiGridCards';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { dashboardTheme } from '@/lib/dashboardTheme';

export function KPIView() {
  const { timeFilter, setIsTimeModalOpen } = useTimeFilter('kpi');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <KpiHeaderToolbar
        isRefreshing={isRefreshing}
        onRefresh={loadLiveData}
      />

      <DashboardTabFilterBar
        tabKey="kpi"
        totalCount={filteredKPIs.length}
        filteredCount={filteredKPIs.length}
        showFiscalYear={true}
        showDepartment={false}
        showStrategic={false}
        showDetailedTime={true}
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{
          position: 'static',
          backdropFilter: 'none',
          backgroundColor: dashboardTheme.colors.surface,
          borderRadius: `${dashboardTheme.radius.card}px`,
          boxShadow: 'none',
        }}
      />

      <KpiSummaryCards
        stats={overallStats}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

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
