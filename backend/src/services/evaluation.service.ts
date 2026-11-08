import fs from 'fs';
import path from 'path';
import { EvaluationRepository } from '../repositories/evaluation.repository.js';

function parseJournalIndex(raw: any): { type: 'Q' | 'TCI'; value: string } | null {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.value) {
    const val = String(raw.value).trim();
    if (!val || val === '[object Object]') return null;
    const type = raw.type || (val.startsWith('TCI') ? 'TCI' : 'Q');
    return { type, value: val };
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '[object Object]') return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && parsed.value) {
        const type = parsed.type || (parsed.value.startsWith('TCI') ? 'TCI' : 'Q');
        return { type, value: String(parsed.value).trim() };
      }
    } catch {}
    const type = trimmed.startsWith('TCI') ? 'TCI' : 'Q';
    return { type, value: trimmed };
  }
  return null;
}

function extractJournalIndexString(raw: any): string | null {
  if (!raw) return null;
  if (typeof raw === 'object') {
    if (raw.value && String(raw.value).trim() !== '[object Object]') {
      return String(raw.value).trim();
    }
    return null;
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed || trimmed === '[object Object]') return null;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && parsed.value) return String(parsed.value).trim();
    } catch {}
    return trimmed;
  }
  return null;
}

function formatEvaluation(item: any) {
  if (!item) return null;
  return {
    id: `${item.category.toLowerCase()}_${item.recordId}`,
    category: item.category,
    recordId: item.recordId,
    record_id: item.recordId,
    sdg_ids: item.sdgIds || [],
    i_type: item.iType || null,
    journal_index: parseJournalIndex(item.journalIndex),
    evaluated_by: item.evaluatedBy || 'user',
    evaluated_at: item.evaluatedAt,
  };
}


function syncEvaluationsToJson(items: Array<{ category: string; recordId: string; sdgIds?: number[]; iType?: string | null; journalIndex?: any; evaluatedBy?: string }>) {
  try {
    const candidates = [
      path.resolve(process.cwd(), '../frontend/src/data'),
      path.resolve(process.cwd(), 'frontend/src/data'),
      path.resolve(process.cwd(), 'src/data'),
    ];
    for (const dir of candidates) {
      const evalPath = path.join(dir, 'evaluations.json');
      const persistPath = path.join(dir, 'persisted_evaluations.json');
      if (fs.existsSync(evalPath) || fs.existsSync(dir)) {
        let current: any = {};
        if (fs.existsSync(evalPath)) {
          try { current = JSON.parse(fs.readFileSync(evalPath, 'utf8')); } catch {}
        }
        items.forEach((it) => {
          const key = `${it.category.toLowerCase()}_${String(it.recordId).trim()}`;
          current[key] = {
            id: key,
            category: it.category,
            record_id: it.recordId,
            sdg_ids: it.sdgIds || [],
            i_type: it.iType || null,
            journal_index: it.journalIndex ? (typeof it.journalIndex === 'object' ? it.journalIndex : { type: 'Q', value: it.journalIndex }) : null,
            evaluated_by: it.evaluatedBy || 'user',
            evaluated_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        });
        const str = JSON.stringify(current, null, 2);
        fs.writeFileSync(evalPath, str, 'utf8');
        if (fs.existsSync(persistPath)) {
          fs.writeFileSync(persistPath, str, 'utf8');
        }
      }
    }
  } catch (err) {
    console.warn('[EvaluationService] Failed to sync evaluations to JSON:', err);
  }
}

export class EvaluationService {
  static async getEvaluations(category?: string, recordId?: string) {
    if (category && recordId) {
      const item = await EvaluationRepository.findOne(category, recordId);
      return { status: 'success', data: formatEvaluation(item) };
    }

    if (category) {
      const items = await EvaluationRepository.findByCategory(category);
      return { status: 'success', total: items.length, data: items.map(formatEvaluation) };
    }

    const items = await EvaluationRepository.findAll();
    return { status: 'success', total: items.length, data: items.map(formatEvaluation) };
  }

  static async saveEvaluation(body: any) {
    const category = String(body.category || '').trim();
    const recordId = String(body.recordId || body.record_id || body.id || '').trim();

    if (!category || !recordId) {
      const err: any = new Error('กรุณาระบุหมวดหมู่ (category) และรหัสรายการ (recordId)');
      err.status = 400;
      throw err;
    }

    const sdgIds = Array.isArray(body.sdg_ids)
      ? body.sdg_ids.map(Number).filter((n: number) => !isNaN(n))
      : [];

    const journalIndex = extractJournalIndexString(body.journal_index);

    const saved = await EvaluationRepository.upsert({
      category,
      recordId,
      sdgIds,
      iType: body.i_type ? String(body.i_type).trim() : null,
      journalIndex,
      evaluatedBy: body.evaluated_by ? String(body.evaluated_by).trim() : 'user',
    });

    syncEvaluationsToJson([{ category, recordId, sdgIds, iType: body.i_type, journalIndex, evaluatedBy: body.evaluated_by }]);
    return { status: 'success', data: formatEvaluation(saved) };
  }

  static async bulkSave(body: any) {
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return { status: 'success', message: 'No items provided', total: 0, data: [] };
    }

    const payload = items.map((i: any) => ({
      category: String(i.category).trim(),
      recordId: String(i.recordId || i.record_id || i.id).trim(),
      sdgIds: Array.isArray(i.sdg_ids) ? i.sdg_ids.map(Number).filter((n: number) => !isNaN(n)) : [],
      iType: i.i_type ? String(i.i_type).trim() : null,
      journalIndex: extractJournalIndexString(i.journal_index),
      evaluatedBy: i.evaluated_by ? String(i.evaluated_by).trim() : 'bulk',
    }));

    const results = await EvaluationRepository.bulkUpsert(payload);
    syncEvaluationsToJson(payload);
    return {
      status: 'success',
      message: `บันทึกผลการประเมินสำเร็จ ${results.length} รายการ`,
      total: results.length,
      data: results.map(formatEvaluation),
    };
  }

  static async deleteEvaluation(category?: string, recordId?: string) {
    return EvaluationRepository.delete(category, recordId);
  }
}
