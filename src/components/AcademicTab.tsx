"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function AcademicTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_ACA = "#1565c0";
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

    createChart("c_ac_cnt", { type: "bar", data: { labels: M, datasets: [{ label: "จำนวนโครงการ", data: [6, 5, 8, 2, 0], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_bud", { type: "bar", data: { labels: M, datasets: [{ label: "ล้านบาท", data: [67.27, 58.75, 40.18, 8.04, 0], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_ac_alloc", { type: "doughnut", data: { labels: ["โครงการ (70%)", "ค่าอำนวยการ (15%)", "คณะ (5%)", "ภาควิชา (5%)", "มก. (5%)"], datasets: [{ data: [70, 15, 5, 5, 5], backgroundColor: UI_PALETTE.slice(0, 5) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_ac_client", { type: "bar", data: { labels: ["กรมชลประทาน", "กรมทรัพยากรน้ำ", "กรมทางหลวง", "อายิโนะโมะโต๊ะ", "กรมโรงงาน"], datasets: [{ label: "ล้านบาท", data: [88.8, 24.86, 19.6, 7.54, 8.5], backgroundColor: C_ACA, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });
    createChart("c_ac_sdg", { type: "bar", data: { labels: ["SDG 6\nน้ำสะอาด", "SDG 9\nนวัตกรรม", "SDG 13\nสภาพภูมิอากาศ", "SDG 11\nเมืองยั่งยืน", "SDG 8\nเศรษฐกิจ", "SDG 7\nพลังงาน", "SDG 2\nอาหาร", "SDG 14\nทะเล"], datasets: [{ label: "จำนวนโครงการ", data: [9, 7, 2, 2, 1, 1, 1, 1], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#fd9d24", "#a21942", "#fcc30b", "#dda63a", "#0a97d9"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } } });
    createChart("c_ac_sdg_bud", { type: "bar", data: { labels: ["SDG 6", "SDG 9", "SDG 13", "SDG 11", "SDG 8", "SDG 7", "SDG 2", "SDG 14"], datasets: [{ label: "ล้านบาท", data: [97.28, 75.89, 15.94, 43.60, 8.50, 1.36, 7.54, 0.48], backgroundColor: ["#26bde2", "#fd6925", "#3f7e44", "#fd9d24", "#a21942", "#fcc30b", "#dda63a", "#0a97d9"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } });

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
  );
}