import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import {
  parseSheetName,
  detectHeaderRow,
  mapColumns,
  parseDateValue,
  parseBudgetValue,
  validateRow,
  isBlankOrSummaryRow,
  computeSummary,
  calculateRowStatus,
  parseWorkbook,
} from './importAcademicDev.etl';
import { ImportRow } from './importAcademicDev.types';

describe('ETL Tests for Academic Development Projects Import', () => {
  // Test 1: Thai Sheet names pattern
  it('1. should parse sheet names "ม.ค.68", "มี.ค. 68", "ธ.ค.68" with correct Buddhist year 2568', () => {
    const s1 = parseSheetName('ม.ค.68');
    expect(s1.isMatch).toBe(true);
    expect(s1.monthNumber).toBe(1);
    expect(s1.monthName).toBe('มกราคม');
    expect(s1.fiscalYearBE).toBe(2568);

    const s2 = parseSheetName('มี.ค. 68');
    expect(s2.isMatch).toBe(true);
    expect(s2.monthNumber).toBe(3);
    expect(s2.monthName).toBe('มีนาคม');
    expect(s2.fiscalYearBE).toBe(2568);

    const s3 = parseSheetName('ธ.ค.68');
    expect(s3.isMatch).toBe(true);
    expect(s3.monthNumber).toBe(12);
    expect(s3.monthName).toBe('ธันวาคม');
    expect(s3.fiscalYearBE).toBe(2568);
  });

  // Test 2: Ignored sheets (e.g. "สรุป")
  it('2. should place sheet named "สรุป" into ignoredSheets', () => {
    const s1 = parseSheetName('สรุป');
    expect(s1.isMatch).toBe(false);

    const s2 = parseSheetName('สรุปผลการดำเนินงาน');
    expect(s2.isMatch).toBe(false);

    const s3 = parseSheetName('Summary 2025');
    expect(s3.isMatch).toBe(false);
  });

  // Test 3: Empty sheet handling
  it('3. should handle an empty sheet returning 0 rows without throwing error', async () => {
    const wb = XLSX.utils.book_new();
    const emptyWs = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, emptyWs, 'ส.ค.68');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const result = await parseWorkbook(buf);

    expect(result.sheets.length).toBe(1);
    expect(result.sheets[0].sheetName).toBe('ส.ค.68');
    expect(result.sheets[0].rowCount).toBe(0);
    expect(result.rows.length).toBe(0);
  });

  // Test 4: Header not on row 1
  it('4. should detect header row when title/banner occupies the first 2 rows', () => {
    const rows = [
      ['สรุปโครงการพัฒนาวิชาการ ประจำปี 2568'],
      ['เดือนมกราคม 2568'],
      [
        'ลำดับที่',
        'ชื่อโครงการ',
        'หัวหน้าโครงการ',
        'หน่วยงานดำเนินการ',
        'ผู้ขอรับบริการ',
        'งบประมาณ',
        'เริ่มต้น',
        'สิ้นสุด',
        'หมายเหตุ',
      ],
      [
        1,
        'โครงการทดสอบระบบคอมพิวเตอร์',
        'ผศ.ดร.จักกริช พฤษการ',
        'ภาควิชาวิศวกรรมคอมพิวเตอร์',
        'กรมส่งเสริมอุตสาหกรรม',
        420000,
        24852,
        25218,
        '-',
      ],
    ];

    const headerIdx = detectHeaderRow(rows);
    expect(headerIdx).toBe(2);

    const colMap = mapColumns(rows[headerIdx]);
    expect(colMap.name).toBe(1);
    expect(colMap.head_name).toBe(2);
    expect(colMap.department_code).toBe(3);
    expect(colMap.client).toBe(4);
    expect(colMap.budget).toBe(5);
    expect(colMap.start_date).toBe(6);
    expect(colMap.end_date).toBe(7);
  });

  // Test 5: Budget values handling
  it('5. should parse budget values: "420,000", "฿ 5,000,000", 420000, "", "abc", -5', () => {
    expect(parseBudgetValue('420,000').value).toBe(420000);
    expect(parseBudgetValue('฿ 5,000,000').value).toBe(5000000);
    expect(parseBudgetValue(420000).value).toBe(420000);
    expect(parseBudgetValue('').value).toBe(0);

    const invalidAlpha = parseBudgetValue('abc');
    expect(invalidAlpha.error).toBeDefined();

    const negative = parseBudgetValue('-5');
    expect(negative.error).toBeDefined();
  });

  // Test 6: Date formats and Excel 1968 bug conversion
  it('6. should correctly parse Date objects, Excel serial (including 1968 -> 2568 BE / 2025 CE), and string dates', () => {
    // 24852 = 1968-01-15 in Excel -> Represents 2568 BE -> 2025-01-15 CE
    const serialResult = parseDateValue(24852);
    expect(serialResult).toBe('2025-01-15');

    // String Buddhist Era: "15/03/2568" -> 2025-03-15 CE
    const beStringResult = parseDateValue('15/03/2568');
    expect(beStringResult).toBe('2025-03-15');

    // String Gregorian Era: "15/03/2025" -> 2025-03-15 CE
    const ceStringResult = parseDateValue('15/03/2025');
    expect(ceStringResult).toBe('2025-03-15');

    // Date object with year 1968
    const d1968 = new Date(1968, 0, 15);
    expect(parseDateValue(d1968)).toBe('2025-01-15');
  });

  // Test 7: Missing required field (name) returns error
  it('7. should return error issue when project name is missing or empty', () => {
    const issues = validateRow({
      name: '',
      head_name: 'ผศ.ดร.ทดสอบ',
      head_personnel_id: 1,
      department_code: 'CPE',
      client: 'กระทรวง',
      budget: 100000,
      start_date: '2025-01-15',
      end_date: '2026-01-15',
      month: 'มกราคม',
      fiscal_year: 2568,
      record_number: '001/68',
      remarks: '',
    });

    const nameIssue = issues.find((i) => i.field === 'name');
    expect(nameIssue).toBeDefined();
    expect(nameIssue?.severity).toBe('error');
  });

  // Test 8: End date < Start date returns error
  it('8. should return error issue when end_date < start_date', () => {
    const issues = validateRow({
      name: 'โครงการวิจัยและพัฒนาวิชาการทดสอบความถูกต้อง',
      head_name: 'ผศ.ดร.ทดสอบ',
      head_personnel_id: 1,
      department_code: 'CPE',
      client: 'กระทรวง',
      budget: 100000,
      start_date: '2025-06-01',
      end_date: '2025-01-01', // Earlier than start_date!
      month: 'มกราคม',
      fiscal_year: 2568,
      record_number: '001/68',
      remarks: '',
    });

    const dateIssue = issues.find((i) => i.field === 'end_date');
    expect(dateIssue).toBeDefined();
    expect(dateIssue?.severity).toBe('error');
    expect(dateIssue?.message).toContain('ไม่ก่อนวัน');
  });

  // Test 9: Blank rows and "รวม" summary rows are skipped
  it('9. should correctly identify and skip blank rows and total/summary rows', () => {
    expect(isBlankOrSummaryRow([])).toBe(true);
    expect(isBlankOrSummaryRow([null, '', '   '])).toBe(true);
    expect(isBlankOrSummaryRow(['รวมทั้งสิ้น', '', '', 5000000])).toBe(true);
    expect(isBlankOrSummaryRow(['Total', 12, 10000000])).toBe(true);

    const normalRow = [1, 'โครงการพัฒนาโปรแกรม', 'ผศ.ดร.ไชยาพงษ์', 'CPE'];
    expect(isBlankOrSummaryRow(normalRow)).toBe(false);
  });

  // Test 10: computeSummary calculation with excluded + duplicate mix
  it('10. should accurately compute summary numbers when rows have ready, error, duplicate, and excluded items', () => {
    const mockRows: ImportRow[] = [
      {
        rowId: 'ม.ค.68-1',
        sheetName: 'ม.ค.68',
        excelRowNumber: 1,
        status: 'ready',
        excluded: false,
        issues: [],
        data: { name: 'P1', head_name: 'H1', head_personnel_id: 1, department_code: 'CPE', client: '', budget: 100, start_date: '2025-01-01', end_date: '2025-12-31', month: 'มกราคม', fiscal_year: 2568, record_number: '', remarks: '' },
      },
      {
        rowId: 'ม.ค.68-2',
        sheetName: 'ม.ค.68',
        excelRowNumber: 2,
        status: 'warning',
        excluded: false,
        issues: [{ field: 'head_name', severity: 'warning', message: 'No match' }],
        data: { name: 'P2', head_name: 'H2', head_personnel_id: null, department_code: 'CPE', client: '', budget: 200, start_date: '2025-01-01', end_date: '2025-12-31', month: 'มกราคม', fiscal_year: 2568, record_number: '', remarks: '' },
      },
      {
        rowId: 'ม.ค.68-3',
        sheetName: 'ม.ค.68',
        excelRowNumber: 3,
        status: 'error',
        excluded: false,
        issues: [{ field: 'name', severity: 'error', message: 'Missing name' }],
        data: { name: '', head_name: 'H3', head_personnel_id: null, department_code: 'CPE', client: '', budget: 0, start_date: '2025-01-01', end_date: '2025-12-31', month: 'มกราคม', fiscal_year: 2568, record_number: '', remarks: '' },
      },
      {
        rowId: 'ก.พ.68-1',
        sheetName: 'ก.พ.68',
        excelRowNumber: 1,
        status: 'duplicate',
        excluded: false,
        duplicateOf: 'Duplicate with DB',
        issues: [],
        data: { name: 'P4', head_name: 'H4', head_personnel_id: 2, department_code: 'ME', client: '', budget: 50, start_date: '2025-02-01', end_date: '2025-12-31', month: 'กุมภาพันธ์', fiscal_year: 2568, record_number: '', remarks: '' },
      },
      {
        rowId: 'ก.พ.68-2',
        sheetName: 'ก.พ.68',
        excelRowNumber: 2,
        status: 'excluded',
        excluded: true,
        issues: [],
        data: { name: 'P5', head_name: 'H5', head_personnel_id: 3, department_code: 'IE', client: '', budget: 500, start_date: '2025-02-01', end_date: '2025-12-31', month: 'กุมภาพันธ์', fiscal_year: 2568, record_number: '', remarks: '' },
      },
    ];

    const summary = computeSummary(mockRows);
    expect(summary.total).toBe(5);
    expect(summary.ready).toBe(2); // P1 (ready) + P2 (warning)
    expect(summary.willImport).toBe(2);
    expect(summary.needsFix).toBe(1); // P3
    expect(summary.needsReview).toBe(1); // P2
    expect(summary.duplicate).toBe(1); // P4
    expect(summary.excluded).toBe(1); // P5
  });

  // Test 11: Real file integration test
  it('11. should parse real "โครงการพัฒนาวิชาการ 2568.xlsx" without crashing', async () => {
    const fs = await import('fs');
    const path = 'D:/Data warehoues/Project/data/โครงการพัฒนาวิชาการ 2568.xlsx';
    if (fs.existsSync(path)) {
      const buf = fs.readFileSync(path);
      const result = await parseWorkbook(buf);
      expect(result.sheets.length).toBeGreaterThan(5);
      expect(result.rows.length).toBeGreaterThan(0);
      const summary = computeSummary(result.rows);
      expect(summary.total).toBe(result.rows.length);
      console.log('Real file summary:', {
        total: summary.total,
        willImport: summary.willImport,
        needsFix: summary.needsFix,
        needsReview: summary.needsReview,
      });
    }
  });
});
