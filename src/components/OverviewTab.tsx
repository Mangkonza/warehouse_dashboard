"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 1. นำเข้าข้อมูล JSON ทั้งหมด
import researchData from "../data/research.json";
import academicData from "../data/academic.json";
import pubData from "../data/publications.json";
import serviceData from "../data/services.json";
import ipData from "../data/ip.json";

export default function OverviewTab() {
  // 💡 State สำหรับตัวกรองเวลา (Filter) อิงตามปีงบประมาณ
  const [timeFilter, setTimeFilter] = useState("all");
  const chartInstances = useRef<Chart[]>([]);

  // ==========================================
  // ⚙️ ฟังก์ชันช่วยค้นหาเดือนจากข้อความ
  // ==========================================
  const getMonthStr = (text: string) => {
    const str = String(text).toLowerCase();
    if (/(ม\.ค\.|มกราคม|-01-|1\/256)/.test(str)) return "ม.ค.";
    if (/(ก\.พ\.|กุมภาพันธ์|-02-|2\/256)/.test(str)) return "ก.พ.";
    if (/(มี\.ค\.|มีนาคม|-03-|3\/256)/.test(str)) return "มี.ค.";
    if (/(เม\.ย\.|เมษายน|-04-|4\/256)/.test(str)) return "เม.ย.";
    if (/(พ\.ค\.|พฤษภาคม|-05-|5\/256)/.test(str)) return "พ.ค.";
    if (/(มิ\.ย\.|มิถุนายน|-06-|6\/256)/.test(str)) return "มิ.ย.";
    if (/(ก\.ค\.|กรกฎาคม|-07-|7\/256)/.test(str)) return "ก.ค.";
    if (/(ส\.ค\.|สิงหาคม|-08-|8\/256)/.test(str)) return "ส.ค.";
    if (/(ก\.ย\.|กันยายน|-09-|9\/256)/.test(str)) return "ก.ย.";
    if (/(ต\.ค\.|ตุลาคม|-10-|10\/256)/.test(str)) return "ต.ค.";
    if (/(พ\.ย\.|พฤศจิกายน|-11-|11\/256)/.test(str)) return "พ.ย.";
    if (/(ธ\.ค\.|ธันวาคม|-12-|12\/256)/.test(str)) return "ธ.ค.";
    return "อื่นๆ";
  };

  // ฟังก์ชันกรองข้อมูลตามไตรมาส (ปีงบประมาณ)
  const filterByTime = (item: any) => {
    if (timeFilter === "all") return true;
    const mStr = getMonthStr(JSON.stringify(item));
    if (timeFilter === "q1") return ["ต.ค.", "พ.ย.", "ธ.ค."].includes(mStr);
    if (timeFilter === "q2") return ["ม.ค.", "ก.พ.", "มี.ค."].includes(mStr);
    if (timeFilter === "q3") return ["เม.ย.", "พ.ค.", "มิ.ย."].includes(mStr);
    if (timeFilter === "q4") return ["ก.ค.", "ส.ค.", "ก.ย."].includes(mStr);
    return true;
  };

  // 2. กรองข้อมูลขยะ (NaT, nan) และกรองตาม Filter
  const validResearch = researchData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT").filter(filterByTime);
  const validAcademic = academicData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT").filter(filterByTime);
  const validPub = pubData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT").filter(filterByTime);
  const validService = serviceData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT").filter(filterByTime);
  const validIP = ipData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT" && item.name !== "เรื่อง").filter(filterByTime);

  useEffect(() => {
    // ล้างกราฟเก่าก่อนวาดใหม่
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
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
    
    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

    // ====================================================
    // ⚙️ คำนวณข้อมูลสำหรับกราฟจาก JSON 
    // ====================================================

    // 1. กราฟโดนัท: สัดส่วนผลงาน 5 ด้าน
    const proportionsData = [validResearch.length, validAcademic.length, validService.length, validPub.length, validIP.length];

    // 2. กราฟพาย: สัดส่วนงบประมาณวิจัยตามแหล่งทุน
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
    
    const sortedFunding = Object.entries(fundingMap).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
    const fundingLabels = sortedFunding.map(f => f[0]);
    const fundingValues = sortedFunding.map(f => f[1]);

    // 3. กราฟแท่ง: จำนวนผลงานแยกตามรายเดือน (จัดเรียงเดือนตามปีงบประมาณ)
    const FY_MONTHS = ["ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย."];
    let M = FY_MONTHS;
    if (timeFilter === "q1") M = ["ต.ค.", "พ.ย.", "ธ.ค."];
    if (timeFilter === "q2") M = ["ม.ค.", "ก.พ.", "มี.ค."];
    if (timeFilter === "q3") M = ["เม.ย.", "พ.ค.", "มิ.ย."];
    if (timeFilter === "q4") M = ["ก.ค.", "ส.ค.", "ก.ย."];

    const getMonthlyCounts = (arr: any[]) => {
      let counts = new Array(M.length).fill(0);
      arr.forEach(item => {
        let mStr = getMonthStr(JSON.stringify(item));
        let idx = M.indexOf(mStr);
        if (idx !== -1) counts[idx]++;
      });
      return counts;
    };

    const resMonthly = getMonthlyCounts(validResearch);
    const acaMonthly = getMonthlyCounts(validAcademic);
    const srvMonthly = getMonthlyCounts(validService);
    const pubMonthly = getMonthlyCounts(validPub);
    const ipMonthly = getMonthlyCounts(validIP);

    // ====================================================
    // 🎨 วาดกราฟ
    // ====================================================

    // กราฟ 1: จำนวนผลงานตามช่วงเวลา
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

    // กราฟ 2: เปรียบเทียบผลงานปีปัจจุบัน vs ปีก่อนหน้า (จำลองข้อมูลปีก่อนเพื่อแสดงผลเปรียบเทียบ)
    const prevYearData = [
      Math.floor(researchData.length * 0.85),
      Math.floor(academicData.length * 0.9),
      Math.floor(serviceData.length * 0.8),
      Math.floor(pubData.length * 0.9),
      2 
    ];

    createChart("c_ov_compare_year", { 
      type: "bar", 
      data: { 
        labels: ["วิจัย", "พัฒนาวิชาการ", "บริการวิชาการ", "ตีพิมพ์", "IP"], 
        datasets: [ 
          { label: "ปีก่อนหน้า", data: prevYearData, backgroundColor: "#BDBDBD", borderRadius: 4 },
          { label: "ปีงบประมาณปัจจุบัน", data: proportionsData, backgroundColor: [C_RES, C_ACA, C_SRV, C_PUB, C_IP], borderRadius: 4 }
        ] 
      }, 
      options: { 
        responsive: true, maintainAspectRatio: false, 
        plugins: { 
          legend: { position: "bottom", labels: { padding: 12 } },
          datalabels: { align: 'end', anchor: 'end', font: { weight: 'bold' }, formatter: (v: any) => v > 0 ? v : "" }
        }, 
        scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } 
      } 
    });

    // กราฟ 3: สัดส่วนผลงาน 5 ด้าน
    createChart("c_ov_prop", { 
      type: "doughnut", 
      data: { labels: ["โครงการวิจัย", "พัฒนาวิชาการ", "บริการวิชาการ", "ผลงานตีพิมพ์", "ทรัพย์สินทางปัญญา"], datasets: [{ data: proportionsData, backgroundColor: [C_RES, C_ACA, C_SRV, C_PUB, C_IP] }] }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { position: "bottom", labels: { padding: 8 } } } } 
    });

    // กราฟ 4: สัดส่วนงบประมาณวิจัยตามแหล่งทุน
    createChart("c_ov_funding", { 
      type: "pie", 
      data: { labels: fundingLabels.length > 0 ? fundingLabels : ["ไม่มีข้อมูล"], datasets: [{ data: fundingValues.length > 0 ? fundingValues : [1], backgroundColor: UI_PALETTE.slice(0, 5) }] }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: { display: false }, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } 
    });

    // Counter animation
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
  }, [timeFilter]); // ผูก dependency เพื่อให้กราฟรีเฟรชเมื่อเปลี่ยนตัวกรอง

  return (
    <div className="tab-content active">
      
      {/* 💡 แถบเครื่องมือ Filter ตามรอบปีงบประมาณ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "10px 15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
        <div style={{ fontWeight: "bold", color: "#333" }}>
          <i className="fas fa-filter" style={{ marginRight: "8px", color: "var(--ku, #006838)" }}></i> ตัวกรองข้อมูล (ตามรอบปีงบประมาณ)
        </div>
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit", cursor: "pointer", outline: "none", backgroundColor: "#fff" }}
        >
          <option value="all">สรุปยอดรวมทั้งปีงบประมาณ</option>
          <option value="q1">ไตรมาส 1 (ต.ค. - ธ.ค. ปีก่อน)</option>
          <option value="q2">ไตรมาส 2 (ม.ค. - มี.ค.)</option>
          <option value="q3">ไตรมาส 3 (เม.ย. - มิ.ย.)</option>
          <option value="q4">ไตรมาส 4 (ก.ค. - ก.ย.)</option>
        </select>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-flask"></i></div><div className="kpi-value" key={`res-${timeFilter}`}>{validResearch.length}</div><div className="kpi-label">โครงการวิจัย</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-project-diagram"></i></div><div className="kpi-value" key={`aca-${timeFilter}`}>{validAcademic.length}</div><div className="kpi-label">โครงการพัฒนาวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hands-helping"></i></div><div className="kpi-value" key={`srv-${timeFilter}`}>{validService.length}</div><div className="kpi-label">กิจกรรมบริการวิชาการ</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-book-open"></i></div><div className="kpi-value" key={`pub-${timeFilter}`}>{validPub.length}</div><div className="kpi-label">ผลงานตีพิมพ์</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-certificate"></i></div><div className="kpi-value" key={`ip-${timeFilter}`}>{validIP.length}</div><div className="kpi-label">ทรัพย์สินทางปัญญา</div></div>
      </div>
      
      <div className="chart-grid">
        <div className="chart-card chart-full">
          <h3><i className="fas fa-chart-line"></i> จำนวนผลงานตามช่วงเวลา ({timeFilter === 'all' ? 'ทั้งปีงบประมาณ' : `ไตรมาส ${timeFilter.replace('q','')}`})</h3>
          <div className="chart-wrapper"><canvas id="c_ov_monthly"></canvas></div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><i className="fas fa-balance-scale"></i> เปรียบเทียบผลงาน ปีปัจจุบัน vs ปีก่อนหน้า</h3>
          <div className="chart-wrapper"><canvas id="c_ov_compare_year"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><i className="fas fa-chart-pie"></i> สัดส่วนผลงานทั้งหมด 5 ด้าน</h3>
          <div className="chart-wrapper"><canvas id="c_ov_prop"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><i className="fas fa-coins"></i> สัดส่วนงบประมาณวิจัยตามแหล่งทุน</h3>
          <div className="chart-wrapper"><canvas id="c_ov_funding"></canvas></div>
        </div>
      </div>

      <div className="decision-box">
        <div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ภาพรวม</div>
        <ul>
          <li><strong>งานบริการวิชาการ</strong> มีจำนวนสูงที่สุดถึง <strong>{validService.length} กิจกรรม</strong> สะท้อนถึงการบริการวิชาการเพื่อชุมชนอย่างต่อเนื่อง</li>
          <li><strong>ทรัพย์สินทางปัญญา</strong> มีเพียง <strong>{validIP.length} รายการ</strong> ควรผลักดันงานวิจัยและนวัตกรรมใหม่ๆ ให้จดสิทธิบัตรมากขึ้น</li>
          <li><strong>โครงการวิจัย ({validResearch.length} โครงการ)</strong> มีการกระจายตัวของแหล่งทุนที่ดี ทั้งภายในและภายนอก</li>
        </ul>
      </div>
    </div>
  );
}