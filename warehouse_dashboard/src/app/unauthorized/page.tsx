'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { FaShieldAlt, FaArrowLeft, FaPowerOff } from 'react-icons/fa';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#121518',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#f8fafc',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#1a1f24',
          border: '1px solid #2d343c',
          borderRadius: '16px',
          padding: '36px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#ef4444',
            fontSize: '28px',
          }}
        >
          <FaShieldAlt />
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '10px',
            color: '#f1f5f9',
          }}
        >
          ไม่มีสิทธิ์เข้าถึงหน้านี้ (403)
        </h1>

        <p
          style={{
            fontSize: '14px',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '24px',
          }}
        >
          บัญชีของคุณ (<strong>{user?.nontriAccount || 'ผู้ใช้งาน'}</strong>) มีบทบาท{' '}
          <span style={{ color: '#00e676', fontWeight: 600 }}>{user?.role || 'user'}</span> ซึ่งยังไม่ได้รับสิทธิ์เข้าถึงเนื้อหาในส่วนนี้
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            href="/overview"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
              backgroundColor: '#00A651',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            <FaArrowLeft />
            <span>กลับสู่หน้าภาพรวมแดชบอร์ด</span>
          </Link>

          <button
            onClick={() => logout()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #334155',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <FaPowerOff />
            <span>ออกจากระบบ / สลับบัญชี</span>
          </button>
        </div>
      </div>
    </div>
  );
}
