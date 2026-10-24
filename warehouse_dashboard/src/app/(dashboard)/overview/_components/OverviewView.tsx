'use client';

import React, { useState } from 'react';
import { useTimeFilter } from '@/features/time-filter';
import { useOverviewData } from '../_hooks/useOverviewData';
import { OverviewHeaderToolbar } from './OverviewHeaderToolbar';
import { KpiScorecardGrid } from './KpiScorecardGrid';
import { BurnupCard } from './BurnupCard';
import { ActionListCard } from './ActionListCard';
import { PerspectiveSection } from './PerspectiveSection';
import { FaCheckCircle } from 'react-icons/fa';

export function OverviewView() {
  const { timeFilter } = useTimeFilter();
  const {
    isLiveFromDb,
    isRefreshing,
    snapshotToast,
    kpiScorecard,
    departmentStats,
    actionList,
    validResearch,
    fetchLiveData,
    handleExportMaster,
    handleSnapshot,
  } = useOverviewData(timeFilter);

  const [selectedBurnupKpi, setSelectedBurnupKpi] = useState('external_budget');

  const selectedKpi = kpiScorecard.find((k) => k.id === selectedBurnupKpi) || kpiScorecard[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast Alert */}
      {snapshotToast && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
          }}
        >
          <FaCheckCircle style={{ color: '#00e676' }} />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <OverviewHeaderToolbar
        isLiveFromDb={isLiveFromDb}
        isRefreshing={isRefreshing}
        onRefresh={fetchLiveData}
        onSnapshot={handleSnapshot}
        onExportMaster={handleExportMaster}
      />

      {/* 2. Core Strategic KPI Scorecard Cards */}
      <KpiScorecardGrid
        scorecards={kpiScorecard}
        selectedBurnupId={selectedBurnupKpi}
        onSelectKpi={setSelectedBurnupKpi}
      />

      {/* 3. Middle Row: Burn-up Chart + Early Warning Action List */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {selectedKpi && <BurnupCard selectedKpi={selectedKpi} />}
        <ActionListCard actionList={actionList} />
      </div>

      {/* 4. Strategic Perspectives Section */}
      <PerspectiveSection
        departmentStats={departmentStats}
        validResearch={validResearch}
      />
    </div>
  );
}
