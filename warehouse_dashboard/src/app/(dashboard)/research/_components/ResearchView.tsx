'use client';

import React, { useMemo } from 'react';
import { FaFlask, FaCoins, FaTrophy, FaHandHoldingUsd } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';
import { getDepartment } from '@/lib/departments';

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

  const decisionInsights = useMemo(() => {
    const deptBudgets: Record<string, number> = {};
    const fundBudgets: Record<string, number> = {};
    validData.forEach((item) => {
      const b = (Number(item.budget_internal) || 0) + (Number(item.budget_external) || 0);
      const d = getDepartment(item.department).name;
      deptBudgets[d] = (deptBudgets[d] || 0) + b;
      const f = String(item.fund_source || '').replace('\n', ' ').trim();
      if (f && f !== 'nan' && f !== '-') {
        fundBudgets[f] = (fundBudgets[f] || 0) + b;
      }
    });
    const topDept = Object.entries(deptBudgets).sort((a, b) => b[1] - a[1])[0];
    const topFund = Object.entries(fundBudgets).sort((a, b) => b[1] - a[1])[0];

    return [
      <>
        <strong>โครงสร้างงบประมาณวิจัย:</strong> งบประมาณจากแหล่งทุนภายนอกคิดเป็น <strong>{extPct}%</strong> ({extMillions} ล้านบาท) และงบประมาณภายใน <strong>{100 - extPct}%</strong> ({intMillions} ล้านบาท)
      </>,
      <>
        <strong>ภาควิชาที่ได้รับทุนวิจัยสูงสุด:</strong>{' '}
        {topDept ? `${topDept[0]} (${(topDept[1] / 1000000).toFixed(2)} ล้านบาท)` : 'ไม่มีข้อมูล'} • แหล่งทุนหลัก:{' '}
        {topFund ? `${topFund[0]} (${(topFund[1] / 1000000).toFixed(2)} ล้านบาท)` : '-'}
      </>,
    ];
  }, [validData, extPct, extMillions, intMillions]);

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
              subtext: 'เป้าหมายยุทธศาสตร์คณะ 5 โครงการ/ปี',
              accentColor: '#d97706',
            },
          ]}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจผู้บริหาร — โครงการวิจัย"
          items={decisionInsights}
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
