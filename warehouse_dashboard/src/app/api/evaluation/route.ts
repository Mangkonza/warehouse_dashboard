import { saveEvaluation } from '@/lib/serverDataStore';
import { getBackendUrl } from '@/lib/backendUrl';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ดึง BACKEND_URL ผ่าน helper ส่วนกลาง (throw error ใน production หากไม่ได้กำหนด)
const getBackend = () => getBackendUrl();

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
    const { search } = new URL(request.url);
    const res = await fetch(`${getBackend()}/api/v1/evaluation${search}`, {
      method: 'GET',
      headers: getForwardHeaders(request),
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Backend connection failed' },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    try { saveEvaluation(body); } catch {}
    const res = await fetch(`${getBackend()}/api/v1/evaluation`, {
      method: 'POST',
      headers: getForwardHeaders(request),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error?.message || 'Backend connection failed' },
      { status: 502 }
    );
  }
}
