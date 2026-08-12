"use client"; // จำเป็นต้องใส่เพราะหน้านี้มีการโต้ตอบ (คลิกเปลี่ยนแท็บ) และใช้กราฟ

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function Dashboard() {
  // 1. สร้าง State สำหรับจัดการว่าตอนนี้เปิดแท็บไหนอยู่ (เริ่มต้นที่ overview)
  const [activeTab, setActiveTab] = useState("overview");
  const chartInitialized = useRef(false);

  // 2. ใช้ useEffect เพื่อรันโค้ดกราฟหลังจากที่หน้าเว็บโหลด HTML เสร็จแล้ว
  useEffect(() => {
    // ป้องกันการเรนเดอร์กราฟซ้ำซ้อนในโหมดพัฒนา (React Strict Mode)
    if (chartInitialized.current) return;
    chartInitialized.current = true;

    // เปิดใช้งาน Datalabels Plugin
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

    Chart.defaults.set("plugins.datalabels", {
      color: "#424242",
      font: { weight: "bold", size: 11 },
      anchor: (context: any) => (context.chart.config.options.indexAxis === "y" ? "end" : "end"),
      align: (context: any) => {
        if (context.chart.config.type === "line") return "top";
        return context.chart.config.options.indexAxis === "y" ? "right" : "top";
      },
      offset: 4,
      formatter: (value: any) => {
        if (value === 0) return "";
        if (typeof value === "number") {
          return value % 1 === 0 ? value.toLocaleString("en-US") : value.toLocaleString("en-US", { maximumFractionDigits: 2 });
        }
        return value;
      },
    });

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

    //ฟังก์ชั่นช่วยสร้างกราฟ ลดความซ้ำซ้อน
    const createChart = (id: string, config: any) => {
      const ctx = document.getElementById(id) as HTMLCanvasElement;
      if (ctx) new Chart(ctx, config as any);
    };

    // ===== TAB 1 =====
    createChart("c_ov_monthly", { type: "bar", data: { labels: M, datasets: [ { label: "โครงการวิจัย", data: [2, 0, 3, 3, 1], backgroundColor: C_RES }, { label: "พัฒนาวิชาการ", data: [6, 5, 8, 2, 0], backgroundColor: C_ACA }, { label: "บริการวิชาการ", data: [47, 48, 54, 34, 36], backgroundColor: C_SRV }, { label: "ผลงานตีพิมพ์", data: [16, 0, 10, 13, 11], backgroundColor: C_PUB }, { label: "ทรัพย์สินทางปัญญา", data: [1, 0, 1, 0, 0], backgroundColor: C_IP } ] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { padding: 12 } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_ov_funding", { type: "pie", data: { labels: ["วช.", "สวก.", "บพข.", "ทุนคณะฯ", "เร่งรัดฯ"], datasets: [{ data: [23085000, 9478000, 18000200, 40000, 16050200], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } });
    createChart("c_ov_prop", { type: "doughnut", data: { labels: ["โครงการวิจัย", "พัฒนาวิชาการ", "บริการวิชาการ", "ผลงานตีพิมพ์", "ทรัพย์สินทางปัญญา"], datasets: [{ data: [10, 21, 229, 61, 2], backgroundColor: [C_RES, C_ACA, C_SRV, C_PUB, C_IP] }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });

    // ===== TAB 2: RESEARCH =====
    createChart("c_re_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: [2, 0, 3, 3, 1], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: [14.6, 0, 17.7, 16.36, 18.0], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_dept", { type: "bar", data: { labels: ["ชลประทาน", "โยธา", "เครื่องกล", "อุตสาหการ", "การอาหาร"], datasets: [{ label: "ล้านบาท", data: [57.53, 0.6, 1.63, 0.04, 6.86], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_fund", { type: "doughnut", data: { labels: ["วช.", "สวก.", "บพข.", "ทุนคณะฯ", "เร่งรัดฯ"], datasets: [{ data: [23085000, 9478000, 18000200, 40000, 16050200], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } });
    createChart("c_re_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ", "SDG 2\nอาหาร", "SDG 8\nเศรษฐกิจ", "SDG 11\nเมืองยั่งยืน", "SDG 12\nบริโภคยั่งยืน"], datasets: [{ label: "จำนวนโครงการ", data: [4, 5, 3, 2, 1, 1, 1], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942", "#fd9d24", "#bf8b2e"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13", "SDG 2", "SDG 8", "SDG 11", "SDG 12"], datasets: [{ label: "ล้านบาท", data: [50.39, 16.27, 43.53, 6.88, 1.63, 0.6, 0.02], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942", "#fd9d24", "#bf8b2e"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

    // ===== TAB 3: ACADEMIC DEV =====
    createChart("c_ac_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: [6, 5, 8, 2, 0], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: [67.27, 58.75, 40.18, 8.04, 0], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_ac_alloc", { type: "doughnut", data: { labels: ["โครงการ (70%)", "ค่าอำนวยการ (15%)", "คณะ (5%)", "ภาควิชา (5%)", "มก. (5%)"], datasets: [{ data: [70, 15, 5, 5, 5], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_ac_client", { type: "bar", data: { labels: ["กรมชลประทาน", "กรมทรัพยากรน้ำ", "กรมทางหลวง", "อายิโนะโมะโต๊ะ", "กรมโรงงาน"], datasets: [{ label: "ล้านบาท", data: [88.8, 24.86, 19.6, 7.54, 8.5], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_ac_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ", "SDG 11\nเมืองยั่งยืน", "SDG 8\nเศรษฐกิจ", "SDG 7\nพลังงาน", "SDG 2\nอาหาร", "SDG 14\nทะเล"], datasets: [{ label: "จำนวนโครงการ", data: [9, 7, 2, 2, 1, 1, 1, 1], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#fd9d24", "#a21942", "#fcc30b", "#dda63a", "#0a97d9"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13", "SDG 11", "SDG 8", "SDG 7", "SDG 2", "SDG 14"], datasets: [{ label: "ล้านบาท", data: [97.28, 75.89, 15.94, 43.60, 8.50, 1.36, 7.54, 0.48], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#fd9d24", "#a21942", "#fcc30b", "#dda63a", "#0a97d9"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

    // ===== TAB 4: PUBLICATIONS =====
    createChart("c_pub_monthly", { type: "bar", data: { labels: M, datasets: [{ label: "Q1", data: [3, 0, 4, 5, 4], backgroundColor: UI_PALETTE[0], borderRadius: 4 }, { label: "Q2", data: [3, 0, 2, 4, 1], backgroundColor: UI_PALETTE[1], borderRadius: 4 }, { label: "TCI", data: [2, 0, 1, 2, 0], backgroundColor: UI_PALETTE[2], borderRadius: 4 }, { label: "เตรียมตีพิมพ์", data: [8, 0, 3, 2, 6], backgroundColor: UI_PALETTE[3], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: stackedDatalabels as any, legend: { position: "bottom", labels: { padding: 10 } } }, scales: { y: { beginAtZero: true, grace: "20%", stacked: true, title: { display: true, text: "จำนวน" } }, x: { stacked: true } } } });
    createChart("c_pub_bud", { type: "bar", data: { labels: M, datasets: [{ label: "เงินสนับสนุน (บาท)", data: [54133, 0, 87666, 150714, 44047], backgroundColor: C_PUB, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => "฿" + c.raw.toLocaleString() } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "บาท" } } } } });
    createChart("c_pub_level", { type: "pie", data: { labels: ["Q1", "Q2", "TCI1", "เตรียมตีพิมพ์"], datasets: [{ data: [22, 14, 10, 15], backgroundColor: UI_PALETTE.slice(0, 4) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_pub_dept", { type: "bar", data: { labels: ["ชลประทาน", "โยธา", "เกษตร", "อุตสาหการ", "เครื่องกล", "การอาหาร", "คอมพิวเตอร์"], datasets: [{ label: "จำนวนผลงาน", data: [16, 12, 10, 8, 6, 5, 4], backgroundColor: C_PUB, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_pub_sdg", { type: "bar", data: { labels: ["SDG 9\nนวัตกรรม", "SDG 2\nอาหาร", "SDG 6\nน้ำสะอาด", "SDG 11\nเมืองยั่งยืน", "SDG 13\nสภาพภูมิอากาศ", "SDG 12\nบริโภคยั่งยืน", "SDG 15\nระบบนิเวศบก"], datasets: [{ label: "จำนวนผลงาน", data: [22, 12, 10, 8, 5, 3, 1], backgroundColor: ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#bf8b2e", "#56c02b"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_pub_sdg_q1", { type: "bar", data: { labels: ["SDG 9", "SDG 2", "SDG 6", "SDG 11", "SDG 13", "SDG 15"], datasets: [{ label: "จำนวน Q1", data: [10, 5, 4, 4, 3, 1], backgroundColor: ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#56c02b"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนผลงาน Q1" } } } } });

    // ===== TAB 5: SERVICE =====
    createChart("c_sv_monthly", { type: "line", data: { labels: M, datasets: [{ label: "จำนวนกิจกรรม", data: [47, 48, 54, 34, 36], borderColor: C_SRV, backgroundColor: "rgba(239, 108, 0, .1)", fill: true, tension: 0.4, pointBackgroundColor: C_SRV, pointRadius: 6, pointHoverRadius: 9 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_sv_type_m", { type: "bar", data: { labels: M, datasets: [{ label: "ผู้ทรงคุณวุฒิ", data: [18, 20, 25, 18, 19], backgroundColor: UI_PALETTE[0], borderRadius: 3 }, { label: "วิชาการ", data: [10, 10, 12, 6, 12], backgroundColor: UI_PALETTE[1], borderRadius: 3 }, { label: "วิทยากร", data: [8, 8, 10, 5, 9], backgroundColor: UI_PALETTE[2], borderRadius: 3 }, { label: "อื่นๆ", data: [11, 10, 7, 5, 6], backgroundColor: UI_PALETTE[3], borderRadius: 3 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: stackedDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } }, scales: { y: { beginAtZero: true, grace: "20%", stacked: true, title: { display: true, text: "จำนวน" } }, x: { stacked: true } } } });
    createChart("c_sv_type", { type: "bar", data: { labels: ["ผู้ทรงคุณวุฒิ", "วิชาการ", "วิทยากร", "วิทยานิพนธ์ภายนอก", "วิชาชีพ", "ศึกษาดูงาน"], datasets: [{ label: "จำนวน", data: [100, 50, 40, 25, 10, 4], backgroundColor: C_SRV, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_sv_top", { type: "bar", data: { labels: ["รศ.ดร.เบญญา กสานติกุล", "รศ.ดร.ชัยศรี สุขสาโรจน์", "ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์", "ผศ.ดร.เพ็ญพิชชา สนิทอินทร์", "รศ.ดร.บัญชา ขวัญยืน"], datasets: [{ label: "จำนวนครั้ง", data: [22, 18, 16, 14, 12], backgroundColor: C_SRV, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวนครั้ง" } } } } });
    createChart("c_sv_dept", { type: "pie", data: { labels: ["ชลประทาน", "เครื่องกล", "โยธา", "เกษตร", "การอาหาร", "อื่นๆ"], datasets: [{ data: [70, 45, 35, 30, 25, 24], backgroundColor: UI_PALETTE.slice(0, 6) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });

    // ===== TAB 6: IP =====
    createChart("c_ip_monthly", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวน IP", data: [1, 0, 1, 0, 0], backgroundColor: C_IP, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวน" } } } } });
    createChart("c_ip_compare", { type: "bar", data: { labels: ["โครงการวิจัย", "ผลงานตีพิมพ์", "ทรัพย์สินทางปัญญา"], datasets: [{ label: "จำนวน", data: [10, 61, 2], backgroundColor: [C_RES, C_PUB, C_IP], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });

    // Counter animation
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

  }, []); // [] หมายถึงให้รันแค่ครั้งเดียวตอนโหลดหน้าเว็บ

  return (
    <>
      {/* 3. เมนูนำทาง (แท็บ) เปลี่ยน onclick เป็น onClick={() => setActiveTab(...)} */}
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
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        <div id="tab-overview" className={`tab-content ${activeTab === "overview" ? "active" : ""}`}>
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
          <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ภาพรวม</div><ul>
            <li><strong>งานบริการวิชาการ</strong>คงที่ทุกเดือน (34–54 กิจกรรม/เดือน) แสดงถึงความเข้มแข็ง</li>
            <li><strong>ทรัพย์สินทางปัญญา</strong>มีเพียง 2 รายการ — ควรผลักดันผลงานวิจัยสู่การจดสิทธิบัตร</li>
            <li><strong>ผลงานตีพิมพ์</strong> 61 ผลงาน ส่วนใหญ่ Q1 และ Q2 คุณภาพดีมาก</li>
            <li><strong>งบวิจัยรวม</strong>กว่า 66 ล้านบาท ส่วนใหญ่จากแหล่งทุนภายนอก</li>
          </ul></div>
        </div>

        {/* ==================== TAB 2: RESEARCH ==================== */}
        <div id="tab-research" className={`tab-content ${activeTab === "research" ? "active" : ""}`}>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-flask"></i></div><div className="kpi-value">10</div><div className="kpi-label">โครงการวิจัยทั้งหมด</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-coins"></i></div><div className="kpi-value">฿66.7M</div><div className="kpi-label">งบประมาณรวม</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-building"></i></div><div className="kpi-value">5</div><div className="kpi-label">ภาควิชาที่เกี่ยวข้อง</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hand-holding-usd"></i></div><div className="kpi-value">4</div><div className="kpi-label">แหล่งทุนวิจัย</div></div>
          </div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนโครงการวิจัยรายเดือน</h3><div className="chart-wrapper"><canvas id="c_re_cnt"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณวิจัยรายเดือน (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_re_bud"></canvas></div></div>
          </div>
          <div className="table-card"><h3><i className="fas fa-table"></i> รายละเอียดโครงการวิจัย</h3><div className="table-scroll"><table>
            <thead><tr><th>#</th><th>เดือน</th><th>ชื่อโครงการ</th><th>หัวหน้าโครงการ</th><th>ภาควิชา</th><th>งบประมาณ</th><th>แหล่งทุน</th><th>SDGs</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>ม.ค.</td><td>ศึกษาวิจัยการวิเคราะห์จุดอ่อนเชิงระบบด้านความมั่นคงปลอดภัยไซเบอร์ฯ</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td>วิศวกรรมชลประทาน</td><td className="budget-cell">14,000,000</td><td>วช.</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>2</td><td>ม.ค.</td><td>การพัฒนาสมบัติทางกลและความทนทานของมอร์ต้าร์ฯ</td><td>ผศ.ดร.เพ็ญพิชชา สนิทอินทร์</td><td>วิศวกรรมโยธา</td><td className="budget-cell">600,000</td><td>วช.</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>3</td><td>มี.ค.</td><td>ศึกษาวิจัยฯระบบช่วยตัดสินใจเพื่อพยากรณ์น้ำฯเชียงใหม่</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td>วิศวกรรมชลประทาน</td><td className="budget-cell">16,050,200</td><td>สำนักงานเร่งรัดฯ</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>4</td><td>มี.ค.</td><td>ระบบสนับสนุนการตัดสินใจฯเครือข่ายโซ่อุปทานมะพร้าว</td><td>ผศ.ดร.ชัยมงคล ลิ้มเพียรชอบ</td><td>วิศวกรรมอุตสาหการ</td><td className="budget-cell">20,000</td><td>ทุนคณะฯ</td><td><span className="badge-sdg" style={{ background: "#bf8b2e", color: "#fff" }}>SDG 12</span><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span></td></tr>
              <tr><td>5</td><td>มี.ค.</td><td>การพัฒนาเทคโนโลยีนวัตกรรมระบบควบคุมความปลอดภัยฯเครนด้วย LiDAR</td><td>อ.ดร.ณัฐพงษ์ สุขสบาย</td><td>วิศวกรรมเครื่องกล</td><td className="budget-cell">1,628,000</td><td>วช.</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#a21942", color: "#fff" }}>SDG 8</span></td></tr>
              <tr><td>6</td><td>เม.ย.</td><td>การพัฒนาพื้นที่เพื่อเตรียมความพร้อมรับมือภัยแล้งและอุทกภัย ปีที่ 2</td><td>รศ.ดร.สมชาย ดอนเจดีย์</td><td>วิศวกรรมชลประทาน</td><td className="budget-cell">9,478,000</td><td>สวก.</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>7</td><td>เม.ย.</td><td>การใช้เทคโนโลยีจัดการน้ำ-ปุ๋ยและจัดการผลิตมะม่วงน้ำดอกไม้สีทอง</td><td>รศ.ดร.รณฤทธิ์ ฤทธิรณ</td><td>วิศวกรรมการอาหาร</td><td className="budget-cell">6,857,000</td><td>วช.</td><td><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span></td></tr>
              <tr><td>8</td><td>เม.ย.</td><td>การพัฒนาระบบสารสนเทศเพื่อปรับปรุงกระบวนการติดตามฯ</td><td>ผศ.อธิวัฒน์ บุญมี</td><td>วิศวกรรมอุตสาหการ</td><td className="budget-cell">20,000</td><td>ทุนคณะฯ</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>9</td><td>พ.ค.</td><td>ศึกษาวิจัยฯระบบช่วยตัดสินใจพยากรณ์น้ำฯเชียงใหม่</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td>วิศวกรรมชลประทาน</td><td className="budget-cell">18,000,200</td><td>บพข.</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
            </tbody>
          </table></div></div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณตามภาควิชา</h3><div className="chart-wrapper"><canvas id="c_re_dept"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนแหล่งทุนวิจัย</h3><div className="chart-wrapper"><canvas id="c_re_fund"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-globe"></i> การกระจายตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_re_sdg"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-coins"></i> งบประมาณตาม SDGs (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_re_sdg_bud"></canvas></div></div>
          </div>
          <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — โครงการวิจัย</div><ul>
            <li><strong>SDG 6 (น้ำสะอาด)</strong> และ <strong>SDG 9 (อุตสาหกรรมและนวัตกรรม)</strong> เป็นเป้าหมายหลัก สอดคล้องกับความเชี่ยวชาญของคณะ</li>
            <li><strong>SDG 13 (การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ)</strong> มีงบประมาณสูง ควรเน้นเป็นจุดขายระดับนานาชาติ</li>
            <li>ควรเพิ่มงานวิจัยใน <strong>SDG 7 (พลังงาน)</strong> และ <strong>SDG 11 (เมืองยั่งยืน)</strong> ซึ่งยังมีน้อย</li>
            <li><strong>ภาควิชาวิศวกรรมชลประทาน</strong>มีงบสูงสุด ควรขยายไปภาควิชาอื่น</li>
          </ul></div>
        </div>

        {/* ==================== TAB 3: ACADEMIC DEV ==================== */}
        <div id="tab-academic" className={`tab-content ${activeTab === "academic" ? "active" : ""}`}>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-graduation-cap"></i></div><div className="kpi-value">21</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-coins"></i></div><div className="kpi-value">฿169.5M</div><div className="kpi-label">งบประมาณรวม</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-users"></i></div><div className="kpi-value">12</div><div className="kpi-label">หน่วยงานผู้ขอรับบริการ</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-user-tie"></i></div><div className="kpi-value">3</div><div className="kpi-label">PI หลัก</div></div>
          </div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนโครงการรายเดือน</h3><div className="chart-wrapper"><canvas id="c_ac_cnt"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณรายเดือน (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_ac_bud"></canvas></div></div>
          </div>
          <div className="table-card"><h3><i className="fas fa-table"></i> รายละเอียดโครงการพัฒนาวิชาการ</h3><div className="table-scroll"><table>
            <thead><tr><th>#</th><th>เดือน</th><th>ชื่อโครงการ</th><th>หัวหน้าโครงการ</th><th>งบประมาณ</th><th>ผู้ขอรับบริการ</th><th>SDGs</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>ม.ค.</td><td>พัฒนาแนวทางการประเมินประสิทธิผลฯทางหลวง</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td className="budget-cell">19,600,023</td><td>กรมทางหลวง</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>2</td><td>ม.ค.</td><td>Data Governance กรมทรัพยากรน้ำ</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td className="budget-cell">21,864,368</td><td>กรมทรัพยากรน้ำ</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span></td></tr>
              <tr><td>3</td><td>ม.ค.</td><td>ขับเคลื่อนภาคอุตสาหกรรมฯ</td><td>ผศ.ดร.นิธิรัชต์ สงวนเดือน</td><td className="budget-cell">8,499,528</td><td>กรมโรงงานอุตสาหกรรม</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#a21942", color: "#fff" }}>SDG 8</span></td></tr>
              <tr><td>4</td><td>ม.ค.</td><td>ระบบติดตามน้ำระยะไกลฯแม่น้ำยม</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td className="budget-cell">15,043,000</td><td>กรมชลประทาน</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>5</td><td>ม.ค.</td><td>วิเคราะห์แก๊สเรือนกระจก Gas chromatography</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td className="budget-cell">900,000</td><td>บุคลากร</td><td><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>6</td><td>ม.ค.</td><td>กลยุทธ์นโยบายพลังงาน</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td className="budget-cell">1,360,000</td><td>สนพ.</td><td><span className="badge-sdg" style={{ background: "#fcc30b", color: "#333" }}>SDG 7</span></td></tr>
              <tr><td>7</td><td>ก.พ.</td><td>ทดสอบประตูหน้าต่างฯมอก.</td><td>ผศ.ดร.ศิริศักดิ์ เชิดเกียรติพล</td><td className="budget-cell">1,000,000</td><td>ภาครัฐ/เอกชน</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>8</td><td>ก.พ.</td><td>วิเคราะห์ข้อมูลสถานการณ์น้ำ</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td className="budget-cell">2,990,000</td><td>กรมชลประทาน</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span></td></tr>
              <tr><td>9</td><td>ก.พ.</td><td>บริหารจัดการน้ำระยะไกล ชลประทานที่ 6</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td className="budget-cell">24,870,300</td><td>ชลประทานที่ 6</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>10</td><td>ก.พ.</td><td>ระบบสนับสนุนบริหารจัดการน้ำ ชลประทานที่ 6</td><td>รศ.ดร.วิษุวัฒก์ แต้สมบัติ</td><td className="budget-cell">24,900,000</td><td>ชลประทานที่ 6</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>11</td><td>มี.ค.</td><td>ประเมินน้ำเสียชุมชนฯบำบัดน้ำเสีย</td><td>ผศ.ดร.นิธิรัชต์ สงวนเดือน</td><td className="budget-cell">481,000</td><td>องค์การจัดการน้ำเสีย</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#0a97d9", color: "#fff" }}>SDG 14</span></td></tr>
              <tr><td>12</td><td>มี.ค.</td><td>จัดหาแหล่งกักเก็บน้ำ ศูนย์ EEC</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td className="budget-cell">24,000,000</td><td>กรมชลประทาน</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>13</td><td>เม.ย.</td><td>สารกระตุ้นชีวภาพต่ออ้อย/มันสำปะหลัง</td><td>รศ.ดร.ชัยศรี สุขสาโรจน์</td><td className="budget-cell">7,543,647</td><td>อายิโนะโมะโต๊ะ</td><td><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span></td></tr>
            </tbody>
          </table></div></div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-doughnut"></i> สัดส่วนการจัดสรรงบ</h3><div className="chart-wrapper"><canvas id="c_ac_alloc"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> Top 5 ผู้ขอรับบริการ</h3><div className="chart-wrapper"><canvas id="c_ac_client"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-globe"></i> การกระจายตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_ac_sdg"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-coins"></i> งบประมาณตาม SDGs (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_ac_sdg_bud"></canvas></div></div>
          </div>
          <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — โครงการพัฒนาวิชาการ</div><ul>
            <li><strong>SDG 6 (น้ำสะอาด)</strong> เป็นเป้าหมายหลักของโครงการพัฒนาวิชาการ สอดคล้องกับลูกค้าหลัก (กรมชลประทาน)</li>
            <li><strong>SDG 9 (นวัตกรรม)</strong> มีจำนวนโครงการมากที่สุด ครอบคลุมทั้ง IoT, Data Governance, มาตรฐาน</li>
            <li>ควรเพิ่มโครงการด้าน <strong>SDG 7 (พลังงาน)</strong> ซึ่งมีเพียง 1 โครงการ แต่ตลาดมีความต้องการสูง</li>
            <li><strong>กรมชลประทาน</strong>เป็นลูกค้าหลัก ควรเจรจาสัญญา Multi-year</li>
          </ul></div>
        </div>

        {/* ==================== TAB 4: PUBLICATIONS ==================== */}
        <div id="tab-publications" className={`tab-content ${activeTab === "publications" ? "active" : ""}`}>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-book-open"></i></div><div className="kpi-value">61</div><div className="kpi-label">ผลงานทั้งหมด</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-trophy"></i></div><div className="kpi-value">22</div><div className="kpi-label">ระดับ Q1</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-medal"></i></div><div className="kpi-value">14</div><div className="kpi-label">ระดับ Q2</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-award"></i></div><div className="kpi-value">10</div><div className="kpi-label">ระดับ TCI</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-edit"></i></div><div className="kpi-value">15</div><div className="kpi-label">เตรียมตีพิมพ์</div></div>
          </div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนผลงานตีพิมพ์รายเดือน (แยกระดับ)</h3><div className="chart-wrapper"><canvas id="c_pub_monthly"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> เงินสนับสนุนรายเดือน (บาท)</h3><div className="chart-wrapper"><canvas id="c_pub_bud"></canvas></div></div>
          </div>
          <div className="table-card"><h3><i className="fas fa-table"></i> ผลงานตีพิมพ์ (ตัวอย่าง)</h3><div className="table-scroll"><table>
            <thead><tr><th>#</th><th>เดือน</th><th>ชื่อผลงาน</th><th>เจ้าของผลงาน</th><th>ภาควิชา</th><th>ระดับ</th><th>เงินสนับสนุน</th><th>SDGs</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>ม.ค.</td><td>Mechanical, fatigue...rubber wood fly ash concrete</td><td>ผศ.ดร.เพ็ญพิชชา สนิทอินทร์</td><td>วิศวกรรมโยธา</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">3,333</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>2</td><td>ม.ค.</td><td>Physiological indicators...AWD irrigation</td><td>รศ.ดร.ชัยศรี สุขสาโรจน์</td><td>วิศวกรรมชลประทาน</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">20,000</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span></td></tr>
              <tr><td>3</td><td>ม.ค.</td><td>Impact of water channel obstructions...</td><td>ผศ.ดร.ไชยาพงษ์ เทพประสิทธิ์</td><td>วิศวกรรมชลประทาน</td><td><span className="badge badge-tci">TCI1</span></td><td className="budget-cell">5,000</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>4</td><td>ม.ค.</td><td>Performance comparison...rotating fluidization</td><td>รศ.ดร.ปรีดา ปรากฏมาก</td><td>วิศวกรรมเครื่องกล</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">800</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span></td></tr>
              <tr><td>5</td><td>ม.ค.</td><td>Optimal Order Quantity for Perishable Products</td><td>ผศ.ดร.จิรเกียรติ ทรายทอง</td><td>วิศวกรรมอุตสาหการ</td><td><span className="badge badge-q2">Q2</span></td><td className="budget-cell">20,000</td><td><span className="badge-sdg" style={{ background: "#bf8b2e", color: "#fff" }}>SDG 12</span></td></tr>
              <tr><td>6</td><td>มี.ค.</td><td>Postharvest detection anthracnose mango</td><td>ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล</td><td>วิศวกรรมเกษตร</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">1,666</td><td><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>7</td><td>มี.ค.</td><td>Shear Behavior UHPC Shear Pockets</td><td>รศ.ดร.นันทวัฒน์ ขมหวาน</td><td>วิศวกรรมโยธา</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">20,000</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>8</td><td>มี.ค.</td><td>Maturity assessment durian ML + NIR</td><td>รศ.ดร.อมรฤทธิ์ พุทธิพิพัฒน์ขจร</td><td>วิศวกรรมคอมพิวเตอร์</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">20,000</td><td><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>9</td><td>เม.ย.</td><td>Gully erosion susceptibility assessment</td><td>ผศ.ดร.ชูพันธุ์ ชมภูจันทร์</td><td>วิศวกรรมชลประทาน</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">2,857</td><td><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span><span className="badge-sdg" style={{ background: "#56c02b", color: "#fff" }}>SDG 15</span></td></tr>
              <tr><td>10</td><td>เม.ย.</td><td>ML for Concrete Strength with Steel Clamps</td><td>ผศ.ชิษณุพงศ์ สุธัมมะ</td><td>วิศวกรรมโยธา</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">20,000</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
              <tr><td>11</td><td>พ.ค.</td><td>Multiple reservoir optimization Chao Phraya</td><td>รศ.ดร.วราวุธ วุฒิวณิชย์</td><td>วิศวกรรมชลประทาน</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">2,857</td><td><span className="badge-sdg" style={{ background: "#26bde2", color: "#fff" }}>SDG 6</span><span className="badge-sdg" style={{ background: "#3f7e44", color: "#fff" }}>SDG 13</span></td></tr>
              <tr><td>12</td><td>พ.ค.</td><td>Filter-based SWIR imaging durian quality</td><td>ศ.ดร.อนุพันธ์ เทอดวงศ์วรกุล</td><td>วิศวกรรมเกษตร</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">2,500</td><td><span className="badge-sdg" style={{ background: "#dda63a", color: "#fff" }}>SDG 2</span><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span></td></tr>
              <tr><td>13</td><td>พ.ค.</td><td>Supra-GQDs metakaolin-modified concrete</td><td>ผศ.ดร.เพ็ญพิชชา สนิทอินทร์</td><td>วิศวกรรมโยธา</td><td><span className="badge badge-q1">Q1</span></td><td className="budget-cell">6,000</td><td><span className="badge-sdg" style={{ background: "#fd6925", color: "#fff" }}>SDG 9</span><span className="badge-sdg" style={{ background: "#fd9d24", color: "#fff" }}>SDG 11</span></td></tr>
            </tbody>
          </table></div></div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนผลงานตามระดับ</h3><div className="chart-wrapper"><canvas id="c_pub_level"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนผลงานตามภาควิชา</h3><div className="chart-wrapper"><canvas id="c_pub_dept"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-globe"></i> การกระจายผลงานตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_pub_sdg"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> ผลงาน Q1 ตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_pub_sdg_q1"></canvas></div></div>
          </div>
          <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ผลงานทางวิชาการ</div><ul>
            <li><strong>SDG 9 (นวัตกรรม)</strong> มีผลงานตีพิมพ์มากที่สุด โดยเฉพาะด้านวัสดุก่อสร้างและ Machine Learning</li>
            <li><strong>SDG 2 (อาหาร/เกษตร)</strong> มีผลงาน Q1 สูง จากงานวิจัยด้าน Postharvest และ NIR spectroscopy</li>
            <li><strong>SDG 6 (น้ำ)</strong> มีผลงานตีพิมพ์อย่างต่อเนื่อง เป็นจุดแข็งของคณะ</li>
            <li>ควรเพิ่มผลงานด้าน <strong>SDG 7 (พลังงาน)</strong> และ <strong>SDG 3 (สุขภาพ)</strong> เพื่อความหลากหลาย</li>
          </ul></div>
        </div>

        {/* ==================== TAB 5: SERVICE ==================== */}
        <div id="tab-service" className={`tab-content ${activeTab === "service" ? "active" : ""}`}>
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

        {/* ==================== TAB 6: IP ==================== */}
        <div id="tab-ip" className={`tab-content ${activeTab === "ip" ? "active" : ""}`}>
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-file-alt"></i></div><div className="kpi-value">2</div><div className="kpi-label">อนุสิทธิบัตร</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-scroll"></i></div><div className="kpi-value">0</div><div className="kpi-label">สิทธิบัตร</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-money-bill-wave"></i></div><div className="kpi-value">฿20,000</div><div className="kpi-label">เงินสนับสนุน</div></div>
            <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-building"></i></div><div className="kpi-value">1</div><div className="kpi-label">ภาควิชาที่มี IP</div></div>
          </div>
          <div className="chart-grid">
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวน IP รายเดือน</h3><div className="chart-wrapper"><canvas id="c_ip_monthly"></canvas></div></div>
            <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> เปรียบเทียบ IP vs วิจัย vs ตีพิมพ์</h3><div className="chart-wrapper"><canvas id="c_ip_compare"></canvas></div></div>
          </div>
          <div className="table-card"><h3><i className="fas fa-table"></i> รายการทรัพย์สินทางปัญญา</h3><div className="table-scroll"><table>
            <thead><tr><th>#</th><th>เดือน</th><th>เรื่อง</th><th>ผู้ประดิษฐ์</th><th>ภาควิชา</th><th>ประเภท</th><th>เลขที่คำขอ</th><th>เลขที่คุ้มครอง</th><th>สถานะ</th><th>เงินสนับสนุน</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>ม.ค.</td><td>ชุดอุปกรณ์ตรวจวัดความชื้นของเมล็ดพืช</td><td>รศ.ดร.พิมพ์พรรณ ปรืองาม</td><td>วิศวกรรมเกษตร</td><td><span className="badge badge-patent">อนุสิทธิบัตร</span></td><td>2403001791</td><td>26189</td><td>ได้รับความคุ้มครอง</td><td className="budget-cell">10,000</td></tr>
              <tr><td>2</td><td>มี.ค.</td><td>รถไถเดินตามสำหรับกำจัดวัชพืช</td><td>รศ.ดร.ประเทือง อุษาบริสุทธิ์</td><td>วิศวกรรมเกษตร</td><td><span className="badge badge-patent">อนุสิทธิบัตร</span></td><td>2503001568</td><td>27126</td><td>ได้รับความคุ้มครอง</td><td className="budget-cell">10,000</td></tr>
            </tbody>
          </table></div></div>
          <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ทรัพย์สินทางปัญญา</div><ul>
            <li>IP มี<strong>เพียง 2 รายการ</strong> ต่ำมากเทียบกับ 10 โครงการวิจัยและ 61 ผลงานตีพิมพ์</li>
            <li>ทั้ง 2 รายการมาจาก<strong>ภาควิชาวิศวกรรมเกษตรเท่านั้น</strong> ควรขยายไปภาควิชาอื่น</li>
            <li>ควรสร้าง<strong>กลไกสนับสนุนการยื่นจดสิทธิบัตร</strong>จากผลงานวิจัย</li>
            <li>โครงการเทคโนโลยี เช่น LiDAR, ระบบน้ำอัตโนมัติ ควรมีเป้าหมาย<strong>จดสิทธิบัตร</strong></li>
          </ul></div>
        </div>

        {/* ==================== TAB 7: KPI ==================== */}
        <div id="tab-kpi" className={`tab-content ${activeTab === "kpi" ? "active" : ""}`}>
          <div className="empty-state">
            <i className="fas fa-bullseye"></i>
            <h3>หน้าตัวชี้วัด (KPI Dashboard)</h3>
            <p>ขณะนี้ยังไม่มีข้อมูลตัวชี้วัด เมื่อได้รับข้อมูลแล้วจะแสดงผลในหน้านี้</p>
          </div>
          <div className="kpi-placeholder-grid">
            <div className="kpi-placeholder"><h4><i className="fas fa-flask" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 1: จำนวนโครงการวิจัยต่อปี</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-coins" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 2: งบประมาณวิจัยจากภายนอก</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-book-open" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 3: จำนวนผลงานตีพิมพ์ Q1</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-certificate" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 4: จำนวนสิทธิบัตร/อนุสิทธิบัตร</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-hands-helping" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 5: กิจกรรมบริการวิชาการ</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-graduation-cap" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 6: รายได้โครงการพัฒนาวิชาการ</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-user-tie" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 7: สัดส่วนอาจารย์ที่มีผลงานวิจัย</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
            <div className="kpi-placeholder"><h4><i className="fas fa-globe" style={{ color: "var(--ku)", marginRight: "6px" }}></i> KPI 8: ความร่วมมือระหว่างประเทศ</h4><p>เป้าหมาย: — | ผลลัพธ์: รอข้อมูล</p><div className="placeholder-bar"><span style={{ width: "0%" }}></span></div></div>
          </div>
          <div className="decision-box" style={{ marginTop: "28px" }}><div className="decision-header"><i className="fas fa-lightbulb"></i> แนวทางการกำหนดตัวชี้วัด</div><ul>
            <li>ตัวชี้วัดควรสอดคล้องกับ<strong>แผนยุทธศาสตร์</strong>ของคณะและมหาวิทยาลัย</li>
            <li>ควรกำหนดค่าเป้าหมาย (Target) ที่ชัดเจนสำหรับแต่ละ KPI</li>
            <li>แนะนำหลัก <strong>SMART</strong> (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
            <li>ข้อมูลจากแท็บอื่นสามารถเป็น Baseline ในการกำหนดเป้าหมาย</li>
          </ul></div>
        </div>

      </main>
    </>
  );
}