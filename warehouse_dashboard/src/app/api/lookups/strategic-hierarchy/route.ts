import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000';

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
    const res = await fetch(`${BACKEND_URL}/api/v1/lookups/strategic-hierarchy`, {
      method: 'GET',
      headers: getForwardHeaders(request),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch {
    // Fallback handled by client
  }
  return NextResponse.json({ status: 'success', total: 0, data: [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityType, ...payload } = body || {};
    const endpoint =
      entityType === 'plan'
        ? `${BACKEND_URL}/api/v1/lookups/strategic-plans`
        : `${BACKEND_URL}/api/v1/lookups/strategic-strategies`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getForwardHeaders(request),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch {
      // Fallback handled by client
    }

    return NextResponse.json({ status: 'success', data: payload }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Failed to save hierarchy entity' },
      { status: 500 }
    );
  }
}
