// Shared Year Engine used across all dashboard filter controls, chart selectors, and queries.
// ใช้ปีปัจจุบัน (พ.ศ.) เป็นตัวตั้งต้น และเลือกย้อนหลังได้ 2 ปี (รวม 3 ปี) + ทั้งหมด ('all')
// เช่น ปัจจุบันปี 2569 -> ['2569', '2568', '2567'], เมื่อขึ้นปีใหม่ 2570 -> ['2570', '2569', '2568']

import { getCurrentFiscalYear, getCurrentAcademicYear } from '@/types/timeFilter';

/**
 * คำนวณปี พ.ศ. ปัจจุบันจากวันที่ของระบบ (เมื่อขึ้นปีใหม่จะเปลี่ยนปีตั้งต้นอัตโนมัติ)
 */
export function getCurrentYearBE(d: Date = new Date()): number {
  return d.getFullYear() + 543;
}

/**
 * คืนค่ารายการปีมาตรฐาน: ปีปัจจุบันเป็นตัวตั้งต้น และย้อนหลัง N ปี (ค่าเริ่มต้นย้อนหลัง 2 ปี = รวม 3 ปี)
 * เช่น ปี 2569 -> ['2569', '2568', '2567']
 * เช่น ปี 2570 -> ['2570', '2569', '2568']
 */
export function getStandardYearOptions(backYears: number = 2, d: Date = new Date()): string[] {
  const currentBe = getCurrentYearBE(d);
  return Array.from({ length: backYears + 1 }, (_, i) => String(currentBe - i));
}

export const CURRENT_FISCAL_YEAR = getCurrentFiscalYear();
export const CURRENT_ACADEMIC_YEAR = getCurrentAcademicYear();

/** รายการปีมาตรฐาน 3 ปี (ปีปัจจุบัน + ย้อนหลัง 2 ปี): เช่น ['2569', '2568', '2567'] */
export const STANDARD_YEAR_OPTIONS: readonly string[] = getStandardYearOptions(2);

/** ปีใหม่สุดไปเก่าสุด เริ่มจากปีปัจจุบัน (ใช้เป็นมาตรฐานเดียวกันทั่วทั้งระบบ) */
export const AVAILABLE_YEARS: readonly string[] = STANDARD_YEAR_OPTIONS;

/** ปุ่มลัดบน TimeFilterBar / DashboardTabFilterBar (เหมือนกันทุกหน้า) */
export const QUICK_FISCAL_YEARS: readonly string[] = STANDARD_YEAR_OPTIONS;

export const CURRENT_DEFAULT_YEAR = CURRENT_FISCAL_YEAR;

/**
 * คืนค่าปีเปรียบเทียบเริ่มต้นเมื่อเลือกปีหลัก (ย้อนหลัง 1 ปี หรือปีถัดไปที่มีในรายการ)
 */
export function getDefaultCompareYear(
  selectedYear: string,
  options: readonly string[] = STANDARD_YEAR_OPTIONS
): string {
  if (selectedYear && selectedYear !== 'all') {
    const prev = String(Number(selectedYear) - 1);
    if (options.includes(prev)) return prev;
    const alt = options.find((y) => y !== selectedYear);
    if (alt) return alt;
    return prev;
  }
  return options[1] || options[0] || String(getCurrentYearBE() - 1);
}

/**
 * ตรวจสอบว่าปีของรายการข้อมูล (recordYear) ตรงกับปีที่เลือกหรือไม่
 * รองรับ 'all' (ทั้งหมด) และปี พ.ศ. / ค.ศ.
 */
export function matchesSelectedYear(
  recordYear: string | number | null | undefined,
  selectedYear: string
): boolean {
  if (!selectedYear || selectedYear === 'all') return true;
  if (recordYear === null || recordYear === undefined || recordYear === '') return false;
  const numRec = Number(recordYear);
  const normRec =
    !isNaN(numRec) && numRec > 1900 && numRec < 2400
      ? String(numRec + 543)
      : String(recordYear).trim();
  const numSel = Number(selectedYear);
  const normSel =
    !isNaN(numSel) && numSel > 1900 && numSel < 2400
      ? String(numSel + 543)
      : String(selectedYear).trim();
  return normRec === normSel;
}
