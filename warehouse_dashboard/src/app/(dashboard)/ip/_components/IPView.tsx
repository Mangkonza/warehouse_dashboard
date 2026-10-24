'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts } from './IPCharts';
import { IPTable } from './IPTable';

export function IPView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    pettyPatentCount,
    protectedCount,
    pendingCount,
    totalSupportAmount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
    typeFilter,
    setTypeFilter,
  } = useIPData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={validIpData.length}
      />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              value: `${validIpData.length} รายการ`,
              label: 'ทรัพย์สินทางปัญญาทั้งหมด',
              subtext: `อนุสิทธิบัตร ${pettyPatentCount} • สิทธิบัตร ${patentCount}`,
              accentColor: '#6a1b9a',
            },
            {
              value: `${protectedCount} รายการ`,
              label: 'ได้รับการจดทะเบียน / คุ้มครองแล้ว',
              subtext: `อยู่ระหว่างยื่นคำขอ ${pendingCount} รายการ`,
              accentColor: '#00A651',
            },
            {
              value: `${uniqueDeptCount} ภาควิชา`,
              label: 'ภาควิชาที่มีการยื่นทรัพย์สินทางปัญญา',
              accentColor: '#0284c7',
            },
            {
              value: `${totalSupportAmount.toLocaleString('th-TH')} บาท`,
              label: 'งบสนับสนุนรางวัลและค่าธรรมเนียม',
              accentColor: '#059669',
            },
          ]}
        />

        <IPCharts
          validIpData={validIpData}
          onSelectDept={(dept) => setDeptFilter(dept === deptFilter ? 'all' : dept)}
          onSelectType={(type) => setTypeFilter(type === typeFilter ? 'all' : type)}
        />

        <IPTable
          filteredIpData={filteredIpData}
          totalCount={validIpData.length}
          availableDepts={availableDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          deptFilter={deptFilter}
          onDeptChange={setDeptFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
      </div>
    </div>
  );
}
