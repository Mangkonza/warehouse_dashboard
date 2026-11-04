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
import { FaSyncAlt, FaDownload, FaCheckCircle, FaUndoAlt } from 'react-icons/fa';

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
  } = useOverviewData(timeFilter);

  const [selectedDept, setSelectedDept] = useState('all');
  const [fiscalYear, setFiscalYear] = useState('all');
  const [strategicFilter, setStrategicFilter] = useState('all');

  const totalItemsCount = validResearch.length + validAcademic.length + validPub.length + validService.length + validIP.length;

  // Filter items by department, fiscal year, and strategic filter
  const matchesAllFilters = (item: any) => {
    if (selectedDept !== 'all' && !String(item.department || '').includes(selectedDept)) return false;
    if (fiscalYear !== 'all') {
      const fy = String(item.fiscal_year_be || item.fiscal_year || '');
      if (fy && !fy.includes(fiscalYear)) return false;
    }
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

  const hasFilter = selectedDept !== 'all' || fiscalYear !== 'all' || strategicFilter !== 'all';

  const handleResetFilters = () => {
    resetTimeFilter();
    setSelectedDept('all');
    setFiscalYear('all');
    setStrategicFilter('all');
  };

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

      {/* ZONE 1: Unified Glassmorphism Control & Filter Bar (Sticky Docked Under Header) */}
      <div
        style={{
          position: 'sticky',
          top: '50px',
          zIndex: 40,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e2e8f0',
          padding: '10px 18px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        {/* Left: Live DB status & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              fontSize: '12.5px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981',
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
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
            title="รีเฟรชข้อมูลสดจากฐานข้อมูล"
          >
            <FaSyncAlt style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: '11px' }} />
            <span>{isRefreshing ? 'กำลังดึงข้อมูล...' : 'รีเฟรช'}</span>
          </button>
        </div>

        {/* Center: Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Fiscal Year Segmented Tabs */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {[
              { id: 'all', label: `ทั้งหมด (${totalItemsCount})` },
              { id: '2570', label: 'ปีงบ 2570' },
              { id: '2569', label: 'ปีงบ 2569' },
              { id: '2568', label: 'ปีงบ 2568' },
            ].map((tab) => {
              const active = fiscalYear === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFiscalYear(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '7px',
                    border: 'none',
                    backgroundColor: active ? '#ffffff' : 'transparent',
                    color: active ? '#047857' : '#64748b',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <DepartmentSelect
            value={selectedDept}
            onChange={setSelectedDept}
            allowAll
            allLabel="ทุกภาควิชา"
            allValue="all"
            size="sm"
            className="w-[170px]"
          />

          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
            className="w-[190px]"
          />

          {hasFilter && (
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 10px',
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                backgroundColor: '#fffbeb',
                color: '#b45309',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <FaUndoAlt style={{ fontSize: '10px' }} />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>

        {/* Right: Master Excel Export */}
        <div>
          <button
            type="button"
            onClick={handleExportMaster}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d1fae5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ecfdf5';
            }}
            title="ดาวน์โหลดรายงาน Excel สรุปผู้บริหารแบบ Master รวม 5 พันธกิจ"
          >
            <FaDownload style={{ fontSize: '12px', color: '#059669' }} />
            <span>ดาวน์โหลดรายงาน Excel</span>
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
