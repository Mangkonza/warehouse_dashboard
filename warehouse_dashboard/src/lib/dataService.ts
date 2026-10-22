'use client';

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

export function setCachedCategoryData(category: string, data: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${LS_PREFIX}${category}`, JSON.stringify(data));
    window.dispatchEvent(
      new CustomEvent('ku_data_updated', {
        detail: { category, count: data.length },
      })
    );
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
        setCachedCategoryData(category, result.data);
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
): Promise<{ success: boolean; data: any }> {
  const method = isNew ? 'POST' : 'PUT';

  // 1. Optimistically update local cache first
  const currentList = getCachedCategoryData(category) || [];
  let updatedList = [...currentList];

  const recordId = record._id || record.id || `${category}_${Date.now()}`;
  const recordToSave = {
    ...record,
    _id: recordId,
    updatedAt: new Date().toISOString(),
  };

  if (isNew) {
    updatedList.unshift(recordToSave);
  } else {
    let found = false;
    updatedList = updatedList.map((item) => {
      if (item._id === recordId || item.id === recordId) {
        found = true;
        return recordToSave;
      }
      return item;
    });
    if (!found) {
      updatedList.unshift(recordToSave);
    }
  }

  setCachedCategoryData(category, updatedList);

  // 2. Send API request to Next.js route
  try {
    const res = await fetch(`/api/data/${category}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordToSave),
    });
    if (res.ok) {
      const result = await res.json();
      return { success: true, data: result.data || recordToSave };
    }
  } catch (err) {
    console.error(`[dataService] Error saving record to API for ${category}:`, err);
  }

  return { success: true, data: recordToSave };
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
  setCachedCategoryData(category, filtered);

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
  setCachedCategoryData(category, combined);

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
        setCachedCategoryData(category, result.data);
        return result.data;
      }
    }
  } catch (err) {
    console.error(`[dataService] Error in batch import API for ${category}:`, err);
  }

  return combined;
}
