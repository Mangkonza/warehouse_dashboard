import { parseNumber, getStoredKPIs } from '@/lib/kpiEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import { getCurrentFiscalYear, resolveItemFiscalYear } from '@/types/timeFilter';
import type { OverviewKpiScore } from '../_hooks/useOverviewData';

export interface KpiSourceLists {
  research: any[];
  academic: any[];
  publications: any[];
  service: any[];
  ip: any[];
}

/** Journal quartiles that count as an international publication. */
export const INTERNATIONAL_TIERS = ['Q1', 'Q2', 'Q3', 'Q4'];
/** Thai journal tiers. */
export const NATIONAL_TIERS = ['TCI 1', 'TCI 2'];

/** Resolve the journal tier for a publication (Q1–Q4, TCI 1–2). */
export function classifyPublicationTier(item: any): string {
  return String(item?.journal_tier || autoDetectJournalRanking(item?.journal || '', item?.level || ''));
}

export function isInternationalTier(tier: string): boolean {
  return INTERNATIONAL_TIERS.includes(tier);
}

export function isNationalTier(tier: string): boolean {
  return NATIONAL_TIERS.includes(tier);
}

/** Percent of the fiscal year (Oct → Sep) elapsed, clamped to 8–100. */
export function getFiscalYearProgress(now: Date = new Date()): number {
  const fiscalMonthIndex = ((now.getMonth() + 3) % 12) + 1;
  return Math.min(100, Math.max(8, Math.round((fiscalMonthIndex / 12) * 100)));
}

/**
 * Elapsed progress for a specific BE fiscal year. Past years are complete
 * (100%), future years have not started (0%). This keeps the ring marker
 * aligned with the year the KPI is actually compared against instead of
 * always using the current fiscal year.
 */
export function getFiscalYearProgressFor(fiscalYear: string | null, now: Date = new Date()): number {
  if (!fiscalYear) return getFiscalYearProgress(now);
  const current = Number(getCurrentFiscalYear(now));
  const target = Number(fiscalYear);
  if (!Number.isFinite(current) || !Number.isFinite(target)) return getFiscalYearProgress(now);
  if (target < current) return 100;
  if (target > current) return 0;
  return getFiscalYearProgress(now);
}

/** Latest BE fiscal year present in a category. */
function latestFiscalYear(items: any[], category: string): string | null {
  let latest: string | null = null;
  for (const item of items) {
    const year = resolveItemFiscalYear(item, category);
    if (!year) continue;
    if (!latest || Number(year) > Number(latest)) latest = year;
  }
  return latest;
}

function inFiscalYear(items: any[], category: string, year: string | null): any[] {
  if (!year) return items;
  return items.filter((item) => resolveItemFiscalYear(item, category) === String(year));
}

function getStatusInfo(actualPct: number, targetProRata: number) {
  if (actualPct >= 100) return { label: 'บรรลุเป้าหมาย', color: '#059669', bg: '#ecfdf5' };
  if (actualPct >= 50) return { label: 'กำลังดำเนินการ (50–99%)', color: '#ca8a04', bg: '#fefce8' };
  return { label: 'ต้องเร่งรัด', color: '#dc2626', bg: '#fef2f2' };
}

const pct = (actual: number, target: number) =>
  target <= 0 ? 0 : Math.min(200, Math.round((actual / target) * 1000) / 10);

export interface KpiBuildOptions {
  /**
   * BE fiscal year to compare against. `'all'` (or omitted) compares each KPI
   * against the latest fiscal year that has data for its own source list.
   */
  fiscalYear?: string;
  now?: Date;
}

export function buildKpiScorecard(lists: KpiSourceLists, options: KpiBuildOptions = {}): OverviewKpiScore[] {
  const { research, academic, publications, service, ip } = lists;
  const now = options.now ?? new Date();
  const requested =
    options.fiscalYear && options.fiscalYear !== 'all' ? String(options.fiscalYear) : null;

  const storedKpis = getStoredKPIs();
  const getCustomTarget = (code: string, fallback: number): number => {
    const found = storedKpis.find((k) => k.code === code);
    return found && typeof found.targetValue === 'number' && found.targetValue > 0
      ? found.targetValue
      : fallback;
  };

  // Research: external budget and mega projects share one fiscal year.
  const researchYear = requested ?? latestFiscalYear(research, 'research');
  const researchItems = inFiscalYear(research, 'research', researchYear);

  const externalResearchItems = researchItems.filter((cur) => parseNumber(cur.budget_external) > 0);
  const externalBudget = researchItems.reduce((acc, cur) => acc + parseNumber(cur.budget_external), 0);
  const targetExternal = getCustomTarget('KPI 2.1-6', 100000000);
  const pctExternal = pct(externalBudget, targetExternal);
  const gapExternal = Math.max(0, targetExternal - externalBudget);

  const megaItems = researchItems.filter(
    (r) => parseNumber(r.budget_external) + parseNumber(r.budget_internal) >= 10000000
  );
  const megaCount = megaItems.length;
  const targetMega = getCustomTarget('KPI 2.1-2', 5);
  const pctMega = pct(megaCount, targetMega);
  const gapMega = Math.max(0, targetMega - megaCount);

  // Publications: count only international quartiles (Q1–Q4). TCI 1–2 are
  // Thai journals and must not be counted as international output.
  const publicationsYear = requested ?? latestFiscalYear(publications, 'publications');
  const publicationItems = inFiscalYear(publications, 'publications', publicationsYear);
  const tierBreakdown: Record<string, number> = {};
  publicationItems.forEach((p) => {
    const tier = classifyPublicationTier(p);
    tierBreakdown[tier] = (tierBreakdown[tier] || 0) + 1;
  });
  const internationalItems = publicationItems.filter((p) => isInternationalTier(classifyPublicationTier(p)));
  const internationalCount = internationalItems.length;
  const targetInternational = getCustomTarget('KPI 2.1-1', 330);
  const pctInternational = pct(internationalCount, targetInternational);
  const gapInternational = Math.max(0, targetInternational - internationalCount);

  // Academic development projects are usually undated, so they cannot be
  // attributed to a fiscal year. They participate in the all-years view and
  // are flagged as undated rather than silently mixed into a year.
  const academicDated = academic.filter((a) => resolveItemFiscalYear(a, 'academic') !== null);
  const academicUndated = academic.filter((a) => resolveItemFiscalYear(a, 'academic') === null);
  const academicItems = requested ? inFiscalYear(academicDated, 'academic', requested) : academicDated;
  const undatedAcademicItems = requested ? [] : academicUndated;

  const serviceYear = requested ?? latestFiscalYear(service, 'service');
  const serviceItems = inFiscalYear(service, 'service', serviceYear);

  const academicRevenue = academicItems.reduce((acc, cur) => acc + parseNumber(cur.budget), 0);
  const undatedAcademicRevenue = undatedAcademicItems.reduce((acc, cur) => acc + parseNumber(cur.budget), 0);
  const serviceRevenue = serviceItems.reduce(
    (acc, cur) => acc + (parseNumber(cur.actual_revenue) || parseNumber(cur.budget) || parseNumber(cur.revenue) || 0),
    0
  );
  const actualServiceRevenue = academicRevenue + undatedAcademicRevenue + serviceRevenue;
  const targetServiceRevenue = getCustomTarget('KPI 2.2-1', 50000000);
  const pctService = pct(actualServiceRevenue, targetServiceRevenue);
  const gapService = Math.max(0, targetServiceRevenue - actualServiceRevenue);
  const includesUndated = undatedAcademicItems.length > 0;

  const ipYear = requested ?? latestFiscalYear(ip, 'ip');
  const ipItems = inFiscalYear(ip, 'ip', ipYear);
  const ipCount = ipItems.length;
  const targetIP = getCustomTarget('KPI 2.3-2', 15);
  const pctIP = pct(ipCount, targetIP);
  const gapIP = Math.max(0, targetIP - ipCount);

  const progressFor = (year: string | null) => getFiscalYearProgressFor(year, now);

  const researchProgress = progressFor(researchYear);
  const publicationsProgress = progressFor(publicationsYear);
  const serviceProgress = progressFor(serviceYear);
  const ipProgress = progressFor(ipYear);

  return [
    {
      id: 'external_budget',
      code: 'KPI 2.1-6',
      title: 'งบวิจัยจากแหล่งทุนภายนอก',
      actual: externalBudget,
      actualFormatted: `${(externalBudget / 1000000).toFixed(2)} ล้านบาท`,
      target: targetExternal,
      targetFormatted: `${(targetExternal / 1000000).toFixed(2)} ล้านบาท`,
      unit: 'บาท',
      percent: pctExternal,
      proRataTarget: researchProgress,
      categoryKey: 'research',
      fiscalYear: researchYear,
      gap: gapExternal,
      gapFormatted: gapExternal > 0 ? `ยังขาด ${(gapExternal / 1000000).toFixed(2)} ล้านบาท` : 'บรรลุเป้าหมายแล้ว',
      items: externalResearchItems.length > 0 ? externalResearchItems : researchItems,
      status: getStatusInfo(pctExternal, researchProgress),
    },
    {
      id: 'scopus_pub',
      code: 'KPI 2.1-1',
      title: 'ตีพิมพ์ระดับนานาชาติ (Q1–Q4)',
      actual: internationalCount,
      actualFormatted: `${internationalCount} เรื่อง`,
      target: targetInternational,
      targetFormatted: `${targetInternational} เรื่อง`,
      unit: 'เรื่อง',
      percent: pctInternational,
      proRataTarget: publicationsProgress,
      categoryKey: 'publications',
      fiscalYear: publicationsYear,
      tierBreakdown,
      gap: gapInternational,
      gapFormatted: gapInternational > 0 ? `ยังขาด ${gapInternational} เรื่อง` : 'บรรลุเป้าหมายแล้ว',
      items: internationalItems,
      status: getStatusInfo(pctInternational, publicationsProgress),
    },
    {
      id: 'mega_projects',
      code: 'KPI 2.1-2',
      title: 'โครงการวิจัยขนาดใหญ่ (≥ 10 ล้าน)',
      actual: megaCount,
      actualFormatted: `${megaCount} โครงการ`,
      target: targetMega,
      targetFormatted: `${targetMega} โครงการ`,
      unit: 'โครงการ',
      percent: pctMega,
      proRataTarget: researchProgress,
      categoryKey: 'research',
      fiscalYear: researchYear,
      gap: gapMega,
      gapFormatted: gapMega > 0 ? `ยังขาด ${gapMega} โครงการ` : 'บรรลุเป้าหมายแล้ว',
      items: megaItems,
      status: getStatusInfo(pctMega, researchProgress),
    },
    {
      id: 'service_revenue',
      code: 'KPI 2.2-1',
      title: 'งบโครงการพัฒนาวิชาการและบริการวิชาการ',
      actual: actualServiceRevenue,
      actualFormatted: `${(actualServiceRevenue / 1000000).toFixed(2)} ล้านบาท`,
      target: targetServiceRevenue,
      targetFormatted: `${(targetServiceRevenue / 1000000).toFixed(2)} ล้านบาท`,
      unit: 'บาท',
      percent: pctService,
      proRataTarget: serviceProgress,
      categoryKey: 'academic',
      fiscalYear: serviceYear,
      includesUndated,
      gap: gapService,
      gapFormatted: gapService > 0 ? `ยังขาด ${(gapService / 1000000).toFixed(2)} ล้านบาท` : 'บรรลุเป้าหมายแล้ว',
      items: [...academicItems, ...undatedAcademicItems, ...serviceItems],
      status: getStatusInfo(pctService, serviceProgress),
    },
    {
      id: 'ip_patents',
      code: 'KPI 2.3-2',
      title: 'ยื่นจดงานทรัพย์สินทางปัญญา',
      actual: ipCount,
      actualFormatted: `${ipCount} รายการ`,
      target: targetIP,
      targetFormatted: `${targetIP} รายการ`,
      unit: 'รายการ',
      percent: pctIP,
      proRataTarget: ipProgress,
      categoryKey: 'ip',
      fiscalYear: ipYear,
      gap: gapIP,
      gapFormatted: gapIP > 0 ? `ยังขาด ${gapIP} รายการ` : 'บรรลุเป้าหมายแล้ว',
      items: ipItems,
      status: getStatusInfo(pctIP, ipProgress),
    },
  ];
}
