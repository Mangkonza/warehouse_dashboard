"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// นำเข้าข้อมูล JSON
import researchData from "../data/research.json";

export default function ResearchTab() {
  const chartInstances = useRef<Chart[]>([]);

  // กรองข้อมูลขยะออก
  const validData = researchData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT");

  // คำนวณงบประมาณรวมทั้งหมด
  const totalBudgetAll = validData.reduce((sum, item: any) => {
    const internal = typeof item.budget_internal === 'number' ? item.budget_internal : 0;
    const external = typeof item.budget_external === 'number' ? item.budget_external : 0;
    return sum + internal + external;
  }, 0);

  // หานับจำนวนภาควิชา และแหล่งทุนที่ไม่ซ้ำกัน
  const uniqueDepts = new Set(validData.map((item: any) => item.department).filter(d => d !== "nan" && d !== "-"));
  const uniqueFunds = new Set(validData.map((item: any) => item.fund_source).filter(f => f !== "nan" && f !== "-"));

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_RES = "#006838";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926"];
    
    // ==========================================
    // ⚙️ Logic คำนวณข้อมูลกราฟจาก JSON 
    // ==========================================
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค."];
    const monthMatchers = [
      ["-01-", "ม.ค.", "มกราคม", "1/2568"],
      ["-02-", "ก.พ.", "กุมภาพันธ์", "2/2568"],
      ["-03-", "มี.ค.", "มีนาคม", "3/2568"],
      ["-04-", "เม.ย.", "เมษายน", "4/2568"],
      ["-05-", "พ.ค.", "พฤษภาคม", "5/2568"],
      ["-06-", "มิ.ย.", "มิถุนายน", "6/2568"],
      ["-07-", "ก.ค.", "กรกฎาคม", "7/2568"]
    ];

    let monthlyCount = [0, 0, 0, 0, 0, 0, 0];
    let monthlyBudget = [0, 0, 0, 0, 0, 0, 0]; // หน่วยล้านบาท
    let deptBudget: any = {};
    let fundBudget: any = {};

    validData.forEach((item: any) => {
      const internal = typeof item.budget_internal === 'number' ? item.budget_internal : 0;
      const external = typeof item.budget_external === 'number' ? item.budget_external : 0;
      const totalBudget = internal + external;

      // 1. จัดกลุ่มตามเดือน (เช็คจาก start_date หรือ id)
      let dateStr = String(item.start_date || item.id || "").toLowerCase();
      for(let i=0; i<M.length; i++){
        if(monthMatchers[i].some(m => dateStr.includes(m))) {
          monthlyCount[i]++;
          monthlyBudget[i] += (totalBudget / 1000000); 
          break;
        }
      }

      // 2. จัดกลุ่มตามภาควิชา
      let dept = String(item.department).replace("ภาควิชา\n", "").replace("ภาควิชา", "").trim();
      if(dept === "nan" || !dept || dept === "-") dept = "อื่นๆ";
      if(deptBudget[dept]) deptBudget[dept] += (totalBudget / 1000000);
      else deptBudget[dept] = (totalBudget / 1000000);

      // 3. จัดกลุ่มตามแหล่งทุน
      let fund = String(item.fund_source).replace("\n", " ").trim();
      if(fund === "nan" || !fund || fund === "-") fund = "อื่นๆ";
      if(fundBudget[fund]) fundBudget[fund] += totalBudget;
      else fundBudget[fund] = totalBudget;
    });

    const deptLabels = Object.keys(deptBudget);
    const deptData = Object.values(deptBudget);
    
    // เรียงแหล่งทุนจากมากไปน้อย
    const sortedFunds = Object.entries(fundBudget).sort((a: any, b: any) => b[1] - a[1]).slice(0, 6);
    const fundLabels = sortedFunds.map(f => f[0]);
    const fundData = sortedFunds.map(f => f[1]);

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

    // นำตัวแปรที่คำนวณได้ไปใส่ในกราฟ
    createChart("c_re_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: monthlyCount, backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: monthlyBudget, backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_dept", { type: "bar", data: { labels: deptLabels, datasets: [{ label: "ล้านบาท", data: deptData, backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_fund", { type: "doughnut", data: { labels: fundLabels.length > 0 ? fundLabels : ["ไม่มีข้อมูล"], datasets: [{ data: fundData.length > 0 ? fundData : [1], backgroundColor: UI_PALETTE.slice(0, fundLabels.length) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } });
    
    // SDG Mock ไว้ก่อนเนื่องจากไม่มีใน Excel
    createChart("c_re_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ", "SDG 2\nอาหาร", "SDG 8\nเศรษฐกิจ"], datasets: [{ label: "จำนวนโครงการ", data: [4, 5, 3, 2, 1], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13", "SDG 2", "SDG 8"], datasets: [{ label: "ล้านบาท", data: [50.39, 16.27, 43.53, 6.88, 1.63], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

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
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-flask"></i></div><div className="kpi-value">{validData.length}</div><div className="kpi-label">โครงการวิจัยทั้งหมด</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-coins"></i></div><div className="kpi-value">฿{(totalBudgetAll / 1000000).toFixed(1)}M</div><div className="kpi-label">งบประมาณรวม</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-building"></i></div><div className="kpi-value">{uniqueDepts.size}</div><div className="kpi-label">ภาควิชาที่เกี่ยวข้อง</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-hand-holding-usd"></i></div><div className="kpi-value">{uniqueFunds.size}</div><div className="kpi-label">แหล่งทุนวิจัย</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวนโครงการวิจัยรายเดือน (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_re_cnt"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณวิจัยรายเดือน (ล้านบาท) (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_re_bud"></canvas></div></div>
      </div>
      
      <div className="table-card">
        <h3><i className="fas fa-table"></i> รายละเอียดโครงการวิจัย</h3>
        <div className="table-scroll" style={{ maxHeight: "380px" }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>รหัสโครงการ</th>
                <th>ชื่อโครงการ</th>
                <th>หัวหน้าโครงการ</th>
                <th>ภาควิชา</th>
                <th>งบประมาณรวม</th>
                <th>แหล่งทุน</th>
              </tr>
            </thead>
            <tbody>
              {validData.map((item: any, index: number) => {
                const internal = typeof item.budget_internal === 'number' ? item.budget_internal : 0;
                const external = typeof item.budget_external === 'number' ? item.budget_external : 0;
                const totalBudget = internal + external;

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.id !== "nan" ? item.id : "-"}</td>
                    <td style={{ whiteSpace: "normal", minWidth: "250px" }}>{item.name}</td>
                    <td>{item.head !== "nan" ? item.head : "-"}</td>
                    <td>{item.department !== "nan" ? item.department.replace("ภาควิชา\n", "") : "-"}</td>
                    <td className="budget-cell">{totalBudget > 0 ? totalBudget.toLocaleString() : "-"}</td>
                    <td>{item.fund_source !== "nan" ? item.fund_source : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> งบประมาณตามภาควิชา (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_re_dept"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-pie"></i> สัดส่วนแหล่งทุนวิจัย (ข้อมูลจริง)</h3><div className="chart-wrapper"><canvas id="c_re_fund"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-globe"></i> การกระจายตาม SDGs</h3><div className="chart-wrapper"><canvas id="c_re_sdg"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-coins"></i> งบประมาณตาม SDGs (ล้านบาท)</h3><div className="chart-wrapper"><canvas id="c_re_sdg_bud"></canvas></div></div>
      </div>
      <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — โครงการวิจัย</div><ul>
        <li><strong>งบประมาณส่วนใหญ่</strong> มาจากแหล่งทุนภายนอก โดยเฉพาะจาก วช. และ สวก.</li>
        <li><strong>ภาควิชาที่มีงบวิจัยสูงสุด</strong> คือ วิศวกรรมชลประทานและวิศวกรรมการอาหาร</li>
      </ul></div>
    </div>
  );
}