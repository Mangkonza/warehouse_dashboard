'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaPowerOff } from 'react-icons/fa';

export const HeaderAuth: React.FC = () => {
  const { user, openLoginModal, logout } = useAuth();

  if (!user) {
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

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '16px' }}>
      {/* รหัสบัญชีผู้ใช้ (Dynamic ตามที่ login เช่น b6520503525) */}
      <span style={{ fontWeight: 500, letterSpacing: '0.2px' }}>
        {user.nontriAccount}
      </span>

      {/* ปุ่ม Power ออกจากระบบ */}
      <button
        onClick={logout}
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
