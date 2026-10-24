'use client';

import React, { ReactNode } from 'react';

export interface KpiCardItem {
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
  subtext?: ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export interface KpiCardProps extends KpiCardItem {
  className?: string;
  style?: React.CSSProperties;
}

export function KpiCard({
  icon,
  value,
  label,
  subtext,
  accentColor = '#00A651',
  onClick,
  className = '',
  style,
}: KpiCardProps) {
  return (
    <div
      className={`kpi-card ${className}`.trim()}
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '16px 18px',
        border: '1px solid #e2e8f0',
        borderTop: `3px solid ${accentColor}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div
          className="kpi-icon"
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: `${accentColor}14`,
            color: accentColor,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            marginBottom: 0,
          }}
        >
          {icon}
        </div>
        {onClick && (
          <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 500 }}>
            คลิกดูรายการ ▸
          </span>
        )}
      </div>
      <div
        className="kpi-value"
        style={{
          fontSize: '23px',
          fontWeight: 700,
          color: '#1e293b',
          lineHeight: 1.15,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div
        className="kpi-label"
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#334155',
          marginTop: '4px',
        }}
      >
        {label}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: '11.5px',
            color: '#64748b',
            marginTop: '4px',
            lineHeight: 1.35,
          }}
        >
          {subtext}
        </div>
      )}
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
