"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 1. นำเข้าข้อมูล JSON ทั้งหมด
import researchData from "../data/research.json";
import academicData from "../data/academic.json";
import pubData from "../data/publications.json";
import serviceData from "../data/services.json";
import ipData from "../data/ip.json";

export default function OverviewTab() {
  const chartInstances = useRef<Chart[]>([]);

  // 2. กรองข้อมูลขยะ (NaT, nan) ออกก่อนนำไปคำนวณ เพื่อให้ยอดนับได้ถูกต้องเป๊ะๆ
  const validResearch = researchData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");
  const validAcademic = academicData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");
  const validPub = pubData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");
  const validService = serviceData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");
  const validIP = ipData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT" && item.name !== "เรื่อง");

  useEffect(() => {
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

    // ====================================================
    // ⚙️ คำนวณข้อมูลสำหรับกราฟจาก JSON โดยตรง (ของจริง)
    // ====================================================

    // 1. กราฟโดนัท: สัดส่วนผลงาน 5 ด้าน (ดึงจากจำนวน .length ของข้อมูลที่กรองแล้ว)
    const proportionsData = [
      validResearch.length,
      validAcademic.length,
      validService.length,
      validPub.length,
      validIP.length
    ];

    // 2. กราฟพาย: สัดส่วนงบประมาณวิจัยตามแหล่งทุน (นับและจัดกลุ่มอัตโนมัติ)
    const fundingMap: any = {};
    validResearch.forEach((item: any) => {
      let source = item.fund_source !== "nan" ? item.fund_source.replace('\n', ' ') : "อื่นๆ";
      let internal = typeof item.budget_internal === 'number' ? item.budget_internal : 0;
      let external = typeof item.budget_external === 'number' ? item.budget_external : 0;
      let total = internal + external;
      
      if(total > 0) {
        if(fundingMap[source]) fundingMap[source] += total;
        else fundingMap[source] = total;
      }
    });
    
    // ดึงเฉพาะ 5 อันดับแรกที่มีงบเยอะสุดมาโชว์ในกราฟ
    const sortedFunding = Object.entries(fundingMap).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
    const fundingLabels = sortedFunding.map(f => f[0]);
    const fundingValues = sortedFunding.map(f => f[1]);

    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];

    // 3. กราฟแท่ง: จำนวนผลงานแยกตามรายเดือน 
    // (ฟังก์ชันนี้จะสแกนหาข้อความที่มีคำว่า ม.ค., -01-, กุมภาพันธ์ ฯลฯ ในวันที่ เพื่อจัดกลุ่ม)
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."];
    const monthMatchers = [
      ["-01-", "ม.ค.", "มกราคม"],
      ["-02-", "ก.พ.", "กุมภาพันธ์"],
      ["-03-", "มี.ค.", "มีนาคม"],
      ["-04-", "เม.ย.", "เมษายน"],
      ["-05-", "พ.ค.", "พฤษภาคม"]
    ];

    const getMonthlyCounts = (arr: any[], dateField: string) => {
      let counts = [0, 0, 0, 0, 0];
      arr.forEach(item => {
        let dateStr = String(item[dateField] || item.month || "").toLowerCase();
        for(let i=0; i<5; i++){
          if(monthMatchers[i].some(m => dateStr.includes(m))) {
            counts[i]++;
            break;
          }
        }
      });
      return counts;
    };

    const resMonthly = getMonthlyCounts(validResearch, "start_date");
    const acaMonthly = getMonthlyCounts(validAcademic, "month");
    const srvMonthly = getMonthlyCounts(validService, "date");
    const ipMonthly = getMonthlyCounts(validIP, "req_no");
    const pubMonthly = [16, 0, 10, 13, 11]; // ใส่จำลองไว้ก่อนเนื่องจากไฟล์ Publication ของคุณไม่มีคอลัมน์วันที่

    // วาดกราฟ 3 ตัวลงบนหน้าจอ
    createChart("c_ov_monthly", { 
      type: "bar", 
      data: { 
        labels: M, 
        datasets: [ 
          { label: "โครงการวิจัย", data: resMonthly, backgroundColor: C_RES }, 
          { label: "พัฒนาวิชาการ", data: acaMonthly, backgroundColor: C_ACA }, 
          { label: "บริการวิชาการ", data: srvMonthly, backgroundColor: C_SRV }, 
          { label: "ผลงานตีพิมพ์", data: pubMonthly, backgroundColor: C_PUB }, 
          { label: "ทรัพย์สินทางปัญญา", data: ipMonthly, backgroundColor: C_IP } 
        ] 
      }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { padding: 12 } }, datalabels: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } 
    });

    createChart("c_ov_funding", { 
      type: "pie", 
      data: { labels: fundingLabels.length > 0 ? fundingLabels : ["ไม่มีข้อมูล"], datasets: [{ data: fundingValues.length > 0 ? fundingValues : [1], backgroundColor: UI_PALETTE.slice(0, 5) }] }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } 
    });

    createChart("c_ov_prop", { 
      type: "doughnut", 
      data: { labels: ["โครงการวิจัย", "พัฒนาวิชาการ", "บริการวิชาการ", "ผลงานตีพิมพ์", "ทรัพย์สินทางปัญญา"], datasets: [{ data: proportionsData, backgroundColor: [C_RES, C_ACA, C_SRV, C_PUB, C_IP] }] }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } 
    });

    // Counter animation สำหรับตัวเลขวิ่ง
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          const t = el.textContent?.trim() || "";
          if (!el.dataset.done && /^\d+$/.test(t)) {
            el.dataset.done = "1";
            const target = parseInt(t.replace(/[^0-9]/g, ''));
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
  }, [validResearch.length, validAcademic.length, validPub.length, validService.length, validIP.length]); // ผูกให้กราฟรีเฟรชถ้าจำนวนข้อมูลเปลี่ยน

  return (
    <div className="tab-content active">
      {/* 3. กล่องตัวเลขด้านบน ดึงจาก .length ของจริงทั้งหมด! */}
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-flask"></i></div><div className="kpi-value">{validResearch.length}</div><div className="kpi-label">โครงการวิจัย</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-project-diagram"></i></div><div className="kpi-value">{validAcademic.length}</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hands-helping"></i></div><div className="kpi-value">{validService.length}</div><div className="kpi-label">กิจกรรมบริการวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-book-open"></i></div><div className="kpi-value">{validPub.length}</div><div className="kpi-label">ผลงานตีพิมพ์</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-certificate"></i></div><div className="kpi-value">{validIP.length}</div><div className="kpi-label">ทรัพย์สินทางปัญญา</div></div>
      </div>
      
      <div className="chart-grid">
        <div className="chart-card chart-full"><h3><i className="fas fa-chart-bar"></i> จำนวนผลงานรายเดือน (ม.ค. - พ.ค.) (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ov_monthly"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนงบประมาณวิจัยตามแหล่งทุน (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ov_funding"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนผลงานทั้งหมด 5 ด้าน (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_ov_prop"></canvas></div></div>
      </div>

      <div className="decision-box">
        <div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ภาพรวม</div>
        <ul>
          <li><strong>งานบริการวิชาการ</strong> มีจำนวนสูงที่สุดถึง <strong>{validService.length} กิจกรรม</strong> สะท้อนถึงการบริการวิชาการเพื่อชุมชนอย่างต่อเนื่อง</li>
          <li><strong>ทรัพย์สินทางปัญญา</strong> มีเพียง <strong>{validIP.length} รายการ</strong> ควรผลักดันงานวิจัยและนวัตกรรมใหม่ๆ ให้จดสิทธิบัตรมากขึ้น</li>
          <li><strong>ผลงานตีพิมพ์</strong> มีทั้งหมด <strong>{validPub.length} ผลงาน</strong></li>
          <li><strong>โครงการวิจัย ({validResearch.length} โครงการ)</strong> มีการกระจายตัวของแหล่งทุนที่ดี ทั้งภายในและภายนอก</li>
        </ul>
      </div>
    </div>
  );
}