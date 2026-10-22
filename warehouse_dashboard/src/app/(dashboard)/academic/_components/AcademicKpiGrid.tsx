'use client';

import React from 'react';
import { FaGraduationCap, FaCoins, FaUsers, FaUserTie } from 'react-icons/fa';

interface AcademicKpiGridProps {
  totalCount: number;
  totalBudgetAll: number;
  clientCount: number;
  headCount: number;
}

export function AcademicKpiGrid({
  totalCount,
  totalBudgetAll,
  clientCount,
  headCount,
}: AcademicKpiGridProps) {
  const budgetMillions = (totalBudgetAll / 1000000).toFixed(1);

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon"><FaGraduationCap /></div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-label">โครงการพัฒนาวิชาการ</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaCoins /></div>
        <div className="kpi-value">฿{budgetMillions}M</div>
        <div className="kpi-label">งบประมาณรวม</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaUsers /></div>
        <div className="kpi-value">{clientCount}</div>
        <div className="kpi-label">หน่วยงานผู้ขอรับบริการ</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaUserTie /></div>
        <div className="kpi-value">{headCount}</div>
        <div className="kpi-label">หัวหน้าโครงการ</div>
      </div>
    </div>
  );
}
