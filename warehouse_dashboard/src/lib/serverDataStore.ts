import { EvaluationRecord, isEvaluated, parseSdgNumber } from '../types/evaluation';
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
  evaluations: 'evaluations.json',
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

    const evaluations = readEvaluations();
    const catLower = category.toLowerCase();

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

        // Attach evaluation record for this item
        const recId = String(cleaned.id || cleaned._id || cleaned.name || '').trim();
        const evalKey = `${catLower}_${recId}`;
        const evalRecord = evaluations[evalKey] || null;
        if (evalRecord) {
          cleaned.evaluation = evalRecord;
          cleaned.sdg_ids = evalRecord.sdg_ids || [];
          cleaned.i_type = evalRecord.i_type ?? null;
          cleaned.journal_index = evalRecord.journal_index ?? null;
        } else {
          cleaned.evaluation = null;
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

/**
 * ==========================================
 * Evaluation Storage Functions (การประเมิน)
 * ==========================================
 */

const getEvaluationFilePath = (persistedOnly = false): string => {
  let dataDir = path.join(process.cwd(), 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    const altDir = path.join(process.cwd(), 'warehouse_dashboard', 'src', 'data');
    if (fs.existsSync(altDir)) {
      dataDir = altDir;
    }
  }
  if (persistedOnly) {
    return path.join(dataDir, 'persisted_evaluations.json');
  }
  const persistedPath = path.join(dataDir, 'persisted_evaluations.json');
  if (fs.existsSync(persistedPath)) {
    return persistedPath;
  }
  return path.join(dataDir, 'evaluations.json');
};

export function readEvaluations(): Record<string, EvaluationRecord> {
  try {
    const filePath = getEvaluationFilePath();
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const map: Record<string, EvaluationRecord> = {};
      parsed.forEach((item: EvaluationRecord) => {
        if (item && item.category && item.record_id) {
          const key = `${item.category.toLowerCase()}_${String(item.record_id).trim()}`;
          map[key] = item;
        }
      });
      return map;
    }
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error('[serverDataStore] Error reading evaluations:', error);
    return {};
  }
}

export function writeEvaluations(evaluations: Record<string, EvaluationRecord>): boolean {
  try {
    let dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      const altDir = path.join(process.cwd(), 'warehouse_dashboard', 'src', 'data');
      if (fs.existsSync(altDir)) {
        dataDir = altDir;
      } else {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    const persistedPath = path.join(dataDir, 'persisted_evaluations.json');
    const originalPath = path.join(dataDir, 'evaluations.json');
    const content = JSON.stringify(evaluations, null, 2);

    fs.writeFileSync(persistedPath, content, 'utf-8');
    fs.writeFileSync(originalPath, content, 'utf-8');
    return true;
  } catch (error) {
    console.error('[serverDataStore] Error writing evaluations:', error);
    return false;
  }
}

export function getEvaluation(category: string, recordId: string): EvaluationRecord | null {
  const all = readEvaluations();
  const key = `${category.toLowerCase()}_${String(recordId).trim()}`;
  return all[key] || null;
}

export function saveEvaluation(evalData: Partial<EvaluationRecord>): EvaluationRecord {
  const category = String(evalData.category || '').toLowerCase();
  const recordId = String(evalData.record_id || '').trim();
  if (!category || !recordId) {
    throw new Error('Category and record_id are required for evaluation');
  }

  const all = readEvaluations();
  const key = `${category}_${recordId}`;
  const existing = all[key];

  const nowIso = new Date().toISOString();
  const merged: EvaluationRecord = {
    id: key,
    category,
    record_id: recordId,
    sdg_ids: Array.isArray(evalData.sdg_ids)
      ? Array.from(new Set(evalData.sdg_ids.map(Number).filter((n) => n >= 1 && n <= 17))).sort((a, b) => a - b)
      : existing?.sdg_ids || [],
    i_type: evalData.i_type !== undefined ? evalData.i_type : existing?.i_type || null,
    journal_index:
      evalData.journal_index !== undefined ? evalData.journal_index : existing?.journal_index || null,
    evaluated_by: evalData.evaluated_by || existing?.evaluated_by,
    evaluated_at: existing?.evaluated_at,
    updated_at: nowIso,
  };

  // Rule: Set evaluated_at and evaluated_by when the rule first becomes true
  const currentlyEvaluated = isEvaluated(category, merged);
  if (currentlyEvaluated) {
    if (!merged.evaluated_at) {
      merged.evaluated_at = nowIso;
      merged.evaluated_by = merged.evaluated_by || 'admin';
    }
  } else {
    // If not evaluated according to rule, reset evaluated_at
    merged.evaluated_at = undefined;
  }

  all[key] = merged;
  writeEvaluations(all);

  // Sync to category data if applicable
  try {
    const catItems = readCategoryData(category);
    let matched = false;
    for (const it of catItems) {
      const itRecId = String(it.id || it._id || it.name || '').trim();
      if (itRecId === recordId) {
        it.evaluation = merged;
        it.sdg_ids = merged.sdg_ids;
        it.i_type = merged.i_type;
        it.journal_index = merged.journal_index;
        matched = true;
        break;
      }
    }
    if (matched) {
      writeCategoryData(category, catItems);
    }
  } catch (err) {
    console.warn('[serverDataStore] Non-blocking error syncing evaluation to category file:', err);
  }

  return merged;
}

export function bulkSaveEvaluations(items: Partial<EvaluationRecord>[]): EvaluationRecord[] {
  const results: EvaluationRecord[] = [];
  const all = readEvaluations();
  const nowIso = new Date().toISOString();

  for (const evalData of items) {
    const category = String(evalData.category || '').toLowerCase();
    const recordId = String(evalData.record_id || '').trim();
    if (!category || !recordId) continue;

    const key = `${category}_${recordId}`;
    const existing = all[key];

    // For bulk evaluation: SDGs can be merged into existing SDGs if specified
    const existingSdgs = existing?.sdg_ids || [];
    const newSdgs = Array.isArray(evalData.sdg_ids) ? evalData.sdg_ids : [];
    const combinedSdgs = Array.from(new Set([...existingSdgs, ...newSdgs].map(Number).filter((n) => n >= 1 && n <= 17))).sort((a, b) => a - b);

    const merged: EvaluationRecord = {
      id: key,
      category,
      record_id: recordId,
      sdg_ids: combinedSdgs,
      i_type: evalData.i_type !== undefined && evalData.i_type !== null ? evalData.i_type : (existing?.i_type || null),
      journal_index:
        evalData.journal_index !== undefined && evalData.journal_index !== null
          ? evalData.journal_index
          : (existing?.journal_index || null),
      evaluated_by: evalData.evaluated_by || existing?.evaluated_by,
      evaluated_at: existing?.evaluated_at,
      updated_at: nowIso,
    };

    if (isEvaluated(category, merged)) {
      if (!merged.evaluated_at) {
        merged.evaluated_at = nowIso;
        merged.evaluated_by = merged.evaluated_by || 'admin';
      }
    } else {
      merged.evaluated_at = undefined;
    }

    all[key] = merged;
    results.push(merged);
  }

  writeEvaluations(all);
  return results;
}

/**
 * Migration: Scan existing category files for SDGs, Q, TCI and migrate into evaluations.json
 */
export function migrateExistingEvaluations(): { migratedCount: number; details: Record<string, number> } {
  const evaluations = readEvaluations();
  let migratedCount = 0;
  const details: Record<string, number> = {
    research: 0,
    academic: 0,
    publications: 0,
    service: 0,
    ip: 0,
  };

  const categories = ['research', 'academic', 'publications', 'service', 'ip'];

  for (const cat of categories) {
    try {
      const items = readCategoryData(cat);
      let fileModified = false;

      for (const item of items) {
        const recordId = String(item._id || item.id || '').trim();
        if (!recordId) continue;
        const evalKey = `${cat}_${recordId}`;

        // Check for existing evaluation in record
        let hasSdgValue = false;
        let sdgs: number[] = [];

        // 1. Extract SDGs
        const rawSdg = item.sdg_code || item.sdgs || item.sdg || item.sdg_outputs;
        if (rawSdg) {
          if (Array.isArray(rawSdg)) {
            sdgs = rawSdg.map(parseSdgNumber).filter((n): n is number => n !== null);
          } else if (typeof rawSdg === 'string') {
            sdgs = rawSdg.split(',').map(parseSdgNumber).filter((n): n is number => n !== null);
          }
          if (sdgs.length > 0) hasSdgValue = true;
        }

        // 2. Extract Journal Q/TCI
        let journalIndex: { type: 'Q' | 'TCI'; value: string } | null = null;
        const rawTier = item.quartile || item.tier || item.journal_tier;
        if (rawTier && typeof rawTier === 'string') {
          const clean = rawTier.trim();
          if (clean.includes('Q1')) journalIndex = { type: 'Q', value: 'Q1' };
          else if (clean.includes('Q2')) journalIndex = { type: 'Q', value: 'Q2' };
          else if (clean.includes('Q3')) journalIndex = { type: 'Q', value: 'Q3' };
          else if (clean.includes('Q4')) journalIndex = { type: 'Q', value: 'Q4' };
          else if (clean.includes('TCI 1') || clean.includes('TCI1')) journalIndex = { type: 'TCI', value: 'TCI 1' };
          else if (clean.includes('TCI 2') || clean.includes('TCI2')) journalIndex = { type: 'TCI', value: 'TCI 2' };
          else if (clean.includes('TCI 3') || clean.includes('TCI3')) journalIndex = { type: 'TCI', value: 'TCI 3' };
        }

        // 3. Extract I am / I see if stored
        let iType: 'I_AM' | 'I_SEE' | null = null;
        if (item.i_type === 'I_AM' || item.i_type === 'I_SEE') {
          iType = item.i_type;
        } else if (item.i_type === 'I am') iType = 'I_AM';
        else if (item.i_type === 'I see') iType = 'I_SEE';

        if (hasSdgValue || journalIndex || iType) {
          const existingEval = evaluations[evalKey];
          const mergedSdgs = Array.from(new Set([...(existingEval?.sdg_ids || []), ...sdgs])).sort((a, b) => a - b);
          const mergedEval: EvaluationRecord = {
            id: evalKey,
            category: cat,
            record_id: recordId,
            sdg_ids: mergedSdgs,
            i_type: existingEval?.i_type || iType,
            journal_index: existingEval?.journal_index || journalIndex,
            evaluated_by: existingEval?.evaluated_by || 'system_migration',
            evaluated_at: existingEval?.evaluated_at,
            updated_at: new Date().toISOString(),
          };

          if (isEvaluated(cat, mergedEval) && !mergedEval.evaluated_at) {
            mergedEval.evaluated_at = new Date().toISOString();
          }

          evaluations[evalKey] = mergedEval;
          migratedCount++;
          details[cat] = (details[cat] || 0) + 1;
        }

        // Remove legacy fields from item
        if (item.sdg_code !== undefined) { delete item.sdg_code; fileModified = true; }
        if (item.sdgs !== undefined) { delete item.sdgs; fileModified = true; }
        if (item.quartile !== undefined) { delete item.quartile; fileModified = true; }
        if (item.journal_tier !== undefined) { delete item.journal_tier; fileModified = true; }
      }

      if (fileModified) {
        writeCategoryData(cat, items);
      }
    } catch (err) {
      console.error(`[serverDataStore] Migration error for ${cat}:`, err);
    }
  }

  writeEvaluations(evaluations);
  return { migratedCount, details };
}
