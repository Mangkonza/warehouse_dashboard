'use client';

import React from 'react';
import { FaBookOpen, FaTrophy, FaMedal, FaAward, FaEdit } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';

export function PublicationsView() {
  const { timeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    fiscalYearFilter,
    setFiscalYearFilter,
    availableFiscalYears,
    savePublication,
    deletePublication,
  } = usePublicationsData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              icon: <FaBookOpen />,
              value: validData.length,
              label: 'ผลงานทั้งหมด',
            },
            {
              icon: <FaTrophy />,
              value: q1Count,
              label: 'ระดับ Scopus Q1',
            },
            {
              icon: <FaMedal />,
              value: q2Count,
              label: 'ระดับ Scopus Q2',
            },
            {
              icon: <FaAward />,
              value: tciCount,
              label: 'ระดับ TCI',
            },
            {
              icon: <FaEdit />,
              value: otherCount,
              label: 'ระดับอื่น ๆ / เตรียมการ',
            },
          ]}
        />

        <PublicationsCharts validData={validData} />

        <PublicationsTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
          fiscalYearFilter={fiscalYearFilter}
          onFiscalYearChange={setFiscalYearFilter}
          availableFiscalYears={availableFiscalYears}
          onSave={savePublication}
          onDelete={deletePublication}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจ — ผลงานตีพิมพ์ทางวิชาการ"
          items={[
            <>
              <strong>SDG 9 (นวัตกรรม)</strong> มีผลงานตีพิมพ์มากที่สุด โดยเฉพาะด้านวัสดุก่อสร้างและ Machine Learning
            </>,
            <>
              <strong>SDG 2 (อาหาร/เกษตร)</strong> มีผลงาน Q1 สูง จากงานวิจัยด้าน Postharvest และ NIR spectroscopy
            </>,
            <>
              <strong>SDG 6 (น้ำ)</strong> มีผลงานตีพิมพ์อย่างต่อเนื่อง เป็นจุดแข็งของคณะ
            </>,
            <>
              ควรเพิ่มผลงานด้าน <strong>SDG 7 (พลังงาน)</strong> และ <strong>SDG 3 (สุขภาพ)</strong> เพื่อความหลากหลาย
            </>,
          ]}
        />
      </div>
    </div>
  );
}
