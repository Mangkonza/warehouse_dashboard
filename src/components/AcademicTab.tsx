"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// นำเข้าข้อมูล JSON
import academicData from "../data/academic.json";

export default function AcademicTab() {
  const chartInstances = useRef<Chart[]>([]);

  // กรองข้อมูลขยะออก
  const validData = academicData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");

  // คำนวณงบประมาณรวมทั้งหมด
  const totalBudgetAll = validData.reduce((sum, item: any) => sum + (typeof item.budget === 'number' ? item.budget : 0), 0);

  // หานับจำนวนหัวหน้าโครงการและผู้รับบริการที่ไม่ซ้ำกัน
  const uniqueHeads = new Set(validData.map((item: any) => item.head).filter(h => h !== "nan" && h !== "-"));
  const uniqueClients = new Set(validData.map((item: any) => item.client).filter(c => c !== "nan" && c !== "-"));

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_ACA = "#1565c0";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

    // ==========================================
    // ⚙️ Logic คำนวณข้อมูลกราฟจาก JSON 
    // ==========================================
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ก.ย.", "ต.ค.", "พ.ย."];
    let monthlyCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let monthlyBudget = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // ล้านบาท
    let clientBudget: any = {};

    validData.forEach((item: any) => {
      const budget = typeof item.budget === 'number' ? item.budget : 0;

      // 1. จัดกลุ่มตามเดือน
      let mStr = String(item.month || "").trim();
      const monthMap: any = { "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5, "ก.ค.": 6, "ก.ย.": 7, "ต.ค.": 8, "พ.ย.": 9, "1": 0, "2": 1, "3": 2, "4": 3 };
      
      if (monthMap[mStr] !== undefined) {
        let idx = monthMap[mStr];
        monthlyCount[idx]++;
        monthlyBudget[idx] += (budget / 1000000);
      }

      // 2. จัดกลุ่มตามผู้ขอรับบริการ (Client)
      let client = String(item.client || "").replace("\n", " ").trim();
      if (!client || client === "-" || client === "nan") client = "หน่วยงานภายใน/อื่นๆ";
      if (clientBudget[client]) clientBudget[client] += (budget / 1000000);
      else clientBudget[client] = (budget / 1000000);
    });

    // Top 5 ผู้ขอรับบริการ
    const sortedClients = Object.entries(clientBudget).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
    const clientLabels = sortedClients.map(c => c[0]);
    const clientData = sortedClients.map(c => c[1]);

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

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

    createChart("c_ac_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: monthlyCount, backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: monthlyBudget, backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    
    createChart("c_ac_alloc", { type: "doughnut", data: { labels: ["โครงการ (70%)", "ค่าอำนวยการ (15%)", "คณะ (5%)", "ภาควิชา (5%)", "มก. (5%)"], datasets: [{ data: [70, 15, 5, 5, 5], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_ac_client", { type: "bar", data: { labels: clientLabels, datasets: [{ label: "ล้านบาท", data: clientData, backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    
    // SDGs Mock
    createChart("c_ac_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ"], datasets: [{ label: "จำนวนโครงการ", data: [15, 12, 5], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13"], datasets: [{ label: "ล้านบาท", data: [97.28, 75.89, 15.94], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

    // Counter animation 
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const t = el.textContent?.trim() || "";
          if (!el.dataset.done && /^\d+$/.test(t)) {
            el.dataset.done = "1";
            const target = parseFloat(t.replace(/[^0-9.]/g, ''));
            if(isNaN(target)) return;
            let cur = 0;
            const step = Math.max(0.1, target / 30);
            const timer = setInterval(() => {
              cur += step;
              if (cur >= target) {
                cur = target;
                clearInterval(timer);
              }
              if(t.includes('M')) {
                el.textContent = `฿${cur.toFixed(1)}M`;
              } else {
                el.textContent = Math.floor(cur).toLocaleString();
              }
            }, 40);
          }
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".kpi-value").forEach((el) => { if (/[0-9]/.test(el.textContent?.trim() || "")) obs.observe(el); });

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-graduation-cap"></i></div><div className="kpi-value">{validData.length}</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-coins"></i></div><div className="kpi-value">฿{(totalBudgetAll / 1000000).toFixed(1)}M</div><div className="kpi-label">งบประมาณรวม</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-users"></i></div><div className="kpi-value">{uniqueClients.size}</div><div className="kpi-label">หน่วยงานผู้ขอรับบริการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-user-tie"></i></div><div className="kpi-value">{uniqueHeads.size}</div><div className="kpi-label">หัวหน้าโครงการ (PI)</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนโครงการรายเดือน (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ac_cnt"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณรายเดือน (ล้านบาท) (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ac_bud"></canvas></div></div>
      </div>
      
      <div className="table-card">
        <h3><i className="fas fa-table"></i> รายละเอียดโครงการพัฒนาวิชาการ</h3>
        <div className="table-scroll" style={{ maxHeight: "380px" }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>เดือน</th>
                <th>ชื่อโครงการ</th>
                <th>หัวหน้าโครงการ</th>
                <th>งบประมาณ (บาท)</th>
                <th>ผู้ขอรับบริการ</th>
              </tr>
            </thead>
            <tbody>
              {validData.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.month !== "nan" ? item.month : "-"}</td>
                  <td style={{ whiteSpace: "normal", minWidth: "250px" }}>{item.name}</td>
                  <td>{item.head !== "nan" ? item.head.replace("\n", " ") : "-"}</td>
                  <td className="budget-cell">{(item.budget || 0).toLocaleString()}</td>
                  <td>{item.client !== "nan" ? item.client.replace("\n", " ") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-doughnut"></i> สัดส่วนการจัดสรรงบ</h3><div className="chart-wrapper"><canvas id="c_ac_alloc"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> Top ผู้ขอรับบริการ (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ac_client"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-globe"></i> การกระจายตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_ac_sdg"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-coins"></i> งบประมาณตาม SDGs (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_ac_sdg_bud"></canvas></div></div>
      </div>
      <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — โครงการพัฒนาวิชาการ</div><ul>
        <li><strong>งบประมาณรวม</strong> ของโครงการพัฒนาวิชาการสะท้อนมูลค่าการให้บริการแก่หน่วยงานภายนอกในระดับสูง</li>
        <li><strong>หน่วยงานภาครัฐ</strong> เป็นผู้รับบริการหลักในการขับเคลื่อนโครงการ</li>
      </ul></div>
    </div>
  );
}