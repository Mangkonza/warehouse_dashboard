"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// นำเข้าข้อมูล JSON
import academicData from "../data/academic.json";

// (ยังคงรับ Props setActiveTab ไว้เผื่อไฟล์ Dashboard หลักส่งมา จะได้ไม่ Error)
export default function AcademicTab({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const chartInstances = useRef<Chart[]>([]);
  
  // กรองข้อมูลขยะออก
  const validData = academicData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");
  
  // ดึงเฉพาะ 5 รายการล่าสุดมาโชว์ที่หน้า Dashboard
  const recentData = validData.slice(-5).reverse();

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

    // 1. กราฟเส้น: จำนวนโครงการรายเดือน
    createChart("c_ac_cnt", { 
      type: "line", 
      data: { 
        labels: M, 
        datasets: [{ 
          label: "จำนวนโครงการ", 
          data: monthlyCount, 
          borderColor: C_ACA,
          backgroundColor: "rgba(21, 101, 192, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C_ACA,
          pointRadius: 5,
          pointHoverRadius: 7
        }] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, datalabels: { align: 'top', anchor: 'end', color: C_ACA, font: { weight: 'bold' } } }, 
        scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } 
      } 
    });

    // 2. กราฟเส้น: งบประมาณรายเดือน (ล้านบาท)
    createChart("c_ac_bud", { 
      type: "line", 
      data: { 
        labels: M, 
        datasets: [{ 
          label: "ล้านบาท", 
          data: monthlyBudget, 
          borderColor: C_ACA,
          backgroundColor: "rgba(21, 101, 192, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C_ACA,
          pointRadius: 5,
          pointHoverRadius: 7
        }] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } }, datalabels: { align: 'top', anchor: 'end', color: C_ACA, font: { weight: 'bold' }, formatter: (v: any) => v > 0 ? v.toFixed(1) : "" } }, 
        scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } 
      } 
    });
    
    // กราฟ 3: สัดส่วนการจัดสรรงบ (Doughnut)
    createChart("c_ac_alloc", { type: "doughnut", data: { labels: ["โครงการ (70%)", "ค่าอำนวยการ (15%)", "คณะ (5%)", "ภาควิชา (5%)", "มก. (5%)"], datasets: [{ data: [70, 15, 5, 5, 5], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    
    // กราฟ 4: Top ผู้ขอรับบริการ
    createChart("c_ac_client", { type: "bar", data: { labels: clientLabels, datasets: [{ label: "ล้านบาท", data: clientData, backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } }, datalabels: { display: false } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    
    // ==========================================
    // 📊 Diverging Bar Chart: SDGs (ปรับปรุงแล้ว)
    // ==========================================
    const sdgLabels = ["SDG 6", "SDG 9", "SDG 13", "SDG 2", "SDG 8"];
    const rawSDGCount = [4, 5, 3, 2, 1]; // จำลองจำนวนโครงการ
    const rawSDGBudget = [50.39, 16.27, 43.53, 6.88, 1.63]; // จำลองงบประมาณ
    
    const maxBudget = Math.max(...rawSDGBudget);
    const maxCount = Math.max(...rawSDGCount);
    const scaleRatio = maxBudget / maxCount;
    const scaledCountData = rawSDGCount.map(v => -(v * scaleRatio));

    createChart("c_ac_sdg_combined", {
      type: "bar",
      data: {
        labels: sdgLabels,
        datasets: [
          {
            label: "งบประมาณ (ล้านบาท)",
            data: rawSDGBudget.map(v => -v), // ฝั่งซ้าย (ติดลบ)
            backgroundColor: "#f4511e",
            borderRadius: 4,
            barPercentage: 0.7
          },
          {
            label: "จำนวนโครงการ",
            data: scaledCountData.map(v => Math.abs(v)), // ฝั่งขวา (บวก และ Scale แล้ว)
            backgroundColor: "#1565c0",
            borderRadius: 4,
            barPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                if (c.datasetIndex === 1) return "จำนวนโครงการ: " + rawSDGCount[c.dataIndex] + " โครงการ";
                return "งบประมาณ: " + rawSDGBudget[c.dataIndex].toFixed(2) + " ล้านบาท";
              }
            }
          },
          datalabels: {
            color: "#424242",
            font: { weight: "bold", size: 11 },
            anchor: (c: any) => c.datasetIndex === 0 ? "start" : "end",
            align: (c: any) => c.datasetIndex === 0 ? "left" : "right",
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 1) return rawSDGCount[c.dataIndex] + " โครงการ";
              return rawSDGBudget[c.dataIndex].toFixed(2) + " ลบ.";
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { display: false },
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: "← งบประมาณ (ล้านบาท) | จำนวนโครงการ →", font: { weight: "bold" }, padding: 10 }
          },
          y: {
            stacked: true,
            ticks: { font: { weight: "bold" } }
          }
        }
      }
    });

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
    <div className="tab-content active" style={{ position: "relative" }}>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-graduation-cap"></i></div><div className="kpi-value">{validData.length}</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-coins"></i></div><div className="kpi-value">฿{(totalBudgetAll / 1000000).toFixed(1)}M</div><div className="kpi-label">งบประมาณรวม</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-users"></i></div><div className="kpi-value">{uniqueClients.size}</div><div className="kpi-label">หน่วยงานผู้ขอรับบริการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-user-tie"></i></div><div className="kpi-value">{uniqueHeads.size}</div><div className="kpi-label">หัวหน้าโครงการ (PI)</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-line"></i> จำนวนโครงการรายเดือน (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ac_cnt"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-line"></i> งบประมาณรายเดือน (ล้านบาท) (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ac_bud"></canvas></div></div>
      </div>
      
      {/* 💡 ตาราง 5 รายการล่าสุด (เอาปุ่มจัดการออก และปรับสไตล์ให้สวยงาม) */}
      <h3 style={{ margin: "25px 0 15px 0", color: "#333", fontSize: "18px" }}>
        <i className="fas fa-list-ul" style={{ color: "#1565c0", marginRight: "8px" }}></i> 
        โครงการอัพเดทล่าสุด (5 รายการ)
      </h3>

      <div className="table-card" style={{ marginTop: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "8px", overflow: "hidden" }}>
        <div className="table-scroll">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#006838", color: "#fff" }}>
                <th style={{ width: "80px", textAlign: "center", padding: "12px" }}>เดือน</th>
                <th style={{ padding: "12px", textAlign: "left" }}>ชื่อโครงการ</th>
                <th style={{ padding: "12px", textAlign: "left" }}>หัวหน้าโครงการ</th>
                <th style={{ padding: "12px", textAlign: "right" }}>งบประมาณ (บาท)</th>
                <th style={{ padding: "12px", textAlign: "left" }}>ผู้ขอรับบริการ</th>
              </tr>
            </thead>
            <tbody>
              {recentData.map((item: any, index: number) => (
                <tr key={index} style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    {/* ป้ายกำกับเดือนแบบวงกลม */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e3f2fd", color: "#1565c0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: "bold", fontSize: "13px" }}>
                      {item.month !== "nan" ? item.month : "-"}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "normal", padding: "12px", color: "#444", lineHeight: "1.5" }}>{item.name}</td>
                  <td style={{ padding: "12px", color: "#555" }}>{item.head !== "nan" ? item.head.replace("\n", " ") : "-"}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#2e7d32" }}>
                    {(item.budget || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px", color: "#555" }}>{item.client !== "nan" ? item.client.replace("\n", " ") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-doughnut"></i> สัดส่วนการจัดสรรงบ</h3><div className="chart-wrapper"><canvas id="c_ac_alloc"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> Top ผู้ขอรับบริการ</h3><div className="chart-wrapper"><canvas id="c_ac_client"></canvas></div></div>
        <div className="chart-card" style={{ gridColumn: "span 2" }}>
            <h3><i className="fas fa-globe"></i> จำนวนและงบประมาณตาม SDGs (Diverging Chart)</h3>
            <div className="chart-wrapper"><canvas id="c_ac_sdg_combined"></canvas></div>
        </div>
      </div>

      <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — โครงการพัฒนาวิชาการ</div><ul>
        <li><strong>งบประมาณรวม</strong> ของโครงการพัฒนาวิชาการสะท้อนมูลค่าการให้บริการแก่หน่วยงานภายนอกในระดับสูง</li>
        <li><strong>หน่วยงานภาครัฐ</strong> เป็นผู้รับบริการหลักในการขับเคลื่อนโครงการ</li>
      </ul></div>

    </div>
  );
}