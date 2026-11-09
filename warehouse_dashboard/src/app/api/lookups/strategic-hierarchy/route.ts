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
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/kpi/hierarchy`, {
      method: 'GET',
      headers: getForwardHeaders(request),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch (err) {
    console.warn('[strategic-hierarchy GET] Backend error:', err);
  }
  return NextResponse.json({ status: 'success', total: 0, data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/v1/kpi/hierarchy`, {
      method: 'POST',
      headers: getForwardHeaders(request),
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 201 });
    }
    return NextResponse.json({ status: 'success', data: body }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save hierarchy entity' },
      { status: 500 }
    );
  }
}
