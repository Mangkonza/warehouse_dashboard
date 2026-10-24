'use client';

import React from 'react';
import { FaGraduationCap, FaCoins, FaUsers, FaUserTie } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts } from './AcademicCharts';
import { AcademicTable } from './AcademicTable';

export function AcademicView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    displayData,
    totalBudgetAll,
    uniqueHeads,
    uniqueClients,
    searchTerm,
    setSearchTerm,
  } = useAcademicData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active" style={{ position: 'relative' }}>
        <KpiGrid
          items={[
            {
              icon: <FaGraduationCap />,
              value: validData.length,
              label: 'โครงการพัฒนาวิชาการ',
            },
            {
              icon: <FaCoins />,
              value: `฿${budgetMillions}M`,
              label: 'งบประมาณรวม',
            },
            {
              icon: <FaUsers />,
              value: uniqueClients.size,
              label: 'หน่วยงานผู้ขอรับบริการ',
            },
            {
              icon: <FaUserTie />,
              value: uniqueHeads.size,
              label: 'หัวหน้าโครงการ',
            },
          ]}
        />

        <AcademicCharts validData={validData} />

        <AcademicTable
          displayData={displayData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจ — โครงการพัฒนาวิชาการ"
          items={[
            <>
              <strong>งบประมาณรวม</strong> ของโครงการพัฒนาวิชาการสะท้อนมูลค่าการให้บริการแก่หน่วยงานภายนอกในระดับสูง
            </>,
            <>
              <strong>หน่วยงานภาครัฐ</strong> เป็นผู้รับบริการหลักในการขับเคลื่อนโครงการ
            </>,
          ]}
        />
      </div>
    </div>
  );
}
