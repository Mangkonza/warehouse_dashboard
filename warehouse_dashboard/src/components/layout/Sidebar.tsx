'use client';

import React from 'react';
import { FaBars } from 'react-icons/fa';
import { THEME_COLORS } from '@/config/theme';

export interface SidebarMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  section?: 'top' | 'middle' | 'bottom';
}

export interface SidebarCategory {
  id: string;
  label: string;
  badge?: string;
  items: SidebarMenuItem[];
}

export interface SidebarProps {
  categories?: SidebarCategory[];
  topItems?: SidebarMenuItem[];
  middleItems?: SidebarMenuItem[];
  bottomItems?: SidebarMenuItem[];
  activePath: string;
  isExpanded: boolean;
  isSidebarPinned: boolean;
  onTogglePin: (e: React.MouseEvent) => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onNavigate: (path: string) => void;
  userSlot?: React.ReactNode;
  timerSlot?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  topItems = [],
  middleItems = [],
  bottomItems = [],
  activePath,
  isExpanded,
  isSidebarPinned,
  onTogglePin,
  onHoverEnter,
  onHoverLeave,
  onNavigate,
  userSlot,
  timerSlot,
}) => {
  const sidebarWidth = isExpanded ? 255 : 70;

  // Resolve categories (backward-compatibility fallback if categories prop is omitted)
  const resolvedCategories: SidebarCategory[] = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.filter((c) => c.items && c.items.length > 0);
    }
    const legacy: SidebarCategory[] = [];
    if (topItems.length > 0) {
      legacy.push({ id: 'top', label: 'เมนูหลัก', items: topItems });
    }
    if (middleItems.length > 0) {
      legacy.push({ id: 'middle', label: 'การวิเคราะห์', items: middleItems });
    }
    if (bottomItems.length > 0) {
      legacy.push({ id: 'bottom', label: 'การจัดการ', items: bottomItems });
    }
    return legacy;
  }, [categories, topItems, middleItems, bottomItems]);

  const isItemActive = (item: SidebarMenuItem): boolean => {
    if (activePath === item.path || activePath === `/${item.id}`) return true;
    if (item.path !== '/' && activePath.startsWith(`${item.path}/`)) return true;
    if (item.id === 'service' && (activePath === '/services' || activePath.startsWith('/services/'))) return true;
    return false;
  };

  const renderMenuItem = (item: SidebarMenuItem) => {
    const isActive = isItemActive(item);

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.path)}
        title={!isExpanded ? item.label : undefined}
        style={{
          position: 'relative',
          width: '100%',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          border: 'none',
          backgroundColor: isActive ? THEME_COLORS.primary : 'transparent',
          color: isActive ? '#ffffff' : '#94a3b8',
          fontWeight: isActive ? 600 : 500,
          fontSize: '13.5px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s, color 0.15s',
          padding: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
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
        {/* Active glowing accent strip on left border */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3.5px',
              backgroundColor: '#00e676',
              boxShadow: '0 0 8px rgba(0,230,118,0.6)',
            }}
          />
        )}

        <div
          style={{
            width: '70px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
            color: isActive ? '#ffffff' : '#94a3b8',
          }}
        >
          {item.icon}
        </div>

        <div
          style={{
            opacity: isExpanded ? 1 : 0,
            visibility: isExpanded ? 'visible' : 'hidden',
            transition: 'opacity 0.2s ease',
            paddingRight: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            minWidth: 0,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
          {item.badge && (
            <span
              style={{
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '999px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#334155',
                color: '#ffffff',
                fontWeight: 600,
                marginLeft: '6px',
                flexShrink: 0,
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
      </button>
    );
  };

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

      {/* 2. Categorized Navigation */}
      <nav
        style={{
          padding: '8px 0 24px 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {resolvedCategories.map((category, catIdx) => (
          <div key={category.id || catIdx} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Divider line between groups */}
            {catIdx > 0 && (
              <div
                style={{
                  height: '1px',
                  backgroundColor: '#2d343c',
                  margin: '8px 14px',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Category Menu Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {category.items.map(renderMenuItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. Timer slot at bottom */}
      {timerSlot}
    </aside>
  );
};
