import { SDGS_DATA, SDGItem } from '../config/sdgConfig';

export const SDG_MASTER: SDGItem[] = Object.values(SDGS_DATA);

export interface SDGMatchResult {
  sdg: SDGItem;
  score: number;
  matchedKeywords: string[];
  confidencePercent: number;
}

/**
 * วิเคราะห์ข้อความชื่อโครงการ ภาควิชา และคำสำคัญ เพื่อแนะนำ SDG ที่สอดคล้องที่สุดแบบอัตโนมัติ
 */
export function detectSDGsFromText(title: string, department?: string, summary?: string): SDGMatchResult[] {
  if (!title) return [];

  const textToAnalyze = `${title} ${department || ''} ${summary || ''}`.toLowerCase();
  const results: SDGMatchResult[] = [];

  Object.values(SDGS_DATA).forEach((sdg) => {
    let score = 0;
    const matched: string[] = [];

    sdg.keywords.forEach((keyword) => {
      const kw = keyword.toLowerCase();
      if (textToAnalyze.includes(kw)) {
        // ให้คะแนนคำที่มีความยาวมากกว่า เพื่อความแม่นยำ
        const weight = kw.length > 5 ? 15 : 10;
        score += weight;
        matched.push(keyword);
      }
    });

    if (score > 0) {
      // คำนวณเปอร์เซ็นต์ความมั่นใจ (เพดาน 98%)
      const confidencePercent = Math.min(98, Math.round(50 + score * 2.5));
      results.push({
        sdg,
        score,
        matchedKeywords: Array.from(new Set(matched)),
        confidencePercent,
      });
    }
  });

  // เรียงลำดับจากคะแนนสูงสุดไปต่ำสุด
  return results.sort((a, b) => b.score - a.score);
}

/**
 * ดึงข้อมูล SDG จากรหัส เช่น "SDG 6" หรือ 6
 */
export function getSDGByCodeOrNumber(identifier: string | number): SDGItem | null {
  if (!identifier) return null;
  const num = typeof identifier === 'number' ? identifier : parseInt(String(identifier).replace(/\D/g, ''), 10);
  return SDGS_DATA[num] || null;
}
