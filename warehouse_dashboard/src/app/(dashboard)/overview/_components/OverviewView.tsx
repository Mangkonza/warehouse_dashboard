'use client';

import React, { useState } from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useOverviewData } from '../_hooks/useOverviewData';
import { HeroBentoGrid } from './HeroBentoGrid';
import { StrategicCommandPanel } from './StrategicCommandPanel';
import { DepartmentMatrixAndPulse } from './DepartmentMatrixAndPulse';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { itemMatchesStrategicFilter } from '@/lib/pastelTheme';
import { FaSyncAlt, FaDownload, FaCheckCircle } from 'react-icons/fa';

export function OverviewView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
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
  } = useOverviewData(timeFilter);

  const [selectedDept, setSelectedDept] = useState('all');
  const [strategicFilter, setStrategicFilter] = useState('all');

  const totalItemsCount = validResearch.length + validAcademic.length + validPub.length + validService.length + validIP.length;

  // Filter items by department and strategic filter
  const matchesAllFilters = (item: any) => {
    if (selectedDept !== 'all' && !String(item.department || '').includes(selectedDept)) return false;
    if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) return false;
    return true;
  };

  const filteredResearch = validResearch.filter(matchesAllFilters);
  const filteredAcademic = validAcademic.filter(matchesAllFilters);
  const filteredPub = validPub.filter(matchesAllFilters);
  const filteredService = validService.filter(matchesAllFilters);
  const filteredIP = validIP.filter(matchesAllFilters);

  const totalFilteredCount = filteredResearch.length + filteredAcademic.length + filteredPub.length + filteredService.length + filteredIP.length;

  const totalResearchBudget = filteredResearch.reduce(
    (sum, r) => sum + (Number(r.budget_external) || 0) + (Number(r.budget_internal) || 0) || Number(r.budget) || 0,
    0
  );
  const totalExternalRes = filteredResearch.reduce((sum, r) => sum + (Number(r.budget_external) || 0), 0);
  const totalInternalRes = filteredResearch.reduce((sum, r) => sum + (Number(r.budget_internal) || 0), 0);

  const totalAcademicBudget = filteredAcademic.reduce((sum, a) => sum + (Number(a.budget) || 0), 0);
  const facultyOverhead = totalAcademicBudget * 0.15;
  const totalFinancialVolume = totalResearchBudget + totalAcademicBudget;

  const uniqueAcademicPis = new Set(filteredAcademic.map((a) => a.head).filter(Boolean)).size;

  const pubQ1Count = filteredPub.filter((p) => {
    const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
    return String(tier).startsWith('Q1');
  }).length;
  const pubQ2Count = filteredPub.filter((p) => {
    const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
    return String(tier).startsWith('Q2');
  }).length;
  const pubTciCount = filteredPub.filter((p) => {
    const tier = p.journal_tier || autoDetectJournalRanking(p.journal || '', p.level || '');
    return String(tier).startsWith('TCI');
  }).length;
  const pubSupportAmount = filteredPub.reduce((sum, p) => sum + (Number(p.support_amount) || Number(p.budget) || 0), 0);

  const uniqueServiceStaff = new Set(filteredService.map((s) => s.person).filter(Boolean)).size;
  const uniqueServiceNetworks = new Set(filteredService.map((s) => s.target_group).filter(Boolean)).size;

  const ipProtectedCount = filteredIP.filter((i) => String(i.status || '').includes('คุ้มครอง')).length;
  const ipPendingCount = filteredIP.filter((i) => !String(i.status || '').includes('คุ้มครอง')).length;
  const ipSupportAmount = filteredIP.reduce((sum, i) => sum + (Number(i.support_amount) || 0), 0);

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
          <FaCheckCircle style={{ color: '#6ee7b7' }} />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* ZONE 1: Unified Glassmorphism Control & Filter Bar (Sticky Docked Under Header) */}
      <div
        style={{
          position: 'sticky',
          top: '50px',
          zIndex: 40,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          minHeight: '56px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Live DB status & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '36px',
              borderRadius: '999px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '12px',
              fontWeight: 700,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 6px #6ee7b7',
              }}
            />
            <span>ข้อมูลจริงในระบบ ({totalItemsCount} รายการ)</span>
          </div>

          <button
            type="button"
            onClick={fetchLiveData}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
            }}
            title="ดึงข้อมูลล่าสุดจากฐานข้อมูล"
          >
            <FaSyncAlt style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: '11px' }} />
            <span>{isRefreshing ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}</span>
          </button>
        </div>

        {/* Center: Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <TimeFilterBar
            value={timeFilter}
            onChange={setTimeFilter}
            onReset={resetTimeFilter}
            totalCount={totalItemsCount}
          />

          <DepartmentSelect
            value={selectedDept}
            onChange={setSelectedDept}
            allowAll
            allLabel="ทุกภาควิชา"
            allValue="all"
            size="sm"
            className="w-[175px]"
          />

          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
            className="w-[195px]"
          />
        </div>

        {/* Right: Master Export */}
        <div>
          <button
            type="button"
            onClick={handleExportMaster}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 14px',
              height: '36px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(16, 185, 129, 0.08)',
              transition: 'background-color 0.15s ease',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1fae5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ecfdf5';
            }}
            title="ดาวน์โหลดรายงานตารางสรุปผลรวม 5 พันธกิจ"
          >
            <FaDownload style={{ fontSize: '12px', color: '#059669' }} />
            <span>ดาวน์โหลดรายงานสรุปผล</span>
          </button>
        </div>
      </div>

      {/* ZONE 2: Hero Bento Grid (2 rows, 6 cards) */}
      <HeroBentoGrid
        totalItems={totalFilteredCount}
        totalFinancialVolume={totalFinancialVolume}
        facultyOverhead={facultyOverhead}
        researchCount={filteredResearch.length}
        researchBudget={totalResearchBudget}
        externalResearchBudget={totalExternalRes}
        internalResearchBudget={totalInternalRes}
        academicCount={filteredAcademic.length}
        academicBudget={totalAcademicBudget}
        academicPis={uniqueAcademicPis}
        pubCount={filteredPub.length}
        pubQ1={pubQ1Count}
        pubQ2={pubQ2Count}
        pubTci={pubTciCount}
        pubSupport={pubSupportAmount}
        serviceCount={filteredService.length}
        serviceStaff={uniqueServiceStaff}
        serviceNetworks={uniqueServiceNetworks}
        ipCount={filteredIP.length}
        ipProtected={ipProtectedCount}
        ipPending={ipPendingCount}
        ipSupport={ipSupportAmount}
      />

      {/* ZONE 3: Strategic Command Panel (ISEE • IAM • SDGs) */}
      <StrategicCommandPanel
        validResearch={filteredResearch}
        validAcademic={filteredAcademic}
        validPub={filteredPub}
        validService={filteredService}
        validIP={filteredIP}
      />

      {/* ZONE 4: Department 360° Matrix & Monthly Pulse */}
      <DepartmentMatrixAndPulse
        departmentStats={departmentStats}
        validResearch={filteredResearch}
        validAcademic={filteredAcademic}
        validPub={filteredPub}
        validService={filteredService}
        validIP={filteredIP}
      />
    </div>
  );
}
