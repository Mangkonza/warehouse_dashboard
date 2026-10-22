import fs from 'fs';
import path from 'path';

const FILE_MAP: Record<string, string> = {
  research: 'research.json',
  monitoring: 'research.json',
  academic: 'academic.json',
  publications: 'publications.json',
  service: 'services.json',
  services: 'services.json',
  ip: 'ip.json',
  personnel: 'personnel.json',
};

function getDataFilePath(category: string, persistedOnly = false): string {
  const baseName = FILE_MAP[category.toLowerCase()] || `${category.toLowerCase()}.json`;
  const dataDir = path.join(process.cwd(), 'src', 'data');
  if (persistedOnly) {
    return path.join(dataDir, `persisted_${baseName}`);
  }
  const persistedPath = path.join(dataDir, `persisted_${baseName}`);
  if (fs.existsSync(persistedPath)) {
    return persistedPath;
  }
  return path.join(dataDir, baseName);
}

export function readCategoryData(category: string): any[] {
  try {
    const filePath = getDataFilePath(category);
    if (!fs.existsSync(filePath)) {
      console.warn(`[serverDataStore] File not found: ${filePath}`);
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((i: any) => i && i.name && i.name !== 'nan' && i.name !== 'NaT' && i.name !== 'เรื่อง')
      .map((item: any, idx: number) => {
        const cleaned: any = { ...item };
        Object.keys(cleaned).forEach((k) => {
          if (cleaned[k] === 'nan' || cleaned[k] === 'NaT') {
            cleaned[k] = '';
          }
        });
        if (!cleaned._id) {
          cleaned._id = cleaned.id && cleaned.id !== '' ? `${category}_${cleaned.id}` : `${category}_idx_${idx}`;
        }
        return cleaned;
      });
  } catch (error) {
    console.error(`[serverDataStore] Error reading category "${category}":`, error);
    return [];
  }
}

export function writeCategoryData(category: string, items: any[]): boolean {
  try {
    const baseName = FILE_MAP[category.toLowerCase()] || `${category.toLowerCase()}.json`;
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const persistedPath = path.join(dataDir, `persisted_${baseName}`);
    const originalPath = path.join(dataDir, baseName);
    const content = JSON.stringify(items, null, 2);

    fs.writeFileSync(persistedPath, content, 'utf-8');
    fs.writeFileSync(originalPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error(`[serverDataStore] Error writing category "${category}":`, error);
    return false;
  }
}

export function addItemToCategory(category: string, newItem: any): any {
  const items = readCategoryData(category);
  const id = newItem._id || `${category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const recordWithId = {
    ...newItem,
    _id: id,
    updatedAt: new Date().toISOString(),
  };

  items.unshift(recordWithId);
  writeCategoryData(category, items);
  return recordWithId;
}

export function updateItemInCategory(category: string, updatedItem: any): any {
  const items = readCategoryData(category);
  const targetId = updatedItem._id || updatedItem.id;
  if (!targetId) return null;

  let found = false;
  const updatedItems = items.map((item) => {
    if (item._id === targetId || item.id === targetId || (item._id && item._id.endsWith(`_${targetId}`))) {
      found = true;
      return {
        ...item,
        ...updatedItem,
        _id: item._id || targetId,
        updatedAt: new Date().toISOString(),
      };
    }
    return item;
  });

  if (!found) {
    // If not found, add as new
    updatedItems.unshift({
      ...updatedItem,
      _id: targetId,
      updatedAt: new Date().toISOString(),
    });
  }

  writeCategoryData(category, updatedItems);
  return updatedItem;
}

export function deleteItemFromCategory(category: string, targetId: string): boolean {
  const items = readCategoryData(category);
  const initialLen = items.length;
  const filtered = items.filter(
    (item) => item._id !== targetId && item.id !== targetId && item._id !== `${category}_${targetId}`
  );

  if (filtered.length !== initialLen) {
    writeCategoryData(category, filtered);
    return true;
  }
  return false;
}

export function batchSaveCategory(
  category: string,
  importedItems: any[],
  mode: 'append' | 'overwrite'
): any[] {
  const existing = mode === 'append' ? readCategoryData(category) : [];
  const stamped = importedItems.map((item, idx) => ({
    ...item,
    _id: item._id || `${category}_import_${Date.now()}_${idx}`,
    updatedAt: new Date().toISOString(),
  }));
  const combined = mode === 'append' ? [...stamped, ...existing] : stamped;
  writeCategoryData(category, combined);
  return combined;
}
