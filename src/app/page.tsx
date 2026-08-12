"use client";

import { useState } from "react";
import OverviewTab from "../components/OverviewTab";
import ResearchTab from "../components/ResearchTab";
import AcademicTab from "../components/AcademicTab";
import PublicationsTab from "../components/PublicationTab";
import ServiceTab from "../components/ServiceTab";
import IPTab from "../components/IPTab";
import KPITab from "../components/KPITab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <nav className="tab-nav">
        <div className="tab-nav-inner">
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