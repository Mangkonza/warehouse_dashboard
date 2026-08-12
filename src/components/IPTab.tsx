"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// 1. นำเข้าข้อมูล JSON
import ipData from "../data/ip.json";

export default function IPTab() {
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Sarabun','Inter',sans-serif";
    Chart.defaults.font.size = 12;

    const C_RES = "#006838";
    const C_PUB = "#8e24aa";
    const C_IP = "#d81b60";
    const M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."];

    const createChart = (id: string, config: any) => {
      const canvas = document.getElementById(id) as HTMLCanvasElement;
      if (canvas) {
        const newChart = new Chart(canvas, config as any);
        chartInstances.current.push(newChart);
      }
    };

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
              if(t.includes('฿')) {
                el.textContent = `฿${cur.toLocaleString()}`;
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

  // นับจำนวนรายการจริงๆ (ตัดแถวที่ชื่อ NaT หรือ ชื่อ เรื่อง ออก)
  const validIpData = ipData.filter(item => item.name !== "NaT" && item.name !== "เรื่อง");

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-file-alt"></i></div><div className="kpi-value">{validIpData.length}</div><div className="kpi-label">จำนวนทรัพย์สินทางปัญญา (รวม)</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-scroll"></i></div><div className="kpi-value">0</div><div className="kpi-label">สิทธิบัตร</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-money-bill-wave"></i></div><div className="kpi-value">฿20,000</div><div className="kpi-label">เงินสนับสนุน</div></div>
        <div className="kpi-card"><div className="kpi-icon"><i className="fas fa-building"></i></div><div className="kpi-value">1</div><div className="kpi-label">ภาควิชาที่มี IP</div></div>
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> จำนวน IP รายเดือน</h3><div className="chart-wrapper"><canvas id="c_ip_monthly"></canvas></div></div>
        <div className="chart-card"><h3><i className="fas fa-chart-bar"></i> เปรียบเทียบ IP vs วิจัย vs ตีพิมพ์</h3><div className="chart-wrapper"><canvas id="c_ip_compare"></canvas></div></div>
      </div>
      
      {/* ส่วนตารางที่ดึงข้อมูลจาก JSON */}
      <div className="table-card">
        <h3><i className="fas fa-table"></i> รายการทรัพย์สินทางปัญญา</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>เรื่อง</th>
                <th>ผู้ประดิษฐ์</th>
                <th>ภาควิชา</th>
                <th>ประเภท</th>
                <th>เลขที่คำขอ/วันที่ยื่น</th>
                <th>สถานะ/วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              {validIpData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ whiteSpace: "normal", minWidth: "200px" }}>{item.name}</td>
                  <td>{item.creator !== "nan" ? item.creator : "-"}</td>
                  <td>{item.department !== "nan" ? item.department : "-"}</td>
                  <td>{item.type !== "nan" ? item.type : "-"}</td>
                  <td>{item.req_no !== "nan" ? item.req_no.substring(0,10) : "-"}</td>
                  <td>{item.status !== "nan" ? item.status : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="decision-box"><div className="decision-header"><i className="fas fa-lightbulb"></i> ข้อมูลสนับสนุนการตัดสินใจ — ทรัพย์สินทางปัญญา</div><ul>
        <li>IP มี<strong>เพียง 2 รายการ</strong> ต่ำมากเทียบกับ 10 โครงการวิจัยและ 61 ผลงานตีพิมพ์</li>
        <li>ทั้ง 2 รายการมาจาก<strong>ภาควิชาวิศวกรรมเกษตรเท่านั้น</strong> ควรขยายไปภาควิชาอื่น</li>
        <li>ควรสร้าง<strong>กลไกสนับสนุนการยื่นจดสิทธิบัตร</strong>จากผลงานวิจัย</li>
        <li>โครงการเทคโนโลยี เช่น LiDAR, ระบบน้ำอัตโนมัติ ควรมีเป้าหมาย<strong>จดสิทธิบัตร</strong></li>
      </ul></div>
    </div>
  );
}