'use client';

import React from 'react';
import { FaFlask, FaCoins, FaBuilding, FaHandHoldingUsd } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';

export function ResearchView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    totalBudgetAll,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
  } = useResearchData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              icon: <FaFlask />,
              value: validData.length,
              label: 'โครงการวิจัยทั้งหมด',
            },
            {
              icon: <FaCoins />,
              value: `฿${budgetMillions}M`,
              label: 'งบประมาณรวม',
            },
            {
              icon: <FaBuilding />,
              value: uniqueDepts.size,
              label: 'ภาควิชาที่เกี่ยวข้อง',
            },
            {
              icon: <FaHandHoldingUsd />,
              value: uniqueFunds.size,
              label: 'แหล่งทุนวิจัย',
            },
          ]}
        />

        <ResearchCharts validData={validData} />

        <ResearchTable
          filteredData={filteredData}
          uniqueDepts={uniqueDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจ — โครงการวิจัย"
          items={[
            <>
              <strong>งบประมาณส่วนใหญ่</strong> มาจากแหล่งทุนภายนอก โดยเฉพาะจาก วช. และ สวก.
            </>,
            <>
              <strong>ภาควิชาที่มีงบวิจัยสูงสุด</strong> คือ วิศวกรรมชลประทานและวิศวกรรมการอาหาร
            </>,
          ]}
        />
      </div>
    </div>
  );
}
