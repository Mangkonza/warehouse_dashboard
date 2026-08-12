"use client";

export default function KPITab() {
  return (
    <div className="tab-content active">
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
  );
}