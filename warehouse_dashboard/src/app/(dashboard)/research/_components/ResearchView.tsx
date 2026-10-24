'use client';

import React from 'react';
import { FaFlask, FaCoins, FaTrophy, FaHandHoldingUsd } from 'react-icons/fa';
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
              icon: <FaFlask />,
              value: `${validData.length} โครงการ`,
              label: 'โครงการวิจัยทั้งหมด',
              subtext: `ครอบคลุม ${uniqueDepts.size} ภาควิชา`,
              accentColor: '#00A651',
            },
            {
              icon: <FaCoins />,
              value: `${budgetMillions} ล้านบาท`,
              label: 'งบประมาณวิจัยรวม',
              subtext: `${totalBudgetAll.toLocaleString('th-TH')} บาท`,
              accentColor: '#059669',
            },
            {
              icon: <FaHandHoldingUsd />,
              value: `${extMillions} / ${intMillions} ล้าน`,
              label: 'งบภายนอก / งบภายใน (บาท)',
              subtext: `สัดส่วนทุนภายนอก ${extPct}% (${uniqueFunds.size} แหล่งทุน)`,
              accentColor: '#0284c7',
            },
            {
              icon: <FaTrophy />,
              value: `${megaProjectsCount} โครงการ`,
              label: 'โครงการขนาดใหญ่ (≥ 10 ล้านบาท)',
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
