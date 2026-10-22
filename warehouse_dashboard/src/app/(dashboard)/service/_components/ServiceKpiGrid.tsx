'use client';

import React from 'react';
import { FaHandsHelping, FaUserCheck, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa';

interface ServiceKpiGridProps {
  totalCount: number;
  personCount: number;
  targetCount: number;
  deptCount: number;
}

export function ServiceKpiGrid({
  totalCount,
  personCount,
  targetCount,
  deptCount,
}: ServiceKpiGridProps) {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon"><FaHandsHelping /></div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-label">กิจกรรมทั้งหมด</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaUserCheck /></div>
        <div className="kpi-value">{personCount}</div>
        <div className="kpi-label">อาจารย์/ผู้รับผิดชอบ</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaChalkboardTeacher /></div>
        <div className="kpi-value">{targetCount}</div>
        <div className="kpi-label">กลุ่มเป้าหมายผู้รับบริการ</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaBuilding /></div>
        <div className="kpi-value">{deptCount || 7}</div>
        <div className="kpi-label">ภาควิชาที่มีส่วนร่วม</div>
      </div>
    </div>
  );
}
