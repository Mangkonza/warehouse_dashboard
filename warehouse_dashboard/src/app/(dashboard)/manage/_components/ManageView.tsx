'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { DataManagementRoot } from './DataManagementRoot';

export function ManageView() {
  const router = useRouter();
  const { isAdmin, openLoginModal, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <div className="size-6 border-2 border-[#00A651] border-t-transparent rounded-full animate-spin mr-3" />
        <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>
          เข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ (Admin)
        </h3>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          กรุณาเข้าสู่ระบบเพื่อเข้าใช้งานส่วนระบบจัดการข้อมูล
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
    <div>
      <Suspense fallback={<div className="p-8 text-center text-slate-400">กำลังโหลด...</div>}>
        <DataManagementRoot
          goBack={() => router.push('/overview')}
          onNavigateToMonitoring={() => router.push('/monitoring')}
        />
      </Suspense>
    </div>
  );
}
