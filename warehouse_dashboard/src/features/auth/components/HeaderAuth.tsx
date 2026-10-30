'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSsoUserSafe } from '../context/SsoUserContext';
import { FaGraduationCap, FaPowerOff } from 'react-icons/fa';

export const HeaderAuth: React.FC = () => {
  const { user: legacyUser, openLoginModal, logout: legacyLogout } = useAuth();
  const sso = useSsoUserSafe();
  const ssoUser = sso?.user;

  const isAuthenticated = Boolean(legacyUser || (sso && sso.status === 'authenticated' && ssoUser));

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={openLoginModal}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
        >
          <FaGraduationCap style={{ fontSize: '16px' }} />
          <span>เข้าสู่ระบบ KU ALL-Login</span>
        </button>
      </div>
    );
  }

  // Account ID (e.g. 6520503525 or b6520503525)
  const accountId = ssoUser?.nontriId || legacyUser?.nontriAccount || '';

  // Full name from Central Nontri Profile (e.g. "นาย อนันต์สิทธิ์ รุจิเรกวงศ์")
  const fullName =
    ssoUser?.name ||
    (ssoUser?.firstName && ssoUser?.lastName ? `${ssoUser.firstName} ${ssoUser.lastName}` : null) ||
    legacyUser?.nameTh ||
    '';

  // Format Header display like Image 2: "6520503525 นาย อนันต์สิทธิ์ รุจิเรกวงศ์"
  const headerText = (() => {
    if (accountId && fullName && !fullName.includes(accountId)) {
      return `${accountId} ${fullName}`;
    }
    return fullName || accountId;
  })();

  const handleLogout = () => {
    if (sso?.status === 'authenticated' && sso.logout) {
      sso.logout();
    } else {
      legacyLogout();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '16px' }}>
      {/* รหัสบัญชีผู้ใช้ และ ชื่อ-นามสกุล (ตรงตามภาพที่สอง) */}
      <span style={{ fontWeight: 500, letterSpacing: '0.2px' }}>
        {headerText}
      </span>

      {/* ปุ่ม Power ออกจากระบบ */}
      <button
        onClick={handleLogout}
        title="ออกจากระบบ"
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          padding: '6px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.15s, color 0.15s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#ffcdd2';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <FaPowerOff />
      </button>
    </div>
  );
};
