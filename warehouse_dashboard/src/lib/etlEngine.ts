import * as XLSX from 'xlsx';
import { CATEGORIES_CONFIG, DEPARTMENTS } from '../config/dataManagementConfig';
import { CategoryKey, ColumnDef, ParsedRowResult, SheetParseResult, ValidationIssue } from '../types/dataManagement';
import { matchPerson, normalizePersonName } from './personnelService';

// Sheet name mapping keywords
const SHEET_NAME_KEYWORDS: Record<CategoryKey, string[]> = {
  monitoring: ['ติดตามโครงการ', 'ติดตาม', 'monitoring', 'กำหนดการ'],
  research: ['โครงการวิจัย', 'วิจัย', 'research'],
  academic: ['โครงการพัฒนาวิชาการ', 'พัฒนาวิชาการ', 'academic'],
  service: ['งานบริการวิชาการ', 'บริการวิชาการ', 'ผลงานบริการ', 'บริการ', 'service', 'กิจกรรม'],
  publications: ['ผลงานทางวิชาการ', 'ผลงานตีพิมพ์', 'ตีพิมพ์', 'publication', 'publications', 'วารสาร'],
  ip: ['งานทรัพย์สินทางปัญญา', 'ทรัพย์สินทางปัญญา', 'ทรัพย์สิน', 'ip', 'สิทธิบัตร', 'อนุสิทธิบัตร', 'ลิขสิทธิ์'],
  personnel: ['บุคลากร', 'อาจารย์', 'personnel', 'faculty', 'เจ้าหน้าที่'],
  kpi: ['ตัวชี้วัด', 'kpi', 'ยุทธศาสตร์', 'เป้าหมาย'],
  user_roles: ['สิทธิ์ผู้ใช้', 'สิทธิ์', 'บทบาท', 'users', 'roles'],
};

// Column aliases for resilient header matching
const COLUMN_ALIASES: Record<string, string[]> = {
  id: ['รหัสโครงการวิจัย', 'รหัสโครงการ', 'รหัส', 'code', 'id', 'project_id'],
  seq_no: ['ลำดับที่', 'ลำดับ', 'no', 'ที่'],
  name: ['ชื่อโครงการวิจัย', 'ชื่อโครงการ', 'ชื่อผลงานทางวิชาการ', 'ชื่อผลงาน', 'ชื่อกิจกรรม', 'ชื่อการประดิษฐ์', 'ชื่อเรื่อง', 'เรื่อง', 'title', 'project_name'],
  status: ['สถานะโครงการ', 'สถานะคำขอ', 'สถานะ', 'status', 'project_status'],
  sdg_code: ['sdgs', 'sdg', 'เป้าหมายความยั่งยืน', 'green_metric'],
  doi: ['หมายเลข doi', 'doi'],
  head: ['หัวหน้าโครงการวิจัย', 'หัวหน้าโครงการ', 'หัวหน้า', 'pi', 'project_leader', 'head'],
  person: ['ชื่อ - นามสกุล', 'ชื่อ-นามสกุล', 'ชื่อ - สกุล', 'ผู้รับผิดชอบ', 'ผู้จัด', 'person', 'responsible'],
  owner: ['เจ้าของผลงาน', 'เจ้าของสิทธิ', 'เจ้าของลิขสิทธิ์', 'ผู้แต่ง', 'ผู้ประพันธ์', 'owner', 'author'],
  creator: ['ผู้ประดิษฐ์', 'ผู้สร้างสรรค์', 'creator', 'inventor'],
  department: ['หน่วยงานรับผิดชอบ', 'หน่วยงานดำเนินการ', 'สังกัดภาควิชา/สาขาวิชา', 'ภาควิชา/ศูนย์ฯ', 'ภาควิชา', 'สังกัด', 'หน่วยงาน', 'department', 'dept'],
  budget_internal: ['งบประมาณภายใน', 'งบประมาณ ภายใน', 'งบภายใน', 'internal_budget', 'ทุนภายใน'],
  budget_external: ['งบประมาณภายนอก', 'งบประมาณ ภายนอก', 'งบภายนอก', 'external_budget', 'ทุนภายนอก'],
  budget: ['จำนวนเงินสนับสนุน', 'งบประมาณ', 'จำนวนเงิน', 'เงินสนับสนุน', 'budget', 'amount', 'งบ'],
  fund_source: ['แหล่งทุนวิจัย', 'แหล่งเงินทุน', 'แหล่งทุน', 'fund_source', 'sponsor'],
  month: ['ช่วงเวลา', 'เดือน', 'month', 'period'],
  client: ['ผู้ขอรับบริการ', 'ผู้ว่าจ้าง', 'ว่าจ้าง', 'ลูกค้า', 'client', 'customer'],
  date: ['วัน/เดือน/ปี ที่จัด', 'วัน/เดือน/ปี', 'วันจัดกิจกรรม', 'วันที่', 'date'],
  start_date: ['ระยะเวลาเริ่มดำเนินการ', 'วันที่เริ่มต้น', 'วันเริ่มต้น', 'เริ่มโครงการ', 'start_date', 'start_date_be', 'start'],
  end_date: ['ระยะเวลาสิ้นสุดการดำเนินการ', 'วันที่สิ้นสุด', 'วันสิ้นสุด', 'สิ้นสุดโครงการ', 'end_date', 'end_date_be', 'end'],
  service_type: ['ประเภทการบริการ', 'หมวดการบริการ', 'ประเภท', 'service_type', 'service_category'],
  hours_spent: ['จำนวนชั่วโมง', 'ชั่วโมง', 'hours', 'hours_spent'],
  attendees_count: ['จำนวนคนเข้าร่วม', 'จำนวนผู้เข้าร่วม', 'ผู้เข้าร่วม', 'attendees', 'attendees_count', 'participants'],
  record_number: ['เลขระเบียนโครงการ', 'เลขระเบียน', 'record_number', 'record_no'],
  co_members_internal: ['ผู้ร่วมภายใน', 'co_members_internal', 'co_internal'],
  co_members_external: ['ผู้ร่วมภายนอก', 'co_members_external', 'co_external'],
  co_authors_foreign: ['ผู้แต่งต่างชาติ', 'ผู้ร่วมต่างชาติ', 'co_authors_foreign', 'ต่างชาติ'],
  co_authors_domestic: ['ผู้แต่งในประเทศ', 'ผู้ร่วมในประเทศ', 'co_authors_domestic', 'ในประเทศ'],
  co_researchers: ['ผู้ร่วมวิจัย', 'ผู้ร่วมโครงการ', 'ผู้ร่วม', 'co_researchers', 'members'],
  type: ['ประเภททรัพย์สินทางปัญญา', 'ประเภท ทรัพย์สินทางปัญญา', 'ชนิดของผลงาน', 'ประเภทผลงาน', 'ประเภท', 'type', 'category'],
  level: ['ฐานข้อมูล', 'ระดับ', 'level', 'quartile', 'tier'],
  journal: ['แหล่งตีพิมพ์', 'วารสาร', 'journal', 'publisher'],
  volume: ['volume', 'เล่มที่', 'ปีที่'],
  issue: ['issue', 'ฉบับที่'],
  page_start: ['หน้าเริ่มต้น', 'page_start'],
  page_end: ['หน้าสิ้นสุด', 'page_end'],
  trl: ['ระดับ trl', 'ระดับtrl', 'trl_level', 'trl'],
  project_nature: ['ลักษณะโครงการ', 'project_nature'],
  characteristics: ['ลักษณะงาน', 'characteristics'],
  inventors: ['ผู้ประดิษฐ์ร่วม', 'inventors'],
  fiscal_year_be: ['ปีงบประมาณ', 'ปี พ.ศ.', 'fiscal_year', 'fiscal_year_be'],
  req_no: ['เลขที่คำขอ', 'เลขที่สิทธิบัตร', 'req_no', 'patent_no'],
  title_th: ['คำนำหน้านาม', 'คำนำหน้า', 'title', 'prefix'],
  position: ['ตำแหน่งวิชาการ', 'ตำแหน่ง', 'position', 'role'],
  email: ['อีเมล', 'e-mail', 'email'],
  target_group: ['กลุ่มเป้าหมาย', 'ผู้เข้าร่วม', 'target_group', 'audience'],
  image_url: ['รูปภาพประจำตัว', 'รูปโปรไฟล์', 'รูปภาพ', 'รูปถ่าย', 'รูป', 'image', 'picture', 'photo', 'avatar', 'image_url'],
  support_amount: ['เงินสนับสนุนจากคณะ (บาท)', 'เงินรางวัลสนับสนุน', 'คณะฯ สนับสนุน', 'คณะฯสนับสนุน', 'คณะสนับสนุน', 'เงินสนับสนุน', 'support_amount'],
  application_number: ['ขั้นตอนดำเนินการ เลขที่คำขอ', 'คำขอแจ้งข้อมูลเลขที่', 'คำขอเลขที่', 'เลขที่คำขอ', 'เลขคำขอ', 'application_number', 'app_no', 'req_info'],
  registration_number: ['ได้รับความคุ้มครอง เลขที่', 'ทะเบียนข้อมูลเลขที่', 'เลขที่ทะเบียน', 'เลขที่สิทธิบัตร', 'เลขทะเบียน', 'registration_number', 'reg_no', 'เลขที่', 'reg_info'],
  work_category: ['ประเภทงานลิขสิทธิ์', 'หมวดหมู่งาน', 'ประเภทงาน', 'work_category'],
  work_character: ['ลักษณะงานลิขสิทธิ์', 'ลักษณะงาน', 'work_character'],
  filing_date: ['ขั้นตอนดำเนินการ วันที่ยื่นคำขอ', 'วันที่ยื่นคำขอ', 'ยื่นคำขอ', 'วันที่ยื่น', 'filing_date'],
  protection_start: ['วันที่เริ่มต้น', 'เริ่มคุ้มครอง', 'protection_start'],
  protection_end: ['ได้รับความคุ้มครอง ระยะเวลาความคุ้มครอง', 'ระยะเวลาความคุ้มครอง', 'วันที่สิ้นสุด', 'สิ้นสุดคุ้มครอง', 'protection_end'],
  integration: ['การบูรณาการ', 'บูรณาการ', 'การนำความรู้'],
  remarks: ['หมายเหตุ', 'remarks', 'comment', 'note'],
};

// Flatten and sort aliases by length descending for accurate longest-match-first resolution
const ALL_ALIASES_SORTED: { key: string; alias: string; norm: string }[] = [];
for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
  for (const alias of aliases) {
    ALL_ALIASES_SORTED.push({ key, alias, norm: alias.toLowerCase().trim() });
  }
}
ALL_ALIASES_SORTED.sort((a, b) => b.norm.length - a.norm.length);

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

/**
 * แปลงวันที่หรือปี พ.ศ. เป็น ค.ศ. (ลบ 543) และจัดรูปแบบ
 */
export function parseDateOrYear(val: any): string {
  if (!val) return '';
  
  // กรณีเป็นตัวเลข Serial Date ของ Excel
  if (typeof val === 'number' && val > 10000 && val < 70000) {
    const utcDays = Math.floor(val - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    const year = dateInfo.getFullYear();
    const month = String(dateInfo.getMonth() + 1).padStart(2, '0');
    const day = String(dateInfo.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  let str = cleanText(val);
  if (!str) return '';

  // ตรวจจับปี พ.ศ. 256x หรือ 25xx แล้วแปลงเป็น ค.ศ.
  const beYearMatch = str.match(/\b(25[4-8][0-9])\b/);
  if (beYearMatch) {
    const beYear = parseInt(beYearMatch[1], 10);
    const ceYear = beYear - 543;
    str = str.replace(beYearMatch[1], String(ceYear));
  }

  // รูปแบบ DD/MM/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
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
/**
 * จับคู่ชื่อคอลัมน์จาก Header ของไฟล์ Excel เข้ากับ Column Key ของ Schema
 */
function findMatchingColumnKey(header: string, validColumns: ColumnDef[]): string | null {
  const normHeader = cleanText(header).toLowerCase();
  if (!normHeader) return null;

  // 1. Direct match with column key or label
  for (const col of validColumns) {
    const colKeyNorm = col.key.toLowerCase();
    const colLabelNorm = cleanText(col.label).toLowerCase();
    if (colKeyNorm === normHeader || colLabelNorm === normHeader) {
      return col.key;
    }
  }

  // 2. Protection against integration overriding project name
  if (normHeader.includes('การบูรณาการ') || normHeader.includes('บูรณาการ')) {
    return 'integration';
  }

  // 3. Exact alias match
  for (const item of ALL_ALIASES_SORTED) {
    if (normHeader === item.norm) {
      return item.key;
    }
  }

  // 4. Exact alias match without whitespace
  const noSpace = normHeader.replace(/\s+/g, '');
  for (const item of ALL_ALIASES_SORTED) {
    if (noSpace === item.norm.replace(/\s+/g, '')) {
      return item.key;
    }
  }

  // 5. Longest substring alias match
  for (const item of ALL_ALIASES_SORTED) {
    if (normHeader.includes(item.norm)) {
      return item.key;
    }
  }

  return null;
}

/**
 * ตรวจจับหมวดหมู่จากชื่อ Sheet ในไฟล์ Excel
 */
export function detectCategoryFromSheetName(sheetName: string, fallback: CategoryKey): CategoryKey {
  const norm = sheetName.toLowerCase().trim();
  const candidates: { cat: CategoryKey; len: number }[] = [];
  for (const [catKey, keywords] of Object.entries(SHEET_NAME_KEYWORDS)) {
    for (const kw of keywords) {
      if (norm.includes(kw.toLowerCase())) {
        candidates.push({ cat: catKey as CategoryKey, len: kw.length });
      }
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.len - a.len);
    return candidates[0].cat;
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

  // 1. นำข้อมูลทุกฟิลด์จาก rawRow มาจับคู่ alias และทำความสะอาด
  for (const [rawKey, rawVal] of Object.entries(rawRow)) {
    if (rawVal === undefined || rawVal === null || rawVal === '') continue;

    const matchedKey = findMatchingColumnKey(rawKey, config.columns);
    const targetKey = matchedKey || rawKey;

    const colDef = config.columns.find((c) => c.key === targetKey);
    const isCurrencyOrNumber =
      colDef?.type === 'currency' ||
      colDef?.type === 'number' ||
      colDef?.type === 'research_budget' ||
      colDef?.type === 'academic_budget' ||
      [
        'budget',
        'budget_internal',
        'budget_external',
        'support_amount',
        'hours_spent',
        'attendees_count',
        'co_members_internal',
        'co_members_external',
        'fiscal_year_be',
      ].includes(targetKey);

    const isDate =
      colDef?.type === 'date' ||
      ['date', 'start_date', 'end_date', 'filing_date', 'protection_start', 'protection_end'].includes(targetKey);

    if (isCurrencyOrNumber) {
      data[targetKey] = parseBudget(rawVal);
    } else if (isDate) {
      data[targetKey] = parseDateOrYear(rawVal);
    } else {
      data[targetKey] = cleanText(rawVal);
    }
  }

  // Fallback รหัสโครงการจากเลขลำดับหากไม่มีรหัสระบุ
  if ((!data.id || data.id === '-') && data.seq_no) {
    data.id = String(data.seq_no);
  }

  // 2. คำนวณงบประมาณพิเศษตามประเภทหมวด
  if (categoryKey === 'research') {
    const internal = parseBudget(data.budget_internal || 0);
    const external = parseBudget(data.budget_external || 0);
    if ((internal > 0 || external > 0) && (!data.budget || data.budget === 0)) {
      data.budget = internal + external;
    } else if (data.budget && !data.budget_internal && !data.budget_external) {
      data.budget = parseBudget(data.budget);
    }
  } else if (categoryKey === 'academic') {
    if (data.budget !== undefined) {
      data.budget = parseBudget(data.budget);
    }
  }

  // 3. ปรับปรุงภาควิชา
  if (config.departmentKey && data[config.departmentKey]) {
    data[config.departmentKey] = normalizeDepartment(data[config.departmentKey]);
  }

  // 4. Auto-matching ชื่ออาจารย์/บุคคลกับ Master Data 304 ท่าน
  let matchedPerson: any = null;
  if (config.personKey && data[config.personKey]) {
    const personRaw = String(data[config.personKey]).trim();
    matchedPerson = matchPerson(personRaw);
    if (matchedPerson) {
      data[config.personKey] = matchedPerson.name;
      // Auto-fill ภาควิชาหากยังไม่มี
      if (config.departmentKey && (!data[config.departmentKey] || data[config.departmentKey] === '-')) {
        data[config.departmentKey] = matchedPerson.department;
      }
      // หมายเหตุ: การจับคู่บุคลากรสำเร็จถือเป็นข้อมูลสมบูรณ์ (Valid) ไม่ปรับสถานะเป็น Warning
    } else if (personRaw.length > 2 && personRaw !== '-' && personRaw !== 'nan') {
      issues.push({
        field: config.personKey,
        level: 'warning',
        message: `ไม่พบชื่ออาจารย์ "${personRaw}" ในฐานข้อมูลบุคลากร 304 ท่าน (จะบันทึกตามข้อความเดิม)`,
      });
    }
  }

  // 5. ตรวจสอบความถูกต้อง (Validation)
  const nameVal = data[config.nameKey] || data.name || data.title;
  if (!nameVal || String(nameVal).trim().length < 2 || nameVal === 'nan' || nameVal === 'NaT') {
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
 * ตรวจสอบว่าเป็นแถวที่ควรข้ามหรือไม่ (แถวว่าง, แถวหัวตารางย่อย, แถวสรุปที่ไม่มีข้อมูลจริง)
 */
export function isIgnorableExcelRow(
  rawRow: Record<string, any>,
  data: Record<string, any>,
  categoryKey: CategoryKey
): boolean {
  const config = CATEGORIES_CONFIG[categoryKey];
  const nameVal = data[config.nameKey] || data.name || data.title;
  const personVal = config.personKey ? data[config.personKey] : null;

  const hasName = Boolean(nameVal && String(nameVal).trim().length >= 2 && nameVal !== '-' && nameVal !== 'nan');
  const hasPerson = Boolean(personVal && String(personVal).trim().length >= 2 && personVal !== '-' && personVal !== 'nan');

  // ถ้าไม่มีทั้งชื่อรายการ และไม่มีชื่อผู้รับผิดชอบ/อาจารย์
  if (!hasName && !hasPerson) {
    return true;
  }

  // ตรวจสอบกรณีแถวที่มีเฉพาะข้อความหัวตารางย่อย เช่น "ออกให้", "หมดอายุ", "ยอดรวม"
  const rawValues = Object.values(rawRow).map((v) => String(v).trim()).filter(Boolean);
  const subheaders = ['ออกให้', 'หมดอายุ', 'ลำดับที่', 'หมายเหตุ', '.', '-', 'รวม', 'ยอดรวม', 'ในประเทศ', 'ต่างประเทศ'];
  const meaningfulValues = rawValues.filter((v) => !subheaders.includes(v) && v.length >= 2);
  if (meaningfulValues.length === 0) {
    return true;
  }

  return false;
}

/**
 * ตรวจสอบว่าข้อมูลแถวใหม่ซ้ำกับข้อมูลที่มีอยู่ในฐานข้อมูลเดิมหรือไม่
 */
export function findExistingDuplicate(
  incoming: Record<string, any>,
  existingList: Record<string, any>[],
  categoryKey: CategoryKey
): Record<string, any> | null {
  if (!existingList || existingList.length === 0) return null;
  const conf = CATEGORIES_CONFIG[categoryKey];

  const incName = String(incoming[conf.nameKey] || incoming.name || incoming.title || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\r\n]/g, '');

  const incReg = String(incoming.reg_info || incoming.req_info || incoming.patent_no || incoming.id || '')
    .trim()
    .toLowerCase();

  const incDoi = String(incoming.doi || '').trim().toLowerCase();

  return (
    existingList.find((ex) => {
      // 1. Match by registration / request number / patent number (IP)
      if (incReg && incReg !== '-' && incReg !== 'nan') {
        const exReg = String(ex.reg_info || ex.req_info || ex.patent_no || ex.id || '')
          .trim()
          .toLowerCase();
        if (exReg && exReg === incReg) return true;
      }

      // 2. Match by DOI (Publications)
      if (incDoi && incDoi !== '-' && incDoi !== 'nan') {
        const exDoi = String(ex.doi || '').trim().toLowerCase();
        if (exDoi && exDoi === incDoi) return true;
      }

      // 3. Match by Project ID (Research, Academic, Service)
      if (incoming.id && String(incoming.id).trim().length >= 3) {
        const exId = String(ex.id || '').trim().toLowerCase();
        if (exId === String(incoming.id).trim().toLowerCase()) return true;
      }

      // 4. Match by exact normalized title + person
      if (incName && incName.length >= 4) {
        const exName = String(ex[conf.nameKey] || ex.name || ex.title || '')
          .trim()
          .toLowerCase()
          .replace(/[\s\r\n]/g, '');
        if (exName === incName) {
          const incPerson = String(conf.personKey ? incoming[conf.personKey] : '')
            .trim()
            .toLowerCase();
          const exPerson = String(
            conf.personKey ? ex[conf.personKey] : ex.person || ex.head || ex.creator || ex.author || ''
          )
            .trim()
            .toLowerCase();
          if (
            !incPerson ||
            !exPerson ||
            incPerson === exPerson ||
            exPerson.includes(incPerson) ||
            incPerson.includes(exPerson)
          ) {
            return true;
          }
        }
      }

      return false;
    }) || null
  );
}

/**
 * อ่านไฟล์ Excel (ArrayBuffer) และประมวลผล Sheet ทั้งหมด
 */
export function parseExcelFile(
  buffer: ArrayBuffer,
  fileName: string,
  targetCategory: CategoryKey,
  existingRecordsOrDatasets?: Record<string, any>[] | Partial<Record<CategoryKey, Record<string, any>[]>>
): { mode: 'single' | 'master'; sheets: SheetParseResult[] } {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetNames = workbook.SheetNames;
  const isMultiSheet = sheetNames.length > 1;

  const sheets: SheetParseResult[] = [];

  for (const sName of sheetNames) {
    const worksheet = workbook.Sheets[sName];
    const matrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    // ข้าม sheet ว่าง
    if (!matrix || matrix.length === 0) continue;

    // ตรวจจับหมวดหมู่
    const cat = isMultiSheet ? detectCategoryFromSheetName(sName, targetCategory) : targetCategory;
    const config = CATEGORIES_CONFIG[cat];

    // ดึง existingRecords สำหรับหมวดหมู่นี้
    let existingRecords: Record<string, any>[] = [];
    if (Array.isArray(existingRecordsOrDatasets)) {
      existingRecords = existingRecordsOrDatasets;
    } else if (existingRecordsOrDatasets && typeof existingRecordsOrDatasets === 'object') {
      const records = (existingRecordsOrDatasets as Record<string, Record<string, any>[]>)[cat];
      if (Array.isArray(records)) {
        existingRecords = records;
      }
    }

    // 1. ตรวจจับตำแหน่ง Header row(s) โดยการนับคะแนนคอลัมน์ที่ตรงกับ Schema
    let bestRowIdx = 0;
    let maxMatches = 0;
    for (let r = 0; r < Math.min(12, matrix.length); r++) {
      const row = matrix[r] || [];
      let matches = 0;
      for (const cell of row) {
        if (findMatchingColumnKey(String(cell || ''), config.columns)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestRowIdx = r;
      }
    }

    // ตรวจสอบว่าแถวถัดไปเป็นแถวหัวตารางย่อย (Sub-headers จาก Merged Header) หรือไม่
    const headerRows = [bestRowIdx];
    if (bestRowIdx + 1 < matrix.length) {
      const nextRow = matrix[bestRowIdx + 1] || [];
      let nextRowMatches = 0;
      for (const cell of nextRow) {
        if (findMatchingColumnKey(String(cell || ''), config.columns)) {
          nextRowMatches++;
        }
      }
      const firstCell = String(nextRow[0] || '').trim();
      const isLikelyData = /^\d+$/.test(firstCell) || firstCell.startsWith('วศ.') || firstCell.length > 25;
      if (nextRowMatches >= 2 && !isLikelyData) {
        headerRows.push(bestRowIdx + 1);
      }
    }

    // สร้าง Header แบบผสมผสาน (Combined Headers)
    const maxCols = Math.max(...matrix.slice(0, 15).map((r) => (r ? r.length : 0)));
    const finalHeaders: string[] = [];
    let lastParentHeader = '';

    for (let c = 0; c < maxCols; c++) {
      const top = cleanText(matrix[headerRows[0]]?.[c]);
      if (top) lastParentHeader = top;
      const sub = headerRows.length > 1 ? cleanText(matrix[headerRows[1]]?.[c]) : '';

      let combined = '';
      if (top && sub) {
        combined = `${top} ${sub}`;
      } else if (sub && lastParentHeader) {
        combined = `${lastParentHeader} ${sub}`;
      } else {
        combined = top || sub || `col_${c}`;
      }
      finalHeaders.push(combined);
    }

    const dataStartRow = headerRows[headerRows.length - 1] + 1;
    const parsedRows: ParsedRowResult[] = [];
    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    let displayRowIndex = 1;
    const seenSignatures = new Map<string, number>();

    for (let r = dataStartRow; r < matrix.length; r++) {
      const rowArr = matrix[r] || [];
      const nonEmpties = rowArr.filter((c: any) => cleanText(c) !== '');
      if (nonEmpties.length === 0) continue;

      const rawRow: Record<string, any> = {};
      for (let c = 0; c < maxCols; c++) {
        const h = finalHeaders[c] || `col_${c}`;
        rawRow[h] = rowArr[c] !== undefined ? rowArr[c] : '';
      }

      const parsed = transformAndValidateRow(rawRow, displayRowIndex, cat);

      // กรองแถวว่าง แถวหัวตารางย่อย และแถวขยะออก ไม่นำเข้าสู่ระบบ
      if (isIgnorableExcelRow(rawRow, parsed.data, cat)) {
        continue;
      }

      parsed.rowNumber = displayRowIndex++;

      // ตรวจสอบข้อมูลซ้ำซ้อนภายในแผ่นงาน (Intra-sheet Duplicate Detection)
      const conf = CATEGORIES_CONFIG[cat];
      const titleStr = String(parsed.data[conf.nameKey] || parsed.data.name || parsed.data.title || '')
        .trim()
        .toLowerCase()
        .replace(/[\s\r\n]/g, '');
      const regStr = String(parsed.data.reg_info || parsed.data.req_info || parsed.data.id || '')
        .trim()
        .toLowerCase();
      const personStr = String(conf.personKey ? parsed.data[conf.personKey] : '')
        .trim()
        .toLowerCase()
        .replace(/[\s\r\n]/g, '');

      if (titleStr.length >= 3) {
        const sig = regStr && regStr !== '-' && regStr !== 'nan'
          ? `${titleStr}__${regStr}`
          : `${titleStr}__${personStr}`;

        if (seenSignatures.has(sig)) {
          const prevRow = seenSignatures.get(sig);
          parsed.issues.push({
            field: conf.nameKey,
            level: 'warning',
            message: `ข้อมูลซ้ำ: ตรวจพบรายการซ้ำกับแถวที่ ${prevRow} (ชื่อและเลขทะเบียนตรงกัน)`,
          });
          if (parsed.status === 'valid') {
            parsed.status = 'warning';
          }
        } else {
          seenSignatures.set(sig, parsed.rowNumber);
        }
      }

      // ตรวจสอบข้อมูลซ้ำกับฐานข้อมูลเดิม (Database Cross-check)
      if (existingRecords && existingRecords.length > 0) {
        const dbMatch = findExistingDuplicate(parsed.data, existingRecords, cat);
        if (dbMatch) {
          const matchLabel = dbMatch[conf.nameKey] || dbMatch.name || dbMatch.title || 'ข้อมูลเดิม';
          const matchCode = dbMatch.reg_info || dbMatch.id || dbMatch.doi || '';
          parsed.issues.push({
            field: conf.nameKey,
            level: 'warning',
            message: `มีข้อมูลนี้อยู่ในระบบแล้ว: "${matchLabel}" ${matchCode ? `(${matchCode})` : ''}`,
          });
          parsed.isExistingDuplicate = true;
          if (parsed.status === 'valid') {
            parsed.status = 'warning';
          }
        }
      }

      if (parsed.status === 'valid') validCount++;
      else if (parsed.status === 'warning') warningCount++;
      else if (parsed.status === 'error') errorCount++;
      parsedRows.push(parsed);
    }

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

  XLSX.writeFile(wb, `Template_${config.key}_${config.title}.xlsx`);
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
      } else if (col.type === 'ip_req_info') {
        item[colTitle] = row.application_number || row.req_no || '-';
      } else if (col.type === 'ip_reg_info') {
        item[colTitle] = row.registration_number || row.reg_no || '-';
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
  XLSX.writeFile(wb, outName);
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

  summaryRows.push(
    { A: '', B: '', C: '', D: '', E: '' },
    { A: '=== 2. สรุปภาพรวมปริมาณผลงานแยกตามหมวด ===', B: '', C: '', D: '', E: '' },
    { A: 'หมวดหมู่ภารกิจ', B: 'จำนวนรายการทั้งหมด', C: 'งบประมาณ/มูลค่ารวม (บาท)', D: 'หมายเหตุ', E: '' },
    { A: '1. โครงการวิจัย', B: (datasets.research || []).length, C: '104,480,000 บาท', D: 'ทุนภายนอก 99%', E: '' },
    { A: '2. โครงการพัฒนาวิชาการ', B: (datasets.academic || []).length, C: '2,450,000 บาท', D: 'อบรม/สัมมนา', E: '' },
    { A: '3. ผลงานตีพิมพ์ทางวิชาการ', B: (datasets.publications || []).length, C: 'เงินสนับสนุน มก.', D: 'Scopus Q1/Q2', E: '' },
    { A: '4. งานบริการวิชาการ', B: (datasets.service || []).length, C: 'รายได้รวม', D: 'ผู้ทรงคุณวุฒิ/ที่ปรึกษา', E: '' },
    { A: '5. งานทรัพย์สินทางปัญญา', B: (datasets.ip || []).length, C: 'เงินรางวัลสนับสนุน', D: 'สิทธิบัตรการประดิษฐ์', E: '' }
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
  XLSX.writeFile(wb, `รายงานสรุปผู้บริหาร5หมวด_${safePeriod}.xlsx`);
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

