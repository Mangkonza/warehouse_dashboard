'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardTabFilter, useTimeFilter } from '@/features/time-filter';
import { usePerspectiveTab } from '@/hooks/usePerspectiveTab';
import { ExecutiveKpiDeck, DepartmentBreakdownItem } from '@/components/data-display/ExecutiveKpiDeck';
import { getDepartment } from '@/lib/departments';
import { usePersonnelData } from '../_hooks/usePersonnelData';
import { PersonnelCharts, PersonnelPerspective } from './PersonnelCharts';
import { PersonnelRankingTable } from './PersonnelRankingTable';
import { DashboardTabFilterBar } from '@/components/ui/DashboardTabFilterBar';
import { TopSegmentedTabs } from '@/components/ui/TopSegmentedTabs';
import { dashboardPageSubtitleStyle, dashboardPageTitleStyle, dashboardTheme } from '@/lib/dashboardTheme';
import { FaSyncAlt, FaUserTie, FaTrophy } from 'react-icons/fa';

const VALID_PERSONNEL_TABS: PersonnelPerspective[] = ['overview', 'table'];

export function PersonnelView() {
  const router = useRouter();
  const [activePerspective, setActivePerspective] = usePerspectiveTab<PersonnelPerspective>(
    'personnel',
    VALID_PERSONNEL_TABS,
    'overview'
  );

  const {
    tabFilter,
    setTabFilter,
    resetTabFilter,
    timeFilter,
  } = useDashboardTabFilter('personnel');

  const { setIsTimeModalOpen } = useTimeFilter('personnel');

  const {
    personnelMetrics,
    departmentStats,
    totalFacultyCount,
    activeFacultyCount,
    totalCombinedWorks,
    totalCombinedBudget,
    isRefreshing,
    refreshData,
  } = usePersonnelData(timeFilter);

  const budgetMillions = (totalCombinedBudget / 1000000).toFixed(2);
  const activePercentage =
    totalFacultyCount > 0 ? Math.round((activeFacultyCount / totalFacultyCount) * 100) : 0;

  const departmentBreakdown: DepartmentBreakdownItem[] = useMemo(() => {
    if (!personnelMetrics || personnelMetrics.length === 0) return [];
    const counts: Record<string, number> = {};
    personnelMetrics.forEach((m) => {
      const deptCode = getDepartment(m.department).code;
      counts[deptCode] = (counts[deptCode] || 0) + 1;
    });
    const total = personnelMetrics.length;
    return Object.entries(counts)
      .map(([code, count]) => {
        const info = getDepartment(code);
        return {
          code,
          name: info.name,
          count,
          percent: total > 0 ? (count / total) * 100 : 0,
          color: info.color,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [personnelMetrics]);

  const displayMetrics = useMemo(() => {
    if (!tabFilter.department || tabFilter.department === 'all') {
      return personnelMetrics;
    }
    return personnelMetrics.filter((m) =>
      String(m.department || '').includes(tabFilter.department)
    );
  }, [personnelMetrics, tabFilter.department]);

  const missionSegments = useMemo(() => {
    const dedupeCount = (items: any[]) => {
      const seen = new Set<string>();
      items.forEach((it) => {
        const k = String(it._id || it.id || it.name || it.title || '');
        if (k) seen.add(k);
      });
      return seen.size;
    };
    const rCount = dedupeCount(displayMetrics.flatMap((m) => m.researchItems));
    const pCount = dedupeCount(displayMetrics.flatMap((m) => m.pubItems));
    const ipCount = dedupeCount(displayMetrics.flatMap((m) => m.ipItems));
    const acCount = dedupeCount(displayMetrics.flatMap((m) => m.academicItems));
    const svCount = dedupeCount(displayMetrics.flatMap((m) => m.serviceItems));
    const sum = Math.max(rCount + pCount + ipCount + acCount + svCount, 1);

    return [
      {
        label: 'โครงการวิจัย',
        value: rCount,
        displayValue: `${rCount} รายการ`,
        unit: 'รายการ',
        percent: Number(((rCount / sum) * 100).toFixed(1)),
        color: '#22c55e',
      },
      {
        label: 'ผลงานตีพิมพ์',
        value: pCount,
        displayValue: `${pCount} รายการ`,
        unit: 'รายการ',
        percent: Number(((pCount / sum) * 100).toFixed(1)),
        color: '#fb7185',
      },
      {
        label: 'บริการวิชาการ',
        value: svCount,
        displayValue: `${svCount} รายการ`,
        unit: 'รายการ',
        percent: Number(((svCount / sum) * 100).toFixed(1)),
        color: '#fbbf24',
      },
      {
        label: 'พัฒนาวิชาการ',
        value: acCount,
        displayValue: `${acCount} รายการ`,
        unit: 'รายการ',
        percent: Number(((acCount / sum) * 100).toFixed(1)),
        color: '#38bdf8',
      },
      {
        label: 'ทรัพย์สินทางปัญญา',
        value: ipCount,
        displayValue: `${ipCount} รายการ`,
        unit: 'รายการ',
        percent: Number(((ipCount / sum) * 100).toFixed(1)),
        color: '#a78bfa',
      },
    ];
  }, [displayMetrics]);

  const maxPersonBudgetM = useMemo(() => {
    const mx = Math.max(...displayMetrics.map((m) => (m.budgets?.total || 0) / 1_000_000), 10);
    return Math.ceil(mx);
  }, [displayMetrics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* 1. Header Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={dashboardPageTitleStyle}>
            คณาจารย์และบุคลากร
          </h1>
          <p style={dashboardPageSubtitleStyle}>
            ภาพรวมผลิตภาพทางวิชาการและการจัดอันดับผลงานสะสม 5 พันธกิจหลักรายบุคคล
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          disabled={isRefreshing}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <FaSyncAlt style={{ fontSize: '13px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isRefreshing ? 'กำลังปรับปรุง...' : 'รีเฟรชข้อมูล'}</span>
        </button>
      </div>

      {/* 2. Top Segmented Tabs (removed redundant 'department' tab) */}
      <div style={{ overflowX: 'auto', padding: '2px 0 6px 0' }}>
        <TopSegmentedTabs
          activeCategory={activePerspective}
          onSelectCategory={setActivePerspective}
          colorTheme="teal"
          tabs={[
            { key: 'overview', label: 'ภาพรวมและ 10 อันดับอาจารย์', icon: <FaUserTie style={{ fontSize: '13px' }} /> },
            { key: 'table', label: 'ทำเนียบและตารางจัดอันดับบุคลากร', icon: <FaTrophy style={{ fontSize: '13px' }} /> },
          ]}
        />
      </div>

      {/* 3. Unified Tab Filter Bar (แสดงเฉพาะแท็บภาพรวม ส่วนแท็บตารางมีตัวกรองในตัวตาราง) */}
      {activePerspective === 'overview' && (
        <DashboardTabFilterBar
          tabKey="personnel"
          totalCount={totalCombinedWorks}
          filteredCount={displayMetrics.length}
          filterState={tabFilter}
          onFilterChange={setTabFilter}
          onReset={resetTabFilter}
          showFiscalYear={true}
          showDepartment={true}
          showStrategic={false}
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
        />
      )}

      {/* 4. Executive Blueprint KPI Deck (matching all 5 missions) */}
      {activePerspective === 'overview' && (
        <ExecutiveKpiDeck
          mission="research"
          blueprintCard={{
            label: 'ผลงานสะสมรวม 5 ด้าน',
            value: totalCombinedWorks.toLocaleString('th-TH'),
            unit: 'รายการ',
            segments: missionSegments,
          }}
          gearCard={{
            label: 'บุคลากรทั้งหมดในระบบ',
            value: totalFacultyCount,
            unit: 'ท่าน',
            gearValue: departmentBreakdown.length || departmentStats.length,
            gearLabel: 'สังกัด',
            popoverTitle: 'สังกัดของบุคลากร',
            popoverSubtitle: 'สัดส่วนบุคลากรแยกตามสังกัด',
            departments: departmentBreakdown,
          }}
          tallyCard={{
            label: 'อาจารย์ที่มีผลงานในรอบเวลา',
            chip: `${activePercentage}%`,
            value: activeFacultyCount,
            unit: `จาก ${totalFacultyCount} ท่าน`,
            percent: activePercentage,
            totalCount: totalFacultyCount,
            activeCount: activeFacultyCount,
          }}
          rulerCard={{
            label: 'งบประมาณโครงการรวมที่สร้าง',
            value: budgetMillions,
            unit: 'ล้านบาท',
            current: parseFloat(budgetMillions) || 0,
            max: Math.max(parseFloat(budgetMillions) * 1.25, maxPersonBudgetM, 20),
            marks: [
              { label: '0', positionPercent: 2 },
              { label: `${Math.round((parseFloat(budgetMillions) || 20) / 3)}`, positionPercent: 33 },
              { label: `${Math.round(((parseFloat(budgetMillions) || 20) * 2) / 3)}`, positionPercent: 66 },
              { label: `รวม ${budgetMillions}`, positionPercent: 95 },
            ],
          }}
        />
      )}

      {/* 5. Main Content Area */}
      {activePerspective === 'table' ? (
        <PersonnelRankingTable metrics={displayMetrics} />
      ) : (
        <PersonnelCharts
          metrics={displayMetrics}
          departmentStats={departmentStats}
          activePerspective={activePerspective}
          onSelectPerson={(id) => router.push(`/personnel/${id}`)}
        />
      )}
    </div>
  );
}
