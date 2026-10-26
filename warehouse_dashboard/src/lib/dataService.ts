'use client';
import { EvaluationRecord } from '../types/evaluation';
import { CategoryKey } from '../types/dataManagement';

// Base master datasets fallback
import rawResearch from '@/data/research.json';
import rawAcademic from '@/data/academic.json';
import rawPublications from '@/data/publications.json';
import rawServices from '@/data/services.json';
import rawIP from '@/data/ip.json';
import rawPersonnel from '@/data/personnel.json';

export const DEFAULT_CATEGORY_DATA: Record<string, any[]> = {
  research: rawResearch,
  academic: rawAcademic,
  publications: rawPublications,
  service: rawServices,
  services: rawServices,
  ip: rawIP,
  personnel: rawPersonnel,
};

// Local storage prefixes
const LS_PREFIX = 'ku_dw_cache_';
const LS_DELETED_PREFIX = 'ku_dw_deleted_';

const getAuthHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
  };
};

function normalizeKey(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).replace(/\s+/g, ' ').trim().toLowerCase();
}

export function isSameItem(a: any, b: any): boolean {
  if (!a || !b) return false;
  if (a.dbId && b.dbId && String(a.dbId) === String(b.dbId)) return true;

  const aId = normalizeKey(a.id);
  const bId = normalizeKey(b.id);
  if (aId && bId && aId === bId) return true;

  const aUnderId = normalizeKey(a._id);
  const bUnderId = normalizeKey(b._id);
  if (aUnderId && bUnderId && aUnderId === bUnderId) return true;

  if (aUnderId && bId && aUnderId === bId) return true;
  if (aId && bUnderId && aId === bUnderId) return true;

  const aName = normalizeKey(a.name || a.title);
  const bName = normalizeKey(b.name || b.title);
  if (aName && bName && aName === bName) return true;

  return false;
}

export function getDeletedIds(category: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(`${LS_DELETED_PREFIX}${category}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed.map((x) => normalizeKey(x)).filter(Boolean));
      }
    }
  } catch (e) {
    console.warn(`[dataService] Error reading deleted ids for ${category}`, e);
  }
  return new Set();
}

export function saveDeletedId(category: string, id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const set = getDeletedIds(category);
    set.add(normalizeKey(id));
    localStorage.setItem(`${LS_DELETED_PREFIX}${category}`, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn(`[dataService] Error saving deleted id for ${category}`, e);
  }
}

export function getCachedCategoryData(category: string): any[] | null {
  if (typeof window === 'undefined') {
    return DEFAULT_CATEGORY_DATA[category] || null;
  }

  const baseItems = DEFAULT_CATEGORY_DATA[category] || [];
  const deletedIds = getDeletedIds(category);

  let cachedList: any[] | null = null;
  try {
    const raw = localStorage.getItem(`${LS_PREFIX}${category}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedList = parsed;
      }
    }
  } catch (e) {
    console.warn(`[dataService] Error reading localStorage for ${category}`, e);
  }

  const isItemDeleted = (item: any) => {
    const k1 = normalizeKey(item.id);
    const k2 = normalizeKey(item._id);
    const k3 = normalizeKey(item.dbId);
    const k4 = normalizeKey(item.name || item.title);
    return (
      (k1 && deletedIds.has(k1)) ||
      (k2 && deletedIds.has(k2)) ||
      (k3 && deletedIds.has(k3)) ||
      (k4 && deletedIds.has(k4))
    );
  };

  // If no cached list exists, return base items (filtering deleted)
  if (!cachedList || cachedList.length === 0) {
    if (baseItems.length > 0) {
      return baseItems.filter((item) => !isItemDeleted(item));
    }
    return null;
  }

  // If base items exist for this category, reconcile base items with cached items
  // so that updating/cancelling a single project NEVER wipes out the other projects!
  if (baseItems.length > 0) {
    const mergedList: any[] = [];
    const matchedCachedIndices = new Set<number>();

    for (const base of baseItems) {
      if (isItemDeleted(base)) continue;

      let matchedIndex = -1;
      for (let i = 0; i < cachedList.length; i++) {
        if (!matchedCachedIndices.has(i) && isSameItem(base, cachedList[i])) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex !== -1) {
        matchedCachedIndices.add(matchedIndex);
        // User changes take priority over base defaults
        mergedList.push({ ...base, ...cachedList[matchedIndex] });
      } else {
        mergedList.push(base);
      }
    }

    // Include custom newly added items that exist in cachedList but were not in baseItems
    for (let i = 0; i < cachedList.length; i++) {
      if (!matchedCachedIndices.has(i)) {
        const item = cachedList[i];
        if (!isItemDeleted(item)) {
          mergedList.push(item);
        }
      }
    }

    return mergedList;
  }

  return cachedList.filter((item) => !isItemDeleted(item));
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
    const res = await fetch(`/api/v1/data/${category}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const result = await res.json();
      if (result && Array.isArray(result.data) && result.data.length > 0) {
        // Merge server items with any active local edits
        const cached = getCachedCategoryData(category) || [];
        const merged = result.data.map((serverItem: any) => {
          const match = cached.find((c) => isSameItem(c, serverItem));
          return match ? { ...serverItem, ...match } : serverItem;
        });
        setCachedCategoryData(category, merged, false);
        return merged;
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

  const updateLocalCache = (dataToSave: any) => {
    const currentList = getCachedCategoryData(category) || [];
    let updatedList = [...currentList];

    if (isNew) {
      updatedList.unshift(dataToSave);
    } else {
      let found = false;
      updatedList = updatedList.map((item) => {
        if (
          isSameItem(item, dataToSave) ||
          item._id === recordId ||
          item.id === recordId ||
          (record.id && item.id === record.id) ||
          (record.name && item.name === record.name)
        ) {
          found = true;
          return { ...item, ...dataToSave };
        }
        return item;
      });
      if (!found) {
        updatedList.unshift(dataToSave);
      }
    }

    setCachedCategoryData(category, updatedList, true);
  };

  // 1. Send API request to backend route
  try {
    let res = await fetch(`/api/v1/data/${category}`, {
      method,
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(recordToSave),
    });

    // If PUT returned 404, try POST to upsert into backend database
    if (!isNew && res.status === 404) {
      res = await fetch(`/api/v1/data/${category}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(recordToSave),
      });
    }

    const result = await res.json().catch(() => ({}));

    if (res.ok) {
      const finalData = result.data || recordToSave;
      updateLocalCache(finalData);
      return { success: true, data: finalData };
    } else {
      console.warn(`[dataService] API returned non-OK (${res.status}), saving to local cache fallback:`, result);
      updateLocalCache(recordToSave);
      return { success: true, data: recordToSave };
    }
  } catch (err: any) {
    console.warn(`[dataService] Network error saving to API for ${category}, saving to local cache fallback:`, err);
    updateLocalCache(recordToSave);
    return { success: true, data: recordToSave };
  }
}

export async function deleteCategoryRecord(
  category: string,
  recordId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    saveDeletedId(category, recordId);

    const res = await fetch(`/api/v1/data/${category}?id=${encodeURIComponent(recordId)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
    });

    const result = await res.json().catch(() => ({}));

    // Update local cache regardless of network to keep UI responsive
    const currentList = getCachedCategoryData(category) || [];
    const filtered = currentList.filter(
      (item) => item._id !== recordId && item.id !== recordId && String(item.dbId) !== String(recordId) && !isSameItem(item, { id: recordId, _id: recordId })
    );
    setCachedCategoryData(category, filtered, true);

    if (res.ok) {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.message || 'ไม่สามารถลบรายการได้ กรุณาลองใหม่อีกครั้ง',
      };
    }
  } catch (err: any) {
    console.error(`[dataService] Error deleting record ${recordId} from API:`, err);
    return {
      success: false,
      error: err?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
    };
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
    const res = await fetch(`/api/v1/data/${category}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
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
    const url = category ? `/api/v1/evaluation?category=${encodeURIComponent(category)}` : '/api/v1/evaluation';
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const result = await res.json();
      if (result && Array.isArray(result.data)) {
        const cached = getCachedEvaluations();
        const map = { ...cached };
        result.data.forEach((it: EvaluationRecord) => {
          if (it && it.category && (it.record_id || (it as any).recordId)) {
            const rId = it.record_id || (it as any).recordId;
            const key = `${it.category.toLowerCase()}_${String(rId).trim()}`;
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
    const res = await fetch('/api/v1/evaluation', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(evalData),
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok && result.data) {
      const cached = getCachedEvaluations();
      const rId = result.data.record_id || result.data.recordId;
      const key = `${result.data.category.toLowerCase()}_${String(rId).trim()}`;
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
    const res = await fetch('/api/v1/evaluation/bulk', {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ items }),
    });

    const result = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(result.data)) {
      const cached = getCachedEvaluations();
      const updated = { ...cached };
      result.data.forEach((it: EvaluationRecord) => {
        const rId = it.record_id || (it as any).recordId;
        const key = `${it.category.toLowerCase()}_${String(rId).trim()}`;
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
