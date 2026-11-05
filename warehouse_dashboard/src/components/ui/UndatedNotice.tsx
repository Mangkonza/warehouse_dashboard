'use client';

import React from 'react';

interface UndatedNoticeProps {
  count: number;
  message?: string;
  className?: string;
}

/**
 * Shows how many records cannot participate in a time filter because their
 * source data has no usable date. Rendered only while a time filter is active.
 */
export function UndatedNotice({ count, message, className }: UndatedNoticeProps) {
  if (!count) return null;
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        color: '#64748b',
        fontSize: '12px',
        lineHeight: 1.4,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#94a3b8',
          flexShrink: 0,
        }}
      />
      <span>{message || `ไม่ระบุวันที่ ${count.toLocaleString('th-TH')} รายการ (ไม่แสดงเมื่อกรองเวลา)`}</span>
    </div>
  );
}
