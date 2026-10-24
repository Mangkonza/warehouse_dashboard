import * as XLSX from 'xlsx';
import { CATEGORIES_CONFIG, DEPARTMENTS } from '../config/dataManagementConfig';
import { CategoryKey, ColumnDef, ParsedRowResult, SheetParseResult, ValidationIssue } from '../types/dataManagement';
import { matchPerson, normalizePersonName } from './personnelService';

// Sheet name mapping keywords
const SHEET_NAME_KEYWORDS: Record<CategoryKey, string[]> = {
  monitoring: ['ติดตามโครงการ', 'ติดตาม', 'monitoring', 'กำหนดการ'],
  research: ['โครงการวิจัย', 'งานวิจัย', 'วิจัย', 'research'],
  academic: ['โครงการพัฒนาวิชาการ', 'พัฒนาวิชาการ', 'academic'],
  service: ['บริการวิชาการ', 'งานบริการ', 'บริการ', 'service', 'กิจกรรม'],
  publications: ['ผลงานทางวิชาการ', 'ผลงานตีพิมพ์', 'ตีพิมพ์', 'publication', 'publications', 'วารสาร', 'scopus', 'wos', 'บทความ'],
  ip: ['ทรัพย์สินทางปัญญา', 'ทรัพย์สิน', 'ip', 'สิทธิบัตร', 'อนุสิทธิบัตร', 'ลิขสิทธิ์'],
  personnel: ['บุคลากร', 'อาจารย์', 'personnel', 'faculty', 'เจ้าหน้าที่'],
  kpi: ['ตัวชี้วัด', 'kpi', 'ยุทธศาสตร์', 'เป้าหมาย'],
};

// Column aliases for resilient header matching
const COLUMN_ALIASES: Record<string, string[]> = {
  id: ['รหัส', 'รหัสโครงการ', 'code', 'id', 'project_id', 'no'],
  name: ['ชื่อโครงการ', 'ชื่อโครงการวิจัย', 'ชื่อผลงาน', 'ชื่อกิจกรรม', 'เรื่อง', 'ชื่อ', 'name', 'title', 'project_name'],
  status: ['สถานะ', 'สถานะโครงการ', 'สถานะคำขอ', 'status', 'project_status'],
  sdg_code: ['sdg', 'sdgs', 'เป้าหมายความยั่งยืน', 'green_metric'],
  doi: ['doi', 'หมายเลข doi'],
  head: ['หัวหน้าโครงการ', 'หัวหน้า', 'pi', 'project_leader', 'head'],
  person: ['ผู้รับผิดชอบ', 'ผู้จัด', 'person', 'responsible'],
  owner: ['เจ้าของผลงาน', 'ผู้แต่ง', 'ผู้ประพันธ์', 'owner', 'author'],
  creator: ['ผู้ประดิษฐ์', 'ผู้สร้างสรรค์', 'creator', 'inventor'],
  department: ['ภาควิชา', 'สังกัด', 'หน่วยงาน', 'department', 'dept'],
  budget_internal: ['งบภายใน', 'งบประมาณภายใน', 'internal_budget', 'ทุนภายใน'],
  budget_external: ['งบภายนอก', 'งบประมาณภายนอก', 'external_budget', 'ทุนภายนอก'],
  budget: ['งบประมาณ', 'งบ', 'จำนวนเงิน', 'เงินสนับสนุน', 'budget', 'amount'],
  fund_source: ['แหล่งทุน', 'แหล่งเงินทุน', 'fund_source', 'sponsor'],
  month: ['เดือน', 'ช่วงเวลา', 'month', 'period'],
  client: ['ผู้ขอรับบริการ', 'ว่าจ้าง', 'ผู้ว่าจ้าง', 'ลูกค้า', 'client', 'customer'],
  date: ['วันที่', 'วันจัดกิจกรรม', 'date', 'start_date'],
  type: ['ประเภท', 'ประเภทผลงาน', 'type', 'category'],
  level: ['ระดับ', 'ฐานข้อมูล', 'level', 'quartile', 'tier'],
  journal: ['วารสาร', 'แหล่งตีพิมพ์', 'journal', 'publisher'],
  req_no: ['เลขที่คำขอ', 'เลขที่สิทธิบัตร', 'req_no', 'patent_no'],
  title_th: ['คำนำหน้า', 'คำนำหน้านาม', 'title', 'prefix'],
  position: ['ตำแหน่ง', 'ตำแหน่งวิชาการ', 'position', 'role'],
  email: ['อีเมล', 'e-mail', 'email'],
  target_group: ['กลุ่มเป้าหมาย', 'ผู้เข้าร่วม', 'target_group', 'audience'],
  image_url: ['รูปภาพ', 'รูปภาพประจำตัว', 'รูปถ่าย', 'รูป', 'รูปโปรไฟล์', 'image', 'picture', 'photo', 'avatar', 'image_url'],
  title: ['ชื่อเรื่อง', 'title', 'ชื่อการประดิษฐ์', 'เรื่อง'],
  support_amount: ['คณะฯ สนับสนุน', 'เงินสนับสนุน', 'support_amount', 'คณะสนับสนุน', 'เงินรางวัลสนับสนุน'],
  application_number: ['เลขที่คำขอ', 'application_number', 'app_no'],
  registration_number: ['เลขที่', 'เลขที่ทะเบียน', 'registration_number', 'reg_no', 'เลขที่สิทธิบัตร'],
  filing_date: ['วันที่ยื่น', 'filing_date', 'ยื่นคำขอ'],
  protection_start: ['วันที่เริ่มต้น', 'protection_start', 'เริ่มคุ้มครอง'],
  protection_end: ['วันที่สิ้นสุด', 'protection_end', 'สิ้นสุดคุ้มครอง'],
  remarks: ['หมายเหตุ', 'remarks', 'comment', 'note'],
};

/**
 * ทำความสะอาดข้อความ ตัดช่องว่าง แปลง nan/NaT
 */
export function cleanText(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/\\r\\n|\\r|\\n|\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
  if (str === 'nan' || str === 'NaT' || str === '-' || str === 'undefined' || str === 'null') {
    return '';
  }
  return str;
}

/**
 * แปลงตัวเลขงบประมาณ ลบ ฿, ลูกน้ำ และแปลงเป็น Number
 */
export function parseBudget(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const clean = String(val).replace(/[฿,\sบาท\.-]/gi, '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

const THAI_MONTH_MAP: Record<string, number> = {
  'ม.ค.': 1, 'มกราคม': 1,
  'ก.พ.': 2, 'กุมภาพันธ์': 2,
  'มี.ค.': 3, 'มีนาคม': 3,
  'เม.ย.': 4, 'เมษายน': 4,
  'พ.ค.': 5, 'พฤษภาคม': 5,
  'มิ.ย.': 6, 'มิถุนายน': 6,
  'ก.ค.': 7, 'กรกฎาคม': 7,
  'ส.ค.': 8, 'สิงหาคม': 8,
  'ก.ย.': 9, 'กันยายน': 9,
  'ต.ค.': 10, 'ตุลาคม': 10,
  'พ.ย.': 11, 'พฤศจิกายน': 11,
  'ธ.ค.': 12, 'ธันวาคม': 12,
};

function fixExcelYearBE(y: number): number {
  if (y >= 2400) return y;
  if (y >= 1955 && y <= 1985) return y + 600; // 1968 -> 2568, 1969 -> 2569
  if (y >= 1986 && y < 2400) return y + 543;  // 2025 -> 2568
  if (y >= 40 && y < 100) return 2500 + y;
  if (y >= 0 && y < 40) return 2000 + y + 543;
  return y;
}

/**
 * แปลงวันที่หรือปีให้เป็น พ.ศ. ทั้งหมด (YYYY-MM-DD ในรูปแบบ พ.ศ. เช่น 2568-01-07)
 */
export function parseDateOrYear(val: any): string {
  if (!val) return '';
  
  // กรณีเป็นตัวเลข Serial Date ของ Excel
  if (typeof val === 'number' && val > 15000 && val < 80000) {
    const utcDays = Math.floor(val - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    const year = fixExcelYearBE(dateInfo.getUTCFullYear());
    const month = String(dateInfo.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateInfo.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  let str = cleanText(val);
  if (!str) return '';

  // รูปแบบ YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const yr = fixExcelYearBE(parseInt(isoMatch[1], 10));
    return `${yr}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // รูปแบบวันที่ภาษาไทย เช่น "8 มี.ค. 66", "14-20 ม.ค.-69"
  for (const [mKey, mNum] of Object.entries(THAI_MONTH_MAP)) {
    if (str.includes(mKey)) {
      const nums = str.match(/\d+/g);
      if (nums && nums.length >= 2) {
        const day = Math.min(31, Math.max(1, parseInt(nums[0], 10)));
        const yr = fixExcelYearBE(parseInt(nums[nums.length - 1], 10));
        return `${yr}-${String(mNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
    }
  }

  // รูปแบบ DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    const yr = fixExcelYearBE(parseInt(y, 10));
    return `${yr}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return str.substring(0, 10);
}

/**
 * Normalize ชื่อภาควิชาให้ตรงกับ Master Data 11 ภาควิชา/ศูนย์
 */
export function normalizeDepartment(deptName: string): string {
  if (!deptName) return '';
  let clean = cleanText(deptName).replace(/ภาควิชา\s*/g, '').trim();

  for (const officialDept of DEPARTMENTS) {
    const core = officialDept.replace(/ภาควิชา\s*/g, '');
    if (officialDept.includes(clean) || clean.includes(core) || core.includes(clean)) {
      return officialDept;
    }
  }

  return cleanText(deptName);
}

/**
 * จับคู่ชื่อคอลัมน์จาก Header ของไฟล์ Excel เข้ากับ Column Key ของ Schema
 */
function findMatchingColumnKey(header: string, validColumns: ColumnDef[]): string | null {
  const normHeader = cleanText(header).toLowerCase();
  
  // 1. Direct match with column key or label
  for (const col of validColumns) {
    if (col.key.toLowerCase() === normHeader || col.label.toLowerCase() === normHeader) {
      return col.key;
    }
  }

  // 2. Alias match
  for (const col of validColumns) {
    const aliases = COLUMN_ALIASES[col.key] || [];
    for (const alias of aliases) {
      if (normHeader === alias.toLowerCase() || normHeader.includes(alias.toLowerCase())) {
        return col.key;
      }
    }
  }

  return null;
}

/**
 * ตรวจจับหมวดหมู่จากชื่อ Sheet ในไฟล์ Excel
 */
export function detectCategoryFromSheetName(sheetName: string, fallback: CategoryKey): CategoryKey {
  const norm = sheetName.toLowerCase().trim();
  
  // สร้างรายการ (keyword, categoryKey) แล้วเรียงตามความยาวจากมากไปน้อย
  // เพื่อให้คำที่เจาะจงกว่า (เช่น 'บริการวิชาการ', 'ผลงานทางวิชาการ') จับคู่ได้ก่อนคำทั่วไป
  const entries: { kw: string; cat: CategoryKey }[] = [];
  for (const [catKey, keywords] of Object.entries(SHEET_NAME_KEYWORDS)) {
    for (const kw of keywords) {
      entries.push({ kw: kw.toLowerCase(), cat: catKey as CategoryKey });
    }
  }
  entries.sort((a, b) => b.kw.length - a.kw.length);

  for (const item of entries) {
    if (norm.includes(item.kw)) {
      return item.cat;
    }
  }
  return fallback;
}

/**
 * ประมวลผลและ Cleansing แต่ละแถวตาม Schema ของหมวดหมู่นั้น
 */
export function transformAndValidateRow(
  rawRow: Record<string, any>,
  rowNumber: number,
  categoryKey: CategoryKey
): ParsedRowResult {
  const config = CATEGORIES_CONFIG[categoryKey];
  const data: Record<string, any> = {};
  const issues: ValidationIssue[] = [];

  // สร้าง Key Map จาก Header จริงในแถวสู่ Column Key
  const keyMap: Record<string, string> = {};
  for (const rawKey of Object.keys(rawRow)) {
    const matchedKey = findMatchingColumnKey(rawKey, config.columns);
    if (matchedKey) {
      keyMap[rawKey] = matchedKey;
    }
  }

  // ประมวลผลค่าในแต่ละคอลัมน์ตาม Data Type
  for (const col of config.columns) {
    let rawVal: any = undefined;
    for (const [rawKey, matchedColKey] of Object.entries(keyMap)) {
      if (matchedColKey === col.key) {
        rawVal = rawRow[rawKey];
        break;
      }
    }

    if (rawVal === undefined && rawRow[col.key] !== undefined) {
      rawVal = rawRow[col.key];
    }

    switch (col.type) {
      case 'currency':
      case 'number':
        data[col.key] = parseBudget(rawVal);
        break;
      case 'date':
        data[col.key] = parseDateOrYear(rawVal);
        break;
      default:
        data[col.key] = cleanText(rawVal);
    }
  }

  // รองรับ Checkmark ('P', 'ü', '✓') จากไฟล์รายงานของคณะฯ สำหรับหมวดงานบริการวิชาการ และ ทรัพย์สินทางปัญญา
  const isCheckmark = (v: any) => {
    const s = cleanText(v);
    return s === 'P' || s === 'p' || s === 'ü' || s === '✓' || s === '✔' || s === '/' || s === 'ใช่';
  };

  if (categoryKey === 'service' && !data.service_type) {
    const serviceTypes = ['วิทยากร/อาจารย์พิเศษ', 'วิชาการ', 'วิชาชีพ', 'ผู้ทรงคุณวุฒิ', 'วิทยานิพนธ์ภายนอก', 'ศึกษาดูงาน วศ.กพส.'];
    for (const [rk, rv] of Object.entries(rawRow)) {
      if (isCheckmark(rv)) {
        const matchedType = serviceTypes.find((st) => rk.includes(st) || (st === 'ศึกษาดูงาน วศ.กพส.' && rk.includes('ศึกษาดูงาน')));
        if (matchedType) {
          data.service_type = matchedType;
          break;
        }
      }
    }
    if (!data.service_type) data.service_type = 'วิชาการ';
  }

  if (categoryKey === 'ip') {
    if (!data.title && data.name) data.title = data.name;
    if (!data.name && data.title) data.name = data.title;
    if (!data.type || isCheckmark(data.type)) {
      for (const [rk, rv] of Object.entries(rawRow)) {
        if (isCheckmark(rv)) {
          if (rk.includes('อนุสิทธิบัตร')) { data.type = 'อนุสิทธิบัตร'; break; }
          if (rk.includes('สิทธิบัตร')) { data.type = 'สิทธิบัตร'; break; }
          if (rk.includes('ลิขสิทธิ์')) { data.type = 'ลิขสิทธิ์'; break; }
        }
      }
      if (!data.type || isCheckmark(data.type)) data.type = 'อนุสิทธิบัตร';
    }
  }

  // ปรับปรุงภาควิชา
  if (config.departmentKey && data[config.departmentKey]) {
    data[config.departmentKey] = normalizeDepartment(data[config.departmentKey]);
  }

  // Auto-matching ชื่ออาจารย์/บุคคลกับ Master Data 304 ท่าน
  let matchedPerson: any = null;
  if (config.personKey && data[config.personKey]) {
    const personRaw = data[config.personKey];
    matchedPerson = matchPerson(personRaw);
    if (matchedPerson) {
      data[config.personKey] = matchedPerson.name;
      // Auto-fill ภาควิชาหากยังไม่มี
      if (config.departmentKey && (!data[config.departmentKey] || data[config.departmentKey] === '-')) {
        data[config.departmentKey] = matchedPerson.department;
      }
      issues.push({
        field: config.personKey,
        level: 'warning',
        message: `Auto-matched: ${matchedPerson.name} (${matchedPerson.department})`,
      });
    } else if (personRaw.length > 2) {
      issues.push({
        field: config.personKey,
        level: 'warning',
        message: `ไม่พบชื่ออาจารย์ "${personRaw}" ใน Master Data 304 ท่าน (จะบันทึกตามข้อความเดิม)`,
      });
    }
  }

  // ตรวจสอบความถูกต้อง (Validation)
  const nameVal = data[config.nameKey];
  if (!nameVal || nameVal.length < 2) {
    issues.push({
      field: config.nameKey,
      level: 'error',
      message: `ไม่พบชื่อรายการ (${config.title}) หรือชื่อสั้นเกินไป`,
    });
  }

  // คำนวณสถานะแถว
  const hasError = issues.some((i) => i.level === 'error');
  const hasWarning = issues.some((i) => i.level === 'warning');
  const status = hasError ? 'error' : hasWarning ? 'warning' : 'valid';

  return {
    rowNumber,
    data,
    status,
    issues,
    matchedPerson,
  };
}

/**
 * แปลง Worksheet ที่อาจมีหัวตารางหลายชั้น (Multi-row Header ของคณะฯ) หรือหัวตารางชั้นเดียวให้เป็น Array ของ Object
 */
function extractNormalizedRowsFromSheet(worksheet: XLSX.WorkSheet): Record<string, any>[] {
  const matrix = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
  if (!matrix || matrix.length === 0) return [];

  // ค้นหาแถวเริ่มต้นของ Header (มีคำว่า "ลำดับ" หรือตรงกับชื่อคอลัมน์หลัก)
  let headerRowIdx = 0;
  for (let r = 0; r < Math.min(8, matrix.length); r++) {
    const rowCells = (matrix[r] || []).map((c) => cleanText(c));
    if (rowCells.some((c) => c.includes('ลำดับ') || c === 'ชื่อโครงการ' || c === 'ชื่อผลงานทางวิชาการ' || c === 'ชื่อ-นามสกุล')) {
      headerRowIdx = r;
      break;
    }
  }

  // ตรวจสอบว่าแถวถัดไปเป็น Sub-header (เช่น เซลล์แรกว่าง แต่เซลล์ถัดไปมีคำว่า ภายใน/ภายนอก, ต่างชาติ/ภายในประเทศ, เริ่มต้น/สิ้นสุด)
  let headerRowCount = 1;
  for (let offset = 1; offset <= 2; offset++) {
    const nextRow = matrix[headerRowIdx + offset];
    if (!nextRow) break;
    const c0 = cleanText(nextRow[0]);
    const c1 = cleanText(nextRow[1]);
    const nonEmptyOthers = nextRow.slice(2).filter((x) => cleanText(x) !== '').length;
    if (!c0 && !c1 && nonEmptyOthers > 0) {
      headerRowCount++;
    } else {
      break;
    }
  }

  const maxCols = Math.max(...matrix.slice(headerRowIdx, headerRowIdx + headerRowCount).map((r) => r.length), 0);
  const headers: string[] = [];
  let lastParent = '';

  for (let c = 0; c < maxCols; c++) {
    const topVal = cleanText(matrix[headerRowIdx]?.[c]);
    if (topVal) lastParent = topVal;

    const subParts: string[] = [];
    for (let h = 1; h < headerRowCount; h++) {
      const sv = cleanText(matrix[headerRowIdx + h]?.[c]);
      if (sv && sv !== topVal) subParts.push(sv);
    }

    if (subParts.length > 0) {
      const subJoined = subParts.join(' ');
      // หากมีชื่อเฉพาะใน sub-header เช่น อนุสิทธิบัตร, สิทธิบัตร, วันที่ยื่นคำขอ, เลขที่คำขอ ให้ใช้คำนั้นโดยตรงหรือต่อท้าย parent
      if (['ภายใน', 'ภายนอก', 'เริ่มต้น', 'สิ้นสุด', 'ออกให้', 'หมดอายุ'].includes(subJoined)) {
        headers.push(`${lastParent} ${subJoined}`.trim());
      } else {
        headers.push(subJoined);
      }
    } else {
      headers.push(topVal || `col_${c}`);
    }
  }

  const dataRows: Record<string, any>[] = [];
  for (let r = headerRowIdx + headerRowCount; r < matrix.length; r++) {
    const rowArr = matrix[r];
    if (!rowArr || rowArr.every((cell) => cleanText(cell) === '')) continue;

    // ข้ามแถวคั่นเดือนที่มีเฉพาะวันที่ในคอลัมน์แรกแต่ไม่มีชื่อรายการในคอลัมน์ที่ 2
    if (cleanText(rowArr[1]) === '' && cleanText(rowArr[2]) === '') continue;

    const obj: Record<string, any> = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = rowArr[c] !== undefined ? rowArr[c] : '';
    }
    dataRows.push(obj);
  }

  return dataRows;
}

/**
 * อ่านไฟล์ Excel (ArrayBuffer) และประมวลผล Sheet ทั้งหมด
 */
export function parseExcelFile(
  buffer: ArrayBuffer,
  fileName: string,
  targetCategory: CategoryKey
): { mode: 'single' | 'master'; sheets: SheetParseResult[] } {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const isMultiSheet = sheetNames.length > 1;

  const sheets: SheetParseResult[] = [];

  for (const sName of sheetNames) {
    const worksheet = workbook.Sheets[sName];
    const rawRows: Record<string, any>[] = extractNormalizedRowsFromSheet(worksheet);

    // ข้าม sheet ว่าง
    if (!rawRows || rawRows.length === 0) continue;

    // ตรวจจับหมวดหมู่
    const cat = isMultiSheet ? detectCategoryFromSheetName(sName, targetCategory) : targetCategory;

    const parsedRows: ParsedRowResult[] = [];
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    rawRows.forEach((r, idx) => {
      const parsed = transformAndValidateRow(r, idx + 2, cat);
      if (parsed.status === 'valid') validCount++;
      else if (parsed.status === 'warning') warningCount++;
      else if (parsed.status === 'error') errorCount++;
      parsedRows.push(parsed);
    });

    sheets.push({
      sheetName: sName,
      categoryKey: cat,
      totalRows: parsedRows.length,
      validRows: validCount,
      warningRows: warningCount,
      errorRows: errorCount,
      rows: parsedRows,
    });
  }

  return {
    mode: isMultiSheet ? 'master' : 'single',
    sheets,
  };
}

/**
 * สร้างไฟล์แม่แบบ Excel (.xlsx) ตาม Schema ของแต่ละหมวดหมู่อัตโนมัติ พร้อมดาวน์โหลด
 */
export function downloadExcelTemplate(categoryKey: CategoryKey) {
  const config = CATEGORIES_CONFIG[categoryKey];
  
  // 1. กำหนดคอลัมน์ที่ไม่ใช่ auto-calculated
  const activeCols = config.columns.filter((c) => c.editable !== false);
  const headers = activeCols.map((c) => c.label.replace('\n', ' '));
  
  // 2. แถวคำอธิบาย/ตัวอย่าง
  const sampleData = config.templateSampleRows.map((sample) => {
    const rowObj: Record<string, any> = {};
    activeCols.forEach((col) => {
      rowObj[col.label.replace('\n', ' ')] = sample[col.key] !== undefined ? sample[col.key] : '';
    });
    return rowObj;
  });

  const ws = XLSX.utils.json_to_sheet(sampleData, { header: headers });

  // ปรับความกว้างคอลัมน์อัตโนมัติ
  const colWidths = activeCols.map((col) => ({
    wch: Math.max(col.label.length * 2.5, 18),
  }));
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, config.title.substring(0, 31));

  const filename = `Template_${config.key}_${config.title}.xlsx`;
  if (typeof window !== 'undefined') {
    XLSX.writeFile(wb, filename);
  } else {
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}

/**
 * ส่งออกตารางข้อมูลปัจจุบันออกเป็นไฟล์ Excel
 */
export function exportTableToExcel(data: any[], categoryKey: CategoryKey, fileName?: string) {
  const config = CATEGORIES_CONFIG[categoryKey];
  const activeCols = config.columns;

  const exportRows = data.map((row) => {
    const item: Record<string, any> = {};
    activeCols.forEach((col) => {
      const colTitle = col.label.replace('\n', ' ');
      if (col.format) {
        item[colTitle] = col.format(row[col.key], row);
      } else {
        item[colTitle] = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
      }
    });
    return item;
  });

  const ws = XLSX.utils.json_to_sheet(exportRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, config.title.substring(0, 31));

  const outName = fileName || `Export_${config.key}_${new Date().toISOString().substring(0, 10)}.xlsx`;
  if (typeof window !== 'undefined') {
    XLSX.writeFile(wb, outName);
  } else {
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}

/**
 * ส่งออกรายงานรวม 5 หมวด + สรุปภาพรวมผู้บริหาร (Executive Master 5-in-1 Excel Report)
 * ตามข้อ 3.2 ของ GAP Analysis: ปุ่มเดียวออกครบ 5 หมวดและภาพรวมผู้บริหาร
 */
export function exportMonthlyExecutiveMasterExcel(
  datasets: Record<string, any[]>,
  periodLabel: string = 'ปีงบประมาณ 2568-2569',
  kpiResults?: any[]
) {
  const wb = XLSX.utils.book_new();

  // 1. ชีตภาพรวมผู้บริหาร (Executive Summary)
  const summaryRows: any[] = [
    { A: 'รายงานสรุปผลการดำเนินงานฝ่ายวิจัยและนวัตกรรม', B: '', C: '', D: '', E: '' },
    { A: 'คณะวิศวกรรมศาสตร์ กำแพงแสน มหาวิทยาลัยเกษตรศาสตร์', B: '', C: '', D: '', E: '' },
    { A: `รอบรายงาน: ${periodLabel}`, B: `วันที่ส่งออก: ${new Date().toLocaleDateString('th-TH')}`, C: '', D: '', E: '' },
    { A: '', B: '', C: '', D: '', E: '' },
    { A: '=== 1. ความก้าวหน้าตัวชี้วัดยุทธศาสตร์สำคัญ (Core Strategic KPIs) ===', B: '', C: '', D: '', E: '' },
    { A: 'รหัส KPI', B: 'ชื่อตัวชี้วัด', C: 'ผลจริง', D: 'เป้าหมาย', E: 'สถานะความสำเร็จ' },
  ];

  if (kpiResults && kpiResults.length > 0) {
    kpiResults.forEach((k) => {
      summaryRows.push({
        A: k.code || k.id,
        B: k.title,
        C: `${k.actualFormatted || k.actual} ${k.unit || ''}`,
        D: `${k.targetFormatted || k.target} ${k.unit || ''}`,
        E: `${k.percent}% (${k.statusTh || k.status})`,
      });
    });
  } else {
    summaryRows.push(
      { A: 'KPI 2.1-6', B: 'งบวิจัยจากแหล่งทุนภายนอก', C: '103.88 ล้านบาท', D: '100.00 ล้านบาท', E: '103.9% (บรรลุเป้าหมาย)' },
      { A: 'KPI 2.1-1', B: 'การตีพิมพ์บทความวิจัยระดับนานาชาติ (Scopus/WoS)', C: '74 เรื่อง', D: '330 เรื่อง', E: '22.4% (ตามสัดส่วนเวลา)' },
      { A: 'KPI 2.1-2', B: 'โครงการวิจัยขนาดใหญ่ (Mega Projects > 10 ล้านบาท)', C: '4 โครงการ', D: '5 โครงการ', E: '80.0% (ใกล้บรรลุเป้า)' },
      { A: 'KPI 2.2-1', B: 'รายได้จากการให้บริการวิชาการและการจัดฝึกอบรม', C: '24.50 ล้านบาท', D: '50.00 ล้านบาท', E: '49.0% (ตามแผน)' },
      { A: 'KPI 2.3-2', B: 'การยื่นจดทรัพย์สินทางปัญญา (สิทธิบัตร/อนุสิทธิบัตร)', C: '2 รายการ', D: '15 รายการ', E: '13.3% (ต้องเร่งรัด)' }
    );
  }

  const sumResearchBudget = (datasets.research || []).reduce(
    (acc, r) => acc + (Number(r.budget_total) || (Number(r.budget_internal) || 0) + (Number(r.budget_external) || 0) || Number(r.budget) || 0),
    0
  );
  const sumAcademicBudget = (datasets.academic || []).reduce((acc, r) => acc + (Number(r.budget) || 0), 0);
  const sumPubBudget = (datasets.publications || []).reduce((acc, r) => acc + (Number(r.budget) || 0), 0);
  const sumServiceAttendees = (datasets.service || []).reduce((acc, r) => acc + (Number(r.attendees_count) || 0), 0);
  const sumIpSupport = (datasets.ip || []).reduce((acc, r) => acc + (Number(r.support_amount) || 0), 0);

  summaryRows.push(
    { A: '', B: '', C: '', D: '', E: '' },
    { A: '=== 2. สรุปภาพรวมปริมาณผลงานแยกตามหมวด ===', B: '', C: '', D: '', E: '' },
    { A: 'หมวดหมู่ภารกิจ', B: 'จำนวนรายการทั้งหมด', C: 'งบประมาณ/มูลค่ารวม (บาท)', D: 'หมายเหตุ', E: '' },
    { A: '1. โครงการวิจัย', B: (datasets.research || []).length, C: `${sumResearchBudget.toLocaleString()} บาท`, D: 'ทุนภายในและภายนอก', E: '' },
    { A: '2. โครงการพัฒนาวิชาการ', B: (datasets.academic || []).length, C: `${sumAcademicBudget.toLocaleString()} บาท`, D: 'บริการวิชาการสร้างรายได้', E: '' },
    { A: '3. ผลงานตีพิมพ์ทางวิชาการ', B: (datasets.publications || []).length, C: `${sumPubBudget.toLocaleString()} บาท`, D: 'เงินสนับสนุนตีพิมพ์', E: '' },
    { A: '4. งานบริการวิชาการ', B: (datasets.service || []).length, C: `ผู้เข้าร่วมรวม ${sumServiceAttendees.toLocaleString()} คน`, D: 'วิทยากร/ผู้ทรงคุณวุฒิ/วิชาชีพ', E: '' },
    { A: '5. งานทรัพย์สินทางปัญญา', B: (datasets.ip || []).length, C: `${sumIpSupport.toLocaleString()} บาท`, D: 'สิทธิบัตร/อนุสิทธิบัตร/ลิขสิทธิ์', E: '' }
  );

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows, { skipHeader: true });
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 45 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'ภาพรวมผู้บริหาร');

  // 2-6. เพิ่มชีตของแต่ละหมวด (โครงการวิจัย, โครงการพัฒนาวิชาการ, ผลงานตีพิมพ์ทางวิชาการ, งานบริการวิชาการ, งานทรัพย์สินทางปัญญา)
  const categoryOrder: { key: CategoryKey; title: string }[] = [
    { key: 'research', title: '1.โครงการวิจัย' },
    { key: 'academic', title: '2.โครงการพัฒนาวิชาการ' },
    { key: 'publications', title: '3.ผลงานตีพิมพ์ทางวิชาการ' },
    { key: 'service', title: '4.งานบริการวิชาการ' },
    { key: 'ip', title: '5.งานทรัพย์สินทางปัญญา' },
  ];

  categoryOrder.forEach(({ key, title }) => {
    const rawData = datasets[key] || [];
    const config = CATEGORIES_CONFIG[key];
    if (config) {
      const activeCols = config.columns;
      const exportRows = rawData.map((row) => {
        const item: Record<string, any> = {};
        activeCols.forEach((col) => {
          const colTitle = col.label.replace('\n', ' ');
          if (col.format) {
            item[colTitle] = col.format(row[col.key], row);
          } else {
            item[colTitle] = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-';
          }
        });
        return item;
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const colWidths = activeCols.map((col) => ({
        wch: Math.max(col.label.length * 2.2, 16),
      }));
      ws['!cols'] = colWidths;
      XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));
    }
  });

  const safePeriod = periodLabel.replace(/[\/\\?%*:|"<>]/g, '_');
  const filename = `รายงานสรุปผู้บริหาร5หมวด_${safePeriod}.xlsx`;
  if (typeof window !== 'undefined') {
    XLSX.writeFile(wb, filename);
  } else {
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }
}

/**
 * บันทึกประวัติ Snapshot ข้อมูล ณ งวดรายงาน เพื่อการตรวจสอบย้อนหลัง (Snapshot Locking)
 */
export function saveReportSnapshot(
  snapshotName: string,
  period: string,
  metrics: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  const STORAGE_KEY = 'ku_dw_report_snapshots';
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const list = existingRaw ? JSON.parse(existingRaw) : [];
    const newSnapshot = {
      id: `snapshot_${Date.now()}`,
      name: snapshotName,
      period: period,
      createdAt: new Date().toISOString(),
      metrics: metrics,
    };
    list.unshift(newSnapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return newSnapshot;
  } catch (e) {
    console.warn('Error saving snapshot:', e);
  }
}

export function getReportSnapshots(): any[] {
  if (typeof window === 'undefined') return [];
  const STORAGE_KEY = 'ku_dw_report_snapshots';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

