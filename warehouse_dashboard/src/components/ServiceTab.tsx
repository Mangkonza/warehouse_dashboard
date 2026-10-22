"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  FaHandsHelping,
  FaUserCheck,
  FaChalkboardTeacher,
  FaBuilding,
  FaTable,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaLightbulb,
  FaSearch,
} from "react-icons/fa";

// 1. นำเข้าข้อมูล JSON
import serviceData from "../data/services.json";
import { getCachedCategoryData } from "../lib/dataService";
import { TimeFilterState, itemMatchesTimeFilter } from "../types/timeFilter";

export default function ServiceTab({ timeFilter }: { timeFilter?: TimeFilterState }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dataList, setDataList] = useState<any[]>(() => getCachedCategoryData('service') || serviceData);
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('service');
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  const validData = dataList
    .filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    .filter((item: any) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#0f172a";

    const C_SRV = "#ef6c00";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."];

    const pieDatalabels = {
      color: "#fff",
      anchor: "center",
      align: "center",
      textStrokeColor: "rgba(0,0,0,0.6)",
      textStrokeWidth: 2,
      font: { weight: "bold", size: 12 },
      formatter: (value: any, context: any) => {
        if (value === 0) return "";
        let sum = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
        let p = ((value * 100) / sum).toFixed(1) + "%";
        return value.toLocaleString("en-US") + "\n(" + p + ")";
      },
      textAlign: "center",
    };

    const stackedDatalabels = {
      color: "#fff",
      anchor: "center",
      align: "center",
      textStrokeColor: "rgba(0,0,0,0.5)",
      textStrokeWidth: 2,
      formatter: (value: any) => (value === 0 ? "" : value),
    };

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

    createChart("c_sv_monthly", { type: "line", data: { labels: M, datasets: [{ label: "จำนวนกิจกรรม", data: [47, 48, 54, 34, 36], borderColor: C_SRV, backgroundColor: "rgba(239, 108, 0, .1)", fill: true, tension: 0.4, pointBackgroundColor: C_SRV, pointRadius: 6, pointHoverRadius: 9 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_sv_type_m", { type: "bar", data: { labels: M, datasets: [{ label: "ผู้ทรงคุณวุฒิ", data: [18, 20, 25, 18, 19], backgroundColor: UI_PALETTE[0], borderRadius: 3 }, { label: "วิชาการ", data: [10, 10, 12, 6, 12], backgroundColor: UI_PALETTE[1], borderRadius: 3 }, { label: "วิทยากร", data: [8, 8, 10, 5, 9], backgroundColor: UI_PALETTE[2], borderRadius: 3 }, { label: "อื่นๆ", data: [11, 10, 7, 5, 6], backgroundColor: UI_PALETTE[3], borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: stackedDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } }, scales: { y: { beginAtZero: true, grace: "20%", stacked: true, title: { display: true, text: "จำนวน" } }, x: { stacked: true } } } });
    createChart("c_sv_type", { type: "bar", data: { labels: ["ผู้ทรงคุณวุฒิ", "วิชาการ", "วิทยากร", "วิทยานิพนธ์ภายนอก", "วิชาชีพ", "ศึกษาดูงาน"], datasets: [{ label: "จำนวน", data: [100, 50, 40, 25, 10, 4], backgroundColor: C_SRV, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_sv_top", { type: "bar", data: { labels: ["รศ.ดร.เบญญา กสานติกุล", "รศ.ดร.ชัยศรี สุขสาโรจน์", "ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์", "ผศ.ดร.เพ็ญพิชชา สนิทอินทร์", "รศ.ดร.บัญชา ขวัญยืน"], datasets: [{ label: "จำนวนครั้ง", data: [22, 18, 16, 14, 12], backgroundColor: C_SRV, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวนครั้ง" } } } } });
    createChart("c_sv_dept", { type: "pie", data: { labels: ["ชลประทาน", "เครื่องกล", "โยธา", "เกษตร", "การอาหาร", "อื่นๆ"], datasets: [{ data: [70, 45, 35, 30, 25, 24], backgroundColor: UI_PALETTE.slice(0, 6) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });

    // Counter animation
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const t = el.textContent?.trim() || "";
          if (!el.dataset.done && /^\d+$/.test(t)) {
            el.dataset.done = "1";
            const target = parseInt(t);
            if(isNaN(target)) return;
            let cur = 0;
            const step = Math.max(1, Math.ceil(target / 30));
            const timer = setInterval(() => {
              cur += step;
              if (cur >= target) {
                cur = target;
                clearInterval(timer);
              }
              el.textContent = cur.toLocaleString();
            }, 40);
          }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".kpi-value").forEach((el) => { if (/[0-9]/.test(el.textContent?.trim() || "")) obs.observe(el); });

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, [timeFilter]);

  const uniquePersons = new Set(validData.map((d: any) => d.person).filter((p: any) => p && p !== 'nan'));
  const uniqueTargets = new Set(validData.map((d: any) => d.target_group).filter((t: any) => t && t !== 'nan'));
  const uniqueDepts = new Set(validData.map((d: any) => d.department).filter((d: any) => d && d !== 'nan'));

  const filteredData = useMemo(() => {
    return validData.filter((item: any) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const p = String(item.person || '').toLowerCase();
        const t = String(item.target_group || '').toLowerCase();
        if (!n.includes(q) && !p.includes(q) && !t.includes(q)) return false;
      }
      return true;
    });
  }, [validData, searchTerm]);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><FaHandsHelping /></div>
          <div className="kpi-value">{validData.length}</div>
          <div className="kpi-label">กิจกรรมทั้งหมด</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaUserCheck /></div>
          <div className="kpi-value">{uniquePersons.size}</div>
          <div className="kpi-label">อาจารย์/ผู้รับผิดชอบ</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaChalkboardTeacher /></div>
          <div className="kpi-value">{uniqueTargets.size}</div>
          <div className="kpi-label">กลุ่มเป้าหมายผู้รับบริการ</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaBuilding /></div>
          <div className="kpi-value">{uniqueDepts.size || 7}</div>
          <div className="kpi-label">ภาควิชาที่มีส่วนร่วม</div>
        </div>
      </div>
      
      {/* Table Section with Search */}
      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>
            <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดกิจกรรมบริการวิชาการ ({filteredData.length} กิจกรรม)
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', fontSize: '13px' }}>
            <FaSearch style={{ color: '#94a3b8', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="ค้นหาชื่อกิจกรรม, ผู้จัด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '200px', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div className="table-scroll" style={{ maxHeight: "400px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th style={{ width: '100px' }}>วันที่</th>
                <th>ชื่อกิจกรรม / เรื่อง</th>
                <th>อาจารย์/ผู้รับผิดชอบ</th>
                <th>กลุ่มเป้าหมาย</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{item.date !== "nan" ? String(item.date).substring(0, 10) : "-"}</td>
                    <td style={{ whiteSpace: "normal", minWidth: "250px" }}>{item.name}</td>
                    <td>{item.person !== "nan" ? item.person : "-"}</td>
                    <td>{item.target_group !== "nan" ? item.target_group : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><FaChartLine style={{ color: '#00914d' }} /> จำนวนกิจกรรมรายเดือน</h3>
          <div className="chart-wrapper"><canvas id="c_sv_monthly"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> ประเภทกิจกรรมรายเดือน</h3>
          <div className="chart-wrapper"><canvas id="c_sv_type_m"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> จำนวนกิจกรรมตามประเภท</h3>
          <div className="chart-wrapper"><canvas id="c_sv_type"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> Top 5 อาจารย์</h3>
          <div className="chart-wrapper"><canvas id="c_sv_top"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartPie style={{ color: '#00914d' }} /> สัดส่วนตามภาควิชา</h3>
          <div className="chart-wrapper"><canvas id="c_sv_dept"></canvas></div>
        </div>
      </div>

      <div className="decision-box">
        <div className="decision-header">
          <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — บริการวิชาการ
        </div>
        <ul>
          <li><strong>งานผู้ทรงคุณวุฒิ</strong>สัดส่วนสูงสุด อาจารย์เป็นที่ยอมรับในวงวิชาการ</li>
          <li>กิจกรรมดำเนินอย่างต่อเนื่อง สะท้อน<strong>ความเข้มแข็งในการบริการสังคม</strong>ของคณะวิศวกรรมศาสตร์</li>
        </ul>
      </div>
    </div>
  );
}