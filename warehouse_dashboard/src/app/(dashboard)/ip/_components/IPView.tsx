'use client';

import React from 'react';
import { FaCertificate, FaCheckCircle, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
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
              icon: <FaCertificate />,
              value: `${validIpData.length} รายการ`,
              label: 'งานทรัพย์สินทางปัญญาทั้งหมด',
              subtext: `อนุสิทธิบัตร ${pettyPatentCount} • สิทธิบัตร ${patentCount}`,
              accentColor: '#6a1b9a',
            },
            {
              icon: <FaCheckCircle />,
              value: `${protectedCount} รายการ`,
              label: 'ได้รับความคุ้มครองแล้ว',
              subtext: `อยู่ระหว่างยื่นคำขอ ${pendingCount} รายการ`,
              accentColor: '#00A651',
            },
            {
              icon: <FaBuilding />,
              value: `${uniqueDeptCount} ภาควิชา`,
              label: 'ภาควิชาที่มีผลงาน IP',
              subtext: 'ควรส่งเสริมให้ครบทั้ง 7 ภาควิชา',
              accentColor: '#0284c7',
            },
            {
              icon: <FaMoneyBillWave />,
              value: `${totalSupportAmount.toLocaleString('th-TH')} บาท`,
              label: 'คณะฯ สนับสนุนค่าธรรมเนียม/รางวัล',
              subtext: 'งบสนับสนุนการจดทะเบียนทรัพย์สินทางปัญญา',
              accentColor: '#059669',
            },
          ]}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจผู้บริหาร — งานทรัพย์สินทางปัญญา"
          items={[
            <>
              <strong>สถานะความคุ้มครอง:</strong> ได้รับการจดทะเบียนคุ้มครองแล้ว{' '}
              <strong>{protectedCount} รายการ</strong> และอยู่ระหว่างดำเนินการยื่นคำขอ{' '}
              <strong>{pendingCount} รายการ</strong> (รวม {validIpData.length} รายการ)
            </>,
            <>
              <strong>การกระจายตัวรายภาควิชา:</strong> ปัจจุบันกระจุกตัวใน{' '}
              <strong>{uniqueDeptCount} ภาควิชา</strong> ควรเชื่อมโยงโครงการวิจัยและบทความที่มีศักยภาพเพื่อยื่นจดอนุสิทธิบัตร/สิทธิบัตรเพิ่มให้ถึงเป้าหมาย 15 รายการ/ปี
            </>,
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
