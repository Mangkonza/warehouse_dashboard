import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000';

const DEFAULT_OPTIONS: Record<string, { value: string; label: string; isCustom: boolean }[]> = {
  collection_period: [
    { value: 'ปีงบประมาณ', label: 'ปีงบประมาณ', isCustom: false },
    { value: 'ปีการศึกษา', label: 'ปีการศึกษา', isCustom: false },
    { value: 'ปีปฏิทิน', label: 'ปีปฏิทิน', isCustom: false },
    { value: 'ภาคการศึกษา', label: 'ภาคการศึกษา', isCustom: false },
    { value: 'ไตรมาส', label: 'ไตรมาส', isCustom: false },
  ],
  value_type: [
    { value: 'จำนวนนับ', label: 'จำนวนนับ', isCustom: false },
    { value: 'ร้อยละ', label: 'ร้อยละ', isCustom: false },
    { value: 'ค่าเฉลี่ย', label: 'ค่าเฉลี่ย', isCustom: false },
    { value: 'สัดส่วน A:B', label: 'สัดส่วน A:B', isCustom: false },
    { value: 'จำนวนเงิน', label: 'จำนวนเงิน', isCustom: false },
    { value: 'คะแนน', label: 'คะแนน', isCustom: false },
    { value: 'ข้อความ/ระดับ', label: 'ข้อความ/ระดับ', isCustom: false },
  ],
  reporting_level: [
    { value: 'คณะ', label: 'คณะ', isCustom: false },
    { value: 'ส่วนงาน', label: 'ส่วนงาน', isCustom: false },
  ],
};

// In-memory server store as fallback when backend is unreachable
const memoryCustomStore: Record<string, { value: string; label: string; isCustom: boolean }[]> = {
  collection_period: [],
  value_type: [],
  reporting_level: [],
};

const getForwardHeaders = (request: NextRequest): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const auth = request.headers.get('authorization');
  if (auth) headers['authorization'] = auth;
  const cookie = request.headers.get('cookie');
  if (cookie) headers['cookie'] = cookie;
  return headers;
};

export async function GET(request: NextRequest) {
  const { search, searchParams } = new URL(request.url);
  const fieldKey = searchParams.get('fieldKey') || undefined;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/lookups/kpi-options${search}`, {
      method: 'GET',
      headers: getForwardHeaders(request),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch {
    // Fallback to in-memory + default options
  }

  const keys = fieldKey ? [fieldKey] : Object.keys(DEFAULT_OPTIONS);
  const combined = keys.flatMap((k) => {
    const defaults = (DEFAULT_OPTIONS[k] || []).map((o) => ({ ...o, fieldKey: k }));
    const customs = (memoryCustomStore[k] || []).map((o) => ({ ...o, fieldKey: k }));
    const seen = new Set(defaults.map((d) => d.value));
    return [...defaults, ...customs.filter((c) => !seen.has(c.value))];
  });

  return NextResponse.json({ status: 'success', total: combined.length, data: combined });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fieldKey, value, label } = body || {};
    if (!fieldKey || !value || !String(value).trim()) {
      return NextResponse.json(
        { status: 'error', message: 'กรุณาระบุค่าตัวเลือก' },
        { status: 400 }
      );
    }

    const cleanVal = String(value).trim();
    const cleanLabel = label ? String(label).trim() : cleanVal;

    // Store in memory fallback
    if (!memoryCustomStore[fieldKey]) {
      memoryCustomStore[fieldKey] = [];
    }
    if (!memoryCustomStore[fieldKey].some((o) => o.value === cleanVal)) {
      memoryCustomStore[fieldKey].push({
        value: cleanVal,
        label: cleanLabel,
        isCustom: true,
      });
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/lookups/kpi-options`, {
        method: 'POST',
        headers: getForwardHeaders(request),
        body: JSON.stringify({ fieldKey, value: cleanVal, label: cleanLabel }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch {
      // Fallback succeeded in memory
    }

    return NextResponse.json(
      {
        status: 'success',
        data: { fieldKey, value: cleanVal, label: cleanLabel, isCustom: true },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save lookup option' },
      { status: 500 }
    );
  }
}
