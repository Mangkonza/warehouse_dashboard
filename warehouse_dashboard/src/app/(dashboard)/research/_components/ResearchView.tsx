'use client';

import React from 'react';
import { useTimeFilter, TimeFilterBar } from '@/features/time-filter';
import { useResearchData } from '../_hooks/useResearchData';
import { ResearchCharts } from './ResearchCharts';
import { ResearchTable } from './ResearchTable';
import { DepartmentSelect, StrategicFilterSelect } from '@/components/ui';
import { PastelIllustratedKpiCard } from '@/components/ui/PastelIllustratedKpiCard';

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
          {/* Funding Type Toggle (Balanced Fixed Weight) */}
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
              { id: 'all', label: 'ทุนทั้งหมด' },
              { id: 'external', label: 'ทุนภายนอก' },
              { id: 'internal', label: 'ทุนภายใน' },
            ].map((f) => {
              const isSelected = fundingType === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFundingType(f.id as any)}
                  style={{
                    minWidth: '82px',
                    height: '30px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? '#0f172a' : '#64748b',
                    fontSize: '12.5px',
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

          {/* Grant Size Tier Dropdown */}
          <select
            value={grantTier}
            onChange={(e) => setGrantTier(e.target.value)}
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
              minWidth: '155px',
              boxSizing: 'border-box',
            }}
            aria-label="ขนาดงบประมาณ"
          >
            <option value="all">ทุกขนาดงบประมาณ</option>
            <option value="tier1">ต่ำกว่า 5 แสนบาท</option>
            <option value="tier2">5 แสน - 2 ล้านบาท</option>
            <option value="tier3">2 - 10 ล้านบาท</option>
            <option value="tier4">ตั้งแต่ 10 ล้านบาทขึ้นไป</option>
          </select>

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
          variant="mint-coins"
          label="งบประมาณวิจัยรวม"
          value={budgetMillions}
          unit="ล้านบาท"
          badgeText={`ทุนภายนอก ${extMillions} ลบ.`}
          progressPercent={Number(extPct)}
          subtitle={`ทุนภายใน ${intMillions} ล้านบาท • รวมทุกแหล่งทุน`}
        />

        <PastelIllustratedKpiCard
          variant="sky-blueprint"
          label="โครงการวิจัยทั้งหมด"
          value={validData.length}
          unit="โครงการ"
          badgeText={`ครอบคลุม ${uniqueDepts.size} หน่วยงาน`}
          progressPercent={Math.min(100, Math.round((uniqueDepts.size / 10) * 100))}
          subtitle={`หัวหน้าโครงการวิจัยรวม ${activePisCount} ท่าน`}
        />

        <PastelIllustratedKpiCard
          variant="amber-spark"
          label="สัดส่วนพึ่งพาทุนภายนอก"
          value={`${extPct}%`}
          badgeText="แหล่งทุนภายนอก"
          progressPercent={Number(extPct)}
          subtitle={`คิดเป็น ${extMillions} จากทั้งหมด ${budgetMillions} ล้านบาท`}
        />

        <PastelIllustratedKpiCard
          variant="violet-crown"
          label="งบเฉลี่ยต่อโครงการ"
          value={avgGrantMillions}
          unit="ล้านบาท"
          badgeText={`สูงสุด ${maxProjectBudgetMillions} ลบ.`}
          progressPercent={68}
          subtitle={`โครงการงบสูงสุดโดย ${maxProj?.head || 'ศ.ดร.เชาว์'}`}
        />
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
