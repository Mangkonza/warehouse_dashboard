import { KPIItem, KPIComputedResult } from '../types/kpi';
import { DEFAULT_KPIS, ENGINEERING_DEPARTMENTS } from '../config/kpiConfig';
import { isTestRecord } from './sdgEngine';

export { DEFAULT_KPIS, ENGINEERING_DEPARTMENTS };

const STORAGE_KEY = 'ku_warehouse_dynamic_kpis_v3';

export const parseNumber = (val: any): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ==========================================
// LocalStorage KPI Persistence
// ==========================================
export const getStoredKPIs = (): KPIItem[] => {
  if (typeof window === 'undefined') return DEFAULT_KPIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load KPIs from localStorage, using default:', err);
  }
  return DEFAULT_KPIS;
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
  saveStoredKPIs(DEFAULT_KPIS);
  return DEFAULT_KPIS;
};

export const addKPI = (kpi: Omit<KPIItem, 'id'>): KPIItem => {
  const current = getStoredKPIs();
  const newId = `kpi-${Date.now()}`;
  const newItem: KPIItem = {
    ...kpi,
    id: newId,
    manualIncludedProjectIds: kpi.manualIncludedProjectIds || [],
    manualExcludedProjectIds: kpi.manualExcludedProjectIds || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...current, newItem];
  saveStoredKPIs(updated);
  return newItem;
};

export const updateKPI = (kpi: KPIItem): KPIItem => {
  const current = getStoredKPIs();
  const updated = current.map((item) =>
    item.id === kpi.id ? { ...kpi, updatedAt: new Date().toISOString() } : item
  );
  saveStoredKPIs(updated);
  return kpi;
};

export const deleteKPI = (id: string): void => {
  const current = getStoredKPIs();
  const updated = current.filter((item) => item.id !== id);
  saveStoredKPIs(updated);
};

// ==========================================
// Project Mapping Operations (Manual Override)
// ==========================================
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
// Dynamic KPI Evaluation Engine with Mapping
// ==========================================
export const evaluateKPI = (kpi: KPIItem, datasets: Record<string, any[]>): KPIComputedResult => {
  const rawData = datasets[kpi.datasetKey] || [];
  // กรองรายการขยะ เช่น nan, NaT, เรื่อง และรายการทดสอบ (test)
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

  // 2. ปรับแต่งด้วยมือ (นำรายการที่ Excluded ออก และใส่รายการที่ Included เพิ่มเข้าไป)
  const autoMatchedMap = new Map<string, any>();
  autoMatched.forEach((item, index) => {
    const key = String(item.id || item.code || `idx-${index}`);
    if (!manualExcluded.has(key)) {
      autoMatchedMap.set(key, item);
    }
  });

  // นำโครงการที่ผู้ใช้กดเพิ่มด้วยมือเข้ามา
  data.forEach((item, index) => {
    const key = String(item.id || item.code || `idx-${index}`);
    if (manualIncluded.has(key)) {
      autoMatchedMap.set(key, item);
    }
  });

  const finalMatchedProjects = Array.from(autoMatchedMap.values());

  // 3. คำนวณค่าผลงานจริง (currentValue)
  let currentValue = 0;
  const details: KPIComputedResult['details'] = {
    matchCount: finalMatchedProjects.length,
    sampleMatches: finalMatchedProjects.slice(0, 5),
  };

  if (kpi.calcType === 'auto_sum') {
    const field = kpi.sumField || 'budget';
    currentValue = finalMatchedProjects.reduce((acc, cur) => acc + parseNumber(cur[field]), 0);
    const contributing = finalMatchedProjects.filter((cur) => parseNumber(cur[field]) > 0);
    details.matchCount = contributing.length > 0 ? contributing.length : finalMatchedProjects.length;
    details.sampleMatches = contributing.length > 0 ? contributing.slice(0, 5) : finalMatchedProjects.slice(0, 5);
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
    currentValue = kpi.manualProgress ?? 0;
    details.sampleMatches = [];
  } else {
    currentValue = finalMatchedProjects.length;
  }

  const target = kpi.targetValue || 1;
  const percentage = Math.round((currentValue / target) * 100);
  const variance = currentValue - target;

  let status: KPIComputedResult['status'] = 'behind';
  let statusLabel = 'ต้องเร่งรัด';
  let statusColor = '#dc2626';

  if (percentage >= 100) {
    status = 'achieved';
    statusLabel = 'บรรลุเป้าหมาย';
    statusColor = '#059669';
  } else if (percentage >= 70) {
    status = 'on_track';
    statusLabel = 'เป็นไปตามเป้า';
    statusColor = '#0284c7';
  } else if (percentage >= 40) {
    status = 'at_risk';
    statusLabel = 'เฝ้าระวัง';
    statusColor = '#d97706';
  }

  return {
    kpi,
    currentValue,
    targetValue: target,
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
  datasets: Record<string, any[]>
): KPIComputedResult[] => {
  return kpis.map((kpi) => evaluateKPI(kpi, datasets));
};
