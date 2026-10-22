"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  FaBookOpen,
  FaTrophy,
  FaMedal,
  FaAward,
  FaEdit,
  FaChartBar,
  FaChartLine,
  FaTable,
  FaChartPie,
  FaGlobe,
  FaLightbulb,
  FaSearch,
} from "react-icons/fa";

// 1. นำเข้าข้อมูล JSON
import pubData from "../data/publications.json";
import { getCachedCategoryData } from "../lib/dataService";
import { TimeFilterState, itemMatchesTimeFilter } from "../types/timeFilter";

export default function PublicationsTab({ timeFilter }: { timeFilter?: TimeFilterState }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [dataList, setDataList] = useState<any[]>(() => getCachedCategoryData('publications') || pubData);
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('publications');
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  // กรองข้อมูลขยะออก และกรองตามช่วงเวลา
  const validData = dataList
    .filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    .filter((item: any) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));

  useEffect(() => {
    chartInstances.current.forEach((chart) => chart.destroy());
    chartInstances.current = [];

    Chart.register(ChartDataLabels);
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#0f172a";

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

    // กราฟ 1: จำนวนผลงานตีพิมพ์รายเดือน (คงไว้เป็น Bar แบบ Stacked เพราะดูง่ายกว่า)
    createChart("c_pub_monthly", { 
      type: "bar", 
      data: { 
        labels: M, 
        datasets: [
          { label: "Q1", data: [3, 0, 4, 5, 4], backgroundColor: UI_PALETTE[0], borderRadius: 4 }, 
          { label: "Q2", data: [3, 0, 2, 4, 1], backgroundColor: UI_PALETTE[1], borderRadius: 4 }, 
          { label: "TCI", data: [2, 0, 1, 2, 0], backgroundColor: UI_PALETTE[2], borderRadius: 4 }, 
          { label: "เตรียมตีพิมพ์", data: [8, 0, 3, 2, 6], backgroundColor: UI_PALETTE[3], borderRadius: 4 }
        ] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { datalabels: stackedDatalabels as any, legend: { position: "bottom", labels: { padding: 10 } } }, 
        scales: { y: { beginAtZero: true, grace: "20%", stacked: true, title: { display: true, text: "จำนวน" } }, x: { stacked: true } } 
      } 
    });

    // กราฟ 2: เงินสนับสนุนรายเดือน (เปลี่ยนเป็นกราฟเส้น)
    createChart("c_pub_bud", { 
      type: "line", 
      data: { 
        labels: M, 
        datasets: [{ 
          label: "เงินสนับสนุน (บาท)", 
          data: [54133, 0, 87666, 150714, 44047], 
          borderColor: C_PUB, 
          backgroundColor: "rgba(142, 36, 170, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C_PUB,
          pointRadius: 5,
          pointHoverRadius: 7
        }] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
          legend: { display: false }, 
          tooltip: { callbacks: { label: (c: any) => "฿" + c.raw.toLocaleString() } },
          datalabels: { align: 'top', anchor: 'end', color: C_PUB, font: { weight: 'bold' }, formatter: (v: any) => v > 0 ? v.toLocaleString() : "" }
        }, 
        scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "บาท" } } } 
      } 
    });

    createChart("c_pub_level", { type: "pie", data: { labels: ["Q1", "Q2", "TCI1", "เตรียมตีพิมพ์"], datasets: [{ data: [22, 14, 10, 15], backgroundColor: UI_PALETTE.slice(0, 4) }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } } } } });
    createChart("c_pub_dept", { type: "bar", data: { labels: ["ชลประทาน", "โยธา", "เกษตร", "อุตสาหการ", "เครื่องกล", "การอาหาร", "คอมพิวเตอร์"], datasets: [{ label: "จำนวนผลงาน", data: [16, 12, 10, 8, 6, 5, 4], backgroundColor: C_PUB, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    createChart("c_pub_sdg", { type: "bar", data: { labels: ["SDG 9\nนวัตกรรม", "SDG 2\nอาหาร", "SDG 6\nน้ำสะอาด", "SDG 11\nเมืองยั่งยืน", "SDG 13\nสภาพภูมิอากาศ", "SDG 12\nบริโภคยั่งยืน", "SDG 15\nระบบนิเวศบก"], datasets: [{ label: "จำนวนผลงาน", data: [22, 12, 10, 8, 5, 3, 1], backgroundColor: ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#bf8b2e", "#56c02b"], borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "จำนวน" } } } } });
    
    // ==========================================
    // Diverging Bar Chart: เปรียบเทียบผลงานทั้งหมด และ Q1 ตาม SDGs (ปรับสมดุล)
    // ==========================================
    const sdgLabels = ["SDG 9", "SDG 2", "SDG 6", "SDG 11", "SDG 13", "SDG 12", "SDG 15"];
    const sdgColors = ["#fd6925", "#dda63a", "#26bde2", "#fd9d24", "#3f7e44", "#bf8b2e", "#56c02b"];
    const rawQ1 = [10, 5, 4, 4, 3, 0, 1]; // ข้อมูลจำลองจำนวน Q1
    const rawTotal = [22, 12, 10, 8, 5, 3, 1]; // ข้อมูลจำลองจำนวนทั้งหมด

    // คำนวณ Scale Ratio เพื่อให้กราฟซ้าย-ขวากางออกอย่างสมดุล (ไม่ให้ฝั่งใดฝั่งหนึ่งหดสั้นเกินไป)
    const maxTotal = Math.max(...rawTotal);
    const maxQ1 = Math.max(...rawQ1);
    const scaleRatio = maxTotal / (maxQ1 === 0 ? 1 : maxQ1);
    const scaledQ1Data = rawQ1.map(v => -(v * scaleRatio));

    createChart("c_pub_sdg_q1", {
      type: "bar",
      data: {
        labels: sdgLabels,
        datasets: [
          {
            label: "จำนวน Q1",
            data: scaledQ1Data, // ฝั่งซ้าย (ติดลบ + ปรับสเกล)
            backgroundColor: sdgColors,
            borderRadius: 4,
            barPercentage: 0.7
          },
          {
            label: "จำนวนผลงานทั้งหมด",
            data: rawTotal, // ฝั่งขวา (บวก)
            backgroundColor: sdgColors,
            borderRadius: 4,
            barPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                if (c.datasetIndex === 0) return "จำนวน Q1: " + rawQ1[c.dataIndex] + " ผลงาน";
                return "จำนวนทั้งหมด: " + rawTotal[c.dataIndex] + " ผลงาน";
              }
            }
          },
          datalabels: {
            color: "#424242",
            font: { weight: "bold", size: 11 },
            anchor: (c: any) => c.datasetIndex === 0 ? "start" : "end",
            align: (c: any) => c.datasetIndex === 0 ? "left" : "right",
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 0) return rawQ1[c.dataIndex] > 0 ? rawQ1[c.dataIndex] : "";
              return rawTotal[c.dataIndex] > 0 ? rawTotal[c.dataIndex] : "";
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: { display: false }, // ซ่อนแกน x เพราะโชว์ตัวเลขที่แท่งกราฟแล้ว
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: "← จำนวน Q1 | จำนวนผลงานทั้งหมด →", font: { weight: "bold" }, padding: 10 }
          },
          y: {
            stacked: true,
            ticks: { font: { weight: "bold" } }
          }
        }
      }
    });

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
  }, [timeFilter]);

  const q1Count = validData.filter((d: any) => String(d.level || '').toUpperCase().includes('Q1')).length;
  const q2Count = validData.filter((d: any) => String(d.level || '').toUpperCase().includes('Q2')).length;
  const tciCount = validData.filter((d: any) => String(d.level || '').toUpperCase().includes('TCI')).length;
  const otherCount = Math.max(0, validData.length - q1Count - q2Count - tciCount);

  const filteredData = useMemo(() => {
    return validData.filter((item: any) => {
      if (levelFilter !== 'all') {
        const lvl = String(item.level || '').toUpperCase();
        if (!lvl.includes(levelFilter.toUpperCase())) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const o = String(item.owner || '').toLowerCase();
        const d = String(item.department || '').toLowerCase();
        if (!n.includes(q) && !o.includes(q) && !d.includes(q)) return false;
      }
      return true;
    });
  }, [validData, levelFilter, searchTerm]);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><FaBookOpen /></div>
          <div className="kpi-value">{validData.length}</div>
          <div className="kpi-label">ผลงานทั้งหมด</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaTrophy /></div>
          <div className="kpi-value">{q1Count}</div>
          <div className="kpi-label">ระดับ Scopus Q1</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaMedal /></div>
          <div className="kpi-value">{q2Count}</div>
          <div className="kpi-label">ระดับ Scopus Q2</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaAward /></div>
          <div className="kpi-value">{tciCount}</div>
          <div className="kpi-label">ระดับ TCI</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaEdit /></div>
          <div className="kpi-value">{otherCount}</div>
          <div className="kpi-label">ระดับอื่น ๆ / เตรียมการ</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> จำนวนผลงานตีพิมพ์ทางวิชาการรายเดือน (แยกระดับ)</h3>
          <div className="chart-wrapper"><canvas id="c_pub_monthly"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartLine style={{ color: '#00914d' }} /> เงินสนับสนุนรายเดือน (บาท)</h3>
          <div className="chart-wrapper"><canvas id="c_pub_bud"></canvas></div>
        </div>
      </div>
      
      {/* Table Section with Filter */}
      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>
            <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดผลงานตีพิมพ์ทางวิชาการ ({filteredData.length} เรื่อง)
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }}>
              <FaSearch style={{ color: '#94a3b8', marginRight: '6px' }} />
              <input
                type="text"
                placeholder="ค้นหาชื่อเรื่อง, ผู้ประพันธ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '160px', fontFamily: 'inherit' }}
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
            >
              <option value="all">ทุกระดับวารสาร</option>
              <option value="Q1">Scopus Q1</option>
              <option value="Q2">Scopus Q2</option>
              <option value="TCI">ระดับ TCI</option>
            </select>
          </div>
        </div>

        <div className="table-scroll" style={{ maxHeight: "380px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th>ชื่อผลงาน</th>
                <th>เจ้าของผลงาน</th>
                <th>ภาควิชา</th>
                <th>ประเภท</th>
                <th>ระดับ</th>
                <th style={{ textAlign: 'right' }}>เงินสนับสนุน</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any, index: number) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ whiteSpace: "normal", minWidth: "300px" }}>{item.name}</td>
                  <td>{item.owner !== "nan" ? item.owner : "-"}</td>
                  <td>{item.department !== "nan" ? item.department : "-"}</td>
                  <td>{item.type !== "nan" ? item.type : "-"}</td>
                  <td>
                    <span className={`badge ${String(item.level).includes('Q1') ? 'badge-q1' : 'badge-q2'}`}>
                      {item.level !== "nan" ? item.level : "-"}
                    </span>
                  </td>
                  <td className="budget-cell">{(item.budget || 0).toLocaleString()} ฿</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><FaChartPie style={{ color: '#00914d' }} /> สัดส่วนผลงานตามระดับ</h3>
          <div className="chart-wrapper"><canvas id="c_pub_level"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> จำนวนผลงานตามภาควิชา</h3>
          <div className="chart-wrapper"><canvas id="c_pub_dept"></canvas></div>
        </div>
        <div className="chart-card" style={{ gridColumn: "span 2" }}>
          <h3><FaGlobe style={{ color: '#00914d' }} /> เปรียบเทียบจำนวนผลงานทั้งหมดและ Q1 ตาม SDGs</h3>
          <div className="chart-wrapper"><canvas id="c_pub_sdg_q1"></canvas></div>
        </div>
      </div>

      <div className="decision-box">
        <div className="decision-header">
          <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — ผลงานตีพิมพ์ทางวิชาการ
        </div>
        <ul>
          <li><strong>SDG 9 (นวัตกรรม)</strong> มีผลงานตีพิมพ์มากที่สุด โดยเฉพาะด้านวัสดุก่อสร้างและ Machine Learning</li>
          <li><strong>SDG 2 (อาหาร/เกษตร)</strong> มีผลงาน Q1 สูง จากงานวิจัยด้าน Postharvest และ NIR spectroscopy</li>
          <li><strong>SDG 6 (น้ำ)</strong> มีผลงานตีพิมพ์อย่างต่อเนื่อง เป็นจุดแข็งของคณะ</li>
          <li>ควรเพิ่มผลงานด้าน <strong>SDG 7 (พลังงาน)</strong> และ <strong>SDG 3 (สุขภาพ)</strong> เพื่อความหลากหลาย</li>
        </ul>
      </div>
    </div>
  );
}