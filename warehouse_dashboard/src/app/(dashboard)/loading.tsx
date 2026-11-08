import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '14px',
        color: '#64748b',
      }}
    >
      <Spinner size="lg" label="กำลังโหลดข้อมูล..." />
      <span style={{ fontSize: '13.5px', fontWeight: 500 }}>
        กำลังโหลดข้อมูล...
      </span>
    </div>
  );
}
