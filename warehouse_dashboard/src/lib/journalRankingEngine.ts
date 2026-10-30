import { KNOWN_JOURNALS_INDEX, JournalTier } from '../config/journalRankingConfig';

export interface JournalDetectionResult {
  journalName: string;
  tier: JournalTier;
  confidence: number;
  database: string;
  source: 'matched_index' | 'inferred';
}

/**
 * ทำความสะอาดชื่อวารสารเพื่อเปรียบเทียบ
 */
function normalizeJournalName(name: string): string {
  return String(name || '')
    .toLowerCase()
    .replace(/[,\.:;\(\)\[\]"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * ตรวจจับอันดับวารสาร (Q1-Q4 หรือ TCI 1-2) อัตโนมัติจากชื่อวารสาร
 */
export function autoDetectJournalRanking(journalName: string): JournalDetectionResult | null {
  if (!journalName || journalName.trim() === '' || journalName === '-') return null;

  const clean = normalizeJournalName(journalName);

  // 1. ตรวจสอบตรงกับฐานข้อมูลวารสารที่บันทึกไว้
  for (const entry of KNOWN_JOURNALS_INDEX) {
    if (clean === entry.normalizedTitle || clean.includes(entry.normalizedTitle) || entry.normalizedTitle.includes(clean)) {
      return {
        journalName: entry.title,
        tier: entry.tier,
        confidence: 95,
        database: entry.database,
        source: 'matched_index',
      };
    }
  }

  // 2. ตรวจสอบจากคำสำคัญในชื่อวารสาร (Heuristic Rules)
  if (clean.includes('q1') || clean.includes('quartile 1')) {
    return { journalName, tier: 'Q1', confidence: 90, database: 'Scopus', source: 'inferred' };
  }
  if (clean.includes('q2') || clean.includes('quartile 2')) {
    return { journalName, tier: 'Q2', confidence: 90, database: 'Scopus', source: 'inferred' };
  }
  if (clean.includes('tci 1') || clean.includes('tci1') || clean.includes('tci กลุ่ม 1') || clean.includes('tci กลุ่มที่ 1')) {
    return { journalName, tier: 'TCI 1', confidence: 92, database: 'TCI', source: 'inferred' };
  }
  if (clean.includes('tci 2') || clean.includes('tci2') || clean.includes('tci กลุ่ม 2') || clean.includes('tci กลุ่มที่ 2')) {
    return { journalName, tier: 'TCI 2', confidence: 92, database: 'TCI', source: 'inferred' };
  }
  if (clean.includes('conference') || clean.includes('proceeding') || clean.includes('symposium')) {
    return { journalName, tier: 'International Conference', confidence: 85, database: 'Conference', source: 'inferred' };
  }

  return null;
}

/**
 * ดึงข้อมูลผลงานตีพิมพ์จากหมายเลข DOI อัตโนมัติ (CrossRef Open API)
 */
export async function fetchDOIMetadata(doi: string): Promise<{
  title?: string;
  journal?: string;
  year?: number;
  authors?: string[];
  volume?: string;
  issue?: string;
  suggestedTier?: JournalTier;
} | null> {
  const cleanDoi = doi.trim().replace(/^https?:\/\/doi\.org\//i, '');
  if (!cleanDoi || !cleanDoi.includes('/')) return null;

  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
      headers: {
        'User-Agent': 'KU-Engineering-DataWarehouse/1.0 (mailto:eng-research@ku.th)',
      },
    });

    if (!res.ok) return null;
    const json = await res.json();
    const item = json?.message;
    if (!item) return null;

    const title = item.title?.[0] || '';
    const journal = item['container-title']?.[0] || '';
    const year = item.created?.['date-parts']?.[0]?.[0];
    const authors = item.author?.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()) || [];
    const volume = item.volume || '';
    const issue = item.issue || '';

    const detected = autoDetectJournalRanking(journal);

    return {
      title,
      journal,
      year,
      authors,
      volume,
      issue,
      suggestedTier: detected?.tier,
    };
  } catch (err) {
    console.warn('Could not fetch DOI metadata:', err);
    return null;
  }
}
