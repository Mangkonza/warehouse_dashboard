import { parseNumber } from '@/lib/kpiEngine';
import { autoDetectJournalRanking } from '@/config/journalRankingConfig';
import type { OverviewKpiScore } from '../_hooks/useOverviewData';

export interface KpiSourceLists {
  research: any[];
  academic: any[];
  publications: any[];
  service: any[];
  ip: any[];
}

/** Percent of the fiscal year (Oct → Sep) elapsed, clamped to 8–100. */
export function getFiscalYearProgress(now: Date = new Date()): number {
  const fiscalMonthIndex = ((now.getMonth() + 3) % 12) + 1;
  return Math.min(100, Math.max(8, Math.round((fiscalMonthIndex / 12) * 100)));
}

function getStatusInfo(actualPct: number, targetProRata: number) {
  if (actualPct >= 100) return { label: 'บรรลุแล้ว', color: '#059669', bg: '#ecfdf5' };
  if (actualPct >= targetProRata * 0.9) return { label: 'ตามแผน', color: '#0284c7', bg: '#f0f9ff' };
  if (actualPct >= targetProRata * 0.7) return { label: 'เสี่ยง', color: '#d97706', bg: '#fffbeb' };
  return { label: 'ต้องเร่งรัด', color: '#dc2626', bg: '#fef2f2' };
}

const pct = (actual: number, target: number) => Math.min(200, Math.round((actual / target) * 1000) / 10);

export function buildKpiScorecard(lists: KpiSourceLists, fiscalYearProgress: number): OverviewKpiScore[] {
  const { research, academic, publications, service, ip } = lists;

  const externalResearchItems = research.filter((cur) => parseNumber(cur.budget_external) > 0);
  const externalBudget = research.reduce((acc, cur) => acc + parseNumber(cur.budget_external), 0);
  const targetExternal = 100000000;
  const pctExternal = pct(externalBudget, targetExternal);

  const scopusItems = publications.filter((p) => {
    const tier = autoDetectJournalRanking(p.journal || '', p.level || '');
    const s = `${p.journal || ''} ${p.level || ''}`.toLowerCase();
    return tier.startsWith('Scopus') || s.includes('scopus') || s.includes('wos') || s.includes('นานาชาติ');
  });
  const scopusCount = scopusItems.length || publications.length;
  const targetScopus = 330;
  const pctScopus = pct(scopusCount, targetScopus);

  const megaItems = research.filter(
    (r) => parseNumber(r.budget_external) + parseNumber(r.budget_internal) >= 10000000
  );
  const megaCount = megaItems.length;
  const targetMega = 5;
  const pctMega = pct(megaCount, targetMega);

  const academicRevenue = academic.reduce((acc, cur) => acc + parseNumber(cur.budget), 0);
  const serviceExplicitRevenue = service.reduce(
    (acc, cur) => acc + (parseNumber(cur.actual_revenue) || parseNumber(cur.budget) || parseNumber(cur.revenue) || 0),
    0
  );
  const actualServiceRevenue = academicRevenue + serviceExplicitRevenue;
  const targetServiceRevenue = 50000000;
  const pctService = pct(actualServiceRevenue, targetServiceRevenue);

  const ipCount = ip.length;
  const targetIP = 15;
  const pctIP = pct(ipCount, targetIP);

  return [
    {
      id: 'external_budget',
      code: 'KPI 2.1-6',
      title: 'งบวิจัยจากแหล่งทุนภายนอก',
      actual: externalBudget,
      actualFormatted: `${(externalBudget / 1000000).toFixed(2)} ล้านบาท`,
      target: targetExternal,
      targetFormatted: '100.00 ล้านบาท',
      unit: 'บาท',
      percent: pctExternal,
      proRataTarget: fiscalYearProgress,
      categoryKey: 'research',
      items: externalResearchItems.length > 0 ? externalResearchItems : research,
      status: getStatusInfo(pctExternal, fiscalYearProgress),
    },
    {
      id: 'scopus_pub',
      code: 'KPI 2.1-1',
      title: 'ตีพิมพ์ระดับนานาชาติ (Scopus/WoS)',
      actual: scopusCount,
      actualFormatted: `${scopusCount} เรื่อง`,
      target: targetScopus,
      targetFormatted: '330 เรื่อง',
      unit: 'เรื่อง',
      percent: pctScopus,
      proRataTarget: fiscalYearProgress,
      categoryKey: 'publications',
      items: scopusItems.length > 0 ? scopusItems : publications,
      status: getStatusInfo(pctScopus, fiscalYearProgress),
    },
    {
      id: 'mega_projects',
      code: 'KPI 2.1-2',
      title: 'โครงการวิจัยขนาดใหญ่ (≥ 10 ล้าน)',
      actual: megaCount,
      actualFormatted: `${megaCount} โครงการ`,
      target: targetMega,
      targetFormatted: '5 โครงการ',
      unit: 'โครงการ',
      percent: pctMega,
      proRataTarget: fiscalYearProgress,
      categoryKey: 'research',
      items: megaItems,
      status: getStatusInfo(pctMega, fiscalYearProgress),
    },
    {
      id: 'service_revenue',
      code: 'KPI 2.2-1',
      title: 'งบโครงการพัฒนาวิชาการและบริการวิชาการ',
      actual: actualServiceRevenue,
      actualFormatted: `${(actualServiceRevenue / 1000000).toFixed(2)} ล้านบาท`,
      target: targetServiceRevenue,
      targetFormatted: '50.00 ล้านบาท',
      unit: 'บาท',
      percent: pctService,
      proRataTarget: fiscalYearProgress,
      categoryKey: 'academic',
      items: academic,
      status: getStatusInfo(pctService, fiscalYearProgress),
    },
    {
      id: 'ip_patents',
      code: 'KPI 2.3-2',
      title: 'ยื่นจดงานทรัพย์สินทางปัญญา',
      actual: ipCount,
      actualFormatted: `${ipCount} รายการ`,
      target: targetIP,
      targetFormatted: '15 รายการ',
      unit: 'รายการ',
      percent: pctIP,
      proRataTarget: fiscalYearProgress,
      categoryKey: 'ip',
      items: ip,
      status: getStatusInfo(pctIP, fiscalYearProgress),
    },
  ];
}
