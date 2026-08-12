"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function ResearchTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_RES = "#006838";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
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

    createChart("c_re_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: [2, 0, 3, 3, 1], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: [14.6, 0, 17.7, 16.36, 18.0], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_dept", { type: "bar", data: { labels: ["ชลประทาน", "โยธา", "เครื่องกล", "อุตสาหการ", "การอาหาร"], datasets: [{ label: "ล้านบาท", data: [57.53, 0.6, 1.63, 0.04, 6.86], backgroundColor: C_RES, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_re_fund", { type: "doughnut", data: { labels: ["วช.", "สวก.", "บพข.", "ทุนคณะฯ", "เร่งรัดฯ"], datasets: [{ data: [23085000, 9478000, 18000200, 40000, 16050200], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } });
    createChart("c_re_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ", "SDG 2\nอาหาร", "SDG 8\nเศรษฐกิจ", "SDG 11\nเมืองยั่งยืน", "SDG 12\nบริโภคยั่งยืน"], datasets: [{ label: "จำนวนโครงการ", data: [4, 5, 3, 2, 1, 1, 1], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942", "#fd9d24", "#bf8b2e"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_re_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13", "SDG 2", "SDG 8", "SDG 11", "SDG 12"], datasets: [{ label: "ล้านบาท", data: [50.39, 16.27, 43.53, 6.88, 1.63, 0.6, 0.02], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942", "#fd9d24", "#bf8b2e"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

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
              if(t.includes('฿') && t.includes('M')) {
                el.textContent = `฿${(cur/10).toFixed(1)}M`;
              } else {
                el.textContent = cur.toLocaleString();
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
  );
}