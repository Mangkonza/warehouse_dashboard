import { KPIItem, KPIComputedResult, KPICategory } from '../types/kpi';
import { DEFAULT_KPIS, ENGINEERING_DEPARTMENTS } from '../config/kpiConfig';

export { DEFAULT_KPIS, ENGINEERING_DEPARTMENTS };

const STORAGE_KEY = 'ku_warehouse_dynamic_kpis_v2';

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...current, newItem];
  saveStoredKPIs(updated);
  return newItem;
};

export const updateKPI = (kpi: KPIItem): KPIItem => {
  const current = getStoredKPIs();
  const updated = current.map((item) => (item.id === kpi.id ? { ...kpi, updatedAt: new Date().toISOString() } : item));
  saveStoredKPIs(updated);
  return kpi;
};

export const deleteKPI = (id: string): void => {
  const current = getStoredKPIs();
  const updated = current.filter((item) => item.id !== id);
  saveStoredKPIs(updated);
};

// ==========================================
// Dynamic KPI Evaluation Engine
// ==========================================
export const evaluateKPI = (kpi: KPIItem, datasets: Record<string, any[]>): KPIComputedResult => {
  const rawData = datasets[kpi.datasetKey] || [];
  // กรองรายการขยะ เช่น nan, NaT, เรื่อง
  const data = rawData.filter(
    (item) => item && item.name && item.name !== 'nan' && item.name !== 'NaT' && item.name !== 'เรื่อง'
  );

  let currentValue = 0;
  const details: KPIComputedResult['details'] = {};

  switch (kpi.calcType) {
    case 'auto_sum': {
      const field = kpi.sumField || 'budget';
      currentValue = data.reduce((acc, cur) => acc + parseNumber(cur[field]), 0);
      break;
    }

    case 'auto_count': {
      currentValue = data.length;
      break;
    }

    case 'auto_filtered_count': {
      if (!kpi.filterConfig) {
        currentValue = data.length;
        break;
      }
      const { field, operator, value } = kpi.filterConfig;
      const matched = data.filter((item) => {
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
      currentValue = matched.length;
      details.matchCount = matched.length;
      details.sampleMatches = matched.slice(0, 3);
      break;
    }

    case 'auto_completeness': {
      const expected = kpi.completenessExpected || ENGINEERING_DEPARTMENTS;
      const field = kpi.completenessField || 'department';
      const presentDepts = new Set<string>();

      data.forEach((item) => {
        const deptStr = String(item[field] || '');
        expected.forEach((exp) => {
          // เปรียบเทียบแบบยืดหยุ่น เช่น "วิศวกรรมเกษตร" กับ "ภาควิชา\nวิศวกรรมเกษตร"
          const cleanExp = exp.replace(/วิศวกรรม/g, '').trim();
          if (deptStr.includes(exp) || (cleanExp && deptStr.includes(cleanExp))) {
            presentDepts.add(exp);
          }
        });
      });

      const completed = Array.from(presentDepts);
      const missing = expected.filter((d) => !presentDepts.has(d));

      currentValue = completed.length;
      details.completedDepartments = completed;
      details.missingDepartments = missing;
      break;
    }

    case 'manual':
    default: {
      currentValue = kpi.manualProgress ?? 0;
      break;
    }
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
    details,
  };
};

export const evaluateAllKPIs = (
  kpis: KPIItem[],
  datasets: Record<string, any[]>
): KPIComputedResult[] => {
  return kpis.map((kpi) => evaluateKPI(kpi, datasets));
};
