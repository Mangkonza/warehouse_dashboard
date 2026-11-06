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
  | 'manual';            // บันทึกตามรอบการรายงานผล

// วิธีคำนวณของตัวชี้วัดหลัก (4-Tier Strategic KPI)
export type KPIFormulaMethod =
  | 'SUM'        // ผลรวม (SUM)
  | 'PERCENTAGE' // ร้อยละ (ตัวตั้ง ÷ ตัวหาร × 100)
  | 'AVERAGE'    // ค่าเฉลี่ย
  | 'RATIO'      // สัดส่วน A:B
  | 'LATEST'     // ค่าล่าสุด
  | 'DIRECT';    // กรอกผลตรง

// บทบาทในสูตรของตัวชี้วัดย่อย
export type KPISubFormulaRole =
  | 'numerator'   // ตัวตั้ง
  | 'denominator' // ตัวหาร
  | 'sum_part';   // ส่วนของผลรวม

// ที่มาของค่าของตัวชี้วัดย่อย
export type KPISubValueSource =
  | 'manual'       // กรอกเอง
  | 'linked_count' // นับจากรายการที่ผูก
  | 'linked_sum';  // รวมยอดจากรายการที่ผูก

export type FilterOperator = 'equals' | 'contains' | 'gte' | 'lte' | 'not_empty';

export type KPICollectionPeriod =
  | 'ปีงบประมาณ'
  | 'ปีการศึกษา'
  | 'ปีปฏิทิน'
  | 'ภาคการศึกษา'
  | 'ไตรมาส'
  | string;

export type KPIReportingRound = '9M' | '6M' | 'auto' | string;

export interface KPIFilterConfig {
  field: string;
  operator: FilterOperator;
  value: string | number;
}

// โครงสร้างยุทธศาสตร์ (อ้างอิงด้วย id ภายใน ไม่ใช่เลขที่แสดง)
export interface StrategicStrategyEntity {
  id: string;
  code: string;         // เลขยุทธศาสตร์ เช่น "2.1"
  name: string;         // ชื่อยุทธศาสตร์
  pillarGroup?: string;
  color?: { bg: string; border: string; text: string };
}

// โครงสร้างแผนงาน (ผูกกับยุทธศาสตร์ด้วย strategyId ภายใน และตรวจเลขซ้ำภายใต้ยุทธศาสตร์เดียวกัน)
export interface StrategicPlanEntity {
  id: string;
  strategyId: string;   // อ้างอิง StrategicStrategyEntity.id
  code: string;         // เลขแผนงาน เช่น "2.1-1"
  name: string;         // ชื่อแผนงาน
  isDepartmentProject?: boolean;
}

// รอบการรายงานผล (ตั้งค่ากลาง)
export interface KPIReportingRoundConfig {
  id: string;
  legacyKey?: '6M' | '9M';
  name: string;         // ชื่อรอบ (แยกกับช่วงวันที่) เช่น "รอบ 6 เดือน", "รอบ 9 เดือน"
  periodLabel?: string; // ข้อความช่วงเวลาสั้น เช่น "ต.ค. 68 - มี.ค. 69"
  startDate: string;    // วันเริ่มต้นช่วงข้อมูล (ISO YYYY-MM-DD)
  endDate: string;      // วันสิ้นสุดช่วงข้อมูล (ISO YYYY-MM-DD)
  dueDate?: string;     // กำหนดส่งรายงาน (ISO YYYY-MM-DD)
  isCumulative: boolean;// นับสะสมจากต้นปีหรือไม่
  isActive?: boolean;   // เปิดใช้งานรอบนี้หรือไม่
  fiscalYear?: string;
  sortOrder?: number;
}

// ผลการดำเนินงานเก็บเป็นแถวต่อรอบการรายงานผล (ไม่ hard-code คอลัมน์ 6 เดือน / 9 เดือน)
export interface KPIRoundResultEntry {
  roundId: string;
  actualValue?: number | null;
  actualText?: string;
  subValues?: Record<string, string | number>; // subIndicatorId -> ค่าในรอบนี้
  evidence?: string;
  evidenceLinks?: string[];
  sourceUnits?: string[];
  remarks?: string;
  reporter?: string;
  reporters?: string[];
  status?: 'draft' | 'submitted' | 'verified';
  updatedAt?: string;
}

export interface KPISubIndicator {
  id?: string;
  title: string;                 // ชื่อตัวชี้วัดย่อย
  unit?: string;                 // หน่วยนับย่อย เช่น บทความ, ราย, บาท, โครงการ
  formulaRole?: KPISubFormulaRole; // บทบาทในสูตร: ตัวตั้ง / ตัวหาร / ส่วนของผลรวม
  valueSource?: KPISubValueSource; // ที่มาของค่า: กรอกเอง / นับจากรายการที่ผูก / รวมยอดจากรายการที่ผูก
  linkedDatasetKey?: string;     // ชุดข้อมูลที่ผูก (research, academic, publications, service, ip, personnel)
  linkedSumField?: string;       // ฟิลด์ตัวเลขกรณีรวมยอดจากรายการที่ผูก
  reporters?: string[];          // ผู้รายงาน (เลือกหลายคนจากบุคลากรและอาจารย์)
  reporter?: string;             // ผู้รายงาน (ข้อความสรุปสำหรับแสดงผลย้อนหลัง)
  target?: string | number;      // ค่าเป้าหมายย่อย (ถ้ามี)
  actual6M?: string | number;    // ผลรอบ 6 เดือน (รองรับข้อมูลเดิม)
  actual9M?: string | number;    // ผลรอบ 9 เดือน (รองรับข้อมูลเดิม)
  resultsByRound?: Record<string, string | number>; // ผลรายรอบแบบไดนามิก (roundId -> ค่า)
  evidence?: string;             // หลักฐานอ้างอิงย่อย / หน่วยงานที่มา
  remarks?: string;              // หมายเหตุย่อย / รายละเอียดโครงการ
}

export interface KPIItem {
  id: string;
  code: string;                  // รหัสตัวชี้วัด เช่น 1.1-1 (1), 2.1-1 (1)
  title: string;                 // ชื่อตัวชี้วัดตามแผนยุทธศาสตร์
  category: KPICategory;         // หมวดหมู่ข้อมูลหลัก
  fiscalYear: string;            // ปีงบประมาณ เช่น 2569, 2570
  targetValue: number;           // เป้าหมายตัวเลข (สำหรับคำนวณ %)
  targetOperator?: 'gte' | 'lte' | 'eq' | 'gt' | 'lt'; // เงื่อนไขเป้าหมาย เช่น มากกว่าหรือเท่ากับ (≥)
  targetLabel?: string;          // ข้อความค่าเป้าหมายกรณีเป็นสัดส่วนหรือเกณฑ์พิเศษ เช่น "0.6 : 1", "1.6 : 1"
  departmentTarget?: string | number; // ค่าเป้าหมายส่วนงาน
  unit: string;                  // หน่วยนับ เช่น ร้อยละ, หลักสูตร, ราย, บทความ, สัดส่วน, ล้านบาท, โครงการ
  valueType?: string;            // ชนิดของค่า: จำนวนนับ, ร้อยละ, ค่าเฉลี่ย, สัดส่วน A:B, จำนวนเงิน, คะแนน, ข้อความ/ระดับ, อื่นๆ
  reportingLevels?: string[];    // ระดับที่รายงาน: คณะ, ส่วนงาน, อื่นๆ (เลือกได้หลายอัน)
  formulaMethod?: KPIFormulaMethod; // วิธีคำนวณตัวชี้วัดหลัก: SUM, PERCENTAGE, AVERAGE, RATIO, LATEST, DIRECT
  calcType: KPICalcType;         // โหมดการคำนวณเชื่อมฐานข้อมูล
  datasetKey: string;            // ตาราง/ชุดข้อมูลที่เชื่อมโยง: research, academic, publications, service, ip, personnel
  datasetKeys?: string[];        // รองรับการเลือกหลายชุดข้อมูลพร้อมกัน (Multi-dataset selection)
  sumField?: string;             // ฟิลด์ตัวเลขที่ต้องการบวกสะสม (สำหรับ auto_sum)
  filterConfig?: KPIFilterConfig; // เงื่อนไขกรองอัตโนมัติ (สำหรับ auto_filtered_count)
  completenessField?: string;    // ฟิลด์ที่ใช้เช็คความครบถ้วน (เช่น department)
  completenessExpected?: string[]; // รายชื่อภาควิชาเป้าหมาย 7 ภาควิชา
  manualProgress?: number;       // สำหรับ manual (ค่าเริ่มต้น = ผลงานล่าสุด)
  description?: string;          // คำอธิบายตัวชี้วัด / เกณฑ์การประเมินตามเอกสารยุทธศาสตร์
  responsibleUnit?: string;      // หน่วยงานผู้รับผิดชอบหลัก / ส่วนงาน

  // โครงสร้าง 4 ชั้น (อ้างอิงด้วย id ภายใน)
  strategyId?: string;           // ID ภายในของยุทธศาสตร์
  strategyCode?: string;         // เลขยุทธศาสตร์ที่แสดง เช่น "1.1", "2.1"
  strategyName?: string;         // ชื่อยุทธศาสตร์เต็ม
  planId?: string;               // ID ภายในของแผนงาน
  planCode?: string;             // เลขแผนงานที่แสดง เช่น "2.1-1" หรือ "แผนงาน 2.1-1"
  planName?: string;             // ชื่อแผนงานเต็ม
  isDepartmentProject?: boolean; // ระบุว่าเป็นโครงการ/กิจกรรมส่วนงาน
  collectionPeriod?: KPICollectionPeriod; // รอบการเก็บข้อมูล: ปีงบประมาณ | ปีการศึกษา | ปีปฏิทิน | ภาคการศึกษา | ไตรมาส | อื่นๆ

  // รอบการรายงานผล (Dynamic Reporting Rounds)
  activeRoundIds?: string[];     // รายการ ID รอบการรายงานผลที่ใช้ (ค่าเริ่มต้น = ทุกรอบ)
  reportingRoundIds?: string[];  // alias สำหรับ activeRoundIds
  resultsByRound?: KPIRoundResultEntry[]; // ผลรายงานเก็บเป็นแถวต่อรอบการรายงานผล

  // ฟิลด์เดิมเพื่อความเข้ากันได้ย้อนหลัง (ซิงค์กับ resultsByRound อัตโนมัติ)
  actual6M?: number | null;
  actual9M?: number | null;
  actual6MText?: string;
  actual9MText?: string;
  evidence?: string;
  remarks?: string;
  reporter?: string;
  reporters?: string[];          // ผู้รายงาน (เลือกหลายคนจากข้อมูลบุคลากรและอาจารย์)
  subIndicators?: KPISubIndicator[];

  strategicGoal?: string;

  // รองรับการผูกโครงการ (Project Mapping)
  manualIncludedProjectIds?: string[];
  manualExcludedProjectIds?: string[];

  createdAt?: string;
  updatedAt?: string;
}

export interface KPIComputedResult {
  kpi: KPIItem;
  currentValue: number;          // ค่าจริงที่คำนวณได้ (ตามรอบการรายงานผลที่เลือก หรือจาก DB)
  value6M: number | null;        // ค่าจริงรอบ 6 เดือน
  value9M: number | null;        // ค่าจริงรอบ 9 เดือน
  valuesByRound?: Record<string, number | null>; // ค่าจริงรายรอบการรายงานผลทุกตัว (roundId -> number | null)
  textsByRound?: Record<string, string>;         // ข้อความแสดงผลรายรอบการรายงานผล
  targetValue: number;           // เป้าหมาย
  percentage: number;            // % ความสำเร็จ
  status: 'achieved' | 'in_progress' | 'on_track' | 'at_risk' | 'behind'; // สถานะความสำเร็จ (3 ระดับหลัก: achieved, in_progress, behind)
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
