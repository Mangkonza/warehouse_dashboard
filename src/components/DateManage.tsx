"use client";

import { useState } from "react";

// นำเข้าข้อมูล JSON ทั้งหมด
import researchData from "../data/research.json";
import academicData from "../data/academic.json";
import pubData from "../data/publications.json";
import serviceData from "../data/services.json";
import ipData from "../data/ip.json";

export default function DataManage({ goBack }: { goBack: () => void }) {
  // State เลือกหมวดหมู่ที่กำลังจัดการอยู่
  const [activeCategory, setActiveCategory] = useState("research");
  
  // State สำหรับ Pagination และ Filter
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // State สำหรับ Modal อัพโหลด
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // 1. ตั้งค่าและกรองข้อมูลดิบของแต่ละหมวดหมู่
  const datasets: any = {
    research: {
      title: "โครงการวิจัย",
      icon: "fa-flask",
      data: researchData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    },
    academic: {
      title: "โครงการพัฒนาวิชาการ",
      icon: "fa-graduation-cap",
      data: academicData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    },
    service: {
      title: "กิจกรรมบริการวิชาการ",
      icon: "fa-hands-helping",
      data: serviceData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    },
    publications: {
      title: "ผลงานตีพิมพ์",
      icon: "fa-book-open",
      data: pubData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT")
    },
    ip: {
      title: "ทรัพย์สินทางปัญญา",
      icon: "fa-certificate",
      data: ipData.filter((item: any) => item.name && item.name !== "nan" && item.name !== "NaT" && item.name !== "เรื่อง")
    }
  };

  const currentDataset = datasets[activeCategory];

  // 2. ฟังก์ชันค้นหาข้อมูลแบบครอบจักรวาล (ค้นหาจากทุกคอลัมน์)
  const filteredData = currentDataset.data.filter((item: any) => {
    if (!searchTerm) return true;
    const itemString = JSON.stringify(item).toLowerCase();
    return itemString.includes(searchTerm.toLowerCase());
  });

  // 3. คำนวณแบ่งหน้า (Pagination)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // เมื่อเปลี่ยนหมวดหมู่ ให้รีเซ็ตหน้าและช่องค้นหา
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // ฟังก์ชันวาดส่วนหัวตารางแบบไดนามิก
  const renderTableHeader = () => {
    switch(activeCategory) {
      case "research": return <tr><th style={{ width: "60px", textAlign: "center" }}>#</th><th>รหัส</th><th>ชื่อโครงการ</th><th>หัวหน้าโครงการ</th><th>ภาควิชา</th><th style={{ textAlign: "right" }}>งบประมาณ</th><th style={{ textAlign: "center" }}>จัดการ</th></tr>;
      case "academic": return <tr><th style={{ width: "60px", textAlign: "center" }}>#</th><th>เดือน</th><th>ชื่อโครงการ</th><th>หัวหน้าโครงการ</th><th>ผู้ขอรับบริการ</th><th style={{ textAlign: "right" }}>งบประมาณ</th><th style={{ textAlign: "center" }}>จัดการ</th></tr>;
      case "service": return <tr><th style={{ width: "60px", textAlign: "center" }}>#</th><th>วันที่</th><th>ชื่อกิจกรรม</th><th>ผู้รับผิดชอบ</th><th>กลุ่มเป้าหมาย</th><th style={{ textAlign: "center" }}>จัดการ</th></tr>;
      case "publications": return <tr><th style={{ width: "60px", textAlign: "center" }}>#</th><th>ชื่อผลงาน</th><th>เจ้าของผลงาน</th><th>ประเภท</th><th>ระดับ</th><th style={{ textAlign: "right" }}>เงินสนับสนุน</th><th style={{ textAlign: "center" }}>จัดการ</th></tr>;
      case "ip": return <tr><th style={{ width: "60px", textAlign: "center" }}>#</th><th>เรื่อง</th><th>ผู้ประดิษฐ์</th><th>ประเภท</th><th>วันที่ยื่น</th><th>สถานะ</th><th style={{ textAlign: "center" }}>จัดการ</th></tr>;
      default: return null;
    }
  };

  // ฟังก์ชันวาดแถวข้อมูลแบบไดนามิก
  const renderTableRow = (item: any, index: number) => {
    const rowNum = startIndex + index + 1;
    const actionBtns = (
      <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
        <button style={{ background: "none", border: "none", color: "#f57c00", cursor: "pointer", margin: "0 5px" }} title="แก้ไข"><i className="fas fa-edit"></i></button>
        <button style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", margin: "0 5px" }} title="ลบ"><i className="fas fa-trash-alt"></i></button>
      </td>
    );

    switch(activeCategory) {
      case "research":
        const totalRes = (item.budget_internal || 0) + (item.budget_external || 0);
        return <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}><td style={{ textAlign: "center" }}>{rowNum}</td><td>{item.id !== "nan" ? item.id : "-"}</td><td>{item.name}</td><td>{item.head !== "nan" ? item.head : "-"}</td><td>{item.department !== "nan" ? item.department.replace("ภาควิชา\n","") : "-"}</td><td style={{ textAlign: "right", color: "#2e7d32", fontWeight: "bold" }}>{totalRes > 0 ? totalRes.toLocaleString() : "-"}</td>{actionBtns}</tr>;
      
      case "academic":
        return <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}><td style={{ textAlign: "center" }}>{rowNum}</td><td><span style={{ backgroundColor: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>{item.month !== "nan" ? item.month : "-"}</span></td><td>{item.name}</td><td>{item.head !== "nan" ? item.head : "-"}</td><td>{item.client !== "nan" ? item.client : "-"}</td><td style={{ textAlign: "right", color: "#2e7d32", fontWeight: "bold" }}>{(item.budget || 0).toLocaleString()}</td>{actionBtns}</tr>;
      
      case "service":
        return <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}><td style={{ textAlign: "center" }}>{rowNum}</td><td>{item.date !== "nan" ? item.date.substring(0,10) : "-"}</td><td>{item.name}</td><td>{item.person !== "nan" ? item.person : "-"}</td><td>{item.target_group !== "nan" ? item.target_group : "-"}</td>{actionBtns}</tr>;
      
      case "publications":
        return <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}><td style={{ textAlign: "center" }}>{rowNum}</td><td>{item.name}</td><td>{item.owner !== "nan" ? item.owner : "-"}</td><td>{item.type !== "nan" ? item.type : "-"}</td><td><span className={`badge ${item.level === "นานาชาติ" ? "badge-q1" : "badge-q2"}`}>{item.level !== "nan" ? item.level : "-"}</span></td><td style={{ textAlign: "right", color: "#2e7d32", fontWeight: "bold" }}>{(item.budget || 0).toLocaleString()}</td>{actionBtns}</tr>;
      
      case "ip":
        return <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}><td style={{ textAlign: "center" }}>{rowNum}</td><td>{item.name}</td><td>{item.creator !== "nan" ? item.creator : "-"}</td><td>{item.type !== "nan" ? item.type : "-"}</td><td>{item.req_no !== "nan" ? item.req_no.substring(0,10) : "-"}</td><td>{item.status !== "nan" ? item.status : "-"}</td>{actionBtns}</tr>;
      
      default: return null;
    }
  };

  return (
    <div style={{ padding: "0", display: "flex", flexDirection: "column", height: "100%", minHeight: "80vh" }}>
      
      {/* Header ของโหมด Admin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1c2331", color: "#fff", padding: "15px 25px", borderRadius: "10px 10px 0 0" }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>
          <i className="fas fa-tools" style={{ marginRight: "10px", color: "#4fc3f7" }}></i> 
          ระบบจัดการข้อมูล (Admin Management)
        </h2>
        <button onClick={goBack} style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}>
          <i className="fas fa-sign-out-alt"></i> กลับสู่หน้า Dashboard
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, backgroundColor: "#fff", borderRadius: "0 0 10px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        {/* Sidebar สำหรับเลือกหมวดหมู่ข้อมูล */}
        <div style={{ width: "250px", backgroundColor: "#f8f9fa", borderRight: "1px solid #eee", padding: "20px 0" }}>
          <div style={{ padding: "0 20px", marginBottom: "15px", fontWeight: "bold", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>เลือกหมวดหมู่ที่ต้องการจัดการ</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {Object.keys(datasets).map((key) => (
              <li key={key}>
                <button 
                  onClick={() => handleCategoryChange(key)}
                  style={{ width: "100%", textAlign: "left", padding: "12px 20px", border: "none", background: activeCategory === key ? "#e3f2fd" : "transparent", color: activeCategory === key ? "#1565c0" : "#555", cursor: "pointer", fontSize: "15px", fontWeight: activeCategory === key ? "bold" : "normal", borderRight: activeCategory === key ? "4px solid #1565c0" : "4px solid transparent", transition: "all 0.2s" }}
                >
                  <i className={`fas ${datasets[key].icon}`} style={{ width: "24px" }}></i> {datasets[key].title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* พื้นที่หลักสำหรับแสดงตาราง */}
        <div style={{ flex: 1, padding: "25px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#333", fontSize: "22px" }}>
              <i className={`fas ${currentDataset.icon}`} style={{ marginRight: "10px", color: "#1565c0" }}></i>
              ตารางข้อมูล{currentDataset.title}
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ padding: "8px 16px", backgroundColor: "#fff", color: "#1565c0", border: "1px solid #1565c0", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                <i className="fas fa-plus"></i> เพิ่มรายการ
              </button>
              <button onClick={() => setIsUploadModalOpen(true)} style={{ padding: "8px 16px", backgroundColor: "#1565c0", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <i className="fas fa-file-excel"></i> นำเข้า Excel
              </button>
            </div>
          </div>

          {/* แถบค้นหา */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#f5f5f5", padding: "8px 15px", borderRadius: "8px", width: "400px", border: "1px solid #e0e0e0" }}>
              <i className="fas fa-search" style={{ color: "#888", marginRight: "10px" }}></i>
              <input 
                type="text" 
                placeholder={`ค้นหาใน${currentDataset.title}...`}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{ border: "none", background: "none", outline: "none", width: "100%", fontSize: "14px", fontFamily: "inherit" }}
              />
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              พบข้อมูลทั้งหมด <strong>{filteredData.length}</strong> รายการ
            </div>
          </div>

          {/* ตารางข้อมูล */}
          <div className="table-card" style={{ margin: 0, boxShadow: "none", border: "1px solid #e0e0e0", borderRadius: "8px" }}>
            <div className="table-scroll" style={{ maxHeight: "calc(100vh - 350px)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f8f9fa", position: "sticky", top: 0, zIndex: 1 }}>
                  {renderTableHeader()}
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item: any, index: number) => renderTableRow(item, index))
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                        <i className="fas fa-inbox" style={{ fontSize: "30px", marginBottom: "10px", color: "#ddd" }}></i><br/>
                        ไม่พบข้อมูลที่ค้นหา
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
              <span style={{ fontSize: "14px", color: "#666" }}>แสดงหน้าที่ {currentPage} จาก {totalPages}</span>
              <div style={{ display: "flex", gap: "5px" }}>
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ padding: "6px 12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal อัพโหลด */}
      {isUploadModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(2px)" }}>
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "500px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0, color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <i className="fas fa-file-upload" style={{ color: "#1565c0", marginRight: "8px" }}></i> 
              นำเข้าข้อมูล: {currentDataset.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              กรุณาอัพโหลดไฟล์ Excel (.xlsx) ที่มีรูปแบบคอลัมน์ตรงตามที่ระบบกำหนด<br/>
              <a href="#" style={{ color: "#1565c0", textDecoration: "underline" }} onClick={(e) => e.preventDefault()}>ดาวน์โหลดไฟล์ Template สำหรับ{currentDataset.title}</a>
            </p>
            <div style={{ border: "2px dashed #1565c0", borderRadius: "8px", padding: "40px 20px", textAlign: "center", backgroundColor: "#f8fafd", cursor: "pointer", marginBottom: "25px" }}>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: "3rem", color: "#90caf9", marginBottom: "15px" }}></i>
              <div style={{ fontWeight: "bold", color: "#1565c0" }}>คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์มาวางที่นี่</div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>รองรับไฟล์ .xls, .xlsx ขนาดไม่เกิน 10MB</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setIsUploadModalOpen(false)} style={{ padding: "8px 20px", backgroundColor: "#f5f5f5", color: "#333", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>ยกเลิก</button>
              <button onClick={() => { alert("ระบบกำลังตรวจสอบไฟล์ (จำลอง)"); setIsUploadModalOpen(false); }} style={{ padding: "8px 20px", backgroundColor: "#1565c0", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>ต่อไป</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}