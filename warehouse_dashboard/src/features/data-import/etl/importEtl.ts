import * as XLSX from 'xlsx';
import { CategoryKey } from '@/types/dataManagement';
import {
  ImportRow,
  ImportRowData,
  RowIssue,
  RowStatus,
  ImportSummary,
  ParsedImportSheet,
  ImportCategoryFilter,
} from '../types';
import { normalizeDepartmentName, DEPARTMENT_ABBR_MAP } from '@/config/dataManagementConfig';
import { DEPARTMENTS as CANONICAL_DEPTS } from '@/lib/departments';
import { matchPerson } from '@/lib/personnelService';
import { findExistingDuplicate } from '@/lib/etlEngine';

export const CATEGORY_LABELS_TH: Record<CategoryKey, string> = {
  monitoring: 'การติดตามโครงการ',
  research: 'โครงการวิจัย',
  academic: 'โครงการพัฒนาวิชาการ',
  service: 'งานบริการวิชาการ',
  publications: 'ผลงานตีพิมพ์ทางวิชาการ',
  ip: 'งานทรัพย์สินทางปัญญา',
  personnel: 'บุคลากร/อาจารย์',
  kpi: 'ตัวชี้วัดตามยุทธศาสตร์',
  user_roles: 'จัดการสิทธิ์ผู้ใช้',
};

export const THAI_MONTH_SHORT_MAP: Record<string, { monthNumber: number; monthName: string }> = {
  'ม.ค': { monthNumber: 1, monthName: 'มกราคม' },
  'ก.พ': { monthNumber: 2, monthName: 'กุมภาพันธ์' },
  'มี.ค': { monthNumber: 3, monthName: 'มีนาคม' },
  'เม.ย': { monthNumber: 4, monthName: 'เมษายน' },
  'พ.ค': { monthNumber: 5, monthName: 'พฤษภาคม' },
  'มิ.ย': { monthNumber: 6, monthName: 'มิถุนายน' },
  'ก.ค': { monthNumber: 7, monthName: 'กรกฎาคม' },
  'ส.ค': { monthNumber: 8, monthName: 'สิงหาคม' },
  'ก.ย': { monthNumber: 9, monthName: 'กันยายน' },
  'ต.ค': { monthNumber: 10, monthName: 'ตุลาคม' },
  'พ.ย': { monthNumber: 11, monthName: 'พฤศจิกายน' },
  'ธ.ค': { monthNumber: 12, monthName: 'ธันวาคม' },
};

export const THAI_MONTH_DAYS: Record<number, number> = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

/**
 * 1. Detect Category from sheet name, sample rows, and file name
 */
export function detectCategory(
  sheetName: string,
  sampleRows: any[][] = [],
  fileName: string = '',
  defaultCategory: CategoryKey = 'academic'
): CategoryKey {
  const s = String(sheetName || '').toLowerCase().trim();
  const f = String(fileName || '').toLowerCase().trim();
  const cellText = sampleRows.map((r) => (r || []).join(' ')).join(' ').toLowerCase();

  // A. Check Sheet Name explicitly
  if (s.includes('1-โครงการวิจัย') || s.includes('1-วิจัย') || s.includes('โครงการวิจัย')) {
    return 'research';
  }
  if (s.includes('2-โครงการพัฒนาวิชาการ') || s.includes('2-พัฒนาวิชาการ') || s.includes('พัฒนาวิชาการ')) {
    return 'academic';
  }
  if (
    s.includes('3-งานบริการวิชาการ') ||
    s.includes('3-บริการวิชาการ') ||
    s.includes('บริการวิชาการ') ||
    s.includes('3-ผลงานบริการ') ||
    s.includes('ผลงานบริการ')
  ) {
    return 'service';
  }
  if (
    s.includes('4-ผลงานทางวิชาการ') ||
    s.includes('สิ่งตีพิมพ์') ||
    s.includes('ตีพิมพ์') ||
    s.includes('publications')
  ) {
    return 'publications';
  }
  if (
    s.includes('5-งานทรัพย์สินทางปัญญา') ||
    s.includes('ทรัพย์สินทางปัญญา') ||
    s.includes('ทรัพสินทางปัญญา') ||
    s.includes('ทรัพย์สิน') ||
    s.includes('ทรัพสิน') ||
    s.includes('สิทธิบัตร') ||
    s.includes('อนุสิทธิบัตร') ||
    s.includes('ลิขสิทธิ์') ||
    s.includes('ip')
  ) {
    return 'ip';
  }
  if (s.includes('บุคลากร') || s.includes('อาจารย์') || s.includes('personnel')) {
    return 'personnel';
  }
  if (s.includes('ตัวชี้วัด') || s.includes('ตัวชี้ว') || s.includes('ยุทธศาสตร์') || s.includes('kpi')) {
    return 'kpi';
  }

  // B. Check Header text in sheet
  if (cellText.includes('โครงการพัฒนาวิชาการ')) return 'academic';
  if (cellText.includes('โครงการวิจัย') && !cellText.includes('พัฒนาวิชาการ')) return 'research';
  if (cellText.includes('บริการวิชาการ') || cellText.includes('งานบริการ')) return 'service';
  if (cellText.includes('สิ่งตีพิมพ์') || cellText.includes('ผลงานทางวิชาการ')) return 'publications';
  if (
    cellText.includes('ทรัพย์สินทางปัญญา') ||
    cellText.includes('ทรัพสินทางปัญญา') ||
    cellText.includes('สิทธิบัตร') ||
    cellText.includes('อนุสิทธิบัตร') ||
    cellText.includes('ลิขสิทธิ์')
  ) {
    return 'ip';
  }

  // C. Check File Name
  if (f.includes('พัฒนาวิชาการ')) return 'academic';
  if (
    f.includes('วิจัย') &&
    !f.includes('พัฒนาวิชาการ') &&
    !f.includes('บริการ') &&
    !f.includes('ตัวชี้ว')
  ) {
    return 'research';
  }
  if (f.includes('บริการวิชาการ') || f.includes('บริการ')) return 'service';
  if (f.includes('ผลงานทางวิชาการ') || f.includes('ตีพิมพ์')) return 'publications';
  if (f.includes('สิทธิบัตร') || f.includes('ทรัพย์สิน') || f.includes('ทรัพสิน')) return 'ip';
  if (f.includes('บุคลากร')) return 'personnel';
  if (f.includes('ตัวชี้วัด') || f.includes('ตัวชี้ว')) return 'kpi';

  return defaultCategory;
}

/**
 * 2. Parse Thai month from sheet name or text
 */
export function parseSheetMonth(rawName: string): {
  monthName: string;
  monthNumber: number;
  calendarYearBE: number;
  fiscalYearBE: number;
} {
  const clean = String(rawName || '').trim();
  let monthName = 'ไม่ระบุ';
  let monthNumber = 1;
  let calendarYearBE = 2568;
  let fiscalYearBE = 2568;

  for (const [key, val] of Object.entries(THAI_MONTH_SHORT_MAP)) {
    if (clean.includes(key)) {
      monthName = val.monthName;
      monthNumber = val.monthNumber;
      break;
    }
  }

  const yearMatch = clean.match(/(\d{2,4})/);
  if (yearMatch) {
    const parsed = parseInt(yearMatch[1], 10);
    if (parsed < 100) calendarYearBE = 2500 + parsed;
    else if (parsed >= 2400) calendarYearBE = parsed;
    else if (parsed >= 2000 && parsed < 2100) calendarYearBE = parsed + 543;

    fiscalYearBE = monthNumber >= 10 ? calendarYearBE + 1 : calendarYearBE;
  } else {
    calendarYearBE = monthNumber >= 10 ? 2567 : 2568;
    fiscalYearBE = 2568;
  }

  return { monthName, monthNumber, calendarYearBE, fiscalYearBE };
}

/**
 * Helper: Derive start_date and end_date ISO strings from sheetName
 */
export function deriveSheetMonthDateRange(sheetName: string): {
  startDate: string;
  endDate: string;
} | null {
  const meta = parseSheetMonth(sheetName);
  if (meta.monthName === 'ไม่ระบุ') return null;

  const calendarYearCE = meta.calendarYearBE - 543;
  const mm = String(meta.monthNumber).padStart(2, '0');
  const maxDay = THAI_MONTH_DAYS[meta.monthNumber] || 30;
  const dd = String(maxDay).padStart(2, '0');

  return {
    startDate: `${calendarYearCE}-${mm}-01`,
    endDate: `${calendarYearCE}-${mm}-${dd}`,
  };
}

/**
 * 3. Detect Header Row
 */
export function detectHeaderRowUniversal(rows: any[][]): number {
  if (!rows || rows.length === 0) return 0;
  const maxScan = Math.min(10, rows.length);
  let bestRow = 0;
  let maxScore = -1;

  const keywords = [
    'ลำดับ',
    'ที่',
    'ชื่อโครงการ',
    'ชื่อผลงาน',
    'เรื่อง',
    'หัวหน้า',
    'ผู้รับผิดชอบ',
    'เจ้าของ',
    'ผู้ประดิษฐ์',
    'อาจารย์',
    'หน่วยงาน',
    'ภาควิชา',
    'สังกัด',
    'งบประมาณ',
    'จำนวนเงิน',
    'เริ่มต้น',
    'สิ้นสุด',
    'วันที่',
    'ผู้ว่าจ้าง',
    'ผู้ขอรับบริการ',
    'แหล่งทุน',
    'สิทธิบัตร',
    'หมายเหตุ',
  ];

  for (let r = 0; r < maxScan; r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    const joined = row.map((c) => String(c || '').replace(/\s+/g, '')).join(' ');
    let score = 0;
    for (const kw of keywords) {
      if (joined.includes(kw)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestRow = r;
    }
  }

  return maxScore >= 2 ? bestRow : 0;
}

/**
 * 4. Map columns dynamically based on category
 */
export function mapColumnsUniversal(
  headerRow: any[],
  subHeaders: any[][] = [],
  category: CategoryKey
): Record<string, number> {
  const mapping: Record<string, number> = {};
  if (!headerRow) return mapping;

  const cleanHeader = (val: any) =>
    String(val || '')
      .replace(/[\r\n\s]+/g, ' ')
      .trim();

  const colCount = Math.max(
    headerRow.length,
    ...subHeaders.map((sh) => (Array.isArray(sh) ? sh.length : 0))
  );

  let dateStartFound = false;
  let dateEndFound = false;

  for (let colIdx = 0; colIdx < colCount; colIdx++) {
    const h1 = cleanHeader(headerRow[colIdx] || '');
    const h2 = subHeaders[0] ? cleanHeader(subHeaders[0][colIdx] || '') : '';
    const h3 = subHeaders[1] ? cleanHeader(subHeaders[1][colIdx] || '') : '';
    const combined = `${h1} ${h2} ${h3}`.trim();

    // 1. Record Number / ID
    if (mapping.record_number === undefined) {
      if (
        h1.includes('ระเบียน') ||
        h1.includes('รหัส') ||
        h1.includes('เลขที่') ||
        combined.includes('รหัสโครงการ') ||
        combined.includes('ระเบียนโครงการ')
      ) {
        mapping.record_number = colIdx;
      } else if (
        h1.includes('ลำดับ') ||
        h1.startsWith('ที่') ||
        h1.toLowerCase() === 'no.' ||
        h1.toLowerCase() === 'no'
      ) {
        mapping.record_number = colIdx;
      }
    }

    // 2. Title / Name / Topic
    if (mapping.name === undefined) {
      if (
        combined.includes('ชื่อโครงการ') ||
        combined.includes('ชื่อผลงาน') ||
        combined.includes('รายชื่อ') ||
        combined.includes('เรื่อง') ||
        combined.includes('โครงการ')
      ) {
        if (!combined.includes('บูรณาการ') && !combined.includes('ลักษณะ')) {
          mapping.name = colIdx;
        }
      }
    }

    // 3. Head / Person / Author / Inventor
    if (mapping.head_name === undefined) {
      if (
        combined.includes('หัวหน้า') ||
        combined.includes('ผู้รับผิดชอบ') ||
        combined.includes('เจ้าของผลงาน') ||
        combined.includes('ผู้ประดิษฐ์') ||
        combined.includes('ผู้ประพันธ์') ||
        combined.includes('ผู้แต่ง') ||
        combined.includes('ชื่อ - นามสกุล') ||
        combined.includes('อาจารย์')
      ) {
        if (!combined.includes('ร่วม')) {
          mapping.head_name = colIdx;
        }
      }
    }

    // Co-authors / Contributors / Co-researchers / Co-inventors
    if (combined.includes('ผู้ร่วม') || combined.includes('ผู้แต่งร่วม') || combined.includes('ผู้ประดิษฐ์ร่วม')) {
      if (category === 'publications' && mapping.co_authors === undefined) mapping.co_authors = colIdx;
      if (category === 'service' && mapping.contributors === undefined) mapping.contributors = colIdx;
      if (category === 'research' && mapping.co_researchers === undefined) mapping.co_researchers = colIdx;
      if (category === 'ip' && mapping.inventors === undefined) mapping.inventors = colIdx;
    }

    // 4. Department
    if (mapping.department_code === undefined) {
      if (
        combined.includes('ภาควิชา') ||
        combined.includes('สังกัด') ||
        combined.includes('หน่วยงาน')
      ) {
        if (
          !combined.includes('ผู้ว่าจ้าง') &&
          !combined.includes('ผู้ขอรับ') &&
          !combined.includes('ภายนอก')
        ) {
          mapping.department_code = colIdx;
        }
      }
    }

    // 5. Client / Funding / Target
    if (mapping.client === undefined) {
      if (
        combined.includes('แหล่งทุน') ||
        combined.includes('ผู้ว่าจ้าง') ||
        combined.includes('ผู้ขอรับบริการ') ||
        combined.includes('กลุ่มเป้าหมาย') ||
        combined.includes('วารสาร')
      ) {
        mapping.client = colIdx;
      }
    }

    // 6. Budget
    if (mapping.budget === undefined) {
      if (
        combined.includes('งบประมาณ') ||
        combined.includes('จำนวนเงินสนับสนุน') ||
        combined.includes('จำนวนเงิน') ||
        combined.includes('มูลค่า')
      ) {
        if (!combined.includes('จัดสรร') && !combined.includes('15') && !combined.includes('5%')) {
          mapping.budget = colIdx;
        }
      }
    }

    // 7. Dates
    if (
      combined.includes('ระยะเวลา') ||
      combined.includes('เริ่มต้น') ||
      combined.includes('สิ้นสุด') ||
      combined.includes('วัน')
    ) {
      if (combined.includes('บูรณาการ')) {
        if (combined.includes('เริ่ม') && mapping.integration_start_date === undefined) {
          mapping.integration_start_date = colIdx;
        } else if (combined.includes('สิ้นสุด') && mapping.integration_end_date === undefined) {
          mapping.integration_end_date = colIdx;
        }
      } else {
        if (combined.includes('เริ่ม') && !dateStartFound) {
          mapping.start_date = colIdx;
          dateStartFound = true;
        } else if (combined.includes('สิ้นสุด') && !dateEndFound) {
          mapping.end_date = colIdx;
          dateEndFound = true;
        } else if (combined.includes('วัน/เดือน/ปี') || combined.includes('วันที่')) {
          if (!dateStartFound) {
            mapping.start_date = colIdx;
            dateStartFound = true;
          }
        }
      }
    }

    // 8. Remarks
    if (mapping.remarks === undefined) {
      if (combined.includes('หมายเหตุ') || combined.includes('remarks') || combined.includes('สถานะ')) {
        mapping.remarks = colIdx;
      }
    }

    // Category specific
    if (category === 'publications') {
      if (combined.includes('ชนิด') && mapping.publication_type === undefined)
        mapping.publication_type = colIdx;
      if (combined.includes('ระดับ') && mapping.level === undefined) mapping.level = colIdx;
      if (combined.includes('วารสาร') && mapping.journal_name === undefined)
        mapping.journal_name = colIdx;
      if ((combined.toLowerCase().includes('volume') || combined.includes('ฉบับ')) && mapping.volume === undefined)
        mapping.volume = colIdx;
      if (combined.includes('หน้า') && !combined.includes('หัวหน้า') && mapping.page_numbers === undefined)
        mapping.page_numbers = colIdx;
      if ((combined.toLowerCase().includes('issn') || combined.toLowerCase().includes('isbn')) && mapping.issn_isbn === undefined)
        mapping.issn_isbn = colIdx;
    }
    if (category === 'service') {
      if (combined.includes('ประเภท') && mapping.service_type === undefined)
        mapping.service_type = colIdx;
      if (combined.includes('กลุ่มเป้าหมาย') && mapping.target_group === undefined)
        mapping.target_group = colIdx;
      if (combined.includes('ชั่วโมง') && mapping.hours === undefined) mapping.hours = colIdx;
      if (combined.includes('คน') && mapping.attendees_count === undefined)
        mapping.attendees_count = colIdx;
    }
    if (category === 'ip') {
      if (combined.includes('ประเภท') && mapping.work_category === undefined)
        mapping.work_category = colIdx;
      if (combined.includes('คำขอ') && mapping.req_no === undefined) mapping.req_no = colIdx;
      if (
        combined.includes('เลขที่') &&
        !combined.includes('คำขอ') &&
        mapping.patent_no === undefined
      ) {
        mapping.patent_no = colIdx;
      }
    }
  }

  return mapping;
}

/**
 * 5. Parse Date Value supporting Excel 1968 bug conversion:
 * 1968 CE -> 2568 BE -> 2025 CE
 */
export function parseDateUniversal(raw: any): string | null {
  if (raw === undefined || raw === null) return null;
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT' || str === 'ไม่มี') return null;

  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return null;
    let y = raw.getFullYear();
    const m = raw.getMonth() + 1;
    const d = raw.getDate();

    if (y >= 1900 && y < 2000) y = y + 57;
    else if (y >= 2400) y = y - 543;

    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  if (
    typeof raw === 'number' ||
    (!isNaN(Number(str)) && !str.includes('/') && !str.includes('-'))
  ) {
    const num = Number(raw);
    if (num > 0) {
      try {
        const parsed = XLSX.SSF.parse_date_code(num);
        if (parsed && parsed.y && parsed.m && parsed.d) {
          let y = parsed.y;
          if (y >= 1900 && y < 2000) y = y + 57;
          else if (y >= 2400) y = y - 543;
          return `${y}-${String(parsed.m).padStart(2, '0')}-${String(parsed.d).padStart(2, '0')}`;
        }
      } catch {
        const epoch = new Date(1899, 11, 30);
        const dObj = new Date(epoch.getTime() + num * 86400000);
        if (!isNaN(dObj.getTime())) return parseDateUniversal(dObj);
      }
    }
  }

  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    let y = parseInt(dmyMatch[3], 10);

    if (y < 100) y = 2500 + y - 543;
    else if (y >= 1900 && y < 2000) y = y + 57;
    else if (y >= 2400) y = y - 543;

    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    let y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);

    if (y >= 1900 && y < 2000) y = y + 57;
    else if (y >= 2400) y = y - 543;

    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  return null;
}

/**
 * 6. Parse Budget
 */
export function parseBudgetUniversal(raw: any): { value: number; error?: string } {
  if (raw === undefined || raw === null) return { value: 0 };
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT') return { value: 0 };

  const cleaned = str.replace(/[฿,บาท\s]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return { value: 0, error: `งบประมาณไม่ถูกต้อง: "${str}"` };
  if (num < 0) return { value: num, error: `งบประมาณต้องไม่ติดลบ: "${str}"` };
  return { value: Math.round((num + Number.EPSILON) * 100) / 100 };
}

/**
 * 7. Normalize Department
 */
export function normalizeDepartmentUniversal(raw: any): { code: string | null; valid: boolean } {
  if (!raw) return { code: null, valid: false };
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan') return { code: null, valid: false };

  const upper = str.toUpperCase();
  const directMatch = CANONICAL_DEPTS.find((d) => d.code === upper);
  if (directMatch) return { code: directMatch.code, valid: true };

  const normName = normalizeDepartmentName(str);
  const codeFromMap = DEPARTMENT_ABBR_MAP[normName] || DEPARTMENT_ABBR_MAP[str];
  if (codeFromMap) return { code: codeFromMap, valid: true };

  const foundByName = CANONICAL_DEPTS.find((d) => d.name === normName || d.name === str);
  if (foundByName) return { code: foundByName.code, valid: true };

  for (const dept of CANONICAL_DEPTS) {
    if (upper.includes(dept.code) || str.includes(dept.name)) {
      return { code: dept.code, valid: true };
    }
  }

  return { code: 'OTH', valid: true };
}

/**
 * 8. Validate single row across all categories per DATA_MANAGEMENT_FIELDS_MAPPING.md (T7)
 */
export function validateRowUniversal(
  data: ImportRowData,
  category: CategoryKey
): RowIssue[] {
  const issues: RowIssue[] = [];

  // Title label per category
  const nameLabelMap: Record<CategoryKey, string> = {
    research: 'ชื่อโครงการวิจัย',
    academic: 'ชื่อโครงการบริการวิชาการ',
    service: 'ชื่องานบริการวิชาการ',
    publications: 'ชื่อผลงานตีพิมพ์',
    ip: 'ชื่อผลงานทรัพย์สินทางปัญญา',
    personnel: 'ชื่อ - นามสกุล',
    kpi: 'ชื่อตัวชี้วัด',
    monitoring: 'ชื่อโครงการ',
    user_roles: 'ชื่อผู้ใช้',
  };

  const headLabelMap: Record<CategoryKey, string> = {
    research: 'หัวหน้าโครงการ',
    academic: 'หัวหน้าโครงการ',
    service: 'หัวหน้าโครงการ',
    publications: 'ชื่อผู้แต่งหลัก',
    ip: 'ผู้ประดิษฐ์หลัก',
    personnel: 'ชื่อ - นามสกุล',
    kpi: 'ผู้รับผิดชอบ',
    monitoring: 'หัวหน้าโครงการ',
    user_roles: 'ผู้รับผิดชอบ',
  };

  const nameLabel = nameLabelMap[category] || 'ชื่อโครงการ';
  const headLabel = headLabelMap[category] || 'หัวหน้าโครงการ';

  // 1. Required: Name (All categories)
  if (!data.name || !data.name.trim()) {
    issues.push({
      field: 'name',
      label: nameLabel,
      severity: 'error',
      message: `ไม่ได้ระบุ${nameLabel}`,
    });
  } else if (data.name.trim().length < 4) {
    issues.push({
      field: 'name',
      label: nameLabel,
      severity: 'warning',
      message: `${nameLabel}สั้นผิดปกติ (< 4 ตัวอักษร)`,
    });
  }

  // 2. Required: Head / Author / Inventor (Required in all 5 main categories)
  const isMain5 =
    category === 'research' ||
    category === 'academic' ||
    category === 'service' ||
    category === 'publications' ||
    category === 'ip';

  if (isMain5) {
    if (!data.head_name || !data.head_name.trim()) {
      issues.push({
        field: 'head_name',
        label: headLabel,
        severity: 'error',
        message: `ไม่ได้ระบุ${headLabel}`,
      });
    } else if (!data.head_personnel_id) {
      issues.push({
        field: 'head_name',
        label: headLabel,
        severity: 'warning',
        message: 'ชื่อยังไม่ตรงกับทำเนียบบุคลากร (บันทึกเป็นข้อความ)',
      });
    }
  }

  // 3. Required: Department (Required in all 5 main categories + personnel)
  if (isMain5 || category === 'personnel') {
    if (!data.department_code || !data.department_code.trim()) {
      issues.push({
        field: 'department_code',
        label: 'ภาควิชาที่สังกัด',
        severity: 'error',
        message: 'ไม่ได้ระบุภาควิชาที่สังกัด',
      });
    }
  }

  // 4. Budget validation
  if (isNaN(data.budget) || data.budget < 0) {
    issues.push({
      field: 'budget',
      label: 'งบประมาณ',
      severity: 'error',
      message: 'งบประมาณต้องไม่ติดลบ',
    });
  }

  // 5. Category-specific Required & Optional validations (T7)
  if (category === 'research') {
    if (!data.client || !data.client.trim()) {
      issues.push({
        field: 'client',
        label: 'แหล่งทุน',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุแหล่งทุน',
      });
    }
    if (!data.budget || data.budget === 0) {
      issues.push({
        field: 'budget',
        label: 'งบประมาณ',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุงบประมาณ (หรือเป็น 0 บาท)',
      });
    }
    if (!data.start_date) {
      issues.push({
        field: 'start_date',
        label: 'วันเริ่มต้น',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุวันเริ่มต้น',
      });
    }
    if (!data.end_date) {
      issues.push({
        field: 'end_date',
        label: 'วันสิ้นสุด',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุวันสิ้นสุด',
      });
    }
  } else if (category === 'academic') {
    // Academic requires start_date and end_date as ERROR
    if (!data.start_date) {
      issues.push({
        field: 'start_date',
        label: 'วันเริ่มต้นดำเนินการ',
        severity: 'error',
        message: 'ไม่ได้ระบุวันเริ่มต้นดำเนินการ',
      });
    }
    if (!data.end_date) {
      issues.push({
        field: 'end_date',
        label: 'วันสิ้นสุดดำเนินการ',
        severity: 'error',
        message: 'ไม่ได้ระบุวันสิ้นสุดดำเนินการ',
      });
    }
    if (!data.client || !data.client.trim()) {
      issues.push({
        field: 'client',
        label: 'ผู้ว่าจ้าง / แหล่งทุน',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุผู้ว่าจ้าง / แหล่งทุน',
      });
    }
    if (!data.budget || data.budget === 0) {
      issues.push({
        field: 'budget',
        label: 'งบประมาณโครงการ',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุงบประมาณโครงการ (หรือเป็น 0 บาท)',
      });
    }
  } else if (category === 'service') {
    if (!data.service_type || !data.service_type.trim()) {
      issues.push({
        field: 'service_type',
        label: 'ประเภทบริการ',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุประเภทบริการ',
      });
    }
    if (!data.target_group || !data.target_group.trim()) {
      issues.push({
        field: 'target_group',
        label: 'กลุ่มเป้าหมาย',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุกลุ่มเป้าหมาย',
      });
    }
    if (!data.budget || data.budget === 0) {
      issues.push({
        field: 'budget',
        label: 'งบประมาณ',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุงบประมาณ',
      });
    }
    if (!data.start_date) {
      issues.push({
        field: 'start_date',
        label: 'วันเริ่มต้น',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุวันเริ่มต้น',
      });
    }
    if (!data.end_date) {
      issues.push({
        field: 'end_date',
        label: 'วันสิ้นสุด',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุวันสิ้นสุด',
      });
    }
  } else if (category === 'publications') {
    if (!data.publication_type || !data.publication_type.trim()) {
      issues.push({
        field: 'publication_type',
        label: 'ชนิดการตีพิมพ์',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุชนิดการตีพิมพ์',
      });
    }
    if (!data.level || !data.level.trim()) {
      issues.push({
        field: 'level',
        label: 'ระดับการตีพิมพ์',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุระดับการตีพิมพ์',
      });
    }
    if (!data.journal_name || !data.journal_name.trim()) {
      issues.push({
        field: 'journal_name',
        label: 'ชื่อวารสาร / งานประชุม',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุชื่อวารสาร / งานประชุม',
      });
    }
  } else if (category === 'ip') {
    if (!data.work_category || !data.work_category.trim()) {
      issues.push({
        field: 'work_category',
        label: 'ประเภททรัพย์สินทางปัญญา',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุประเภททรัพย์สินทางปัญญา',
      });
    }
    if (!data.req_no || !data.req_no.trim()) {
      issues.push({
        field: 'req_no',
        label: 'เลขที่คำขอ',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุเลขที่คำขอ',
      });
    }
    if (!data.patent_no || !data.patent_no.trim()) {
      issues.push({
        field: 'patent_no',
        label: 'เลขที่สิทธิบัตร / ทะเบียน',
        severity: 'warning',
        message: 'ยังไม่ได้ระบุเลขที่สิทธิบัตร / ทะเบียน',
      });
    }
  }

  // Date order check
  if (data.start_date && data.end_date) {
    if (data.end_date < data.start_date) {
      issues.push({
        field: 'end_date',
        label: 'วันสิ้นสุด',
        severity: 'error',
        message: 'วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น',
      });
    }
  }

  return issues;
}

/**
 * 9. Enrich single row with personnel matching
 */
export function enrichRowUniversal(data: ImportRowData): ImportRowData {
  if (!data.head_name || data.head_personnel_id) return data;
  const matched = matchPerson(data.head_name);
  if (matched) {
    let dept = data.department_code;
    if (!dept && matched.department) {
      const norm = normalizeDepartmentUniversal(matched.department);
      if (norm.valid && norm.code) dept = norm.code;
    }
    return {
      ...data,
      head_personnel_id: matched.id ? Number(matched.id) : null,
      department_code: dept,
    };
  }
  return data;
}

/**
 * Recalculate Academic 5%/5%/5%/85% allocation when budget changes
 */
export function recalculateAcademicAllocations(data: ImportRowData): ImportRowData {
  const b = Number(data.budget || 0);
  const pFac = Number(data.percent_faculty ?? 5);
  const pDept = Number(data.percent_dept ?? 5);
  const pKu = Number(data.percent_ku ?? 5);
  const round2 = (v: number) => Math.round((v + Number.EPSILON) * 100) / 100;

  const allocFac = round2((b * pFac) / 100);
  const allocDept = round2((b * pDept) / 100);
  const allocKu = round2((b * pKu) / 100);
  const allocRem = Math.max(0, round2(b - (allocFac + allocDept + allocKu)));

  return {
    ...data,
    percent_faculty: pFac,
    percent_dept: pDept,
    percent_ku: pKu,
    alloc_faculty: allocFac,
    alloc_dept: allocDept,
    alloc_ku: allocKu,
    alloc_remaining: allocRem,
  };
}

/**
 * 10. Compute Summary (supports whole-file summary or category-filtered summary per T3.4)
 */
export function computeGlobalSummary(
  rows: ImportRow[],
  categoryFilter: ImportCategoryFilter = 'all'
): ImportSummary {
  let total = 0;
  let ready = 0;
  let needsFix = 0;
  let needsReview = 0;
  let duplicate = 0;
  let excluded = 0;
  let willImport = 0;

  const catMap: Record<
    CategoryKey,
    { category: CategoryKey; label: string; count: number; willImport: number; needsFix: number }
  > = {
    monitoring: { category: 'monitoring', label: 'การติดตามโครงการ', count: 0, willImport: 0, needsFix: 0 },
    research: { category: 'research', label: 'โครงการวิจัย', count: 0, willImport: 0, needsFix: 0 },
    academic: { category: 'academic', label: 'โครงการพัฒนาวิชาการ', count: 0, willImport: 0, needsFix: 0 },
    service: { category: 'service', label: 'งานบริการวิชาการ', count: 0, willImport: 0, needsFix: 0 },
    publications: { category: 'publications', label: 'ผลงานตีพิมพ์ทางวิชาการ', count: 0, willImport: 0, needsFix: 0 },
    ip: { category: 'ip', label: 'งานทรัพย์สินทางปัญญา', count: 0, willImport: 0, needsFix: 0 },
    personnel: { category: 'personnel', label: 'บุคลากร/อาจารย์', count: 0, willImport: 0, needsFix: 0 },
    kpi: { category: 'kpi', label: 'ตัวชี้วัดตามยุทธศาสตร์', count: 0, willImport: 0, needsFix: 0 },
    user_roles: { category: 'user_roles', label: 'จัดการสิทธิ์', count: 0, willImport: 0, needsFix: 0 },
  };

  for (const r of rows) {
    const cat = r.category || 'academic';
    if (!catMap[cat]) {
      catMap[cat] = {
        category: cat,
        label: CATEGORY_LABELS_TH[cat] || cat,
        count: 0,
        willImport: 0,
        needsFix: 0,
      };
    }

    // Whole-file category counts always accumulate for category chips (T3.4)
    catMap[cat].count++;
    if (!r.excluded && (r.status === 'ready' || r.status === 'warning')) {
      catMap[cat].willImport++;
    }
    if (!r.excluded && r.status === 'error') {
      catMap[cat].needsFix++;
    }

    // For card metrics, filter by categoryFilter if not 'all'
    if (categoryFilter !== 'all' && cat !== categoryFilter) {
      continue;
    }

    total++;
    const s = r.status;

    if (r.excluded || s === 'excluded') {
      excluded++;
    } else if (s === 'duplicate') {
      duplicate++;
    } else if (s === 'error') {
      needsFix++;
    } else if (s === 'warning') {
      needsReview++;
      ready++;
      willImport++;
    } else if (s === 'ready') {
      ready++;
      willImport++;
    }
  }

  const byCategory = Object.values(catMap).filter((c) => c.count > 0);

  return {
    total,
    ready,
    needsFix,
    needsReview,
    duplicate,
    excluded,
    willImport,
    byCategory,
  };
}

/**
 * Check if a row is completely blank or summary
 */
export function isBlankRow(row: any[]): boolean {
  if (!row || !Array.isArray(row) || row.length === 0) return true;
  const nonBlank = row.filter((c) => c !== undefined && c !== null && String(c).trim() !== '');
  if (nonBlank.length === 0) return true;
  const first = String(nonBlank[0]).trim().toLowerCase();
  if (
    first.includes('รวม') ||
    first.includes('total') ||
    first.includes('summary') ||
    first.includes('ลงนาม')
  ) {
    return true;
  }
  return false;
}

/**
 * 11. Main Universal Workbook Parser
 */
export async function parseWorkbookUniversal(
  fileOrBuffer: File | ArrayBuffer | Uint8Array,
  defaultCategory: CategoryKey = 'academic',
  existingDatasets: Partial<Record<CategoryKey, Record<string, any>[]>> = {},
  fileName: string = ''
): Promise<{
  sheets: ParsedImportSheet[];
  rows: ImportRow[];
  ignoredSheets: string[];
  detectedCategories: CategoryKey[];
}> {
  let data: ArrayBuffer | Uint8Array;
  if (typeof File !== 'undefined' && fileOrBuffer instanceof File) {
    data = await fileOrBuffer.arrayBuffer();
  } else {
    data = fileOrBuffer as ArrayBuffer | Uint8Array;
  }

  const wb = XLSX.read(data, {
    type: 'array',
    cellDates: true,
    cellNF: false,
    cellText: false,
  });

  const parsedSheets: ParsedImportSheet[] = [];
  const ignoredSheets: string[] = [];
  const allRows: ImportRow[] = [];
  const seenKeys = new Map<string, string>();

  const hasMonthlySheets = wb.SheetNames.some((s) =>
    Object.keys(THAI_MONTH_SHORT_MAP).some((m) => s.includes(m))
  );

  for (const sheetName of wb.SheetNames) {
    const sClean = sheetName.trim();

    if (hasMonthlySheets && (sClean.includes('รวม') || sClean.toLowerCase().includes('total'))) {
      ignoredSheets.push(sheetName);
      continue;
    }

    const ws = wb.Sheets[sheetName];
    if (!ws) continue;

    const rawGrid: any[][] = XLSX.utils.sheet_to_json(ws, {
      header: 1,
      defval: '',
      blankrows: false,
    });

    const sheetCategory = detectCategory(
      sheetName,
      rawGrid.slice(0, 4),
      fileName,
      defaultCategory
    );
    const categoryLabel = CATEGORY_LABELS_TH[sheetCategory] || sheetCategory;
    const monthMeta = parseSheetMonth(sheetName);

    if (!rawGrid || rawGrid.length === 0) {
      parsedSheets.push({
        sheetName,
        category: sheetCategory,
        categoryLabel,
        monthName: monthMeta.monthName,
        fiscalYear: monthMeta.fiscalYearBE,
        rawRows: [],
        headerRowIndex: 0,
        colMap: {},
        warnings: [],
        rowCount: 0,
      });
      continue;
    }

    const headerIdx = detectHeaderRowUniversal(rawGrid);
    const headerRow = rawGrid[headerIdx] || [];
    const subHeaders = [rawGrid[headerIdx + 1] || [], rawGrid[headerIdx + 2] || []];
    const colMap = mapColumnsUniversal(headerRow, subHeaders, sheetCategory);

    let dataStartRow = headerIdx + 1;
    for (let r = headerIdx + 1; r < Math.min(rawGrid.length, headerIdx + 4); r++) {
      const row = rawGrid[r];
      const joined = (row || []).map((c) => String(c || '').trim()).join(' ');
      if (
        joined.includes('เริ่มต้น') ||
        joined.includes('สิ้นสุด') ||
        joined.includes('ภายใน') ||
        joined.includes('ภายนอก') ||
        joined.includes('ต่างชาติ') ||
        joined.includes('15 %')
      ) {
        dataStartRow = r + 1;
      }
    }

    let sheetRowCount = 0;
    const cleanCell = (val: any) =>
      String(val || '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    for (let r = dataStartRow; r < rawGrid.length; r++) {
      const row = rawGrid[r];
      if (isBlankRow(row)) continue;

      const excelRowNumber = r + 1;
      const rowId = `${sheetCategory}-${sheetName}-${excelRowNumber}`;

      const getCellVal = (k: string) => {
        const idx = colMap[k];
        return idx !== undefined && idx >= 0 && idx < row.length ? row[idx] : '';
      };

      const name = cleanCell(getCellVal('name'));
      const headName = cleanCell(getCellVal('head_name'));
      const client = cleanCell(getCellVal('client'));
      const recordNumber = cleanCell(getCellVal('record_number'));
      const remarks = cleanCell(getCellVal('remarks'));

      const budgetVal = parseBudgetUniversal(getCellVal('budget'));
      const deptVal = normalizeDepartmentUniversal(getCellVal('department_code'));
      const startDate = parseDateUniversal(getCellVal('start_date'));
      const endDate = parseDateUniversal(getCellVal('end_date'));
      const intStart = parseDateUniversal(getCellVal('integration_start_date'));
      const intEnd = parseDateUniversal(getCellVal('integration_end_date'));

      const pubType = cleanCell(getCellVal('publication_type'));
      const level = cleanCell(getCellVal('level'));
      const journalName = cleanCell(getCellVal('journal_name'));
      const volume = cleanCell(getCellVal('volume'));
      const pageNumbers = cleanCell(getCellVal('page_numbers'));
      const issnIsbn = cleanCell(getCellVal('issn_isbn'));
      const coAuthors = cleanCell(getCellVal('co_authors'));

      const serviceType = cleanCell(getCellVal('service_type'));
      const targetGroup = cleanCell(getCellVal('target_group'));
      const contributors = cleanCell(getCellVal('contributors'));
      const hoursRaw = getCellVal('hours');
      const attendeesRaw = getCellVal('attendees_count');

      const patentNo = cleanCell(getCellVal('patent_no'));
      const reqNo = cleanCell(getCellVal('req_no'));
      const workCat = cleanCell(getCellVal('work_category'));
      const inventors = cleanCell(getCellVal('inventors'));

      const coResearchers = cleanCell(getCellVal('co_researchers'));

      let rowData: ImportRowData = {
        name,
        head_name: headName,
        head_personnel_id: null,
        department_code: deptVal.code,
        client,
        fund_source: client,
        budget: budgetVal.value,
        start_date: startDate,
        end_date: endDate,
        month: monthMeta.monthName,
        fiscal_year: monthMeta.fiscalYearBE,
        record_number: recordNumber,
        remarks,
        percent_faculty: 5,
        percent_dept: 5,
        percent_ku: 5,
        alloc_faculty: 0,
        alloc_dept: 0,
        alloc_ku: 0,
        alloc_remaining: 0,
        publication_type: pubType || undefined,
        level: level || undefined,
        journal_name: journalName || undefined,
        volume: volume || undefined,
        page_numbers: pageNumbers || undefined,
        issn_isbn: issnIsbn || undefined,
        co_authors: coAuthors || undefined,
        service_type: serviceType || undefined,
        target_group: targetGroup || undefined,
        contributors: contributors || undefined,
        hours: hoursRaw ? Number(hoursRaw) || undefined : undefined,
        attendees_count: attendeesRaw ? Number(attendeesRaw) || undefined : undefined,
        patent_no: patentNo || undefined,
        req_no: reqNo || undefined,
        work_category: workCat || undefined,
        inventors: inventors || undefined,
        co_researchers: coResearchers || undefined,
        integration_start_date: intStart,
        integration_end_date: intEnd,
      };

      rowData = recalculateAcademicAllocations(rowData);
      rowData = enrichRowUniversal(rowData);

      const issues = validateRowUniversal(rowData, sheetCategory);

      let isDuplicate = false;
      let duplicateOf: string | undefined = undefined;

      const existingCatList = existingDatasets[sheetCategory];
      if (existingCatList && existingCatList.length > 0) {
        const dbDup = findExistingDuplicate(rowData, existingCatList, sheetCategory);
        if (dbDup) {
          isDuplicate = true;
          duplicateOf = `ซ้ำกับข้อมูลเดิมในหมวด ${categoryLabel}: "${dbDup.name || dbDup.title}"`;
        }
      }

      const intraKey = `${sheetCategory}_${name.toLowerCase().replace(/[\s\r\n]/g, '')}_${headName.toLowerCase().replace(/[\s\r\n]/g, '')}`;
      if (intraKey.length > 6) {
        if (seenKeys.has(intraKey)) {
          isDuplicate = true;
          duplicateOf = `ซ้ำกับแถวอื่นในไฟล์ (${seenKeys.get(intraKey)})`;
        } else {
          seenKeys.set(intraKey, rowId);
        }
      }

      const status: RowStatus = isDuplicate
        ? 'duplicate'
        : issues.some((i) => i.severity === 'error')
        ? 'error'
        : issues.some((i) => i.severity === 'warning')
        ? 'warning'
        : 'ready';

      allRows.push({
        rowId,
        category: sheetCategory,
        categoryLabel,
        sheetName,
        excelRowNumber,
        status,
        excluded: false,
        duplicateOf,
        issues,
        data: rowData,
      });
      sheetRowCount++;
    }

    parsedSheets.push({
      sheetName,
      category: sheetCategory,
      categoryLabel,
      monthName: monthMeta.monthName,
      fiscalYear: monthMeta.fiscalYearBE,
      rawRows: rawGrid,
      headerRowIndex: headerIdx,
      colMap,
      warnings: [],
      rowCount: sheetRowCount,
    });
  }

  const detectedCategories = Array.from(new Set(parsedSheets.map((s) => s.category)));

  return {
    sheets: parsedSheets,
    rows: allRows,
    ignoredSheets,
    detectedCategories,
  };
}

/**
 * 12. Build API Payload for saving a row to backend `/api/v1/data/:category`
 */
export function buildCategoryPayload(row: ImportRow): Record<string, any> {
  return {
    name: row.data.name,
    title: row.data.name,
    head_name: row.data.head_name,
    head_personnel_id: row.data.head_personnel_id,
    department_code: row.data.department_code,
    department: row.data.department_code,
    client: row.data.client,
    fund_source: row.data.fund_source || row.data.client,
    budget: row.data.budget,
    start_date: row.data.start_date,
    end_date: row.data.end_date,
    month: row.data.month,
    fiscal_year: row.data.fiscal_year,
    record_number: row.data.record_number,
    remarks: row.data.remarks,
    ...(row.category === 'research'
      ? {
          co_researchers: row.data.co_researchers,
          funding_type: row.data.funding_type,
          project_type: row.data.project_type,
          status: row.data.status,
          duration: row.data.duration,
          progress: row.data.progress,
        }
      : {}),
    ...(row.category === 'academic'
      ? {
          percent_faculty: row.data.percent_faculty ?? 5,
          alloc_faculty: row.data.alloc_faculty,
          percent_dept: row.data.percent_dept ?? 5,
          alloc_dept: row.data.alloc_dept,
          percent_ku: row.data.percent_ku ?? 5,
          alloc_ku: row.data.alloc_ku,
          alloc_remaining: row.data.alloc_remaining,
          research_projects: row.data.research_projects,
          patent_integration: row.data.patent_integration,
          integration_start_date: row.data.integration_start_date,
          integration_end_date: row.data.integration_end_date,
        }
      : {}),
    ...(row.category === 'publications'
      ? {
          co_authors: row.data.co_authors,
          publication_type: row.data.publication_type,
          level: row.data.level,
          publish_month: row.data.publish_month,
          publish_year: row.data.publish_year,
          journal_name: row.data.journal_name,
          volume: row.data.volume,
          page_numbers: row.data.page_numbers,
          issn_isbn: row.data.issn_isbn,
          weight: row.data.weight,
        }
      : {}),
    ...(row.category === 'service'
      ? {
          contributors: row.data.contributors,
          service_type: row.data.service_type,
          target_group: row.data.target_group,
          hours: row.data.hours,
          attendees_count: row.data.attendees_count,
          satisfaction: row.data.satisfaction,
          impact: row.data.impact,
          integration: row.data.integration,
        }
      : {}),
    ...(row.category === 'ip'
      ? {
          inventors: row.data.inventors,
          patent_no: row.data.patent_no,
          req_no: row.data.req_no,
          work_category: row.data.work_category,
          filing_date: row.data.filing_date,
        }
      : {}),
  };
}
