'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useIPData } from '../_hooks/useIPData';
import { IPCharts } from './IPCharts';
import { IPTable } from './IPTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { FaCertificate, FaShieldAlt, FaHourglassHalf, FaCoins, FaUndoAlt } from 'react-icons/fa';

export function IPView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validIpData,
    filteredIpData,
    availableDepts,
    patentCount,
    pettyPatentCount,
    copyrightCount,
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
    fiscalYearFilter,
    setFiscalYearFilter,
    strategicFilter,
    setStrategicFilter,
  } = useIPData(timeFilter);

  const hasFilter =
    fiscalYearFilter !== 'all' ||
    deptFilter !== 'all' ||
    pipelineFilter !== 'all' ||
    typeFilter !== 'all' ||
    strategicFilter !== 'all' ||
    searchTerm.trim() !== '';

  const handleResetAll = () => {
    resetTimeFilter();
    setFiscalYearFilter('all');
    setDeptFilter('all');
    setPipelineFilter('all');
    setTypeFilter('all');
    setStrategicFilter('all');
    setSearchTerm('');
  };

  const protectedPct = validIpData.length > 0 ? ((protectedCount / validIpData.length) * 100).toFixed(1) : '0';
  const inPrepPct = validIpData.length > 0 ? ((inPrepCount / validIpData.length) * 100).toFixed(1) : '0';

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
            totalCount={validIpData.length}
          />

          {/* Fiscal Year Toggle */}
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
              { id: 'all', label: `ทั้งหมด (${validIpData.length})` },
              { id: '2570', label: 'ปีงบ 2570' },
              { id: '2569', label: 'ปีงบ 2569' },
              { id: '2568', label: 'ปีงบ 2568' },
            ].map((tab) => {
              const active = fiscalYearFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFiscalYearFilter(tab.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active ? '#ffffff' : 'transparent',
                    color: active ? '#6d28d9' : '#64748b',
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
              backgroundColor: '#f1f5f9',
              padding: '3px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {[
              { id: 'all', label: `สถานะทั้งหมด (${validIpData.length})` },
              { id: 'granted', label: `🟢 คุ้มครองแล้ว (${protectedCount})` },
              { id: 'pending', label: `🔵 ยื่นคำขอแล้ว (${pendingCount})` },
              { id: 'in_prep', label: `🟠 เตรียมยื่นจด (${inPrepCount})` },
            ].map((tab) => {
              const active = pipelineFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPipelineFilter(tab.id as any)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active ? '#ffffff' : 'transparent',
                    color: active ? '#6d28d9' : '#64748b',
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

          {/* IP Type Select */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 500,
              outline: 'none',
            }}
          >
            <option value="all">ประเภท IP ทั้งหมด</option>
            <option value="อนุสิทธิบัตร">อนุสิทธิบัตร ({pettyPatentCount})</option>
            <option value="สิทธิบัตรการประดิษฐ์">สิทธิบัตรการประดิษฐ์ ({patentCount})</option>
          </select>

          {/* Strategic Filter Select */}
          <StrategicFilterSelect
            value={strategicFilter}
            onChange={setStrategicFilter}
          />

        {hasFilter && (
          <button
            type="button"
            onClick={handleResetAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #ddd6fe',
              backgroundColor: '#f5f3ff',
              color: '#6d28d9',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              height: '32px',
              boxSizing: 'border-box',
              marginLeft: 'auto',
            }}
          >
            <FaUndoAlt style={{ fontSize: '11px' }} />
            <span>ล้างตัวกรอง</span>
          </button>
        )}
      </div>

      {/* ZONE 2: Executive Bento KPI Cards in Lavender Violet Palette */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total IP */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
            border: '1px solid #ddd6fe',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9' }}>
              ทรัพย์สินทางปัญญาทั้งหมด
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed',
              }}
            >
              <FaCertificate style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {validIpData.length} <span style={{ fontSize: '16px', fontWeight: 600, color: '#6d28d9' }}>รายการ</span>
            </div>
            <div style={{ fontSize: '12px', color: '#5b21b6', marginTop: '4px' }}>
              อนุสิทธิบัตร {pettyPatentCount} (95.2%) • สิทธิบัตรการประดิษฐ์ {patentCount} (4.8%)
            </div>
          </div>
        </div>

        {/* Card 2: Granted & Protected */}
        <div
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#047857' }}>
              ได้รับความคุ้มครองแล้ว
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <FaShieldAlt style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {protectedCount} <span style={{ fontSize: '16px', fontWeight: 600, color: '#047857' }}>รายการ</span>
            </div>
            <div style={{ fontSize: '12px', color: '#065f46', marginTop: '4px' }}>
              คิดเป็น {protectedPct}% ของผลงานทั้งหมด • รอพิจารณาคำขอ {pendingCount} รายการ
            </div>
          </div>
        </div>

        {/* Card 3: Backlog & In Prep */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '1px solid #fed7aa',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
              ค้างท่อเตรียมยื่นจด (Bottleneck)
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
              }}
            >
              <FaHourglassHalf style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {inPrepCount} <span style={{ fontSize: '16px', fontWeight: 600, color: '#92400e' }}>รายการ</span>
            </div>
            <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px' }}>
              คิดเป็น {inPrepPct}% (คอขวดเร่งด่วน) • รอยื่นเอกสารรับเลขคำขอ
            </div>
          </div>
        </div>

        {/* Card 4: Incentive Support */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
            border: '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 14px rgba(244, 63, 94, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#be123c' }}>
              งบสนับสนุนที่คณะจ่ายจริง
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#ffe4e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e11d48',
              }}
            >
              <FaCoins style={{ fontSize: '16px' }} />
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {totalSupportAmount.toLocaleString('th-TH')} <span style={{ fontSize: '16px', fontWeight: 600, color: '#be123c' }}>บาท</span>
            </div>
            <div style={{ fontSize: '12px', color: '#9f1239', marginTop: '4px' }}>
              สนับสนุนแล้ว 12 รายการ (@20,000 บ.) • รอพิจารณา 9 รายการ
            </div>
          </div>
        </div>
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
