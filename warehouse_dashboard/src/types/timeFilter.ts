export type TimeFilterMode = 'all' | 'academic' | 'fiscal' | 'manual';
export type AcademicSemester = 'first' | 'second' | 'summer' | 'all';
export type FiscalQuarter = 'q1' | 'q2' | 'q3' | 'q4' | 'all';
export type ManualType = 'months' | 'range';

export interface TimeFilterState {
  mode: TimeFilterMode;
  academicYear: string; // พ.ศ. หรือ 'all'
  academicSemester: AcademicSemester;
  fiscalYear: string; // พ.ศ. หรือ 'all'
  fiscalQuarter: FiscalQuarter;
  manualType?: ManualType;
  manualYear: string; // พ.ศ. หรือ 'all'
  manualMonths: number[]; // 1-12 (ว่าง = ทุกเดือน)
  manualStartDate?: string; // 'YYYY-MM-DD' (ค.ศ.)
  manualEndDate?: string; // 'YYYY-MM-DD' (ค.ศ.)
}

// ---------- ปีปัจจุบัน (คำนวณจากวันที่ ไม่ hard code) ----------
// ปีงบประมาณเริ่ม 1 ต.ค. / ปีการศึกษาเริ่ม มิ.ย.
export const getCurrentFiscalYear = (d: Date = new Date()): string => {
  const be = d.getFullYear() + 543;
  return String(d.getMonth() + 1 >= 10 ? be + 1 : be);
};

export const getCurrentAcademicYear = (d: Date = new Date()): string => {
  const be = d.getFullYear() + 543;
  return String(d.getMonth() + 1 >= 6 ? be : be - 1);
};

export const DEFAULT_TIME_FILTER: TimeFilterState = {
  mode: 'all',
  academicYear: getCurrentAcademicYear(),
  academicSemester: 'first',
  fiscalYear: getCurrentFiscalYear(),
  fiscalQuarter: 'all',
  manualType: 'months',
  manualYear: getCurrentFiscalYear(),
  manualMonths: [],
  manualStartDate: '',
  manualEndDate: '',
};

// ---------- Label ----------
const SEMESTER_LABEL: Record<AcademicSemester, string> = {
  first: 'ภาคต้น',
  second: 'ภาคปลาย',
  summer: 'ภาคฤดูร้อน',
  all: 'ทุกภาคการศึกษา',
};

const QUARTER_LABEL: Record<FiscalQuarter, string> = {
  q1: 'ไตรมาส 1',
  q2: 'ไตรมาส 2',
  q3: 'ไตรมาส 3',
  q4: 'ไตรมาส 4',
  all: 'ทั้งปี',
};

const MONTH_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const fmtIsoThai = (iso?: string): string => {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return '-';
  return `${d} ${MONTH_SHORT[m - 1]} ${y + 543}`;
};

export const getTimeFilterLabel = (f: TimeFilterState): string => {
  switch (f.mode) {
    case 'all':
      return 'ข้อมูลทั้งหมด';
    case 'academic': {
      const year = f.academicYear === 'all' ? 'ทุกปีการศึกษา' : `ปีการศึกษา ${f.academicYear}`;
      return f.academicSemester === 'all' ? year : `${year} ${SEMESTER_LABEL[f.academicSemester]}`;
    }
    case 'fiscal': {
      const year = f.fiscalYear === 'all' ? 'ทุกปีงบประมาณ' : `ปีงบประมาณ ${f.fiscalYear}`;
      return f.fiscalQuarter === 'all' ? year : `${year} ${QUARTER_LABEL[f.fiscalQuarter]}`;
    }
    case 'manual': {
      if (f.manualType === 'range') {
        return `${fmtIsoThai(f.manualStartDate)} – ${fmtIsoThai(f.manualEndDate)}`;
      }
      const year = f.manualYear === 'all' ? 'ทุกปี' : `พ.ศ. ${f.manualYear}`;
      const months = f.manualMonths ?? [];
      if (months.length === 0 || months.length === 12) return `${year} ทุกเดือน`;
      return `${year} ${months.map((m) => MONTH_SHORT[m - 1]).join(' ')}`;
    }
    default:
      return 'ข้อมูลทั้งหมด';
  }
};

// ---------- Matching ----------
/** Fields used when a caller does not know the record category. */
const DATE_FIELDS = [
  'startDate',
  'start_date',
  'date',
  'projectDate',
  'month_year',
  'filing_date',
  'createdAt',
  'created_at',
];

/**
 * Each dashboard domain stores its dates in a different field. Resolve the
 * best available date for that domain before falling back to generic fields.
 */
const CATEGORY_DATE_FIELDS: Record<string, string[]> = {
  research: ['start_date', 'fiscal_year_be', 'fiscal_year'],
  academic: ['start_date', 'integration_start_date'],
  publications: ['month_year', 'fiscal_year_be'],
  service: ['date', 'start_date'],
  ip: ['filing_date', 'protection_start'],
  personnel: ['date', 'start_date', 'filing_date'],
};

function parseDateValue(raw: unknown, field?: string): Date | null {
  if (raw === undefined || raw === null || raw === '') return null;
  if (raw instanceof Date) {
    return isNaN(raw.getTime()) ? null : new Date(raw.getTime());
  }

  const str = String(raw).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT') return null;

  // A fiscal-year field is the year label, not a calendar date. Point it at
  // the start of that fiscal year (1 Oct of the previous calendar year) so
  // quarter filtering behaves correctly.
  if (field === 'fiscal_year_be' || field === 'fiscal_year') {
    const y = Number(str.match(/\d{4}/)?.[0]);
    if (Number.isFinite(y)) {
      const ce = y > 2400 ? y - 543 : y;
      return new Date(ce - 1, 9, 1);
    }
  }

  if (typeof raw === 'number') {
    const year = raw > 2400 ? raw - 543 : raw;
    return Number.isFinite(year) ? new Date(year, 0, 1) : null;
  }

  // YYYY, YYYY-MM and YYYY-MM-DD (BE years are normalised to CE).
  const match = str.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/);
  if (match) {
    const rawYear = Number(match[1]);
    const year = rawYear > 2400 ? rawYear - 543 : rawYear;
    const month = match[2] ? Number(match[2]) - 1 : 0;
    const day = match[3] ? Number(match[3]) : 1;
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  if (d.getFullYear() > 2400) d.setFullYear(d.getFullYear() - 543);
  return d;
}

/** Resolve the best date for a record, with an optional dashboard category. */
export function resolveItemDate(item: any, category?: string): Date | null {
  if (!item || typeof item !== 'object') return null;
  const fields = (category && CATEGORY_DATE_FIELDS[category]) || DATE_FIELDS;
  for (const key of fields) {
    const d = parseDateValue(item[key], key);
    if (d) return d;
  }
  return null;
}

/** Count records that cannot participate in a time filter. */
export function getUndatedCount(items: unknown[], category?: string): number {
  if (!Array.isArray(items)) return 0;
  return items.filter((item) => item && resolveItemDate(item, category) === null).length;
}

export const itemMatchesTimeFilter = (item: any, f: TimeFilterState, category?: string): boolean => {
  if (f.mode === 'all') return true;

  // Prefer the explicit fiscal-year field when the record has one. Imported
  // records often carry createdAt/updatedAt timestamps from the import date,
  // which must not override the record's own fiscal year.
  if (f.mode === 'fiscal') {
    const explicitFiscalYear = item?.fiscal_year_be ?? item?.fiscal_year;
    const hasExplicitFiscalYear =
      explicitFiscalYear !== undefined &&
      explicitFiscalYear !== null &&
      String(explicitFiscalYear).trim() !== '';

    if (hasExplicitFiscalYear) {
      if (f.fiscalYear !== 'all' && String(explicitFiscalYear).trim() !== String(f.fiscalYear)) {
        return false;
      }
      if (f.fiscalQuarter === 'all') return true;
    }
  }

  const d = resolveItemDate(item, category);
  if (!d) return false;

  const month = d.getMonth() + 1;
  const be = d.getFullYear() + 543;

  if (f.mode === 'academic') {
    const ay = month >= 6 ? be : be - 1;
    if (f.academicYear !== 'all' && String(ay) !== f.academicYear) return false;
    if (f.academicSemester === 'all') return true;
    if (f.academicSemester === 'first') return month >= 6 && month <= 10;
    if (f.academicSemester === 'second') return month >= 11 || month <= 3;
    return month === 4 || month === 5; // summer
  }

  if (f.mode === 'fiscal') {
    const fy = month >= 10 ? be + 1 : be;
    if (f.fiscalYear !== 'all' && String(fy) !== f.fiscalYear) return false;
    if (f.fiscalQuarter === 'all') return true;
    if (f.fiscalQuarter === 'q1') return month >= 10;
    if (f.fiscalQuarter === 'q2') return month >= 1 && month <= 3;
    if (f.fiscalQuarter === 'q3') return month >= 4 && month <= 6;
    return month >= 7 && month <= 9; // q4
  }

  // manual
  if (f.manualType === 'range') {
    if (!f.manualStartDate || !f.manualEndDate) return true;
    const start = new Date(`${f.manualStartDate}T00:00:00`);
    const end = new Date(`${f.manualEndDate}T23:59:59.999`);
    return d >= start && d <= end;
  }
  if (f.manualYear !== 'all' && String(be) !== f.manualYear) return false;
  const months = f.manualMonths ?? [];
  return months.length === 0 || months.includes(month);
};