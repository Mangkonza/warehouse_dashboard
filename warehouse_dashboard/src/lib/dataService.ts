'use client';
import { EvaluationRecord } from '../types/evaluation';

import { CategoryKey } from '../types/dataManagement';

// Local storage prefix
const LS_PREFIX = 'ku_dw_cache_';

export function getCachedCategoryData(category: string): any[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${category}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`[dataService] Error reading localStorage for ${category}`, e);
  }
  return null;
}

export function setCachedCategoryData(category: string, data: any[], broadcast = false): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(data);
    const existing = localStorage.getItem(`${LS_PREFIX}${category}`);
    if (existing !== serialized) {
      localStorage.setItem(`${LS_PREFIX}${category}`, serialized);
    }
    if (broadcast) {
      window.dispatchEvent(
        new CustomEvent('ku_data_updated', {
          detail: { category, count: data.length },
        })
      );
    }
  } catch (e) {
    console.warn(`[dataService] Error writing localStorage for ${category}`, e);
  }
}

export async function fetchCategoryData(category: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/data/${category}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const result = await res.json();
      if (result && Array.isArray(result.data)) {
        setCachedCategoryData(category, result.data, false);
        return result.data;
      }
    }
  } catch (err) {
    console.warn(`[dataService] API fetch failed for ${category}, falling back to cache`, err);
  }

  // Fallback to cached data
  const cached = getCachedCategoryData(category);
  if (cached) return cached;

  return [];
}

export async function saveCategoryRecord(
  category: string,
  record: Record<string, any>,
  isNew: boolean
): Promise<{ success: boolean; data?: any; error?: string }> {
  const method = isNew ? 'POST' : 'PUT';

  const recordId = record._id || record.id || `${category}_${Date.now()}`;
  const recordToSave = {
    ...record,
    _id: recordId,
    updatedAt: new Date().toISOString(),
  };

  // 1. Send API request to Next.js route
  try {
    const res = await fetch(`/api/data/${category}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordToSave),
    });

    const result = await res.json().catch(() => ({}));

    if (res.ok) {
      // 2. Update local cache only on success
      const currentList = getCachedCategoryData(category) || [];
      let updatedList = [...currentList];

      if (isNew) {
        updatedList.unshift(result.data || recordToSave);
      } else {
        let found = false;
        updatedList = updatedList.map((item) => {
          if (item._id === recordId || item.id === recordId) {
            found = true;
            return result.data || recordToSave;
          }
          return item;
        });
        if (!found) {
          updatedList.unshift(result.data || recordToSave);
        }
      }

      setCachedCategoryData(category, updatedList, true);
      return { success: true, data: result.data || recordToSave };
    } else {
      return {
        success: false,
        error: result.message || 'บันทึกข้อมูลไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง',
      };
    }
  } catch (err: any) {
    console.error(`[dataService] Error saving record to API for ${category}:`, err);
    return {
      success: false,
      error: err?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
    };
  }
}

export async function deleteCategoryRecord(
  category: string,
  recordId: string
): Promise<boolean> {
  // 1. Optimistic update local cache
  const currentList = getCachedCategoryData(category) || [];
  const filtered = currentList.filter(
    (item) => item._id !== recordId && item.id !== recordId
  );
  setCachedCategoryData(category, filtered, true);

  // 2. Call API
  try {
    const res = await fetch(`/api/data/${category}?id=${encodeURIComponent(recordId)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.error(`[dataService] Error deleting record ${recordId} from API:`, err);
    return false;
  }
}

export async function batchImportCategoryRecords(
  category: string,
  items: any[],
  mode: 'append' | 'overwrite'
): Promise<any[]> {
  // 1. Optimistic update local cache
  const currentList = mode === 'append' ? (getCachedCategoryData(category) || []) : [];
  const stampedItems = items.map((i, idx) => ({
    ...i,
    _id: i._id || `${category}_import_${Date.now()}_${idx}`,
    updatedAt: new Date().toISOString(),
  }));
  const combined = mode === 'append' ? [...stampedItems, ...currentList] : stampedItems;
  setCachedCategoryData(category, combined, true);

  // 2. Call API
  try {
    const res = await fetch(`/api/data/${category}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, items: stampedItems }),
    });
    if (res.ok) {
      const result = await res.json();
      if (Array.isArray(result.data)) {
        setCachedCategoryData(category, result.data, true);
        return result.data;
      }
    }
  } catch (err) {
    console.error(`[dataService] Error in batch import API for ${category}:`, err);
  }

  return combined;
}

// ==========================================
// Evaluation Data Service Methods (การประเมิน)
// ==========================================
const EVAL_LS_KEY = 'ku_dw_evaluations_cache';

export function getCachedEvaluations(): Record<string, EvaluationRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(EVAL_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[dataService] Error reading evaluation cache', e);
  }
  return {};
}

export function setCachedEvaluations(data: Record<string, EvaluationRecord>, broadcast = false): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(data);
    const existing = localStorage.getItem(EVAL_LS_KEY);
    if (existing !== serialized) {
      localStorage.setItem(EVAL_LS_KEY, serialized);
    }
    if (broadcast) {
      window.dispatchEvent(
        new CustomEvent('ku_evaluations_updated', {
          detail: { count: Object.keys(data).length },
        })
      );
    }
  } catch (e) {
    console.warn('[dataService] Error writing evaluation cache', e);
  }
}

export async function fetchEvaluations(category?: string): Promise<Record<string, EvaluationRecord>> {
  try {
    const url = category ? `/api/evaluation?category=${encodeURIComponent(category)}` : '/api/evaluation';
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const result = await res.json();
      if (result && Array.isArray(result.data)) {
        const cached = getCachedEvaluations();
        const map = { ...cached };
        result.data.forEach((it: EvaluationRecord) => {
          if (it && it.category && it.record_id) {
            const key = `${it.category.toLowerCase()}_${String(it.record_id).trim()}`;
            map[key] = it;
          }
        });
        setCachedEvaluations(map, false);
        return map;
      }
    }
  } catch (err) {
    console.warn('[dataService] Failed to fetch evaluations from API, using cache:', err);
  }

  return getCachedEvaluations();
}

export async function saveEvaluationRecord(
  evalData: Partial<EvaluationRecord>
): Promise<{ success: boolean; data?: EvaluationRecord; error?: string }> {
  try {
    const res = await fetch('/api/evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evalData),
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok && result.data) {
      const cached = getCachedEvaluations();
      const key = `${result.data.category.toLowerCase()}_${String(result.data.record_id).trim()}`;
      const updated = { ...cached, [key]: result.data };
      setCachedEvaluations(updated, true);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || 'บันทึกการประเมินไม่สำเร็จ' };
  } catch (err: any) {
    console.error('[dataService] Error saving evaluation record:', err);
    return { success: false, error: err?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
  }
}

export async function bulkSaveEvaluationRecords(
  items: Partial<EvaluationRecord>[]
): Promise<{ success: boolean; data?: EvaluationRecord[]; error?: string }> {
  try {
    const res = await fetch('/api/evaluation/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(result.data)) {
      const cached = getCachedEvaluations();
      const updated = { ...cached };
      result.data.forEach((it: EvaluationRecord) => {
        const key = `${it.category.toLowerCase()}_${String(it.record_id).trim()}`;
        updated[key] = it;
      });
      setCachedEvaluations(updated, true);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.message || 'ประเมินรายการที่เลือกไม่สำเร็จ' };
  } catch (err: any) {
    console.error('[dataService] Error in bulkSaveEvaluationRecords:', err);
    return { success: false, error: err?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' };
  }
}
