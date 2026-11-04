'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useAcademicData } from '../_hooks/useAcademicData';
import { AcademicCharts } from './AcademicCharts';
import { AcademicTable } from './AcademicTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { FaGraduationCap, FaHandHoldingUsd, FaTrophy, FaUserTie } from 'react-icons/fa';

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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e2e8f0',
          padding: '10px 16px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
        }}
      >
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
          className="w-[170px]"
        />

        {/* Month Filter */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '5px 10px',
            borderRadius: '9px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            cursor: 'pointer',
            outline: 'none',
            height: '32px',
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

        {/* Standard Touchpoint: Strategic Filter (ต่อหลังตัวกรองก่อนหน้าทันที) */}
        <StrategicFilterSelect
          value={strategicFilter}
          onChange={setStrategicFilter}
        />

        {/* Checkbox: Hide missing client */}
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#475569',
            cursor: 'pointer',
            userSelect: 'none',
            padding: '4px 8px',
            borderRadius: '8px',
            backgroundColor: hideMissingClient ? '#f0f9ff' : 'transparent',
            border: hideMissingClient ? '1px solid #bae6fd' : '1px solid transparent',
            height: '32px',
            boxSizing: 'border-box',
            marginLeft: 'auto',
          }}
        >
          <input
            type="checkbox"
            checked={hideMissingClient}
            onChange={(e) => setHideMissingClient(e.target.checked)}
            style={{ cursor: 'pointer', accentColor: '#0ea5e9' }}
          />
          <span>ซ่อนไม่ระบุลูกค้า</span>
        </label>
      </div>

      {/* ZONE 2: Executive Bento KPI Grid (Sky Pastel Glow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Volume */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(14, 165, 233, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>มูลค่าสัญญาพัฒนารวม</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaGraduationCap style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {budgetMillions} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', fontWeight: 600 }}>
              {validData.length} โครงการ
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>{uniqueClients.size} องค์กรผู้ว่าจ้าง</span>
          </div>
        </div>

        {/* Card 2: 15% Allocated Revenue */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(16, 185, 129, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>รายได้จัดสรรสุทธิ (15%)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaHandHoldingUsd style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {allocMillions} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', fontWeight: 600 }}>
              คณะ {facMillions} ลบ.
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>ภาควิชา {depMillions} ลบ. • มหาวิทยาลัย {kuMillions} ลบ.</span>
          </div>
        </div>

        {/* Card 3: Average Project Value */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(245, 158, 11, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>มูลค่าเฉลี่ยต่อโครงการ</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaTrophy style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {avgMillions} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', fontWeight: 600 }}>
              สูงสุด: {maxMillions} ลบ.
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>ระบุผู้ว่าจ้างแล้ว {specifiedClientsCount} หน่วยงาน</span>
          </div>
        </div>

        {/* Card 4: Active PIs */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(139, 92, 246, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>หัวหน้าโครงการ</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaUserTie style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {uniqueHeads.size} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ท่าน</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6d28d9', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', fontWeight: 600 }}>
              งบดำเนินงาน 85%
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>{remMillions} ล้านบาท</span>
          </div>
        </div>
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
