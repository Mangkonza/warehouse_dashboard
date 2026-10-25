'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarMenuItem } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HeaderAuth, useAuth } from '@/features/auth';
import { TimeFilterModal, useTimeFilter } from '@/features/time-filter';
import { PageLoader } from '@/components/ui/PageLoader';
import { SITE_CONFIG } from '@/config/site';
import { canAccess, AppResource } from '@/config/permissions';
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
  FaClipboardCheck,
  FaUserCog,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading } = useAuth();
  const { timeFilter, setTimeFilter, isTimeModalOpen, setIsTimeModalOpen } = useTimeFilter();

  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(false);
  const [isForceCollapsed, setIsForceCollapsed] = useState(false);

  // อ่านค่า pinned จาก localStorage หลัง component mount
  useEffect(() => {
    const saved = localStorage.getItem('ku_sidebar_pinned');

    if (saved === 'true') {
      setIsSidebarPinned(true);
    }
  }, []);

  // AuthGate: หากไม่มี session ให้เปลี่ยนไปหน้า Login
  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      const returnUrl =
        pathname && pathname.startsWith('/') && !pathname.startsWith('//')
          ? pathname
          : '/overview';

      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isLoading, user, pathname, router]);

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsSidebarPinned((prev) => {
      const next = !prev;

      localStorage.setItem('ku_sidebar_pinned', String(next));

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

  // Loading Screen ระหว่างตรวจสอบสิทธิ์
  if (isLoading) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์การเข้าใช้งาน..." />;
  }

  if (!user && pathname !== '/login') {
    return <PageLoader message="กำลังนำคุณไปยังหน้าเข้าสู่ระบบ..." />;
  }

  const getSingleRoleTitle = (): string => {
    if (!user) return 'ยังไม่ได้เข้าสู่ระบบ';

    if (user.role === 'admin') {
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

  // เมนูทั้งหมดเรียงต่อเนื่องกัน ไม่มีการแบ่งกลุ่มบน กลาง และล่าง
  const allMenuItems: (SidebarMenuItem & { id: AppResource })[] = [
    {
      id: 'overview',
      label: 'แดชบอร์ด ภาพรวม',
      path: '/overview',
      icon: <FaThLarge />,
      section: 'top',
    },
    {
      id: 'research',
      label: 'โครงการวิจัย',
      path: '/research',
      icon: <FaFlask />,
      section: 'top',
    },
    {
      id: 'academic',
      label: 'โครงการพัฒนาวิชาการ',
      path: '/academic',
      icon: <FaGraduationCap />,
      section: 'top',
    },
    {
      id: 'publications',
      label: 'ผลงานตีพิมพ์ทางวิชาการ',
      path: '/publications',
      icon: <FaBook />,
      section: 'top',
    },
    {
      id: 'service',
      label: 'งานบริการวิชาการ',
      path: '/service',
      icon: <FaHandsHelping />,
      section: 'top',
    },
    {
      id: 'ip',
      label: 'งานทรัพย์สินทางปัญญา',
      path: '/ip',
      icon: <FaCertificate />,
      section: 'top',
    },
    {
      id: 'kpi',
      label: 'ตัวชี้วัดตามแผนยุทธศาสตร์',
      path: '/kpi',
      icon: <FaBullseye />,
      section: 'top',
    },
    {
      id: 'personnel',
      label: 'วิเคราะห์บุคลากรและอาจารย์',
      path: '/personnel',
      icon: <FaUserTie />,
      section: 'top',
    },
    {
      id: 'studio',
      label: 'วิเคราะห์ข้อมูลเชิงลึก',
      path: '/studio',
      icon: <FaChartLine />,
      section: 'top',
    },
    {
      id: 'manage',
      label: 'ระบบจัดการข้อมูล',
      path: '/manage',
      icon: <FaUserCog />,
      section: 'top',
    },
    {
      id: 'evaluation',
      label: 'การประเมิน',
      path: '/evaluation',
      icon: <FaClipboardCheck />,
      section: 'top',
    },
    {
      id: 'monitoring',
      label: 'ติดตามสถานะโครงการ',
      path: '/monitoring',
      icon: <FaClock />,
      section: 'top',
    },
  ];

  // กรองเมนูตามสิทธิ์ของผู้ใช้
  const userRole = user?.role || 'user';

  const topItems = allMenuItems.filter((item) =>
    canAccess(userRole, item.id)
  );

  // คง props ไว้เพื่อให้เข้ากันได้กับ Sidebar เดิม
  const middleItems: SidebarMenuItem[] = [];
  const bottomItems: SidebarMenuItem[] = [];

  const singleRole = getSingleRoleTitle();
  const isExpanded = !isForceCollapsed && (isSidebarPinned || isSidebarHovered);
  const layoutLeftOffset = isSidebarPinned && isExpanded ? 255 : 70;

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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: user ? '#00e676' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}
        >
          {user ? (
            <>
              <img
                src="/assets/profile.jfif"
                alt={user.nameTh || user.nontriAccount || 'Profile'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'inline';
                  }
                }}
              />
              <span
                style={{
                  display: 'none',
                  color: '#111827',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                {(user.nontriAccount || 'U').charAt(0).toUpperCase()}
              </span>
            </>
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
          {user?.nameTh || user?.nontriAccount || 'ผู้ใช้งาน'}
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#00e676',
            fontWeight: 600,
            marginTop: '2px',
          }}
        >
          {singleRole}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f9' }}>
      <Sidebar
        topItems={topItems}
        middleItems={middleItems}
        bottomItems={bottomItems}
        activePath={pathname}
        isExpanded={isExpanded}
        isSidebarPinned={isSidebarPinned}
        onTogglePin={handleTogglePin}
        onHoverEnter={() => {
          if (!isForceCollapsed) {
            setIsSidebarHovered(true);
          }
        }}
        onHoverLeave={() => {
          setIsSidebarHovered(false);
          setIsForceCollapsed(false);
        }}
        onNavigate={(path) => router.push(path)}
        userSlot={userSlot}
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