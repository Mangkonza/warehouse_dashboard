'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';

export function ResearchView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFund,
    setSelectedFund,
  } = useResearchData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const extMillions = (totalExternalBudget / 1000000).toFixed(2);
  const intMillions = (totalInternalBudget / 1000000).toFixed(2);
  const extPct = totalBudgetAll > 0 ? Math.round((totalExternalBudget / totalBudgetAll) * 100) : 0;

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
              label: 'โครงการวิจัยทั้งหมด',
              value: `${validData.length} โครงการ`,
              subtext: `ครอบคลุม ${uniqueDepts.size} ภาควิชา`,
              accentColor: '#00A651',
            },
            {
              label: 'งบประมาณวิจัยรวม',
              value: `${budgetMillions} ล้านบาท`,
              subtext: `${totalBudgetAll.toLocaleString('th-TH')} บาท`,
              accentColor: '#059669',
            },
            {
              label: 'สัดส่วนงบภายนอก / ภายใน',
              value: `${extMillions} / ${intMillions} ล้าน`,
              subtext: `ทุนภายนอก ${extPct}% (${uniqueFunds.size} แหล่งทุน)`,
              accentColor: '#0284c7',
            },
            {
              label: 'โครงการขนาดใหญ่ (≥ 10 ล้านบาท)',
              value: `${megaProjectsCount} โครงการ`,
              subtext: 'เป้าหมาย 5 โครงการ/ปี',
              accentColor: '#d97706',
            },
          ]}
        />

        <ResearchCharts
          validData={validData}
          selectedDept={selectedDept}
          onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
          selectedFund={selectedFund}
          onSelectFund={(fund) => setSelectedFund(fund === selectedFund ? 'all' : fund)}
        />

        <ResearchTable
          filteredData={filteredData}
          uniqueDepts={uniqueDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          selectedFund={selectedFund}
          onFundChange={setSelectedFund}
        />
      </div>
    </div>
  );
}
