'use client';

import React from 'react';
import { FaBookOpen, FaTrophy, FaMedal, FaAward, FaEdit } from 'react-icons/fa';

interface PublicationsKpiGridProps {
  totalCount: number;
  q1Count: number;
  q2Count: number;
  tciCount: number;
  otherCount: number;
}

export function PublicationsKpiGrid({
  totalCount,
  q1Count,
  q2Count,
  tciCount,
  otherCount,
}: PublicationsKpiGridProps) {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon"><FaBookOpen /></div>
        <div className="kpi-value">{totalCount}</div>
        <div className="kpi-label">ผลงานทั้งหมด</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaTrophy /></div>
        <div className="kpi-value">{q1Count}</div>
        <div className="kpi-label">ระดับ Scopus Q1</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaMedal /></div>
        <div className="kpi-value">{q2Count}</div>
        <div className="kpi-label">ระดับ Scopus Q2</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaAward /></div>
        <div className="kpi-value">{tciCount}</div>
        <div className="kpi-label">ระดับ TCI</div>
      </div>
      <div className="kpi-card">
        <div className="kpi-icon"><FaEdit /></div>
        <div className="kpi-value">{otherCount}</div>
        <div className="kpi-label">ระดับอื่น ๆ / เตรียมการ</div>
      </div>
    </div>
  );
}
