'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { FaBook, FaGlobeAmericas, FaAward, FaCoins } from 'react-icons/fa';

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
    publishedCount,
    inPrepCount,
    searchTerm,
    setSearchTerm,
    levelFilter,
    setLevelFilter,
    statusFilter,
    setStatusFilter,
    selectedDept,
    setSelectedDept,
    strategicFilter,
    setStrategicFilter,
  } = usePublicationsData(timeFilter);

  const highTierCount = q1Count + q2Count;
  const highTierPct = validData.length > 0 ? ((highTierCount / validData.length) * 100).toFixed(1) : '0';
  const tciPct = validData.length > 0 ? ((tciCount / validData.length) * 100).toFixed(1) : '0';
  const avgSupport = validData.length > 0 ? Math.round(totalSupportBudget / validData.length).toLocaleString('th-TH') : '0';

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

        {/* Database Tier Segmented Control */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            fontSize: '12px',
            fontWeight: 500,
            height: '32px',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          {[
            { id: 'all', label: `ทั้งหมด (${validData.length})` },
            { id: 'Q1', label: `Q1 (${q1Count})` },
            { id: 'Q2', label: `Q2 (${q2Count})` },
            { id: 'TCI', label: `TCI (${tciCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setLevelFilter(f.id)}
              style={{
                padding: '4px 8px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: levelFilter === f.id ? '#ffffff' : 'transparent',
                color: levelFilter === f.id ? '#be123c' : '#64748b',
                fontWeight: levelFilter === f.id ? 700 : 500,
                boxShadow: levelFilter === f.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '9px',
            fontSize: '12px',
            fontWeight: 500,
            height: '32px',
            boxSizing: 'border-box',
            alignItems: 'center',
          }}
        >
          {[
            { id: 'all', label: 'ทุกสถานะ' },
            { id: 'published', label: 'ตีพิมพ์แล้ว' },
            { id: 'prep', label: 'เตรียมพร้อม' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              style={{
                padding: '4px 8px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === s.id ? '#ffffff' : 'transparent',
                color: statusFilter === s.id ? '#0f172a' : '#64748b',
                fontWeight: statusFilter === s.id ? 600 : 500,
                boxShadow: statusFilter === s.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Standard Touchpoint: Strategic Filter (ต่อหลังตัวกรองก่อนหน้าทันที) */}
        <StrategicFilterSelect
          value={strategicFilter}
          onChange={setStrategicFilter}
        />
      </div>

      {/* ZONE 2: Executive Bento KPI Grid (Rose Pastel Glow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Publications */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(244, 63, 94, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>ผลงานตีพิมพ์ทางวิชาการรวม</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fff1f2', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBook style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {validData.length} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>เรื่อง</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#be123c', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', fontWeight: 600 }}>
              ตีพิมพ์สำเร็จ {publishedCount}
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>เตรียมความพร้อม {inPrepCount}</span>
          </div>
        </div>

        {/* Card 2: High Tier Q1/Q2 */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>สัดส่วนนานาชาติ Q1 / Q2</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaGlobeAmericas style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {highTierPct}% <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>({highTierCount} เรื่อง)</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontWeight: 700 }}>
              Q1: {q1Count}
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', fontWeight: 700 }}>
              Q2: {q2Count}
            </span>
          </div>
        </div>

        {/* Card 3: TCI */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>ผลงานระดับชาติ (TCI)</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAward style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {tciPct}% <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>({tciCount} เรื่อง)</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', fontWeight: 600 }}>
              TCI กลุ่ม 1 และ 2
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>{nationalCount} บทความในประเทศ</span>
          </div>
        </div>

        {/* Card 4: Support Budget */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>งบสนับสนุนการตีพิมพ์</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCoins style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {totalSupportBudget.toLocaleString('th-TH')} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>บาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', fontWeight: 600 }}>
              เฉลี่ย {avgSupport} ฿/เรื่อง
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>เงินรางวัลและค่าตีพิมพ์</span>
          </div>
        </div>
      </div>

      {/* ZONE 3: Publications Charts */}
      <PublicationsCharts
        validData={filteredData}
        onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
        onSelectLevel={(lvl) => setLevelFilter(lvl === levelFilter ? 'all' : lvl)}
      />

      {/* ZONE 4: Publications Table with Strategy Badges & BibTeX/CSV Export */}
      <PublicationsTable
        filteredData={filteredData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
      />
    </div>
  );
}
