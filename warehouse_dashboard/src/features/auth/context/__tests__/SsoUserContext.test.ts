import { describe, expect, it } from 'vitest';
import { stripAuthParams } from '../SsoUserContext';

describe('stripAuthParams (defensive query token cleanup)', () => {
  it('removes exchangeToken, intranetToken, and accessToken from full URLs and relative paths', () => {
    const fullUrl = 'https://example.test/admin?exchangeToken=EX_123&intranetToken=IN_456&accessToken=AC_789';
    expect(stripAuthParams(fullUrl)).toBe('https://example.test/admin');

    const relativeUrl = '/admin?exchangeToken=EX_123&intranetToken=IN_456';
    expect(stripAuthParams(relativeUrl)).toBe('/admin');

    expect(stripAuthParams('/user?accessToken=AC_789')).toBe('/user');
  });

  it('keeps other query parameters and URL hashes intact', () => {
    const fullUrl = 'https://example.test/admin?exchangeToken=EX_123&tab=reports&filter=active#section';
    expect(stripAuthParams(fullUrl)).toBe('https://example.test/admin?tab=reports&filter=active#section');

    const relativeUrl = '/user?keep=yes&intranetToken=IN_456&page=2#profile';
    expect(stripAuthParams(relativeUrl)).toBe('/user?keep=yes&page=2#profile');
  });

  it('is a no-op when no auth tokens are present', () => {
    const urlNoTokens = 'https://example.test/admin?tab=overview';
    expect(stripAuthParams(urlNoTokens)).toBe(urlNoTokens);

    expect(stripAuthParams('/admin')).toBe('/admin');
    expect(stripAuthParams('/user?id=10')).toBe('/user?id=10');
    expect(stripAuthParams('')).toBe('');
  });
});
