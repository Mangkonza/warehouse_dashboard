/**
 * ETL Layer for Academic Development Projects Excel Import
 * Faculty of Engineering at Kamphaeng Saen, Kasetsart University
 * Pure functions without React dependencies for testability and portability.
 */

import * as XLSX from 'xlsx';
import {
  ImportRow,
  RowIssue,
  RowStatus,
  Summary,
  ParsedSheet,
} from './importAcademicDev.types';
import { normalizeDepartmentName, DEPARTMENT_ABBR_MAP } from '@/config/dataManagementConfig';
import { DEPARTMENTS as CANONICAL_DEPTS, DepartmentCode } from '@/lib/departments';
import { matchPerson } from '@/lib/personnelService';
import { findExistingDuplicate } from '@/lib/etlEngine';

// Standard Thai Month definitions
export const THAI_MONTH_NAMES = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
] as const;

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

/**
 * 1. Parse sheet name to detect Thai month and Buddhist Era year.
 * Examples: "ม.ค.68", "มี.ค. 68", "ธ.ค.68", "มกราคม 2568"
 */
export function parseSheetName(rawName: string): {
  isMatch: boolean;
  monthNumber?: number;
  monthName?: string;
  fiscalYearBE?: number;
} {
  if (!rawName) return { isMatch: false };
  const clean = rawName.trim();

  // If contains summary sheet terms
  if (clean.includes('สรุป') || clean.toLowerCase().includes('summary') || clean.toLowerCase().includes('total')) {
    return { isMatch: false };
  }

  // Regex pattern for Thai short month with 2 or 4 digit year
  // e.g. "ม.ค.68", "มี.ค. 68", "มี.ค.2568", "ก.พ. 68"
  const shortPattern = /^(ม\.ค|ก\.พ|มี\.ค|เม\.ย|พ\.ค|มิ\.ย|ก\.ค|ส\.ค|ก\.ย|ต\.ค|พ\.ย|ธ\.ค)\.?\s*(\d{2,4})?$/i;
  const matchShort = clean.match(shortPattern);

  if (matchShort) {
    const key = matchShort[1].replace(/\.$/, '');
    const monthInfo = THAI_MONTH_SHORT_MAP[key];
    if (monthInfo) {
      let yearBE = 2568; // Default year
      if (matchShort[2]) {
        const parsedYear = parseInt(matchShort[2], 10);
        if (parsedYear < 100) {
          yearBE = 2500 + parsedYear; // e.g. 68 -> 2568
        } else if (parsedYear >= 2400) {
          yearBE = parsedYear;
        } else if (parsedYear >= 2000 && parsedYear < 2100) {
          yearBE = parsedYear + 543;
        }
      }
      return {
        isMatch: true,
        monthNumber: monthInfo.monthNumber,
        monthName: monthInfo.monthName,
        fiscalYearBE: yearBE,
      };
    }
  }

  // Check full month names e.g. "มกราคม 2568"
  for (let i = 0; i < THAI_MONTH_NAMES.length; i++) {
    const fullName = THAI_MONTH_NAMES[i];
    if (clean.includes(fullName)) {
      const yearMatch = clean.match(/(\d{2,4})/);
      let yearBE = 2568;
      if (yearMatch) {
        const parsedYear = parseInt(yearMatch[1], 10);
        if (parsedYear < 100) yearBE = 2500 + parsedYear;
        else if (parsedYear >= 2400) yearBE = parsedYear;
        else if (parsedYear >= 2000 && parsedYear < 2100) yearBE = parsedYear + 543;
      }
      return {
        isMatch: true,
        monthNumber: i + 1,
        monthName: fullName,
        fiscalYearBE: yearBE,
      };
    }
  }

  return { isMatch: false };
}

/**
 * 2. Detect header row by scanning top 10 rows for keywords.
 */
export function detectHeaderRow(rows: any[][]): number {
  if (!rows || rows.length === 0) return 0;
  const maxScan = Math.min(10, rows.length);
  let bestRowIndex = 0;
  let maxScore = -1;

  const keywords = [
    'ลำดับ',
    'ที่',
    'ชื่อโครงการ',
    'โครงการ',
    'หัวหน้า',
    'อาจารย์',
    'หน่วยงาน',
    'ภาควิชา',
    'ผู้ขอรับบริการ',
    'ผู้ว่าจ้าง',
    'งบประมาณ',
    'การจัดสรร',
    'ระยะเวลา',
    'เริ่มต้น',
    'สิ้นสุด',
    'หมายเหตุ',
  ];

  for (let i = 0; i < maxScan; i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    let score = 0;
    const joined = row.map((c) => String(c || '').replace(/\s+/g, '')).join(' ');

    for (const kw of keywords) {
      if (joined.includes(kw)) {
        score++;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestRowIndex = i;
    }
  }

  return maxScore >= 2 ? bestRowIndex : 0;
}

/**
 * 3. Map column indices from header row and sub-header rows.
 */
export function mapColumns(
  headerRow: any[],
  subHeaders: any[][] = []
): Record<string, number> {
  const mapping: Record<string, number> = {};
  if (!headerRow) return mapping;

  const cleanHeader = (val: any) =>
    String(val || '')
      .replace(/[\r\n\s]+/g, ' ')
      .trim();

  // Combine top header and subheaders for multi-level headers
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

    // 1. Record number (ลำดับ/รหัส)
    if (mapping.record_number === undefined) {
      if (
        h1.includes('ระเบียน') ||
        h1.includes('รหัส') ||
        h1.includes('เลขที่') ||
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

    // 2. Project Name (ชื่อโครงการ)
    if (mapping.name === undefined) {
      if (
        combined.includes('ชื่อโครงการ') ||
        combined.includes('โครงการ') ||
        combined.includes('ชื่อรายการ')
      ) {
        // Exclude research integration or sub-type headers
        if (!combined.includes('บูรณาการ') && !combined.includes('ลักษณะ')) {
          mapping.name = colIdx;
        }
      }
    }

    // 3. Head of Project (หัวหน้าโครงการ)
    if (mapping.head_name === undefined) {
      if (
        combined.includes('หัวหน้า') ||
        combined.includes('ผู้รับผิดชอบ') ||
        combined.includes('อาจารย์')
      ) {
        if (!combined.includes('ร่วม')) {
          mapping.head_name = colIdx;
        }
      }
    }

    // 4. Department (สังกัด / ภาควิชา / หน่วยงาน)
    if (mapping.department_code === undefined) {
      if (
        combined.includes('หน่วยงาน') ||
        combined.includes('ภาควิชา') ||
        combined.includes('สังกัด')
      ) {
        if (!combined.includes('ผู้ว่าจ้าง') && !combined.includes('ผู้ขอรับ')) {
          mapping.department_code = colIdx;
        }
      }
    }

    // 5. Client (ผู้ว่าจ้าง / ผู้ขอรับบริการ / แหล่งทุน)
    if (mapping.client === undefined) {
      if (
        combined.includes('ผู้ว่าจ้าง') ||
        combined.includes('ผู้ขอรับบริการ') ||
        combined.includes('แหล่งทุน') ||
        combined.includes('ลูกค้า')
      ) {
        mapping.client = colIdx;
      }
    }

    // 6. Budget (งบประมาณ)
    if (mapping.budget === undefined) {
      if (
        combined.includes('งบประมาณ') ||
        combined.includes('จำนวนเงิน') ||
        combined.includes('มูลค่า')
      ) {
        // Only main budget, not 15% or 5% deduction
        if (!combined.includes('จัดสรร') && !combined.includes('15') && !combined.includes('5%')) {
          mapping.budget = colIdx;
        }
      }
    }

    // 7. Dates (ระยะเวลาดำเนินการ: เริ่มต้น / สิ้นสุด)
    if (combined.includes('ระยะเวลา') || combined.includes('เริ่มต้น') || combined.includes('สิ้นสุด') || combined.includes('วัน')) {
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
        }
      }
    }

    // 8. Remarks (หมายเหตุ)
    if (mapping.remarks === undefined) {
      if (combined.includes('หมายเหตุ') || combined.includes('remarks') || combined.includes('สถานะโครงการ')) {
        mapping.remarks = colIdx;
      }
    }

    // 9. Research integration
    if (mapping.research_projects === undefined) {
      if (combined.includes('โครงการวิจัย') && combined.includes('บูรณาการ')) {
        mapping.research_projects = colIdx;
      }
    }

    // 10. Patent integration
    if (mapping.patent_integration === undefined) {
      if (combined.includes('สิทธิบัตร') || combined.includes('อนุสิทธิบัตร')) {
        mapping.patent_integration = colIdx;
      }
    }
  }

  return mapping;
}

/**
 * 4. Parse Date value supporting:
 * - Date object
 * - Excel serial number
 * - String formats: "DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"
 * - Buddhist Era (ปี พ.ศ. >= 2400)
 * - 2-digit Windows Excel year (1968 CE -> 2568 BE -> 2025 CE)
 */
export function parseDateValue(raw: any): string | null {
  if (raw === undefined || raw === null) return null;
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT' || str === 'ไม่มี') return null;

  // A. JavaScript Date Object
  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return null;
    let y = raw.getFullYear();
    const m = raw.getMonth() + 1;
    const d = raw.getDate();

    // Excel 1968 bug conversion:
    // If year is 1900..1999 (e.g. 1968): BE = y + 600 = 2568, CE = BE - 543 = y + 57 = 2025
    if (y >= 1900 && y < 2000) {
      y = y + 57;
    } else if (y >= 2400) {
      y = y - 543;
    }
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // B. Numeric Excel Serial Number (e.g. 24852)
  if (typeof raw === 'number' || (!isNaN(Number(str)) && !str.includes('/') && !str.includes('-'))) {
    const num = Number(raw);
    if (num > 0) {
      try {
        const parsedObj = XLSX.SSF.parse_date_code(num);
        if (parsedObj && parsedObj.y && parsedObj.m && parsedObj.d) {
          let y = parsedObj.y;
          const m = parsedObj.m;
          const d = parsedObj.d;

          // Excel 1968 date logic:
          // 24852 parses as 1968-01-15 -> 2568 BE -> 2025 CE (1968 + 57 = 2025)
          if (y >= 1900 && y < 2000) {
            y = y + 57;
          } else if (y >= 2400) {
            y = y - 543;
          }
          return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        }
      } catch (err) {
        // Fallback to day math
        const epoch = new Date(1899, 11, 30);
        const ms = num * 86400000;
        const dObj = new Date(epoch.getTime() + ms);
        if (!isNaN(dObj.getTime())) {
          return parseDateValue(dObj);
        }
      }
    }
  }

  // C. String date parsing
  // Matches "DD/MM/YYYY", "DD-MM-YYYY", "D/M/YYYY"
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    let y = parseInt(dmyMatch[3], 10);

    if (y < 100) {
      // 2-digit year e.g. 68 -> 2568 BE -> 2025 CE
      y = 2500 + y - 543;
    } else if (y >= 1900 && y < 2000) {
      // 1968 -> 2025 CE
      y = y + 57;
    } else if (y >= 2400) {
      // 2568 BE -> 2025 CE
      y = y - 543;
    }
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // Matches ISO "YYYY-MM-DD"
  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymdMatch) {
    let y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);

    if (y >= 1900 && y < 2000) {
      y = y + 57;
    } else if (y >= 2400) {
      y = y - 543;
    }
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  return null;
}

/**
 * 5. Parse budget value
 */
export function parseBudgetValue(raw: any): { value: number; error?: string } {
  if (raw === undefined || raw === null) return { value: 0 };
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT') return { value: 0 };

  // Remove comma, baht signs, spaces
  const cleaned = str.replace(/[฿,บาท\s]/g, '');
  const num = parseFloat(cleaned);

  if (isNaN(num)) {
    return { value: 0, error: `งบประมาณไม่ถูกต้อง: "${str}"` };
  }
  if (num < 0) {
    return { value: num, error: `งบประมาณต้องไม่ติดลบ: "${str}"` };
  }
  return { value: Math.round((num + Number.EPSILON) * 100) / 100 };
}

/**
 * 6. Normalize Department name to standard code e.g. "CPE", "IRE", "ME", etc.
 */
export function normalizeDepartment(raw: any): { code: string | null; valid: boolean } {
  if (!raw) return { code: null, valid: false };
  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan') return { code: null, valid: false };

  // If already a valid department code
  const upper = str.toUpperCase();
  const directMatch = CANONICAL_DEPTS.find((d) => d.code === upper);
  if (directMatch) {
    return { code: directMatch.code, valid: true };
  }

  // Map from abbreviation dictionary or name normalizer
  const normName = normalizeDepartmentName(str);
  const codeFromMap = DEPARTMENT_ABBR_MAP[normName] || DEPARTMENT_ABBR_MAP[str];
  if (codeFromMap) {
    return { code: codeFromMap, valid: true };
  }

  const foundByName = CANONICAL_DEPTS.find((d) => d.name === normName || d.name === str);
  if (foundByName) {
    return { code: foundByName.code, valid: true };
  }

  // If text contains known acronyms
  for (const dept of CANONICAL_DEPTS) {
    if (upper.includes(dept.code) || str.includes(dept.name)) {
      return { code: dept.code, valid: true };
    }
  }

  return { code: 'OTH', valid: true };
}

/**
 * 7. Validate single row and return array of RowIssues
 */
export function validateRow(data: ImportRow['data']): RowIssue[] {
  const issues: RowIssue[] = [];

  // Required Field: Name
  if (!data.name || !data.name.trim()) {
    issues.push({
      field: 'name',
      severity: 'error',
      message: 'ไม่มีชื่อโครงการ (จำเป็นต้องระบุ)',
    });
  } else if (data.name.trim().length < 5) {
    issues.push({
      field: 'name',
      severity: 'warning',
      message: 'ชื่อโครงการสั้นผิดปกติ (< 5 ตัวอักษร)',
    });
  }

  // Required Field: Head of Project
  if (!data.head_name || !data.head_name.trim()) {
    issues.push({
      field: 'head_name',
      severity: 'error',
      message: 'ไม่มีชื่อหัวหน้าโครงการ (จำเป็นต้องระบุ)',
    });
  } else if (!data.head_personnel_id) {
    issues.push({
      field: 'head_name',
      severity: 'warning',
      message: 'ชื่อหัวหน้าโครงการยังไม่ได้จับคู่กับทำเนียบบุคลากร',
    });
  }

  // Required Field: Start Date
  if (!data.start_date) {
    issues.push({
      field: 'start_date',
      severity: 'error',
      message: 'ไม่มีวันที่เริ่มต้น (จำเป็นต้องระบุ)',
    });
  }

  // Required Field: End Date
  if (!data.end_date) {
    issues.push({
      field: 'end_date',
      severity: 'error',
      message: 'ไม่มีวันที่สิ้นสุด (จำเป็นต้องระบุ)',
    });
  }

  // Date Logic: End Date >= Start Date
  if (data.start_date && data.end_date) {
    if (data.end_date < data.start_date) {
      issues.push({
        field: 'end_date',
        severity: 'error',
        message: 'วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น',
      });
    }
  }

  // Budget validation
  if (isNaN(data.budget) || data.budget < 0) {
    issues.push({
      field: 'budget',
      severity: 'error',
      message: 'งบประมาณต้องเป็นตัวเลขที่ไม่ติดลบ',
    });
  } else if (data.budget === 0) {
    issues.push({
      field: 'budget',
      severity: 'warning',
      message: 'งบประมาณเป็น 0 บาท',
    });
  }

  // Department code validation
  if (!data.department_code) {
    issues.push({
      field: 'department_code',
      severity: 'warning',
      message: 'ไม่ได้ระบุสังกัดภาควิชา',
    });
  }

  // Fiscal Year
  if (!data.fiscal_year) {
    issues.push({
      field: 'fiscal_year',
      severity: 'warning',
      message: 'ไม่ได้ระบุปีงบประมาณ พ.ศ.',
    });
  }

  return issues;
}

/**
 * 8. Enrich row data with personnel directory auto-matching
 */
export function enrichRow(data: ImportRow['data']): ImportRow['data'] {
  if (!data.head_name || data.head_personnel_id) return data;

  const matched = matchPerson(data.head_name);
  if (matched) {
    let deptCode = data.department_code;
    if (!deptCode && matched.department) {
      const norm = normalizeDepartment(matched.department);
      if (norm.valid && norm.code) deptCode = norm.code;
    }
    return {
      ...data,
      head_personnel_id: matched.id ? Number(matched.id) : null,
      department_code: deptCode,
    };
  }

  return data;
}

/**
 * 9. Calculate RowStatus given issues, duplicate, excluded
 * Priority: excluded > duplicate > error > warning > ready
 */
export function calculateRowStatus(
  issues: RowIssue[],
  isDuplicate: boolean,
  isExcluded: boolean
): RowStatus {
  if (isExcluded) return 'excluded';
  if (isDuplicate) return 'duplicate';
  const hasError = issues.some((i) => i.severity === 'error');
  if (hasError) return 'error';
  const hasWarning = issues.some((i) => i.severity === 'warning');
  if (hasWarning) return 'warning';
  return 'ready';
}

/**
 * 10. Compute Summary for all rows
 */
export function computeSummary(rows: ImportRow[]): Summary {
  let total = 0;
  let ready = 0;
  let needsFix = 0;
  let needsReview = 0;
  let duplicate = 0;
  let excluded = 0;
  let willImport = 0;

  const monthMap: Record<
    string,
    { sheetName: string; total: number; willImport: number; needsFix: number }
  > = {};

  for (const r of rows) {
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

    // By month summary
    const sName = r.sheetName || 'ทั่วไป';
    if (!monthMap[sName]) {
      monthMap[sName] = { sheetName: sName, total: 0, willImport: 0, needsFix: 0 };
    }
    monthMap[sName].total++;
    if ((s === 'ready' || s === 'warning') && !r.excluded) {
      monthMap[sName].willImport++;
    }
    if (s === 'error' && !r.excluded) {
      monthMap[sName].needsFix++;
    }
  }

  return {
    total,
    ready,
    needsFix,
    needsReview,
    duplicate,
    excluded,
    willImport,
    byMonth: Object.values(monthMap),
  };
}

/**
 * 11. Normalize single row from raw Excel cells
 */
export function normalizeRow(
  rawRow: any[],
  colMap: Record<string, number>,
  sheetMeta: {
    sheetName: string;
    excelRowNumber: number;
    monthName: string;
    fiscalYear: number | null;
  }
): ImportRow['data'] {
  const getCell = (key: string): any => {
    const idx = colMap[key];
    if (idx !== undefined && idx >= 0 && idx < rawRow.length) {
      return rawRow[idx];
    }
    return '';
  };

  // Clean strings
  const cleanStr = (val: any) =>
    String(val || '')
      .replace(/[\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const name = cleanStr(getCell('name'));
  const headName = cleanStr(getCell('head_name'));
  const client = cleanStr(getCell('client'));
  const recordNumber = cleanStr(getCell('record_number'));
  const remarks = cleanStr(getCell('remarks'));
  const researchProjects = cleanStr(getCell('research_projects'));
  const patentIntegration = cleanStr(getCell('patent_integration'));

  // Budget
  const budgetParse = parseBudgetValue(getCell('budget'));

  // Department
  const deptNorm = normalizeDepartment(getCell('department_code'));

  // Dates
  const startDate = parseDateValue(getCell('start_date'));
  const endDate = parseDateValue(getCell('end_date'));
  const intStartDate = parseDateValue(getCell('integration_start_date'));
  const intEndDate = parseDateValue(getCell('integration_end_date'));

  return {
    name,
    head_name: headName,
    head_personnel_id: null,
    department_code: deptNorm.code,
    client,
    budget: budgetParse.value,
    start_date: startDate,
    end_date: endDate,
    month: sheetMeta.monthName,
    fiscal_year: sheetMeta.fiscalYear,
    record_number: recordNumber,
    remarks,
    research_projects: researchProjects || undefined,
    patent_integration: patentIntegration || undefined,
    integration_start_date: intStartDate,
    integration_end_date: intEndDate,
  };
}

/**
 * Check if a row is completely blank or a total/summary row
 */
export function isBlankOrSummaryRow(row: any[]): boolean {
  if (!row || !Array.isArray(row) || row.length === 0) return true;
  const nonBlank = row.filter((c) => c !== undefined && c !== null && String(c).trim() !== '');
  if (nonBlank.length === 0) return true;

  const firstFew = nonBlank
    .slice(0, 3)
    .map((c) => String(c).trim().toLowerCase())
    .join(' ');

  if (
    firstFew.includes('รวม') ||
    firstFew.includes('total') ||
    firstFew.includes('summary') ||
    firstFew.includes('ลงนาม') ||
    firstFew.includes('ผู้รายงาน')
  ) {
    return true;
  }

  return false;
}

/**
 * 12. Main ETL Pipeline: Parse Workbook
 */
export async function parseWorkbook(
  fileOrBuffer: File | ArrayBuffer | Uint8Array,
  existingList: Record<string, any>[] = []
): Promise<{
  sheets: ParsedSheet[];
  ignoredSheets: string[];
  rows: ImportRow[];
  warnings: string[];
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

  const parsedSheets: ParsedSheet[] = [];
  const ignoredSheets: string[] = [];
  const allRows: ImportRow[] = [];
  const globalWarnings: string[] = [];

  // Track seen names in this file for intra-file duplicate detection
  const seenFileProjects = new Map<string, string>(); // normalizedKey -> rowId

  for (const sheetName of wb.SheetNames) {
    const meta = parseSheetName(sheetName);
    if (!meta.isMatch) {
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

    if (!rawGrid || rawGrid.length === 0) {
      // Empty sheet -> 0 rows, not error
      parsedSheets.push({
        sheetName,
        monthName: meta.monthName || 'ไม่ระบุ',
        fiscalYear: meta.fiscalYearBE || 2568,
        rawRows: [],
        headerRowIndex: 0,
        colMap: {},
        warnings: [],
        rowCount: 0,
      });
      continue;
    }

    const headerIdx = detectHeaderRow(rawGrid);
    const headerRow = rawGrid[headerIdx] || [];
    const subHeaders = [rawGrid[headerIdx + 1] || [], rawGrid[headerIdx + 2] || []];
    const colMap = mapColumns(headerRow, subHeaders);

    const sheetWarnings: string[] = [];
    if (colMap.name === undefined) {
      sheetWarnings.push(`ไม่พบคอลัมน์ "ชื่อโครงการ" ในแผ่นงาน ${sheetName}`);
    }
    if (colMap.head_name === undefined) {
      sheetWarnings.push(`ไม่พบคอลัมน์ "หัวหน้าโครงการ" ในแผ่นงาน ${sheetName}`);
    }

    // Determine data start row: usually header + 2 or 3 if there are subheaders
    let dataStartRow = headerIdx + 1;
    // Check if subsequent rows look like sub-headers
    for (let r = headerIdx + 1; r < Math.min(rawGrid.length, headerIdx + 4); r++) {
      const row = rawGrid[r];
      const joined = (row || []).map((c) => String(c || '').trim()).join(' ');
      if (
        joined.includes('เริ่มต้น') ||
        joined.includes('สิ้นสุด') ||
        joined.includes('ภายใน') ||
        joined.includes('ภายนอก') ||
        joined.includes('15 %') ||
        joined.includes('5%')
      ) {
        dataStartRow = r + 1;
      }
    }

    let sheetRowCount = 0;

    for (let r = dataStartRow; r < rawGrid.length; r++) {
      const row = rawGrid[r];
      if (isBlankOrSummaryRow(row)) continue;

      const excelRowNumber = r + 1;
      const rowId = `${sheetName}-${excelRowNumber}`;

      let normalized = normalizeRow(row, colMap, {
        sheetName,
        excelRowNumber,
        monthName: meta.monthName || 'ไม่ระบุ',
        fiscalYear: meta.fiscalYearBE || 2568,
      });

      // Enrich with personnel directory match
      normalized = enrichRow(normalized);

      // Validate
      const issues = validateRow(normalized);

      // Check duplicates
      let isDuplicate = false;
      let duplicateOf: string | undefined = undefined;

      // 1. Cross-check against database existing records
      if (existingList && existingList.length > 0) {
        const dbDup = findExistingDuplicate(normalized, existingList, 'academic');
        if (dbDup) {
          isDuplicate = true;
          duplicateOf = `ซ้ำกับโครงการในระบบ: "${dbDup.name || dbDup.title}" (${dbDup.id || 'เดิม'})`;
        }
      }

      // 2. Intra-file duplicate check
      const intraKey = `${normalized.name.toLowerCase().replace(/[\s\r\n]/g, '')}_${normalized.head_name.toLowerCase().replace(/[\s\r\n]/g, '')}`;
      if (intraKey.length > 5) {
        if (seenFileProjects.has(intraKey)) {
          isDuplicate = true;
          duplicateOf = `ซ้ำกับรายการอื่นในไฟล์ (แถว ${seenFileProjects.get(intraKey)})`;
        } else {
          seenFileProjects.set(intraKey, rowId);
        }
      }

      const status = calculateRowStatus(issues, isDuplicate, false);

      const importRowItem: ImportRow = {
        rowId,
        sheetName,
        excelRowNumber,
        status,
        excluded: false,
        duplicateOf,
        issues,
        data: normalized,
      };

      allRows.push(importRowItem);
      sheetRowCount++;
    }

    parsedSheets.push({
      sheetName,
      monthName: meta.monthName || 'ไม่ระบุ',
      fiscalYear: meta.fiscalYearBE || 2568,
      rawRows: rawGrid,
      headerRowIndex: headerIdx,
      colMap,
      warnings: sheetWarnings,
      rowCount: sheetRowCount,
    });
  }

  return {
    sheets: parsedSheets,
    ignoredSheets,
    rows: allRows,
    warnings: globalWarnings,
  };
}
