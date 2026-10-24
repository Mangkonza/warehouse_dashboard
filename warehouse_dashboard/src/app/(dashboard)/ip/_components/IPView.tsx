'use client';

import React from 'react';
import { FaCertificate, FaScroll, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts } from './IPCharts';
import { IPTable } from './IPTable';

export function IPView() {
  const { timeFilter } = useTimeFilter();
  const {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    totalSupportAmount,
    uniqueDeptCount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
  } = useIPData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              icon: <FaCertificate />,
              value: validIpData.length,
              label: 'จำนวนทรัพย์สินทางปัญญา (รวม)',
            },
            {
              icon: <FaScroll />,
              value: patentCount,
              label: 'สิทธิบัตร/อนุสิทธิบัตร',
            },
            {
              icon: <FaMoneyBillWave />,
              value: `฿${totalSupportAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              label: 'เงินสนับสนุน',
            },
            {
              icon: <FaBuilding />,
              value: uniqueDeptCount,
              label: 'ภาควิชาที่มีผลงาน IP',
            },
          ]}
        />

        <IPCharts totalIpCount={validIpData.length} />

        <IPTable
          filteredIpData={filteredIpData}
          availableDepts={availableDepts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          deptFilter={deptFilter}
          onDeptChange={setDeptFilter}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจ — งานทรัพย์สินทางปัญญา"
          items={[
            <>
              มีทรัพย์สินทางปัญญารวม <strong>{validIpData.length} รายการ</strong> และสิทธิบัตร <strong>{patentCount} รายการ</strong>
            </>,
            <>
              ปัจจุบันมาจาก <strong>{uniqueDeptCount} ภาควิชา</strong> ควรส่งเสริมและขยายการจดทะเบียนไปยังภาควิชาอื่นเพิ่มเติม
            </>,
            <>
              ควรสร้าง <strong>กลไกสนับสนุนการยื่นจดสิทธิบัตร</strong> ต่อเนื่องจากโครงการวิจัยและผลงานตีพิมพ์ทางวิชาการ
            </>,
            <>
              โครงการด้านเทคโนโลยีขั้นสูง เช่น IoT, AI ทางการเกษตร และวัสดุก่อสร้างคาร์บอนต่ำ ควรมีเป้าหมาย <strong>จดสิทธิบัตรเชิงพาณิชย์</strong>
            </>,
          ]}
        />
      </div>
    </div>
  );
}
