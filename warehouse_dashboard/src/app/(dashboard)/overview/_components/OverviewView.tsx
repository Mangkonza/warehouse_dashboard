'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { useOverviewData } from '../_hooks/useOverviewData';
import { GlanceOverview } from './GlanceOverview';
import { buildKpiScorecard, getFiscalYearProgress } from '../_services/kpiScorecard';
import { StrategicCommandPanel } from './StrategicCommandPanel';
import { DepartmentMatrixAndPulse } from './DepartmentMatrixAndPulse';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { UndatedNotice } from '@/components/ui/UndatedNotice';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { itemMatchesStrategicFilter } from '@/lib/pastelTheme';
import { itemMatchesFiscalYear, resolveItemFiscalYear } from '@/types/timeFilter';
import { FaSyncAlt, FaDownload, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

export function OverviewView() {
  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('overview');

  const { setIsTimeModalOpen } = useTimeFilter('overview');

  const {
    isLiveFromDb,
    lastUpdated,
    isRefreshing,
    snapshotToast,
    departmentStats,
    validResearch,
    validAcademic,
    validPub,
    validService,
    validIP,
    undatedCounts,
    fetchLiveData,
    handleExportMaster,
  } = useOverviewData(timeFilter);

  const selectedDept = tabFilter.department || 'all';
  const fiscalYear = tabFilter.fiscalYear || 'all';
  const strategicFilter = tabFilter.customFilters?.strategicFilter || 'all';

  // Clear any lingering department filter state since department filter is disabled on overview
  useEffect(() => {
    if (tabFilter.department && tabFilter.department !== 'all') {
      setTabFilter({ department: 'all' });
    }
  }, [tabFilter.department, setTabFilter]);

  const totalItemsCount = validResearch.length + validAcademic.length + validPub.length + validService.length + validIP.length;

  // Filter items by department, fiscal year, and strategic filter
  const matchesAllFilters = (item: any, category: string) => {
    if (selectedDept !== 'all' && !String(item.department || '').includes(selectedDept)) return false;
    if (fiscalYear !== 'all') {
      // Academic records have no year in the source data (68/69 are undated).
      // Keep them visible with an "ไม่ระบุปีงบ" note instead of emptying the
      // mission, and keep them out of year-specific comparisons.
      const undatedAcademic = category === 'academic' && resolveItemFiscalYear(item, 'academic') === null;
      if (!undatedAcademic && !itemMatchesFiscalYear(item, fiscalYear, category)) return false;
    }
    if (strategicFilter !== 'all' && !itemMatchesStrategicFilter(item, strategicFilter)) return false;
    return true;
  };

  const filteredResearch = validResearch.filter((item) => matchesAllFilters(item, 'research'));
  const filteredAcademic = validAcademic.filter((item) => matchesAllFilters(item, 'academic'));
  const filteredPub = validPub.filter((item) => matchesAllFilters(item, 'publications'));
  const filteredService = validService.filter((item) => matchesAllFilters(item, 'service'));
  const filteredIP = validIP.filter((item) => matchesAllFilters(item, 'ip'));

  const totalFilteredCount = filteredResearch.length + filteredAcademic.length + filteredPub.length + filteredService.length + filteredIP.length;

  // Records hidden because they have no date at all (only when a year is active).
  const hiddenUndated =
    fiscalYear === 'all'
      ? 0
      : undatedCounts.research + undatedCounts.publications + undatedCounts.service + undatedCounts.ip;
  const undatedAcademic = fiscalYear === 'all' ? 0 : undatedCounts.academic;

  const fiscalYearProgress = useMemo(() => getFiscalYearProgress(), []);
  const kpis = buildKpiScorecard(
    {
      research: filteredResearch,
      academic: filteredAcademic,
      publications: filteredPub,
      service: filteredService,
      ip: filteredIP,
    },
    { fiscalYear }
  );

  const liveBadge = isLiveFromDb
    ? {
        backgroundColor: '#ecfdf5',
        border: '1px solid #a7f3d0',
        color: '#047857',
        dot: '#10b981',
        label: lastUpdated
          ? `ข้อมูลจริงในระบบ · อัปเดต ${lastUpdated.toLocaleString('th-TH', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : 'ข้อมูลจริงในระบบ',
        title: 'ข้อมูลถูกดึงจากฐานข้อมูลล่าสุด',
      }
    : {
        backgroundColor: '#fff7ed',
        border: '1px solid #fed7aa',
        color: '#9a3412',
        dot: '#f59e0b',
        label: 'ข้อมูลสำรอง (JSON) · เชื่อมต่อฐานข้อมูลไม่ได้',
        title: 'API ไม่ตอบสนอง ระบบจึงใช้ไฟล์ข้อมูลสำรองในเครื่อง ตัวเลขอาจไม่เป็นปัจจุบัน',
      };

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
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

      <div>
        <h1 style={dashboardPageTitleStyle}>แดชบอร์ด ภาพรวม</h1>
        <p style={dashboardPageSubtitleStyle}>
          ภาพรวมเป้าหมายยุทธศาสตร์ งบประมาณ และผลผลิตของคณะวิศวกรรมศาสตร์
        </p>
      </div>

      {/* ZONE 1: Unified filter card */}
      <DashboardTabFilterBar
        tabKey="overview"
        totalCount={totalItemsCount}
        filteredCount={totalFilteredCount}
        filterState={tabFilter}
        onFilterChange={setTabFilter}
        onReset={resetTabFilter}
        showFiscalYear={true}
        showDepartment={false}
        showStrategic={false}
        showFilterToggle={false}
        showDetailedTime={true}
        detailedTimeLabel="เลือกช่วงเวลา"
        onOpenDetailedTime={() => setIsTimeModalOpen(true)}
        style={{
          position: 'static',
          backdropFilter: 'none',
          backgroundColor: dashboardTheme.colors.surface,
          borderRadius: `${dashboardTheme.radius.card}px`,
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            title={liveBadge.title}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              backgroundColor: liveBadge.backgroundColor,
              border: liveBadge.border,
              color: liveBadge.color,
              fontSize: '12.5px',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: liveBadge.dot,
                boxShadow: `0 0 6px ${liveBadge.dot}`,
              }}
            />
            <span>{liveBadge.label}</span>
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

          <button
            type="button"
            onClick={handleExportMaster}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)',
              transition: 'all 0.15s ease',
            }}
            title="ดาวน์โหลดรายงาน Excel สรุปผู้บริหารแบบ Master รวม 5 พันธกิจ"
          >
            <FaDownload style={{ fontSize: '11px', color: '#059669' }} />
            <span>ดาวน์โหลดรายงาน Excel</span>
          </button>
        </div>
      </DashboardTabFilterBar>

      {/* Undated records kept out of year-specific totals */}
      {(hiddenUndated > 0 || undatedAcademic > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <UndatedNotice count={hiddenUndated} />
          {undatedAcademic > 0 && (
            <UndatedNotice
              count={undatedAcademic}
              message={`พัฒนาวิชาการ ${undatedAcademic.toLocaleString('th-TH')} รายการ ไม่ระบุปีงบ (แสดงเสมอ)`}
            />
          )}
        </div>
      )}

      {/* ZONE 2: Glance layer — targets, missions, budget, departments, strategy */}
      <GlanceOverview
        research={filteredResearch}
        academic={filteredAcademic}
        publications={filteredPub}
        service={filteredService}
        ip={filteredIP}
        kpis={kpis}
        fiscalYearProgress={fiscalYearProgress}
        fiscalYear={fiscalYear}
        selectedDept={selectedDept}
        onSelectDept={() => {}}
      />

      {/* ZONE 3: Deep-dive panels, collapsed so the overview stays scannable */}
      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        aria-expanded={showDetails}
        className="glance-details-toggle"
        style={{
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '999px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          color: '#334155',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {showDetails ? 'ซ่อนการวิเคราะห์เชิงลึก' : 'ดูการวิเคราะห์เชิงลึก'}
        <FaChevronDown
          style={{ fontSize: '11px', transform: showDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
        />
      </button>

      {showDetails && (
        <>
          <StrategicCommandPanel
            validResearch={filteredResearch}
            validAcademic={filteredAcademic}
            validPub={filteredPub}
            validService={filteredService}
            validIP={filteredIP}
          />
          <DepartmentMatrixAndPulse
            departmentStats={departmentStats}
            validResearch={filteredResearch}
            validAcademic={filteredAcademic}
            validPub={filteredPub}
            validService={filteredService}
            validIP={filteredIP}
          />
        </>
      )}
    </div>
  );
}
