import { getDepartment } from '@/lib/departments';
import { parseSdgNumber } from '@/types/evaluation';
import { resolveHybridSDG } from '@/lib/sdgEngine';
export function getRecordId(item: any): string {
  return String(item.id || item._id || item.name || '').trim();
}

export function getRecordEvalKey(category: string, item: any): string {
  return `${category.toLowerCase()}_${getRecordId(item)}`;
}

/**
 * Checks if an item matches selected departments (supports multi-select comma separated codes/names and OTH custom text)
 */
export function itemMatchesDepartmentMulti(
  item: any,
  selectedDeptStr: string,
  customDeptText?: string
): boolean {
  if (!selectedDeptStr && !customDeptText) return true;

  const targetCodesOrNames = (selectedDeptStr || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (targetCodesOrNames.length === 0 && !customDeptText) return true;

  const rawValues: any[] = [];
  if (item.department !== undefined && item.department !== null) {
    if (Array.isArray(item.department)) rawValues.push(...item.department);
    else rawValues.push(item.department);
  }
  if (item.departments !== undefined && item.departments !== null) {
    if (Array.isArray(item.departments)) rawValues.push(...item.departments);
    else rawValues.push(item.departments);
  }

  const itemDeptStrings: string[] = [];
  for (const raw of rawValues) {
    if (!raw) continue;
    const str = String(raw).trim();
    if (!str || str === '-' || str === 'nan') continue;
    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          itemDeptStrings.push(...parsed.map(String));
          continue;
        }
      } catch {}
    }
    const parts = str.split(/[,;\n\r]+/);
    for (const p of parts) {
      if (p.trim()) itemDeptStrings.push(p.trim());
    }
  }

  // 1. Check custom OTH text
  if (customDeptText && customDeptText.trim()) {
    const q = customDeptText.toLowerCase().trim();
    const hasCustomMatch = itemDeptStrings.some((s) => s.toLowerCase().includes(q));
    if (hasCustomMatch) return true;
  }

  // 2. Check selected department codes / names
  for (const target of targetCodesOrNames) {
    if (target === 'OTH') {
      const hasOth = itemDeptStrings.some(
        (s) => s.startsWith('OTH:') || s.includes('อื่นๆ') || s.includes('อื่น ๆ')
      );
      if (hasOth) return true;
      continue;
    }
    const targetDept = getDepartment(target);
    const targetCode = targetDept.code;
    for (const itemDeptStr of itemDeptStrings) {
      if (getDepartment(itemDeptStr).code === targetCode) return true;
      if (itemDeptStr.includes(target) || (targetDept.name && itemDeptStr.includes(targetDept.name))) {
        return true;
      }
    }
  }

  return targetCodesOrNames.length === 0 && Boolean(customDeptText);
}

/**
 * Checks if an item falls within the given date range (YYYY-MM-DD)
 */
export function itemMatchesDateRange(
  item: any,
  dateFrom?: string | null,
  dateTo?: string | null
): boolean {
  if (!dateFrom && !dateTo) return true;

  // Actual project execution/publication dates only (exclude DB inserted createdAt metadata)
  const candidates: string[] = [
    item.start_date,
    item.end_date,
    item.date,
    item.projectDate,
    item.month_year,
    item.published_date,
    item.submission_date,
    item.filing_date,
  ].filter(Boolean);

  if (candidates.length === 0 && (item.year || item.fiscal_year || item.fiscal_year_be)) {
    const rawY = item.fiscal_year_be || item.fiscal_year || item.year;
    let y = parseInt(String(rawY).trim(), 10);
    if (!isNaN(y)) {
      if (y > 2400) y -= 543;
      candidates.push(`${y}-01-01`);
    }
  }

  // If filtering by date range, undated items should not match
  if (candidates.length === 0) return false;

  let minItemDate: Date | null = null;
  let maxItemDate: Date | null = null;

  for (const c of candidates) {
    const dStr = String(c).trim();
    let parsed: Date;
    if (/^\d{4}-\d{2}$/.test(dStr)) {
      parsed = new Date(`${dStr}-01`);
    } else {
      parsed = new Date(dStr);
    }
    if (isNaN(parsed.getTime())) continue;
    if (parsed.getFullYear() > 2400) {
      parsed.setFullYear(parsed.getFullYear() - 543);
    }
    if (!minItemDate || parsed < minItemDate) minItemDate = parsed;
    if (!maxItemDate || parsed > maxItemDate) maxItemDate = parsed;
  }

  if (!minItemDate) return false;
  if (!maxItemDate) maxItemDate = minItemDate;

  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`);
    if (maxItemDate < from) return false;
  }
  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59.999`);
    if (minItemDate > to) return false;
  }

  return true;
}

/**
 * Checks if an item matches evaluation criteria (SDGs, I AM / I SEE framework, Q/TCI journals, and evaluation status)
 */
export function itemMatchesEvaluation(
  item: any,
  category: string,
  evalMap?: Record<string, any>,
  selectedSdgs?: string[],
  selectedFramework?: string,
  selectedJournals?: string[],
  evaluationStatus?: 'all' | 'evaluated' | 'auto_detected' | 'unevaluated'
): boolean {
  const key = getRecordEvalKey(category, item);
  const ev = evalMap?.[key] || item.evaluation;
  const hybrid = resolveHybridSDG(item, category, evalMap);

  // Status Check ('all' | 'evaluated' | 'auto_detected' | 'unevaluated')
  if (evaluationStatus && evaluationStatus !== 'all') {
    if (evaluationStatus === 'evaluated' && !hybrid.isVerified) return false;
    if (evaluationStatus === 'auto_detected' && (hybrid.isVerified || hybrid.sdgIds.length === 0)) return false;
    if (evaluationStatus === 'unevaluated' && hybrid.isVerified) return false;
  }

  // Extract SDG numbers (using hybrid SDGs which supports verified + auto fallback)
  const itemSdgNums = hybrid.sdgIds || [];

  // SDGs Check
  if (selectedSdgs && selectedSdgs.length > 0) {
    const targetNums = selectedSdgs
      .map((s) => parseSdgNumber(s))
      .filter((n): n is number => n !== null);
    if (targetNums.length > 0) {
      const hasMatch = targetNums.some((n) => itemSdgNums.includes(n));
      if (!hasMatch) return false;
    }
  }

  // Framework Check ('all' | 'i_am' | 'i_see')
  if (selectedFramework && selectedFramework !== 'all') {
    const itemIType = ev?.i_type || item.i_type || null;
    const targetType = selectedFramework === 'i_am' ? 'I_AM' : 'I_SEE';
    if (itemIType !== targetType) return false;
  }

  // Journals Check (Q1-Q4, TCI 1-3)
  if (selectedJournals && selectedJournals.length > 0) {
    const jVal = String(
      ev?.journal_index?.value ||
      item.journal_index?.value ||
      item.level ||
      item.journal ||
      item.remarks ||
      ''
    ).toLowerCase();
    const hasMatch = selectedJournals.some((target) => jVal.includes(target.toLowerCase()));
    if (!hasMatch) return false;
  }

  return true;
}

/**
 * Checks if an item matches numeric ranges (e.g. budget, hours, participants, impact factor)
 */
export function itemMatchesNumericRanges(
  item: any,
  numericRanges?: Record<string, [number | null, number | null]>
): boolean {
  if (!numericRanges || Object.keys(numericRanges).length === 0) return true;

  for (const [key, [minVal, maxVal]] of Object.entries(numericRanges)) {
    if (minVal == null && maxVal == null) continue;

    let raw = item[key];
    if (raw === undefined || raw === null || raw === '' || raw === '-') {
      continue;
    }
    const val = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^0-9.-]/g, ''));
    if (isNaN(val)) continue;

    if (minVal != null && val < minVal) return false;
    if (maxVal != null && val > maxVal) return false;
  }
  return true;
}
