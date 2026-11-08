import { NextResponse } from 'next/server';

export const NO_STORE_CACHE_CONTROL = 'no-store';

/**
 * Attaches Cache-Control: no-store to any response.
 */
export function withNoStore<T extends Response>(response: T): T {
  response.headers.set('Cache-Control', NO_STORE_CACHE_CONTROL);
  return response;
}

/**
 * Creates a JSON response with Cache-Control: no-store.
 */
export function jsonNoStore(body: unknown, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(body, init);
  res.headers.set('Cache-Control', NO_STORE_CACHE_CONTROL);
  return res;
}

/**
 * Creates a redirect response with Cache-Control: no-store.
 */
export function redirectNoStore(url: string | URL, status: number = 307): NextResponse {
  const res = NextResponse.redirect(url, status);
  res.headers.set('Cache-Control', NO_STORE_CACHE_CONTROL);
  return res;
}
