import type React from 'react';
import { MISSION_THEMES, normalizeAcademicMonth, type MissionKey } from '@/lib/pastelTheme';

/** Fiscal-year month labels, October first. */
export const FISCAL_MONTHS = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
const CALENDAR_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

/** Calendar month 0..11 from a raw date (or Thai month name), -1 when unknown. */
function calendarMonthIndex(rawDate: unknown, rawMonthName?: unknown): number {
  if (rawMonthName) {
    const idx = CALENDAR_MONTHS.indexOf(normalizeAcademicMonth(rawMonthName));
    if (idx >= 0) return idx;
  }
  if (!rawDate) return -1;
  const str = String(rawDate).trim();
  // Source data stores some Buddhist-era years as 1968/1969 or 2568/2569.
  const d = new Date(str.replace('1968', '2025').replace('1969', '2026').replace('2568', '2025').replace('2569', '2026'));
  if (!isNaN(d.getTime())) return d.getMonth();
  for (let i = 0; i < CALENDAR_MONTHS.length; i++) {
    if (str.includes(CALENDAR_MONTHS[i]) || str.includes(CALENDAR_MONTHS[i].replace('.', ''))) return i;
  }
  return -1;
}

/** Fiscal month 0..11 (0 = ต.ค.), -1 when unknown. */
export function fiscalMonthIndex(rawDate: unknown, rawMonthName?: unknown): number {
  const m = calendarMonthIndex(rawDate, rawMonthName);
  return m < 0 ? -1 : (m + 3) % 12;
}

export function monthlyCounts(items: any[], pick: (item: any) => [unknown, unknown?]): number[] {
  const out = Array(12).fill(0);
  items.forEach((it) => {
    const [d, m] = pick(it);
    const idx = fiscalMonthIndex(d, m);
    if (idx >= 0) out[idx]++;
  });
  return out;
}

export function researchBudget(r: any): number {
  return (Number(r.budget_external) || 0) + (Number(r.budget_internal) || 0) || Number(r.budget) || 0;
}

/** Compact Thai money label: "12.4 ล้าน", "850 พัน". */
export function formatMoney(value: number): { num: string; unit: string } {
  if (value >= 1_000_000) return { num: (value / 1_000_000).toFixed(value >= 100_000_000 ? 0 : 1), unit: 'ล้านบาท' };
  if (value >= 1_000) return { num: Math.round(value / 1_000).toLocaleString('th-TH'), unit: 'พันบาท' };
  return { num: Math.round(value).toLocaleString('th-TH'), unit: 'บาท' };
}

export function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Pastel card tokens for one mission, shared with the mission tab KPI cards. */
export function missionCardTheme(mission: string) {
  const theme = MISSION_THEMES[mission as MissionKey];
  return (theme ?? MISSION_THEMES.research).card;
}

export const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '20px',
  padding: '20px',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  minWidth: 0,
};

export const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '15px',
  fontWeight: 700,
  color: '#0f172a',
};

export const SDG_COLORS: Record<number, string> = {
  1: '#e5243b', 2: '#dda73a', 3: '#4c9f38', 4: '#c5192d', 5: '#ff3a21', 6: '#26bde2',
  7: '#fcc30b', 8: '#a21942', 9: '#fd6925', 10: '#dd1367', 11: '#fd9d24', 12: '#bf8b2e',
  13: '#3f7e44', 14: '#0a97d9', 15: '#56c02b', 16: '#00689d', 17: '#19486a',
};

export const SDG_SHORT_NAMES: Record<number, string> = {
  1: 'ขจัดความยากจน', 2: 'เกษตร/อาหาร', 3: 'สุขภาพ', 4: 'การศึกษา', 5: 'ความเท่าเทียม',
  6: 'น้ำสะอาด', 7: 'พลังงานสะอาด', 8: 'เศรษฐกิจ', 9: 'นวัตกรรม', 10: 'ลดเหลื่อมล้ำ',
  11: 'เมืองยั่งยืน', 12: 'ผลิต-บริโภค', 13: 'ภูมิอากาศ', 14: 'ทะเล', 15: 'ระบบนิเวศ',
  16: 'สันติภาพ', 17: 'ความร่วมมือ',
};
