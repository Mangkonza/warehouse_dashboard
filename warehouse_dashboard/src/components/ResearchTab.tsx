"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  FaFlask,
  FaCoins,
  FaBuilding,
  FaHandHoldingUsd,
  FaChartLine,
  FaTable,
  FaChartBar,
  FaChartPie,
  FaGlobe,
  FaLightbulb,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

// นำเข้าข้อมูล JSON
import researchData from "../data/research.json";
import { getCachedCategoryData } from "../lib/dataService";
import { TimeFilterState, itemMatchesTimeFilter } from "../types/timeFilter";

export default function ResearchTab({ timeFilter }: { timeFilter?: TimeFilterState }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [dataList, setDataList] = useState<any[]>(() => getCachedCategoryData('research') || researchData);
  const chartInstances = useRef<Chart[]>([]);

  useEffect(() => {
    const handleUpdate = () => {
      const fresh = getCachedCategoryData('research');
      if (fresh && fresh.length > 0) setDataList(fresh);
    };
    window.addEventListener('ku_data_updated', handleUpdate);
    return () => window.removeEventListener('ku_data_updated', handleUpdate);
  }, []);

  // กรองข้อมูลขยะออก และกรองตามช่วงเวลา
  const validData = dataList
    .filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    .filter((item: any) => !timeFilter || itemMatchesTimeFilter(item, timeFilter));

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
    Chart.defaults.font.family = "'Kanit', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = "#0f172a";

    const C_RES = "#006838";
    const UI_PALETTE = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926"];
    
    // ==========================================
    // Logic คำนวณข้อมูลกราฟจาก JSON 
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

    // 1. กราฟเส้น: จำนวนโครงการวิจัยรายเดือน
    createChart("c_re_cnt", { 
      type: "line", 
      data: { 
        labels: M, 
        datasets: [{ 
          label: "จำนวนโครงการ", 
          data: monthlyCount, 
          borderColor: C_RES,
          backgroundColor: "rgba(0, 104, 56, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C_RES,
          pointRadius: 5,
          pointHoverRadius: 7
        }] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, datalabels: { align: 'top', anchor: 'end', color: C_RES, font: { weight: 'bold' } } }, 
        scales: { y: { beginAtZero: true, grace: "20%", ticks: { stepSize: 1 }, title: { display: true, text: "จำนวนโครงการ" } } } 
      } 
    });

    // 2. กราฟเส้น: งบประมาณวิจัยรายเดือน (ล้านบาท)
    createChart("c_re_bud", { 
      type: "line", 
      data: { 
        labels: M, 
        datasets: [{ 
          label: "ล้านบาท", 
          data: monthlyBudget, 
          borderColor: C_RES,
          backgroundColor: "rgba(0, 104, 56, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: C_RES,
          pointRadius: 5,
          pointHoverRadius: 7
        }] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } }, datalabels: { align: 'top', anchor: 'end', color: C_RES, font: { weight: 'bold' }, formatter: (v: any) => v > 0 ? v.toFixed(1) : "" } }, 
        scales: { y: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } 
      } 
    });

    // 3. กราฟแท่ง: งบประมาณตามภาควิชา
    createChart("c_re_dept", { 
      type: "bar", 
      data: { labels: deptLabels, datasets: [{ label: "ล้านบาท", data: deptData, backgroundColor: C_RES, borderRadius: 8 }] }, 
      options: { responsive: true, maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c: any) => c.raw.toFixed(2) + " ล้านบาท" } } }, scales: { x: { beginAtZero: true, grace: "20%", title: { display: true, text: "ล้านบาท" } } } } 
    });

    // 4. กราฟพาย: สัดส่วนแหล่งทุนวิจัย
    createChart("c_re_fund", { 
      type: "doughnut", 
      data: { labels: fundLabels.length > 0 ? fundLabels : ["ไม่มีข้อมูล"], datasets: [{ data: fundData.length > 0 ? fundData : [1], backgroundColor: UI_PALETTE.slice(0, fundLabels.length) }] }, 
      options: { responsive: true, maintainAspectRatio: false, plugins: { datalabels: pieDatalabels as any, legend: { position: "bottom", labels: { padding: 8 } }, tooltip: { callbacks: { label: (c: any) => c.label + ": ฿" + c.raw.toLocaleString() } } } } 
    });
    
    // 5. Diverging Bar Chart: การกระจายและงบประมาณตาม SDGs
    const sdgLabels = ["SDG 6 น้ำสะอาด", "SDG 9 นวัตกรรม", "SDG 13 สภาพภูมิอากาศ", "SDG 2 อาหาร", "SDG 8 เศรษฐกิจ"];
    const sdgColors = ["#26bde2", "#fd6925", "#3f7e44", "#dda63a", "#a21942"];
    const rawSDGCount = [4, 5, 3, 2, 1]; // จำลองจำนวนโครงการ
    const rawSDGBudget = [50.39, 16.27, 43.53, 6.88, 1.63]; // จำลองงบประมาณ
    
    // คำนวณ Scale Ratio เพื่อให้กราฟซ้าย-ขวากางออกอย่างสมดุล (ไม่เบี้ยวข้างใดข้างหนึ่ง)
    const maxBudget = Math.max(...rawSDGBudget);
    const maxCount = Math.max(...rawSDGCount);
    const scaleRatio = maxBudget / maxCount;
    const scaledCountData = rawSDGCount.map(v => -(v * scaleRatio));

    createChart("c_re_sdg_combined", { 
      type: "bar", 
      data: { 
        labels: sdgLabels, 
        datasets: [
          { 
            label: "จำนวนโครงการ", 
            data: scaledCountData, 
            backgroundColor: sdgColors, 
            borderRadius: 4,
            barPercentage: 0.7
          },
          { 
            label: "งบประมาณ (ล้านบาท)", 
            data: rawSDGBudget, 
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
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c: any) => {
                if (c.datasetIndex === 0) return "จำนวนโครงการ: " + rawSDGCount[c.dataIndex] + " โครงการ";
                return "งบประมาณ: " + c.raw.toFixed(2) + " ล้านบาท";
              }
            }
          },
          datalabels: {
            color: "#424242",
            font: { weight: "bold", size: 11 },
            anchor: (c: any) => c.datasetIndex === 0 ? "start" : "end",
            align: (c: any) => c.datasetIndex === 0 ? "left" : "right",
            formatter: (value: any, c: any) => {
              if (c.datasetIndex === 0) return rawSDGCount[c.dataIndex] + " โครงการ";
              return rawSDGBudget[c.dataIndex].toFixed(2) + " ลบ.";
            }
          }
        }, 
        scales: { 
          x: { 
            stacked: true,
            ticks: { display: false }, // ซ่อนแกน x เพื่อความสะอาดตา เพราะเราโชว์ตัวเลขที่ Datalabels แล้ว
            grid: { drawBorder: false, drawTicks: false },
            title: { display: true, text: "← จำนวนโครงการ | งบประมาณ (ล้านบาท) →", font: { weight: "bold" }, padding: 10 }
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
  }, [timeFilter]);

  const filteredData = useMemo(() => {
    return validData.filter((item: any) => {
      if (selectedDept !== 'all') {
        const d = String(item.department || '');
        if (!d.includes(selectedDept)) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const n = String(item.name || '').toLowerCase();
        const h = String(item.head || '').toLowerCase();
        const id = String(item.id || '').toLowerCase();
        if (!n.includes(q) && !h.includes(q) && !id.includes(q)) return false;
      }
      return true;
    });
  }, [validData, selectedDept, searchTerm]);

  return (
    <div className="tab-content active">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon"><FaFlask /></div>
          <div className="kpi-value">{validData.length}</div>
          <div className="kpi-label">โครงการวิจัยทั้งหมด</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaCoins /></div>
          <div className="kpi-value">฿{(totalBudgetAll / 1000000).toFixed(1)}M</div>
          <div className="kpi-label">งบประมาณรวม</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaBuilding /></div>
          <div className="kpi-value">{uniqueDepts.size}</div>
          <div className="kpi-label">ภาควิชาที่เกี่ยวข้อง</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaHandHoldingUsd /></div>
          <div className="kpi-value">{uniqueFunds.size}</div>
          <div className="kpi-label">แหล่งทุนวิจัย</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><FaChartLine style={{ color: '#00914d' }} /> จำนวนโครงการวิจัยรายเดือน (ข้อมูลจริง)</h3>
          <div className="chart-wrapper"><canvas id="c_re_cnt"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartLine style={{ color: '#00914d' }} /> งบประมาณวิจัยรายเดือน (ล้านบาท) (ข้อมูลจริง)</h3>
          <div className="chart-wrapper"><canvas id="c_re_bud"></canvas></div>
        </div>
      </div>
      
      {/* Table Section with Filter & Search */}
      <div className="table-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>
            <FaTable style={{ color: '#00914d', marginRight: '8px' }} /> รายละเอียดโครงการวิจัย ({filteredData.length} โครงการ)
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }}>
              <FaSearch style={{ color: '#94a3b8', marginRight: '6px' }} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, หัวหน้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '12.5px', width: '160px', fontFamily: 'inherit' }}
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontFamily: 'inherit', background: '#fff', cursor: 'pointer' }}
            >
              <option value="all">ทุกภาควิชา</option>
              {Array.from(uniqueDepts).map((d: any) => (
                <option key={d} value={d}>{String(d).replace('ภาควิชา\n', '').replace('ภาควิชา', '')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-scroll" style={{ maxHeight: "380px" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                <th>รหัสโครงการ</th>
                <th>ชื่อโครงการ</th>
                <th>หัวหน้าโครงการ</th>
                <th>ภาควิชา</th>
                <th style={{ textAlign: 'right' }}>งบประมาณรวม</th>
                <th>แหล่งทุน</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any, index: number) => {
                const internal = typeof item.budget_internal === 'number' ? item.budget_internal : 0;
                const external = typeof item.budget_external === 'number' ? item.budget_external : 0;
                const totalBudget = internal + external;

                return (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>{item.id !== "nan" ? item.id : "-"}</td>
                    <td style={{ whiteSpace: "normal", minWidth: "250px" }}>{item.name}</td>
                    <td>{item.head !== "nan" ? item.head : "-"}</td>
                    <td>{item.department !== "nan" ? item.department.replace("ภาควิชา\n", "") : "-"}</td>
                    <td className="budget-cell">{totalBudget > 0 ? totalBudget.toLocaleString() + ' ฿' : "-"}</td>
                    <td>{item.fund_source !== "nan" ? item.fund_source : "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3><FaChartBar style={{ color: '#00914d' }} /> งบประมาณตามภาควิชา (ข้อมูลจริง)</h3>
          <div className="chart-wrapper"><canvas id="c_re_dept"></canvas></div>
        </div>
        <div className="chart-card">
          <h3><FaChartPie style={{ color: '#00914d' }} /> สัดส่วนแหล่งทุนวิจัย (ข้อมูลจริง)</h3>
          <div className="chart-wrapper"><canvas id="c_re_fund"></canvas></div>
        </div>
        
        {/* กล่องรวมกราฟ SDGs แบบ Diverging */}
        <div className="chart-card chart-full">
          <h3><FaGlobe style={{ color: '#00914d' }} /> การกระจายและงบประมาณตาม SDGs</h3>
          <div className="chart-wrapper"><canvas id="c_re_sdg_combined"></canvas></div>
        </div>
      </div>

      <div className="decision-box">
        <div className="decision-header">
          <FaLightbulb style={{ color: '#f59e0b', fontSize: '18px' }} /> ข้อมูลสนับสนุนการตัดสินใจ — โครงการวิจัย
        </div>
        <ul>
          <li><strong>งบประมาณส่วนใหญ่</strong> มาจากแหล่งทุนภายนอก โดยเฉพาะจาก วช. และ สวก.</li>
          <li><strong>ภาควิชาที่มีงบวิจัยสูงสุด</strong> คือ วิศวกรรมชลประทานและวิศวกรรมการอาหาร</li>
        </ul>
      </div>
    </div>
  );
}