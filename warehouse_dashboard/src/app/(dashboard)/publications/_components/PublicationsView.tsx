'use client';

import React, { useMemo } from 'react';
import { FaBookOpen, FaTrophy, FaGlobeAmericas, FaAward, FaCoins } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';
import { getDepartment } from '@/lib/departments';

export function PublicationsView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    q1Count,
    q2Count,
    tciCount,
    otherCount,
    internationalCount,
    nationalCount,
    totalSupportBudget,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    selectedDept,
    setSelectedDept,
    fiscalYearFilter,
    setFiscalYearFilter,
    availableFiscalYears,
    savePublication,
    deletePublication,
  } = usePublicationsData(timeFilter);

  const decisionInsights = useMemo(() => {
    const deptCounts: Record<string, number> = {};
    validData.forEach((p) => {
      const d = getDepartment(p.department).name;
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });
    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    const intlPct = validData.length > 0 ? Math.round((internationalCount / validData.length) * 100) : 0;

    return [
      <>
        <strong>สัดส่วนผลงานตีพิมพ์ระดับนานาชาติ:</strong> คิดเป็น <strong>{intlPct}%</strong> ({internationalCount} เรื่อง) โดยอยู่ในระดับ{' '}
        <strong>Scopus Q1 จำนวน {q1Count} เรื่อง</strong> และ <strong>Scopus Q2-Q4 จำนวน {q2Count} เรื่อง</strong>
      </>,
      <>
        <strong>ภาควิชาที่ผลิตผลงานตีพิมพ์สูงสุด:</strong>{' '}
        {topDept ? `${topDept[0]} (${topDept[1]} เรื่อง)` : '-'} • ใช้งบสนับสนุนการตีพิมพ์รวมทั้งสิ้น{' '}
        <strong>{totalSupportBudget.toLocaleString('th-TH')} บาท</strong>
      </>,
    ];
  }, [validData, internationalCount, q1Count, q2Count, totalSupportBudget]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <TimeFilterBar
        value={timeFilter}
        onChange={setTimeFilter}
        onReset={resetTimeFilter}
        totalCount={validData.length}
      />
      <div className="tab-content active">
        <KpiGrid
          items={[
            {
              icon: <FaBookOpen />,
              value: `${validData.length} เรื่อง`,
              label: 'ผลงานตีพิมพ์ทางวิชาการ',
              subtext: `นานาชาติ ${internationalCount} • ชาติ ${nationalCount}`,
              accentColor: '#2e7d32',
              onClick: () => setLevelFilter('all'),
            },
            {
              icon: <FaTrophy />,
              value: `${q1Count} เรื่อง`,
              label: 'ระดับ Scopus Q1',
              subtext: 'คลิกเพื่อกรองเฉพาะ Q1',
              accentColor: '#059669',
              onClick: () => setLevelFilter(levelFilter === 'Q1' ? 'all' : 'Q1'),
            },
            {
              icon: <FaGlobeAmericas />,
              value: `${q2Count} เรื่อง`,
              label: 'ระดับ Scopus Q2 - Q4',
              subtext: 'วารสารวิชาการนานาชาติ',
              accentColor: '#2563eb',
              onClick: () => setLevelFilter(levelFilter === 'Q2' ? 'all' : 'Q2'),
            },
            {
              icon: <FaAward />,
              value: `${tciCount} เรื่อง`,
              label: 'ระดับ TCI (ชาติ)',
              subtext: `เตรียมอนุสิทธิบัตร/อื่นๆ ${otherCount} รายการ`,
              accentColor: '#7c3aed',
              onClick: () => setLevelFilter(levelFilter === 'TCI' ? 'all' : 'TCI'),
            },
            {
              icon: <FaCoins />,
              value: `${totalSupportBudget.toLocaleString('th-TH')} บาท`,
              label: 'เงินสนับสนุนการตีพิมพ์รวม',
              subtext: `เฉลี่ย ${validData.length > 0 ? Math.round(totalSupportBudget / validData.length).toLocaleString('th-TH') : 0} บาท/เรื่อง`,
              accentColor: '#00A651',
            },
          ]}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจผู้บริหาร — ผลงานตีพิมพ์ทางวิชาการ"
          items={decisionInsights}
        />

        <PublicationsCharts
          validData={validData}
          onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
          onSelectLevel={(lvl) => setLevelFilter(lvl === levelFilter ? 'all' : lvl)}
        />

        <PublicationsTable
          filteredData={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          levelFilter={levelFilter}
          onLevelChange={setLevelFilter}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          fiscalYearFilter={fiscalYearFilter}
          onFiscalYearChange={setFiscalYearFilter}
          availableFiscalYears={availableFiscalYears}
          onSave={savePublication}
          onDelete={deletePublication}
        />
      </div>
    </div>
  );
}
