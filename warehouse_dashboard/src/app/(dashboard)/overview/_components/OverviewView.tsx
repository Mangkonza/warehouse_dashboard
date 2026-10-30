'use client';

import React from 'react';
import { TimeFilterBar, useTimeFilter } from '@/features/time-filter';
import { useOverviewData } from '../_hooks/useOverviewData';
import { OverviewHeaderToolbar } from './OverviewHeaderToolbar';
import { ExecutiveMultiYearOverview } from './ExecutiveMultiYearOverview';
import { PerspectiveSection } from './PerspectiveSection';
import { FaCheckCircle } from 'react-icons/fa';

// โหลดชุดข้อมูลดิบเพื่อใช้วิเคราะห์ข้ามหลายปี
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';

export function OverviewView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    isLiveFromDb,
    isRefreshing,
    snapshotToast,
    departmentStats,
    validResearch,
    validAcademic,
    validPub,
    validService,
    validIP,
    fetchLiveData,
    handleExportMaster,
    handleSnapshot,
  } = useOverviewData(timeFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Toast Alert */}
      {snapshotToast && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
          }}
        >
          <FaCheckCircle style={{ color: '#00e676' }} />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* 1. Header Toolbar + TimeFilterBar */}
      <OverviewHeaderToolbar
        isLiveFromDb={isLiveFromDb}
        isRefreshing={isRefreshing}
        onRefresh={fetchLiveData}
        onSnapshot={handleSnapshot}
        onExportMaster={handleExportMaster}
      />

      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={validResearch.length + validAcademic.length + validPub.length + validService.length + validIP.length}
      />

      {/* 2. Executive Multi-Year Overview (การ์ดสรุป 5 พันธกิจหลัก + กราฟเปรียบเทียบรายปี 2566–2570) */}
      <ExecutiveMultiYearOverview
        researchList={validResearch}
        academicList={validAcademic}
        pubList={validPub}
        serviceList={validService}
        ipList={validIP}
        allResearchRaw={rawResearch}
        allAcademicRaw={rawAcademic}
        allPubRaw={rawPublications}
        allServiceRaw={rawServices}
        allIpRaw={rawIP}
      />

      {/* 3. Strategic Perspectives Section (เจาะลึก 7 ภาควิชา & พันธกิจ) */}
      <PerspectiveSection
        departmentStats={departmentStats}
        validResearch={validResearch}
        validAcademic={validAcademic}
        validPub={validPub}
        validService={validService}
        validIP={validIP}
      />
    </div>
  );
}