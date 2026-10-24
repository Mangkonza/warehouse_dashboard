'use client';

import React from 'react';
import { FaHandsHelping, FaUserCheck, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';

export function ServiceView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
  } = useServiceData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              icon: <FaHandsHelping />,
              value: validData.length,
              label: 'กิจกรรมทั้งหมด',
            },
            {
              icon: <FaUserCheck />,
              value: uniquePersons.size,
              label: 'อาจารย์/ผู้รับผิดชอบ',
            },
            {
              icon: <FaChalkboardTeacher />,
              value: uniqueTargets.size,
              label: 'กลุ่มเป้าหมายผู้รับบริการ',
            },
            {
              icon: <FaBuilding />,
              value: uniqueDepts.size || 7,
              label: 'ภาควิชาที่มีส่วนร่วม',
            },
          ]}
        />

        <ServiceTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <ServiceCharts validData={validData} />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจ — งานบริการวิชาการ"
          items={[
            <>
              <strong>งานผู้ทรงคุณวุฒิ</strong>สัดส่วนสูงสุด อาจารย์เป็นที่ยอมรับในวงวิชาการ
            </>,
            <>
              กิจกรรมดำเนินอย่างต่อเนื่อง สะท้อน<strong>ความเข้มแข็งในการบริการสังคม</strong>ของคณะวิศวกรรมศาสตร์
            </>,
          ]}
        />
      </div>
    </div>
  );
}
