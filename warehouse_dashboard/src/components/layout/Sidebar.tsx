'use client';

import React from 'react';
import { FaBars } from 'react-icons/fa';
import { THEME_COLORS } from '@/config/theme';

export interface SidebarMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  activePath: string;
  isExpanded: boolean;
  isSidebarPinned: boolean;
  onTogglePin: (e: React.MouseEvent) => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onNavigate: (path: string) => void;
  userSlot?: React.ReactNode;
  adminSlot?: React.ReactNode;
  timerSlot?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activePath,
  isExpanded,
  isSidebarPinned,
  onTogglePin,
  onHoverEnter,
  onHoverLeave,
  onNavigate,
  userSlot,
  adminSlot,
  timerSlot,
}) => {
  const sidebarWidth = isExpanded ? 255 : 70;

  return (
    <aside
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: `${sidebarWidth}px`,
        backgroundColor: THEME_COLORS.sidebarBg,
        color: THEME_COLORS.sidebarText,
        zIndex: 1100,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isExpanded ? '4px 0 24px rgba(0,0,0,0.4)' : '2px 0 6px rgba(0,0,0,0.15)',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* 1. User Profile Box at top */}
      <div
        style={{
          height: '65px',
          borderBottom: '1px solid #2d343c',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          marginTop: '4px',
          width: '100%',
        }}
      >
        {userSlot}

        {isExpanded && (
          <div
            style={{
              paddingRight: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 'auto',
            }}
          >
            <button
              onClick={onTogglePin}
              title={isSidebarPinned ? 'ปลดการตรึงเมนู' : 'ตรึงเมนูให้อยู่ตลอดเวลา'}
              style={{
                background: 'none',
                border: 'none',
                color: isSidebarPinned ? '#00e676' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '15px',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = isSidebarPinned ? '#00e676' : '#94a3b8';
              }}
            >
              <FaBars />
            </button>
          </div>
        )}
      </div>

      {/* 2. Navigation items list */}
      <nav style={{ padding: '10px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {menuItems.map((item) => {
          const isActive = activePath === item.path || activePath === `/${item.id}`;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              style={{
                position: 'relative',
                width: '100%',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                border: 'none',
                backgroundColor: isActive ? THEME_COLORS.primary : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                padding: 0,
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = THEME_COLORS.sidebarHover;
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '16px',
                }}
              >
                {item.icon}
              </div>

              <div
                style={{
                  opacity: isExpanded ? 1 : 0,
                  visibility: isExpanded ? 'visible' : 'hidden',
                  transition: 'opacity 0.2s ease',
                  paddingRight: '16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.label}
              </div>
            </button>
          );
        })}

        {/* Admin slot (manage tab) */}
        {adminSlot}
      </nav>

      {/* 3. Timer slot at bottom */}
      {timerSlot}
    </aside>
  );
};
