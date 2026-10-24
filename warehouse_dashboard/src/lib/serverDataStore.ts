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
  let dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    const altDir = path.join(process.cwd(), 'warehouse_dashboard', 'src', 'data');
    if (fs.existsSync(altDir)) {
      dataDir = altDir;
    }
  }
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
    let dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      const altDir = path.join(process.cwd(), 'warehouse_dashboard', 'src', 'data');
      if (fs.existsSync(altDir)) {
        dataDir = altDir;
      } else {
        fs.mkdirSync(dataDir, { recursive: true });
      }
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

function normalizeKey(str: any): string {
  return String(str || '').replace(/\r?\n/g, ' ').trim().toLowerCase();
}

function syncFundingSource(fundName?: string, fundType?: string) {
  if (!fundName) return;
  const cleanName = String(fundName).replace(/\r?\n/g, ' ').trim();
  if (!cleanName) return;

  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDir, 'funding_sources.json');
    let sources: any[] = [];
    if (fs.existsSync(filePath)) {
      sources = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const exists = sources.some((s) => s.name.toLowerCase() === cleanName.toLowerCase());
    if (!exists) {
      sources.push({
        id: `fund_${Date.now()}`,
        name: cleanName,
        type: fundType || 'ภายนอก',
      });
      fs.writeFileSync(filePath, JSON.stringify(sources, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[serverDataStore] Error syncing funding source:', err);
  }
}

export function addItemToCategory(category: string, newItem: any): any {
  const items = readCategoryData(category);

  // Auto-increment integer id for personnel
  if (category.toLowerCase() === 'personnel') {
    const maxId = items.reduce((max, it) => {
      const num = Number(it.id);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = newItem.id && !isNaN(Number(newItem.id)) ? Number(newItem.id) : (maxId + 1);
    newItem.id = nextId;
    newItem._id = String(nextId);
  }

  // Normalize project code if research
  if (category.toLowerCase() === 'research' && newItem.id) {
    newItem.id = String(newItem.id).replace(/\r?\n/g, ' ').trim();
    if (newItem.fund_source) {
      syncFundingSource(newItem.fund_source, newItem.fund_type);
    }
  }

  // Normalize IP fields
  if (category.toLowerCase() === 'ip') {
    const title = newItem.title || newItem.name || '';
    newItem.title = title;
    newItem.name = title;
    if (Array.isArray(newItem.inventors) && newItem.inventors.length > 0) {
      newItem.creator = newItem.inventors.map((i: any) => i.name).filter(Boolean).join(', ');
      const depts = Array.from(new Set(newItem.inventors.map((i: any) => i.department).filter(Boolean)));
      if (!newItem.department || newItem.department === '-') {
        newItem.department = depts.join(', ');
      }
      newItem.departments = depts;
      const firstWithId = newItem.inventors.find((i: any) => i.person_id);
      newItem.person_id = firstWithId ? firstWithId.person_id : null;
    }
    if (newItem.application_number || newItem.registration_number) {
      const app = newItem.application_number || '';
      const reg = newItem.registration_number || '';
      newItem.req_no = app ? (reg ? `${app} / ${reg}` : app) : reg;
    }
    if (!newItem.status) {
      newItem.status = newItem.registration_number || newItem.protection_start ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอแล้ว';
    }
  }

  const id = newItem._id || `${category}_${newItem.id || Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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

  // Normalize project code if research
  if (category.toLowerCase() === 'research' && updatedItem.id) {
    updatedItem.id = String(updatedItem.id).replace(/\r?\n/g, ' ').trim();
    if (updatedItem.fund_source) {
      syncFundingSource(updatedItem.fund_source, updatedItem.fund_type);
    }
  }

  // Normalize IP fields
  if (category.toLowerCase() === 'ip') {
    const title = updatedItem.title || updatedItem.name || '';
    updatedItem.title = title;
    updatedItem.name = title;
    if (Array.isArray(updatedItem.inventors) && updatedItem.inventors.length > 0) {
      updatedItem.creator = updatedItem.inventors.map((i: any) => i.name).filter(Boolean).join(', ');
      const depts = Array.from(new Set(updatedItem.inventors.map((i: any) => i.department).filter(Boolean)));
      if (!updatedItem.department || updatedItem.department === '-') {
        updatedItem.department = depts.join(', ');
      }
      updatedItem.departments = depts;
      const firstWithId = updatedItem.inventors.find((i: any) => i.person_id);
      updatedItem.person_id = firstWithId ? firstWithId.person_id : null;
    }
    if (updatedItem.application_number || updatedItem.registration_number) {
      const app = updatedItem.application_number || '';
      const reg = updatedItem.registration_number || '';
      updatedItem.req_no = app ? (reg ? `${app} / ${reg}` : app) : reg;
    }
    if (!updatedItem.status) {
      updatedItem.status = updatedItem.registration_number || updatedItem.protection_start ? 'ได้รับความคุ้มครองแล้ว' : 'ยื่นคำขอแล้ว';
    }
  }

  const targetId = updatedItem._id || updatedItem.id;
  if (!targetId) return null;

  const normTarget = normalizeKey(targetId);
  let found = false;
  const updatedItems = items.map((item) => {
    const isMatch =
      item._id === targetId ||
      item.id === targetId ||
      (item._id && item._id.endsWith(`_${targetId}`)) ||
      normalizeKey(item.id) === normTarget ||
      normalizeKey(item._id) === normTarget;

    if (isMatch) {
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

  // Propagate name/department changes if personnel was updated
  if (category.toLowerCase() === 'personnel') {
    const personNumId = Number(updatedItem.id);
    if (!isNaN(personNumId)) {
      try {
        const resItems = readCategoryData('research');
        let resChanged = false;
        const updatedRes = resItems.map((r) => {
          if (r.head_id === personNumId) {
            resChanged = true;
            return { ...r, head: updatedItem.name, department: updatedItem.department || r.department };
          }
          return r;
        });
        if (resChanged) writeCategoryData('research', updatedRes);
      } catch (err) {
        console.error('[serverDataStore] Sync research on personnel update failed:', err);
      }

      try {
        const acItems = readCategoryData('academic');
        let acChanged = false;
        const updatedAc = acItems.map((a) => {
          if (a.head_id === personNumId) {
            acChanged = true;
            return { ...a, head: updatedItem.name };
          }
          return a;
        });
        if (acChanged) writeCategoryData('academic', updatedAc);
      } catch (err) {
        console.error('[serverDataStore] Sync academic on personnel update failed:', err);
      }

      try {
        const svItems = readCategoryData('service');
        let svChanged = false;
        const updatedSv = svItems.map((s) => {
          if (s.person_id === personNumId) {
            svChanged = true;
            return { ...s, person: updatedItem.name, department: updatedItem.department || s.department };
          }
          return s;
        });
        if (svChanged) writeCategoryData('service', updatedSv);
      } catch (err) {
        console.error('[serverDataStore] Sync service on personnel update failed:', err);
      }

      try {
        const pubItems = readCategoryData('publications');
        let pubChanged = false;
        const updatedPub = pubItems.map((p) => {
          if (p.owner_id === personNumId || p.person_id === personNumId) {
            pubChanged = true;
            return { ...p, owner: updatedItem.name, department: updatedItem.department || p.department };
          }
          return p;
        });
        if (pubChanged) writeCategoryData('publications', updatedPub);
      } catch (err) {
        console.error('[serverDataStore] Sync publications on personnel update failed:', err);
      }

      try {
        const ipItems = readCategoryData('ip');
        let ipChanged = false;
        const updatedIp = ipItems.map((ip) => {
          if (ip.person_id === personNumId) {
            ipChanged = true;
            return { ...ip, creator: updatedItem.name, department: updatedItem.department || ip.department };
          }
          return ip;
        });
        if (ipChanged) writeCategoryData('ip', updatedIp);
      } catch (err) {
        console.error('[serverDataStore] Sync IP on personnel update failed:', err);
      }
    }
  }

  return updatedItem;
}

export function deleteItemFromCategory(category: string, targetId: string): boolean {
  const items = readCategoryData(category);
  const initialLen = items.length;
  const normTarget = normalizeKey(targetId);

  const filtered = items.filter(
    (item) =>
      item._id !== targetId &&
      item.id !== targetId &&
      item._id !== `${category}_${targetId}` &&
      normalizeKey(item.id) !== normTarget &&
      normalizeKey(item._id) !== normTarget
  );

  if (filtered.length !== initialLen) {
    writeCategoryData(category, filtered);

    // Un-link person reference across child tables if personnel is deleted
    if (category.toLowerCase() === 'personnel') {
      const personNumId = Number(targetId);
      if (!isNaN(personNumId)) {
        ['research', 'academic', 'service', 'publications', 'ip'].forEach((cat) => {
          try {
            const list = readCategoryData(cat);
            let changed = false;
            const unlinked = list.map((item) => {
              let updated = { ...item };
              if (item.person_id === personNumId) {
                changed = true;
                updated.person_id = null;
              }
              if (item.head_id === personNumId) {
                changed = true;
                updated.head_id = null;
              }
              if (item.owner_id === personNumId) {
                changed = true;
                updated.owner_id = null;
              }
              return updated;
            });
            if (changed) {
              writeCategoryData(cat, unlinked);
            }
          } catch (err) {
            console.error(`[serverDataStore] Unlinking failed for ${cat}:`, err);
          }
        });
      }
    }

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
