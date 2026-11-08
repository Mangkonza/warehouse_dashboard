/**
 * Reusable Year-over-Year (YoY) Comparison Engine
 * Provides mathematically safe calculations, fiscal year extraction,
 * and mission-specific YoY aggregations.
 */

import { parseNumber } from './kpiEngine';

export const YEARS = ['2566', '2567', '2568', '2569', '2570'];

/**
 * Intelligent fiscal year extractor supporting:
 * - Direct fiscal year fields (fiscal_year_be, fiscal_year)
 * - Project IDs / codes (e.g. วศ.กพส. 1/2569, PRP 6805031920)
 * - Funding source tags (e.g. ทุน 2568)
 * - Date strings (filing_date, start_date, date, etc.)
 * - Normalization of legacy typo years (1968 -> 2568, 2024 -> 2567, 2025 -> 2568, 2026 -> 2569)
 */
export const extractFiscalYear = (item: any): string => {
  if (!item) return '2568';

  // 0. Direct fiscal year fields
  for (const key of ['fiscal_year_be', 'fiscal_year']) {
    const val = String(item[key] || '');
    const m = val.match(/25(6[6-9]|70)/);
    if (m) return `25${m[1]}`;
  }

  // 1. Detect from ID / code
  const idStr = String(item.id || item._id || '').replace(/\n/g, ' ');
  const idMatch = idStr.match(/(?:25|20)(\d{2})/);
  if (idMatch) {
    const yr = idMatch[1];
    if (Number(yr) >= 66 && Number(yr) <= 70) {
      return `25${yr}`;
    }
  }
  const shortIdMatch = idStr.match(/(?:\/|\.)(6[6-9]|70)\b/);
  if (shortIdMatch) {
    return `25${shortIdMatch[1]}`;
  }

  // 2. Detect from funding source
  const fundStr = String(item.fund_source || '');
  const fundMatch = fundStr.match(/25(6[6-9]|70)/);
  if (fundMatch) {
    return `25${fundMatch[1]}`;
  }

  // 3. Detect from date fields
  const dateStr = String(
    item.filing_date ||
      item.start_date ||
      item.date ||
      item.academic_year ||
      item.year ||
      item.month_year ||
      ''
  );
  // Typo year normalization (e.g. 1968 -> 2568)
  const legacyMatch = dateStr.match(/19(6[6-9]|70)/);
  if (legacyMatch) {
    return `25${legacyMatch[1]}`;
  }
  const thMatch = dateStr.match(/25(6[6-9]|70)/);
  if (thMatch) {
    return `25${thMatch[1]}`;
  }
  const enMatch = dateStr.match(/20(2[3-7])/);
  if (enMatch) {
    const y = parseInt(enMatch[1], 10) + 43;
    return `25${y}`;
  }

  return '2568';
};

export interface YoYGrowthResult {
  base: number;
  target: number;
  absDiff: number;
  growthPct: number;
  formattedPct: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'emerald' | 'rose' | 'slate';
  badgeText: string;
}

/**
 * Mathematically safe YoY growth calculator:
 * - 0 vs 0 -> 0.0%, neutral
 * - 0 vs N -> +100.0%, up (+100% (ใหม่))
 * - N vs 0 -> -100.0%, down
 * - General -> ((target - base) / base) * 100
 */
export function calcYoYGrowth(baseVal: number, targetVal: number): YoYGrowthResult {
  const absDiff = targetVal - baseVal;

  if (baseVal === 0 && targetVal === 0) {
    return {
      base: 0,
      target: 0,
      absDiff: 0,
      growthPct: 0.0,
      formattedPct: '0.0%',
      trend: 'neutral',
      color: 'slate',
      badgeText: '0.0%',
    };
  }

  if (baseVal === 0) {
    return {
      base: 0,
      target: targetVal,
      absDiff,
      growthPct: 100.0,
      formattedPct: '+100.0%',
      trend: 'up',
      color: 'emerald',
      badgeText: '+100% (ใหม่)',
    };
  }

  if (targetVal === 0) {
    return {
      base: baseVal,
      target: 0,
      absDiff,
      growthPct: -100.0,
      formattedPct: '-100.0%',
      trend: 'down',
      color: 'rose',
      badgeText: '-100.0%',
    };
  }

  const growthPct = ((targetVal - baseVal) / baseVal) * 100;
  const isUp = growthPct > 0.01;
  const isDown = growthPct < -0.01;
  const trend: 'up' | 'down' | 'neutral' = isUp ? 'up' : isDown ? 'down' : 'neutral';
  const color: 'emerald' | 'rose' | 'slate' = isUp ? 'emerald' : isDown ? 'rose' : 'slate';
  const formattedPct = `${growthPct > 0 ? '+' : ''}${growthPct.toFixed(1)}%`;

  return {
    base: baseVal,
    target: targetVal,
    absDiff,
    growthPct,
    formattedPct,
    trend,
    color,
    badgeText: formattedPct,
  };
}

export function formatGrowthBadge(pct: number): { text: string; trend: 'up' | 'down' | 'neutral'; color: 'emerald' | 'rose' | 'slate' } {
  if (pct > 0.01) return { text: `+${pct.toFixed(1)}%`, trend: 'up', color: 'emerald' };
  if (pct < -0.01) return { text: `${pct.toFixed(1)}%`, trend: 'down', color: 'rose' };
  return { text: '0.0%', trend: 'neutral', color: 'slate' };
}

/**
 * Filter items by department if activeDept is specified and not 'all'
 */
export function filterByDepartment(items: any[], activeDept?: string): any[] {
  if (!activeDept || activeDept === 'all') return items;
  return items.filter((item) => String(item.department || '').includes(activeDept));
}

/**
 * Filter items by fiscal year using extractFiscalYear
 */
export function filterByFiscalYear(items: any[], year: string): any[] {
  return items.filter((item) => extractFiscalYear(item) === year);
}

/**
 * Group raw dataset into fiscal years, respecting active department filter
 */
export function groupItemsByFiscalYear(
  items: any[],
  activeDept?: string,
  supportedYears: string[] = YEARS
): Record<string, any[]> {
  const deptFiltered = filterByDepartment(items, activeDept);
  const groups: Record<string, any[]> = {};
  supportedYears.forEach((y) => {
    groups[y] = [];
  });
  deptFiltered.forEach((item) => {
    const y = extractFiscalYear(item);
    if (groups[y]) {
      groups[y].push(item);
    }
  });
  return groups;
}

/**
 * Mission-specific metrics for YoY comparisons
 */
export interface MissionMetricSummary {
  year: string;
  count: number;
  primaryBudget: number;
  secondaryBudget?: number;
  items: any[];
}

export function summarizeResearchYoY(items: any[], year: string, activeDept?: string): MissionMetricSummary {
  const yearItems = filterByFiscalYear(filterByDepartment(items, activeDept), year);
  let totalBudget = 0;
  let extBudget = 0;
  yearItems.forEach((r) => {
    const ext = parseNumber(r.budget_external);
    const int = parseNumber(r.budget_internal);
    const b = ext + int > 0 ? ext + int : parseNumber(r.budget);
    totalBudget += b;
    extBudget += ext;
  });
  return {
    year,
    count: yearItems.length,
    primaryBudget: totalBudget,
    secondaryBudget: extBudget,
    items: yearItems,
  };
}

export function summarizeAcademicYoY(items: any[], year: string, activeDept?: string): MissionMetricSummary {
  const yearItems = filterByFiscalYear(filterByDepartment(items, activeDept), year);
  let totalBudget = 0;
  yearItems.forEach((a) => {
    totalBudget += parseNumber(a.budget);
  });
  const overhead15 = (totalBudget * 15) / 100;
  return {
    year,
    count: yearItems.length,
    primaryBudget: totalBudget,
    secondaryBudget: overhead15,
    items: yearItems,
  };
}

export function summarizePublicationsYoY(items: any[], year: string, activeDept?: string): MissionMetricSummary {
  const yearItems = filterByFiscalYear(filterByDepartment(items, activeDept), year);
  let totalBudget = 0;
  yearItems.forEach((p) => {
    totalBudget += parseNumber(p.support_amount) || parseNumber(p.budget) || 0;
  });
  return {
    year,
    count: yearItems.length,
    primaryBudget: totalBudget,
    items: yearItems,
  };
}

export function summarizeServiceYoY(items: any[], year: string, activeDept?: string): MissionMetricSummary {
  const yearItems = filterByFiscalYear(filterByDepartment(items, activeDept), year);
  let totalRevenue = 0;
  yearItems.forEach((s) => {
    totalRevenue += parseNumber(s.actual_revenue) || parseNumber(s.budget) || parseNumber(s.revenue) || 0;
  });
  return {
    year,
    count: yearItems.length,
    primaryBudget: totalRevenue,
    items: yearItems,
  };
}

export function summarizeIPYoY(items: any[], year: string, activeDept?: string): MissionMetricSummary {
  const yearItems = filterByFiscalYear(filterByDepartment(items, activeDept), year);
  let totalSupport = 0;
  yearItems.forEach((ip) => {
    totalSupport += parseNumber(ip.support_amount) || parseNumber(ip.budget) || 0;
  });
  return {
    year,
    count: yearItems.length,
    primaryBudget: totalSupport,
    items: yearItems,
  };
}
