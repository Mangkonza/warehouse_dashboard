'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar, SidebarMenuItem, SidebarCategory } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { HeaderAuth, useAuth, useSsoUserSafe } from '@/features/auth';
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
  FaLeaf,
  FaClock,
  FaClipboardCheck,
  FaDatabase,
  FaUserCog,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isLoading } = useAuth();
  const sso = useSsoUserSafe();
  const ssoUser = sso?.user;
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

  const isSsoLoading = sso?.status === 'loading';
  const isAuthenticated = Boolean(user || ssoUser);

  // AuthGate: ป้องกันเฉพาะหน้าที่ต้องใช้สิทธิ์ Admin เท่านั้น
  // หน้าสาธารณะ (Overview, Research, Academic Dev, Publications, Services, IP, Personnel, SDGs) ทุกคนสามารถเข้าชมได้
  const ADMIN_PATHS = ['/manage', '/evaluation', '/monitoring', '/kpi', '/user-roles', '/admin'];
  const isProtectedPath = Boolean(pathname && ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)));

  useEffect(() => {
    if (!isLoading && !isSsoLoading && !isAuthenticated && isProtectedPath) {
      router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isSsoLoading, isAuthenticated, pathname, isProtectedPath]);

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
  if (isLoading || isSsoLoading) {
    return <PageLoader message="กำลังตรวจสอบสิทธิ์การเข้าใช้งาน..." />;
  }

  if (!isAuthenticated && isProtectedPath) {
    return <PageLoader message="กำลังนำคุณไปยังหน้าเข้าสู่ระบบ..." />;
  }

  const getSingleRoleTitle = (): string => {
    if (!user && !ssoUser) return 'ผู้เยี่ยมชม';

    if (user?.role === 'admin') {
      return 'ผู้ดูแลระบบ';
    }

    const nontri = user?.nontriAccount || ssoUser?.nontriId || '';

    if (/^b\d+/i.test(nontri) || user?.typePerson === 'นิสิต') {
      return 'นิสิต';
    }

    if (user?.typePerson === 'อาจารย์') {
      return 'อาจารย์';
    }

    if (user) {
      return 'บุคลากร';
    }

    return 'ผู้เยี่ยมชม';
  };

  interface MenuDefinition {
    id: AppResource;
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
  }

  interface CategoryDefinition {
    id: string;
    label: string;
    badge?: string;
    items: MenuDefinition[];
  }

  // โครงสร้างเมนูจัดแยกตามหมวดหมู่อย่างเป็นระบบ
  const categoryDefinitions: CategoryDefinition[] = [
    {
      id: 'overview_strategy',
      label: 'ภาพรวมระบบ',
      items: [
        {
          id: 'overview',
          label: 'แดชบอร์ด ภาพรวม',
          path: '/overview',
          icon: <FaThLarge />,
        },
      ],
    },
    {
      id: 'core_missions',
      label: 'พันธกิจหลัก 5 ด้าน',
      badge: '5 ด้าน',
      items: [
        {
          id: 'research',
          label: 'โครงการวิจัย',
          path: '/research',
          icon: <FaFlask />,
        },
        {
          id: 'academic',
          label: 'โครงการพัฒนาวิชาการ',
          path: '/academic',
          icon: <FaGraduationCap />,
        },
        {
          id: 'publications',
          label: 'ผลงานตีพิมพ์ทางวิชาการ',
          path: '/publications',
          icon: <FaBook />,
        },
        {
          id: 'service',
          label: 'งานบริการวิชาการ',
          path: '/service',
          icon: <FaHandsHelping />,
        },
        {
          id: 'ip',
          label: 'งานทรัพย์สินทางปัญญา',
          path: '/ip',
          icon: <FaCertificate />,
        },
      ],
    },
    {
      id: 'analytics_personnel',
      label: 'การวิเคราะห์และบุคลากร',
      items: [
        {
          id: 'personnel',
          label: 'คณาจารย์และบุคลากร',
          path: '/personnel',
          icon: <FaUserTie />,
        },
        {
          id: 'kpi',
          label: 'ตัวชี้วัดตามแผนยุทธศาสตร์',
          path: '/kpi',
          icon: <FaBullseye />,
        },
      ],
    },
    {
      id: 'management_tracking',
      label: 'การจัดการและติดตาม',
      items: [
        {
          id: 'manage',
          label: 'ระบบจัดการข้อมูล',
          path: '/manage',
          icon: <FaDatabase />,
        },
        {
          id: 'evaluation',
          label: 'การประเมินโครงการ',
          path: '/evaluation',
          icon: <FaClipboardCheck />,
        },
        {
          id: 'monitoring',
          label: 'ติดตามสถานะโครงการ',
          path: '/monitoring',
          icon: <FaClock />,
        },
        {
          id: 'user_roles',
          label: 'จัดการสิทธิ์ผู้เข้าใช้งาน',
          path: '/user-roles',
          icon: <FaUserCog />,
        },
      ],
    },
  ];

  // กรองเมนูตามสิทธิ์ของผู้ใช้งานในแต่ละหมวดหมู่
  const userRole = user?.role || 'user';

  const menuCategories: SidebarCategory[] = categoryDefinitions
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      badge: cat.badge,
      items: cat.items
        .filter((item) => canAccess(userRole, item.id))
        .map((item) => ({
          id: item.id,
          label: item.label,
          path: item.path,
          icon: item.icon,
          badge: item.badge,
        })),
    }))
    .filter((cat) => cat.items.length > 0);

  const singleRole = getSingleRoleTitle();
  const isExpanded = !isForceCollapsed && (isSidebarPinned || isSidebarHovered);
  const layoutLeftOffset = isSidebarPinned && isExpanded ? 255 : 70;

  const profileName =
    (ssoUser?.firstName && ssoUser?.lastName
      ? `${ssoUser.firstName} ${ssoUser.lastName}`
      : null) ||
    ssoUser?.name ||
    user?.nameTh ||
    user?.nontriAccount ||
    ssoUser?.nontriId ||
    "Guest";

  const profileSubtitle =
    user?.typePerson ||
    (ssoUser?.faculty ? `คณะ${ssoUser.faculty.replace(/^คณะ/, "")}` : null) ||
    singleRole;

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
            backgroundColor: '#95bbdf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            overflow: 'hidden',
          }}
        >
          <img
            src={`${(process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '')}/assets/profile.jfif`}
            alt={profileName}
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
                (target.nextElementSibling as HTMLElement).style.display = 'flex';
              }
            }}
          />
          <div
            style={{
              display: 'none',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#95bbdf',
            }}
          >
            <FaUser style={{ color: '#ffffff', fontSize: '18px' }} />
          </div>
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
            maxWidth: '170px',
          }}
        >
          {profileName}
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#00e676',
            fontWeight: 600,
            marginTop: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '170px',
          }}
          title={profileSubtitle}
        >
          {profileSubtitle}
        </div>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f9' }}>
      <Sidebar
        categories={menuCategories}
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
        onNavigate={(path) => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ku:perspective-tab-reset', { detail: { path } }));
          }
          router.push(path);
        }}
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