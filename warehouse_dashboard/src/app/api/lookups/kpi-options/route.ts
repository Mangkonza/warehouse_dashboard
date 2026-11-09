import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.BACKEND_URL || 'http://ku_warehouse_backend:8000';

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
  const { search } = new URL(request.url);
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/kpi/options${search}`, {
      method: 'GET',
      headers: getForwardHeaders(request),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch (err) {
    console.warn('[kpi-options GET] Backend error:', err);
  }
  return NextResponse.json({ status: 'success', total: 0, data: [] });
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

    const res = await fetch(`${BACKEND_URL}/api/v1/kpi/options`, {
      method: 'POST',
      headers: getForwardHeaders(request),
      body: JSON.stringify({ fieldKey, value: cleanVal, label: cleanLabel }),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 201 });
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
      { status: 'error', message: error?.message || 'Failed to save option' },
      { status: 500 }
    );
  }
}
