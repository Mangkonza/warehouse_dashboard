export type KPICategory =
  | 'research'
  | 'academic'
  | 'publications'
  | 'service'
  | 'ip'
  | 'personnel'
  | 'strategy';

export type KPICalcType =
  | 'auto_sum'           // รวมค่าตัวเลขสะสม (เช่น งบประมาณรวม, รายได้สะสม)
  | 'auto_count'         // นับจำนวนรายการทั้งหมดในชุดข้อมูล
  | 'auto_filtered_count'// นับจำนวนรายการที่ตรงตามเงื่อนไข (เช่น Q1, งบ > 10 ล้าน)
  | 'auto_completeness'  // วัดความครอบคลุม/ครบถ้วนของหน่วยงาน (เช่น ครบทั้ง 7 ภาควิชาหรือไม่)
  | 'manual';            // ระบุผลงานแบบแมนนวล (สำหรับตัวชี้วัดที่ยังไม่มีตารางเก็บ)

export type FilterOperator = 'equals' | 'contains' | 'gte' | 'lte' | 'not_empty';

export interface KPIFilterConfig {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

export interface KPIItem {
  id: string;
  code: string;                  // รหัสตัวชี้วัด เช่น KPI 2.1-1 หรือ ย.2-AP1.1
  title: string;                 // ชื่อตัวชี้วัด
  category: KPICategory;         // หมวดหมู่
  fiscalYear: string;            // ปีงบประมาณ เช่น 2570
  targetValue: number;           // เป้าหมายตัวเลข
  unit: string;                  // หน่วยนับ เช่น เรื่อง, บาท, โครงการ, ชุมชน
  calcType: KPICalcType;         // โหมดการคำนวณ
  datasetKey: string;            // ตาราง/ชุดข้อมูลที่เชื่อมโยง: research, academic, publications, service, ip, personnel
  sumField?: string;             // ฟิลด์ตัวเลขที่ต้องการบวกสะสม (สำหรับ auto_sum)
  filterConfig?: KPIFilterConfig; // เงื่อนไขกรองอัตโนมัติ (สำหรับ auto_filtered_count)
  completenessField?: string;    // ฟิลด์ที่ใช้เช็คความครบถ้วน (เช่น department)
  completenessExpected?: string[]; // รายชื่อภาควิชาเป้าหมาย 7 ภาควิชา
  manualProgress?: number;       // สำหรับ manual
  description?: string;          // คำอธิบายเพิ่มเติม/เกณฑ์ประเมิน
  responsibleUnit?: string;      // ผู้รับผิดชอบหลัก
  strategicGoal?: string;        // เป้าประสงค์เชิงกลยุทธ์ (เช่น S1. Mega Project, S2. BCG)
  
  // รองรับการผูกโครงการ (Project Mapping) ตามที่บลูแนะนำ
  manualIncludedProjectIds?: string[]; // รายการ ID โครงการที่กดเพิ่มเข้าตัวชี้วัดด้วยมือ
  manualExcludedProjectIds?: string[]; // รายการ ID โครงการที่กดลบออกจากตัวชี้วัดด้วยมือ
  
  createdAt?: string;
  updatedAt?: string;
}

export interface KPIComputedResult {
  kpi: KPIItem;
  currentValue: number;          // ค่าจริงที่คำนวณได้
  targetValue: number;           // เป้าหมาย
  percentage: number;            // % ความสำเร็จ
  status: 'achieved' | 'on_track' | 'at_risk' | 'behind'; // สถานะความสำเร็จ
  statusLabel: string;           // ป้ายกำกับสถานะภาษาไทย
  statusColor: string;           // สีสถานะ
  variance: number;              // ผลต่าง (current - target)
  matchedProjects?: any[];       // โครงการทั้งหมดที่ถูกผูกกับตัวชี้วัดนี้ (Auto + Included - Excluded)
  autoMatchedCount?: number;     // จำนวนที่ระบบตรวจพบอัตโนมัติ
  details?: {
    completedDepartments?: string[];
    missingDepartments?: string[];
    matchCount?: number;
    sampleMatches?: any[];
  };
}