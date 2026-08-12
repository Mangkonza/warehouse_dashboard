"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function PublicationsTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_PUB = "#8e24aa";
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

    createChart("c_pub_monthly", { type: "bar", data: { labels: M, datasets: [{ label: "Q1", data: [3, 0, 4, 5, 4], backgroundColor: UI_PALETTE[0], borderRadius: 4 }, { label: "Q2", data: [3, 0, 2, 4, 1], backgroundColor: UI_PALETTE[1], borderRadius: 4 }, { label: "TCI", data: [2, 0, 1, 2, 0], backgroundColor: UI_PALETTE[2], borderRadius: 4 }, { label: "เตรียมตีพิมพ์", data: [8, 0, 3, 2, 6], backgroundColor: UI_PALETTE[3], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: stackedDatalabels as any, legend: { position: "bottom", labels: { padding: 10 } } }, scales: { y: { beginAtZero: true, grace: "20%", stacked: true, title: { display: true, text: "จำนวน" } }, x: { stacked: true } } } });
    createChart("c_pub_bud", { type: "bar", data: { labels: M, datasets: [{ label: "เงินสนับสนุน (บาท)", data: [54133, 0, 87666, 150714, 44047], backgroundColor: C_PUB, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => "฿" + c.raw.toLocaleString() } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "บาท" } } } } });
    createChart("c_pub_level", { type: "pie", data: { labels: ["Q1", "Q2", "TCI1", "เตรียมตีพิมพ์"], datasets: [{ data: [22, 14, 10, 15], backgroundColor: UI_PALETTE.slice(0, 4) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_pub_dept", { type: "bar", data: { labels: ["ชลประทาน", "โยธา", "เกษตร", "อุตสาหการ", "เครื่องกล", "การอาหาร", "คอมพิวเตอร์"], datasets: [{ label: "จำนวนผลงาน", data: [16, 12, 10, 8, 6, 5, 4], backgroundColor: C_PUB, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_pub_sdg", { type: "bar", data: { labels: ["SDG 9\nนวัตกรรม", "SDG 2\nอาหาร", "SDG 6\nน้ำสะอาด", "SDG 11\nเมืองยั่งยืน", "SDG 13\nสภาพภูมิอากาศ", "SDG 12\nบริโภคยั่งยืน", "SDG 15\nระบบนิเวศบก"], datasets: [{ label: "จำนวนผลงาน", data: [22, 12, 10, 8, 5, 3, 1], backgroundColor: ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#bf8b2e", "#56c02b"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_pub_sdg_q1", { type: "bar", data: { labels: ["SDG 9", "SDG 2", "SDG 6", "SDG 11", "SDG 13", "SDG 15"], datasets: [{ label: "จำนวน Q1", data: [10, 5, 4, 4, 3, 1], backgroundColor: ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#56c02b"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนผลงาน Q1" } } } } });

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
  );
}