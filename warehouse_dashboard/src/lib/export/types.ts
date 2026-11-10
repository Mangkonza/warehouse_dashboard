import { CategoryKey } from '@/types/dataManagement';

export type ExportPageKey =
  | 'overview'
  | 'research'
  | 'academic'
  | 'publications'
  | 'service'
  | 'ip'
  | 'evaluation'
  | 'manage_data'
  | 'manage_kpi';

export type ExportSectionKey =
  | 'full_page'
  | 'mission_table'
  | 'executive'
  | 'evaluation_table'
  | 'data_table'
  | 'kpi_table';

export interface ExportMetric {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  category?: string;
}

export interface ExportBreakdownTable {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  colWidths?: number[];
}

export interface ExportSheetColumn {
  key: string;
  label: string;
  width?: number;
  format?: (value: any, row: any) => any;
  type?: string;
}

export interface ExportCustomSheet {
  sheetName: string;
  columns?: ExportSheetColumn[];
  data: any[];
}

export interface UnifiedExportOptions {
  /** หน้าที่ทำการกดส่งออก */
  page: ExportPageKey;
  /** ส่วนของหน้าที่ทำการกดส่งออก (Default: full_page หรือ section ที่เหมาะสม) */
  section?: ExportSectionKey;
  /** หัวข้อรายงานหลัก */
  title?: string;
  /** คำอธิบายหรือหน่วยงาน */
  subtitle?: string;
  /** ข้อความระบุรอบเวลา / ปีงบประมาณ */
  periodLabel?: string;
  /** CategoryKey ที่เกี่ยวข้อง (สำหรับดึง Schema/Config อัตโนมัติ) */
  categoryKey?: CategoryKey;
  /** ตัวกรองที่ผู้ใช้เลือกในขณะส่งออก */
  filterSummary?: Record<string, string | number | undefined | null>;
  /** ตัวชี้วัด/สถิติสำคัญที่แสดงบนหน้านั้น */
  metrics?: ExportMetric[];
  /** ตารางแจกแจงสถิติตามมิติ (Breakdown Tables เช่น แยกตามภาควิชา, แหล่งทุน, ประเภท) */
  breakdowns?: ExportBreakdownTable[];
  /** ข้อมูลรายการในตาราง (Detail rows) */
  tableData?: any[];
  /** คอลัมน์ที่กำหนดเองสำหรับ Sheet รายการ (ถ้าไม่ส่ง จะใช้จาก config ประจำ Category อัตโนมัติ) */
  columns?: ExportSheetColumn[];
  /** Sheet พิเศษเพิ่มเติมอื่นๆ ถ้ามี */
  customSheets?: ExportCustomSheet[];
  /** ชื่อไฟล์ปลายทางที่ต้องการ (ถ้าไม่ระบุ ระบบจะตั้งชื่อให้อัตโนมัติตามมาตรฐาน) */
  fileName?: string;
}

export interface ExportContextProps {
  page: ExportPageKey;
  section?: ExportSectionKey;
  title?: string;
  periodLabel?: string;
  metrics?: ExportMetric[];
  breakdowns?: ExportBreakdownTable[];
  filterSummary?: Record<string, string | number | undefined | null>;
}
