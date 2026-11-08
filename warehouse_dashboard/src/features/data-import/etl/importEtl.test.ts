import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  detectCategory,
  parseDateUniversal,
  validateRowUniversal,
  computeGlobalSummary,
  deriveSheetMonthDateRange,
  parseWorkbookUniversal,
} from './importEtl';
import { ImportRowData, ImportRow } from '../types';

const baseRowData: ImportRowData = {
  name: 'โครงการพัฒนาระบบคลังข้อมูลอัจฉริยะ',
  head_name: 'รศ.ดร.สมชาย ใจดี',
  head_personnel_id: 101,
  department_code: 'CPE',
  client: 'สวทช.',
  budget: 250000,
  start_date: '2025-01-01',
  end_date: '2025-06-30',
  month: 'มกราคม',
  fiscal_year: 2568,
  record_number: '1',
  remarks: '',
  percent_faculty: 5,
  percent_dept: 5,
  percent_ku: 5,
  alloc_faculty: 12500,
  alloc_dept: 12500,
  alloc_ku: 12500,
  alloc_remaining: 212500,
};

describe('Data Import ETL & Universal Validation (v2 Split-Pane)', () => {
  it('converts 1968 Excel date bug to 2568 BE (2025 CE)', () => {
    expect(parseDateUniversal('15/01/1968')).toBe('2025-01-15');
    expect(parseDateUniversal('15/01/2568')).toBe('2025-01-15');
    expect(parseDateUniversal(new Date(1968, 0, 15))).toBe('2025-01-15');
  });

  it('derives date range from Thai sheet month names accurately', () => {
    expect(deriveSheetMonthDateRange('ต.ค.67')).toEqual({
      startDate: '2024-10-01',
      endDate: '2024-10-31',
    });
    expect(deriveSheetMonthDateRange('ม.ค.68')).toEqual({
      startDate: '2025-01-01',
      endDate: '2025-01-31',
    });
  });

  it('enforces T7 validation rules per category with Thai field labels', () => {
    // 1. Academic requires name, head_name, department_code, start_date, end_date
    const emptyAcademic: ImportRowData = {
      ...baseRowData,
      name: '',
      head_name: '',
      department_code: null,
      start_date: null,
      end_date: null,
    };
    const acadIssues = validateRowUniversal(emptyAcademic, 'academic');
    const acadErrorFields = acadIssues.filter((i) => i.severity === 'error').map((i) => i.field);
    expect(acadErrorFields).toEqual(
      expect.arrayContaining(['name', 'head_name', 'department_code', 'start_date', 'end_date'])
    );
    expect(acadIssues.find((i) => i.field === 'start_date')?.label).toBe('วันเริ่มต้นดำเนินการ');

    // 2. Research requires name, head_name, department_code; start_date & end_date are warnings
    const emptyResearch: ImportRowData = {
      ...baseRowData,
      name: 'โครงการวิจัยทดสอบ',
      head_name: 'ดร.สมหญิง',
      department_code: null,
      start_date: null,
      end_date: null,
    };
    const resIssues = validateRowUniversal(emptyResearch, 'research');
    expect(resIssues.some((i) => i.field === 'department_code' && i.severity === 'error')).toBe(
      true
    );
    expect(resIssues.some((i) => i.field === 'start_date' && i.severity === 'warning')).toBe(true);

    // 3. Publications warnings on publication_type, level, journal_name
    const pubIssues = validateRowUniversal(baseRowData, 'publications');
    const pubWarnFields = pubIssues.filter((i) => i.severity === 'warning').map((i) => i.field);
    expect(pubWarnFields).toEqual(
      expect.arrayContaining(['publication_type', 'level', 'journal_name'])
    );

    // 4. IP warnings on work_category, req_no, patent_no
    const ipIssues = validateRowUniversal(baseRowData, 'ip');
    const ipWarnFields = ipIssues.filter((i) => i.severity === 'warning').map((i) => i.field);
    expect(ipWarnFields).toEqual(expect.arrayContaining(['work_category', 'req_no', 'patent_no']));
  });

  it('computes category-scoped summary counts (T3.4) while keeping whole-file chip counts', () => {
    const sampleRows: ImportRow[] = [
      {
        rowId: 'r1',
        category: 'research',
        categoryLabel: 'โครงการวิจัย',
        sheetName: '1-วิจัย',
        excelRowNumber: 2,
        status: 'ready',
        excluded: false,
        issues: [],
        data: baseRowData,
      },
      {
        rowId: 'r2',
        category: 'academic',
        categoryLabel: 'โครงการพัฒนาวิชาการ',
        sheetName: '2-พัฒนาวิชาการ',
        excelRowNumber: 2,
        status: 'error',
        excluded: false,
        issues: [
          {
            field: 'start_date',
            label: 'วันเริ่มต้นดำเนินการ',
            severity: 'error',
            message: 'ไม่ได้ระบุวันเริ่มต้นดำเนินการ',
          },
        ],
        data: { ...baseRowData, start_date: null },
      },
    ];

    const allSummary = computeGlobalSummary(sampleRows, 'all');
    expect(allSummary.total).toBe(2);
    expect(allSummary.ready).toBe(1);
    expect(allSummary.needsFix).toBe(1);

    const researchOnlySummary = computeGlobalSummary(sampleRows, 'research');
    expect(researchOnlySummary.total).toBe(1);
    expect(researchOnlySummary.ready).toBe(1);
    expect(researchOnlySummary.needsFix).toBe(0);
    // Whole-file chip counts remain intact:
    expect(researchOnlySummary.byCategory.length).toBe(2);
  });

  it('parses all Excel files in D:\\Data warehoues\\Project\\data without crashing', async () => {
    const dataDir = path.resolve(process.cwd(), '../data');
    if (!fs.existsSync(dataDir)) return;

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.xlsx'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const buf = fs.readFileSync(path.join(dataDir, file));
      const res = await parseWorkbookUniversal(buf, 'academic', {}, file);
      expect(res.sheets.length).toBeGreaterThan(0);
    }
  });
});
