import {
  SDGS_DATA,
  SDGItem,
  SDG_STRATEGIC_CLUSTERS,
  SDGStrategicCluster,
  UI_GREENMETRIC_CATEGORIES,
} from '../config/sdgConfig';

export const SDG_MASTER: SDGItem[] = Object.values(SDGS_DATA);

export interface SDGMatchResult {
  sdg: SDGItem;
  score: number;
  matchedKeywords: string[];
  confidencePercent: number;
}

/**
 * ตรวจสอบว่าเป็นข้อมูลทดสอบหรือไม่ (เช่น name === 'test' หรือ department มีคำว่า 'test')
 * ใช้กรองในหน่วยความจำโดยไม่ต้องแก้ไขไฟล์ JSON ต้นฉบับ
 */
export function isTestRecord(item: any): boolean {
  if (!item) return true;
  const name = String(item.name || item.title || item.topic_title || '').trim();
  if (!name || name === 'nan' || name === 'NaT' || name === 'เรื่อง') return true;
  const lowerName = name.toLowerCase();
  if (lowerName === 'test' || lowerName === 'test1' || lowerName === 'ทดสอบ') return true;
  const head = String(item.head || item.person || item.owner || item.creator || '').trim().toLowerCase();
  const dept = String(item.department || '').trim().toLowerCase();
  if ((head === 'test' || head === 'test1') && dept.includes('test')) return true;
  return false;
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

  // Fallback ตามบริบทภาควิชาหากชื่อโครงการไม่มีคำสำคัญตรงตัว
  if (results.length === 0 && department) {
    const deptText = department.toLowerCase();
    let fallbackNum = 9; // ค่าเริ่มต้นคณะวิศวกรรมศาสตร์ = SDG 9 อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน
    if (deptText.includes('เกษตร') || deptText.includes('ae') || deptText.includes('abe') || deptText.includes('อาหาร') || deptText.includes('fe')) {
      fallbackNum = 2; // ขจัดความหิวโหย / เกษตรและอาหาร
    } else if (deptText.includes('ชลประทาน') || deptText.includes('ire')) {
      fallbackNum = 6; // น้ำสะอาดและสุขอนามัย
    } else if (deptText.includes('พลังงาน') || deptText.includes('eeec')) {
      fallbackNum = 7; // พลังงานสะอาด
    } else if (deptText.includes('โยธา') || deptText.includes('ce') || deptText.includes('ประตู') || deptText.includes('dwt')) {
      fallbackNum = 11; // เมืองและชุมชนที่ยั่งยืน
    }
    const sdg = SDGS_DATA[fallbackNum];
    if (sdg) {
      results.push({
        sdg,
        score: 5,
        matchedKeywords: ['บริบทภาควิชา'],
        confidencePercent: 60,
      });
    }
  }

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

/**
 * คืนค่าคลัสเตอร์ยุทธศาสตร์ของ SDG หมายเลขที่ระบุ
 */
export function getClusterForSDG(sdgNumber: number): SDGStrategicCluster {
  return (
    SDG_STRATEGIC_CLUSTERS.find((c) => c.sdgNumbers.includes(sdgNumber)) ||
    SDG_STRATEGIC_CLUSTERS[2]
  );
}

/**
 * คืนค่า SDG หลักของรายการข้อมูล 1 รายการ (ตรวจสอบจาก sdg_code ก่อน หากไม่มีจึงวิเคราะห์จากชื่อและภาควิชา)
 */
export function resolvePrimarySDG(item: any): SDGItem | null {
  if (!item) return null;
  if (item.sdg_code && item.sdg_code !== '-' && item.sdg_code !== 'nan') {
    const direct = getSDGByCodeOrNumber(item.sdg_code);
    if (direct) return direct;
  }
  const title = item.name || item.title || item.topic_title || '';
  const dept = Array.isArray(item.departments)
    ? item.departments.join(' ')
    : item.department || '';
  const extra = [
    item.journal,
    item.target_group,
    item.service_type,
    item.project_type_category,
    Array.isArray(item.characteristics) ? item.characteristics.join(' ') : item.characteristics,
  ]
    .filter(Boolean)
    .join(' ');

  const detected = detectSDGsFromText(title, dept, extra);
  return detected.length > 0 ? detected[0].sdg : SDGS_DATA[9];
}

export interface HybridSdgResult {
  sdgIds: number[];
  primarySdg: number;
  isVerified: boolean;
  statusLabel: 'Verified' | 'Auto-Detected';
  statusTextTh: 'ผ่านการประเมินแล้ว' | 'ระบบจำแนกอัตโนมัติ (รอตรวจสอบ)';
  matchedKeywords: string[];
  confidencePercent: number;
}

/**
 * Hybrid SDG Resolver:
 * 1. ตรวจสอบผลประเมินจริงจากผู้ประเมิน (evaluation.sdg_ids / item.sdg_ids) เป็นลำดับแรกเสมอ
 * 2. หากยังไม่มีผลประเมิน จึงใช้ SDG Auto-Detection Engine วิเคราะห์ข้อมูลแทน
 */
export function resolveHybridSDG(
  item: any,
  category?: string,
  evaluationsMap?: Record<string, any>
): HybridSdgResult {
  if (!item) {
    return {
      sdgIds: [9],
      primarySdg: 9,
      isVerified: false,
      statusLabel: 'Auto-Detected',
      statusTextTh: 'ระบบจำแนกอัตโนมัติ (รอตรวจสอบ)',
      matchedKeywords: ['บริบทเริ่มต้น'],
      confidencePercent: 50,
    };
  }

  // 1. ตรวจสอบผลประเมินจริงจากผู้ประเมิน
  let verifiedSdgs: number[] = [];

  const recId = String(item.id || item._id || item.name || '').trim();
  const catKey = (category || item._category || '').toLowerCase();
  const ev =
    item.evaluation ||
    (evaluationsMap && catKey ? evaluationsMap[`${catKey}_${recId}`] || evaluationsMap[recId] : null);

  const rawSdgs =
    ev?.sdg_ids ||
    item.sdg_ids ||
    ev?.sdgs ||
    item.sdgs;

  if (rawSdgs) {
    const arr = Array.isArray(rawSdgs)
      ? rawSdgs
      : String(rawSdgs).split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
    verifiedSdgs = arr
      .map((n: any) => (typeof n === 'number' ? n : Number(String(n).replace(/\D/g, ''))))
      .filter((n: number) => !isNaN(n) && n >= 1 && n <= 17);
  } else if (item.sdg_code && item.sdg_code !== '-' && item.sdg_code !== 'nan') {
    const num = Number(String(item.sdg_code).replace(/\D/g, ''));
    if (!isNaN(num) && num >= 1 && num <= 17) {
      verifiedSdgs = [num];
    }
  }

  verifiedSdgs = Array.from(new Set(verifiedSdgs));

  if (verifiedSdgs.length > 0) {
    return {
      sdgIds: verifiedSdgs,
      primarySdg: verifiedSdgs[0],
      isVerified: true,
      statusLabel: 'Verified',
      statusTextTh: 'ผ่านการประเมินแล้ว',
      matchedKeywords: ['ผลการประเมินยืนยัน'],
      confidencePercent: 100,
    };
  }

  // 2. หากยังไม่ผ่านการประเมิน ใช้ Auto-Detection วิเคราะห์จากข้อมูลในฐานข้อมูล
  const title = item.name || item.title || item.topic_title || '';
  const dept = Array.isArray(item.departments)
    ? item.departments.join(' ')
    : item.department || '';
  const extra = [
    item.journal,
    item.target_group,
    item.service_type,
    item.project_type_category,
    Array.isArray(item.characteristics) ? item.characteristics.join(' ') : item.characteristics,
  ]
    .filter(Boolean)
    .join(' ');

  const detected = detectSDGsFromText(title, dept, extra);

  if (detected.length > 0) {
    const topMatches = detected.slice(0, 2);
    const sdgIds = Array.from(new Set(topMatches.map((m) => m.sdg.number)));
    const matchedKeywords = Array.from(new Set(detected.flatMap((m) => m.matchedKeywords)));
    return {
      sdgIds,
      primarySdg: detected[0].sdg.number,
      isVerified: false,
      statusLabel: 'Auto-Detected',
      statusTextTh: 'ระบบจำแนกอัตโนมัติ (รอตรวจสอบ)',
      matchedKeywords,
      confidencePercent: detected[0].confidencePercent,
    };
  }

  // Fallback ตามบริบทสังกัด
  let fallbackNum = 9;
  const deptLower = dept.toLowerCase();
  if (deptLower.includes('ชลประทาน') || deptLower.includes('ire')) fallbackNum = 6;
  else if (deptLower.includes('เกษตร') || deptLower.includes('อาหาร') || deptLower.includes('ae') || deptLower.includes('fe')) fallbackNum = 2;
  else if (deptLower.includes('พลังงาน') || deptLower.includes('eeec')) fallbackNum = 7;
  else if (deptLower.includes('โยธา') || deptLower.includes('ce')) fallbackNum = 11;

  return {
    sdgIds: [fallbackNum],
    primarySdg: fallbackNum,
    isVerified: false,
    statusLabel: 'Auto-Detected',
    statusTextTh: 'ระบบจำแนกอัตโนมัติ (รอตรวจสอบ)',
    matchedKeywords: ['บริบทภาควิชา'],
    confidencePercent: 55,
  };
}

/**
 * คำนวณงบประมาณของรายการข้อมูลตามโครงสร้างของแต่ละพันธกิจ
 */
export function extractItemBudget(item: any): number {
  if (!item) return 0;
  if (item.budget !== undefined && item.budget !== null && item.budget !== '' && item.budget !== 'nan') {
    const b = Number(item.budget);
    if (!isNaN(b) && b > 0) return b;
  }
  const internal = Number(item.budget_internal) || 0;
  const external = Number(item.budget_external) || 0;
  if (internal + external > 0) return internal + external;
  const support = Number(item.support_amount) || 0;
  if (support > 0) return support;
  return 0;
}

export interface AggregatedSDGEntry {
  sdg: SDGItem;
  cluster: SDGStrategicCluster;
  count: number;
  verifiedCount?: number;
  autoDetectedCount?: number;
  budget: number;
  percentOfCount: number;
  percentOfBudget: number;
  items: any[];
}

export interface AggregatedClusterEntry {
  cluster: SDGStrategicCluster;
  count: number;
  budget: number;
  percentOfCount: number;
  percentOfBudget: number;
  activeSdgNumbers: number[];
  items: any[];
}

export interface AggregatedGreenMetricEntry {
  code: string;
  nameTh: string;
  color: string;
  count: number;
  budget: number;
  sdgNumbers: number[];
  items: any[];
}

export interface SDGAnalyticsSummary {
  totalItems: number;
  totalVerified?: number;
  totalAuto?: number;
  totalBudget: number;
  coveredCount: number;
  all17: AggregatedSDGEntry[];
  activeSDGs: AggregatedSDGEntry[];
  gapSDGs: AggregatedSDGEntry[];
  byCluster: AggregatedClusterEntry[];
  byGreenMetric: AggregatedGreenMetricEntry[];
}

/**
 * คำนวณสรุปผล SDG แบบครบวงจร (Hybrid: ประเมินจริง + Auto-Detect)
 */
export function aggregateSDGMetrics(items: any[]): SDGAnalyticsSummary {
  const validItems = (items || []).filter((item) => !isTestRecord(item));

  const mapByNum: Record<number, { count: number; verifiedCount: number; autoDetectedCount: number; budget: number; items: any[] }> = {};
  for (let i = 1; i <= 17; i++) {
    mapByNum[i] = { count: 0, verifiedCount: 0, autoDetectedCount: 0, budget: 0, items: [] };
  }

  let totalCount = 0;
  let totalBudget = 0;
  let totalVerified = 0;
  let totalAuto = 0;

  validItems.forEach((item) => {
    const hybrid = resolveHybridSDG(item);
    const b = extractItemBudget(item);
    hybrid.sdgIds.forEach((num) => {
      if (!mapByNum[num]) return;
      mapByNum[num].count += 1;
      if (hybrid.isVerified) {
        mapByNum[num].verifiedCount += 1;
      } else {
        mapByNum[num].autoDetectedCount += 1;
      }
      mapByNum[num].budget += b;
      mapByNum[num].items.push({
        ...item,
        _isVerified: hybrid.isVerified,
        _hybridStatus: hybrid.statusLabel,
        _hybridStatusText: hybrid.statusTextTh,
      });
    });
    totalCount += 1;
    totalBudget += b;
    if (hybrid.isVerified) totalVerified += 1;
    else totalAuto += 1;
  });

  const all17: AggregatedSDGEntry[] = Object.values(SDGS_DATA).map((sdg) => {
    const bucket = mapByNum[sdg.number] || { count: 0, verifiedCount: 0, autoDetectedCount: 0, budget: 0, items: [] };
    return {
      sdg,
      cluster: getClusterForSDG(sdg.number),
      count: bucket.count,
      verifiedCount: bucket.verifiedCount,
      autoDetectedCount: bucket.autoDetectedCount,
      budget: bucket.budget,
      percentOfCount: totalCount > 0 ? (bucket.count / totalCount) * 100 : 0,
      percentOfBudget: totalBudget > 0 ? (bucket.budget / totalBudget) * 100 : 0,
      items: bucket.items,
    };
  });

  const activeSDGs = all17
    .filter((entry) => entry.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.budget - a.budget;
    });

  const gapSDGs = all17.filter((entry) => entry.count === 0);

  const byCluster: AggregatedClusterEntry[] = SDG_STRATEGIC_CLUSTERS.map((cluster) => {
    const entries = all17.filter((e) => cluster.sdgNumbers.includes(e.sdg.number));
    const count = entries.reduce((s, e) => s + e.count, 0);
    const budget = entries.reduce((s, e) => s + e.budget, 0);
    const clusterItems = entries.flatMap((e) => e.items);
    const activeSdgNumbers = entries.filter((e) => e.count > 0).map((e) => e.sdg.number);

    return {
      cluster,
      count,
      budget,
      percentOfCount: totalCount > 0 ? (count / totalCount) * 100 : 0,
      percentOfBudget: totalBudget > 0 ? (budget / totalBudget) * 100 : 0,
      activeSdgNumbers,
      items: clusterItems,
    };
  }).sort((a, b) => b.count - a.count || b.budget - a.budget);

  const byGreenMetric: AggregatedGreenMetricEntry[] = UI_GREENMETRIC_CATEGORIES.map((gm) => {
    const entries = all17.filter((e) => e.sdg.greenMetricCategory === gm.code);
    const count = entries.reduce((s, e) => s + e.count, 0);
    const budget = entries.reduce((s, e) => s + e.budget, 0);
    const gmItems = entries.flatMap((e) => e.items);
    const sdgNumbers = entries.map((e) => e.sdg.number);
    return {
      code: gm.code,
      nameTh: gm.nameTh,
      color: gm.color,
      count,
      budget,
      sdgNumbers,
      items: gmItems,
    };
  }).sort((a, b) => b.count - a.count || b.budget - a.budget);

  return {
    totalItems: totalCount,
    totalVerified,
    totalAuto,
    totalBudget,
    coveredCount: activeSDGs.length,
    all17,
    activeSDGs,
    gapSDGs,
    byCluster,
    byGreenMetric,
  };
}
