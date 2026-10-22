"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  FaCertificate,
  FaScroll,
  FaMoneyBillWave,
  FaBuilding,
  FaChartBar,
  FaTable,
  FaLightbulb,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

// 1. นำเข้าข้อมูล JSON
import ipData from "../data/ip.json";
import { getCachedCategoryData } from "../lib/dataService";
import { TimeFilterState, itemMatchesTimeFilter } from "../types/timeFilter";

export default function IPTab({ timeFilter }: { timeFilter?: TimeFilterState }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [dataList, setDataList] = useState<any[]>(() => getCachedCategoryData('ip') || ipData);
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('ip');
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  // กรองข้อมูลรายการ IP ที่ถูกต้อง (ตัดแถวหัวตารางหรือค่าผิดพลาดออก)
  const validIpData = useMemo(() => {
    return dataList
      .filter((item) => item.name && item.name !== "NaT" && item.name !== "เรื่อง")
      .filter((item) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));
  }, [timeFilter, dataList]);

  // คำนวณรายชื่อภาควิชาจากข้อมูลจริง
  const availableDepts = useMemo(() => {
    const depts = new Set<string>();
    validIpData.forEach((item) => {
      const text = `${item.creator || ""} ${item.department || ""}`;
      const matches = text.match(/วิศวกรรม[^\s\n,]+/g);
      if (matches) {
        matches.forEach((m) => depts.add(m.trim()));
      }
    });
    return Array.from(depts);
  }, [validIpData]);

  // ข้อมูลที่ผ่านการค้นหาและตัวกรองภาควิชา
  const filteredIpData = useMemo(() => {
    return validIpData.filter((item) => {
      const matchSearch =
        !searchTerm ||
        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.creator && item.creator.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.req_no && item.req_no.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept =
        deptFilter === "all" ||
        (item.creator && item.creator.includes(deptFilter)) ||
        (item.department && item.department.includes(deptFilter));

      return matchSearch && matchDept;
    });
  }, [validIpData, searchTerm, deptFilter]);

  // สถิติที่คำนวณจากข้อมูลจริง
  const patentCount = useMemo(() => {
    return validIpData.filter(
      (item) => item.department === "P" || item.type === "P" || (item.name && item.name.includes("สิทธิบัตร")) || (item.type && item.type.includes("สิทธิบัตร"))
    ).length;
  }, [validIpData]);

  const uniqueDeptCount = availableDepts.length > 0 ? availableDepts.length : 1;

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#0f172a";

    const C_RES = "#006838";
    const C_PUB = "#8e24aa";
    const C_IP = "#d81b60";
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."];

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

    createChart("c_ip_monthly", {
      type: "bar",
      data: {
        labels: M,
        datasets: [
          {
            label: "จำนวน IP",
            data: [1, 0, 1, 0, 0],
            backgroundColor: C_IP,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grace: "20%",
            ticks: { stepSize: 1 },
            title: { display: true, text: "จำนวน" },
          },
        },
      },
    });

    createChart("c_ip_compare", {
      type: "bar",
      data: {
        labels: ["โครงการวิจัย", "ผลงานตีพิมพ์ทางวิชาการ", "งานทรัพย์สินทางปัญญา"],
        datasets: [
          {
            label: "จำนวน",
            data: [10, 61, validIpData.length || 2],
            backgroundColor: [C_RES, C_PUB, C_IP],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grace: "20%",
            title: { display: true, text: "จำนวน" },
          },
        },
      },
    });

    // Counter animation
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const t = el.textContent?.trim() || "";
            if (!el.dataset.done && /^\d+$/.test(t)) {
              el.dataset.done = "1";
              const target = parseInt(t.replace(/[^0-9]/g, ""));
              if (isNaN(target)) return;
              let cur = 0;
              const step = Math.max(1, Math.ceil(target / 30));
              const timer = setInterval(() => {
                cur += step;
                if (cur >= target) {
                  cur = target;
                  clearInterval(timer);
                }
                if (t.includes("฿")) {
                  el.textContent = `฿${cur.toLocaleString()}`;
                } else {
                  el.textContent = cur.toLocaleString();
                }
              }, 40);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".kpi-value").forEach((el) => {
      if (/[0-9]/.test(el.textContent?.trim() || "")) obs.observe(el);
    });

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, [timeFilter, validIpData.length]);

  return (
    <div className="tab-content active">
      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaCertificate />
          </div>
          <div className="kpi-value">{validIpData.length}</div>
          <div className="kpi-label">จำนวนทรัพย์สินทางปัญญา (รวม)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaScroll />
          </div>
          <div className="kpi-value">{patentCount}</div>
          <div className="kpi-label">สิทธิบัตร/อนุสิทธิบัตร</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaMoneyBillWave />
          </div>
          <div className="kpi-value">฿20,000</div>
          <div className="kpi-label">เงินสนับสนุน</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaBuilding />
          </div>
          <div className="kpi-value">{uniqueDeptCount}</div>
          <div className="kpi-label">ภาควิชาที่มีผลงาน IP</div>
        </div>
      </div>

      {/* Graphs */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ marginRight: 8, color: "#d81b60" }} /> จำนวน IP รายเดือน
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ip_monthly"></canvas>
          </div>
        </div>
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ marginRight: 8, color: "#006838" }} /> เปรียบเทียบ IP vs วิจัย vs ตีพิมพ์
          </h3>
          <div className="chart-wrapper">
            <canvas id="c_ip_compare"></canvas>
          </div>
        </div>
      </div>

      {/* Table Section with Live Search and Filter */}
      <div className="table-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <FaTable style={{ color: "#006838" }} /> รายการงานทรัพย์สินทางปัญญา
            <span
              style={{
                fontSize: "12px",
                padding: "2px 8px",
                borderRadius: "12px",
                backgroundColor: "rgba(0,104,56,0.1)",
                color: "#006838",
                fontWeight: 600,
              }}
            >
              {filteredIpData.length} รายการ
            </span>
          </h3>

          {/* Search and Dept Filter Controls */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", minWidth: "220px" }}>
              <FaSearch
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              />
              <input
                type="text"
                placeholder="ค้นหาชื่อเรื่อง / ผู้ประดิษฐ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "7px 12px 7px 30px",
                  fontSize: "13px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(6px)",
                  width: "100%",
                }}
              />
            </div>

            {availableDepts.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FaFilter style={{ color: "#64748b", fontSize: "12px" }} />
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  style={{
                    padding: "7px 12px",
                    fontSize: "13px",
                    borderRadius: "8px",
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <option value="all">ทุกภาควิชา</option>
                  {availableDepts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="table-scroll">
          <table className="glass-table">
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>#</th>
                <th style={{ minWidth: "220px" }}>เรื่อง</th>
                <th>ผู้ประดิษฐ์</th>
                <th>ภาควิชา</th>
                <th style={{ textAlign: "center" }}>ประเภท</th>
                <th>เลขที่คำขอ/วันที่ยื่น</th>
                <th>สถานะ/วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              {filteredIpData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredIpData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td>
                    <td style={{ whiteSpace: "normal", minWidth: "200px", fontWeight: 500 }}>
                      {item.name}
                    </td>
                    <td>{item.creator && item.creator !== "nan" ? item.creator : "-"}</td>
                    <td>{item.department && item.department !== "nan" ? item.department : "-"}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.type && item.type !== "nan" && item.type !== "-" ? (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: 600,
                            backgroundColor: "rgba(216, 27, 96, 0.1)",
                            color: "#d81b60",
                          }}
                        >
                          {item.type === "P" ? "สิทธิบัตร" : item.type}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{item.req_no && item.req_no !== "nan" ? item.req_no.substring(0, 10) : "-"}</td>
                    <td>{item.status && item.status !== "nan" ? item.status : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Support Insights */}
      <div className="decision-box">
        <div className="decision-header">
          <FaLightbulb style={{ marginRight: 8, color: "#f59e0b" }} /> ข้อมูลสนับสนุนการตัดสินใจ — งานทรัพย์สินทางปัญญา
        </div>
        <ul>
          <li>
            มีทรัพย์สินทางปัญญารวม <strong>{validIpData.length} รายการ</strong> และสิทธิบัตร <strong>{patentCount} รายการ</strong>
          </li>
          <li>
            ปัจจุบันมาจาก <strong>{uniqueDeptCount} ภาควิชา</strong> ควรส่งเสริมและขยายการจดทะเบียนไปยังภาควิชาอื่นเพิ่มเติม
          </li>
          <li>
            ควรสร้าง <strong>กลไกสนับสนุนการยื่นจดสิทธิบัตร</strong> ต่อเนื่องจากโครงการวิจัยและผลงานตีพิมพ์ทางวิชาการ
          </li>
          <li>
            โครงการด้านเทคโนโลยีขั้นสูง เช่น IoT, AI ทางการเกษตร และวัสดุก่อสร้างคาร์บอนต่ำ ควรมีเป้าหมาย <strong>จดสิทธิบัตรเชิงพาณิชย์</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}