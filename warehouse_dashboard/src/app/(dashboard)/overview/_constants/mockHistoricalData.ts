/**
 * Mock Historical Data for Overview Strategic Perspectives
 * Verbatim values from original OverviewTab.tsx
 */

export const MOCK_YOY_FUNDING = {
  months: ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'],
  currentYear2568: [12.5, 24.8, 45.2, 62.0, 81.4, 95.8, 104.48, null, null, null, null, null] as (number | null)[],
  prevYear2567: [8.2, 18.5, 32.1, 44.5, 58.2, 69.4, 78.5, 84.2, 88.0, 91.5, 94.2, 96.0] as (number | null)[],
};

export const MOCK_PUB_QUARTILE_TRENDS = {
  labels: ['ปี 2566', 'ปี 2567', 'ปี 2568 (ปัจจุบัน)'],
  q1: [18, 24, 28] as number[],
  q2: [15, 20, 24] as number[],
  q3: [8, 12, 14] as number[],
  q4: [4, 6, 8] as number[],
  tci: [10, 15, 18] as number[],
};
