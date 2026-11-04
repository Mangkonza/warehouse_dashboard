'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts } from './IPCharts';
import { IPTable } from './IPTable';
import { DepartmentSelect, StrategicFilterSelect, PastelIllustratedKpiCard } from '@/components/ui';

export function IPView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    pettyPatentCount,
    protectedCount,
    pendingCount,
    inPrepCount,
    totalSupportAmount,
    searchTerm,
    setSearchTerm,
    deptFilter,
    setDeptFilter,
    typeFilter,
    setTypeFilter,
    pipelineFilter,
    setPipelineFilter,
    strategicFilter,
    setStrategicFilter,
  } = useIPData(timeFilter);

  const protectedPct = validIpData.length > 0 ? ((protectedCount / validIpData.length) * 100).toFixed(1) : '0';
  const inPrepPct = validIpData.length > 0 ? ((inPrepCount / validIpData.length) * 100).toFixed(1) : '0';
  const pettyPct = validIpData.length > 0 ? ((pettyPatentCount / validIpData.length) * 100).toFixed(1) : '0';
  const patentPct = validIpData.length > 0 ? ((patentCount / validIpData.length) * 100).toFixed(1) : '0';

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
          padding: '10px 14px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          minHeight: '56px',
          boxSizing: 'border-box',
        }}
      >
        <TimeFilterBar
          value={timeFilter}
          onChange={setTimeFilter}
          onReset={resetTimeFilter}
          totalCount={validIpData.length}
        />

        {/* Department Select */}
        <DepartmentSelect
          value={deptFilter}
          onChange={setDeptFilter}
          allowAll
          allLabel="ทุกภาควิชา (ครบ 7 ภาค)"
          allValue="all"
          size="sm"
          className="w-[185px]"
        />

        {/* Pipeline Status Toggle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#f1f5f9',
            padding: '3px',
            borderRadius: '10px',
            height: '36px',
            boxSizing: 'border-box',
            gap: '2px',
          }}
        >
          {[
            { id: 'all', label: `สถานะทั้งหมด (${validIpData.length})` },
            { id: 'granted', label: `คุ้มครองแล้ว (${protectedCount})` },
            { id: 'pending', label: `ยื่นคำขอแล้ว (${pendingCount})` },
            { id: 'in_prep', label: `เตรียมยื่นจด (${inPrepCount})` },
          ].map((tab) => {
            const active = pipelineFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPipelineFilter(tab.id as any)}
                style={{
                  padding: '0 10px',
                  height: '30px',
                  borderRadius: '8px',
                  border: active ? '1px solid #ddd6fe' : '1px solid transparent',
                  backgroundColor: active ? '#ffffff' : 'transparent',
                  color: active ? '#6d28d9' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: active ? '0 1px 2px rgba(15,23,42,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* IP Type Select */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: '0 12px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '12px',
            color: '#334155',
            cursor: 'pointer',
            fontWeight: 600,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        >
          <option value="all">ประเภททรัพย์สินทางปัญญาทั้งหมด</option>
          <option value="อนุสิทธิบัตร">อนุสิทธิบัตร ({pettyPatentCount})</option>
          <option value="สิทธิบัตรการประดิษฐ์">สิทธิบัตรการประดิษฐ์ ({patentCount})</option>
        </select>

        {/* Strategic Filter Select */}
        <StrategicFilterSelect
          value={strategicFilter}
          onChange={setStrategicFilter}
        />
      </div>

      {/* ZONE 2: Pastel Illustrated KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        <PastelIllustratedKpiCard
          label="ทรัพย์สินทางปัญญาทั้งหมด"
          value={validIpData.length}
          unit="รายการ"
          subtitle={`อนุสิทธิบัตร ${pettyPatentCount} (${pettyPct}%) • สิทธิบัตรการประดิษฐ์ ${patentCount} (${patentPct}%)`}
          badgeText="ทะเบียนสะสมรวม"
          progressPercent={100}
          variant="lavender-shield"
        />

        <PastelIllustratedKpiCard
          label="ได้รับความคุ้มครองแล้ว"
          value={protectedCount}
          unit="รายการ"
          subtitle={`คิดเป็น ${protectedPct}% ของผลงานทั้งหมด • รอพิจารณาคำขอ ${pendingCount} รายการ`}
          badgeText={`คุ้มครองสำเร็จ ${protectedPct}%`}
          progressPercent={Number(protectedPct)}
          variant="emerald-award"
        />

        <PastelIllustratedKpiCard
          label="อยู่ระหว่างเตรียมยื่นจดทะเบียน"
          value={inPrepCount}
          unit="รายการ"
          subtitle={`คิดเป็น ${inPrepPct}% ของทั้งหมด • รอยื่นเอกสารเพื่อรับหมายเลขคำขอ`}
          badgeText={`ระยะเตรียมยื่น ${inPrepPct}%`}
          progressPercent={Number(inPrepPct)}
          variant="cyan-pipeline"
        />

        <PastelIllustratedKpiCard
          label="งบสนับสนุนที่คณะจ่ายจริง"
          value={totalSupportAmount.toLocaleString('th-TH')}
          unit="บาท"
          subtitle="สนับสนุนแล้ว 12 รายการ (รายการละ 20,000 บาท) • รอพิจารณา 9 รายการ"
          badgeText="ทุนสนับสนุนสิ่งประดิษฐ์"
          progressPercent={57}
          variant="mint-coins"
        />
      </div>

      {/* ZONE 3: 4 Dimension Tabs Charts */}
      <IPCharts
        validIpData={validIpData}
        onSelectDept={(dept) => setDeptFilter(dept === deptFilter ? 'all' : dept)}
        onSelectType={(type) => setTypeFilter(type === typeFilter ? 'all' : type)}
      />

      {/* ZONE 4: Smart IP Data Grid Table */}
      <IPTable
        filteredIpData={filteredIpData}
        totalCount={validIpData.length}
        availableDepts={availableDepts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        deptFilter={deptFilter}
        onDeptChange={setDeptFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />
    </div>
  );
}
