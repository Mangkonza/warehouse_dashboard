'use client';

import React, { ReactNode } from 'react';

export interface KpiCardItem {
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
}

export interface KpiCardProps extends KpiCardItem {
  className?: string;
  style?: React.CSSProperties;
}

export function KpiCard({ icon, value, label, className = '', style }: KpiCardProps) {
  return (
    <div className={`kpi-card ${className}`.trim()} style={style}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

export interface KpiGridProps {
  items: KpiCardItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function KpiGrid({ items, className = '', style }: KpiGridProps) {
  return (
    <div className={`kpi-grid ${className}`.trim()} style={style}>
      {items.map((item, index) => (
        <KpiCard key={index} {...item} />
      ))}
    </div>
  );
}
