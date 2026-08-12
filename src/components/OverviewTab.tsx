"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function OverviewTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    // ล้างกราฟเก่าทิ้งก่อน (กันบัคกราฟซ้อนกัน)
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_RES = "#006838";
    const C_ACA = "#1565c0";
    const C_SRV = "#ef6c00";
    const C_PUB = "#8e24aa";
    const C_IP = "#d81b60";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926", "#1982C4", "#F15BB5", "#00BCD4"];
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

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

    // สร้างกราฟ 3 ตัวของหน้า Overview
    createChart("c_ov_monthly", { type: "bar", data: { labels: M, datasets: [ { label: "โครงการวิจัย", data: [2, 0, 3, 3, 1], backgroundColor: C_RES }, { label: "พัฒนาวิชาการ", data: [6, 5, 8, 2, 0], backgroundColor: C_ACA }, { label: "บริการวิชาการ", data: [47, 48, 54, 34, 36], backgroundColor: C_SRV }, { label: "ผลงานตีพิมพ์", data: [16, 0, 10, 13, 11], backgroundColor: C_PUB }, { label: "ทรัพย์สินทางปัญญา", data: [1, 0, 1, 0, 0], backgroundColor: C_IP } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { padding: 12 } }, datalabels: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_ov_funding", { type: "pie", data: { labels: ["วช.", "สวก.", "บพข.", "ทุนคณะฯ", "เร่งรัดฯ"], datasets: [{ data: [23085000, 9478000, 18000200, 40000, 16050200], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } });
    createChart("c_ov_prop", { type: "doughnut", data: { labels: ["โครงการวิจัย", "พัฒนาวิชาการ", "บริการวิชาการ", "ผลงานตีพิมพ์", "ทรัพย์สินทางปัญญา"], datasets: [{ data: [10, 21, 229, 61, 2], backgroundColor: [C_RES, C_ACA, C_SRV, C_PUB, C_IP] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });

    // Counter animation สำหรับตัวเลขวิ่ง
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const t = el.textContent?.trim() || "";
          if (!el.dataset.done && /^\d+$/.test(t)) {
            el.dataset.done = "1";
            const target = parseInt(t);
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
    document.querySelectorAll(".kpi-value").forEach((el) => { if (/^\d+$/.test(el.textContent?.trim() || "")) obs.observe(el); });

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, []);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-flask"></i></div><div className="kpi-value">10</div><div className="kpi-label">โครงการวิจัย</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-project-diagram"></i></div><div className="kpi-value">21</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hands-helping"></i></div><div className="kpi-value">229</div><div className="kpi-label">กิจกรรมบริการวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-book-open"></i></div><div className="kpi-value">61</div><div className="kpi-label">ผลงานตีพิมพ์</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-certificate"></i></div><div className="kpi-value">2</div><div className="kpi-label">ทรัพย์สินทางปัญญา</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card chart-full"><h3><i className="fas fa-chart-bar"></i> จำนวนผลงานรายเดือน (ม.ค. - พ.ค. 2569)</h3><div className="chart-wrapper"><canvas id="c_ov_monthly"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนงบประมาณวิจัยตามแหล่งทุน</h3><div className="chart-wrapper"><canvas id="c_ov_funding"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนผลงานทั้งหมด 5 ด้าน</h3><div className="chart-wrapper"><canvas id="c_ov_prop"></canvas></div></div>
      </div>
      <div className="decision-box">
        <div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ภาพรวม</div>
        <ul>
          <li><strong>งานบริการวิชาการ</strong>คงที่ทุกเดือน (34–54 กิจกรรม/เดือน) แสดงถึงความเข้มแข็ง</li>
          <li><strong>ทรัพย์สินทางปัญญา</strong>มีเพียง 2 รายการ — ควรผลักดันผลงานวิจัยสู่การจดสิทธิบัตร</li>
          <li><strong>ผลงานตีพิมพ์</strong> 61 ผลงาน ส่วนใหญ่ Q1 และ Q2 คุณภาพดีมาก</li>
          <li><strong>งบวิจัยรวม</strong>กว่า 66 ล้านบาท ส่วนใหญ่จากแหล่งทุนภายนอก</li>
        </ul>
      </div>
    </div>
  );
}