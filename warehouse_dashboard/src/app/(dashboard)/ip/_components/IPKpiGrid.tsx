'use client';

import React from 'react';
import { FaCertificate, FaScroll, FaMoneyBillWave, FaBuilding } from 'react-icons/fa';

interface IPKpiGridProps {
  totalCount: number;
  patentCount: number;
  deptCount: number;
}

export function IPKpiGrid({ totalCount, patentCount, deptCount }: IPKpiGridProps) {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon">
          <FaCertificate />
        </div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-label">จำนวนทรัพย์สินทางปัญญา (รวม)</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon">
          <FaScroll />
        </div>
        <div className="kpi-value">{patentCount}</div>
        <div className="kpi-label">สิทธิบัตร/อนุสิทธิบัตร</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon">
          <FaMoneyBillWave />
        </div>
        <div className="kpi-value">฿20,000</div>
        <div className="kpi-label">เงินสนับสนุน</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon">
          <FaBuilding />
        </div>
        <div className="kpi-value">{deptCount}</div>
        <div className="kpi-label">ภาควิชาที่มีผลงาน IP</div>
      </div>
    </div>
  );
}
