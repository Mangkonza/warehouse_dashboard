export type ProjectStatus = 
  | 'proposed'            // ยื่นข้อเสนอ / รออนุมัติ
  | 'active'              // กำลังดำเนินการตามแผน (On Track)
  | 'extension_requested' // ยื่นขอขยายระยะเวลา
  | 'extended'            // อยู่ระหว่างขยายระยะเวลา
  | 'delayed'             // เกินกำหนด / ล่าช้ากว่าแผน (Overdue)
  | 'submitted'           // ส่งรายงานฉบับสมบูรณ์ / รอตรวจรับ
  | 'completed'           // ปิดโครงการเสร็จสมบูรณ์
  | 'cancelled';          // ยกเลิก / ยุติโครงการ

export type MemberRole = 'PI' | 'Co-PI' | 'RA' | 'Advisor';

export type AffiliationType = 
  | 'eng_kps'            // คณะวิศวกรรมศาสตร์ กำแพงแสน (เชื่อม Master Data 304 ท่าน)
  | 'ku_kps_faculty'     // คณะอื่นใน มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
  | 'ku_other_campus'    // วิทยาเขตอื่นของ มก. (บางเขน, ศรีราชา, สกลนคร, สุพรรณบุรี)
  | 'external_academic'  // สถาบันการศึกษา/มหาวิทยาลัยอื่น
  | 'external_govt'      // หน่วยงานภาครัฐ / สถาบันวิจัย (วช., สวทช., กรมชลประทาน ฯลฯ)
  | 'external_private';  // ภาคเอกชน / ภาคอุตสาหกรรม

export interface ProjectMember {
  id?: string;
  name: string;                         // ชื่อ-นามสกุล พร้อมคำนำหน้า
  role: MemberRole;                     // บทบาทในโครงการ
  affiliation_type: AffiliationType;    // ประเภทสังกัด
  department_or_faculty?: string;       // ภาควิชา / คณะ
  organization: string;                 // ชื่อสถาบัน / มหาวิทยาลัย / บริษัท
  contribution_percent?: number;        // สัดส่วนการมีส่วนร่วม (%)
  personnel_id?: string;                // รหัสเชื่อมโยงหากเป็นบุคลากรคณะวิศวะฯ
  email?: string;                       // อีเมลติดต่อ
}

export type ExtensionReasonCategory = 
  | 'technical_issue'          // อุปสรรคทางเทคนิคในการทดลอง
  | 'procurement_delay'        // ปัญหาจัดซื้อจัดจ้างครุภัณฑ์
  | 'lab_analysis_waiting'     // รอผลวิเคราะห์จากห้องปฏิบัติการมาตรฐานภายนอก
  | 'publication_acceptance'   // รอการตอบรับตีพิมพ์ในวารสารนานาชาติ
  | 'force_majeure'            // เหตุสุดวิสัย / ภัยธรรมชาติ
  | 'other';                   // อื่นๆ

export interface ProjectExtensionRecord {
  id: string;
  round: number;                      // ขยายเวลาครั้งที่ (1, 2)
  request_date: string;               // วันที่ยื่นบันทึกข้อความ (YYYY-MM-DD)
  original_end_date: string;          // วันสิ้นสุดเดิม
  extended_end_date: string;          // วันสิ้นสุดใหม่ที่ขอขยาย
  duration_months: number;            // จำนวนเดือนที่ขอเพิ่ม
  reason_category: ExtensionReasonCategory;
  reason_detail: string;              // คำชี้แจงเหตุผลความจำเป็นตามระเบียบ มก.
  document_ref_no?: string;           // เลขที่บันทึกข้อความ มก. (เช่น อว 6505...)
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;               // ผู้อนุมัติ เช่น คณบดี / สวพ.มก. / แหล่งทุน
  created_at?: string;
}

export interface ProjectTimelineInfo {
  start_date: string;                 // วันเริ่มต้นสัญญา (YYYY-MM-DD)
  end_date: string;                   // วันสิ้นสุดสัญญาปัจจุบัน
  original_end_date: string;          // วันสิ้นสุดสัญญาเดิม
  closed_date?: string;               // วันปิดโครงการจริง
  duration_months: number;            // ระยะเวลารวม (เดือน)
  days_remaining: number;             // จำนวนวันคงเหลือ (- คือเกินกำหนด)
  progress_percent: number;           // ความก้าวหน้าประมาณการ (%)
  status: ProjectStatus;              // สถานะโครงการ
  is_overdue: boolean;                // เลยกำหนดสัญญาหรือไม่
  extensions: ProjectExtensionRecord[];// ประวัติการขอขยายเวลา
}
