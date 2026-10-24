'use client';

import React, { useMemo } from 'react';
import { FaGraduationCap, FaCoins, FaHandHoldingUsd, FaUsers } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
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

  const topClientInfo = useMemo(() => {
    const map: Record<string, number> = {};
    validData.forEach((item) => {
      const c = String(item.client || '').replace('\n', ' ').trim();
      if (c && c !== 'nan' && c !== '-') {
        map[c] = (map[c] || 0) + (Number(item.budget) || 0);
      }
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0] || null;
  }, [validData]);

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
              icon: <FaGraduationCap />,
              value: `${validData.length} โครงการ`,
              label: 'โครงการพัฒนาวิชาการ',
              subtext: `หัวหน้าโครงการ ${uniqueHeads.size} ท่าน`,
              accentColor: '#1565c0',
            },
            {
              icon: <FaCoins />,
              value: `${budgetMillions} ล้านบาท`,
              label: 'งบประมาณรวม',
              subtext: `${totalBudgetAll.toLocaleString('th-TH')} บาท`,
              accentColor: '#059669',
            },
            {
              icon: <FaHandHoldingUsd />,
              value: `${allocMillions} ล้านบาท`,
              label: 'การจัดสรรรายได้ (รวม 15%)',
              subtext: `คณะ 5% (${(totalAllocFaculty / 1000000).toFixed(2)}M) • ภาคฯ 5% • มก. 5%`,
              accentColor: '#00A651',
            },
            {
              icon: <FaUsers />,
              value: `${uniqueClients.size} หน่วยงาน`,
              label: 'ผู้ขอรับบริการภายนอก',
              subtext: `งบดำเนินงานคงเหลือ 85% (${(totalAllocRemaining / 1000000).toFixed(2)} ล้านบาท)`,
              accentColor: '#0284c7',
            },
          ]}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจผู้บริหาร — โครงการพัฒนาวิชาการ"
          items={[
            <>
              <strong>มูลค่าการจัดสรรรายได้เข้าส่วนงาน (15%):</strong> สร้างรายได้เข้าคณะ ภาควิชา และมหาวิทยาลัยรวม{' '}
              <strong>{totalAllocated15.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท</strong> (ส่วนละ{' '}
              {(totalAllocFaculty).toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท)
            </>,
            <>
              <strong>ผู้ขอรับบริการหลัก:</strong>{' '}
              {topClientInfo
                ? `${topClientInfo[0]} มูลค่า ${(topClientInfo[1] / 1000000).toFixed(2)} ล้านบาท`
                : 'หน่วยงานภาครัฐและเอกชน'}
            </>,
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
