'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid } from '@/components/data-display';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';

export function ServiceView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedType,
    setSelectedType,
  } = useServiceData(timeFilter);

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
              value: `${validData.length} ครั้ง`,
              label: 'กิจกรรมบริการวิชาการทั้งหมด',
              accentColor: '#e65100',
            },
            {
              value: `${uniquePersons.size} ท่าน`,
              label: 'อาจารย์และบุคลากรผู้ให้บริการ',
              subtext: `เฉลี่ย ${uniquePersons.size > 0 ? (validData.length / uniquePersons.size).toFixed(1) : 0} ครั้ง/ท่าน`,
              accentColor: '#00A651',
            },
            {
              value: `${uniqueTargets.size} หน่วยงาน`,
              label: 'กลุ่มเป้าหมายและชุมชนผู้รับบริการ',
              accentColor: '#0284c7',
            },
            {
              value: `${uniqueDepts.size || 7} ภาควิชา`,
              label: 'ภาควิชาและศูนย์ที่ร่วมดำเนินการ',
              accentColor: '#6a1b9a',
            },
          ]}
        />

        <ServiceCharts
          validData={validData}
          onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
          onSelectType={(type) => setSelectedType(type === selectedType ? 'all' : type)}
          onSelectPerson={(person) => setSearchTerm(searchTerm === person ? '' : person)}
        />

        <ServiceTable
          filteredData={filteredData}
          totalCount={validData.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>
    </div>
  );
}
