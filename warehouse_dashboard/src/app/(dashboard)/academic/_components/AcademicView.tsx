'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts } from './AcademicCharts';
import { AcademicTable } from './AcademicTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { PastelIllustratedKpiCard } from '@/components/ui/PastelIllustratedKpiCard';

export function AcademicView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    displayData,
    totalBudgetAll,
    totalAllocFaculty,
    totalAllocDept,
    totalAllocKu,
    totalAllocRemaining,
    totalAllocated15,
    topDeptName,
    topDeptBudget,
    avgProjectBudget,
    maxProjectBudget,
    specifiedClientsCount,
    uniqueHeads,
    uniqueClients,
    uniqueDepts,
    searchTerm,
    setSearchTerm,
    selectedClient,
    setSelectedClient,
    selectedDept,
    setSelectedDept,
    selectedMonth,
    setSelectedMonth,
    hideMissingClient,
    setHideMissingClient,
    strategicFilter,
    setStrategicFilter,
  } = useAcademicData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const allocMillions = (totalAllocated15 / 1000000).toFixed(2);
  const facMillions = (totalAllocFaculty / 1000000).toFixed(2);
  const depMillions = (totalAllocDept / 1000000).toFixed(2);
  const kuMillions = (totalAllocKu / 1000000).toFixed(2);
  const remMillions = (totalAllocRemaining / 1000000).toFixed(2);
  const topDeptBudgetM = (topDeptBudget / 1000000).toFixed(2);
  const avgMillions = (avgProjectBudget / 1000000).toFixed(2);
  const maxMillions = (maxProjectBudget / 1000000).toFixed(2);

  const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ZONE 1: Global Filter Bar (Sticky Docked Under Header) */}
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
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <TimeFilterBar
            value={timeFilter}
            onChange={setTimeFilter}
            onReset={resetTimeFilter}
            totalCount={validData.length}
          />

          <DepartmentSelect
            value={selectedDept}
            onChange={setSelectedDept}
            allowAll
            allLabel="ทุกภาควิชา / ศูนย์"
            allValue="all"
            size="sm"
            className="w-[180px]"
          />

          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '0 12px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              height: '36px',
              minWidth: '150px',
              boxSizing: 'border-box',
            }}
            aria-label="เลือกเดือนดำเนินงาน"
          >
            <option value="all">ทุกเดือน (ม.ค. - ธ.ค.)</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                เดือน {m}
              </option>
            ))}
            <option value="ไม่ระบุ">ไม่ระบุเดือน</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
          />

          {/* Checkbox: Hide missing client */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: hideMissingClient ? '#0369a1' : '#475569',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '0 12px',
              borderRadius: '10px',
              backgroundColor: hideMissingClient ? '#e0f2fe' : '#f8fafc',
              border: `1px solid ${hideMissingClient ? '#7dd3fc' : '#e2e8f0'}`,
              height: '36px',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            <input
              type="checkbox"
              checked={hideMissingClient}
              onChange={(e) => setHideMissingClient(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#38bdf8' }}
            />
            <span>ซ่อนรายการไม่ระบุผู้ว่าจ้าง</span>
          </label>
        </div>
      </div>

      {/* ZONE 2: Decorative Pastel Illustrated KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        <PastelIllustratedKpiCard
          variant="sky-blueprint"
          label="มูลค่าสัญญาพัฒนารวม"
          value={budgetMillions}
          unit="ล้านบาท"
          badgeText={`${validData.length} โครงการ`}
          progressPercent={85}
          subtitle={`ครอบคลุม ${uniqueClients.size} องค์กรผู้ว่าจ้าง`}
        />

        <PastelIllustratedKpiCard
          variant="mint-coins"
          label="รายได้จัดสรรสุทธิ (ร้อยละ 15)"
          value={allocMillions}
          unit="ล้านบาท"
          badgeText={`คณะ ${facMillions} ลบ.`}
          progressPercent={72}
          subtitle={`ภาควิชา ${depMillions} ลบ. • มหาวิทยาลัย ${kuMillions} ลบ.`}
        />

        <PastelIllustratedKpiCard
          variant="amber-spark"
          label="มูลค่าเฉลี่ยต่อโครงการ"
          value={avgMillions}
          unit="ล้านบาท"
          badgeText={`สูงสุด ${maxMillions} ลบ.`}
          progressPercent={65}
          subtitle={`ระบุผู้ว่าจ้างชัดเจนแล้ว ${specifiedClientsCount} หน่วยงาน`}
        />

        <PastelIllustratedKpiCard
          variant="peach-people"
          label="หัวหน้าโครงการพัฒนาวิชาการ"
          value={uniqueHeads.size}
          unit="ท่าน"
          badgeText="งบดำเนินงานร้อยละ 85"
          progressPercent={85}
          subtitle={`วงเงินดำเนินงานโครงการรวม ${remMillions} ล้านบาท`}
        />
      </div>

      {/* ZONE 3: Academic Charts (Monthly Trend, Dept Breakdown, Top Clients, SDGs/ISEE/IAM) */}
      <AcademicCharts
        validData={displayData}
        totalAllocFaculty={totalAllocFaculty}
        totalAllocDept={totalAllocDept}
        totalAllocKu={totalAllocKu}
        totalAllocRemaining={totalAllocRemaining}
        hideMissingClient={hideMissingClient}
        onSelectClient={(client) => setSelectedClient(client === selectedClient ? 'all' : client)}
      />

      {/* ZONE 4: Academic Table with Strategy Badges & Export */}
      <AcademicTable
        displayData={displayData}
        totalCount={validData.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
      />
    </div>
  );
}
