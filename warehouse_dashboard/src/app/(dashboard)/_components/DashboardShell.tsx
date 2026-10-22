'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarMenuItem } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HeaderAuth, useAuth } from '@/features/auth';
import { TimeFilterModal, useTimeFilter } from '@/features/time-filter';
import { SITE_CONFIG } from '@/config/site';
import {
  FaThLarge,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaBullseye,
  FaChartLine,
  FaClock,
  FaUserCog,
  FaUser,
} from 'react-icons/fa';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAdmin, openLoginModal } = useAuth();
  const { timeFilter, setTimeFilter, isTimeModalOpen, setIsTimeModalOpen } = useTimeFilter();

  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ku_sidebar_pinned') === 'true';
    }
    return false;
  });
  const [isForceCollapsed, setIsForceCollapsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('07:59:45');

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(7 - (now.getMinutes() % 8)).padStart(2, '0');
      const minutes = String(59 - now.getMinutes()).padStart(2, '0');
      const seconds = String(59 - now.getSeconds()).padStart(2, '0');
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSidebarPinned((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ku_sidebar_pinned', String(next));
      }
      if (!next) {
        setIsSidebarHovered(false);
        setIsForceCollapsed(true);
      } else {
        setIsForceCollapsed(false);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isForceCollapsed) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > 70) {
        setIsForceCollapsed(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isForceCollapsed]);

  const getSingleRoleTitle = (): string => {
    if (!user) return 'ยังไม่ได้เข้าสู่ระบบ';
    if (isAdmin || user.role === 'admin' || user.nontriAccount?.includes('admin') || user.nontriAccount === 'b6520503525') {
      return 'ผู้ดูแลระบบ';
    }
    if (/^b\d+/i.test(user.nontriAccount) || user.typePerson === 'นิสิต') {
      return 'นิสิต';
    }
    if (user.typePerson === 'อาจารย์') {
      return 'อาจารย์';
    }
    return 'บุคลากร';
  };

  const menuItems: SidebarMenuItem[] = [
    { id: 'overview', label: 'แดชบอร์ด ภาพรวม', path: '/overview', icon: <FaThLarge /> },
    { id: 'studio', label: 'วิเคราะห์ข้อมูล (BI Studio)', path: '/studio', icon: <FaChartLine /> },
    { id: 'monitoring', label: 'ติดตามสถานะโครงการ', path: '/monitoring', icon: <FaClock /> },
    { id: 'research', label: 'โครงการวิจัย', path: '/research', icon: <FaFlask /> },
    { id: 'academic', label: 'โครงการพัฒนาวิชาการ', path: '/academic', icon: <FaGraduationCap /> },
    { id: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', path: '/publications', icon: <FaBook /> },
    { id: 'service', label: 'งานบริการวิชาการ', path: '/service', icon: <FaHandsHelping /> },
    { id: 'ip', label: 'งานทรัพย์สินทางปัญญา', path: '/ip', icon: <FaCertificate /> },
    { id: 'kpi', label: 'ตัวชี้วัดตามแผนยุทธศาสตร์', path: '/kpi', icon: <FaBullseye /> },
  ];

  const singleRole = getSingleRoleTitle();
  const isExpanded = !isForceCollapsed && (isSidebarPinned || isSidebarHovered);
  const layoutLeftOffset = (isSidebarPinned && isExpanded) ? 255 : 70;

  const userSlot = (
    <>
      <div
        style={{
          width: '70px',
          height: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#374151',
            border: '1.5px solid #4b5563',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00e676',
            fontSize: '15px',
            overflow: 'hidden',
          }}
        >
          {user ? (
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>
              {(user.nontriAccount || 'U').substring(0, 2).toUpperCase()}
            </span>
          ) : (
            <FaUser style={{ color: '#9ca3af' }} />
          )}
        </div>
      </div>

      <div
        style={{
          opacity: isExpanded ? 1 : 0,
          visibility: isExpanded ? 'visible' : 'hidden',
          transition: 'opacity 0.2s ease',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          paddingRight: '6px',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#f8fafc',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '140px',
          }}
        >
          {user ? user.nameTh : 'บุคคลทั่วไป (Viewer)'}
        </div>
        <div style={{ fontSize: '11px', color: '#00e676', fontWeight: 600, marginTop: '2px' }}>
          {singleRole}
        </div>
      </div>
    </>
  );

  const adminSlot = isAdmin ? (
    <div style={{ marginTop: '12px', borderTop: '1px solid #2d343c', paddingTop: '8px' }}>
      <button
        onClick={() => router.push('/manage')}
        style={{
          position: 'relative',
          width: '100%',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          border: 'none',
          backgroundColor: pathname === '/manage' ? '#00A651' : 'transparent',
          color: pathname === '/manage' ? '#ffffff' : '#94a3b8',
          fontWeight: pathname === '/manage' ? 700 : 500,
          fontSize: '13.5px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.15s, color 0.15s',
          padding: 0,
          whiteSpace: 'nowrap',
        }}
        onMouseOver={(e) => {
          if (pathname !== '/manage') {
            e.currentTarget.style.backgroundColor = '#2d343c';
            e.currentTarget.style.color = '#ffffff';
          }
        }}
        onMouseOut={(e) => {
          if (pathname !== '/manage') {
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
          <FaUserCog />
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
          ระบบจัดการข้อมูล
        </div>
      </button>
    </div>
  ) : null;

  const timerSlot = (
    <div
      style={{
        padding: '14px 16px',
        borderTop: '1px solid #2d343c',
        backgroundColor: '#181c20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded ? 'space-between' : 'center',
        fontSize: '11px',
        color: '#64748b',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#00e676',
            boxShadow: '0 0 6px #00e676',
          }}
        />
        {isExpanded && <span>Session KU:</span>}
      </div>
      {isExpanded && (
        <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
          {timeLeft}
        </span>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f9' }}>
      <Sidebar
        menuItems={menuItems}
        activePath={pathname}
        isExpanded={isExpanded}
        isSidebarPinned={isSidebarPinned}
        onTogglePin={handleTogglePin}
        onHoverEnter={() => {
          if (!isForceCollapsed) setIsSidebarHovered(true);
        }}
        onHoverLeave={() => {
          setIsSidebarHovered(false);
          setIsForceCollapsed(false);
        }}
        onNavigate={(path) => router.push(path)}
        userSlot={userSlot}
        adminSlot={adminSlot}
        timerSlot={timerSlot}
      />

      <Header
        title={SITE_CONFIG.name}
        layoutLeftOffset={layoutLeftOffset}
        rightSlot={<HeaderAuth />}
      />

      <main
        style={{
          marginLeft: `${layoutLeftOffset}px`,
          marginTop: '50px',
          padding: '24px 32px 48px 32px',
          minHeight: 'calc(100vh - 50px)',
          boxSizing: 'border-box',
          transition: 'margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </main>

      <TimeFilterModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        filter={timeFilter}
        onApply={(newFilter) => setTimeFilter(newFilter)}
      />
    </div>
  );
}
