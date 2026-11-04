'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { usePublicationsData } from '../_hooks/usePublicationsData';
import { PublicationsCharts } from './PublicationsCharts';
import { PublicationsTable } from './PublicationsTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { PastelIllustratedKpiCard } from '@/components/ui/PastelIllustratedKpiCard';

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
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {/* Database Tier Segmented Control (Balanced Fixed Weight) */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '10px',
              height: '36px',
              boxSizing: 'border-box',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {[
              { id: 'all', label: `ทั้งหมด (${validData.length})` },
              { id: 'Q1', label: `นานาชาติ ระดับ 1 (${q1Count})` },
              { id: 'Q2', label: `นานาชาติ ระดับ 2 (${q2Count})` },
              { id: 'TCI', label: `ระดับชาติ (${tciCount})` },
            ].map((f) => {
              const isSelected = levelFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setLevelFilter(f.id)}
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#be123c' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Status Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '10px',
              height: '36px',
              boxSizing: 'border-box',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {[
              { id: 'all', label: 'ทุกสถานะ' },
              { id: 'published', label: 'ตีพิมพ์แล้ว' },
              { id: 'prep', label: 'เตรียมพร้อม' },
            ].map((s) => {
              const isSelected = statusFilter === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatusFilter(s.id)}
                  style={{
                    height: '30px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#0f172a' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
          />
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
          variant="rose-journal"
          label="ผลงานตีพิมพ์ทางวิชาการรวม"
          value={validData.length}
          unit="เรื่อง"
          badgeText={`ตีพิมพ์สำเร็จ ${publishedCount}`}
          progressPercent={validData.length > 0 ? Math.round((publishedCount / validData.length) * 100) : 100}
          subtitle={`อยู่ระหว่างเตรียมความพร้อม ${inPrepCount} รายการ`}
        />

        <PastelIllustratedKpiCard
          variant="teal-globe"
          label="สัดส่วนวารสารนานาชาติชั้นนำ"
          value={`${highTierPct}%`}
          unit={`(${highTierCount} เรื่อง)`}
          badgeText={`ระดับ 1 จำนวน ${q1Count} เรื่อง`}
          progressPercent={Number(highTierPct)}
          subtitle={`วารสารนานาชาติระดับ 2 จำนวน ${q2Count} เรื่อง`}
        />

        <PastelIllustratedKpiCard
          variant="emerald-award"
          label="ผลงานวารสารระดับชาติ"
          value={`${tciPct}%`}
          unit={`(${tciCount} เรื่อง)`}
          badgeText="กลุ่มที่ 1 และ 2"
          progressPercent={Number(tciPct)}
          subtitle={`บทความเผยแพร่ในประเทศรวม ${nationalCount} เรื่อง`}
        />

        <PastelIllustratedKpiCard
          variant="mint-coins"
          label="งบสนับสนุนการตีพิมพ์รวม"
          value={totalSupportBudget.toLocaleString('th-TH')}
          unit="บาท"
          badgeText={`เฉลี่ย ${avgSupport} บาท/เรื่อง`}
          progressPercent={78}
          subtitle="เงินรางวัลผลงานวิชาการและค่าธรรมเนียมการตีพิมพ์"
        />
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
