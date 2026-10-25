'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts } from './AcademicCharts';
import { AcademicTable } from './AcademicTable';

export function AcademicView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    displayData,
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    uniqueHeads,
    uniqueClients,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
  } = useAcademicData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const allocMillions = (totalAllocated15 / 1000000).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={validData.length}
      />
      <div className="tab-content active" style={{ position: 'relative' }}>
        <KpiGrid
          items={[
            {
              label: 'โครงการพัฒนาวิชาการ',
              value: `${validData.length} โครงการ`,
              subtext: `หัวหน้าโครงการ ${uniqueHeads.size} ท่าน`,
              accentColor: '#1565c0',
            },
            {
              label: 'งบประมาณรวม',
              value: `${budgetMillions} ล้านบาท`,
              subtext: `${totalBudgetAll.toLocaleString('th-TH')} บาท`,
              accentColor: '#059669',
            },
            {
              label: 'การจัดสรรรายได้ (รวม 15%)',
              value: `${allocMillions} ล้านบาท`,
              subtext: `คณะ 5% (${(totalAllocFaculty / 1000000).toFixed(2)}M) • ภาคฯ 5% • มก. 5%`,
              accentColor: '#00A651',
            },
            {
              label: 'ผู้ขอรับบริการภายนอก',
              value: `${uniqueClients.size} หน่วยงาน`,
              subtext: `งบดำเนินงานคงเหลือ 85% (${(totalAllocRemaining / 1000000).toFixed(2)} ล้านบาท)`,
              accentColor: '#0284c7',
            },
          ]}
        />

        <AcademicCharts
          validData={validData}
          totalAllocFaculty={totalAllocFaculty}
          totalAllocDept={totalAllocDept}
          totalAllocKu={totalAllocKu}
          totalAllocRemaining={totalAllocRemaining}
          onSelectClient={(client) => setSelectedClient(client === selectedClient ? 'all' : client)}
        />

        <AcademicTable
          displayData={displayData}
          totalCount={validData.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedClient={selectedClient}
          onClientChange={setSelectedClient}
        />
      </div>
    </div>
  );
}
