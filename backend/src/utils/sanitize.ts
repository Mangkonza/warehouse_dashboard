/**
 * Helper functions to safely sanitize input values from frontend forms
 */

export function parseSafeDate(val: any): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const s = String(val).trim();
  if (!s || s === 'nan' || s === 'NaT' || s === 'undefined' || s === 'null' || s === '-') return null;

  // Handle Buddhist Era (BE) e.g. 2567-05-12 or 2567/05/12
  // If year > 2400, convert to CE (Common Era / AD)
  let dateStr = s;
  const beMatch = s.match(/^(\d{4})([-/].*)$/);
  if (beMatch && parseInt(beMatch[1], 10) > 2400) {
    const ceYear = parseInt(beMatch[1], 10) - 543;
    dateStr = `${ceYear}${beMatch[2]}`;
  }

  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function parseSafeNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const clean = String(val).replace(/,/g, '').trim();
  const n = parseFloat(clean);
  return isNaN(n) ? fallback : n;
}

export function parseSafeInt(val: any, fallback: number | null = null): number | null {
  if (val === null || val === undefined || val === '') return fallback;
  const clean = String(val).replace(/,/g, '').trim();
  const n = parseInt(clean, 10);
  return isNaN(n) ? fallback : n;
}

export function extractNumericId(val: any): number | null {
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (!val) return null;
  const s = String(val).trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  const match = s.match(/^(?:res|acad|pub|srv|ip)_(\d+)$/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

import { prisma } from '../db/prisma.js';

export async function resolveDepartmentCode(deptInput?: string | null): Promise<string | null> {
  if (!deptInput) return null;
  const clean = String(deptInput).trim();
  if (!clean) return null;

  const exact = await prisma.department.findUnique({ where: { code: clean } });
  if (exact) return exact.code;

  const norm = clean.replace('ภาควิชา', '').trim();
  const matched = await prisma.department.findFirst({
    where: {
      OR: [
        { nameTh: { contains: norm, mode: 'insensitive' } },
        { code: { equals: clean, mode: 'insensitive' } },
      ],
    },
  });
  return matched ? matched.code : null;
}
