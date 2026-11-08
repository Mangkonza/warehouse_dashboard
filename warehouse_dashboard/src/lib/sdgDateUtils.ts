export const THAI_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/**
 * Normalise raw year to Gregorian CE.
 */
export function toCeYear(raw: number): number {
  if (raw >= 2400) return raw - 543;
  if (raw >= 1966 && raw <= 1972) return raw + 57; // legacy artifact
  return raw;
}

/**
 * Normalise CE to Buddhist Era (BE).
 */
export function toBeYear(ce: number): number {
  return ce + 543;
}

/**
 * Extract record date (year CE and month 0-11) according to domain-specific mapping.
 */
export function extractRecordDate(item: any, category: string): { year: number; month: number } | null {
  let rawDate: unknown = null;

  switch (category) {
    case 'research':
      rawDate = item.start_date || item.startDate || item.fiscal_year || item.date;
      break;
    case 'academic':
      rawDate = item.start_date || item.integration_start_date || item.date;
      break;
    case 'publications':
      rawDate = item.month_year || item.fiscal_year_be || item.published_date || item.date;
      break;
    case 'ip':
      rawDate = item.filing_date || item.protection_start || item.date;
      break;
    case 'service':
    case 'services':
      rawDate = item.date || item.start_date;
      break;
    default:
      rawDate = item.start_date || item.date || item.createdAt;
  }

  // If rawDate is duration string like '12 เดือน' or '-' or missing, fallback to fiscal_year or year in id
  const rawStr = String(rawDate || '').trim();
  if (!rawDate || /^\d+\s*เดือน/.test(rawStr) || rawStr === '-' || rawStr === 'nan' || rawStr === 'NaT') {
    if (item.fiscal_year && /^\d{4}$/.test(String(item.fiscal_year).trim())) {
      rawDate = String(item.fiscal_year).trim();
    } else {
      const idMatch = String(item.id || '').match(/(25\d{2}|20\d{2})/);
      if (idMatch) {
        rawDate = idMatch[1];
      }
    }
  }

  // Fallback to evaluation date if domain date is missing
  if (!rawDate && item.evaluation?.evaluated_at) {
    rawDate = item.evaluation.evaluated_at;
  }

  if (!rawDate) return null;

  if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
    return { year: rawDate.getFullYear(), month: rawDate.getMonth() };
  }

  if (typeof rawDate === 'number') {
    const y = toCeYear(rawDate);
    return { year: y, month: 0 };
  }

  const s = String(rawDate).trim();
  if (!s) return null;

  // Pattern 1: ISO or date with dash: YYYY-MM-DD or DD-MM-YYYY
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const y = toCeYear(parseInt(isoMatch[1], 10));
    const m = Math.max(0, Math.min(11, parseInt(isoMatch[2], 10) - 1));
    return { year: y, month: m };
  }

  // Pattern 2: DD/MM/YYYY or MM/YYYY or YYYY
  const parts = s.split(/[\/\-.\s]+/);
  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    const y = toCeYear(parseInt(parts[0], 10));
    return { year: y, month: 0 };
  }

  if (parts.length >= 2) {
    let yearCandidate: number | null = null;
    let monthCandidate: number | null = null;

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (/^\d{4}$/.test(p)) {
        yearCandidate = toCeYear(parseInt(p, 10));
        if (i > 0 && /^\d{1,2}$/.test(parts[i - 1])) {
          monthCandidate = Math.max(0, Math.min(11, parseInt(parts[i - 1], 10) - 1));
        }
        break;
      }
    }

    if (yearCandidate !== null) {
      return { year: yearCandidate, month: monthCandidate !== null ? monthCandidate : 0 };
    }
  }

  // Pattern 3: Standard Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return { year: toCeYear(d.getFullYear()), month: d.getMonth() };
  }

  return null;
}
