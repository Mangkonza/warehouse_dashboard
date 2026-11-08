import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { proxy } from '@/proxy';

describe('GET /api/health', () => {
  it('returns 200 { status: "ok" } with Cache-Control: no-store', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toContain('no-store');
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });

  it('is reachable through proxy without requiring any session', async () => {
    const req = new NextRequest('http://localhost:3000/api/health');
    const res = await proxy(req);
    // Proxy bypasses and does not redirect to login
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});
