import { readCategoryData } from './serverDataStore';
import { isTestRecord } from './sdgEngine';
import { SDG_DEFINITIONS, parseSdgNumber, getSdgInfo } from './sdg';

export interface SdgFilterParams {
  year?: number | string; // Target year in CE or BE (default: latest active year e.g. 2026 / 2569)
  compareYearsCount?: number; // 2 or 3 (default: 3)
  department?: string; // 'all' or specific department
  category?: string; // 'all' or 'research' | 'academic' | 'publications' | 'ip' | 'service'
  strategicFilter?: string; // 'all' or filter key
  selectedSdg?: number | null; // 1-17 or null
  monthFrom?: number; // 0-11
  monthTo?: number; // 0-11
}

export interface SdgTileData {
  sdgNumber: number;
  code: string;
  nameTh: string;
  color: string;
  textColor: string;
  iconPath: string;
  currentCount: number;
  deltaPercent: number | null;
  deltaLabel: string; // "+15%", "-5%", "ใหม่", "–"
  deltaType: 'up' | 'down' | 'neutral' | 'new';
  yearCounts: Array<{ year: number; yearBe: number; count: number; hasData: boolean }>;
}

export interface MonthlyBarData {
  monthIndex: number;
  monthName: string;
  years: Array<{ year: number; yearBe: number; count: number; hasData: boolean }>;
  deltaPercent: number | null;
  deltaLabel: string;
  deltaType: 'up' | 'down' | 'neutral' | 'new';
}

export interface HeatmapRowData {
  sdgNumber: number;
  code: string;
  nameTh: string;
  color: string;
  months: Array<{
    monthIndex: number;
    monthName: string;
    count: number;
    intensity: number; // 0.0 to 1.0
  }>;
}

export interface SdgKpiSummary {
  distinctProjectsCount: number;
  distinctProjectsDeltaPercent: number | null;
  distinctProjectsDeltaLabel: string;
  distinctProjectsDeltaType: 'up' | 'down' | 'neutral' | 'new';
  yearBreakdownText: string;

  topSdgNumber: number;
  topSdgNameTh: string;
  topSdgCount: number;

  highestGrowingSdgNumber: number | null;
  highestGrowingSdgNameTh: string;
  highestGrowingDeltaLabel: string;

  coveredSdgCount: number; // e.g. 15 / 17
}

export interface SdgAggregationResult {
  targetYear: number;
  targetYearBe: number;
  comparisonYears: number[];
  comparisonYearsBe: number[];
  yearsWithData: number[];
  basisNote: string;
  isLikeForLike: boolean;
  maxMonthCompared: number; // 0-11
  kpis: SdgKpiSummary;
  tiles: SdgTileData[];
  monthlyBars: MonthlyBarData[];
  heatmap: HeatmapRowData[];
  filterEcho: {
    department: string;
    category: string;
    selectedSdg: number | null;
    year: number;
  };
}

const THAI_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/**
 * Normalise raw year to Gregorian CE.
 */
function toCeYear(raw: number): number {
  if (raw >= 2400) return raw - 543;
  if (raw >= 1966 && raw <= 1972) return raw + 57; // legacy artifact
  return raw;
}

/**
 * Normalise CE to Buddhist Era (BE).
 */
function toBeYear(ce: number): number {
  return ce + 543;
}

/**
 * Extract record date (year CE and month 0-11) according to domain-specific mapping.
 */
function extractRecordDate(item: any, category: string): { year: number; month: number } | null {
  let rawDate: unknown = null;

  switch (category) {
    case 'research':
      rawDate = item.start_date || item.startDate || item.fiscal_year || item.date;
      break;
    case 'academic':
      rawDate = item.start_date || item.integration_start_date || item.date;
      break;
    case 'publications':
      rawDate = item.month_year || item.fiscal_year_be || item.published_date || item.date;
      break;
    case 'ip':
      rawDate = item.filing_date || item.protection_start || item.date;
      break;
    case 'service':
    case 'services':
      rawDate = item.date || item.start_date;
      break;
    default:
      rawDate = item.start_date || item.date || item.createdAt;
  }

  // If rawDate is duration string like '12 เดือน' or '-' or missing, fallback to fiscal_year or year in id
  const rawStr = String(rawDate || '').trim();
  if (!rawDate || /^\d+\s*เดือน/.test(rawStr) || rawStr === '-' || rawStr === 'nan' || rawStr === 'NaT') {
    if (item.fiscal_year && /^\d{4}$/.test(String(item.fiscal_year).trim())) {
      rawDate = String(item.fiscal_year).trim();
    } else {
      const idMatch = String(item.id || '').match(/(25\d{2}|20\d{2})/);
      if (idMatch) {
        rawDate = idMatch[1];
      }
    }
  }

  // Fallback to evaluation date if domain date is missing
  if (!rawDate && item.evaluation?.evaluated_at) {
    rawDate = item.evaluation.evaluated_at;
  }

  if (!rawDate) return null;

  if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
    return { year: rawDate.getFullYear(), month: rawDate.getMonth() };
  }

  const str = String(rawDate).trim();
  if (!str || str === '-' || str === 'nan' || str === 'NaT') return null;

  // Year only e.g. '2025' or '2568'
  if (/^\d{4}$/.test(str)) {
    const y = toCeYear(parseInt(str, 10));
    return { year: y, month: 0 };
  }

  // 'YYYY-MM' or 'YYYY-MM-DD'
  const mMatch = str.match(/^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?/);
  if (mMatch) {
    const y = toCeYear(parseInt(mMatch[1], 10));
    const m = Math.max(0, Math.min(11, parseInt(mMatch[2], 10) - 1));
    return { year: y, month: m };
  }

  // Parse ISO date
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return { year: parsed.getFullYear(), month: parsed.getMonth() };
  }

  return null;
}

/**
 * Format percentage change and label according to prototype rules.
 */
function computeDelta(
  current: number,
  previous: number | null,
  previousHasData: boolean
): { percent: number | null; label: string; type: 'up' | 'down' | 'neutral' | 'new' } {
  if (!previousHasData || previous === null) {
    return { percent: null, label: '–', type: 'neutral' };
  }
  if (previous === 0) {
    if (current > 0) return { percent: null, label: 'ใหม่', type: 'new' };
    return { percent: 0, label: '0%', type: 'neutral' };
  }

  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);

  if (pct > 0) {
    return { percent: pct, label: `+${pct}%`, type: 'up' };
  } else if (pct < 0) {
    return { percent: pct, label: `${pct}%`, type: 'down' };
  }
  return { percent: 0, label: '0%', type: 'neutral' };
}

/**
 * Aggregate all evaluated SDG records across modules.
 */
export function aggregateSdgsData(params: SdgFilterParams = {}): SdgAggregationResult {
  const categoriesToFetch =
    params.category && params.category !== 'all'
      ? [params.category]
      : ['research', 'academic', 'publications', 'ip', 'service'];

  interface ProcessedRecord {
    id: string;
    category: string;
    department: string;
    year: number;
    month: number;
    sdgIds: number[];
  }

  const allRecords: ProcessedRecord[] = [];

  for (const cat of categoriesToFetch) {
    const rawItems = readCategoryData(cat);
    for (const item of rawItems) {
      if (isTestRecord(item)) continue;

      // Extract SDGs: from item.evaluation.sdg_ids or item.sdg_ids
      const rawSdgs: unknown =
        item.evaluation?.sdg_ids ||
        item.sdg_ids ||
        item.evaluation?.sdgs ||
        item.sdgs;
      if (!rawSdgs) continue;

      const sdgsArray = Array.isArray(rawSdgs)
        ? rawSdgs
        : String(rawSdgs)
            .split(/[,;\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);

      const parsedSdgs = sdgsArray
        .map((s) => parseSdgNumber(s))
        .filter((n): n is number => typeof n === 'number' && n >= 1 && n <= 17);

      if (parsedSdgs.length === 0) continue;

      const dept = String(item.department || '').trim();
      if (params.department && params.department !== 'all') {
        if (!dept.toLowerCase().includes(params.department.toLowerCase())) {
          continue;
        }
      }

      const d = extractRecordDate(item, cat);
      if (!d) continue;

      const recId = String(item._id || item.id || `${cat}_${allRecords.length}`);
      allRecords.push({
        id: recId,
        category: cat,
        department: dept,
        year: d.year,
        month: d.month,
        sdgIds: Array.from(new Set(parsedSdgs)),
      });
    }
  }

  // Determine available years from data
  const dataYears = Array.from(new Set(allRecords.map((r) => r.year))).sort((a, b) => a - b);
  const currentCalendarYear = new Date().getFullYear();
  const currentCalendarMonth = new Date().getMonth();

  // Target Year
  let targetYear = currentCalendarYear;
  if (params.year && params.year !== 'all') {
    const parsedY = parseInt(String(params.year), 10);
    if (!isNaN(parsedY)) {
      targetYear = toCeYear(parsedY);
    }
  } else if (dataYears.length > 0) {
    targetYear = dataYears[dataYears.length - 1];
  }

  const compareCount = params.compareYearsCount === 2 ? 2 : 3;
  const comparisonYears: number[] = [];
  for (let i = compareCount - 1; i >= 0; i--) {
    comparisonYears.push(targetYear - i);
  }
  const comparisonYearsBe = comparisonYears.map(toBeYear);
  const targetYearBe = toBeYear(targetYear);

  // Month range logic
  const isRunningYear = targetYear >= currentCalendarYear;
  const maxMonthAllowed = isRunningYear ? currentCalendarMonth : 11;

  const monthFrom = params.monthFrom !== undefined ? Math.max(0, Math.min(11, params.monthFrom)) : 0;
  const monthTo =
    params.monthTo !== undefined
      ? Math.max(monthFrom, Math.min(maxMonthAllowed, params.monthTo))
      : maxMonthAllowed;

  const isLikeForLike = isRunningYear && monthTo < 11;
  const basisNote = isLikeForLike
    ? `เปรียบเทียบข้อมูลช่วง ม.ค. – ${THAI_MONTHS[monthTo]} ของทุกปี (Like-for-like comparison) เพื่อการเปรียบเทียบที่เที่ยงตรง`
    : `เปรียบเทียบข้อมูลครบปี (ม.ค. – ธ.ค.)`;

  const yearsWithData = comparisonYears.filter((y) => allRecords.some((r) => r.year === y));

  // Helper filter for records in year and month range
  const filterRecords = (year: number, sdgFilter?: number | null) => {
    return allRecords.filter((r) => {
      if (r.year !== year) return false;
      if (r.month < monthFrom || r.month > monthTo) return false;
      if (sdgFilter !== undefined && sdgFilter !== null) {
        if (!r.sdgIds.includes(sdgFilter)) return false;
      }
      return true;
    });
  };

  // 1. KPI 1: Distinct projects in targetYear and prevYear
  const prevYear = targetYear - 1;
  const prevYearHasData = yearsWithData.includes(prevYear);

  const targetRecordsDistinct = filterRecords(targetYear, params.selectedSdg);
  const targetDistinctCount = new Set(targetRecordsDistinct.map((r) => r.id)).size;

  const prevRecordsDistinct = filterRecords(prevYear, params.selectedSdg);
  const prevDistinctCount = prevYearHasData ? new Set(prevRecordsDistinct.map((r) => r.id)).size : null;

  const kpi1Delta = computeDelta(targetDistinctCount, prevDistinctCount, prevYearHasData);

  const yearBreakdownText = comparisonYears
    .slice(0, -1)
    .reverse()
    .map((y) => {
      const cnt = new Set(filterRecords(y, params.selectedSdg).map((r) => r.id)).size;
      return `${toBeYear(y)}: ${yearsWithData.includes(y) ? cnt : '–'}`;
    })
    .join(' · ');

  // 2. Per-SDG Totals (Tiles 1-17)
  const tiles: SdgTileData[] = [];
  const sdgCountsTarget: Record<number, number> = {};
  const sdgGrowthTarget: Record<number, { percent: number | null; label: string; type: any }> = {};

  for (let s = 1; s <= 17; s++) {
    const def = SDG_DEFINITIONS[s];
    const sCurRecords = filterRecords(targetYear, s);
    const sCurCount = sCurRecords.length;
    sdgCountsTarget[s] = sCurCount;

    const sPrevRecords = filterRecords(prevYear, s);
    const sPrevCount = prevYearHasData ? sPrevRecords.length : null;
    const sDelta = computeDelta(sCurCount, sPrevCount, prevYearHasData);
    sdgGrowthTarget[s] = sDelta;

    const yearCounts = comparisonYears.map((y) => {
      const yHas = yearsWithData.includes(y);
      const cnt = filterRecords(y, s).length;
      return {
        year: y,
        yearBe: toBeYear(y),
        count: yHas ? cnt : 0,
        hasData: yHas,
      };
    });

    tiles.push({
      sdgNumber: s,
      code: def.code,
      nameTh: def.nameTh,
      color: def.color,
      textColor: def.color, // will be rendered with contrast on active
      iconPath: def.iconPath,
      currentCount: sCurCount,
      deltaPercent: sDelta.percent,
      deltaLabel: sDelta.label,
      deltaType: sDelta.type,
      yearCounts,
    });
  }

  // Top SDG
  let topSdg = 1;
  let topCount = -1;
  for (let s = 1; s <= 17; s++) {
    if (sdgCountsTarget[s] > topCount) {
      topCount = sdgCountsTarget[s];
      topSdg = s;
    }
  }

  // Highest growing SDG
  let highGrowSdg: number | null = null;
  let highGrowPct = -9999;
  for (let s = 1; s <= 17; s++) {
    const delta = sdgGrowthTarget[s];
    if (delta.type === 'up' && delta.percent !== null && delta.percent > highGrowPct) {
      highGrowPct = delta.percent;
      highGrowSdg = s;
    }
  }

  const coveredSdgCount = Object.values(sdgCountsTarget).filter((c) => c > 0).length;

  const kpis: SdgKpiSummary = {
    distinctProjectsCount: targetDistinctCount,
    distinctProjectsDeltaPercent: kpi1Delta.percent,
    distinctProjectsDeltaLabel: kpi1Delta.label,
    distinctProjectsDeltaType: kpi1Delta.type,
    yearBreakdownText,
    topSdgNumber: topSdg,
    topSdgNameTh: SDG_DEFINITIONS[topSdg]?.nameTh || '',
    topSdgCount: topCount > 0 ? topCount : 0,
    highestGrowingSdgNumber: highGrowSdg,
    highestGrowingSdgNameTh: highGrowSdg ? SDG_DEFINITIONS[highGrowSdg]?.nameTh || '' : '–',
    highestGrowingDeltaLabel: highGrowSdg ? sdgGrowthTarget[highGrowSdg].label : '–',
    coveredSdgCount,
  };

  // 3. Monthly Bar Chart
  const monthlyBars: MonthlyBarData[] = [];
  for (let m = monthFrom; m <= monthTo; m++) {
    const yearsData = comparisonYears.map((y) => {
      const yHas = yearsWithData.includes(y);
      const recs = allRecords.filter((r) => {
        if (r.year !== y || r.month !== m) return false;
        if (params.selectedSdg !== undefined && params.selectedSdg !== null) {
          if (!r.sdgIds.includes(params.selectedSdg)) return false;
        }
        return true;
      });
      return {
        year: y,
        yearBe: toBeYear(y),
        count: yHas ? recs.length : 0,
        hasData: yHas,
      };
    });

    const curMonthVal = yearsData[yearsData.length - 1]?.count ?? 0;
    const prevMonthVal = prevYearHasData ? yearsData[yearsData.length - 2]?.count ?? 0 : null;
    const mDelta = computeDelta(curMonthVal, prevMonthVal, prevYearHasData);

    monthlyBars.push({
      monthIndex: m,
      monthName: THAI_MONTHS[m],
      years: yearsData,
      deltaPercent: mDelta.percent,
      deltaLabel: mDelta.label,
      deltaType: mDelta.type,
    });
  }

  // 4. Heatmap (SDG x Month)
  const maxHeatVal = Math.max(
    1,
    ...tiles.map((t) => {
      const recs = filterRecords(targetYear, t.sdgNumber);
      return recs.length;
    })
  );

  const heatmap: HeatmapRowData[] = [];
  for (let s = 1; s <= 17; s++) {
    const def = SDG_DEFINITIONS[s];
    const monthsData = [];

    for (let m = 0; m < 12; m++) {
      const isPastMonthRange = m > maxMonthAllowed;
      const recs = allRecords.filter((r) => r.year === targetYear && r.month === m && r.sdgIds.includes(s));
      const cnt = isPastMonthRange ? 0 : recs.length;
      const intensity = isPastMonthRange ? 0 : Math.min(1.0, cnt / maxHeatVal);

      monthsData.push({
        monthIndex: m,
        monthName: THAI_MONTHS[m],
        count: isPastMonthRange ? -1 : cnt, // -1 denotes future / no data
        intensity,
      });
    }

    heatmap.push({
      sdgNumber: s,
      code: def.code,
      nameTh: def.nameTh,
      color: def.color,
      months: monthsData,
    });
  }

  return {
    targetYear,
    targetYearBe,
    comparisonYears,
    comparisonYearsBe,
    yearsWithData,
    basisNote,
    isLikeForLike,
    maxMonthCompared: monthTo,
    kpis,
    tiles,
    monthlyBars,
    heatmap,
    filterEcho: {
      department: params.department || 'all',
      category: params.category || 'all',
      selectedSdg: params.selectedSdg ?? null,
      year: targetYear,
    },
  };
}
