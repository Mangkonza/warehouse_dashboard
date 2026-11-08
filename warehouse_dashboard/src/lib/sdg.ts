/**
 * Centralized SDG definitions, metadata, colors, and contrast calculations.
 * Single source of truth for UN Sustainable Development Goals (SDG 1 - 17).
 */

export interface SdgDefinition {
  number: number;
  code: string;
  nameTh: string;
  nameEn: string;
  color: string;
  iconPath: string;
}

/**
 * Single source of truth for the 17 UN Sustainable Development Goals.
 * Thai names are sourced directly from existing code without deviation.
 * Colors are official United Nations SDG hex color tokens.
 */
export const SDG_DEFINITIONS: Record<number, SdgDefinition> = {
  1: {
    number: 1,
    code: 'SDG 1',
    nameTh: 'ขจัดความยากจน',
    nameEn: 'No Poverty',
    color: '#E5243B',
    iconPath: '/assets/SDGs/sdg-01.png',
  },
  2: {
    number: 2,
    code: 'SDG 2',
    nameTh: 'ขจัดความหิวโหย',
    nameEn: 'Zero Hunger',
    color: '#DDA63A',
    iconPath: '/assets/SDGs/sdg-02.png',
  },
  3: {
    number: 3,
    code: 'SDG 3',
    nameTh: 'สุขภาพและความเป็นอยู่ที่ดี',
    nameEn: 'Good Health and Well-being',
    color: '#4C9F38',
    iconPath: '/assets/SDGs/sdg-03.png',
  },
  4: {
    number: 4,
    code: 'SDG 4',
    nameTh: 'การศึกษาที่มีคุณภาพ',
    nameEn: 'Quality Education',
    color: '#C5192D',
    iconPath: '/assets/SDGs/sdg-04.png',
  },
  5: {
    number: 5,
    code: 'SDG 5',
    nameTh: 'ความเท่าเทียมทางเพศ',
    nameEn: 'Gender Equality',
    color: '#FF3A21',
    iconPath: '/assets/SDGs/sdg-05.png',
  },
  6: {
    number: 6,
    code: 'SDG 6',
    nameTh: 'น้ำสะอาดและสุขอนามัย',
    nameEn: 'Clean Water and Sanitation',
    color: '#26BDE2',
    iconPath: '/assets/SDGs/sdg-06.png',
  },
  7: {
    number: 7,
    code: 'SDG 7',
    nameTh: 'พลังงานสะอาดที่เข้าถึงได้',
    nameEn: 'Affordable and Clean Energy',
    color: '#FCC30B',
    iconPath: '/assets/SDGs/sdg-07.png',
  },
  8: {
    number: 8,
    code: 'SDG 8',
    nameTh: 'งานที่มีคุณค่าและการเติบโตทางเศรษฐกิจ',
    nameEn: 'Decent Work and Economic Growth',
    color: '#A21942',
    iconPath: '/assets/SDGs/sdg-08.png',
  },
  9: {
    number: 9,
    code: 'SDG 9',
    nameTh: 'อุตสาหกรรม นวัตกรรม และโครงสร้างพื้นฐาน',
    nameEn: 'Industry, Innovation and Infrastructure',
    color: '#FD6925',
    iconPath: '/assets/SDGs/sdg-09.png',
  },
  10: {
    number: 10,
    code: 'SDG 10',
    nameTh: 'ลดความเหลื่อมล้ำ',
    nameEn: 'Reduced Inequalities',
    color: '#DD1367',
    iconPath: '/assets/SDGs/sdg-10.png',
  },
  11: {
    number: 11,
    code: 'SDG 11',
    nameTh: 'เมืองและชุมชนที่ยั่งยืน',
    nameEn: 'Sustainable Cities and Communities',
    color: '#FD9D24',
    iconPath: '/assets/SDGs/sdg-11.png',
  },
  12: {
    number: 12,
    code: 'SDG 12',
    nameTh: 'การผลิตและการบริโภคที่ยั่งยืน',
    nameEn: 'Responsible Consumption and Production',
    color: '#BF8B2E',
    iconPath: '/assets/SDGs/sdg-12.png',
  },
  13: {
    number: 13,
    code: 'SDG 13',
    nameTh: 'การรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ',
    nameEn: 'Climate Action',
    color: '#3F7E44',
    iconPath: '/assets/SDGs/sdg-13.png',
  },
  14: {
    number: 14,
    code: 'SDG 14',
    nameTh: 'ทรัพยากรทางทะเล',
    nameEn: 'Life Below Water',
    color: '#0A97D9',
    iconPath: '/assets/SDGs/sdg-14.png',
  },
  15: {
    number: 15,
    code: 'SDG 15',
    nameTh: 'ระบบนิเวศบนบก',
    nameEn: 'Life on Land',
    color: '#56C02B',
    iconPath: '/assets/SDGs/sdg-15.png',
  },
  16: {
    number: 16,
    code: 'SDG 16',
    nameTh: 'สันติภาพและความยุติธรรม',
    nameEn: 'Peace, Justice and Strong Institutions',
    color: '#00689D',
    iconPath: '/assets/SDGs/sdg-16.png',
  },
  17: {
    number: 17,
    code: 'SDG 17',
    nameTh: 'ความร่วมมือเพื่อการพัฒนาที่ยั่งยืน',
    nameEn: 'Partnerships for the Goals',
    color: '#19486A',
    iconPath: '/assets/SDGs/sdg-17.png',
  },
};

export const SDG_LIST: SdgDefinition[] = Object.values(SDG_DEFINITIONS).sort(
  (a, b) => a.number - b.number
);

export const SDG_WHEEL_ICON_PATH = '/assets/SDGs/sdg-wheel.png';

/**
 * Calculates WCAG 2.1 relative luminance for a given hex color code.
 */
function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLin = toLinear(r);
  const gLin = toLinear(g);
  const bLin = toLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Determines text color (#ffffff vs #111111) for an SDG goal based on WCAG contrast ratio (>= 4.5:1).
 */
export function getSdgTextColor(n: number): string {
  const def = SDG_DEFINITIONS[n];
  if (!def) return '#ffffff';

  const lum = getRelativeLuminance(def.color);
  const contrastWhite = 1.05 / (lum + 0.05);

  // If contrast against white is >= 4.5:1, use white; otherwise dark charcoal #111111
  return contrastWhite >= 4.5 ? '#ffffff' : '#111111';
}

/**
 * Parse an SDG code or string (e.g. "SDG 12", 12, "12", "sdg-12") to an integer 1-17.
 */
export function parseSdgNumber(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    const intVal = Math.round(val);
    return intVal >= 1 && intVal <= 17 ? intVal : null;
  }
  const str = String(val).trim();
  if (!str) return null;

  // Match digit after "sdg" or standalone digits
  const match = str.match(/(?:sdg[_\s-]*)?(\d{1,2})/i);
  if (match) {
    const num = parseInt(match[1], 10);
    return num >= 1 && num <= 17 ? num : null;
  }
  return null;
}

/**
 * Format an SDG goal number into standard label (e.g. 1 -> "SDG 1").
 */
export function formatSdgLabel(goalNum: number | string): string {
  const parsed = parseSdgNumber(goalNum);
  return parsed ? `SDG ${parsed}` : String(goalNum);
}

/**
 * Retrieve full SDG metadata by number or string identifier.
 */
export function getSdgInfo(val: number | string): SdgDefinition | null {
  const num = parseSdgNumber(val);
  if (!num) return null;
  return SDG_DEFINITIONS[num] || null;
}
