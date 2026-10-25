import { EvaluationRepository } from '../repositories/evaluation.repository.js';

function formatEvaluation(item: any) {
  if (!item) return null;
  return {
    category: item.category,
    recordId: item.recordId,
    record_id: item.recordId,
    sdg_ids: item.sdgIds || [],
    i_type: item.iType || '',
    journal_index: item.journalIndex || '',
    evaluated_by: item.evaluatedBy || 'user',
    evaluated_at: item.evaluatedAt,
  };
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

    const saved = await EvaluationRepository.upsert({
      category,
      recordId,
      sdgIds,
      iType: body.i_type ? String(body.i_type).trim() : null,
      journalIndex: body.journal_index ? String(body.journal_index).trim() : null,
      evaluatedBy: body.evaluated_by ? String(body.evaluated_by).trim() : 'user',
    });

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
      journalIndex: i.journal_index ? String(i.journal_index).trim() : null,
      evaluatedBy: i.evaluated_by ? String(i.evaluated_by).trim() : 'bulk',
    }));

    const results = await EvaluationRepository.bulkUpsert(payload);
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
