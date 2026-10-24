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
  return (
    <div
      className={`kpi-card ${className}`.trim()}
      onClick={onClick}
      style={{
        backgroundColor: active ? `${accentColor}10` : '#ffffff',
        borderRadius: '12px',
        padding: '16px 18px',
        border: active ? `2px solid ${accentColor}` : `1.5px solid ${accentColor}`,
        boxShadow: active ? `0 4px 14px ${accentColor}25` : '0 1px 3px rgba(0, 0, 0, 0.04)',
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
      {/* 1. Header Row (หัวเรื่องอยู่บนสุด เต็มแถว ชัดเจน เรียบหรู ไม่ใช้ icon หรือ emoji หรือป้ายข้อความซ้ำซ้อน) */}
      <div style={{ marginBottom: '8px' }}>
        <div
          className="kpi-label"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: active ? '#0f172a' : '#334155',
            lineHeight: 1.35,
            letterSpacing: '0.1px',
          }}
        >
          {label}
        </div>
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
