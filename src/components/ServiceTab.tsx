"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function ServiceTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

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
  }, []);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hands-helping"></i></div><div className="kpi-value">229</div><div className="kpi-label">กิจกรรมทั้งหมด</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-user-check"></i></div><div className="kpi-value">100</div><div className="kpi-label">ผู้ทรงคุณวุฒิ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-chalkboard-teacher"></i></div><div className="kpi-value">50</div><div className="kpi-label">วิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-building"></i></div><div className="kpi-value">7</div><div className="kpi-label">ภาควิชาที่มีส่วนร่วม</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-line"></i> จำนวนกิจกรรมรายเดือน</h3><div className="chart-wrapper"><canvas id="c_sv_monthly"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> ประเภทกิจกรรมรายเดือน</h3><div className="chart-wrapper"><canvas id="c_sv_type_m"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนกิจกรรมตามประเภท</h3><div className="chart-wrapper"><canvas id="c_sv_type"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> Top 5 อาจารย์</h3><div className="chart-wrapper"><canvas id="c_sv_top"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนตามภาควิชา</h3><div className="chart-wrapper"><canvas id="c_sv_dept"></canvas></div></div>
      </div>
      <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — บริการวิชาการ</div><ul>
        <li><strong>งานผู้ทรงคุณวุฒิ</strong>สัดส่วนสูงสุด (44%) อาจารย์เป็นที่ยอมรับในวงวิชาการ</li>
        <li><strong>รศ.ดร.เบญญา กสานติกุล</strong> มีผลงานบริการมากที่สุด 22 ครั้ง</li>
        <li>กิจกรรมคงที่ (34–54 ครั้ง/เดือน) แสดง<strong>ความเข้มแข็งต่อเนื่อง</strong></li>
      </ul></div>
    </div>
  );
}