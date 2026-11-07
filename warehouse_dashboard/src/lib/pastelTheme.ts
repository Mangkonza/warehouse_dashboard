import { resolvePrimarySDG, resolveHybridSDG } from '@/lib/sdgEngine';
import { SDGS_DATA } from '@/config/sdgConfig';

/**
 * Modern Pastel & Clean KU Design System Tokens & Utilities
 * Single Source of Truth for Mission Palettes, Strategic Mappings (ISEE / IAM / SDGs),
 * and Shared Data Normalization.
 * 
 * Reference: docs/blueprints/00_ui_ux_design_system.md
 */

export const MISSION_THEMES = {
  research: {
    key: 'research',
    label: 'โครงการวิจัย',
    shortLabel: 'วิจัย',
    color: '#10B981',       // Mint Emerald
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    textColor: '#047857',
    glowClass: 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
    gradientBg: 'from-emerald-50/80 via-white to-white',
    card: {
      surface: '#ECFDF5',
      border: '#A7F3D0',
      header: '#047857',
      iconBg: '#D1FAE5',
      icon: '#059669',
      subtext: '#065F46',
      glow: 'rgba(16, 185, 129, 0.08)',
    },
  },
  academic: {
    key: 'academic',
    label: 'โครงการพัฒนาวิชาการ',
    shortLabel: 'พัฒนาวิชาการ',
    color: '#0EA5E9',       // Sky Blue
    bgColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    textColor: '#0369A1',
    glowClass: 'shadow-sky-500/10 hover:shadow-sky-500/20',
    gradientBg: 'from-sky-50/80 via-white to-white',
    card: {
      surface: '#F0F9FF',
      border: '#BAE6FD',
      header: '#0369A1',
      iconBg: '#E0F2FE',
      icon: '#0EA5E9',
      subtext: '#075985',
      glow: 'rgba(14, 165, 233, 0.08)',
    },
  },
  publications: {
    key: 'publications',
    label: 'ผลงานตีพิมพ์ทางวิชาการ',
    shortLabel: 'ตีพิมพ์',
    color: '#F43F5E',       // Rose Coral
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    textColor: '#BE123C',
    glowClass: 'shadow-rose-500/10 hover:shadow-rose-500/20',
    gradientBg: 'from-rose-50/80 via-white to-white',
    card: {
      surface: '#FFF1F2',
      border: '#FECDD3',
      header: '#BE123C',
      iconBg: '#FFE4E6',
      icon: '#F43F5E',
      subtext: '#9F1239',
      glow: 'rgba(244, 63, 94, 0.08)',
    },
  },
  service: {
    key: 'service',
    label: 'งานบริการวิชาการ',
    shortLabel: 'บริการวิชาการ',
    color: '#F59E0B',       // Amber Peach
    bgColor: '#FFFBEB',
    borderColor: '#FED7AA',
    textColor: '#B45309',
    glowClass: 'shadow-amber-500/10 hover:shadow-amber-500/20',
    gradientBg: 'from-amber-50/80 via-white to-white',
    card: {
      surface: '#FFFBEB',
      border: '#FED7AA',
      header: '#92400E',
      iconBg: '#FEF3C7',
      icon: '#D97706',
      subtext: '#78350F',
      glow: 'rgba(245, 158, 11, 0.08)',
    },
  },
  ip: {
    key: 'ip',
    label: 'งานทรัพย์สินทางปัญญา',
    shortLabel: 'ทรัพย์สินฯ',
    color: '#8B5CF6',       // Lavender Violet
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    textColor: '#6D28D9',
    glowClass: 'shadow-purple-500/10 hover:shadow-purple-500/20',
    gradientBg: 'from-purple-50/80 via-white to-white',
    card: {
      surface: '#F5F3FF',
      border: '#DDD6FE',
      header: '#6D28D9',
      iconBg: '#EDE9FE',
      icon: '#7C3AED',
      subtext: '#5B21B6',
      glow: 'rgba(139, 92, 246, 0.08)',
    },
  },
  monitoring: {
    key: 'monitoring',
    label: 'การติดตามงวดงานและกำหนดการ',
    shortLabel: 'ติดตามงวดงาน',
    color: '#6366F1',       // Indigo Slate
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    textColor: '#4338CA',
    glowClass: 'shadow-indigo-500/10 hover:shadow-indigo-500/20',
    gradientBg: 'from-indigo-50/80 via-white to-white',
    card: {
      surface: '#EEF2FF',
      border: '#C7D2FE',
      header: '#4338CA',
      iconBg: '#E0E7FF',
      icon: '#6366F1',
      subtext: '#3730A3',
      glow: 'rgba(99, 102, 241, 0.08)',
    },
  },
} as const;

export type MissionKey = keyof typeof MISSION_THEMES;

/**
 * ยุทธศาสตร์ มก. (ISEE 4 Pillars)
 */
export const ISEE_PILLARS = [
  { id: 'I', code: 'ISEE_I', name: 'Internationalization (นานาชาติ)', color: '#F43F5E', bg: '#FFF1F2' },
  { id: 'S', code: 'ISEE_S', name: 'Social Responsibility (สังคมและความยั่งยืน)', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'E1', code: 'ISEE_E1', name: 'Excellence (ความเป็นเลิศทางวิชาการและวิจัย)', color: '#10B981', bg: '#ECFDF5' },
  { id: 'E2', code: 'ISEE_E2', name: 'Entrepreneurship & Digital (ผู้ประกอบการและดิจิทัล)', color: '#0EA5E9', bg: '#F0F9FF' },
] as const;

/**
 * ค่านิยมองค์กร (IAM Core Values)
 */
export const IAM_VALUES = [
  { id: 'I', code: 'IAM_I', name: 'I - Integrity (ความถูกต้องและโปร่งใส)', color: '#059669', bg: '#ECFDF5' },
  { id: 'A', code: 'IAM_A', name: 'A - Agility (ความคล่องตัวและรวดเร็ว)', color: '#0284C7', bg: '#F0F9FF' },
  { id: 'M', code: 'IAM_M', name: 'M - Mastery (ความเป็นมืออาชีพและความเชี่ยวชาญ)', color: '#7C3AED', bg: '#F5F3FF' },
] as const;

/**
 * ฟังก์ชันกู้คืนความผิดปกติของเดือนในโครงการพัฒนาวิชาการ (197.36M Recovery)
 * Reference: docs/blueprints/02_academic_tab.md
 */
export function normalizeAcademicMonth(rawMonth: any): string {
  if (!rawMonth || rawMonth === 'nan' || rawMonth === '-' || rawMonth === 'NaT') {
    return 'ไม่ระบุ';
  }
  const str = String(rawMonth).trim();
  const lower = str.toLowerCase();

  const monthMap: Record<string, string> = {
    'ม.ค.': 'ม.ค.', 'มกราคม': 'ม.ค.', 'jan': 'ม.ค.', 'january': 'ม.ค.',
    'ก.พ.': 'ก.พ.', 'กุมภาพันธ์': 'ก.พ.', 'feb': 'ก.พ.', 'february': 'ก.พ.',
    'มี.ค.': 'มี.ค.', 'มีนาคม': 'มี.ค.', 'mar': 'มี.ค.', 'march': 'มี.ค.',
    'เม.ย.': 'เม.ย.', 'เมษายน': 'เม.ย.', 'apr': 'เม.ย.', 'april': 'เม.ย.',
    'พ.ค.': 'พ.ค.', 'พฤษภาคม': 'พ.ค.', 'may': 'พ.ค.',
    'มิ.ย.': 'มิ.ย.', 'มิถุนายน': 'มิ.ย.', 'jun': 'มิ.ย.', 'june': 'มิ.ย.',
    'ก.ค.': 'ก.ค.', 'กรกฎาคม': 'ก.ค.', 'jul': 'ก.ค.', 'july': 'ก.ค.',
    'ส.ค.': 'ส.ค.', 'สิงหาคม': 'ส.ค.', 'aug': 'ส.ค.', 'august': 'ส.ค.',
    'ก.ย.': 'ก.ย.', 'กันยายน': 'ก.ย.', 'sep': 'ก.ย.', 'september': 'ก.ย.',
    'ต.ค.': 'ต.ค.', 'ตุลาคม': 'ต.ค.', 'oct': 'ต.ค.', 'october': 'ต.ค.',
    'พ.ย.': 'พ.ย.', 'พฤศจิกายน': 'พ.ย.', 'nov': 'พ.ย.', 'november': 'ต.ค.',
    'ธ.ค.': 'ธ.ค.', 'ธันวาคม': 'ธ.ค.', 'dec': 'ธ.ค.', 'december': 'ธ.ค.',
  };

  for (const [key, val] of Object.entries(monthMap)) {
    if (lower.includes(key)) return val;
  }
  return 'ไม่ระบุ';
}

/**
 * ฟังก์ชันแก้ไข Date Anomaly ในงานบริการวิชาการ (แปลงปี 1968 เป็น 2568)
 * Reference: docs/blueprints/04_services_tab.md
 */
export function parseServiceFiscalYear(rawDate: any): string {
  if (!rawDate) return '2568';
  const str = String(rawDate).trim();
  if (str.startsWith('1968') || str.startsWith('2025') || str.startsWith('2568')) return '2568';
  if (str.startsWith('1969') || str.startsWith('2026') || str.startsWith('2569')) return '2569';
  if (str.startsWith('1970') || str.startsWith('2027') || str.startsWith('2570')) return '2570';
  if (str.startsWith('2567') || str.startsWith('2024') || str.startsWith('1967')) return '2567';
  return '2568';
}

/**
 * ฟังก์ชันสกัดบทบาทงานบริการวิชาการจากชื่อเรื่อง (Smart Keyword Extraction)
 * Reference: docs/blueprints/04_services_tab.md
 */
export function categorizeServiceActivity(name?: string, topic?: string, target?: string): string {
  const text = `${name || ''} ${topic || ''} ${target || ''}`.toLowerCase();

  if (text.includes('คณะกรรมการ') || text.includes('อนุกรรมการ') || text.includes('คณะทำงาน') || text.includes('ประชุมกรรมการ')) {
    return 'คณะกรรมการ/อนุกรรมการ/คณะทำงาน';
  }
  if (text.includes('ผู้ทรงคุณวุฒิ') || text.includes('ประเมิน') || text.includes('พิจารณา') || text.includes('กลั่นกรอง') || text.includes('ตรวจอ่าน')) {
    return 'ผู้ทรงคุณวุฒิ/ประเมินผลงาน';
  }
  if (text.includes('วิทยากร') || text.includes('บรรยาย') || text.includes('keynote') || text.includes('อาจารย์พิเศษ') || text.includes('สอน')) {
    return 'วิทยากร/บรรยายพิเศษ';
  }
  if (text.includes('วิทยานิพนธ์') || text.includes('ดุษฎีนิพนธ์') || text.includes('สอบโครงร่าง')) {
    return 'กรรมการสอบวิทยานิพนธ์ภายนอก';
  }
  if (text.includes('ที่ปรึกษา') || text.includes('ตรวจสอบ') || text.includes('ทดสอบ') || text.includes('ตรวจวัด') || text.includes('วิเคราะห์')) {
    return 'ที่ปรึกษา/บริการวิชาชีพ/ตรวจวัด';
  }
  if (text.includes('ศึกษาดูงาน') || text.includes('ต้อนรับ') || text.includes('เยี่ยมชม')) {
    return 'ศึกษาดูงาน/ต้อนรับ';
  }
  return 'งานบริการวิชาการอื่นๆ';
}

/**
 * ฟังก์ชันจัดกลุ่มสถานะ Pipeline ทรัพย์สินทางปัญญา (IP 3 Stages)
 * Reference: docs/blueprints/05_ip_tab.md
 */
export type IPPipelineStage = 'granted' | 'pending' | 'in_prep';

export function getIPPipelineStage(item: any): IPPipelineStage {
  const status = String(item.status || '').trim();
  const regNo = String(item.registration_number || '').trim();
  const reqNo = String(item.application_number || '').trim();

  if (status.includes('คุ้มครอง') || (regNo && regNo !== '-' && regNo !== 'nan')) {
    return 'granted';
  }
  if (status.includes('ยื่นคำขอ') || (reqNo && reqNo !== '-' && reqNo !== 'nan')) {
    return 'pending';
  }
  return 'in_prep';
}

/**
 * ฟังก์ชันสกัดคลัสเตอร์เทคโนโลยีสิ่งประดิษฐ์ (Technology Clustering)
 * Reference: docs/blueprints/05_ip_tab.md
 */
export function getIPTechnologyCluster(title: string): string {
  const t = (title || '').toLowerCase();
  if (t.includes('อาหาร') || t.includes('เพกทิน') || t.includes('สกัด') || t.includes('เปลือกส้มโอ') || t.includes('แป้ง')) {
    return 'การแปรรูปอาหารและสารสกัดชีวภาพ';
  }
  if (t.includes('เครื่องทดสอบ') || t.includes('วัดมุมกอง') || t.includes('แขนกล') || t.includes('สัมประสิทธิ์') || t.includes('เครื่องตัด')) {
    return 'เครื่องจักรกลและอุปกรณ์ทดสอบ';
  }
  if (t.includes('ไฟฟ้า') || t.includes('ช็อต') || t.includes('ควบคุม') || t.includes('เซนเซอร์') || t.includes('อัตโนมัติ')) {
    return 'อุปกรณ์ไฟฟ้าและสมาร์ทฟาร์ม';
  }
  if (t.includes('แผ่นแปะ') || t.includes('ริดสีดวง') || t.includes('สุขภาพ') || t.includes('สมุนไพร')) {
    return 'นวัตกรรมการแพทย์และสุขภาพ';
  }
  return 'นวัตกรรมวิศวกรรมอื่นๆ';
}

/**
 * ฟังก์ชันตรวจสอบความสอดคล้องกับตัวกรองยุทธศาสตร์ (Strategic Filter Matching)
 * รองรับทั้ง:
 * - SDGs: 'SDG_1' ถึง 'SDG_17' (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
 * - ISEE: 'ISEE_I', 'ISEE_S', 'ISEE_E1', 'ISEE_E2'
 * - IAM: 'IAM_I', 'IAM_A', 'IAM_M'
 */
export function itemMatchesStrategicFilter(item: any, strategicFilter: string): boolean {
  if (!strategicFilter || strategicFilter === 'all') return true;

  const filter = strategicFilter.trim().toUpperCase();

  // 1. SDGs Filter
  if (filter.startsWith('SDG_')) {
    const sdgNum = parseInt(filter.replace('SDG_', ''), 10);
    if (isNaN(sdgNum)) return true;

    // Check direct fields
    if (Number(item.sdg_code) === sdgNum) return true;
    if (Array.isArray(item.sdg_ids) && item.sdg_ids.map(Number).includes(sdgNum)) return true;
    if (Array.isArray(item.evaluation?.sdg_ids) && item.evaluation.sdg_ids.map(Number).includes(sdgNum)) return true;
    if (item.sdg && (Number(item.sdg) === sdgNum || String(item.sdg).includes(String(sdgNum)))) return true;

    // Fallback: Detect from text
    const text = `${item.name || ''} ${item.title || ''} ${item.topic_title || ''} ${item.department || ''}`;
    if (sdgNum === 2 && (text.includes('เกษตร') || text.includes('อาหาร') || text.includes('ข้าว') || text.includes('ฟาร์ม'))) return true;
    if (sdgNum === 3 && (text.includes('สุขภาพ') || text.includes('แพทย์') || text.includes('สมุนไพร') || text.includes('บำบัด'))) return true;
    if (sdgNum === 4 && (text.includes('เรียน') || text.includes('ฝึกอบรม') || text.includes('หลักสูตร') || text.includes('การศึกษา') || text.includes('อบรม'))) return true;
    if (sdgNum === 6 && (text.includes('น้ำ') || text.includes('ชลประทาน') || text.includes('สุขาภิบาล') || text.includes('บำบัดน้ำ'))) return true;
    if (sdgNum === 7 && (text.includes('พลังงาน') || text.includes('แสงอาทิตย์') || text.includes('โซลาร์') || text.includes('ชีวมวล'))) return true;
    if (sdgNum === 8 && (text.includes('เศรษฐกิจ') || text.includes('จ้างงาน') || text.includes('อุตสาหกรรม') || text.includes('รายได้'))) return true;
    if (sdgNum === 9 && (text.includes('นวัตกรรม') || text.includes('โครงสร้าง') || text.includes('เครื่องจักร') || text.includes('ประดิษฐ์'))) return true;
    if (sdgNum === 11 && (text.includes('เมือง') || text.includes('ชุมชน') || text.includes('จราจร') || text.includes('สิ่งแวดล้อม'))) return true;
    if (sdgNum === 12 && (text.includes('หมุนเวียน') || text.includes('ของเสีย') || text.includes('ขยะ') || text.includes('ชีวภาพ'))) return true;
    if (sdgNum === 13 && (text.includes('สภาพอากาศ') || text.includes('โลกร้อน') || text.includes('คาร์บอน') || text.includes('ก๊าซเรือนกระจก'))) return true;

    return false;
  }

  // 2. ISEE 4 Pillars
  if (filter.startsWith('ISEE_')) {
    const pillarKey = filter.replace('ISEE_', ''); // I, S, E1, E2
    const iType = String(item.i_type || item.evaluation?.i_type || '').toUpperCase();
    const iseePillar = String(item.isee_pillar || '').toUpperCase();

    if (iseePillar === pillarKey || iseePillar.includes(pillarKey)) return true;
    if (iType.includes(pillarKey) || iType.includes('ISEE') || iType.includes('I_SEE')) return true;

    const text = `${item.name || ''} ${item.title || ''} ${item.department || ''} ${item.level || ''}`.toLowerCase();
    if (pillarKey === 'I' && (text.includes('นานาชาติ') || text.includes('foreign') || text.includes('international') || text.includes('ต่างประเทศ'))) return true;
    if (pillarKey === 'S' && (text.includes('ยั่งยืน') || text.includes('สิ่งแวดล้อม') || text.includes('ชุมชน') || text.includes('สังคม') || text.includes('น้ำ') || text.includes('พลังงาน'))) return true;
    if (pillarKey === 'E1' && (text.includes('วิชาการ') || text.includes('วิจัย') || text.includes('ตีพิมพ์') || text.includes('scopus') || text.includes('บทความ'))) return true;
    if (pillarKey === 'E2' && (text.includes('ผู้ประกอบการ') || text.includes('ดิจิทัล') || text.includes('นวัตกรรม') || text.includes('คอมพิวเตอร์') || text.includes('สิทธิบัตร') || text.includes('ทรัพย์สินทางปัญญา'))) return true;

    return false;
  }

  // 3. IAM Values
  if (filter.startsWith('IAM_')) {
    const valKey = filter.replace('IAM_', ''); // I, A, M
    const iamVal = String(item.iam_value || '').toUpperCase();
    if (iamVal === valKey || iamVal.includes(valKey)) return true;

    const text = `${item.name || ''} ${item.title || ''} ${item.target_group || ''} ${item.department || ''}`.toLowerCase();
    if (valKey === 'I' && (text.includes('มาตรฐาน') || text.includes('รับรอง') || text.includes('ตรวจสอบ') || text.includes('โปร่งใส') || text.includes('คุณวุฒิ'))) return true;
    if (valKey === 'A' && (text.includes('รวดเร็ว') || text.includes('คล่องตัว') || text.includes('พัฒนาระบบ') || text.includes('ดิจิทัล') || text.includes('เร่งด่วน'))) return true;
    if (valKey === 'M' && (text.includes('เชี่ยวชาญ') || text.includes('ที่ปรึกษา') || text.includes('ชำนาญ') || text.includes('ถ่ายทอด') || text.includes('วิทยากร'))) return true;

    return false;
  }

  return true;
}

/**
 * ฟังก์ชันคำนวณและ Auto-Mapping ยุทธศาสตร์ (ISEE, IAM, SDGs) อัตโนมัติสำหรับทุกรายการข้อมูล
 */
export interface StrategicAlignmentResult {
  isee: 'I' | 'S' | 'E1' | 'E2';
  iseeLabel: string;
  iseeColor: string;
  iam: 'I' | 'A' | 'M';
  iamLabel: string;
  iamColor: string;
  sdgNumber: number;
  sdgCode: string;
  sdgNameTh: string;
  isVerified: boolean;
  statusLabel: 'Verified' | 'Auto-Detected';
  sdgIds: number[];
}

export function resolveItemStrategicAlignment(item: any, category?: string): StrategicAlignmentResult {
  if (!item) {
    return {
      isee: 'E1',
      iseeLabel: 'E - ความเป็นเลิศทางวิจัย',
      iseeColor: '#10B981',
      iam: 'M',
      iamLabel: 'M - ความเป็นมืออาชีพ',
      iamColor: '#7C3AED',
      sdgNumber: 9,
      sdgCode: 'SDG 9',
      sdgNameTh: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน',
      isVerified: false,
      statusLabel: 'Auto-Detected',
      sdgIds: [9],
    };
  }

  // 1. Resolve SDG (1 - 17) via Single-Source-of-Truth Hybrid Engine
  const hybrid = resolveHybridSDG(item, category);
  const sdgNum = hybrid.primarySdg;
  const sdgName = SDGS_DATA[sdgNum]?.nameTh || 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน';

  const text = `${item.name || ''} ${item.title || ''} ${item.topic_title || ''} ${item.department || ''} ${item.fund_source || ''} ${item.client || ''} ${item.target_group || ''} ${item.level || ''} ${item.journal || ''}`.toLowerCase();

  // 2. Resolve ISEE (I, S, E1, E2)
  let isee: 'I' | 'S' | 'E1' | 'E2' = 'E1';
  let iseeLabel = 'E - ความเป็นเลิศทางวิจัย';
  let iseeColor = '#10B981';

  const directIsee = String(item.isee || item.isee_pillar || item.evaluation?.isee_pillar || '').toUpperCase();
  if (directIsee.includes('E2') || directIsee === 'E2') {
    isee = 'E2';
  } else if (directIsee.includes('E1') || directIsee === 'E1') {
    isee = 'E1';
  } else if (directIsee.includes('I') || directIsee === 'I') {
    isee = 'I';
  } else if (directIsee.includes('S') || directIsee === 'S') {
    isee = 'S';
  } else {
    const isQ1Q2 = text.includes('q1') || text.includes('q2') || String(item.journal_tier || '').toUpperCase().includes('Q1') || String(item.journal_tier || '').toUpperCase().includes('Q2');
    const isInter = text.includes('นานาชาติ') || text.includes('foreign') || text.includes('international') || text.includes('inter') || text.includes('สากล');
    const isSocial = text.includes('ชุมชน') || text.includes('สังคม') || text.includes('น้ำ') || text.includes('ชลประทาน') || text.includes('ภัยแล้ง') || text.includes('น้ำท่วม') || text.includes('เกษตร') || text.includes('สิ่งแวดล้อม') || text.includes('ชาวบ้าน') || text.includes('มิตรผล') || text.includes('สวก') || [2, 6, 11, 13, 14, 15].includes(sdgNum);
    const isDigitalEnt = text.includes('ดิจิทัล') || text.includes('ai') || text.includes('หุ่นยนต์') || text.includes('ซอฟต์แวร์') || text.includes('เซนเซอร์') || text.includes('สมาร์ท') || text.includes('ผู้ประกอบการ') || text.includes('ธุรกิจ') || text.includes('บพข') || text.includes('ทรัพย์สินทางปัญญา') || text.includes('สิทธิบัตร') || category === 'academic' || category === 'ip';

    if (isInter || (category === 'publications' && isQ1Q2)) {
      isee = 'I';
    } else if (isDigitalEnt && !isSocial) {
      isee = 'E2';
    } else if (isSocial) {
      isee = 'S';
    } else {
      isee = 'E1';
    }
  }

  if (isee === 'I') {
    iseeLabel = 'I - ความเป็นนานาชาติ';
    iseeColor = '#F43F5E';
  } else if (isee === 'S') {
    iseeLabel = 'S - รับใช้สังคมและความยั่งยืน';
    iseeColor = '#F59E0B';
  } else if (isee === 'E2') {
    iseeLabel = 'E - ผู้ประกอบการและดิจิทัล';
    iseeColor = '#0EA5E9';
  } else {
    iseeLabel = 'E - ความเป็นเลิศทางวิจัย';
    iseeColor = '#10B981';
  }

  // 3. Resolve IAM (I, A, M)
  let iam: 'I' | 'A' | 'M' = 'M';
  let iamLabel = 'M - ความเป็นมืออาชีพ';
  let iamColor = '#7C3AED';

  const directIam = String(item.iam || item.iam_value || item.evaluation?.i_type || '').toUpperCase();
  if (directIam.includes('I') && !directIam.includes('IAM')) {
    iam = 'I';
  } else if (directIam.includes('A')) {
    iam = 'A';
  } else if (directIam.includes('M')) {
    iam = 'M';
  } else {
    const isIntegrity = text.includes('มาตรฐาน') || text.includes('รับรอง') || text.includes('ทดสอบ') || text.includes('จริยธรรม') || text.includes('คุ้มครอง') || text.includes('ประเมิน') || category === 'ip';
    const isAgility = text.includes('บริการ') || text.includes('อบรม') || text.includes('วิทยากร') || text.includes('ให้คำปรึกษา') || text.includes('คล่องตัว') || category === 'service';

    if (isIntegrity) {
      iam = 'I';
    } else if (isAgility) {
      iam = 'A';
    } else {
      iam = 'M';
    }
  }

  if (iam === 'I') {
    iamLabel = 'I - ความถูกต้องและจริยธรรม';
    iamColor = '#059669';
  } else if (iam === 'A') {
    iamLabel = 'A - ความคล่องตัวและการบริการ';
    iamColor = '#0284C7';
  } else {
    iamLabel = 'M - ความเป็นมืออาชีพ';
    iamColor = '#7C3AED';
  }

  return {
    isee,
    iseeLabel,
    iseeColor,
    iam,
    iamLabel,
    iamColor,
    sdgNumber: sdgNum,
    sdgCode: `SDG ${sdgNum}`,
    sdgNameTh: sdgName,
    isVerified: hybrid.isVerified,
    statusLabel: hybrid.statusLabel,
    sdgIds: hybrid.sdgIds,
  };
}

// ============================================================================
// CENTRALIZED PASTEL CHART PALETTE (WCAG 2.1 AA COMPLIANT)
// ============================================================================

export const CHART_PASTEL_PALETTE = {
  // 5 Core Mission Fills, Clean Borders & High-Contrast Datalabel Text
  missions: {
    research: {
      fill: '#86EFAC',       // Soft Mint Emerald (Tailwind emerald-300)
      border: '#22C55E',     // Clean Emerald Border (emerald-500)
      text: '#0F172A',       // Slate 900 Datalabel (12.71:1 contrast - PASS AAA)
      label: 'โครงการวิจัย',
    },
    academic: {
      fill: '#93C5FD',       // Soft Sky Blue (Tailwind sky-300)
      border: '#3B82F6',     // Clean Sky/Blue Border (blue-500)
      text: '#0F172A',       // Slate 900 Datalabel (9.90:1 contrast - PASS AAA)
      label: 'โครงการพัฒนาวิชาการ',
    },
    publications: {
      fill: '#FDA4AF',       // Soft Rose Coral (Tailwind rose-300)
      border: '#F43F5E',     // Clean Rose Border (rose-500)
      text: '#0F172A',       // Slate 900 Datalabel (9.44:1 contrast - PASS AAA)
      label: 'ผลงานตีพิมพ์ทางวิชาการ',
    },
    service: {
      fill: '#FDE68A',       // Soft Amber Peach (Tailwind amber-300)
      border: '#F59E0B',     // Clean Amber Border (amber-500)
      text: '#0F172A',       // Slate 900 Datalabel (14.33:1 contrast - PASS AAA)
      label: 'งานบริการวิชาการ',
    },
    ip: {
      fill: '#DDD6FE',       // Soft Lavender Violet (Tailwind violet-300)
      border: '#8B5CF6',     // Clean Violet Border (violet-500)
      text: '#0F172A',       // Slate 900 Datalabel (12.86:1 contrast - PASS AAA)
      label: 'งานทรัพย์สินทางปัญญา',
    },
  },

  // 8 High-Contrast Qualitative Pastel Fills for Multi-Series Charts
  series: [
    '#93C5FD', // 1. Soft Blue    (CR vs #0F172A:  9.90:1)
    '#86EFAC', // 2. Soft Emerald (CR vs #0F172A: 12.71:1)
    '#FDE68A', // 3. Soft Amber   (CR vs #0F172A: 14.33:1)
    '#DDD6FE', // 4. Soft Purple  (CR vs #0F172A: 12.86:1)
    '#FDA4AF', // 5. Soft Rose    (CR vs #0F172A:  9.44:1)
    '#99F6E4', // 6. Soft Teal    (CR vs #0F172A: 14.16:1)
    '#FED7AA', // 7. Soft Orange  (CR vs #0F172A: 13.19:1)
    '#C7D2FE', // 8. Soft Indigo  (CR vs #0F172A: 11.97:1)
  ] as const,

  // Matching Clean 1.5px Borders for Qualitative Series
  seriesBorders: [
    '#3B82F6', // Blue
    '#22C55E', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#F43F5E', // Rose
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#6366F1', // Indigo
  ] as const,

  // Accessible Datalabel & Layout Defaults
  datalabels: {
    dark: '#0F172A',   // Universal dark datalabel (Slate 900) - WCAG AAA
    light: '#FFFFFF',  // Used only on saturated dark badges
    fontSize: 13,
    fontWeight: 'bold' as const,
    fontFamily: "'Kanit', sans-serif",
  },
  datalabelDark: '#0F172A',

  // Canvas Geometry & Grid
  gridLines: 'rgba(226, 232, 240, 0.6)', // slate-200 / 60%
  borderWidth: 1.5,
  borderRadius: 6,
} as const;

/**
 * Returns pastel color by index with optional alpha transparency.
 */
export function getPastelColor(index: number, alpha?: number): string {
  const hex = CHART_PASTEL_PALETTE.series[Math.abs(index) % CHART_PASTEL_PALETTE.series.length];
  if (alpha !== undefined && alpha >= 0 && alpha < 1) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
}

/**
 * Returns matching clean border color for a series index.
 */
export function getPastelBorder(index: number): string {
  return CHART_PASTEL_PALETTE.seriesBorders[Math.abs(index) % CHART_PASTEL_PALETTE.seriesBorders.length];
}

/**
 * Returns mission chart fill, border, and text tokens.
 */
export function getMissionChartColor(mission: string): { fill: string; border: string; text: string; label: string } {
  const key = mission.toLowerCase() as keyof typeof CHART_PASTEL_PALETTE.missions;
  return CHART_PASTEL_PALETTE.missions[key] || CHART_PASTEL_PALETTE.missions.research;
}

/**
 * Helper to build standard accessible datalabel configuration for Chart.js.
 */
export function getPastelDatalabelsConfig(overrides?: Record<string, any>) {
  return {
    color: CHART_PASTEL_PALETTE.datalabels.dark,
    font: {
      family: CHART_PASTEL_PALETTE.datalabels.fontFamily,
      size: CHART_PASTEL_PALETTE.datalabels.fontSize,
      weight: CHART_PASTEL_PALETTE.datalabels.fontWeight,
    },
    ...overrides,
  };
}
