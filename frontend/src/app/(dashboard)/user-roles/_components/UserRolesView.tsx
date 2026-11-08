'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/features/auth';
import { Spinner } from '@/components/ui/Spinner';
import { UserRoleManagementTab } from '../../manage/_components/UserRoleManagementTab';

export function UserRolesView() {
  const { isAdmin, openLoginModal, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <Spinner size="md" className="mr-3" />
        <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>
          เข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ
        </h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          กรุณาเข้าสู่ระบบเพื่อเข้าใช้งานส่วนการจัดการสิทธิ์ผู้เข้าใช้งาน
        </p>
        <button
          onClick={openLoginModal}
          style={{
            padding: '10px 24px',
            backgroundColor: '#00A651',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          เข้าสู่ระบบ
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          paddingBottom: '2px',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: '#1e293b',
              letterSpacing: '-0.3px',
            }}
          >
            การจัดการสิทธิ์ผู้เข้าใช้งาน
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            จัดการรายชื่อผู้ดูแลระบบ กำหนดสิทธิ์การเข้าถึง และตรวจสอบประวัติการเปลี่ยนแปลงสิทธิ์
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-slate-400">กำลังโหลด...</div>}>
        <UserRoleManagementTab />
      </Suspense>
    </div>
  );
}
