'use client';

import React, { ReactNode } from 'react';

export interface KpiCardItem {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  subtext?: ReactNode;
  accentColor?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface KpiCardProps extends KpiCardItem {
  className?: string;
  style?: React.CSSProperties;
}

export function KpiCard({
  value,
  label,
  subtext,
  accentColor = '#00A651',
  active = false,
  onClick,
  className = '',
  style,
}: KpiCardProps) {
  const isHighlighted = active;
  return (
    <div
      className={`kpi-card ${className}`.trim()}
      onClick={onClick}
      style={{
        backgroundColor: isHighlighted ? `${accentColor}0a` : '#ffffff',
        borderRadius: '12px',
        padding: '16px 18px',
        border: isHighlighted ? `2px solid ${accentColor}` : `1.5px solid ${accentColor}40`,
        boxShadow: isHighlighted ? `0 4px 12px ${accentColor}25` : '0 1px 3px rgba(0, 0, 0, 0.04)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '110px',
        ...style,
      }}
    >
      {/* 1. หัวเรื่องข้อมูล ด้านบนสุด */}
      <div
        className="kpi-label"
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#475569',
          lineHeight: 1.3,
          marginBottom: '6px',
        }}
      >
        {label}
      </div>

      {/* 2. ตัวเลขสถิติหลัก ตรงกลาง */}
      <div
        className="kpi-value"
        style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.15,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>

      {/* 3. รายละเอียดเสริม ด้านล่าง */}
      {subtext ? (
        <div
          style={{
            fontSize: '12px',
            color: '#64748b',
            marginTop: '6px',
            lineHeight: 1.35,
          }}
        >
          {subtext}
        </div>
      ) : (
        <div style={{ minHeight: '4px' }} />
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
        <KpiCard key={`kpi-card-${index}`} {...item} />
      ))}
    </div>
  );
}
