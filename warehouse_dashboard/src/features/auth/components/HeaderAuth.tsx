'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { FaPowerOff } from 'react-icons/fa';

export const HeaderAuth: React.FC = () => {
  const { user, openLoginModal, logout } = useAuth();

  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={openLoginModal}
          style={{
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s ease, opacity 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogIn size={18} strokeWidth={2.3} style={{ flexShrink: 0 }} />
          <span>เข้าสู่ระบบ</span>
        </button>
      </div>
    );
  }

  // Account ID (e.g. b0123456789)
  const accountId = user?.nontriAccount || '';

  // Full name
  const fullName = user?.nameTh || '';

  const headerText = (() => {
    if (accountId && fullName && !fullName.includes(accountId)) {
      return `${accountId} ${fullName}`;
    }
    return fullName || accountId;
  })();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '16px' }}>
      <span style={{ fontWeight: 500, letterSpacing: '0.2px' }}>
        {headerText}
      </span>

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
