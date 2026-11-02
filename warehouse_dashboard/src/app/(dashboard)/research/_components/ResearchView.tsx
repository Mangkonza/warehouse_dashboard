'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { FaCoins, FaFlask, FaAward, FaChartLine } from 'react-icons/fa';

export function ResearchView() {
  const { timeFilter, setTimeFilter, resetTimeFilter } = useTimeFilter();
  const {
    validData,
    filteredData,
    totalInternalBudget,
    totalExternalBudget,
    totalBudgetAll,
    megaProjectsCount,
    activePisCount,
    maxProject,
    uniqueDepts,
    uniqueFunds,
    searchTerm,
    setSearchTerm,
    selectedDept,
    setSelectedDept,
    selectedFund,
    setSelectedFund,
    fundingType,
    setFundingType,
    grantTier,
    setGrantTier,
    strategicFilter,
    setStrategicFilter,
  } = useResearchData(timeFilter);

  const budgetMillions = (totalBudgetAll / 1000000).toFixed(2);
  const extMillions = (totalExternalBudget / 1000000).toFixed(2);
  const intMillions = (totalInternalBudget / 1000000).toFixed(2);
  const extPct = totalBudgetAll > 0 ? ((totalExternalBudget / totalBudgetAll) * 100).toFixed(1) : '0';
  const avgGrantMillions = validData.length > 0 ? (totalBudgetAll / validData.length / 1000000).toFixed(2) : '0.00';
  const maxProj = maxProject as any;
  const maxProjectBudgetMillions = maxProj
    ? (((Number(maxProj.budget_internal) || 0) + (Number(maxProj.budget_external) || 0) || Number(maxProj.budget) || 0) / 1000000).toFixed(2)
    : '18.00';

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

        {/* Funding Type Toggle */}
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
            { id: 'all', label: 'ทุนทั้งหมด' },
            { id: 'external', label: 'ทุนภายนอก' },
            { id: 'internal', label: 'ทุนภายใน' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFundingType(f.id as any)}
              style={{
                padding: '4px 10px',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: fundingType === f.id ? '#ffffff' : 'transparent',
                color: fundingType === f.id ? '#0f172a' : '#64748b',
                fontWeight: fundingType === f.id ? 600 : 500,
                boxShadow: fundingType === f.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grant Size Tier Dropdown */}
        <select
          value={grantTier}
          onChange={(e) => setGrantTier(e.target.value)}
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
          aria-label="ขนาดงบประมาณ"
        >
          <option value="all">ทุกขนาดงบประมาณ</option>
          <option value="tier1">&lt; 5 แสนบาท</option>
          <option value="tier2">5 แสน - 2 ล้านบาท</option>
          <option value="tier3">2 - 10 ล้านบาท</option>
          <option value="tier4">&ge; 10 ล้านบาท (ขนาดใหญ่)</option>
        </select>

        {/* Standard Touchpoint: Strategic Filter (ต่อหลังตัวกรองก่อนหน้าทันที) */}
        <StrategicFilterSelect
          value={strategicFilter}
          onChange={setStrategicFilter}
        />
      </div>

      {/* ZONE 2: Executive Bento KPI Grid (Modern Pastel Glow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Total Research Funding */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>งบประมาณวิจัยรวม</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaCoins style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {budgetMillions} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', fontWeight: 600 }}>
              ทุนภายนอก {extMillions} ลบ.
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>ทุนภายใน {intMillions} ลบ.</span>
          </div>
        </div>

        {/* Card 2: Total Projects */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>โครงการวิจัยทั้งหมด</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaFlask style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {validData.length} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>โครงการ</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', fontWeight: 600 }}>
              ครอบคลุม {uniqueDepts.size} หน่วยงาน
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>หัวหน้าโครงการ {activePisCount} ท่าน</span>
          </div>
        </div>

        {/* Card 3: External Ratio */}
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
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>สัดส่วนพึ่งพาทุนภายนอก</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAward style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {extPct}%
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', fontWeight: 600 }}>
              16 โครงการทุนนอก
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }}>{extMillions} จาก {budgetMillions} ล้านบาท</span>
          </div>
        </div>

        {/* Card 4: Average & Max Grant */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>งบเฉลี่ยต่อโครงการ</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaChartLine style={{ fontSize: '15px' }} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {avgGrantMillions} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>ล้านบาท</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ padding: '2px 6px', borderRadius: '6px', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', fontWeight: 600 }}>
              สูงสุด {maxProjectBudgetMillions} ลบ.
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b' }} title={maxProj?.name || ''}>
              {maxProj?.head || 'ศ.ดร.เชาว์'}
            </span>
          </div>
        </div>
      </div>

      {/* ZONE 3: Research Charts (Combo Stacked Bar, Pareto Tiers, SDGs/ISEE/IAM) */}
      <ResearchCharts
        validData={filteredData}
        selectedDept={selectedDept}
        onSelectDept={(dept) => setSelectedDept(dept === selectedDept ? 'all' : dept)}
        selectedFund={selectedFund}
        onSelectFund={(fund) => setSelectedFund(fund === selectedFund ? 'all' : fund)}
      />

      {/* ZONE 4: Research Table with Strategy Badges & Excel Export */}
      <ResearchTable
        filteredData={filteredData}
        uniqueDepts={uniqueDepts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        selectedFund={selectedFund}
        onFundChange={setSelectedFund}
      />
    </div>
  );
}
