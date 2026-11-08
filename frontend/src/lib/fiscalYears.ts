// Shared fiscal-year constants used by dashboard filter controls.
// ปีงบประมาณไทยเริ่ม 1 ต.ค. / ปีการศึกษาเริ่ม มิ.ย.
// คำนวณจากวันที่ปัจจุบัน ไม่ hard code

import { getCurrentFiscalYear, getCurrentAcademicYear } from '@/types/timeFilter';

export const CURRENT_FISCAL_YEAR = getCurrentFiscalYear();
export const CURRENT_ACADEMIC_YEAR = getCurrentAcademicYear();

const YEAR_COUNT = 5; // 5 ปี + ปุ่ม "ทุกปี" = 6 ช่อง พอดี 2 แถว x 3 คอลัมน์

/** ปีใหม่สุดไปเก่าสุด เริ่มจากปีงบปัจจุบัน */
export const AVAILABLE_YEARS: readonly string[] = Array.from({ length: YEAR_COUNT }, (_, i) =>
  String(Number(CURRENT_FISCAL_YEAR) - i)
);

/** ปุ่มลัดบน TimeFilterBar / DashboardTabFilterBar (ต้องเหมือนกันทุกหน้า) */
export const QUICK_FISCAL_YEARS: readonly string[] = AVAILABLE_YEARS.slice(0, 3);

export const CURRENT_DEFAULT_YEAR = CURRENT_FISCAL_YEAR;
