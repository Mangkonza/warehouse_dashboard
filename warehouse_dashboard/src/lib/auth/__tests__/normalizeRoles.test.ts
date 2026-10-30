import { describe, expect, it } from 'vitest';
import { canAccess, normalizeRoles } from '../normalizeRoles';

describe('normalizeRoles', () => {
  it('accepts a string array', () => {
    expect(normalizeRoles(['admin', 'user'])).toEqual(['admin', 'user']);
  });

  it('accepts objects with each supported key, in priority order', () => {
    expect(
      normalizeRoles([{ role: 'a' }, { roleName: 'b' }, { name: 'c' }, { role_name: 'd' }, { roleCode: 'e' }]),
    ).toEqual(['a', 'b', 'c', 'd', 'e']);
    expect(normalizeRoles([{ role: 'first', name: 'second' }])).toEqual(['first']);
  });

  it('reads outer object roles → data → role in order', () => {
    expect(normalizeRoles({ roles: ['admin'] })).toEqual(['admin']);
    expect(normalizeRoles({ data: [{ roleName: 'user' }] })).toEqual(['user']);
    expect(normalizeRoles({ role: 'admin' })).toEqual(['admin']);
    expect(normalizeRoles({ roles: ['x'], data: ['y'], role: 'z' })).toEqual(['x']);
  });

  it('handles nested wrappers like { data: { roles: [...] } }', () => {
    expect(normalizeRoles({ data: { roles: ['admin'] } })).toEqual(['admin']);
    expect(normalizeRoles({ data: { roleName: 'user' } })).toEqual(['user']);
  });

  it('does not treat a bare root string as a role', () => {
    expect(normalizeRoles('admin')).toEqual([]);
    expect(normalizeRoles(null)).toEqual([]);
    expect(normalizeRoles(42)).toEqual([]);
    expect(normalizeRoles(undefined)).toEqual([]);
  });

  it('preserves case and whitespace exactly', () => {
    expect(normalizeRoles(['Admin', 'ADMIN', ' admin'])).toEqual(['Admin', 'ADMIN', ' admin']);
  });

  it('drops empty and non-string entries, de-duplicates', () => {
    expect(normalizeRoles(['', 'user', 5, null, {}, { role: '' }, 'user'])).toEqual(['user']);
  });
});

describe('canAccess', () => {
  it('admin area requires exact "admin"', () => {
    expect(canAccess('admin', ['admin'])).toBe(true);
    expect(canAccess('admin', ['Admin'])).toBe(false);
    expect(canAccess('admin', ['user'])).toBe(false);
  });
  it('user area accepts "user" or "admin"', () => {
    expect(canAccess('user', ['user'])).toBe(true);
    expect(canAccess('user', ['admin'])).toBe(true);
    expect(canAccess('user', ['USER'])).toBe(false);
  });
  it('empty roles are denied everywhere', () => {
    expect(canAccess('admin', [])).toBe(false);
    expect(canAccess('user', [])).toBe(false);
  });
});
