"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/authContext";
import { HeaderAuth } from "./HeaderAuth";
import OverviewTab from "./OverviewTab";
import ResearchTab from "./ResearchTab";
import AcademicTab from "./AcademicTab";
import PublicationsTab from "./PublicationTab";
import ServiceTab from "./ServiceTab";
import IPTab from "./IPTab";
import KPITab from "./KPITab";
import DataManage from "./DateManage";
import SelfServiceStudio from "./analytics/SelfServiceStudio";

import {
  FaThLarge,
  FaFlask,
  FaGraduationCap,
  FaBook,
  FaHandsHelping,
  FaCertificate,
  FaBullseye,
  FaUserCog,
  FaUser,
  FaBars,
  FaCalendarAlt,
  FaUndo,
  FaChartLine,
} from "react-icons/fa";
import { TimeFilterModal } from "./TimeFilterModal";
import { TimeFilterState, DEFAULT_TIME_FILTER, getTimeFilterLabel } from "../types/timeFilter";

const VALID_TABS = [
  "overview",
  "studio",
  "research",
  "academic",
  "publications",
  "service",
  "services",
  "ip",
  "kpi",
  "manage",
];

interface DashboardAppProps {
  initialTab?: string;
}

export default function DashboardApp({ initialTab = "overview" }: DashboardAppProps) {
  const router = useRouter();
  const pathname = usePathname();

  // คำนวณชื่อ Tab จาก URL pathname (เช่น /research -> research)
  const resolveTabFromPath = (path?: string | null): string => {
    if (!path || path === "/") return initialTab || "overview";
    const segment = path.replace(/^\/+/, "").split("/")[0].toLowerCase();
    if (segment === "services") return "service";
    if (VALID_TABS.includes(segment)) return segment;
    return initialTab || "overview";
  };

  const [activeTab, setActiveTab] = useState<string>(() => resolveTabFromPath(pathname));
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isForceCollapsed, setIsForceCollapsed] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterState>(DEFAULT_TIME_FILTER);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const { user, isAdmin, openLoginModal } = useAuth();

  // เวลาคงเหลือของ Session (จำลอง 8 ชม. ตามเกณฑ์ KU ALL-Login)
  const [timeLeft, setTimeLeft] = useState("07:59:45");

  // ติดตามการเปลี่ยนแปลงของ URL pathname (เช่น เมื่อผู้ใช้กดย้อนกลับ/ถัดไป หรือพิมพ์ URL)
  useEffect(() => {
    const currentFromUrl = resolveTabFromPath(pathname);
    if (currentFromUrl && currentFromUrl !== activeTab) {
      setActiveTab(currentFromUrl);
    }
  }, [pathname]);

  // ฟังก์ชันสลับ Tab และเปลี่ยน URL Path ใน Browser แบบ Real-time
  const handleTabChange = (targetTab: string) => {
    const normalized = targetTab.toLowerCase() === "services" ? "service" : targetTab;
    setActiveTab(normalized);
    if (normalized === "overview") {
      router.push("/overview");
    } else {
      router.push(`/${normalized}`);
    }
  };

  // ปลดล็อค isForceCollapsed เมื่อเมาส์ขยับออกนอกโซน 70px ของ sidebar
  useEffect(() => {
    if (!isForceCollapsed) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > 70) {
        setIsForceCollapsed(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isForceCollapsed]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(7 - (now.getMinutes() % 8)).padStart(2, "0");
      const minutes = String(59 - now.getMinutes()).padStart(2, "0");
      const seconds = String(59 - now.getSeconds()).padStart(2, "0");
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdminClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!isAdmin) {
      alert("⚠️ บัญชีของคุณ (" + user.nontriAccount + ") มีสิทธิ์เป็น Viewer เท่านั้น\nไม่สามารถเข้าใช้งานโหมดผู้ดูแลระบบได้ครับ");
      return;
    }
    handleTabChange("manage");
  };

  // กำหนด Role ให้แสดงเพียงอย่างเดียว
  const getSingleRoleTitle = (): string => {
    if (!user) return "ยังไม่ได้เข้าสู่ระบบ";
    if (isAdmin || user.role === "admin" || user.nontriAccount?.includes("admin") || user.nontriAccount === "b6520503525") {
      return "ผู้ดูแลระบบ";
    }
    if (/^b\d+/i.test(user.nontriAccount) || user.typePerson === "นิสิต") {
      return "นิสิต";
    }
    if (user.typePerson === "อาจารย์") {
      return "อาจารย์";
    }
    return "บุคลากร";
  };

  const menuItems = [
    { id: "overview", label: "แดชบอร์ด ภาพรวม", icon: <FaThLarge /> },
    { id: "studio", label: "วิเคราะห์ข้อมูล (BI Studio)", icon: <FaChartLine /> },
    { id: "research", label: "โครงการวิจัย", icon: <FaFlask /> },
    { id: "academic", label: "พัฒนาวิชาการ", icon: <FaGraduationCap /> },
    { id: "publications", label: "ผลงานตีพิมพ์", icon: <FaBook /> },
    { id: "service", label: "บริการวิชาการ", icon: <FaHandsHelping /> },
    { id: "ip", label: "ทรัพย์สินทางปัญญา", icon: <FaCertificate /> },
    { id: "kpi", label: "ตัวชี้วัด", icon: <FaBullseye /> },
  ];

  const singleRole = getSingleRoleTitle();
  const isExpanded = !isForceCollapsed && (isSidebarPinned || isSidebarHovered);
  const sidebarWidth = isExpanded ? 255 : 70;
  const layoutLeftOffset = (isSidebarPinned && isExpanded) ? 255 : 70;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7f9" }}>
      {/* 1. Left Sidebar สีเทาเข้มคงที่ตลอดแนวซ้าย */}
      <aside
        onMouseEnter={() => {
          if (!isForceCollapsed) {
            setIsSidebarHovered(true);
          }
        }}
        onMouseLeave={() => {
          setIsSidebarHovered(false);
          setIsForceCollapsed(false);
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${sidebarWidth}px`,
          backgroundColor: "#1e2327",
          color: "#94a3b8",
          zIndex: 1100,
          transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s",
          display: "flex",
          flexDirection: "column",
          boxShadow: isExpanded ? "4px 0 24px rgba(0,0,0,0.4)" : "2px 0 6px rgba(0,0,0,0.15)",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* กล่องโปรไฟล์ผู้ใช้ด้านบนสุดของ Sidebar */}
        <div
          style={{
            height: "65px",
            borderBottom: "1px solid #2d343c",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            marginTop: "4px",
            width: "100%",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "65px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "#374151",
                border: "1.5px solid #4b5563",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontSize: "17px",
                flexShrink: 0,
              }}
            >
              <FaUser />
            </div>
          </div>

          <div
            style={{
              opacity: isExpanded ? 1 : 0,
              visibility: isExpanded ? "visible" : "hidden",
              transition: "opacity 0.2s ease",
              whiteSpace: "nowrap",
              lineHeight: "1.25",
              overflow: "hidden",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#00e676",
                letterSpacing: "0.2px",
              }}
            >
              {user ? user.nontriAccount : "ผู้ใช้งานทั่วไป"}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "2px",
                fontWeight: 500,
              }}
            >
              {singleRole}
            </div>
          </div>

          {/* ปุ่ม 3 ขีด: สลับ Pin / Collapse */}
          {isExpanded && (
            <div style={{ paddingRight: "14px", flexShrink: 0 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSidebarPinned) {
                    setIsSidebarPinned(false);
                    setIsSidebarHovered(false);
                    setIsForceCollapsed(true);
                  } else {
                    setIsSidebarPinned(true);
                    setIsForceCollapsed(false);
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "6px",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.15s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <FaBars />
              </button>
            </div>
          )}
        </div>

        {/* รายการเมนูแนวตั้ง */}
        <nav style={{ padding: "10px 0", flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  backgroundColor: isActive ? "#00a859" : "transparent",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "13.5px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                  padding: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#2d343c";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                )}

                <div
                  style={{
                    width: "70px",
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "16px",
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    visibility: isExpanded ? "visible" : "hidden",
                    transition: "opacity 0.2s ease",
                    paddingRight: "16px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.label}
                </div>
              </button>
            );
          })}

          {/* ปุ่มโหมดผู้ดูแลระบบ / จัดการข้อมูล */}
          {isAdmin && (
            <div style={{ marginTop: "12px", borderTop: "1px solid #2d343c", paddingTop: "8px" }}>
              <button
                onClick={() => handleTabChange("manage")}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  backgroundColor: activeTab === "manage" ? "#00a859" : "transparent",
                  color: activeTab === "manage" ? "#ffffff" : "#94a3b8",
                  fontWeight: activeTab === "manage" ? 700 : 500,
                  fontSize: "13.5px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                  padding: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => {
                  if (activeTab !== "manage") {
                    e.currentTarget.style.backgroundColor = "#2d343c";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== "manage") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                {activeTab === "manage" && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "4px",
                      backgroundColor: "#ffffff",
                    }}
                  />
                )}

                <div
                  style={{
                    width: "70px",
                    height: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "16px",
                  }}
                >
                  <FaUserCog />
                </div>

                <div
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    visibility: isExpanded ? "visible" : "hidden",
                    transition: "opacity 0.2s ease",
                    paddingRight: "16px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  จัดการและติดตามโครงการ
                </div>
              </button>
            </div>
          )}
        </nav>
      </aside>

      {/* 2. Top Bar สีเขียว MyKU */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: `${layoutLeftOffset}px`,
          right: 0,
          height: "50px",
          backgroundColor: "#00a859",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 900,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "left 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: "14.5px", fontWeight: 700, letterSpacing: "0.2px" }}>
            ระบบคลังข้อมูลวิจัยและนวัตกรรม มหาวิทยาลัยเกษตรศาสตร์
          </span>
        </div>

        <div style={{ marginLeft: "auto", zIndex: 1 }}>
          <HeaderAuth />
        </div>
      </header>

      {/* 3. Main Content พื้นที่แสดงผลแดชบอร์ดด้านขวา */}
      <main
        style={{
          marginLeft: `${layoutLeftOffset}px`,
          marginTop: "50px",
          padding: activeTab === "manage" ? "14px 20px 20px 20px" : "24px 32px 48px 32px",
          minHeight: "calc(100vh - 50px)",
          transition: "margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {activeTab === "manage" && isAdmin ? (
          <div>
            <DataManage goBack={() => handleTabChange("overview")} />
          </div>
        ) : activeTab === "manage" && !isAdmin ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h3 style={{ color: "#ef4444", marginBottom: "12px" }}>⚠️ เข้าสู่ระบบด้วยสิทธิ์ผู้ดูแลระบบ (Admin)</h3>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>กรุณาเข้าสู่ระบบเพื่อเข้าใช้งานส่วนการจัดการข้อมูลและติดตามโครงการ</p>
            <button
              onClick={openLoginModal}
              style={{
                padding: "10px 24px",
                backgroundColor: "#00a859",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              เข้าสู่ระบบ
            </button>
          </div>
        ) : activeTab === "studio" ? (
          <div style={{ margin: "-24px -32px -48px -32px" }}>
            <SelfServiceStudio />
          </div>
        ) : (
          <div style={{ minHeight: "500px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Universal Time Filter Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
                backgroundColor: "#ffffff",
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  <FaCalendarAlt style={{ color: "#00a859", fontSize: "14px" }} />
                  <span>ช่วงเวลาข้อมูล:</span>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: timeFilter.mode === "all" ? "#f1f5f9" : "#e8f5e9",
                    color: timeFilter.mode === "all" ? "#475569" : "#007a3e",
                    padding: "5px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    border: timeFilter.mode === "all" ? "1px solid #cbd5e1" : "1px solid #86efac",
                  }}
                >
                  <span>{getTimeFilterLabel(timeFilter)}</span>
                </div>
                {timeFilter.mode !== "all" && (
                  <button
                    onClick={() => setTimeFilter(DEFAULT_TIME_FILTER)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "4px 12px",
                      backgroundColor: "transparent",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "16px",
                      color: "#64748b",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    title="ล้างตัวกรองและแสดงข้อมูลทั้งหมด"
                  >
                    <FaUndo style={{ fontSize: "10px" }} />
                    <span>แสดงทั้งหมด</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsTimeModalOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  backgroundColor: "#00a859",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0, 168, 89, 0.25)",
                  transition: "all 0.15s ease",
                }}
              >
                <FaCalendarAlt style={{ fontSize: "13px" }} />
                <span>เลือกช่วงเวลา</span>
              </button>
            </div>

            {/* Dashboard Tab Contents with Synchronized Time Filter */}
            {activeTab === "overview" && <OverviewTab timeFilter={timeFilter} />}
            {activeTab === "research" && <ResearchTab timeFilter={timeFilter} />}
            {activeTab === "academic" && <AcademicTab timeFilter={timeFilter} />}
            {activeTab === "publications" && <PublicationsTab timeFilter={timeFilter} />}
            {activeTab === "service" && <ServiceTab timeFilter={timeFilter} />}
            {activeTab === "ip" && <IPTab timeFilter={timeFilter} />}
            {activeTab === "kpi" && (
              <KPITab
                timeFilter={timeFilter}
                onNavigateToManage={() => handleTabChange("manage")}
              />
            )}
          </div>
        )}

        <TimeFilterModal
          isOpen={isTimeModalOpen}
          onClose={() => setIsTimeModalOpen(false)}
          filter={timeFilter}
          onApply={(newFilter) => setTimeFilter(newFilter)}
        />
      </main>
    </div>
  );
}
