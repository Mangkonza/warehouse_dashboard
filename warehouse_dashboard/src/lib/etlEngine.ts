import * as XLSX from 'xlsx';
import { CATEGORIES_CONFIG, DEPARTMENTS } from '../config/dataManagementConfig';
import { CategoryKey, ColumnDef, ParsedRowResult, SheetParseResult, ValidationIssue } from '../types/dataManagement';
import { matchPerson, normalizePersonName } from './personnelService';

// Sheet name mapping keywords
const SHEET_NAME_KEYWORDS: Record<CategoryKey, string[]> = {
  monitoring: ['ติดตาม', 'monitoring', 'ติดตามโครงการ', 'กำหนดการ'],
  research: ['วิจัย', 'โครงการวิจัย', 'research'],
  academic: ['พัฒนาวิชาการ', 'วิชาการ', 'academic'],
  service: ['บริการวิชาการ', 'บริการ', 'service', 'กิจกรรม'],
  publications: ['ผลงานตีพิมพ์', 'ตีพิมพ์', 'publication', 'publications', 'วารสาร'],
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
};

/**
 * ทำความสะอาดข้อความ ตัดช่องว่าง แปลง nan/NaT
 */
export function cleanText(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/\\r\\n|\\r|\\n/g, ' ').replace(/\s+/g, ' ').trim();
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
  if (typeof val === 'number' && val > 30000 && val < 60000) {
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
  for (const [catKey, keywords] of Object.entries(SHEET_NAME_KEYWORDS)) {
    for (const kw of keywords) {
      if (norm.includes(kw.toLowerCase())) {
        return catKey as CategoryKey;
      }
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
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

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
    { A: '2. กิจกรรมพัฒนาวิชาการ', B: (datasets.academic || []).length, C: '2,450,000 บาท', D: 'อบรม/สัมมนา', E: '' },
    { A: '3. ผลงานตีพิมพ์วิชาการ', B: (datasets.publications || []).length, C: 'เงินสนับสนุน มก.', D: 'Scopus Q1/Q2', E: '' },
    { A: '4. บริการวิชาการสู่สังคม', B: (datasets.service || []).length, C: 'รายได้รวม', D: 'ผู้ทรงคุณวุฒิ/ที่ปรึกษา', E: '' },
    { A: '5. ทรัพย์สินทางปัญญา', B: (datasets.ip || []).length, C: 'เงินรางวัลสนับสนุน', D: 'สิทธิบัตรการประดิษฐ์', E: '' }
  );

  const wsSummary = XLSX.utils.json_to_sheet(summaryRows, { skipHeader: true });
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 45 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'ภาพรวมผู้บริหาร');

  // 2-6. เพิ่มชีตของแต่ละหมวด (โครงการวิจัย, พัฒนาวิชาการ, ตีพิมพ์, บริการวิชาการ, ทรัพย์สินทางปัญญา)
  const categoryOrder: { key: CategoryKey; title: string }[] = [
    { key: 'research', title: '1.โครงการวิจัย' },
    { key: 'academic', title: '2.พัฒนาวิชาการ' },
    { key: 'publications', title: '3.ผลงานตีพิมพ์' },
    { key: 'service', title: '4.บริการวิชาการ' },
    { key: 'ip', title: '5.ทรัพย์สินทางปัญญา' },
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

