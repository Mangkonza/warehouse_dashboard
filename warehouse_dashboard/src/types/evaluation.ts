/**
 * Evaluation (การประเมิน) Type Definitions & Rules
 */

export type IType = 'I_AM' | 'I_SEE';
export type JournalIndexType = 'Q' | 'TCI';

export interface JournalIndexValue {
  type: JournalIndexType;
  value: string; // 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'TCI 1' | 'TCI 2' | 'TCI 3'
}

export interface EvaluationValue {
  sdg_ids: number[]; // e.g. [1, 2, 17]
  i_type: IType | null;
  journal_index?: JournalIndexValue | null;
}

export interface EvaluationRecord extends EvaluationValue {
  id: string; // `${category}_${record_id}`
  category: string;
  record_id: string;
  evaluated_by?: string;
  evaluated_at?: string;
  updated_at: string;
}

/**
 * Completion rule in one function:
 * At least one SDG and an I am / I see value, plus Q / TCI for publications.
 */
export function isEvaluated(
  category: string,
  evaluation?: Partial<EvaluationRecord> | Partial<EvaluationValue> | null
): boolean {
  if (!evaluation) return false;
  const hasSdg = Array.isArray(evaluation.sdg_ids) && evaluation.sdg_ids.length > 0;
  const hasIType = evaluation.i_type === 'I_AM' || evaluation.i_type === 'I_SEE';
  if (!hasSdg || !hasIType) return false;

  if (category && category.toLowerCase() === 'publications') {
    const j: any = evaluation.journal_index;
    if (!j) return false;
    if (typeof j === 'object' && j.value) {
      return String(j.value).trim() !== '' && String(j.value) !== '[object Object]';
    }
    if (typeof j === 'string') {
      const trimmed = j.trim();
      return trimmed !== '' && trimmed !== '[object Object]';
    }
    return false;
  }

  return true;
}

/**
 * Normalize an SDG integer (1-17) to display label (e.g. 1 -> "SDG 1")
 */
export function formatSdgLabel(goalNum: number): string {
  return `SDG ${goalNum}`;
}

/**
 * Parse an SDG code/string (e.g. "SDG 1", "1", "SDG6") to an integer 1-17
 */
export function parseSdgNumber(val: any): number | null {
  if (typeof val === 'number' && val >= 1 && val <= 17) return val;
  const match = String(val || '').match(/(\d+)/);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n >= 1 && n <= 17) return n;
  }
  return null;
}
