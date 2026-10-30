import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  detectCategory,
  parseSheetMonth,
  detectHeaderRowUniversal,
  mapColumnsUniversal,
  parseDateUniversal,
  parseBudgetUniversal,
  normalizeDepartmentUniversal,
  validateRowUniversal,
  computeGlobalSummary,
  parseWorkbookUniversal,
} from './globalImport.etl';
import { GlobalImportRow } from './globalImport.types';

describe('Universal Global Import & ETL Layer Tests', () => {
  describe('1. Category Detection', () => {
    it('should detect category from sheet names correctly', () => {
      expect(detectCategory('1-โครงการวิจัย')).toBe('research');
      expect(detectCategory('2-โครงการพัฒนาวิชาการ')).toBe('academic');
      expect(detectCategory('3-งานบริการวิชาการ')).toBe('service');
      expect(detectCategory('3-ผลงานบริการ')).toBe('service');
      expect(detectCategory('4-ผลงานทางวิชาการ')).toBe('publications');
      expect(detectCategory('5-งานทรัพย์สินทางปัญญา')).toBe('ip');
      expect(detectCategory('สิทธิบัตร')).toBe('ip');
      expect(detectCategory('อนุสิทธิบัตร')).toBe('ip');
      expect(detectCategory('ลิขสิทธิ์')).toBe('ip');
    });

    it('should detect category from file name when sheet is a month', () => {
      expect(detectCategory('ม.ค.68', [], 'โครงการวิจัย 2568.xlsx')).toBe('research');
      expect(detectCategory('ก.พ.68', [], 'โครงการพัฒนาวิชาการ 2568.xlsx')).toBe('academic');
      expect(detectCategory('มี.ค.68', [], 'งานบริการวิชาการ 2568.xlsx')).toBe('service');
      expect(detectCategory('เม.ย.68', [], 'ผลงานทางวิชาการ 2568.xlsx')).toBe('publications');
      expect(detectCategory('พ.ค.68', [], 'งานทรัพสินทางปัญญา 2568.xlsx')).toBe('ip');
      expect(detectCategory('สิทธิบัตร', [], 'ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx')).toBe('ip');
      expect(detectCategory('คณะวิศวกรรมศาสตร์', [], 'หน่วยวิจัยและนวัตกรรม-แบบรายงานผลตัวชี้ว.xlsx')).toBe('kpi');
    });
  });

  describe('2. Date & Year Handling (1968 -> 2568 BE / 2025 CE)', () => {
    it('should parse Buddhist dates and fix 1968 to 2025 CE', () => {
      // 15/01/2568 BE -> 2025-01-15
      const d1 = parseDateUniversal('15/01/2568');
      expect(d1).toBe('2025-01-15');

      // 15/01/68 BE -> 2025-01-15
      const d2 = parseDateUniversal('15/01/68');
      expect(d2).toBe('2025-01-15');

      // Erroneous 1968 year entered by Excel misinterpreting BE 68 -> 2025-01-15
      const d3 = parseDateUniversal('1968-01-15');
      expect(d3).toBe('2025-01-15');

      // JS Date instance in year 1968
      const jsDate1968 = new Date(1968, 0, 15);
      const d4 = parseDateUniversal(jsDate1968);
      expect(d4).toBe('2025-01-15');
    });

    it('should parse Thai sheet month correctly', () => {
      const m1 = parseSheetMonth('ก.พ.68');
      expect(m1.monthNumber).toBe(2);
      expect(m1.monthName).toBe('กุมภาพันธ์');
      expect(m1.fiscalYearBE).toBe(2568);

      const m2 = parseSheetMonth('ธ.ค. 68');
      expect(m2.monthNumber).toBe(12);
      expect(m2.monthName).toBe('ธันวาคม');
      expect(m2.fiscalYearBE).toBe(2568);
    });
  });

  describe('3. Department Normalization & Budget Parsing', () => {
    it('should normalize departments to canonical codes', () => {
      expect(normalizeDepartmentUniversal('คอมพิวเตอร์').code).toBe('CPE');
      expect(normalizeDepartmentUniversal('วิศวกรรมเกษตร').code).toBe('AE');
      expect(normalizeDepartmentUniversal('ชลประทาน').code).toBe('IRE');
      expect(normalizeDepartmentUniversal('โยธา').code).toBe('CE');
      expect(normalizeDepartmentUniversal('เครื่องกล').code).toBe('ME');
      expect(normalizeDepartmentUniversal('วิศวกรรมการอาหาร').code).toBe('FE');
    });

    it('should parse numeric and string budgets with comma formatting', () => {
      expect(parseBudgetUniversal('1,500,000').value).toBe(1500000);
      expect(parseBudgetUniversal(250000).value).toBe(250000);
      expect(parseBudgetUniversal('-').value).toBe(0);
      expect(parseBudgetUniversal('').value).toBe(0);
    });
  });

  describe('4. Real Excel Files Parsing', () => {
    const dataDir = 'D:/Data warehoues/Project/data';

    it('should parse "1.เรื่องเพื่อทราบ..." which contains multiple categories across sheets', async () => {
      const filePath = path.join(dataDir, '1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx');
      if (!fs.existsSync(filePath)) return;

      const buf = fs.readFileSync(filePath);
      const result = await parseWorkbookUniversal(buf, 'academic', {}, '1.เรื่องเพื่อทราบ รองคณบดีฝ่ายวิจัยและนวั.xlsx');

      expect(result.sheets.length).toBeGreaterThanOrEqual(4);
      expect(result.rows.length).toBeGreaterThan(0);

      // Verify that multiple categories were detected across the sheets
      expect(result.detectedCategories).toContain('research');
      expect(result.detectedCategories).toContain('academic');
      expect(result.detectedCategories).toContain('service');
      expect(result.detectedCategories).toContain('publications');

      const summary = computeGlobalSummary(result.rows);
      expect(summary.total).toBe(result.rows.length);
      expect(summary.byCategory.length).toBeGreaterThanOrEqual(4);
    });

    it('should parse "โครงการวิจัย 2568.xlsx" with monthly sheets', async () => {
      const filePath = path.join(dataDir, 'โครงการวิจัย 2568.xlsx');
      if (!fs.existsSync(filePath)) return;

      const buf = fs.readFileSync(filePath);
      const result = await parseWorkbookUniversal(buf, 'research', {}, 'โครงการวิจัย 2568.xlsx');

      expect(result.sheets.length).toBeGreaterThan(0);
      expect(result.rows.length).toBeGreaterThan(0);
      // 'รวม' sheet should be ignored because monthly sheets exist
      expect(result.ignoredSheets).toContain('รวม');
      expect(result.detectedCategories).toContain('research');
    });

    it('should parse "งานบริการวิชาการ 2568.xlsx" with monthly sheets', async () => {
      const filePath = path.join(dataDir, 'งานบริการวิชาการ 2568.xlsx');
      if (!fs.existsSync(filePath)) return;

      const buf = fs.readFileSync(filePath);
      const result = await parseWorkbookUniversal(buf, 'service', {}, 'งานบริการวิชาการ 2568.xlsx');

      expect(result.sheets.length).toBeGreaterThan(0);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.ignoredSheets).toContain('รวม68');
      expect(result.detectedCategories).toContain('service');
    });

    it('should parse "ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx" with patent categories', async () => {
      const filePath = path.join(dataDir, 'ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx');
      if (!fs.existsSync(filePath)) return;

      const buf = fs.readFileSync(filePath);
      const result = await parseWorkbookUniversal(buf, 'ip', {}, 'ปัจจุบัน-อนุสิทธิบัตร-สิทธิบัตร.xlsx');

      expect(result.sheets.length).toBeGreaterThan(0);
      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.detectedCategories).toContain('ip');
    });
  });
});
