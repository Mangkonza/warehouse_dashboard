'use client';

import React from 'react';
import { FaFlask, FaCoins, FaBuilding, FaHandHoldingUsd } from 'react-icons/fa';

interface ResearchKpiGridProps {
  totalCount: number;
  totalBudgetAll: number;
  deptCount: number;
  fundCount: number;
}

export function ResearchKpiGrid({
  totalCount,
  totalBudgetAll,
  deptCount,
  fundCount,
}: ResearchKpiGridProps) {
  const budgetMillions = (totalBudgetAll / 1000000).toFixed(1);

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon"><FaFlask /></div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-label">โครงการวิจัยทั้งหมด</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaCoins /></div>
        <div className="kpi-value">฿{budgetMillions}M</div>
        <div className="kpi-label">งบประมาณรวม</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaBuilding /></div>
        <div className="kpi-value">{deptCount}</div>
        <div className="kpi-label">ภาควิชาที่เกี่ยวข้อง</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaHandHoldingUsd /></div>
        <div className="kpi-value">{fundCount}</div>
        <div className="kpi-label">แหล่งทุนวิจัย</div>
      </div>
    </div>
  );
}
