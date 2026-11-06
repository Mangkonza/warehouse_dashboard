import {
  KPIItem,
  KPIComputedResult,
  KPIReportingRound,
  KPIReportingRoundConfig,
  StrategicStrategyEntity,
  StrategicPlanEntity,
  KPIFormulaMethod,
  KPIRoundResultEntry,
} from '../types/kpi';
import {
  DEFAULT_KPIS,
  ENGINEERING_DEPARTMENTS,
  STRATEGIC_PILLARS,
  COLLECTION_PERIOD_OPTIONS,
  StrategicPillarOption,
} from '../config/kpiConfig';
import { isTestRecord } from './sdgEngine';

export {
  DEFAULT_KPIS,
  ENGINEERING_DEPARTMENTS,
  STRATEGIC_PILLARS,
  COLLECTION_PERIOD_OPTIONS,
};

const STORAGE_KEY = 'ku_warehouse_dynamic_kpis_v4';
const KPI_DB_SYNCED_KEY = 'ku_warehouse_kpi_db_synced_v1';
const STRATEGIES_STORAGE_KEY = 'ku_warehouse_strategic_strategies_v1';
const PLANS_STORAGE_KEY = 'ku_warehouse_strategic_plans_v1';
const HIERARCHY_DB_SYNCED_KEY = 'ku_warehouse_hierarchy_db_synced_v1';
const ROUNDS_STORAGE_KEY = 'ku_warehouse_kpi_reporting_rounds_v1';
const LOOKUPS_STORAGE_KEY = 'ku_warehouse_kpi_lookup_options_v1';

const STRATEGY_COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  '1.1': { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  '1.2': { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
  '1.3': { bg: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9' },
  '2.1': { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  '2.2': { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1' },
  '2.3': { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  '3.1': { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  '3.2': { bg: '#fdf2f8', border: '#fbcfe8', text: '#be185d' },
  '4.1': { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
};

const EXTRA_STRATEGY_COLORS = [
  { bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
  { bg: '#faf5ff', border: '#e9d5ff', text: '#7e22ce' },
  { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  { bg: '#fff1f2', border: '#fecdd3', text: '#be123c' },
  { bg: '#f8fafc', border: '#cbd5e1', text: '#334155' },
];

export const getStrategyColor = (code?: string): { bg: string; border: string; text: string } => {
  if (!code) return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' };
  const clean = code.trim();
  if (STRATEGY_COLOR_MAP[clean]) return STRATEGY_COLOR_MAP[clean];
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  return EXTRA_STRATEGY_COLORS[hash % EXTRA_STRATEGY_COLORS.length];
};

export const parseNumber = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ==========================================
// 1. Default & Stored Reporting Rounds (รอบการรายงานผล)
// ==========================================
export const DEFAULT_REPORTING_ROUNDS: KPIReportingRoundConfig[] = [
  {
    id: 'round-6m',
    legacyKey: '6M',
    name: 'รอบ 6 เดือน',
    startDate: '2025-10-01',
    endDate: '2026-03-31',
    dueDate: '2026-04-10',
    isCumulative: true,
    fiscalYear: '2569',
    sortOrder: 1,
  },
  {
    id: 'round-9m',
    legacyKey: '9M',
    name: 'รอบ 9 เดือน',
    startDate: '2025-10-01',
    endDate: '2026-07-31',
    dueDate: '2026-08-10',
    isCumulative: true,
    fiscalYear: '2569',
    sortOrder: 2,
  },
];

const THAI_SHORT_MONTHS = [
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

export const formatIsoToThaiShort = (iso?: string, includeDay = false): string => {
  if (!iso) return '-';
  const parts = iso.split('-').map(Number);
  if (parts.length !== 3 || !parts[0] || !parts[1]) return iso;
  const [y, m, d] = parts;
  const beYear = y < 2400 ? y + 543 : y;
  const shortYear = String(beYear).slice(-2);
  const mName = THAI_SHORT_MONTHS[m - 1] || '';
  if (includeDay && d) {
    return `${d} ${mName} ${beYear}`;
  }
  return `${mName}${shortYear}`;
};

export const formatRoundDateRange = (round: KPIReportingRoundConfig, fullYear = false): string => {
  if (!round.startDate && !round.endDate) return '';
  if (fullYear) {
    const fmt = (iso?: string) => {
      if (!iso) return '-';
      const [y, m] = iso.split('-').map(Number);
      if (!y || !m) return iso;
      const beYear = y < 2400 ? y + 543 : y;
      return `${THAI_SHORT_MONTHS[m - 1]} ${beYear}`;
    };
    return `${fmt(round.startDate)} – ${fmt(round.endDate)}`;
  }
  return `${formatIsoToThaiShort(round.startDate)} - ${formatIsoToThaiShort(round.endDate)}`;
};

export const getStoredReportingRounds = (): KPIReportingRoundConfig[] => {
  if (typeof window === 'undefined') return DEFAULT_REPORTING_ROUNDS;
  try {
    const raw = localStorage.getItem(ROUNDS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load reporting rounds, using defaults:', err);
  }
  return DEFAULT_REPORTING_ROUNDS;
};

export const saveStoredReportingRounds = (rounds: KPIReportingRoundConfig[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ROUNDS_STORAGE_KEY, JSON.stringify(rounds));
    window.dispatchEvent(new CustomEvent('kpi_rounds_updated', { detail: rounds }));
    window.dispatchEvent(new CustomEvent('kpi_updated'));
  } catch (err) {
    console.error('Failed to save reporting rounds:', err);
  }
};

// ==========================================
// 2. Default & Stored Lookup Options (OptionPopoverSelect)
// ==========================================
export type KpiLookupCategory = 'collection_period' | 'value_type' | 'reporting_level';

export const DEFAULT_KPI_LOOKUP_OPTIONS: Record<KpiLookupCategory, string[]> = {
  collection_period: ['ปีงบประมาณ', 'ปีการศึกษา', 'ปีปฏิทิน', 'ภาคการศึกษา', 'ไตรมาส'],
  value_type: [
    'จำนวนนับ',
    'ร้อยละ',
    'ค่าเฉลี่ย',
    'สัดส่วน A:B',
    'จำนวนเงิน',
    'คะแนน',
    'ข้อความ/ระดับ',
  ],
  reporting_level: ['คณะ', 'ส่วนงาน'],
};

export const getStoredKpiLookupOptions = (category: KpiLookupCategory): string[] => {
  const defaults = (DEFAULT_KPI_LOOKUP_OPTIONS[category] || []).filter((x) => !x.includes('?'));
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(LOOKUPS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string[]>;
      const list = Array.isArray(parsed[category])
        ? parsed[category].filter((x) => typeof x === 'string' && !x.includes('?'))
        : [];
      if (list.length > 0) {
        return Array.from(new Set(list));
      }
    }
  } catch {
    // ignore
  }
  return defaults;
};

export const fetchLookupOptionsFromBackend = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/v1/kpi/options', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const grouped: Record<string, string[]> = {
          collection_period: [],
          value_type: [],
          reporting_level: [],
        };
        json.data.forEach((opt: any) => {
          if (opt.fieldKey && opt.value) {
            if (!grouped[opt.fieldKey]) grouped[opt.fieldKey] = [];
            if (!grouped[opt.fieldKey].includes(opt.value)) {
              grouped[opt.fieldKey].push(opt.value);
            }
          }
        });
        localStorage.setItem(LOOKUPS_STORAGE_KEY, JSON.stringify(grouped));
        window.dispatchEvent(new CustomEvent('kpi_lookups_updated'));
      }
    }
  } catch (err) {
    console.warn('[kpiEngine] fetchLookupOptionsFromBackend failed:', err);
  }
};

export const addKpiLookupOption = async (
  category: KpiLookupCategory,
  newValue: string
): Promise<string[]> => {
  const clean = newValue.trim();
  if (!clean || clean === 'อื่นๆ') return getStoredKpiLookupOptions(category);

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOOKUPS_STORAGE_KEY);
      const parsed: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      const existing = Array.isArray(parsed[category]) ? parsed[category] : [];
      if (!existing.includes(clean)) {
        parsed[category] = [...existing, clean];
        localStorage.setItem(LOOKUPS_STORAGE_KEY, JSON.stringify(parsed));
      }
      window.dispatchEvent(new CustomEvent('kpi_lookups_updated', { detail: { category, value: clean } }));
    } catch (e) {
      console.warn('Failed to persist custom lookup to localStorage:', e);
    }

    // Fire-and-forget sync to backend DB lookup table
    fetch('/api/lookups/kpi-options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fieldKey: category, value: clean, label: clean }),
    }).catch(() => {});
  }

  return getStoredKpiLookupOptions(category);
};

// ==========================================
// 3. 4-Tier Hierarchy: Strategies & Plans (อ้างอิงด้วย id ภายใน)
// ==========================================
export const normalizePlanCodeOnly = (rawPlanCode?: string): string => {
  if (!rawPlanCode) return '';
  return rawPlanCode
    .replace(/^แผนงานที่\s*/i, '')
    .replace(/^แผนงาน\s*/i, '')
    .replace(/^โครงการส่วนงาน\s*/i, '')
    .trim();
};

export const normalizeStrategyNameOnly = (rawName: string, code: string): string => {
  return rawName
    .replace(new RegExp(`^ยุทธศาสตร์ที่\\s*${code.replace('.', '\\.')}\\s*:\\s*`, 'i'), '')
    .trim();
};

export const normalizePlanNameOnly = (rawName?: string, code?: string): string => {
  if (!rawName) return '';
  let cleaned = rawName
    .replace(/^แผนงานที่\s*[\d.-]+\s*:\s*/i, '')
    .replace(/^แผนงาน\s*[\d.-]+\s*:\s*/i, '')
    .replace(/^โครงการส่วนงาน\s*[\d.-]+\s*:\s*/i, '')
    .trim();
  if (code) {
    cleaned = cleaned.replace(new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`), '').trim();
  }
  return cleaned;
};

export const getDefaultStrategies = (): StrategicStrategyEntity[] => {
  return STRATEGIC_PILLARS.map((p) => ({
    id: `strat-${p.code.replace(/\./g, '-')}`,
    code: p.code,
    name: normalizeStrategyNameOnly(p.fullName, p.code),
    pillarGroup: p.pillarGroup,
    color: p.color,
  }));
};

export const getDefaultPlans = (): StrategicPlanEntity[] => {
  const strategies = getDefaultStrategies();
  const stratByCode = new Map(strategies.map((s) => [s.code, s]));
  const planMap = new Map<string, StrategicPlanEntity>();

  DEFAULT_KPIS.forEach((kpi) => {
    const sCode = kpi.strategyCode || '2.1';
    const strat = stratByCode.get(sCode);
    if (!strat) return;
    const pCode = normalizePlanCodeOnly(kpi.planCode) || `${sCode}-1`;
    const key = `${strat.id}__${pCode}`;
    if (!planMap.has(key)) {
      planMap.set(key, {
        id: `plan-${pCode.replace(/[^a-zA-Z0-9]/g, '-')}`,
        strategyId: strat.id,
        code: pCode,
        name: normalizePlanNameOnly(kpi.planName, pCode) || kpi.planName || `แผนงาน ${pCode}`,
        isDepartmentProject: Boolean(kpi.isDepartmentProject),
      });
    }
  });

  return Array.from(planMap.values());
};

export const getStoredStrategies = (): StrategicStrategyEntity[] => {
  const defaults = getDefaultStrategies();
  if (typeof window === 'undefined') return defaults;
  try {
    const isDbSynced = localStorage.getItem(HIERARCHY_DB_SYNCED_KEY) === 'true';
    const raw = localStorage.getItem(STRATEGIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StrategicStrategyEntity[];
      if (Array.isArray(parsed)) {
        if (isDbSynced || parsed.length > 0) {
          return parsed.map((s) => ({
            ...s,
            color: s.color || getStrategyColor(s.code),
          }));
        }
      }
    }
  } catch {
    // ignore
  }
  return defaults;
};

export const getStrategicPillar = (strategyCode?: string): StrategicPillarOption | undefined => {
  if (!strategyCode) return undefined;
  const cleanCode = strategyCode.trim();
  const strategies = getStoredStrategies();
  const found = strategies.find((s) => s.code === cleanCode);
  if (found) {
    return {
      code: found.code,
      shortLabel: `ยุทธศาสตร์ที่ ${found.code} (${found.name})`,
      fullName: `ยุทธศาสตร์ที่ ${found.code} : ${found.name}`,
      pillarGroup: found.pillarGroup || `ยุทธศาสตร์ที่ ${found.code}`,
      color: found.color || getStrategyColor(found.code),
    };
  }
  return STRATEGIC_PILLARS.find((s) => s.code === cleanCode);
};

export const fetchHierarchyFromBackend = async (): Promise<{
  strategies: StrategicStrategyEntity[];
  plans: StrategicPlanEntity[];
}> => {
  if (typeof window === 'undefined') {
    return { strategies: getStoredStrategies(), plans: getStoredPlans() };
  }
  try {
    const res = await fetch('/api/v1/kpi/hierarchy', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        const dbStrategies: StrategicStrategyEntity[] = [];
        const dbPlans: StrategicPlanEntity[] = [];

        json.data.forEach((s: any) => {
          const code = String(s.code).trim();
          const stratEntity: StrategicStrategyEntity = {
            id: s.id,
            code,
            name: normalizeStrategyNameOnly(String(s.name || ''), code),
            pillarGroup: s.pillarGroup || `ยุทธศาสตร์ที่ ${code}`,
            color: getStrategyColor(code),
          };
          dbStrategies.push(stratEntity);

          if (Array.isArray(s.plans)) {
            s.plans.forEach((p: any) => {
              const pCode = normalizePlanCodeOnly(String(p.code || ''));
              dbPlans.push({
                id: p.id,
                strategyId: s.id,
                code: pCode,
                name: normalizePlanNameOnly(String(p.name || ''), pCode) || String(p.name || ''),
                isDepartmentProject: Boolean(p.isDepartmentProject),
              });
            });
          }
        });

        dbStrategies.sort((a, b) =>
          a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' })
        );
        dbPlans.sort((a, b) =>
          a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' })
        );

        localStorage.setItem(HIERARCHY_DB_SYNCED_KEY, 'true');
        localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(dbStrategies));
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(dbPlans));
        window.dispatchEvent(new CustomEvent('kpi_hierarchy_updated'));
        return { strategies: dbStrategies, plans: dbPlans };
      }
    }
  } catch (err) {
    console.warn('[kpiEngine] fetchHierarchyFromBackend failed:', err);
  }
  return { strategies: getStoredStrategies(), plans: getStoredPlans() };
};

export const saveStoredStrategies = (list: StrategicStrategyEntity[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('kpi_hierarchy_updated'));
  } catch (e) {
    console.error('Failed to save strategies:', e);
  }
};

export const createStrategyEntity = (
  code: string,
  name: string
): { ok: true; data: StrategicStrategyEntity } | { ok: false; error: string } => {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  if (!cleanCode || !cleanName) {
    return { ok: false, error: 'กรุณากรอกเลขยุทธศาสตร์และชื่อยุทธศาสตร์ให้ครบถ้วน' };
  }
  const current = getStoredStrategies();
  if (current.some((s) => s.code.toLowerCase() === cleanCode.toLowerCase())) {
    return { ok: false, error: `เลขยุทธศาสตร์ "${cleanCode}" มีอยู่ในระบบแล้ว กรุณาระบุเลขอื่น` };
  }
  const newEntity: StrategicStrategyEntity = {
    id: `strat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code: cleanCode,
    name: cleanName,
    pillarGroup: `ยุทธศาสตร์ที่ ${cleanCode}`,
    color: { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857' },
  };
  const next = [...current, newEntity];
  saveStoredStrategies(next);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'strategy', ...newEntity }),
    }).catch(() => {});
  }

  return { ok: true, data: newEntity };
};

export const updateStrategyEntity = (
  id: string,
  code: string,
  name: string
): { ok: true; data: StrategicStrategyEntity } | { ok: false; error: string } => {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  if (!cleanCode || !cleanName) {
    return { ok: false, error: 'กรุณากรอกเลขยุทธศาสตร์และชื่อยุทธศาสตร์ให้ครบถ้วน' };
  }
  const current = getStoredStrategies();
  const existing = current.find((s) => s.id === id);
  if (!existing) {
    return { ok: false, error: 'ไม่พบยุทธศาสตร์ที่ต้องการแก้ไข' };
  }
  if (current.some((s) => s.id !== id && s.code.toLowerCase() === cleanCode.toLowerCase())) {
    return { ok: false, error: `เลขยุทธศาสตร์ "${cleanCode}" มีอยู่ในระบบแล้ว กรุณาระบุเลขอื่น` };
  }

  const updated: StrategicStrategyEntity = {
    ...existing,
    code: cleanCode,
    name: cleanName,
    pillarGroup: `ยุทธศาสตร์ที่ ${cleanCode}`,
  };

  const next = current.map((s) => (s.id === id ? updated : s));
  saveStoredStrategies(next);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'strategy', action: 'update', ...updated }),
    }).catch(() => {});
  }

  return { ok: true, data: updated };
};

export const deleteStrategyEntity = (
  id: string
): { ok: true } | { ok: false; error: string } => {
  const current = getStoredStrategies();
  const existing = current.find((s) => s.id === id);
  if (!existing) {
    return { ok: false, error: 'ไม่พบยุทธศาสตร์ที่ต้องการลบ' };
  }

  const next = current.filter((s) => s.id !== id);
  saveStoredStrategies(next);

  // Cascade delete plans under this strategy
  const currentPlans = getStoredPlans();
  const remainingPlans = currentPlans.filter((p) => p.strategyId !== id);
  saveStoredPlans(remainingPlans);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'strategy', action: 'delete', id }),
    }).catch(() => {});
  }

  return { ok: true };
};

export const getStoredPlans = (): StrategicPlanEntity[] => {
  const defaults = getDefaultPlans();
  if (typeof window === 'undefined') return defaults;
  try {
    const isDbSynced = localStorage.getItem(HIERARCHY_DB_SYNCED_KEY) === 'true';
    const raw = localStorage.getItem(PLANS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StrategicPlanEntity[];
      if (Array.isArray(parsed)) {
        if (isDbSynced || parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {
    // ignore
  }
  return defaults;
};

export const saveStoredPlans = (list: StrategicPlanEntity[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('kpi_hierarchy_updated'));
  } catch (e) {
    console.error('Failed to save plans:', e);
  }
};

export const createPlanEntity = (
  strategyId: string,
  code: string,
  name: string
): { ok: true; data: StrategicPlanEntity } | { ok: false; error: string } => {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  if (!strategyId) {
    return { ok: false, error: 'กรุณาเลือกยุทธศาสตร์ก่อนสร้างแผนงาน' };
  }
  if (!cleanCode || !cleanName) {
    return { ok: false, error: 'กรุณากรอกเลขแผนงานและชื่อแผนงานให้ครบถ้วน' };
  }
  const current = getStoredPlans();
  // Unique constraint within the same strategyId
  if (
    current.some(
      (p) => p.strategyId === strategyId && p.code.toLowerCase() === cleanCode.toLowerCase()
    )
  ) {
    return {
      ok: false,
      error: `เลขแผนงาน "${cleanCode}" ซ้ำภายในยุทธศาสตร์ที่เลือก กรุณาระบุเลขอื่น`,
    };
  }
  const newEntity: StrategicPlanEntity = {
    id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    strategyId,
    code: cleanCode,
    name: cleanName,
  };
  const next = [...current, newEntity];
  saveStoredPlans(next);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'plan', ...newEntity }),
    }).catch(() => {});
  }

  return { ok: true, data: newEntity };
};

export const updatePlanEntity = (
  id: string,
  code: string,
  name: string
): { ok: true; data: StrategicPlanEntity } | { ok: false; error: string } => {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  if (!cleanCode || !cleanName) {
    return { ok: false, error: 'กรุณากรอกเลขแผนงานและชื่อแผนงานให้ครบถ้วน' };
  }
  const current = getStoredPlans();
  const existing = current.find((p) => p.id === id);
  if (!existing) {
    return { ok: false, error: 'ไม่พบแผนงานที่ต้องการแก้ไข' };
  }
  if (
    current.some(
      (p) =>
        p.id !== id &&
        p.strategyId === existing.strategyId &&
        p.code.toLowerCase() === cleanCode.toLowerCase()
    )
  ) {
    return {
      ok: false,
      error: `เลขแผนงาน "${cleanCode}" ซ้ำภายในยุทธศาสตร์นี้ กรุณาระบุเลขอื่น`,
    };
  }

  const updated: StrategicPlanEntity = {
    ...existing,
    code: cleanCode,
    name: cleanName,
  };

  const next = current.map((p) => (p.id === id ? updated : p));
  saveStoredPlans(next);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'plan', action: 'update', ...updated }),
    }).catch(() => {});
  }

  return { ok: true, data: updated };
};

export const deletePlanEntity = (
  id: string
): { ok: true } | { ok: false; error: string } => {
  const current = getStoredPlans();
  const existing = current.find((p) => p.id === id);
  if (!existing) {
    return { ok: false, error: 'ไม่พบแผนงานที่ต้องการลบ' };
  }

  const next = current.filter((p) => p.id !== id);
  saveStoredPlans(next);

  if (typeof window !== 'undefined') {
    fetch('/api/lookups/strategic-hierarchy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'plan', action: 'delete', id }),
    }).catch(() => {});
  }

  return { ok: true };
};

// ==========================================
// 4. Normalize KPI Item (เติม strategyId, planId, resultsByRound และแปลงชื่อเล่นผู้รายงานเป็นชื่อจริงเต็ม)
// ==========================================
export const REPORTER_NICKNAME_TO_FULLNAME: Record<string, string> = {
  ฟ้า: 'นางสาวธัญรดี เกษม',
  ปุ๋ม: 'นางสาวปฐมาภรณ์ อุ่นเรือน',
  พี่น้อย: 'นางสาวเพชรน้อย ยอดอยู่ดี',
  น้อย: 'นางสาวเพชรน้อย ยอดอยู่ดี',
  พี่จัน: 'นางสาวปิยวรรณ จันทร์สี',
  จัน: 'นางสาวปิยวรรณ จันทร์สี',
  พี่ตุ๊ก: 'นางสุกัญญา พันยุโดด',
  ตุ๊ก: 'นางสุกัญญา พันยุโดด',
  ฝัน: 'นางนภัสวรรณ คำฝั้น',
  แก้ว: 'นางรัตนา เขียวแก้ว',
  'อ.ต่าย': 'รศ.ดร.สิรินาฏ น้อยพิทักษ์',
  ส่วนงาน: 'นางสาวเพชรน้อย ยอดอยู่ดี',
  คณะ: 'นางสาวธัญรดี เกษม',
  'คณะวิศวกรรมศาสตร์ กำแพงแสน': 'ผศ.ดร.วันรัฐ อับดุลลากาซิม',
};

export const normalizeSingleReporterName = (name?: string): string => {
  if (!name) return '';
  const trimmed = name.trim();
  if (!trimmed || trimmed === '-') return '';
  return REPORTER_NICKNAME_TO_FULLNAME[trimmed] || trimmed;
};

export const normalizeReportersArray = (
  reporters?: string[],
  reporterStr?: string
): string[] => {
  const rawTokens: string[] = [];
  if (Array.isArray(reporters) && reporters.length > 0) {
    reporters.forEach((r) => {
      if (typeof r === 'string') {
        r.split(/[/,]/).forEach((part) => rawTokens.push(part));
      }
    });
  } else if (reporterStr) {
    reporterStr.split(/[/,]/).forEach((part) => rawTokens.push(part));
  }
  const normalized = rawTokens
    .map((t) => normalizeSingleReporterName(t))
    .filter(Boolean);
  return Array.from(new Set(normalized));
};

export const enrichKPIItem = (kpi: KPIItem): KPIItem => {
  const strategies = getStoredStrategies();
  const plans = getStoredPlans();
  const rounds = getStoredReportingRounds();

  let strategyId = kpi.strategyId;
  let strategyCode = kpi.strategyCode || '2.1';
  let strategyName = kpi.strategyName;

  const foundStrategy =
    (strategyId ? strategies.find((s) => s.id === strategyId) : undefined) ||
    strategies.find((s) => s.code === strategyCode);

  if (foundStrategy) {
    strategyId = foundStrategy.id;
    strategyCode = foundStrategy.code;
    if (!strategyName) {
      strategyName = `ยุทธศาสตร์ที่ ${foundStrategy.code} : ${foundStrategy.name}`;
    }
  }

  const cleanPlanCode = normalizePlanCodeOnly(kpi.planCode);
  let planId = kpi.planId;
  const foundPlan =
    (planId ? plans.find((p) => p.id === planId) : undefined) ||
    plans.find((p) => p.strategyId === strategyId && p.code === cleanPlanCode) ||
    plans.find((p) => p.code === cleanPlanCode);

  if (foundPlan) {
    planId = foundPlan.id;
  }

  // Default reporters array (แปลงชื่อเล่นเป็นชื่อจริงเต็มเสมอ)
  const reporters = normalizeReportersArray(kpi.reporters, kpi.reporter);
  const formattedReporterStr = reporters.join(' / ');

  // Ensure resultsByRound is populated from actual6M / actual9M if not yet present
  let resultsByRound: KPIRoundResultEntry[] = Array.isArray(kpi.resultsByRound)
    ? kpi.resultsByRound.map((entry) => ({
        ...entry,
        reporter: entry.reporter
          ? normalizeReportersArray(undefined, entry.reporter).join(' / ')
          : formattedReporterStr,
      }))
    : [];

  const round6m = rounds.find((r) => r.id === 'round-6m' || r.legacyKey === '6M');
  const round9m = rounds.find((r) => r.id === 'round-9m' || r.legacyKey === '9M');

  if (round6m && !resultsByRound.some((r) => r.roundId === round6m.id)) {
    if (kpi.actual6M !== undefined && kpi.actual6M !== null) {
      resultsByRound.push({
        roundId: round6m.id,
        actualValue: kpi.actual6M,
        actualText: kpi.actual6MText,
        evidence: kpi.evidence,
        remarks: kpi.remarks,
        reporter: formattedReporterStr,
        status: 'submitted',
      });
    }
  }

  if (round9m && !resultsByRound.some((r) => r.roundId === round9m.id)) {
    if (kpi.actual9M !== undefined && kpi.actual9M !== null) {
      resultsByRound.push({
        roundId: round9m.id,
        actualValue: kpi.actual9M,
        actualText: kpi.actual9MText,
        evidence: kpi.evidence,
        remarks: kpi.remarks,
        reporter: formattedReporterStr,
        status: 'submitted',
      });
    }
  }

  // Default valueType based on unit if not set
  const valueType =
    kpi.valueType ||
    (kpi.unit === 'ร้อยละ'
      ? 'ร้อยละ'
      : kpi.unit === 'สัดส่วน'
      ? 'สัดส่วน A:B'
      : kpi.unit === 'ค่าเฉลี่ย' || kpi.unit === 'คะแนนเฉลี่ย'
      ? 'ค่าเฉลี่ย'
      : kpi.unit === 'คะแนน'
      ? 'คะแนน'
      : kpi.unit === 'บาท' || kpi.unit === 'ล้านบาท'
      ? 'จำนวนเงิน'
      : 'จำนวนนับ');

  // Default formulaMethod based on unit/subIndicators if not set
  const formulaMethod: KPIFormulaMethod =
    kpi.formulaMethod ||
    (valueType === 'ร้อยละ'
      ? 'PERCENTAGE'
      : valueType === 'สัดส่วน A:B'
      ? 'RATIO'
      : valueType === 'ค่าเฉลี่ย'
      ? 'AVERAGE'
      : kpi.subIndicators && kpi.subIndicators.length > 0
      ? 'SUM'
      : 'DIRECT');

  // Default reportingLevels
  const reportingLevels =
    kpi.reportingLevels && kpi.reportingLevels.length > 0
      ? kpi.reportingLevels
      : kpi.isDepartmentProject || kpi.departmentTarget !== undefined
      ? ['คณะ', 'ส่วนงาน']
      : ['ส่วนงาน'];

  // Default activeRoundIds = all rounds
  const activeRoundIds =
    kpi.activeRoundIds && kpi.activeRoundIds.length > 0
      ? kpi.activeRoundIds
      : rounds.map((r) => r.id);

  // Enrich subIndicators with default formulaRole, valueSource, reporters, resultsByRound
  const subIndicators = kpi.subIndicators?.map((sub, idx) => {
    const subReportersRaw = normalizeReportersArray(sub.reporters, sub.reporter);
    const subReporters = subReportersRaw.length > 0 ? subReportersRaw : reporters;

    const defaultRole =
      sub.formulaRole ||
      (formulaMethod === 'PERCENTAGE' || formulaMethod === 'RATIO'
        ? idx === 0
          ? 'numerator'
          : idx === 1
          ? 'denominator'
          : 'sum_part'
        : 'sum_part');

    const subResultsByRound: Record<string, string | number> = {
      ...(sub.resultsByRound || {}),
    };
    if (round6m && sub.actual6M !== undefined && subResultsByRound[round6m.id] === undefined) {
      subResultsByRound[round6m.id] = sub.actual6M;
    }
    if (round9m && sub.actual9M !== undefined && subResultsByRound[round9m.id] === undefined) {
      subResultsByRound[round9m.id] = sub.actual9M;
    }

    return {
      ...sub,
      id: sub.id || `${kpi.id}-sub-${idx + 1}`,
      formulaRole: defaultRole,
      valueSource: sub.valueSource || (kpi.calcType === 'auto_sum' ? 'linked_sum' : kpi.calcType !== 'manual' ? 'linked_count' : 'manual'),
      linkedDatasetKey: sub.linkedDatasetKey || kpi.datasetKey || 'research',
      reporters: subReporters,
      reporter: subReporters.join(' / '),
      resultsByRound: subResultsByRound,
    };
  });

  return {
    ...kpi,
    strategyId,
    strategyCode,
    strategyName,
    planId,
    valueType,
    formulaMethod,
    reportingLevels,
    activeRoundIds,
    resultsByRound,
    reporters,
    reporter: formattedReporterStr,
    subIndicators,
  };
};

// Check whether a KPI already has reported results (เพื่อแจ้งเตือนก่อนแก้ หน่วย, สูตร, หรือ เป้า)
export const hasKpiReportedResults = (kpi?: KPIItem | null): boolean => {
  if (!kpi) return false;
  if (kpi.actual6M !== undefined && kpi.actual6M !== null && Number(kpi.actual6M) > 0) return true;
  if (kpi.actual9M !== undefined && kpi.actual9M !== null && Number(kpi.actual9M) > 0) return true;
  if (kpi.actual6MText && kpi.actual6MText.trim() !== '' && kpi.actual6MText.trim() !== '-') return true;
  if (kpi.actual9MText && kpi.actual9MText.trim() !== '' && kpi.actual9MText.trim() !== '-') return true;
  if (Array.isArray(kpi.resultsByRound)) {
    const hasRoundVal = kpi.resultsByRound.some(
      (r) =>
        (r.actualValue !== undefined && r.actualValue !== null && Number(r.actualValue) > 0) ||
        (r.actualText && r.actualText.trim() !== '' && r.actualText.trim() !== '-')
    );
    if (hasRoundVal) return true;
  }
  if (Array.isArray(kpi.subIndicators)) {
    const hasSubVal = kpi.subIndicators.some(
      (s) =>
        (s.actual6M !== undefined && s.actual6M !== '' && s.actual6M !== '-' && Number(s.actual6M) > 0) ||
        (s.actual9M !== undefined && s.actual9M !== '' && s.actual9M !== '-' && Number(s.actual9M) > 0) ||
        (s.resultsByRound &&
          Object.values(s.resultsByRound).some(
            (v) => v !== undefined && v !== '' && v !== '-' && Number(v) > 0
          ))
    );
    if (hasSubVal) return true;
  }
  return false;
};

// ==========================================
// 5. Database & LocalStorage KPI Persistence
// ==========================================
export const fetchKPIsFromBackend = async (): Promise<KPIItem[]> => {
  if (typeof window === 'undefined') return getStoredKPIs();
  try {
    // ดึงข้อมูลยุทธศาสตร์ แผนงาน และตัวเลือก Dropdown จากฐานข้อมูลควบคู่กันเสมอ
    await Promise.allSettled([
      fetchHierarchyFromBackend(),
      fetchLookupOptionsFromBackend(),
    ]);

    const res = await fetch('/api/v1/kpi', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        const localKpis = getStoredKPIs();
        const localMap = new Map(localKpis.map((k) => [k.id, k]));
        const enriched = json.data.map((item: KPIItem) => {
          const localItem = localMap.get(item.id);
          const merged: KPIItem = {
            ...item,
            manualIncludedProjectIds:
              item.manualIncludedProjectIds && item.manualIncludedProjectIds.length > 0
                ? item.manualIncludedProjectIds
                : localItem?.manualIncludedProjectIds || [],
            manualExcludedProjectIds:
              item.manualExcludedProjectIds && item.manualExcludedProjectIds.length > 0
                ? item.manualExcludedProjectIds
                : localItem?.manualExcludedProjectIds || [],
          };
          return enrichKPIItem(merged);
        });
        try {
          localStorage.setItem(KPI_DB_SYNCED_KEY, 'true');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
          window.dispatchEvent(new CustomEvent('kpi_updated', { detail: enriched }));
        } catch (_) {}
        return enriched;
      }
    }
  } catch (err) {
    console.warn('[kpiEngine] fetchKPIsFromBackend failed, fallback to cache:', err);
  }
  return getStoredKPIs();
};

export const fetchReportingRoundsFromBackend = async (): Promise<KPIReportingRoundConfig[]> => {
  if (typeof window === 'undefined') return getStoredReportingRounds();
  try {
    const res = await fetch('/api/v1/kpi/rounds', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        saveStoredReportingRounds(json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[kpiEngine] fetchReportingRoundsFromBackend failed:', err);
  }
  return getStoredReportingRounds();
};

export const syncRoundReportToBackend = async (
  indicatorId: string,
  payload: any
): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    await fetch(`/api/v1/kpi/${indicatorId}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Failed to sync round report to backend:', err);
  }
};

export const getStoredKPIs = (): KPIItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const isDbSynced = localStorage.getItem(KPI_DB_SYNCED_KEY) === 'true';
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (isDbSynced || parsed.length > 0) {
          return parsed.map(enrichKPIItem);
        }
      }
    }
  } catch (err) {
    console.warn('Failed to load KPIs from localStorage:', err);
  }
  return [];
};

export const getKPIById = (id: string): KPIItem | null => {
  const list = getStoredKPIs();
  const decoded = decodeURIComponent(id).trim();
  return list.find((k) => k.id === decoded || k.code === decoded) || null;
};

export const saveStoredKPIs = (kpis: KPIItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kpis));
    window.dispatchEvent(new CustomEvent('kpi_updated', { detail: kpis }));
  } catch (err) {
    console.error('Failed to save KPIs to localStorage:', err);
  }
};

export const resetKPIsToDefault = (): KPIItem[] => {
  const enriched = DEFAULT_KPIS.map(enrichKPIItem);
  saveStoredKPIs(enriched);
  return enriched;
};

export const addKPI = (kpi: Omit<KPIItem, 'id'>): KPIItem => {
  const current = getStoredKPIs();
  const newId = `kpi-${Date.now()}`;
  const newItem: KPIItem = enrichKPIItem({
    ...kpi,
    id: newId,
    manualIncludedProjectIds: kpi.manualIncludedProjectIds || [],
    manualExcludedProjectIds: kpi.manualExcludedProjectIds || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const updated = [...current, newItem];
  saveStoredKPIs(updated);
  if (typeof window !== 'undefined') {
    fetch('/api/v1/kpi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newItem),
    }).catch((err) => console.warn('Failed to sync new KPI to backend:', err));
  }
  return newItem;
};

export const updateKPI = (kpi: KPIItem): KPIItem => {
  const current = getStoredKPIs();
  const enriched = enrichKPIItem({ ...kpi, updatedAt: new Date().toISOString() });
  const updated = current.map((item) => (item.id === kpi.id ? enriched : item));
  saveStoredKPIs(updated);
  if (typeof window !== 'undefined') {
    fetch(`/api/v1/kpi/${kpi.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(enriched),
    }).catch((err) => console.warn('Failed to sync KPI update to backend:', err));
  }
  return enriched;
};

export const deleteKPI = (id: string): void => {
  const current = getStoredKPIs();
  const targetId = String(id).trim();
  const updated = current.filter((item) => String(item.id).trim() !== targetId);
  saveStoredKPIs(updated);
  if (typeof window !== 'undefined') {
    fetch(`/api/v1/kpi/${targetId}`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch((err) => console.warn('Failed to delete KPI from backend:', err));
  }
};

// ==========================================
// 6. Project Mapping Operations (Manual Override)
// ==========================================
export const getProjectKey = (item: any, fallbackIdx?: number): string => {
  if (!item) return fallbackIdx !== undefined ? `idx-${fallbackIdx}` : '';
  const rawId = item.id ?? item._id ?? item.code;
  if (rawId !== undefined && rawId !== null && String(rawId).trim() !== '') {
    return String(rawId).trim();
  }
  const title = String(item.name || item.title || '').trim();
  if (title) return `title:${title}`;
  return fallbackIdx !== undefined ? `idx-${fallbackIdx}` : '';
};

export const includeProjectInKPI = (kpiId: string, projectId: string): KPIItem | null => {
  const current = getStoredKPIs();
  const target = current.find((k) => k.id === kpiId);
  if (!target) return null;

  const included = new Set(target.manualIncludedProjectIds || []);
  const excluded = new Set(target.manualExcludedProjectIds || []);

  included.add(String(projectId));
  excluded.delete(String(projectId));

  const updatedTarget: KPIItem = {
    ...target,
    manualIncludedProjectIds: Array.from(included),
    manualExcludedProjectIds: Array.from(excluded),
    updatedAt: new Date().toISOString(),
  };

  updateKPI(updatedTarget);
  return updatedTarget;
};

export const excludeProjectFromKPI = (kpiId: string, projectId: string): KPIItem | null => {
  const current = getStoredKPIs();
  const target = current.find((k) => k.id === kpiId);
  if (!target) return null;

  const included = new Set(target.manualIncludedProjectIds || []);
  const excluded = new Set(target.manualExcludedProjectIds || []);

  included.delete(String(projectId));
  excluded.add(String(projectId));

  const updatedTarget: KPIItem = {
    ...target,
    manualIncludedProjectIds: Array.from(included),
    manualExcludedProjectIds: Array.from(excluded),
    updatedAt: new Date().toISOString(),
  };

  updateKPI(updatedTarget);
  return updatedTarget;
};

// ==========================================
// 7. Dynamic KPI Evaluation Engine with Mapping & Dynamic Reporting Rounds
// ==========================================
export const evaluateKPI = (
  kpi: KPIItem,
  datasets: Record<string, any[]>,
  round: KPIReportingRound = '9M'
): KPIComputedResult => {
  const activeDatasetKeys =
    Array.isArray(kpi.datasetKeys) && kpi.datasetKeys.length > 0
      ? kpi.datasetKeys
      : [kpi.datasetKey || 'research'];
  const rawData = activeDatasetKeys.flatMap((key) => datasets[key] || []);
  const data = rawData.filter(
    (item) =>
      item &&
      (item.name || item.title) &&
      item.name !== 'nan' &&
      item.name !== 'NaT' &&
      item.name !== 'เรื่อง' &&
      !isTestRecord(item)
  );

  const manualIncluded = new Set((kpi.manualIncludedProjectIds || []).map(String));
  const manualExcluded = new Set((kpi.manualExcludedProjectIds || []).map(String));

  // 1. คัดกรองอัตโนมัติ (Auto-detect)
  let autoMatched: any[] = [];

  switch (kpi.calcType) {
    case 'auto_sum':
    case 'auto_count': {
      autoMatched = [...data];
      break;
    }

    case 'auto_filtered_count': {
      if (!kpi.filterConfig) {
        autoMatched = [...data];
        break;
      }
      const { field, operator, value } = kpi.filterConfig;
      autoMatched = data.filter((item) => {
        const itemVal = item[field];
        if (operator === 'gte') {
          return parseNumber(itemVal) >= parseNumber(value);
        }
        if (operator === 'lte') {
          return parseNumber(itemVal) <= parseNumber(value);
        }
        if (operator === 'equals') {
          return String(itemVal).trim().toLowerCase() === String(value).trim().toLowerCase();
        }
        if (operator === 'contains') {
          return String(itemVal).toLowerCase().includes(String(value).toLowerCase());
        }
        if (operator === 'not_empty') {
          return itemVal && itemVal !== 'nan' && itemVal !== '-';
        }
        return false;
      });
      break;
    }

    case 'auto_completeness': {
      autoMatched = [...data];
      break;
    }

    case 'manual':
    default: {
      autoMatched = [];
      break;
    }
  }

  // 2. ปรับแต่งด้วยมือ (รองรับการผูกโครงการด้วยมือข้ามทุกหมวดข้อมูลในระบบ)
  const autoMatchedMap = new Map<string, any>();
  autoMatched.forEach((item, index) => {
    const key = getProjectKey(item, index);
    if (!manualExcluded.has(key)) {
      autoMatchedMap.set(key, item);
    }
  });

  // ค้นหาโครงการที่ผูกด้วยมือ (manualIncluded) จากทุกหมวดข้อมูล (วิจัย, พัฒนาวิชาการ, บริการวิชาการ, ตีพิมพ์, IP)
  Object.values(datasets).forEach((datasetList) => {
    if (!Array.isArray(datasetList)) return;
    datasetList.forEach((item, index) => {
      if (
        !item ||
        (!item.name && !item.title) ||
        item.name === 'nan' ||
        item.name === 'NaT' ||
        item.name === 'เรื่อง' ||
        isTestRecord(item)
      ) {
        return;
      }
      const key = getProjectKey(item, index);
      if (manualIncluded.has(key) && !manualExcluded.has(key)) {
        autoMatchedMap.set(key, item);
      }
    });
  });

  const finalMatchedProjects = Array.from(autoMatchedMap.values());

  // 3. คำนวณค่าผลงานจริงรายรอบ (Dynamic Reporting Rounds)
  let currentValue = 0;
  const details: KPIComputedResult['details'] = {
    matchCount: finalMatchedProjects.length,
    sampleMatches: finalMatchedProjects.slice(0, 5),
  };

  const value6M = kpi.actual6M !== undefined && kpi.actual6M !== null ? Number(kpi.actual6M) : null;
  const value9M =
    kpi.actual9M !== undefined && kpi.actual9M !== null
      ? Number(kpi.actual9M)
      : kpi.manualProgress !== undefined
      ? Number(kpi.manualProgress)
      : null;

  const valuesByRound: Record<string, number | null> = {
    'round-6m': value6M,
    '6M': value6M,
    'round-9m': value9M,
    '9M': value9M,
  };
  const textsByRound: Record<string, string> = {};
  if (kpi.actual6MText) {
    textsByRound['round-6m'] = kpi.actual6MText;
    textsByRound['6M'] = kpi.actual6MText;
  }
  if (kpi.actual9MText) {
    textsByRound['round-9m'] = kpi.actual9MText;
    textsByRound['9M'] = kpi.actual9MText;
  }

  if (Array.isArray(kpi.resultsByRound)) {
    kpi.resultsByRound.forEach((entry) => {
      if (entry.actualValue !== undefined && entry.actualValue !== null) {
        valuesByRound[entry.roundId] = Number(entry.actualValue);
      }
      if (entry.actualText) {
        textsByRound[entry.roundId] = entry.actualText;
      }
    });
  }

  if (kpi.calcType === 'auto_sum') {
    const field = kpi.sumField || 'budget';
    currentValue = finalMatchedProjects.reduce((acc, cur) => acc + parseNumber(cur[field]), 0);
    const contributing = finalMatchedProjects.filter((cur) => parseNumber(cur[field]) > 0);
    details.matchCount = contributing.length > 0 ? contributing.length : finalMatchedProjects.length;
    details.sampleMatches =
      contributing.length > 0 ? contributing.slice(0, 5) : finalMatchedProjects.slice(0, 5);
  } else if (kpi.calcType === 'auto_completeness') {
    const expected = kpi.completenessExpected || ENGINEERING_DEPARTMENTS;
    const field = kpi.completenessField || 'department';
    const presentDepts = new Set<string>();

    finalMatchedProjects.forEach((item) => {
      const deptStr = String(item[field] || '');
      expected.forEach((exp) => {
        const cleanExp = exp.replace(/วิศวกรรม/g, '').trim();
        if (deptStr.includes(exp) || (cleanExp && deptStr.includes(cleanExp))) {
          presentDepts.add(exp);
        }
      });
    });

    currentValue = presentDepts.size;
    details.completedDepartments = Array.from(presentDepts);
    details.missingDepartments = expected.filter((d) => !presentDepts.has(d));
    details.matchCount = finalMatchedProjects.length;
    details.sampleMatches = finalMatchedProjects.slice(0, 5);
  } else if (kpi.calcType === 'manual') {
    const roundSpecificVal = valuesByRound[round];
    if (roundSpecificVal !== undefined && roundSpecificVal !== null) {
      currentValue = roundSpecificVal;
    } else if ((round === '6M' || round === 'round-6m') && value6M !== null) {
      currentValue = value6M;
    } else if ((round === '9M' || round === 'round-9m') && value9M !== null) {
      currentValue = value9M;
    } else {
      currentValue = kpi.manualProgress ?? value9M ?? value6M ?? 0;
    }
    details.sampleMatches = finalMatchedProjects.slice(0, 5);
  } else {
    currentValue = finalMatchedProjects.length;
  }

  const target = kpi.targetValue > 0 ? kpi.targetValue : 1;
  const effectiveRatioValue =
    kpi.id === 'kpi-2569-2-3-3' && kpi.manualProgress !== undefined
      ? kpi.manualProgress
      : currentValue;
  const percentage = Math.round((effectiveRatioValue / target) * 100);
  const variance = currentValue - target;

  let status: KPIComputedResult['status'] = 'behind';
  let statusLabel = 'ต้องเร่งรัด';
  let statusColor = '#dc2626';

  if (percentage >= 100) {
    status = 'achieved';
    statusLabel = 'บรรลุเป้าหมาย';
    statusColor = '#059669';
  } else if (percentage >= 50) {
    status = 'in_progress';
    statusLabel = 'กำลังดำเนินการ (50–99%)';
    statusColor = '#ca8a04';
  } else {
    status = 'behind';
    statusLabel = 'ต้องเร่งรัด';
    statusColor = '#dc2626';
  }

  return {
    kpi,
    currentValue,
    value6M: valuesByRound['round-6m'] ?? value6M,
    value9M: valuesByRound['round-9m'] ?? value9M,
    valuesByRound,
    textsByRound,
    targetValue: kpi.targetValue,
    percentage,
    status,
    statusLabel,
    statusColor,
    variance,
    matchedProjects: finalMatchedProjects,
    autoMatchedCount: autoMatched.length,
    details,
  };
};

export const evaluateAllKPIs = (
  kpis: KPIItem[],
  datasets: Record<string, any[]>,
  round: KPIReportingRound = '9M'
): KPIComputedResult[] => {
  return kpis.map((k) => evaluateKPI(k, datasets, round));
};
