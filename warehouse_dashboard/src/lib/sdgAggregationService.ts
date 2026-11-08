import { readCategoryData, readEvaluations } from './serverDataStore';
import { isTestRecord, resolveHybridSDG } from './sdgEngine';
import { SDG_DEFINITIONS, parseSdgNumber, getSdgInfo } from './sdg';

export interface SdgFilterParams {
  year?: number | string; // Target year in CE or BE (default: latest active year e.g. 2026 / 2569 or 'all')
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
  verifiedCount: number;
  autoDetectedCount: number;
  deltaPercent: number | null;
  deltaLabel: string; // "+15%", "-5%", "ใหม่", "–"
  deltaType: 'up' | 'down' | 'neutral' | 'new';
  yearCounts: Array<{ year: number; yearBe: number; count: number; verifiedCount?: number; autoDetectedCount?: number; hasData: boolean }>;
}

export interface MonthlyBarData {
  monthIndex: number;
  monthName: string;
  years: Array<{ year: number; yearBe: number; count: number; verifiedCount?: number; autoDetectedCount?: number; hasData: boolean }>;
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
  distinctVerifiedCount: number;
  distinctAutoCount: number;
  distinctProjectsDeltaPercent: number | null;
  distinctProjectsDeltaLabel: string;
  distinctProjectsDeltaType: 'up' | 'down' | 'neutral' | 'new';
  yearBreakdownText: string;

  topSdgNumber: number;
  topSdgNameTh: string;
  topSdgCount: number;
  topSdgVerifiedCount: number;
  topSdgAutoCount: number;

  highestGrowingSdgNumber: number | null;
  highestGrowingSdgNameTh: string;
  highestGrowingDeltaLabel: string;
  highestGrowingFrom?: number | null;
  highestGrowingTo?: number | null;
  highestGrowingPercent?: number | null;

  coveredSdgCount: number; // e.g. 15 / 17
  coveredSdgNumbers?: number[];
  yearlyTotals?: Record<number, number | null>;
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
  totalVerifiedRecords: number;
  totalAutoDetectedRecords: number;
}

import { THAI_MONTHS, toCeYear, toBeYear, extractRecordDate } from './sdgDateUtils';
export { THAI_MONTHS, toCeYear, toBeYear, extractRecordDate };

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
    return { percent: 0, label: '- 0%', type: 'neutral' };
  }

  const diff = current - previous;
  const pct = Math.round((diff / previous) * 100);

  if (pct > 0) {
    return { percent: pct, label: `+${pct}%`, type: 'up' };
  } else if (pct < 0) {
    return { percent: pct, label: `${pct}%`, type: 'down' };
  }
  return { percent: 0, label: '- 0%', type: 'neutral' };
}

/**
 * Aggregate all evaluated and auto-detected SDG records across modules (Hybrid Evaluation).
 */
export function aggregateSdgsData(
  params: SdgFilterParams = {},
  customDatasets?: Record<string, any[]>
): SdgAggregationResult {
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
    isVerified: boolean;
  }

  const allRecords: ProcessedRecord[] = [];
  const evaluationsMap = readEvaluations();

  for (const cat of categoriesToFetch) {
    const rawItems = customDatasets && customDatasets[cat] ? customDatasets[cat] : readCategoryData(cat);
    for (const item of rawItems) {
      if (isTestRecord(item)) continue;

      const hybrid = resolveHybridSDG(item, cat, evaluationsMap);
      if (!hybrid.sdgIds || hybrid.sdgIds.length === 0) continue;

      const dept = String(item.department || '').trim();
      if (params.department && params.department !== 'all') {
        if (!dept.toLowerCase().includes(params.department.toLowerCase())) {
          continue;
        }
      }

      const d = extractRecordDate(item, cat);
      const recYear = d ? d.year : 2025; // default to 2025 (BE 2568) for undated items
      const recMonth = d ? d.month : 0;

      const recId = String(item._id || item.id || `${cat}_${allRecords.length}`);
      allRecords.push({
        id: recId,
        category: cat,
        department: dept,
        year: recYear,
        month: recMonth,
        sdgIds: hybrid.sdgIds,
        isVerified: hybrid.isVerified,
      });
    }
  }

  // Determine available years from data
  const dataYears = Array.from(new Set(allRecords.map((r) => r.year))).sort((a, b) => a - b);
  const currentCalendarYear = new Date().getFullYear();
  const currentCalendarMonth = new Date().getMonth();

  const isAllYears = params.year === 'all';

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
  const isRunningYear = targetYear === currentCalendarYear;
  const maxMonthAllowed = isRunningYear ? currentCalendarMonth : 11;

  const monthFrom = params.monthFrom !== undefined ? Math.max(0, Math.min(11, params.monthFrom)) : 0;
  const monthTo =
    params.monthTo !== undefined
      ? Math.max(monthFrom, Math.min(maxMonthAllowed, params.monthTo))
      : maxMonthAllowed;

  const isLikeForLike = isRunningYear && monthTo < 11;
  const basisNote = isAllYears
    ? `แสดงข้อมูลทุกปีงบประมาณสะสม (Hybrid Evaluation)`
    : isLikeForLike
    ? `เปรียบเทียบข้อมูลช่วง ม.ค. – ${THAI_MONTHS[monthTo]} ของทุกปี (Like-for-like comparison) เพื่อการเปรียบเทียบที่เที่ยงตรง`
    : `เปรียบเทียบข้อมูลครบปี (ม.ค. – ธ.ค.)`;

  const yearsWithData = comparisonYears.filter((y) => allRecords.some((r) => r.year === y));

  // Helper filter for records in year and month range
  const filterRecords = (year: number | 'all', sdgFilter?: number | null) => {
    return allRecords.filter((r) => {
      if (!isAllYears && year !== 'all' && r.year !== year) return false;
      if (!isAllYears && year !== 'all' && (r.month < monthFrom || r.month > monthTo)) return false;
      if (sdgFilter !== undefined && sdgFilter !== null) {
        if (!r.sdgIds.includes(sdgFilter)) return false;
      }
      return true;
    });
  };

  // 1. KPI 1: Distinct projects in targetYear and prevYear
  const prevYear = targetYear - 1;
  const prevYearHasData = yearsWithData.includes(prevYear);

  const targetRecordsDistinct = filterRecords(isAllYears ? 'all' : targetYear, params.selectedSdg);
  const targetDistinctCount = new Set(targetRecordsDistinct.map((r) => r.id)).size;
  const targetVerifiedDistinctCount = new Set(targetRecordsDistinct.filter((r) => r.isVerified).map((r) => r.id)).size;
  const targetAutoDistinctCount = new Set(targetRecordsDistinct.filter((r) => !r.isVerified).map((r) => r.id)).size;

  const prevRecordsDistinct = filterRecords(prevYear, params.selectedSdg);
  const prevDistinctCount = prevYearHasData ? new Set(prevRecordsDistinct.map((r) => r.id)).size : null;

  const kpi1Delta = computeDelta(targetDistinctCount, prevDistinctCount, prevYearHasData);

  const yearBreakdownText = isAllYears
    ? `ทั้งหมด ${targetDistinctCount} โครงการ (ยืนยัน ${targetVerifiedDistinctCount} · คาดการณ์ ${targetAutoDistinctCount})`
    : comparisonYears
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
    const sCurRecords = filterRecords(isAllYears ? 'all' : targetYear, s);
    const sCurCount = sCurRecords.length;
    const sVerifiedCount = sCurRecords.filter((r) => r.isVerified).length;
    const sAutoCount = sCurRecords.filter((r) => !r.isVerified).length;
    sdgCountsTarget[s] = sCurCount;

    const sPrevRecords = filterRecords(prevYear, s);
    const sPrevCount = prevYearHasData ? sPrevRecords.length : null;
    const sDelta = computeDelta(sCurCount, sPrevCount, prevYearHasData);
    sdgGrowthTarget[s] = sDelta;

    const yearCounts = comparisonYears.map((y) => {
      const yHas = yearsWithData.includes(y);
      const yRecs = allRecords.filter((r) => r.year === y && r.sdgIds.includes(s));
      return {
        year: y,
        yearBe: toBeYear(y),
        count: yHas ? yRecs.length : 0,
        verifiedCount: yHas ? yRecs.filter((r) => r.isVerified).length : 0,
        autoDetectedCount: yHas ? yRecs.filter((r) => !r.isVerified).length : 0,
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
      verifiedCount: sVerifiedCount,
      autoDetectedCount: sAutoCount,
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

  const topSdgRecords = filterRecords(isAllYears ? 'all' : targetYear, topSdg);
  const topSdgVerifiedCount = topSdgRecords.filter((r) => r.isVerified).length;
  const topSdgAutoCount = topSdgRecords.filter((r) => !r.isVerified).length;

  // Highest growing SDG
  let highGrowSdg: number | null = null;
  let highGrowPct = -9999;
  let highGrowFrom: number | null = null;
  let highGrowTo: number | null = null;
  for (let s = 1; s <= 17; s++) {
    const delta = sdgGrowthTarget[s];
    if (delta.type === 'up' && delta.percent !== null && delta.percent > highGrowPct) {
      highGrowPct = delta.percent;
      highGrowSdg = s;
      highGrowFrom = prevYearHasData ? filterRecords(prevYear, s).length : null;
      highGrowTo = sdgCountsTarget[s];
    }
  }

  // If no 'up' growing SDG, fallback to any with highest percentage > 0
  if (!highGrowSdg) {
    for (let s = 1; s <= 17; s++) {
      const delta = sdgGrowthTarget[s];
      if (delta.percent !== null && delta.percent > highGrowPct && delta.percent > 0) {
        highGrowPct = delta.percent;
        highGrowSdg = s;
        highGrowFrom = prevYearHasData ? filterRecords(prevYear, s).length : null;
        highGrowTo = sdgCountsTarget[s];
      }
    }
  }

  const coveredSdgNumbers = Object.keys(sdgCountsTarget)
    .map(Number)
    .filter((s) => sdgCountsTarget[s] > 0);
  const coveredSdgCount = coveredSdgNumbers.length;

  const yearlyTotals: Record<number, number | null> = {};
  comparisonYears.forEach((y) => {
    const yBe = toBeYear(y);
    if (!yearsWithData.includes(y)) {
      yearlyTotals[yBe] = null;
    } else {
      yearlyTotals[yBe] = new Set(filterRecords(y, params.selectedSdg).map((r) => r.id)).size;
    }
  });

  const kpis: SdgKpiSummary = {
    distinctProjectsCount: targetDistinctCount,
    distinctVerifiedCount: targetVerifiedDistinctCount,
    distinctAutoCount: targetAutoDistinctCount,
    distinctProjectsDeltaPercent: kpi1Delta.percent,
    distinctProjectsDeltaLabel: kpi1Delta.label,
    distinctProjectsDeltaType: kpi1Delta.type,
    yearBreakdownText,
    topSdgNumber: topSdg,
    topSdgNameTh: SDG_DEFINITIONS[topSdg]?.nameTh || '',
    topSdgCount: topCount > 0 ? topCount : 0,
    topSdgVerifiedCount,
    topSdgAutoCount,
    highestGrowingSdgNumber: highGrowSdg,
    highestGrowingSdgNameTh: highGrowSdg ? SDG_DEFINITIONS[highGrowSdg]?.nameTh || '' : '–',
    highestGrowingDeltaLabel: highGrowSdg ? sdgGrowthTarget[highGrowSdg].label : '–',
    highestGrowingFrom: highGrowFrom,
    highestGrowingTo: highGrowTo,
    highestGrowingPercent: highGrowPct > -9999 ? highGrowPct : null,
    coveredSdgCount,
    coveredSdgNumbers,
    yearlyTotals,
  };

  // 3. Monthly Bar Chart (Always include all 12 months ม.ค. - ธ.ค.)
  const monthlyBars: MonthlyBarData[] = [];
  for (let m = 0; m < 12; m++) {
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
        verifiedCount: yHas ? recs.filter((r) => r.isVerified).length : 0,
        autoDetectedCount: yHas ? recs.filter((r) => !r.isVerified).length : 0,
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
    totalVerifiedRecords: allRecords.filter((r) => r.isVerified).length,
    totalAutoDetectedRecords: allRecords.filter((r) => !r.isVerified).length,
  };
}
