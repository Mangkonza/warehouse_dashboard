'use client';

import React, { ReactNode } from 'react';

export interface KpiCardItem {
  icon?: ReactNode;
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
        border: `1.5px solid ${accentColor}`,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '110px',
        ...style,
      }}
    >
      {/* 1. Header Row (หัวเรื่องอยู่บนสุด อ่านแล้วรู้ทันทีว่าเป็นข้อมูลอะไร ไม่ใช้ icon หรือ emoji) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          className="kpi-label"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#334155',
            lineHeight: 1.35,
            letterSpacing: '0.1px',
          }}
        >
          {label}
        </div>
        {onClick && (
          <span
            style={{
              fontSize: '11px',
              color: accentColor,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              backgroundColor: `${accentColor}12`,
              padding: '2px 8px',
              borderRadius: '999px',
              border: `1px solid ${accentColor}30`,
              flexShrink: 0,
            }}
          >
            คลิกดูรายการ ▸
          </span>
        )}
      </div>

      {/* 2. Main Value (ตัวเลขสถิติสำคัญ แสดงผลชัดเจน) */}
      <div>
        <div
          className="kpi-value"
          style={{
            fontSize: '25px',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.15,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>

        {/* 3. Subtext (ข้อมูลประกอบย่อย) */}
        {subtext && (
          <div
            className="kpi-subtext"
            style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '6px',
              lineHeight: 1.4,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
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
    <div
      className={`kpi-grid ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        ...style,
      }}
    >
      {items.map((item, index) => (
        <KpiCard key={index} {...item} />
      ))}
    </div>
  );
}
