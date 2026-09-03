"use client";

import { useState } from "react";
import OverviewTab from "../components/OverviewTab";
import ResearchTab from "../components/ResearchTab";
import AcademicTab from "../components/AcademicTab";
import PublicationsTab from "../components/PublicationTab";
import ServiceTab from "../components/ServiceTab";
import IPTab from "../components/IPTab";
import KPITab from "../components/KPITab";

// นำเข้าหน้าจัดการระบบ (ไฟล์ใหม่ที่เราเพิ่งสร้าง)
import DataManage from "../components/DateManage";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // หากแอดมินอยู่ในโหมดจัดการข้อมูล จะแสดงเฉพาะหน้า DataManage
  if (activeTab === "manage") {
    // ส่ง Props goBack ไปเพื่อให้ปุ่ม "กลับสู่หน้า Dashboard" ใช้งานได้
    return (
      <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
        <DataManage goBack={() => setActiveTab("overview")} />
      </div>
    );
  }

  // เลย์เอาต์หลักสำหรับผู้บริหาร (ไม่มีแท็บ "จัดการข้อมูล" ให้รกตา)
  return (
    <>
      <nav className="tab-nav">
        <div className="tab-nav-inner" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
              <i className="fas fa-th-large"></i> ภาพรวม
            </button>
            <button className={`tab-btn ${activeTab === "research" ? "active" : ""}`} onClick={() => setActiveTab("research")}>
              <i className="fas fa-flask"></i> โครงการวิจัย
            </button>
            <button className={`tab-btn ${activeTab === "academic" ? "active" : ""}`} onClick={() => setActiveTab("academic")}>
              <i className="fas fa-graduation-cap"></i> พัฒนาวิชาการ
            </button>
            <button className={`tab-btn ${activeTab === "publications" ? "active" : ""}`} onClick={() => setActiveTab("publications")}>
              <i className="fas fa-book-open"></i> ผลงานตีพิมพ์
            </button>
            <button className={`tab-btn ${activeTab === "service" ? "active" : ""}`} onClick={() => setActiveTab("service")}>
              <i className="fas fa-hands-helping"></i> บริการวิชาการ
            </button>
            <button className={`tab-btn ${activeTab === "ip" ? "active" : ""}`} onClick={() => setActiveTab("ip")}>
              <i className="fas fa-certificate"></i> ทรัพย์สินทางปัญญา
            </button>
            <button className={`tab-btn ${activeTab === "kpi" ? "active" : ""}`} onClick={() => setActiveTab("kpi")}>
              <i className="fas fa-bullseye"></i> ตัวชี้วัด (KPI)
            </button>
          </div>

          {/* 💡 ปุ่มลับสำหรับ Admin มุมขวาสุดของเมนู (แยกสัดส่วนชัดเจน) */}
          <button 
            onClick={() => setActiveTab("manage")} 
            style={{ background: "none", border: "none", color: "#1565c0", fontWeight: "bold", cursor: "pointer", padding: "10px 15px", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <i className="fas fa-user-cog"></i> โหมดผู้ดูแลระบบ
          </button>
        </div>
      </nav>

      <main className="main">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "research" && <ResearchTab />}
        {activeTab === "academic" && <AcademicTab />}
        {activeTab === "publications" && <PublicationsTab />}
        {activeTab === "service" && <ServiceTab />}
        {activeTab === "ip" && <IPTab />}
        {activeTab === "kpi" && <KPITab />}
      </main>
    </>
  );
}