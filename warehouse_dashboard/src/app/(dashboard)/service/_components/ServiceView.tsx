'use client';

import React, { useMemo } from 'react';
import { FaHandsHelping, FaUserCheck, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { KpiGrid, DecisionBox } from '@/components/data-display';
import { useServiceData } from '../_hooks/useServiceData';
import { ServiceCharts } from './ServiceCharts';
import { ServiceTable } from './ServiceTable';
import { getDepartment } from '@/lib/departments';

export function ServiceView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    uniquePersons,
    uniqueTargets,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedType,
    setSelectedType,
  } = useServiceData(timeFilter);

  const decisionInsights = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    const deptCounts: Record<string, number> = {};
    validData.forEach((item) => {
      const t = item._resolvedType || 'วิชาการ';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
      const d = getDepartment(item.department).name;
      deptCounts[d] = (deptCounts[d] || 0) + 1;
    });
    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];

    return [
      <>
        <strong>ประเภทงานบริการวิชาการสูงสุด:</strong>{' '}
        {topType
          ? `${topType[0]} จำนวน ${topType[1]} ครั้ง (${Math.round((topType[1] / (validData.length || 1)) * 100)}%)`
          : '-'}
      </>,
      <>
        <strong>ภาควิชาที่มีส่วนร่วมสูงสุด:</strong>{' '}
        {topDept ? `${topDept[0]} (${topDept[1]} กิจกรรม)` : '-'} • ครอบคลุมกลุ่มเป้าหมายภายนอก{' '}
        <strong>{uniqueTargets.size} หน่วยงาน</strong>
      </>,
    ];
  }, [validData, uniqueTargets.size]);

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
              icon: <FaHandsHelping />,
              value: `${validData.length} ครั้ง`,
              label: 'งานบริการวิชาการทั้งหมด',
              subtext: 'กิจกรรมถ่ายทอดความรู้และผู้ทรงคุณวุฒิ',
              accentColor: '#e65100',
            },
            {
              icon: <FaUserCheck />,
              value: `${uniquePersons.size} ท่าน`,
              label: 'บุคลากรผู้ให้บริการวิชาการ',
              subtext: `เฉลี่ย ${uniquePersons.size > 0 ? (validData.length / uniquePersons.size).toFixed(1) : 0} ครั้ง/ท่าน`,
              accentColor: '#00A651',
            },
            {
              icon: <FaChalkboardTeacher />,
              value: `${uniqueTargets.size} หน่วยงาน`,
              label: 'กลุ่มเป้าหมายผู้รับบริการ',
              subtext: 'ภาครัฐ เอกชน ชุมชน และสถาบันการศึกษา',
              accentColor: '#0284c7',
            },
            {
              icon: <FaBuilding />,
              value: `${uniqueDepts.size || 7} ภาควิชา`,
              label: 'ภาควิชา/ศูนย์ฯ ที่ร่วมดำเนินการ',
              subtext: 'ครบทุกภาควิชาหลักของคณะฯ',
              accentColor: '#6a1b9a',
            },
          ]}
        />

        <DecisionBox
          title="ข้อมูลสนับสนุนการตัดสินใจผู้บริหาร — งานบริการวิชาการ"
          items={decisionInsights}
        />

        <ServiceCharts
          validData={validData}
          onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
          onSelectType={(type) => setSelectedType(type === selectedType ? 'all' : type)}
          onSelectPerson={(person) => setSearchTerm(searchTerm === person ? '' : person)}
        />

        <ServiceTable
          filteredData={filteredData}
          totalCount={validData.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDept={selectedDept}
          onDeptChange={setSelectedDept}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>
    </div>
  );
}
